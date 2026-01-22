import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { ChevronRight } from 'lucide-react';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mimic API
        setTimeout(() => {
            setLoading(false);
            navigate('/auth/otp', { state: { phone } });
        }, 1000);
    };

    return (
        <div className="flex flex-col h-screen p-6 bg-surface">
            <div className="flex-1 flex flex-col justify-center">
                <h1 className="text-large-title font-bold mb-2">Welcome</h1>
                <p className="text-body text-muted mb-8">Enter your phone number to sign in or register.</p>

                <form onSubmit={handleSubmit} className="w-full">
                    <TextField
                        label="Phone Number"
                        placeholder="+1 234 567 890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        className="mb-6"
                        required
                    />

                    <Button type="submit" isLoading={loading} disabled={phone.length < 5}>
                        Continue
                        <ChevronRight size={20} />
                    </Button>
                </form>
            </div>

            <div className="py-4 text-center">
                <button className="text-sm text-accent font-medium">Contact Support</button>
            </div>
        </div>
    );
};
