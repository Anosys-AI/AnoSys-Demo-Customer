import React from 'react';
import { Home, Search, Heart, User } from 'lucide-react';

const Header = () => {
    return (
        <header className="glass" style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 1000,
            padding: '1.5rem 0',
            borderBottom: '1px solid var(--glass-border)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div className="logo" style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Home size={28} />
                    <span>LUMINA LUX</span>
                </div>
                <nav>
                    <ul style={{
                        display: 'flex',
                        gap: '2rem',
                        fontWeight: '500'
                    }}>
                        <li><a href="#hero">Collection</a></li>
                        <li><a href="#houses">Properties</a></li>
                        <li><a href="#about">Philosophy</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
                <div className="actions" style={{
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'center'
                }}>
                    <Search size={20} />
                    <Heart size={20} />
                    <User size={20} />
                </div>
            </div>
        </header>
    );
};

export default Header;
