import React from 'react';
import HouseCard from './HouseCard';

const HouseListing = () => {
    const properties = [
        {
            image: '/mykonos-villa.png',
            title: 'Aegean Pearl Villa',
            location: 'Mykonos, Greece',
            price: '18,500,000',
            beds: 8,
            baths: 10,
            area: '12,000'
        },
        {
            image: '/house-1.jpg',
            title: 'Celestial Heights Villa',
            location: 'Swiss Alps, Switzerland',
            price: '12,450,000',
            beds: 6,
            baths: 7,
            area: '8,200'
        },
        {
            image: '/house-2.jpg',
            title: 'Azure Coast Retreat',
            location: 'Amalfi Coast, Italy',
            price: '9,800,000',
            beds: 5,
            baths: 5,
            area: '6,400'
        },
        {
            image: '/house-3.jpg',
            title: 'Lumina Desert Sanctuary',
            location: 'Silicon Valley, USA',
            price: '15,200,000',
            beds: 7,
            baths: 9,
            area: '10,500'
        }
    ];

    return (
        <section id="houses">
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Featured Properties</h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Carefully curated architectural gems from around the globe, selected for their unique design and unparalleled luxury.
                    </p>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2.5rem'
                }}>
                    {properties.map((prop, idx) => (
                        <HouseCard key={idx} {...prop} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HouseListing;
