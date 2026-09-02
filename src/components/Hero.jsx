import React from 'react';
import { Search, MapPin, Sparkles, Compass, ShieldCheck, Trophy, Globe, ArrowDown } from 'lucide-react';

const Hero = ({ onSearch, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery }) => {
    const handleQuickSearch = (e) => {
        e.preventDefault();
        const housesSection = document.getElementById('houses');
        if (housesSection) {
            housesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="hero" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            padding: '8rem 0 4rem',
            overflow: 'hidden'
        }}>
            {/* Background Image with layered gradient overlays */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: -1
            }}>
                <img
                    src="/hero-house.jpg"
                    alt="Apogee Residences Luxury Estate"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(0.48) contrast(1.05)'
                    }}
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, rgba(7, 8, 11, 0.2) 0%, rgba(7, 8, 11, 0.85) 75%, rgba(7, 8, 11, 1) 100%)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '180px',
                    background: 'linear-gradient(to top, var(--bg-base) 0%, transparent 100%)'
                }} />
            </div>

            <div className="container" style={{
                textAlign: 'center',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* Prestige Badge */}
                <div className="badge-gold fade-in" style={{ marginBottom: '1.75rem' }}>
                    <Sparkles size={13} />
                    <span>Private Treaty & Ultra-Prime Residences</span>
                </div>

                {/* Hero Title */}
                <h1 className="fade-in" style={{
                    fontSize: 'clamp(3.2rem, 7vw, 5.8rem)',
                    marginBottom: '1.25rem',
                    lineHeight: '1.08',
                    letterSpacing: '-0.02em',
                    textShadow: '0 4px 20px rgba(0,0,0,0.8)'
                }}>
                    Elevated Living <br />
                    <span className="gold-gradient-text font-cinzel">Redefined.</span>
                </h1>

                {/* Subtitle */}
                <p className="fade-in" style={{
                    fontSize: 'clamp(1.05rem, 2vw, 1.28rem)',
                    color: '#e2e8f0',
                    maxWidth: '700px',
                    margin: '0 auto 2.5rem',
                    lineHeight: '1.65',
                    textShadow: '0 2px 10px rgba(0,0,0,0.6)'
                }}>
                    A curated anthology of architectural masterpieces where modern legacy meets sovereign sanctuary. Enhanced by 24/7 AnoSys agentic intelligence.
                </p>

                {/* Quick Interactive Search Bar */}
                <form 
                    onSubmit={handleQuickSearch}
                    className="glass fade-in"
                    style={{
                        padding: '0.85rem 1.25rem',
                        borderRadius: '50px',
                        border: '1px solid rgba(203, 163, 88, 0.4)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 25px rgba(203, 163, 88, 0.15)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '0.75rem',
                        maxWidth: '820px',
                        width: '100%',
                        marginBottom: '3rem',
                        background: 'rgba(10, 12, 17, 0.85)'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flex: '1 1 200px',
                        padding: '0.4rem 0.8rem',
                        borderRight: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <MapPin size={18} style={{ color: 'var(--accent-gold)' }} />
                        <input
                            type="text"
                            placeholder="Location, enclave, style..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: '#ffffff',
                                fontSize: '0.9rem',
                                width: '100%'
                            }}
                        />
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flex: '1 1 180px',
                        padding: '0.4rem 0.8rem'
                    }}>
                        <Compass size={18} style={{ color: 'var(--accent-gold)' }} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: '#ffffff',
                                fontSize: '0.9rem',
                                width: '100%',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="all" style={{ background: '#0e1017' }}>All Architectural Styles</option>
                            <option value="coastal" style={{ background: '#0e1017' }}>Coastal & Waterfront</option>
                            <option value="alpine" style={{ background: '#0e1017' }}>Alpine & Mountain</option>
                            <option value="modern" style={{ background: '#0e1017' }}>Modern Architectural</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{
                            borderRadius: '30px',
                            padding: '0.75rem 1.8rem',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <Search size={16} />
                        <span>Explore Estates</span>
                    </button>
                </form>

                {/* Portfolio Stats Strip */}
                <div className="glass fade-in" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '1.5rem',
                    width: '100%',
                    maxWidth: '1050px',
                    borderRadius: '12px',
                    padding: '1.75rem 2rem',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(12, 15, 22, 0.75)'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div className="gold-gradient-text font-cinzel" style={{ fontSize: '2rem', fontWeight: '700' }}>
                            $4.8B+
                        </div>
                        <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                            Portfolio Advisory
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div className="gold-gradient-text font-cinzel" style={{ fontSize: '2rem', fontWeight: '700' }}>
                            6
                        </div>
                        <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                            Trophy Masterpieces
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div className="gold-gradient-text font-cinzel" style={{ fontSize: '2rem', fontWeight: '700' }}>
                            14
                        </div>
                        <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                            Global Enclaves
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div className="gold-gradient-text font-cinzel" style={{ fontSize: '2rem', fontWeight: '700' }}>
                            100%
                        </div>
                        <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                            Discretion Score
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
