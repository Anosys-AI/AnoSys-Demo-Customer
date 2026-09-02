import React, { useState, useMemo } from 'react';
import HouseCard from './HouseCard';
import { Search, SlidersHorizontal, ArrowDownUp, RefreshCw } from 'lucide-react';

const HouseListing = ({
    properties,
    favorites,
    onToggleFavorite,
    onSelectProperty,
    onOpenChat,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
}) => {
    const [sortBy, setSortBy] = useState('featured');
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

    const categories = [
        { id: 'all', label: 'All Residences' },
        { id: 'coastal', label: 'Coastal & Waterfront' },
        { id: 'alpine', label: 'Alpine & Mountain' },
        { id: 'modern', label: 'Modern Architectural' }
    ];

    const filteredProperties = useMemo(() => {
        return properties
            .filter((item) => {
                const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
                const matchesSearch = 
                    !searchQuery ||
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.architecturalStyle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesFavs = !showOnlyFavorites || favorites.includes(item.id);
                return matchesCategory && matchesSearch && matchesFavs;
            })
            .sort((a, b) => {
                if (sortBy === 'price-desc') return b.price - a.price;
                if (sortBy === 'price-asc') return a.price - b.price;
                if (sortBy === 'area-desc') return b.area - a.area;
                return 0; // 'featured' retains curated order
            });
    }, [properties, selectedCategory, searchQuery, showOnlyFavorites, favorites, sortBy]);

    const resetFilters = () => {
        setSelectedCategory('all');
        setSearchQuery('');
        setShowOnlyFavorites(false);
        setSortBy('featured');
    };

    return (
        <section id="houses" style={{ paddingTop: '5rem', paddingBottom: '6rem' }}>
            <div className="container">
                {/* Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <span className="badge-gold" style={{ marginBottom: '1rem' }}>
                        Curated Collection
                    </span>
                    <h2 style={{ fontSize: '3.2rem', marginBottom: '1rem', lineHeight: '1.2' }}>
                        Trophy Residences Across The Globe
                    </h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem' }}>
                        Hand-selected architectural statements representing the pinnacle of international design, privacy, and legacy asset appreciation.
                    </p>
                </div>

                {/* Filter and Controls Toolbar */}
                <div className="glass" style={{
                    borderRadius: '12px',
                    padding: '1.25rem 1.5rem',
                    marginBottom: '3rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.25rem',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid var(--border-subtle)'
                }}>
                    {/* Category Tabs */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                    }}>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                style={{
                                    padding: '0.55rem 1.15rem',
                                    borderRadius: '30px',
                                    fontSize: '0.84rem',
                                    fontWeight: '600',
                                    backgroundColor: selectedCategory === cat.id ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.04)',
                                    color: selectedCategory === cat.id ? '#080a0e' : 'var(--text-muted)',
                                    border: '1px solid',
                                    borderColor: selectedCategory === cat.id ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.08)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {cat.label}
                            </button>
                        ))}

                        {favorites.length > 0 && (
                            <button
                                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                                style={{
                                    padding: '0.55rem 1.15rem',
                                    borderRadius: '30px',
                                    fontSize: '0.84rem',
                                    fontWeight: '600',
                                    backgroundColor: showOnlyFavorites ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                                    color: showOnlyFavorites ? '#f87171' : 'var(--text-muted)',
                                    border: '1px solid',
                                    borderColor: showOnlyFavorites ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.08)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Saved ({favorites.length})
                            </button>
                        )}
                    </div>

                    {/* Search & Sort Controls */}
                    <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        flex: '1 1 auto',
                        justifyContent: 'flex-end'
                    }}>
                        {/* Search Input */}
                        <div style={{
                            position: 'relative',
                            minWidth: '220px',
                            flex: '1 1 220px',
                            maxWidth: '320px'
                        }}>
                            <Search size={16} style={{
                                position: 'absolute',
                                left: '0.85rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-dim)'
                            }} />
                            <input 
                                type="text"
                                placeholder="Search by location, style..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.6rem 0.85rem 0.6rem 2.4rem',
                                    backgroundColor: 'rgba(7, 9, 13, 0.7)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '6px',
                                    color: 'var(--text-main)',
                                    fontSize: '0.86rem',
                                    outline: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--accent-gold)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                }}
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    padding: '0.6rem 1.8rem 0.6rem 0.85rem',
                                    backgroundColor: 'rgba(7, 9, 13, 0.7)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '6px',
                                    color: 'var(--text-main)',
                                    fontSize: '0.86rem',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    appearance: 'none',
                                    WebkitAppearance: 'none'
                                }}
                            >
                                <option value="featured" style={{ background: '#0e1017' }}>Sort: Curated</option>
                                <option value="price-desc" style={{ background: '#0e1017' }}>Price: High to Low</option>
                                <option value="price-asc" style={{ background: '#0e1017' }}>Price: Low to High</option>
                                <option value="area-desc" style={{ background: '#0e1017' }}>Area: Largest First</option>
                            </select>
                            <ArrowDownUp size={13} style={{
                                position: 'absolute',
                                right: '0.65rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-dim)',
                                pointerEvents: 'none'
                            }} />
                        </div>
                    </div>
                </div>

                {/* Property Grid */}
                {filteredProperties.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {filteredProperties.map((prop) => (
                            <HouseCard 
                                key={prop.id} 
                                property={prop}
                                isFavorite={favorites.includes(prop.id)}
                                onToggleFavorite={onToggleFavorite}
                                onSelectProperty={onSelectProperty}
                                onOpenChat={onOpenChat}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="glass" style={{
                        borderRadius: '12px',
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        maxWidth: '560px',
                        margin: '2rem auto'
                    }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏛️</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No matching residences</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                            We could not find any properties matching your current filters. Please adjust your criteria or consult our AI Concierge.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="btn-secondary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <RefreshCw size={15} />
                            <span>Reset All Filters</span>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HouseListing;
