import React, { useRef, useState } from 'react';

interface OTPInputProps {
    length?: number;
    onComplete: (code: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete }) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1); // Take last digit if multiple pasted? Simplified.
        setOtp(newOtp);

        // Auto next
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check complete
        const combined = newOtp.join('');
        if (combined.length === length) {
            onComplete(combined);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            // Move back if empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex gap-2 justify-between w-full mb-6">
            {otp.map((d, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 bg-surface-2 border border-border rounded-lg text-center text-title font-bold focus:border-accent focus:outline-none transition-colors"
                />
            ))}
        </div>
    );
};
