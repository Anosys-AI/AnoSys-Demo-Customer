
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

    // --- Core event metadata ---
    if (input.timestamp_ms != null) {
        out.timestamp = String(input.timestamp_ms);
        out.user_timestamp = Number(input.timestamp_ms);
    }

    out.event_type = input.event_type ?? "chatkit chat";
    out.event_source_name = "chatkit";

    if (input.openai?.workflow_id) {
        out.event_id = input.openai.workflow_id;
    }

    let cvsIndex = 3;
    let cvnIndex = 3;

    function setCVS(value) {
        if (value == null) return;
        out[`cvs${cvsIndex++}`] = String(value);
    }

    function setCVN(value) {
        if (value == null) return;
        out[`cvn${cvnIndex++}`] = Number(value);
    }

    // --- Session / user identifiers ---
    setCVS(input.chatkit?.session_id); //in theory will be always on cvs3 and used to link with tracker records.
    setCVS(input.chatkit?.thread_id);

    //other posible fields
    // setCVS(input.app?.user_id);
    // setCVS(input.app?.company_id);

    // --- Timing / performance ---
    out.cvn1 = Number(input.duration); //always hold ducation on first number
    out.cvn2 = Number(input.time_to_first_token); //always hold time to first token on second number

    // --- Messages ---
    if (Array.isArray(input.messages)) {
        input.messages.forEach((msg) => {
            if (msg.kind === 'prompt') {
                out.cvs1 = String(msg.text); //always hold prompt on first cvs
            } else if (msg.kind === 'response') {
                out.cvs2 = String(msg.text); //always hold response on second cvs
            }
            setCVS(msg.kind);
            setCVS(msg.item_id);
            setCVS(String(msg.created_at));//It is a number but we are storing it as string for grouping purposes
            setCVS(msg.text);
        });
    }

    return out;
}
