import React from 'react';
import { X } from 'lucide-react';

interface ModalSheetProps {
    isOpen: boolean;
    onClose?: () => void;
    title?: string;
    children: React.ReactNode;
}

export const ModalSheet: React.FC<ModalSheetProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-[480px] bg-surface rounded-t-2xl sm:rounded-2xl p-6 shadow-xl animate-slide-up sm:m-4">
                {/* Handle bar for mobile feel */}
                <div className="w-12 h-1 bg-border rounded-full mx-auto mb-6 sm:hidden" />

                <div className="flex justify-between items-center mb-4">
                    {title && <h2 className="text-title font-bold">{title}</h2>}
                    {onClose && (
                        <button onClick={onClose} className="p-2 -mr-2 text-muted hover:bg-surface-2 rounded-full">
                            <X size={24} />
                        </button>
                    )}
                </div>

                {children}
            </div>
        </div>
    );
};
