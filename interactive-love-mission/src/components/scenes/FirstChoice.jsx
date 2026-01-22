import React from 'react';

export default function FirstChoice({ onNext, config }) {
    const { title, optionA, optionB } = config.scenes.choice;

    return (
        <div className="flex flex-col items-center justify-center space-y-12">
            <h2 className="text-3xl font-serif text-white/90 text-center">
                {title}
            </h2>

            <div className="flex flex-col space-y-6 w-full max-w-xs">
                <button
                    onClick={onNext}
                    className="group relative px-6 py-4 bg-white/5 border border-white/20 rounded-xl overflow-hidden hover:bg-love-red/20 hover:border-love-red/50 transition-all duration-500"
                >
                    <span className="relative z-10 font-serif text-lg tracking-wide group-hover:text-gold transition-colors">
                        {optionA}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>

                <button
                    onClick={onNext}
                    className="group relative px-6 py-4 bg-white/5 border border-white/20 rounded-xl overflow-hidden hover:bg-love-red/20 hover:border-love-red/50 transition-all duration-500"
                >
                    <span className="relative z-10 font-serif text-lg tracking-wide group-hover:text-gold transition-colors">
                        {optionB}
                    </span>
                </button>
            </div>
        </div>
    );
}
