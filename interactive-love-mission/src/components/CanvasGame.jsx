import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

const CanvasGame = ({ playerImage, partnerImage, onRestart }) => {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const keysRef = useRef({ ArrowRight: false, ArrowLeft: false, ArrowUp: false });

    // Game State Refs (to avoid re-renders)
    const gameState = useRef({
        running: false,
        cameraX: 0,
        player: { x: 100, y: 100, w: 40, h: 60, vx: 0, vy: 0, speed: 5, jump: -14, grounded: false, dead: false },
        platforms: [],
        enemies: [],
        particles: [],
        clouds: [],
        partner: { x: 0, y: 0, w: 50, h: 60 },
        imgPlayer: null,
        imgPartner: null
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const GRAVITY = 0.6;

        // Initialize Images
        const pImg = new Image();
        pImg.src = playerImage || createDummyImg('blue', '🦸');
        gameState.current.imgPlayer = pImg;

        const lImg = new Image();
        lImg.src = partnerImage || createDummyImg('pink', '❤️');
        gameState.current.imgPartner = lImg;

        // Resize Handler
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        // Init Level
        initLevel(canvas.height);
        gameState.current.running = true;

        // Game Loop
        const loop = () => {
            if (!gameState.current.running) return;
            update(canvas.height, canvas.width);
            draw(ctx, canvas.width, canvas.height);
            requestRef.current = requestAnimationFrame(loop);
        };
        requestRef.current = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(requestRef.current);
            gameState.current.running = false;
        };
    }, [playerImage, partnerImage]);

    // --- LOGIC ---

    const initLevel = (height) => {
        const floorY = height - 50;
        const state = gameState.current;

        state.platforms = [];
        state.enemies = [];
        state.clouds = [];

        // Ground
        state.platforms.push({ x: -100, y: floorY, w: 5000, h: 200, type: 'ground' });

        // Platforms
        state.platforms.push({ x: 500, y: floorY - 120, w: 200, h: 40, type: 'brick' });
        state.platforms.push({ x: 800, y: floorY - 240, w: 150, h: 40, type: 'brick' });
        state.platforms.push({ x: 1100, y: floorY - 150, w: 300, h: 40, type: 'brick' });

        // Pipes
        state.platforms.push({ x: 1500, y: floorY - 100, w: 80, h: 100, type: 'pipe' });
        state.platforms.push({ x: 1800, y: floorY - 160, w: 80, h: 160, type: 'pipe' });

        // Enemies
        state.enemies.push({ x: 600, y: floorY - 40, w: 40, h: 40, vx: -2, dead: false });
        state.enemies.push({ x: 1200, y: floorY - 190, w: 40, h: 40, vx: -2, dead: false });
        state.enemies.push({ x: 2000, y: floorY - 40, w: 40, h: 40, vx: -2, dead: false });

        // Partner
        state.partner = { x: 2800, y: floorY - 60, w: 50, h: 60 };
        state.platforms.push({ x: 2700, y: floorY, w: 300, h: 200, type: 'ground' });

        // Player Reset
        state.player = { x: 100, y: floorY - 200, w: 40, h: 60, vx: 0, vy: 0, speed: 5, jump: -14, grounded: false, dead: false };
        state.cameraX = 0;

        // Clouds
        for (let i = 0; i < 20; i++) {
            state.clouds.push({ x: Math.random() * 4000, y: Math.random() * 200, size: 30 + Math.random() * 50 });
        }
    };

    const update = (canvasHeight, canvasWidth) => {
        const state = gameState.current;
        const player = state.player;
        const keys = keysRef.current;
        const GRAVITY = 0.6;

        if (player.dead) return;

        // Movement
        if (keys.ArrowRight) player.vx = player.speed;
        else if (keys.ArrowLeft) player.vx = -player.speed;
        else player.vx *= 0.8;

        player.vy += GRAVITY;
        player.x += player.vx;
        player.y += player.vy;

        // Jump
        if (keys.ArrowUp && player.grounded) {
            player.vy = player.jump;
            player.grounded = false;
        }
        player.grounded = false;

        // Collisions
        for (let p of state.platforms) {
            if (checkCollide(player, p)) {
                if (player.vy > 0 && player.y + player.h < p.y + player.vy + 10) {
                    player.grounded = true;
                    player.vy = 0;
                    player.y = p.y - player.h;
                }
            }
        }

        // Enemies
        for (let e of state.enemies) {
            if (e.dead) continue;
            e.x += e.vx;
            if (Math.random() < 0.01) e.vx *= -1;

            if (checkCollide(player, e)) {
                if (player.vy > 0 && player.y + player.h < e.y + 20) {
                    e.dead = true;
                    player.vy = -8;
                    spawnParticles(e.x, e.y, 'gray');
                } else {
                    gameOver();
                }
            }
        }

        // Win
        if (checkCollide(player, state.partner)) {
            winGame(canvasWidth, canvasHeight);
        }

        // Fall
        if (player.y > canvasHeight) gameOver();

        // Camera
        let targetCamX = player.x - canvasWidth / 3;
        if (targetCamX < 0) targetCamX = 0;
        state.cameraX += (targetCamX - state.cameraX) * 0.1;
    };

    const draw = (ctx, width, height) => {
        const state = gameState.current;

        // Sky
        ctx.fillStyle = "#5C94FC";
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.translate(-state.cameraX, 0);

        // Clouds
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        for (let c of state.clouds) {
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
            ctx.arc(c.x + c.size * 0.8, c.y + 10, c.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
        }

        // Platforms
        for (let p of state.platforms) {
            if (p.type === 'ground') {
                ctx.fillStyle = "#654321"; ctx.fillRect(p.x, p.y, p.w, p.h);
                ctx.fillStyle = "#4CAF50"; ctx.fillRect(p.x, p.y, p.w, 20);
            } else if (p.type === 'pipe') {
                ctx.fillStyle = "#00aa00";
                ctx.fillRect(p.x, p.y, p.w, p.h);
                ctx.strokeStyle = "#004400"; ctx.lineWidth = 4; ctx.strokeRect(p.x, p.y, p.w, p.h);
                ctx.fillRect(p.x - 5, p.y, p.w + 10, 30);
                ctx.strokeRect(p.x - 5, p.y, p.w + 10, 30);
            } else {
                ctx.fillStyle = "#B22222"; ctx.fillRect(p.x, p.y, p.w, p.h);
                ctx.strokeStyle = "black"; ctx.lineWidth = 2; ctx.strokeRect(p.x, p.y, p.w, p.h);
            }
        }

        // Enemies
        for (let e of state.enemies) {
            if (e.dead) continue;
            ctx.fillStyle = "#8B4513";
            ctx.beginPath(); ctx.arc(e.x + e.w / 2, e.y + e.h / 2, e.w / 2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "white";
            ctx.beginPath(); ctx.arc(e.x + 10, e.y + 15, 6, 0, Math.PI * 2);
            ctx.arc(e.x + 30, e.y + 15, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "black";
            ctx.beginPath(); ctx.arc(e.x + 10 + (e.vx > 0 ? 2 : -2), e.y + 15, 2, 0, Math.PI * 2);
            ctx.arc(e.x + 30 + (e.vx > 0 ? 2 : -2), e.y + 15, 2, 0, Math.PI * 2); ctx.fill();
        }

        // Partner
        const partner = state.partner;
        ctx.fillStyle = "#FF69B4";
        ctx.beginPath(); ctx.moveTo(partner.x + partner.w / 2, partner.y);
        ctx.lineTo(partner.x + partner.w, partner.y + partner.h);
        ctx.lineTo(partner.x, partner.y + partner.h); ctx.fill();
        if (state.imgPartner) drawCircleImg(ctx, state.imgPartner, partner.x + partner.w / 2, partner.y - 15, 30);

        // Player
        const player = state.player;
        if (!player.dead) {
            ctx.fillStyle = "blue"; ctx.fillRect(player.x, player.y + 20, player.w, player.h - 20);
            ctx.fillStyle = "red"; ctx.fillRect(player.x, player.y + 20, player.w, 20);
            if (state.imgPlayer) drawCircleImg(ctx, state.imgPlayer, player.x + player.w / 2, player.y + 10, 30);
        }

        // Particles
        updateDrawParticles(ctx);

        ctx.restore();
    };

    // --- HELPERS ---
    const checkCollide = (r1, r2) => {
        return (r1.x < r2.x + r2.w && r1.x + r1.w > r2.x &&
            r1.y < r2.y + r2.h && r1.y + r1.h > r2.y);
    };

    const spawnParticles = (x, y, color) => {
        for (let i = 0; i < 10; i++) {
            gameState.current.particles.push({ x: x, y: y, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, life: 30, color: color });
        }
    };

    const updateDrawParticles = (ctx) => {
        const particles = gameState.current.particles;
        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.x += p.vx; p.y += p.vy; p.life--;
            ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 5, 5);
            if (p.life <= 0) particles.splice(i, 1);
        }
    };

    const drawCircleImg = (c, img, x, y, radius) => {
        c.save();
        c.beginPath(); c.arc(x, y, radius, 0, Math.PI * 2); c.closePath();
        c.clip();
        c.drawImage(img, x - radius, y - radius, radius * 2, radius * 2);
        c.restore();
        c.beginPath(); c.arc(x, y, radius, 0, Math.PI * 2);
        c.lineWidth = 3; c.strokeStyle = "white"; c.stroke();
    };

    const gameOver = () => {
        gameState.current.player.dead = true;
        gameState.current.player.vy = -10;
        setTimeout(() => {
            alert("YANDINIZ! Tekrar Deneyin.");
            onRestart(); // Use the prop to restart (which resets the component)
        }, 500);
    };

    const winGame = (width, height) => {
        gameState.current.running = false;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("❤️ AŞK KAZANDI! ❤️", width / 2, height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Yeniden başlamak için ekrana dokun", width / 2, height / 2 + 50);

        const restartHandler = () => {
            canvas.removeEventListener('click', restartHandler);
            canvas.removeEventListener('touchstart', restartHandler);
            onRestart();
        };
        canvas.addEventListener('click', restartHandler);
        canvas.addEventListener('touchstart', restartHandler);
    };

    const createDummyImg = (color, text) => {
        const c = document.createElement('canvas'); c.width = 64; c.height = 64;
        const x = c.getContext('2d');
        x.fillStyle = color; x.beginPath(); x.arc(32, 32, 32, 0, Math.PI * 2); x.fill();
        x.font = "30px Arial"; x.textAlign = "center"; x.fillText(text, 32, 42);
        return c.toDataURL();
    };

    // Controls
    const handleTouchStart = (key) => { keysRef.current[key] = true; };
    const handleTouchEnd = (key) => { keysRef.current[key] = false; };

    return (
        <>
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Mobile Controls */}
            <div className="absolute bottom-8 left-0 w-full px-8 flex justify-between pointer-events-none z-30">
                <div className="flex gap-4 pointer-events-auto">
                    <button
                        className="w-20 h-20 bg-white/30 backdrop-blur-md border-2 border-white rounded-full flex items-center justify-center active:bg-white/60 active:scale-95 transition-all"
                        onTouchStart={() => handleTouchStart('ArrowLeft')}
                        onTouchEnd={() => handleTouchEnd('ArrowLeft')}
                        onMouseDown={() => handleTouchStart('ArrowLeft')}
                        onMouseUp={() => handleTouchEnd('ArrowLeft')}
                    >
                        <ArrowLeft className="w-10 h-10 text-white" />
                    </button>
                    <button
                        className="w-20 h-20 bg-white/30 backdrop-blur-md border-2 border-white rounded-full flex items-center justify-center active:bg-white/60 active:scale-95 transition-all"
                        onTouchStart={() => handleTouchStart('ArrowRight')}
                        onTouchEnd={() => handleTouchEnd('ArrowRight')}
                        onMouseDown={() => handleTouchStart('ArrowRight')}
                        onMouseUp={() => handleTouchEnd('ArrowRight')}
                    >
                        <ArrowRight className="w-10 h-10 text-white" />
                    </button>
                </div>

                <button
                    className="w-20 h-20 bg-white/30 backdrop-blur-md border-2 border-white rounded-full flex items-center justify-center pointer-events-auto active:bg-white/60 active:scale-95 transition-all"
                    onTouchStart={() => handleTouchStart('ArrowUp')}
                    onTouchEnd={() => handleTouchEnd('ArrowUp')}
                    onMouseDown={() => handleTouchStart('ArrowUp')}
                    onMouseUp={() => handleTouchEnd('ArrowUp')}
                >
                    <ArrowUp className="w-10 h-10 text-white" />
                </button>
            </div>
        </>
    );
};

export default CanvasGame;
