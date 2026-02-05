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
        // Pull new items from the openAI thread
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

        if (!response.ok) {
            return {
                error: data?.error?.message || 'OpenAI thread items fetch failed',
                raw: data, status: response.status
            }
        }

        const items = Array.isArray(data?.data) ? data.data : [];

        // Transform items into prompt/response pairs
        const events = [];
        let lastSeen = afterItemId || null;

        for (const item of items) {
            lastSeen = item.id || lastSeen;

            if (item.type === 'user_message' || item.type === 'chatkit.user_message') {
                events.push({
                    kind: 'prompt',
                    item_id: item.id,
                    text: extractTextFromContent(item.content),
                    created_at: item.created_at || null,
                });
            } else if (item.type === 'assistant_message' || item.type === 'chatkit.assistant_message') {
                events.push({
                    kind: 'response',
                    item_id: item.id,
                    text: extractTextFromContent(item.content),
                    created_at: item.created_at || null,
                });
            } else if (item.type === 'task_group' || item.type === 'chatkit.task_group') {
                events.push({
                    kind: 'thought',
                    item_id: item.id,
                    text: extractSummaryFromContent(item.tasks),
                    created_at: item.created_at || null,
                });
            }
            // Ignore other item types
        }

        // Ship to Anosys
        const anosysPayload = {
            event_type: 'chatkit chat',
            timestamp_ms: Date.now(),
            openai: { workflow_id: WORKFLOW_ID || null },
            chatkit: { session_id: correlationIds.appSessionId || null, thread_id: threadId },
            messages: events,
            duration: metrics?.duration || null,
            time_to_first_token: metrics?.timeToFirstToken || null,
        };

        setCorrelationIds(prev => ({
            ...prev,
            afterItemId: lastSeen ?? prev.afterItemId,
        }));
        return anosysPayload;
    };

    //--== ChatKit Callbacks ==--
    const onLog = (event) => {
        const { name, data } = event || {};

        //Debug code
        // console.log('[ChatKit onLog]', Date.now(), name, data);

        if (name === 'composer.submit') {
            metricsRef.current.composerSubmitTimestamp = Date.now();
            // Reset other metrics for the new turn
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
        console.log('[ChatKit] LLM response started', Date.now());

        if (!metricsRef.current.responseStartTimestamp) {
            metricsRef.current.responseStartTimestamp = Date.now();
        }
    };

    const onResponseEnd = async () => {
        console.log('[ChatKit] LLM response ended', Date.now());

        const responseEndTimestamp = Date.now();
        const { composerSubmitTimestamp, responseStartTimestamp } = metricsRef.current;

        let metrics = {};

        if (composerSubmitTimestamp && responseStartTimestamp) {
            metrics = {
                timeToFirstToken: responseStartTimestamp - composerSubmitTimestamp,
                duration: responseEndTimestamp - responseStartTimestamp,
            };
            console.log('[Metrics]', metrics);
        }

        // Update AnoSys with the latest messages from the thread
        if (correlationIds.threadId) {
            let messages = await getMessagesFromThread(correlationIds.threadId, metrics, correlationIds.afterItemId);
            sendToAnosys(mapChatkitLogsToAnosys(messages))
        }
        else {
            console.error("[ERROR] Missing threadId");
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

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [anoSysIngestionUrl]);

    return {
        correlationIds,
        setCorrelationIds,
        onLog,
        onResponseStart,
        onResponseEnd,
        chatKitHook
    };
}
