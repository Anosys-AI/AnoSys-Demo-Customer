import React, { useState, useEffect } from 'react';
import { Home, Search, Heart, Menu, X, Sparkles, MessageCircle } from 'lucide-react';

const Header = ({ favoritesCount, onToggleFavoritesFilter, onOpenChat, onFocusSearch }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 9000,
            padding: isScrolled ? '1rem 0' : '1.6rem 0',
            backgroundColor: isScrolled ? 'rgba(7, 9, 13, 0.9)' : 'rgba(7, 9, 13, 0.4)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: isScrolled ? '1px solid rgba(203, 163, 88, 0.25)' : '1px solid rgba(255, 255, 255, 0.06)',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.5)' : 'none'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {/* Logo */}
                <a 
                    href="#hero" 
                    onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}
                    style={{
                        fontSize: '1.35rem',
                        fontWeight: '700',
                        color: 'var(--accent-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        letterSpacing: '0.12em'
                    }}
                    className="font-cinzel"
                >
                    <div style={{
                        width: '38px',
                        height: '38px',
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
                    <span className="gold-gradient-text">APOGEE RESIDENCES</span>
                </a>

                {/* Desktop Navigation */}
                <nav style={{ display: 'none' }} className="desktop-nav">
                    <ul style={{
                        display: 'flex',
                        gap: '2.5rem',
                        fontSize: '0.88rem',
                        fontWeight: '600',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                    }}>
                        <li>
                            <a 
                                href="#hero" 
                                onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}
                                style={{ color: 'var(--text-main)', opacity: 0.9 }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-gold)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                            >
                                Collection
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#houses" 
                                onClick={(e) => { e.preventDefault(); scrollTo('houses'); }}
                                style={{ color: 'var(--text-main)', opacity: 0.9 }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-gold)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                            >
                                Properties
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#about" 
                                onClick={(e) => { e.preventDefault(); scrollTo('about'); }}
                                style={{ color: 'var(--text-main)', opacity: 0.9 }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-gold)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                            >
                                Philosophy
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#contact" 
                                onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}
                                style={{ color: 'var(--text-main)', opacity: 0.9 }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-gold)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                            >
                                Private Viewing
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Actions & Mobile toggle */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center'
                }}>
                    {/* Search shortcut button */}
                    <button
                        onClick={onFocusSearch}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent-gold)';
                            e.currentTarget.style.color = 'var(--accent-gold)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.color = 'var(--text-main)';
                        }}
                        aria-label="Search properties"
                        title="Search properties"
                    >
                        <Search size={18} />
                    </button>

                    {/* Wishlist / Favorites button */}
                    <button
                        onClick={onToggleFavoritesFilter}
                        style={{
                            position: 'relative',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: favoritesCount > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                            border: favoritesCount > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                            color: favoritesCount > 0 ? '#ef4444' : 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                        aria-label="View saved favorites"
                        title="Saved Favorites"
                    >
                        <Heart size={18} fill={favoritesCount > 0 ? '#ef4444' : 'none'} />
                        {favoritesCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-3px',
                                right: '-3px',
                                backgroundColor: '#ef4444',
                                color: '#ffffff',
                                fontSize: '0.65rem',
                                fontWeight: '700',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid var(--bg-base)'
                            }}>
                                {favoritesCount}
                            </span>
                        )}
                    </button>

                    {/* AI Concierge button (Desktop) */}
                    <button
                        onClick={() => onOpenChat()}
                        className="btn-secondary vip-concierge-btn"
                        style={{
                            padding: '0.55rem 1.15rem',
                            fontSize: '0.8rem',
                            gap: '0.45rem',
                            display: 'none'
                        }}
                    >
                        <span style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: '#22c55e',
                            boxShadow: '0 0 8px #22c55e'
                        }} />
                        <Sparkles size={14} style={{ color: 'var(--accent-gold)' }} />
                        <span>AI Concierge</span>
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="mobile-toggle-btn"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div style={{
                    backgroundColor: 'rgba(10, 12, 18, 0.98)',
                    borderBottom: '1px solid var(--border-gold)',
                    padding: '2rem 1.5rem',
                    animation: 'fadeIn 0.2s ease',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
                }}>
                    <ul style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        letterSpacing: '0.05em'
                    }}>
                        <li>
                            <a 
                                href="#hero" 
                                onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}
                                style={{ display: 'block', padding: '0.5rem 0', color: 'var(--text-main)' }}
                            >
                                Collection
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#houses" 
                                onClick={(e) => { e.preventDefault(); scrollTo('houses'); }}
                                style={{ display: 'block', padding: '0.5rem 0', color: 'var(--text-main)' }}
                            >
                                Properties ({favoritesCount > 0 ? `${favoritesCount} Saved` : 'All'})
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#about" 
                                onClick={(e) => { e.preventDefault(); scrollTo('about'); }}
                                style={{ display: 'block', padding: '0.5rem 0', color: 'var(--text-main)' }}
                            >
                                Philosophy & AnoSys AI
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#contact" 
                                onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}
                                style={{ display: 'block', padding: '0.5rem 0', color: 'var(--text-main)' }}
                            >
                                Schedule Private Viewing
                            </a>
                        </li>
                        <li style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    onOpenChat();
                                }}
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                <MessageCircle size={18} />
                                <span>Open AnoSys AI Assistant</span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            {/* In-component CSS for responsive nav visibility */}
            <style>{`
                @media (min-width: 900px) {
                    .desktop-nav {
                        display: block !important;
                    }
                    .vip-concierge-btn {
                        display: inline-flex !important;
                    }
                    .mobile-toggle-btn {
                        display: none !important;
                    }
                }
            `}</style>
        </header>
    );
};

export default Header;
