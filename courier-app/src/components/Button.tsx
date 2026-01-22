import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading,
    icon,
    className = '',
    disabled,
    ...props
}) => {
    return (
        <button
            className={`btn btn-${variant} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : icon}
            {children}
        </button>
    );
};
