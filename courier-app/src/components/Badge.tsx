import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'neutral',
    className = ''
}) => {
    return (
        <div className={`badge badge-${variant} ${className}`}>
            {children}
        </div>
    );
};
