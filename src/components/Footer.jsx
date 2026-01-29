import React from 'react';
import { Home, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--secondary)',
            padding: '5rem 0 2rem',
            borderTop: '1px solid var(--glass-border)'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '4rem',
                    marginBottom: '4rem'
                }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <div className="logo" style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: 'var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <Home size={28} />
                            <span>LUMINA LUX</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '300px' }}>
                            Lumina Lux Estates is the global authority in luxury real estate, providing unparalleled service to the world's most discerning clients.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text)', marginBottom: '1.5rem' }}>Properties</h4>
                        <ul style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li><a href="#">Villas</a></li>
                            <li><a href="#">Penthouses</a></li>
                            <li><a href="#">Private Islands</a></li>
                            <li><a href="#">Manors</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text)', marginBottom: '1.5rem' }}>Company</h4>
                        <ul style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Our Team</a></li>
                            <li><a href="#">Journal</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text)', marginBottom: '1.5rem' }}>Newsletter</h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="email" placeholder="Email address" style={{
                                flex: 1,
                                padding: '0.75rem',
                                backgroundColor: 'var(--glass)',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--text)',
                                borderRadius: '2px'
                            }} />
                            <button style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'var(--accent)',
                                color: 'var(--primary)',
                                fontWeight: '700',
                                borderRadius: '2px'
                            }}>
                                JOIN
                            </button>
                        </div>
                    </div>
                </div>
                <div style={{
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--glass-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem'
                }}>
                    <p>© 2026 Lumina Lux Estates. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Facebook size={18} />
                        <Twitter size={18} />
                        <Instagram size={18} />
                        <Mail size={18} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
