import React from 'react';

interface StatTileProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: string;
}

export const StatTile: React.FC<StatTileProps> = ({ label, value, icon }) => {
    return (
        <div className="card p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-muted">
                <span className="text-meta font-medium uppercase">{label}</span>
                {icon}
            </div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    );
};
