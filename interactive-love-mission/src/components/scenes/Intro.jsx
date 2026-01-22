import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Intro({ onNext, config }) {
    return (
        <div className="flex flex-col items-center justify-center space-y-8">
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-love-red"
            >
                <Heart size={64} fill="#8B0000" />
            </motion.div>

            <div className="space-y-4">
                <h1 className="text-4xl font-serif font-bold text-white tracking-wide">
                    {config.scenes.intro.title}
                </h1>
                <p className="text-lg text-white/70 font-light">
                    {config.scenes.intro.subtitle}
                </p>
            </div>

            <button onClick={onNext} className="btn-primary mt-8">
                {config.scenes.intro.buttonText}
            </button>
        </div>
    );
}
