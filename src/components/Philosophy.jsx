import React from 'react';
import { Compass, Shield, Cpu, Landmark, Quote, ArrowRight } from 'lucide-react';

const Philosophy = ({ onOpenChat }) => {
    const pillars = [
        {
            icon: <Compass size={28} />,
            title: 'Architectural Purity',
            tag: 'Aesthetic Vision',
            description: 'Every estate in our collection transcends shelter. We partner exclusively with Pritzker-caliber architects and visionary builders who honor contextual topography, monolithic natural stones, and sculptural space.'
        },
        {
            icon: <Shield size={28} />,
            title: 'Absolute Discretion',
            tag: 'Sovereign Privacy',
            description: 'The world’s most significant transactions occur in complete silence. We operate a strictly vetted private-treaty registry, encrypted digital escrow protocols, and anonymous client representation.'
        },
        {
            icon: <Cpu size={28} />,
            title: 'AnoSys Agentic Intelligence',
            tag: 'Cognitive Concierge',
            description: 'Through our pioneering partnership with AnoSys.ai, clients benefit from real-time agentic orchestration—offering instant architectural appraisals, micro-climate insights, and intelligent viewing coordination.'
        },
        {
            icon: <Landmark size={28} />,
            title: 'Generational Legacy',
            tag: 'Enduring Asset',
            description: 'Trophy real estate is an heirloom. Our properties integrate autonomous renewable microgrids, biophilic master planning, and materials tested to endure for centuries with compounding prestige.'
        }
    ];

    return (
        <section id="about" style={{
            padding: '7rem 0',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Ambient gold glow background */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '350px',
                background: 'radial-gradient(circle, rgba(203, 163, 88, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            <div className="container">
                {/* Header */}
                <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4.5rem' }}>
                    <span className="badge-gold" style={{ marginBottom: '1rem' }}>
                        Brand Philosophy
                    </span>
                    <h2 style={{ fontSize: '3.4rem', marginBottom: '1.25rem', lineHeight: '1.15' }}>
                        The Apogee Standard
                    </h2>
                    <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: '1.7' }}>
                        We do not merely transact extraordinary real estate; we curate living works of art. Our mission is to bridge the boundary between imagination and architectural reality.
                    </p>
                </div>

                {/* 4 Pillars Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem',
                    marginBottom: '4.5rem'
                }}>
                    {pillars.map((pillar, idx) => (
                        <div 
                            key={idx} 
                            className="glass-card"
                            style={{
                                padding: '2.5rem 2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '12px',
                                background: 'rgba(203, 163, 88, 0.1)',
                                border: '1px solid rgba(203, 163, 88, 0.25)',
                                color: 'var(--accent-gold)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                {pillar.icon}
                            </div>

                            <span style={{
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: 'var(--accent-gold-light)',
                                fontWeight: '600',
                                marginBottom: '0.4rem'
                            }}>
                                {pillar.tag}
                            </span>

                            <h3 style={{ fontSize: '1.45rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                                {pillar.title}
                            </h3>

                            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.65' }}>
                                {pillar.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Editorial Quote & AnoSys AI Banner */}
                <div className="glass" style={{
                    borderRadius: '16px',
                    padding: '3rem 3.5rem',
                    border: '1px solid var(--border-gold)',
                    background: 'linear-gradient(135deg, rgba(17, 20, 29, 0.9) 0%, rgba(10, 12, 17, 0.95) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative'
                }}>
                    <Quote size={40} style={{ color: 'var(--accent-gold)', opacity: 0.5, marginBottom: '1rem' }} />
                    <blockquote style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.6rem',
                        fontStyle: 'italic',
                        color: '#f1f5f9',
                        maxWidth: '820px',
                        marginBottom: '1.5rem',
                        lineHeight: '1.4'
                    }}>
                        "Architecture is frozen music. At Apogee, the harmony between landscape, modern engineering, and intuitive AI creates sanctuaries unlike anything else on Earth."
                    </blockquote>
                    <cite style={{ fontSize: '0.9rem', color: 'var(--accent-gold-light)', letterSpacing: '0.08em', textTransform: 'uppercase', fontStyle: 'normal', fontWeight: '600' }}>
                        — Architectural Gazette • International Review
                    </cite>

                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button 
                            onClick={() => onOpenChat("Tell me more about the Apogee Standard and how AnoSys AI assists private real estate buyers.")}
                            className="btn-primary"
                        >
                            <span>Explore With AI Concierge</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Philosophy;
