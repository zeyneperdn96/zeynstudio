import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Intro from './scenes/Intro';
import PersonalIntro from './scenes/PersonalIntro';
import StoryStart from './scenes/StoryStart';
import FirstChoice from './scenes/FirstChoice';
import EmotionalRise from './scenes/EmotionalRise';
import PersonalMessage from './scenes/PersonalMessage';
import Final from './scenes/Final';

const scenes = [
    Intro,
    PersonalIntro,
    StoryStart,
    FirstChoice,
    EmotionalRise,
    PersonalMessage,
    Final
];

export default function SceneManager({ config }) {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

    const nextScene = () => {
        if (currentSceneIndex < scenes.length - 1) {
            setCurrentSceneIndex(prev => prev + 1);
        }
    };

    const CurrentSceneComponent = scenes[currentSceneIndex];

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentSceneIndex}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
            >
                <CurrentSceneComponent onNext={nextScene} config={config} />
            </motion.div>
        </AnimatePresence>
    );
}
