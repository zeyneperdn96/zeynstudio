import React, { useEffect } from 'react';

export default function StoryStart({ onNext, config }) {
    const { text, subtext } = config.scenes.storyStart;

    // Auto advance after 5 seconds or allow tap
    useEffect(() => {
        const timer = setTimeout(onNext, 6000);
        return () => clearTimeout(timer);
    }, [onNext]);

    return (
        <div onClick={onNext} className="cursor-pointer h-full flex flex-col items-center justify-center space-y-10 px-4">
            <h2 className="text-2xl md:text-3xl font-serif text-center leading-normal animate-fade-in text-white/90">
                "{text}"
            </h2>

            <p className="text-lg text-gold/80 font-light opacity-0 animate-[fadeIn_1s_ease-out_2s_forwards]">
                {subtext}
            </p>

            <div className="absolute bottom-10 text-xs text-white/30 animate-pulse">
                Tap to continue...
            </div>
        </div>
    );
}
