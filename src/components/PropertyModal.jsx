import React, { useEffect } from 'react';
import { X, MapPin, Bed, Bath, Square, Calendar, Sparkles, ShieldCheck, Heart, ArrowRight, MessageSquareQuote } from 'lucide-react';

const PropertyModal = ({ property, onClose, isFavorite, onToggleFavorite, onOpenChat, onBookViewing }) => {
    useEffect(() => {
        if (!property) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [property, onClose]);

    if (!property) return null;

    const pricePerSqFt = Math.round(property.price / property.area).toLocaleString();

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(5, 6, 9, 0.82)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem'
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div 
                className="glass"
                style={{
                    backgroundColor: 'rgba(13, 16, 23, 0.94)',
                    border: '1px solid rgba(203, 163, 88, 0.3)',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '960px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(203, 163, 88, 0.15)',
                    position: 'relative',
                    animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                {/* Header Image Section */}
                <div style={{ position: 'relative', height: '380px', overflow: 'hidden' }}>
                    <img 
                        src={property.image} 
                        alt={property.title} 
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(13, 16, 23, 1) 0%, rgba(13, 16, 23, 0.3) 50%, rgba(0,0,0,0.4) 100%)'
                    }} />

                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1.25rem',
                            right: '1.25rem',
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(7, 9, 13, 0.75)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>

                    {/* Badges on Image */}
                    <div style={{
                        position: 'absolute',
                        top: '1.25rem',
                        left: '1.5rem',
                        display: 'flex',
                        gap: '0.6rem'
                    }}>
                        <span className="badge-gold">
                            <Sparkles size={12} />
                            {property.badge}
                        </span>
                        <span style={{
                            padding: '0.35rem 0.85rem',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(6px)',
                            borderRadius: '30px',
                            fontSize: '0.75rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            {property.architecturalStyle}
                        </span>
                    </div>

                    {/* Price & Title overlay */}
                    <div style={{
                        position: 'absolute',
                        bottom: '1.5rem',
                        left: '2rem',
                        right: '2rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold-light)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>
                                <MapPin size={16} />
                                <span>{property.location}</span>
                            </div>
                            <h2 style={{ fontSize: '2.4rem', lineHeight: '1.15', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                                {property.title}
                            </h2>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Acquisition Price</div>
                            <div className="gold-gradient-text font-cinzel" style={{ fontSize: '2.2rem', fontWeight: '700' }}>
                                {property.priceFormatted}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div style={{ padding: '2rem 2.5rem' }}>
                    {/* Key Metrics Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: '1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '10px',
                        padding: '1.25rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <Bed size={20} style={{ color: 'var(--accent-gold)', marginBottom: '0.3rem' }} />
                            <div style={{ fontSize: '1.15rem', fontWeight: '700' }}>{property.beds} Suites</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Bedrooms</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Bath size={20} style={{ color: 'var(--accent-gold)', marginBottom: '0.3rem' }} />
                            <div style={{ fontSize: '1.15rem', fontWeight: '700' }}>{property.baths} Baths</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Bathrooms</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Square size={20} style={{ color: 'var(--accent-gold)', marginBottom: '0.3rem' }} />
                            <div style={{ fontSize: '1.15rem', fontWeight: '700' }}>{property.area.toLocaleString()} sqft</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Interior</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <MapPin size={20} style={{ color: 'var(--accent-gold)', marginBottom: '0.3rem' }} />
                            <div style={{ fontSize: '1.15rem', fontWeight: '700' }}>{property.lotSize}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Private Grounds</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Calendar size={20} style={{ color: 'var(--accent-gold)', marginBottom: '0.3rem' }} />
                            <div style={{ fontSize: '1.15rem', fontWeight: '700' }}>{property.yearBuilt}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Completed</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <ShieldCheck size={20} style={{ color: 'var(--accent-gold)', marginBottom: '0.3rem' }} />
                            <div style={{ fontSize: '1.15rem', fontWeight: '700' }}>${pricePerSqFt}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Per Sq. Ft.</div>
                        </div>
                    </div>

                    {/* Tagline & Narrative */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: 'var(--accent-gold-light)' }}>
                            Architectural Vision
                        </h3>
                        <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: '1.75', marginBottom: '1rem' }}>
                            {property.description}
                        </p>
                    </div>

                    {/* Amenities List */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                            Curated Estate Features & Amenities
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                            gap: '0.85rem'
                        }}>
                            {property.amenities.map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.65rem 0.9rem',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '6px',
                                    fontSize: '0.9rem',
                                    color: '#e2e8f0'
                                }}>
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--accent-gold)'
                                    }} />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                        <button
                            onClick={() => onToggleFavorite(property.id)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.85rem 1.4rem',
                                background: isFavorite ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                border: isFavorite ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                                color: isFavorite ? '#f87171' : 'var(--text-muted)',
                                borderRadius: '4px',
                                fontSize: '0.88rem',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Heart size={18} fill={isFavorite ? '#f87171' : 'none'} />
                            <span>{isFavorite ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                        </button>

                        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => {
                                    onClose();
                                    onOpenChat(property.aiPrompt);
                                }}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.55rem',
                                    padding: '0.85rem 1.5rem',
                                    background: 'rgba(203, 163, 88, 0.1)',
                                    border: '1px solid rgba(203, 163, 88, 0.35)',
                                    color: 'var(--accent-gold-light)',
                                    borderRadius: '4px',
                                    fontSize: '0.88rem',
                                    fontWeight: '600'
                                }}
                            >
                                <MessageSquareQuote size={18} />
                                <span>Ask AI Concierge</span>
                            </button>

                            <button
                                onClick={() => {
                                    onClose();
                                    onBookViewing(property);
                                }}
                                className="btn-primary"
                            >
                                <span>Schedule VIP Viewing</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyModal;
