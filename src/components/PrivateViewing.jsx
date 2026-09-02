import React, { useState } from 'react';
import { Plane, Eye, Lock, CheckCircle2, Calendar, User, Mail, Home } from 'lucide-react';

const PrivateViewing = ({ properties, preselectedProperty, onShowToast }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        propertyId: preselectedProperty ? preselectedProperty.id : (properties[0]?.id || ''),
        viewingMode: 'in-person',
        date: '',
        notes: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Sync preselected property if passed
    React.useEffect(() => {
        if (preselectedProperty) {
            setFormData(prev => ({ ...prev, propertyId: preselectedProperty.id }));
        }
    }, [preselectedProperty]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            onShowToast('Please provide your name and contact email.');
            return;
        }

        setIsSubmitted(true);
        const selected = properties.find(p => p.id === formData.propertyId);
        onShowToast(`VIP viewing request received for ${selected ? selected.title : 'selected estate'}. Our Private Client Office will contact you shortly.`);
        
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: '',
                email: '',
                propertyId: properties[0]?.id || '',
                viewingMode: 'in-person',
                date: '',
                notes: ''
            });
        }, 5000);
    };

    return (
        <section id="contact" style={{
            padding: '6rem 0',
            position: 'relative',
            backgroundColor: 'rgba(9, 11, 16, 0.6)'
        }}>
            <div className="container">
                <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 4rem' }}>
                    <span className="badge-gold" style={{ marginBottom: '1rem' }}>
                        Private Client Services
                    </span>
                    <h2 style={{ fontSize: '3.2rem', marginBottom: '1rem', lineHeight: '1.2' }}>
                        Schedule a Private Viewing
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                        Experience our architectural masterpieces firsthand. All engagements are handled under strict non-disclosure agreements with dedicated personal client managers.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '3rem',
                    alignItems: 'stretch'
                }}>
                    {/* VIP Protocol Perks Card */}
                    <div className="glass-card" style={{
                        padding: '3rem 2.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: '1px solid var(--border-gold)'
                    }}>
                        <div>
                            <span className="font-cinzel gold-gradient-text" style={{ fontSize: '1.1rem', fontWeight: '700', letterSpacing: '0.1em' }}>
                                THE CONFIDENTIAL PROTOCOL
                            </span>
                            <h3 style={{ fontSize: '2rem', margin: '0.85rem 0 1.5rem', lineHeight: '1.3' }}>
                                White-Glove Acquisitions & Viewings
                            </h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem', lineHeight: '1.65' }}>
                                For high-net-worth individuals, sovereign offices, and discerning investors requiring absolute privacy, our viewing concierge manages every logistical detail.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        background: 'rgba(203, 163, 88, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--accent-gold)',
                                        flexShrink: 0
                                    }}>
                                        <Plane size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Private Aviation & Chauffeur</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Coordinated direct transfers from international hubs or private airfields.</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        background: 'rgba(203, 163, 88, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--accent-gold)',
                                        flexShrink: 0
                                    }}>
                                        <Lock size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Encrypted Client Discretion</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Zero public recording, anonymous ownership structuring, and secure escrow pathways.</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        background: 'rgba(203, 163, 88, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--accent-gold)',
                                        flexShrink: 0
                                    }}>
                                        <Eye size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Architectural Archival Access</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Full CAD schematics, acoustic models, and micro-grid performance diagnostics.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '2.5rem',
                            paddingTop: '1.5rem',
                            borderTop: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontSize: '0.85rem',
                            color: 'var(--accent-gold-light)'
                        }}>
                            <CheckCircle2 size={16} />
                            <span>AnoSys.ai Certified Trusted Estate Exchange</span>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="glass-card" style={{ padding: '3rem 2.5rem' }}>
                        {isSubmitted ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem 1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: 'rgba(203, 163, 88, 0.15)',
                                    border: '1px solid var(--accent-gold)',
                                    color: 'var(--accent-gold)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem'
                                }}>
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Viewing Request Reserved</h3>
                                <p style={{ color: 'var(--text-muted)', maxWidth: '420px', lineHeight: '1.6' }}>
                                    Thank you, <strong>{formData.name}</strong>. A dedicated Private Client Partner will be in contact within 2 hours to confirm confidentiality protocols and itinerary.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                        Full Name
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Lord / Lady / Dr. / Mr. / Ms. ..."
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem 1rem 0.8rem 2.6rem',
                                                backgroundColor: 'rgba(7, 9, 13, 0.7)',
                                                border: '1px solid var(--border-subtle)',
                                                borderRadius: '6px',
                                                color: 'var(--text-main)',
                                                fontSize: '0.92rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                        Confidential Email / Secure Handle
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                        <input
                                            type="email"
                                            required
                                            placeholder="client@private-office.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem 1rem 0.8rem 2.6rem',
                                                backgroundColor: 'rgba(7, 9, 13, 0.7)',
                                                border: '1px solid var(--border-subtle)',
                                                borderRadius: '6px',
                                                color: 'var(--text-main)',
                                                fontSize: '0.92rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                        Residence of Interest
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Home size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                        <select
                                            value={formData.propertyId}
                                            onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem 1rem 0.8rem 2.6rem',
                                                backgroundColor: 'rgba(7, 9, 13, 0.7)',
                                                border: '1px solid var(--border-subtle)',
                                                borderRadius: '6px',
                                                color: 'var(--text-main)',
                                                fontSize: '0.92rem',
                                                outline: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {properties.map(p => (
                                                <option key={p.id} value={p.id} style={{ background: '#0e1017' }}>
                                                    {p.title} ({p.location}) — {p.priceFormatted}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                            Viewing Mode
                                        </label>
                                        <select
                                            value={formData.viewingMode}
                                            onChange={(e) => setFormData({ ...formData, viewingMode: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem 0.9rem',
                                                backgroundColor: 'rgba(7, 9, 13, 0.7)',
                                                border: '1px solid var(--border-subtle)',
                                                borderRadius: '6px',
                                                color: 'var(--text-main)',
                                                fontSize: '0.88rem',
                                                outline: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="in-person" style={{ background: '#0e1017' }}>Private In-Person Tour</option>
                                            <option value="virtual-3d" style={{ background: '#0e1017' }}>3D Spatial Immersion</option>
                                            <option value="consultation" style={{ background: '#0e1017' }}>Private Office Briefing</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                            Target Date
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <Calendar size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                            <input
                                                type="date"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.8rem 0.85rem 0.8rem 2.4rem',
                                                    backgroundColor: 'rgba(7, 9, 13, 0.7)',
                                                    border: '1px solid var(--border-subtle)',
                                                    borderRadius: '6px',
                                                    color: 'var(--text-main)',
                                                    fontSize: '0.88rem',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ marginTop: '0.75rem', width: '100%' }}
                                >
                                    <span>Request Confidential Itinerary</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PrivateViewing;
