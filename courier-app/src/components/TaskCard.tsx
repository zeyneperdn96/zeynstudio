import { MapPin, ChevronRight } from 'lucide-react';
import type { Task } from '../data/mock';
import { Badge } from './Badge';

interface TaskCardProps {
    task: Task;
    onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
    return (
        <div className="card active:scale-[0.99] transition-transform" onClick={onClick}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <span className="text-meta">Task #{task.id.split('-')[1]}</span>
                    <span className="text-title font-bold">${task.payout.toFixed(2)}</span>
                </div>
                <Badge variant={task.status === 'pending' ? 'warning' : 'success'}>
                    {task.status.replace('_', ' ')}
                </Badge>
            </div>

            <div className="relative pl-4 border-l-2 border-border space-y-4 mb-4">
                {/* Pickup */}
                <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-accent border-2 border-white"></div>
                    <p className="text-body font-medium leading-tight">{task.pickup.address}</p>
                </div>
                {/* Delivery */}
                <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-success border-2 border-white"></div>
                    <p className="text-body font-medium leading-tight">{task.delivery.address}</p>
                </div>
            </div>

            <div className="flex justify-between items-center text-muted pt-3 border-t border-border">
                <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span className="text-meta">{task.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-accent">View Details</span>
                    <ChevronRight size={14} className="text-accent" />
                </div>
            </div>
        </div>
    );
};
