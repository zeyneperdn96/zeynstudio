import React from 'react';
import { motion } from 'framer-motion';

export default function PersonalMessage({ onNext, config }) {
    const { content, subtext } = config.scenes.message;

    return (
        <div className="glass-card w-full max-w-sm mx-auto flex flex-col space-y-4">
            <div className="flex items-center space-x-2 text-gold/70 text-xs uppercase tracking-widest mb-2">
                <div className="w-2 h-2 rounded-full bg-love-red animate-pulse" />
                <span>Incoming Message</span>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="font-serif text-lg md:text-xl text-white/90 leading-relaxed italic"
            >
                "{content}"
            </motion.div>

            <div className="w-full h-px bg-white/10 my-4" />

            <p className="text-xs text-white/40 text-center">
                {subtext}
            </p>

            <button onClick={onNext} className="btn-primary w-full mt-4 text-sm py-3">
                Continue
            </button>
        </div>
    );
}
