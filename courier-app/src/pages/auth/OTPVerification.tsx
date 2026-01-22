import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { OTPInput } from '../../components/OTPInput';
import { ArrowLeft } from 'lucide-react';

export const OTPVerification: React.FC = () => {
    const navigate = useNavigate();

    // Mock verification
    const handleComplete = (code: string) => {
        console.log('Verifying code:', code);
        setTimeout(() => {
            // Navigate to Home or Onboarding logic
            // For now, go to Home
            navigate('/home');
        }, 1500);
    };

    return (
        <div className="flex flex-col h-screen p-6 bg-surface">
            <header className="mb-8 pt-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-text-muted">
                    <ArrowLeft size={24} />
                </button>
            </header>

            <div className="flex-1">
                <h1 className="text-large-title font-bold mb-2">Verify Code</h1>
                <p className="text-body text-muted mb-8">We sent a code to your phone.</p>

                <OTPInput onComplete={handleComplete} />

                <div className="text-center mt-8">
                    <p className="text-sm text-muted mb-4">Didn't receive the code?</p>
                    <Button variant="ghost" className="text-accent">Resend Code</Button>
                </div>
            </div>
        </div>
    );
};
