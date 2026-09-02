import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HouseListing from './components/HouseListing';
import Philosophy from './components/Philosophy';
import PrivateViewing from './components/PrivateViewing';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import PropertyModal from './components/PropertyModal';
import { properties } from './data/properties';
import { Sparkles, CheckCircle2 } from 'lucide-react';

function App() {
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('apogee_favorites');
            return saved ? JSON.parse(saved) : ['aegean-pearl-villa'];
        } catch {
            return ['aegean-pearl-villa'];
        }
    });

    const [activeProperty, setActiveProperty] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewingTargetProperty, setViewingTargetProperty] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        try {
            localStorage.setItem('apogee_favorites', JSON.stringify(favorites));
        } catch (e) {
            console.error(e);
        }
    }, [favorites]);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage((prev) => (prev === message ? null : prev));
        }, 3800);
    };

    const handleToggleFavorite = (propertyId) => {
        setFavorites((prev) => {
            const isFav = prev.includes(propertyId);
            const next = isFav ? prev.filter((id) => id !== propertyId) : [...prev, propertyId];
            const prop = properties.find((p) => p.id === propertyId);
            const title = prop ? prop.title : 'Residence';
            showToast(isFav ? `Removed ${title} from saved wishlist.` : `Saved ${title} to your private wishlist.`);
            return next;
        });
    };

    const handleOpenChat = (prompt) => {
        window.dispatchEvent(new CustomEvent('open-apogee-chat', { detail: { prompt } }));
    };

    const handleBookViewing = (property) => {
        setViewingTargetProperty(property);
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleFocusSearch = () => {
        const housesSection = document.getElementById('houses');
        if (housesSection) {
            housesSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                const searchInput = housesSection.querySelector('input[type="text"]');
                if (searchInput) searchInput.focus();
            }, 500);
        }
    };

    const handleToggleFavoritesFilter = () => {
        const housesSection = document.getElementById('houses');
        if (housesSection) {
            housesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="app">
            <Header 
                favoritesCount={favorites.length}
                onToggleFavoritesFilter={handleToggleFavoritesFilter}
                onOpenChat={handleOpenChat}
                onFocusSearch={handleFocusSearch}
            />

            <main>
                <Hero 
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <HouseListing 
                    properties={properties}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectProperty={setActiveProperty}
                    onOpenChat={handleOpenChat}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <Philosophy onOpenChat={handleOpenChat} />

                <PrivateViewing 
                    properties={properties}
                    preselectedProperty={viewingTargetProperty}
                    onShowToast={showToast}
                />
            </main>

            <Footer onShowToast={showToast} />

            <ChatWidget />

            <PropertyModal 
                property={activeProperty}
                onClose={() => setActiveProperty(null)}
                isFavorite={activeProperty ? favorites.includes(activeProperty.id) : false}
                onToggleFavorite={handleToggleFavorite}
                onOpenChat={handleOpenChat}
                onBookViewing={handleBookViewing}
            />

            {/* Toast feedback */}
            {toastMessage && (
                <div className="toast-notification">
                    <CheckCircle2 size={18} style={{ color: 'var(--accent-gold)' }} />
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>
    );
}

export default App;
