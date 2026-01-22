import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function EmotionalRise({ onNext, config }) {
    const { text, subtext } = config.scenes.emotion;
    const personalizedSubtext = subtext.replace('{date}', config.specialDate);

    useEffect(() => {
        const timer = setTimeout(onNext, 6000);
        return () => clearTimeout(timer);
    }, [onNext]);

    return (
        <div className="flex flex-col items-center justify-center space-y-6 text-center px-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                <p className="text-xl md:text-2xl text-white/80 font-serif leading-relaxed">
                    {text}
                </p>
            </motion.div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2, duration: 1, type: "spring" }}
                className="mt-8"
            >
                <span className="text-4xl md:text-5xl font-bold text-gold font-serif tracking-widest drop-shadow-lg">
                    {config.specialDate}
                </span>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5, duration: 1 }}
                className="text-white/50 text-sm mt-4"
            >
                {personalizedSubtext.replace(config.specialDate, '')}
            </motion.p>
        </div>
    );
}
