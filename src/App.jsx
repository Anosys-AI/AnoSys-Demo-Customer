import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HouseListing from './components/HouseListing';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

function App() {
    return (
        <div className="app">
            <Header />
            <main>
                <Hero />
                <HouseListing />
                <section id="about" className="glass" style={{ margin: '5rem 0', padding: '10rem 0' }}>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>The Lumina Lux Standard</h2>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto' }}>
                            We don't just sell houses; we curate experiences. Every property in our collection is a testament to architectural innovation and uncompromising quality. Our mission is to bridge the gap between imagination and reality, providing you with a home that is as unique as your legacy.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
            <ChatWidget />
        </div>
    );
}

export default App;
