import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { StatTile } from '../../components/StatTile';
import { ModalSheet } from '../../components/ModalSheet';
import { TaskCard } from '../../components/TaskCard';
import { Badge } from '../../components/Badge';
import { MOCK_TASKS } from '../../data/mock';
import { MapPin, DollarSign, Package } from 'lucide-react';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const [isOnline, setIsOnline] = useState(false);
    const [showIncoming, setShowIncoming] = useState(false);
    const [activeTask, setActiveTask] = useState<any>(null); // Replace with Task type

    // Stats
    const earnings = 124.50;
    const completed = 8;

    // Simulate incoming task
    useEffect(() => {
        let timer: any;
        if (isOnline && !activeTask) {
            timer = setTimeout(() => {
                setShowIncoming(true);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [isOnline, activeTask]);

    const handleAccept = () => {
        setActiveTask(MOCK_TASKS[0]);
        setShowIncoming(false);
    };

    const handleReject = () => {
        setShowIncoming(false);
    };

    return (
        <div className="flex flex-col gap-6 pb-20">
            {/* Status Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-title font-bold">Good Morning, Alex</h2>
                    <p className="text-body text-muted">Ready to work?</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success' : 'bg-text-muted'}`}></span>
                    <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
            </div>

            {/* Toggle */}
            <Button
                variant={isOnline ? 'destructive' : 'primary'}
                className={isOnline ? 'bg-surface-2 !text-text' : ''} // Custom style for "Go Offline" if needed, reusing secondary logic or destructive
                onClick={() => setIsOnline(!isOnline)}
            >
                {isOnline ? 'Go Offline' : 'Go Online'}
            </Button>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <StatTile label="Today" value={`$${earnings.toFixed(2)}`} icon={<DollarSign size={16} />} />
                <StatTile label="Completed" value={completed} icon={<Package size={16} />} />
            </div>

            {/* Active Work Area */}
            <div>
                <h3 className="text-section font-bold mb-4">Current Status</h3>

                {!isOnline ? (
                    <Card className="text-center py-8">
                        <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
                            <MapPin size={32} />
                        </div>
                        <p className="text-body font-medium">You are offline</p>
                        <p className="text-meta">Go online to receive delivery requests.</p>
                    </Card>
                ) : activeTask ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted">Active Task</span>
                            <Badge variant="accent" className="animate-pulse">Live</Badge>
                        </div>
                        <TaskCard task={activeTask} onClick={() => navigate('/tasks')} />
                    </div>
                ) : (
                    <Card className="text-center py-8 border-dashed">
                        <div className="animate-pulse w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                            <div className="w-12 h-12 bg-accent/20 rounded-full animate-ping absolute"></div>
                            <MapPin size={32} className="relative z-10" />
                        </div>
                        <p className="text-body font-medium">Searching for tasks...</p>
                        <p className="text-meta">Stay in high demand areas for better matches.</p>
                    </Card>
                )}
            </div>

            {/* Incoming Task Modal */}
            <ModalSheet isOpen={showIncoming} title="New Delivery Request">
                <div className="flex flex-col gap-6">
                    <div className="text-center">
                        <div className="text-4xl font-bold mb-1">$12.50</div>
                        <div className="text-meta">Est. earnings • 3.2 km total</div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="mt-1 w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                            <div>
                                <div className="text-sm text-muted">Pickup</div>
                                <div className="font-medium">123 Tech Park, Logistics Hub</div>
                                <div className="text-xs text-muted">2.1 km away</div>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="mt-1 w-2 h-2 rounded-full bg-success flex-shrink-0" />
                            <div>
                                <div className="text-sm text-muted">Dropoff</div>
                                <div className="font-medium">45 Green St, Downtown</div>
                                <div className="text-xs text-muted">1.1 km trip</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <Button variant="ghost" onClick={handleReject} className="text-danger">Reject</Button>
                        <Button onClick={handleAccept}>Accept (20s)</Button>
                    </div>
                </div>
            </ModalSheet>
        </div>
    );
};
