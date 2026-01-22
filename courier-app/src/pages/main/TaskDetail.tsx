import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { ArrowLeft, Phone, Navigation, Camera, CheckCircle } from 'lucide-react';

// Mock task data for detail view
const TASK_DATA = {
    id: 'T-1001',
    status: 'pickup_arrived', // initial state for demo
    pickup: {
        address: '123 Tech Park, Logistics Hub',
        contact: 'John Doe',
        phone: '+1234567890'
    },
    delivery: {
        address: '45 Green St, Downtown',
        contact: 'Jane Smith',
        phone: '+1987654321',
        note: 'Leave at front desk'
    },
    payout: 12.50
};

export const TaskDetail: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    // Steps: 0: Go to Pickup, 1: Arrived Pickup, 2: Confirm Pickup, 3: Go to Dropoff, 4: Arrived Dropoff, 5: Complete
    // Simplified for demo matching requested states: "Start to Pickup" -> "Arrived" -> "Confirm" -> "Start Dropoff" -> "Arrived" -> "Complete"

    const steps = [
        { label: 'Go to Pickup', cta: 'Arrived at Pickup', action: () => setStep(1) },
        { label: 'At Pickup', cta: 'Confirm Pickup', action: () => setStep(2) }, // Could be modal with photo
        { label: 'Go to Dropoff', cta: 'Arrived at Dropoff', action: () => setStep(3) },
        { label: 'At Dropoff', cta: 'Complete Delivery', action: () => navigate('/tasks') } // Should go to summary
    ];

    const currentStep = steps[step];

    return (
        <div className="pb-24">
            {/* Header */}
            <header className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-text-muted">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-title font-bold">Task #{TASK_DATA.id.split('-')[1]}</h1>
                    <Badge variant="accent">Active</Badge>
                </div>
                <div className="ml-auto font-bold text-lg">${TASK_DATA.payout.toFixed(2)}</div>
            </header>

            {/* Timeline / Progress */}
            <div className="flex justify-between mb-8 px-4 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10" />
                {['Pickup', 'Dropoff'].map((s, i) => (
                    <div key={s} className={`flex flex-col items-center gap-2 bg-bg px-2`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step > i ? 'bg-success border-success text-white' : 'bg-surface border-text-muted text-text-muted'}`}>
                            {step > i ? <CheckCircle size={16} /> : <span className="text-xs font-bold">{i + 1}</span>}
                        </div>
                        <span className="text-xs font-medium text-muted uppercase">{s}</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-6">
                {/* Pickup Card */}
                <div className={`card ${step >= 2 ? 'opacity-50' : ''}`}>
                    <div className="flex justify-between mb-2">
                        <span className="text-meta uppercase font-bold text-text-muted">Pickup</span>
                        <Button variant="ghost" className="!w-auto !h-auto !p-0 text-accent"><Navigation size={16} /> Map</Button>
                    </div>
                    <h3 className="text-section font-bold mb-1">{TASK_DATA.pickup.address}</h3>
                    <p className="text-body text-muted mb-4">{TASK_DATA.pickup.contact}</p>
                    <Button variant="secondary" icon={<Phone size={18} />}>Call Contact</Button>
                </div>

                {/* Dropoff Card */}
                <div className={`card ${step < 2 ? 'opacity-50' : ''}`}>
                    <div className="flex justify-between mb-2">
                        <span className="text-meta uppercase font-bold text-text-muted">Dropoff</span>
                        {step >= 2 && <Button variant="ghost" className="!w-auto !h-auto !p-0 text-accent"><Navigation size={16} /> Map</Button>}
                    </div>
                    <h3 className="text-section font-bold mb-1">{TASK_DATA.delivery.address}</h3>
                    <p className="text-body text-muted mb-4">{TASK_DATA.delivery.contact}</p>
                    {TASK_DATA.delivery.note && (
                        <div className="bg-surface-2 p-3 rounded-lg text-sm text-text-muted mb-4">
                            Note: {TASK_DATA.delivery.note}
                        </div>
                    )}
                    <Button variant="secondary" icon={<Phone size={18} />} disabled={step < 2}>Call Contact</Button>
                </div>
            </div>

            {/* Floating Action Button area */}
            <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-border p-4 pb-8 z-40">
                <div className="max-w-[480px] mx-auto flex gap-4">
                    {step === 1 || step === 3 ? (
                        <Button variant="secondary" className="!w-14 shrink-0" aria-label="Camera">
                            <Camera size={24} />
                        </Button>
                    ) : null}
                    <Button onClick={currentStep.action}>
                        {currentStep.cta}
                    </Button>
                </div>
            </div>
        </div>
    );
};
