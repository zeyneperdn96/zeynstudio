import React from 'react';
import { COURIER_PROFILE } from '../../data/mock';
import { Button } from '../../components/Button';
import { User, Truck, FileText, Bell, Globe, LogOut, ChevronRight } from 'lucide-react';
import { Badge } from '../../components/Badge';

export const Profile: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 pb-20">
            <h1 className="text-large-title font-bold">Profile</h1>

            {/* Header */}
            <div className="card flex items-center gap-4 p-4">
                <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center text-text-muted">
                    <User size={32} />
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-bold">{COURIER_PROFILE.name}</h2>
                    <p className="text-muted text-sm">{COURIER_PROFILE.id}</p>
                </div>
                <Badge variant="success">Verified</Badge>
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-2">
                <h3 className="text-section font-bold text-text-muted uppercase text-xs px-2">Account</h3>

                <div className="card !p-0 overflow-hidden">
                    <MenuItem icon={Truck} label="Vehicle Info" value={COURIER_PROFILE.vehicle} />
                    <div className="h-[1px] bg-border mx-4" />
                    <MenuItem icon={FileText} label="Documents" />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-section font-bold text-text-muted uppercase text-xs px-2">App Settings</h3>

                <div className="card !p-0 overflow-hidden">
                    <MenuItem icon={Bell} label="Notifications" value="On" />
                    <div className="h-[1px] bg-border mx-4" />
                    <MenuItem icon={Globe} label="Language" value="English" />
                </div>
            </div>

            <div className="mt-4">
                <Button variant="destructive" icon={<LogOut size={20} />}>
                    Log Out
                </Button>
            </div>

            <div className="text-center text-xs text-muted mt-4">
                v1.0.0 (Build 105)
            </div>
        </div>
    );
};

const MenuItem = ({ icon: Icon, label, value }: any) => (
    <button className="w-full flex items-center justify-between p-4 hover:bg-surface-2 transition-colors">
        <div className="flex items-center gap-3">
            <Icon size={20} className="text-text-muted" />
            <span className="font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2 text-muted">
            {value && <span className="text-sm">{value}</span>}
            <ChevronRight size={16} />
        </div>
    </button>
);
