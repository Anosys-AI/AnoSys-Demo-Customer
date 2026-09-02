import React from 'react';
import { MapPin, Bed, Bath, Square, Heart, ArrowUpRight, Sparkles, MessageSquareQuote } from 'lucide-react';

const HouseCard = ({ property, isFavorite, onToggleFavorite, onSelectProperty, onOpenChat }) => {
    return (
        <div 
            className="glass-card" 
            style={{
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                position: 'relative'
            }}
            onClick={() => onSelectProperty(property)}
        >
            {/* Image Container */}
            <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                <img 
                    src={property.image} 
                    alt={property.title} 
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                />
                
                {/* Gradient scrim for text readability */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(14, 16, 23, 0.85) 0%, rgba(0,0,0,0) 45%)',
                    pointerEvents: 'none'
                }} />

                {/* Badge top left */}
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 2
                }}>
                    <span className="badge-gold">
                        <Sparkles size={11} />
                        {property.badge}
                    </span>
                </div>

                {/* Favorite button top right */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(property.id);
                    }}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        zIndex: 2,
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(9, 11, 16, 0.7)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: isFavorite ? '#ef4444' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                    }}
                    aria-label="Save to favorites"
                >
                    <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
                </button>

                {/* Price tag bottom right */}
                <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    padding: '0.4rem 0.9rem',
                    backgroundColor: 'rgba(8, 10, 14, 0.85)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '4px',
                    color: 'var(--accent-gold-light)',
                    fontWeight: '700',
                    fontSize: '1.15rem',
                    fontFamily: 'var(--font-cinzel)',
                    zIndex: 2
                }}>
                    {property.priceFormatted}
                </div>
            </div>

            {/* Content info */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'var(--accent-gold)',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    marginBottom: '0.4rem'
                }}>
                    <MapPin size={14} />
                    <span>{property.location}</span>
                </div>

                <h3 style={{ 
                    fontSize: '1.45rem', 
                    marginBottom: '0.5rem',
                    lineHeight: '1.25',
                    color: 'var(--text-main)' 
                }}>
                    {property.title}
                </h3>

                <p style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1.5rem',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {property.tagline}
                </p>

                {/* Specs row */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '1.25rem',
                    marginTop: 'auto',
                    marginBottom: '1.25rem'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <Bed size={17} style={{ color: 'var(--accent-gold)', marginBottom: '0.2rem' }} />
                        <p style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)' }}>{property.beds} Beds</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Bath size={17} style={{ color: 'var(--accent-gold)', marginBottom: '0.2rem' }} />
                        <p style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)' }}>{property.baths} Baths</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Square size={17} style={{ color: 'var(--accent-gold)', marginBottom: '0.2rem' }} />
                        <p style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)' }}>{property.area.toLocaleString()} sqft</p>
                    </div>
                </div>

                {/* Card Action Buttons */}
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectProperty(property);
                        }}
                        style={{
                            flex: 1,
                            padding: '0.65rem 1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-main)',
                            borderRadius: '4px',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                            letterSpacing: '0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent-gold)';
                            e.currentTarget.style.color = 'var(--accent-gold-light)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                            e.currentTarget.style.color = 'var(--text-main)';
                        }}
                    >
                        <span>View Details</span>
                        <ArrowUpRight size={14} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenChat(property.aiPrompt);
                        }}
                        style={{
                            padding: '0.65rem 0.9rem',
                            backgroundColor: 'rgba(203, 163, 88, 0.1)',
                            border: '1px solid rgba(203, 163, 88, 0.3)',
                            color: 'var(--accent-gold-light)',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                        aria-label="Inquire with AI Concierge"
                        title="Inquire with AI Concierge"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(203, 163, 88, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(203, 163, 88, 0.1)';
                        }}
                    >
                        <MessageSquareQuote size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HouseCard;
