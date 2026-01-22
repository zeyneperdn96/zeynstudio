import React from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const TextField: React.FC<TextFieldProps> = ({
    label,
    error,
    icon,
    className = '',
    id,
    ...props
}) => {
    // Use id or generate minimal one if needed for label
    const inputId = id || props.name;

    return (
        <div className={`input-group ${className}`}>
            {label && <label htmlFor={inputId} className="input-label">{label}</label>}
            <div className="input-wrapper">
                {/* Icon support could be added here absolutely positioned */}
                <input
                    id={inputId}
                    className={`input-field ${error ? 'input-error' : ''}`}
                    {...props}
                />
            </div>
            {error && <span className="input-error-msg">{error}</span>}
        </div>
    );
};
