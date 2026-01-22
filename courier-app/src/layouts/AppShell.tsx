import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';

export const AppShell: React.FC = () => {
    return (
        <div className="app-shell">
            <TopBar />
            <main className="p-4 safe-area-top">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
};
