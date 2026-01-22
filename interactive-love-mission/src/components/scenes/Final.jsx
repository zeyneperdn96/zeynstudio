import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Send } from 'lucide-react';

export default function Final({ config }) {
    const { heading, subtext, proposalText, anniversaryText, birthdayText, yesButton, contactButton } = config.scenes.final;

    let finalMessage = "";
    if (config.theme === 'proposal') finalMessage = proposalText;
    else if (config.theme === 'anniversary') finalMessage = anniversaryText;
    else if (config.theme === 'birthday') finalMessage = birthdayText;
    else finalMessage = "I Love You";

    useEffect(() => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FFD700', '#8B0000', '#FFF']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FFD700', '#8B0000', '#FFF']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    const handleContact = () => {
        // Determine message based on theme
        let msg = "";
        if (config.theme === 'proposal') msg = "YES! 💍";
        else msg = "I loved it! ❤️";

        // Open WhatsApp or generic share (simulated)
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-8 px-4 w-full">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <Heart size={80} className="text-love-red fill-love-red drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]" />
            </motion.div>

            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gold drop-shadow-md">
                    {heading}
                </h1>
                <p className="text-lg text-white/70">
                    {subtext}
                </p>
            </div>

            <div className="glass-card w-full max-w-sm py-8 space-y-6">
                <h2 className="text-2xl font-serif text-white">
                    {finalMessage}
                </h2>

                {config.theme === 'proposal' ? (
                    <button onClick={handleContact} className="btn-primary w-full text-xl animate-pulse">
                        {yesButton}
                    </button>
                ) : (
                    <button onClick={handleContact} className="btn-primary w-full flex items-center justify-center space-x-2">
                        <span>{contactButton}</span>
                        <Send size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
