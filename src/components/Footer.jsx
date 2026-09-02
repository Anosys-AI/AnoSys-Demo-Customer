import React, { useState } from 'react';
import { Home, Facebook, Twitter, Instagram, Mail, Globe, ArrowRight, Check } from 'lucide-react';

const Footer = ({ onShowToast }) => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [currency, setCurrency] = useState('USD');

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!email) return;
        setSubscribed(true);
        if (onShowToast) {
            onShowToast('Subscribed to the Apogee Private Journal.');
        }
        setTimeout(() => {
            setEmail('');
            setSubscribed(false);
        }, 4000);
    };

    return (
        <footer style={{
            backgroundColor: '#050608',
            padding: '5.5rem 0 2.5rem',
            borderTop: '1px solid var(--border-gold)',
            position: 'relative'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '3.5rem',
                    marginBottom: '4.5rem'
                }}>
                    {/* Brand Column */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <div className="logo" style={{
                            fontSize: '1.35rem',
                            fontWeight: '700',
                            color: 'var(--accent-gold)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            marginBottom: '1.25rem'
                        }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                background: 'rgba(203, 163, 88, 0.12)',
                                border: '1px solid rgba(203, 163, 88, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--accent-gold-light)'
                            }}>
                                <Home size={20} />
                            </div>
                            <span className="font-cinzel gold-gradient-text">APOGEE RESIDENCES</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                            The world authority in private treaty and trophy architectural estates, delivering bespoke discretion and agentic AI advisory.
                        </p>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '0.8rem',
                            color: 'var(--accent-gold-light)'
                        }}>
                            <span>Powered by</span>
                            <strong>AnoSys.ai</strong>
                        </div>
                    </div>

                    {/* Properties Column */}
                    <div>
                        <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                            Portfolio
                        </h4>
                        <ul style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.92rem' }}>
                            <li><a href="#houses" style={{ color: 'inherit' }}>Coastal & Waterfront</a></li>
                            <li><a href="#houses" style={{ color: 'inherit' }}>Alpine & Mountain</a></li>
                            <li><a href="#houses" style={{ color: 'inherit' }}>Modern Architectural</a></li>
                            <li><a href="#houses" style={{ color: 'inherit' }}>Private Islands & Compounds</a></li>
                        </ul>
                    </div>

                    {/* Private Client Services */}
                    <div>
                        <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                            Client Office
                        </h4>
                        <ul style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.92rem' }}>
                            <li><a href="#about" style={{ color: 'inherit' }}>The Apogee Standard</a></li>
                            <li><a href="#contact" style={{ color: 'inherit' }}>Confidential Protocol</a></li>
                            <li><a href="#contact" style={{ color: 'inherit' }}>Private Aviation Coordination</a></li>
                            <li><a href="https://anosys.ai" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>AnoSys Observability</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                            Private Journal
                        </h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                            Quarterly private-treaty dossiers, architectural monograph debuts, and market intelligence.
                        </p>
                        <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input 
                                    type="email" 
                                    required
                                    placeholder="Enter confidential email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem 1rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-main)',
                                        borderRadius: '4px',
                                        fontSize: '0.86rem',
                                        outline: 'none'
                                    }} 
                                />
                                <button 
                                    type="submit"
                                    className="btn-primary"
                                    style={{
                                        padding: '0.75rem 1.25rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {subscribed ? <Check size={16} /> : <ArrowRight size={16} />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'var(--text-dim)',
                    fontSize: '0.86rem',
                    gap: '1.25rem'
                }}>
                    <p>© 2026 Apogee Residences. All rights reserved. Member of the AnoSys.ai Global Network.</p>
                    
                    {/* Currency Switcher Preview */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe size={15} style={{ color: 'var(--accent-gold)' }} />
                        <span style={{ fontSize: '0.8rem' }}>Display Currency:</span>
                        <select 
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--accent-gold-light)',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="USD" style={{ background: '#0e1017' }}>USD ($)</option>
                            <option value="EUR" style={{ background: '#0e1017' }}>EUR (€)</option>
                            <option value="GBP" style={{ background: '#0e1017' }}>GBP (£)</option>
                            <option value="CHF" style={{ background: '#0e1017' }}>CHF (Fr.)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1.25rem' }}>
                        <a href="#hero" aria-label="Facebook" style={{ color: 'var(--text-muted)' }}><Facebook size={18} /></a>
                        <a href="#hero" aria-label="Twitter" style={{ color: 'var(--text-muted)' }}><Twitter size={18} /></a>
                        <a href="#hero" aria-label="Instagram" style={{ color: 'var(--text-muted)' }}><Instagram size={18} /></a>
                        <a href="mailto:concierge@apogee.residences" aria-label="Email" style={{ color: 'var(--text-muted)' }}><Mail size={18} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
