import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskCard } from '../../components/TaskCard';
import { MOCK_TASKS } from '../../data/mock';

export const Tasks: React.FC = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState<'active' | 'completed'>('active');

    const activeTasks = MOCK_TASKS.filter(t => t.status !== 'delivered' && t.status !== 'cancelled');
    const completedTasks = [
        { ...MOCK_TASKS[0], id: 'T-0998', status: 'delivered', payout: 15.00, distance: '5.4 km', pickup: { address: 'Old Market', contactParams: '' }, delivery: { address: 'Main St', contactParams: '' } }
    ]; // Mock completed

    const list = tab === 'active' ? activeTasks : completedTasks;

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-large-title font-bold mb-4">My Tasks</h1>

            {/* Tabs */}
            <div className="flex p-1 bg-surface-2 rounded-xl mb-6">
                {['active', 'completed'].map((t) => (
                    <button
                        key={t}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-surface shadow text-accent' : 'text-text-muted'}`}
                        onClick={() => setTab(t as any)}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex flex-col gap-4 pb-20">
                {list.length === 0 ? (
                    <div className="text-center text-muted mt-12">
                        No {tab} tasks found.
                    </div>
                ) : (
                    list.map((task: any) => (
                        <TaskCard key={task.id} task={task} onClick={() => navigate('/tasks/123')} />
                    ))
                )}
            </div>
        </div>
    );
};
