import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { ChevronRight } from 'lucide-react';

export const CourierProfile: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        courierId: '',
        vehicle: 'bike'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/onboarding/documents');
    };

    return (
        <div className="p-6 h-screen flex flex-col bg-surface">
            <div className="flex-1">
                <h1 className="text-large-title font-bold mb-2">Profile Setup</h1>
                <p className="text-body text-muted mb-8">Tell us about yourself and your vehicle.</p>

                <form id="profile-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <TextField
                        label="Full Name"
                        placeholder="Alex Rider"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <TextField
                        label="Courier ID (Optional)"
                        placeholder="CID-XXXX"
                        value={formData.courierId}
                        onChange={e => setFormData({ ...formData, courierId: e.target.value })}
                    />

                    <div className="input-group">
                        <label className="input-label">Vehicle Type</label>
                        <div className="flex gap-2 mt-2">
                            {['bike', 'scooter', 'car'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    className={`flex-1 py-3 px-4 rounded-xl border ${formData.vehicle === type ? 'border-accent bg-accent/10 text-accent font-medium' : 'border-border bg-surface text-text-muted'}`}
                                    onClick={() => setFormData({ ...formData, vehicle: type })}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </form>
            </div>

            <div className="py-4">
                <Button type="submit" form="profile-form">
                    Next Step
                    <ChevronRight size={20} />
                </Button>
            </div>
        </div>
    );
};
