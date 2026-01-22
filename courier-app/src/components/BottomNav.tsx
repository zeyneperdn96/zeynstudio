import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, DollarSign, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
    const navItems = [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/tasks', icon: List, label: 'Tasks' },
        { to: '/earnings', icon: DollarSign, label: 'Earnings' },
        { to: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Icon size={24} strokeWidth={2.5} />
                    <span className="nav-label">{label}</span>
                </NavLink>
            ))}
        </nav>
    );
};
