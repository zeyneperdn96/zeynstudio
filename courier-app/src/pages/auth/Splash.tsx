import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export const Splash: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check auth or just redirect
        const timer = setTimeout(() => {
            // Mock auth check: if token exists -> home, else -> login
            // For demo -> Login
            navigate('/login');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-accent text-white">
            <div className="flex flex-col items-center gap-4">
                {/* Placeholder Logo */}
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center">
                    <span className="text-accent text-4xl font-bold">C</span>
                </div>
                <h1 className="text-large-title font-bold tracking-tight">COURIER</h1>
                <Loader2 className="animate-spin mt-8" size={32} />
            </div>
        </div>
    );
};
