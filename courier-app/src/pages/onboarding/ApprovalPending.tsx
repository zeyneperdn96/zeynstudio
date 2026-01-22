import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Clock } from 'lucide-react';

export const ApprovalPending: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 h-screen flex flex-col items-center justify-center bg-surface text-center">
            <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mb-6">
                <Clock size={40} className="text-warning" />
            </div>

            <h1 className="text-large-title font-bold mb-4">Approval Pending</h1>
            <p className="text-body text-muted mb-8">
                Your documents are under review. This usually takes 24-48 hours. We will notify you via SMS.
            </p>

            <div className="w-full space-y-4">
                <Button variant="secondary" onClick={() => window.location.reload()}>
                    Check Status
                </Button>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                    Back to Login
                </Button>

                {/* Bypass for demo */}
                <button onClick={() => navigate('/home')} className="mt-8 text-xs text-surface-2 text-center w-full">
                    Dev: Bypass to Home
                </button>
            </div>
        </div>
    );
};
