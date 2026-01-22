import React, { useState } from 'react';
import UploadUI from './UploadUI';
import PhaserGame from './PhaserGame';

const GameContainer = () => {
    const [gameState, setGameState] = useState('upload'); // 'upload', 'playing'
    const [playerImage, setPlayerImage] = useState(null);
    const [partnerImage, setPartnerImage] = useState(null);

    const handleStartGame = () => {
        if (playerImage && partnerImage) {
            setGameState('playing');
        }
    };

    const handleTestMode = () => {
        // Create dummy images for test mode
        const createDummyFace = (color, emoji) => {
            const c = document.createElement('canvas');
            c.width = 64; c.height = 64;
            const ctx = c.getContext('2d');
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(32, 32, 32, 0, Math.PI * 2); ctx.fill();
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(emoji, 32, 34);
            return c.toDataURL();
        };

        setPlayerImage(createDummyFace('#3b82f6', '😠'));
        setPartnerImage(createDummyFace('#ec4899', '😍'));
        setGameState('playing');
    };

    return (
        <div className="w-full h-screen bg-black overflow-hidden relative">
            {gameState === 'upload' && (
                <UploadUI
                    setPlayerImage={setPlayerImage}
                    setPartnerImage={setPartnerImage}
                    playerImage={playerImage}
                    partnerImage={partnerImage}
                    onStart={handleStartGame}
                    onTestMode={handleTestMode}
                />
            )}

            {gameState === 'playing' && (
                <PhaserGame
                    playerImage={playerImage}
                    partnerImage={partnerImage}
                    onRestart={() => setGameState('upload')}
                />
            )}
        </div>
    );
};

export default GameContainer;
