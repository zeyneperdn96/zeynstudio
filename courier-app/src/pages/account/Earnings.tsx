import React, { useState } from 'react';
import { StatTile } from '../../components/StatTile';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

export const Earnings: React.FC = () => {
    const [period, setPeriod] = useState<'today' | 'week'>('today');

    return (
        <div className="flex flex-col gap-6 pb-20">
            <h1 className="text-large-title font-bold">Earnings</h1>

            {/* Period Toggle */}
            <div className="flex p-1 bg-surface-2 rounded-xl">
                {['today', 'week', 'month'].map((p) => (
                    <button
                        key={p}
                        className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === p ? 'bg-surface shadow text-accent' : 'text-text-muted'}`}
                        onClick={() => setPeriod(p as any)}
                    >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                ))}
            </div>

            {/* Main Stats */}
            <div className="card p-6 flex flex-col items-center justify-center gap-2">
                <span className="text-text-muted font-medium text-sm uppercase">Total Earnings</span>
                <span className="text-4xl font-bold tracking-tight">$124.50</span>
                <div className="flex items-center gap-1 text-success text-sm font-medium bg-success/10 px-2 py-1 rounded-full">
                    <TrendingUp size={14} />
                    <span>+15% vs yesterday</span>
                </div>
            </div>

            <h3 className="text-section font-bold">Breakdown</h3>
            <div className="grid grid-cols-2 gap-4">
                <StatTile label="Trips" value="8" />
                <StatTile label="Tips" value="$24.00" icon={<DollarSign size={16} />} />
                <StatTile label="Hours" value="6.5" icon={<Calendar size={16} />} />
                <StatTile label="Per Trip" value="$15.56" />
            </div>

            <h3 className="text-section font-bold">Recent Payouts</h3>
            <div className="flex flex-col gap-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="card p-4 flex justify-between items-center">
                        <div>
                            <div className="font-bold">Trip #{1000 + i}</div>
                            <div className="text-muted text-xs">Today, 2:30 PM</div>
                        </div>
                        <div className="font-medium text-success">+$15.20</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
