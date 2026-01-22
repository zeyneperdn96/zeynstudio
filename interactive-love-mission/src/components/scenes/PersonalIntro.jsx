import React from 'react';
import { motion } from 'framer-motion';

export default function PersonalIntro({ onNext, config }) {
    const { greeting, message, subtext, buttonText } = config.scenes.personalIntro;
    const personalizedGreeting = greeting.replace('{name}', config.recipientName);

    return (
        <div className="glass-card w-full max-w-sm mx-auto flex flex-col items-center space-y-6">
            <div className="text-left w-full space-y-2">
                <h2 className="text-3xl font-serif text-gold">{personalizedGreeting}</h2>
                <p className="text-xl leading-relaxed text-white/90">
                    {message}
                </p>
            </div>

            <div className="w-16 h-0.5 bg-love-red/50 my-4" />

            <p className="text-sm text-white/60 italic">
                {subtext}
            </p>

            <button onClick={onNext} className="btn-secondary w-full">
                {buttonText}
            </button>
        </div>
    );
}
