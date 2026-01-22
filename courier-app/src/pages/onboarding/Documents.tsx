import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Upload, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { Badge } from '../../components/Badge';

export const Documents: React.FC = () => {
    const navigate = useNavigate();
    const [uploads, setUploads] = useState({
        idCard: false,
        license: false
    });

    const handleUpload = (key: keyof typeof uploads) => {
        // Mock upload
        setUploads(prev => ({ ...prev, [key]: true }));
    };

    const isComplete = uploads.idCard && uploads.license;

    return (
        <div className="p-6 h-screen flex flex-col bg-surface">
            <header className="mb-6 pt-2">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-text-muted">
                    <ArrowLeft size={24} />
                </button>
            </header>

            <div className="flex-1">
                <h1 className="text-large-title font-bold mb-2">Documents</h1>
                <p className="text-body text-muted mb-8">Upload necessary documents for verification.</p>

                <div className="flex flex-col gap-4">
                    {/* ID Card */}
                    <div className="card flex items-center justify-between p-4">
                        <div>
                            <h3 className="text-section font-medium">National ID</h3>
                            <p className="text-meta">Front and back</p>
                        </div>
                        {uploads.idCard ? (
                            <Badge variant="success"><Check size={14} className="mr-1" /> Uploaded</Badge>
                        ) : (
                            <button onClick={() => handleUpload('idCard')} className="p-2 bg-surface-2 rounded-full text-accent">
                                <Upload size={20} />
                            </button>
                        )}
                    </div>

                    {/* License */}
                    <div className="card flex items-center justify-between p-4">
                        <div>
                            <h3 className="text-section font-medium">Driver's License</h3>
                            <p className="text-meta">Valid driving license</p>
                        </div>
                        {uploads.license ? (
                            <Badge variant="success"><Check size={14} className="mr-1" /> Uploaded</Badge>
                        ) : (
                            <button onClick={() => handleUpload('license')} className="p-2 bg-surface-2 rounded-full text-accent">
                                <Upload size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="py-4">
                <Button onClick={() => navigate('/onboarding/pending')} disabled={!isComplete}>
                    Submit for Approval
                    <ChevronRight size={20} />
                </Button>
            </div>
        </div>
    );
};
