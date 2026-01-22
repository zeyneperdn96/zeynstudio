import React from 'react';
import { Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const TopBar: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="top-bar">
            <div className="flex items-center gap-2">
                <h1 className="text-title">Courier</h1>
                <span className="chip active">BETA</span>
            </div>
            <div className="flex items-center gap-3">
                <button className="icon-btn" aria-label="Notifications">
                    <Bell size={24} />
                </button>
                <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle Theme">
                    {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                </button>
            </div>
        </header>
    );
};
