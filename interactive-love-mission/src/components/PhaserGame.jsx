```
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

const PhaserGame = ({ playerImage, partnerImage, onRestart }) => {
  const gameContainerRef = useRef(null);
  const gameInstanceRef = useRef(null);
  
  // Refs for touch controls to communicate with Phaser scene
  const controlsRef = useRef({
    left: false,
    right: false,
    jump: false
  });

  useEffect(() => {
    if (!gameContainerRef.current) return;

    class GameScene extends Phaser.Scene {
      constructor() {
        super({ key: 'GameScene' });
      }

      preload() {
        if (playerImage) this.load.image('userHero', playerImage);
        if (partnerImage) this.load.image('userLove', partnerImage);
      }

      create() {
        // 1. BACKGROUND (PARALLAX)
        this.createSky();
        this.mountains = this.add.tileSprite(0, this.scale.height, this.scale.width, 400, 'mountains').setOrigin(0, 1).setScrollFactor(0.2);
        this.clouds = this.add.tileSprite(0, 100, this.scale.width, 200, 'clouds').setOrigin(0, 0).setScrollFactor(0.5);

        // 2. PLATFORMS & LEVEL
        this.platforms = this.physics.add.staticGroup();
        this.createLevel();

        // 3. PLAYER
        this.player = this.add.container(100, 400);
        this.player.setSize(40, 70);
        this.physics.world.enable(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setBounce(0.1);

        // Body
        this.pBody = this.add.rectangle(0, 25, 40, 45, 0x3B82F6).setStrokeStyle(2, 0xffffff);
        
        // Head
        const playerTexture = this.textures.exists('userHero') ? 'userHero' : 'face_hero';
        const rawHead = this.add.image(0, -15, playerTexture);
        const scaleX = 60 / rawHead.width;
        rawHead.setScale(scaleX);
        
        // Mask
        const maskShape = this.make.graphics();
        maskShape.fillCircle(0, 0, 30);
        const mask = maskShape.createGeometryMask();
        rawHead.setMask(mask);
        
        // Border
        const border = this.add.graphics();
        border.lineStyle(4, 0xffffff);
        border.strokeCircle(0, -15, 30);

        this.player.add([this.pBody, rawHead, border]);
        this.physics.add.collider(this.player, this.platforms);

        // 4. ENEMIES
        this.enemies = this.physics.add.group({
            bounceX: 1, bounceY: 0, collideWorldBounds: true
        });
        this.spawnEnemy(600, 400);
        this.spawnEnemy(1400, 300); 
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this);

        // 5. PARTNER (GOAL)
        this.createPartner(2800, 400);

        // 6. CAMERA & CONTROLS
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, 3000, this.scale.height);
        this.cursors = this.input.keyboard.createCursorKeys();

        // Spikes
        this.physics.add.collider(this.player, this.spikes, this.hitSpike, null, this);

        // Trail Particles
        this.trail = this.add.particles(0,0, 'particle_star', {
            follow: this.player,
            followOffset: { y: 40 },
            scale: { start: 0.4, end: 0 },
            speed: 50,
            lifespan: 400,
            on: false
        });
      }

      update() {
        // Parallax
        this.mountains.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.clouds.tilePositionX = this.cameras.main.scrollX * 0.6 + this.time.now * 0.05;

        // Enemy AI
        this.enemies.children.iterate((child) => {
            if (child.body.blocked.left) child.setVelocityX(100);
            else if (child.body.blocked.right) child.setVelocityX(-100);
        });

        const speed = 280;
        const jump = -650;
        const body = this.player.body;

        if(body.y > this.scale.height) this.scene.restart();

        // Movement
        if (this.cursors.left.isDown || controlsRef.current.left) {
            body.setVelocityX(-speed);
            this.player.setScale(-1, 1); // Flip
            this.trail.start();
        } else if (this.cursors.right.isDown || controlsRef.current.right) {
            body.setVelocityX(speed);
            this.player.setScale(1, 1); // Normal
            this.trail.start();
        } else {
            body.setVelocityX(0);
            this.trail.stop();
        }

        // Jump
        if ((this.cursors.up.isDown || controlsRef.current.jump) && body.touching.down) {
            body.setVelocityY(jump);
        }
      }

      // --- ASSETS & LEVEL ---
      createSky() {
        if(!this.textures.exists('mountains')) {
            const m = this.make.graphics({x:0, y:0, add:false});
            m.fillStyle(0x6c5ce7); m.fillTriangle(0,400, 200,100, 400,400);
            m.fillStyle(0xa29bfe); m.fillTriangle(200,400, 500,50, 800,400);
            m.generateTexture('mountains', 800, 400);
        }
        if(!this.textures.exists('clouds')) {
            const c = this.make.graphics({x:0, y:0, add:false});
            c.fillStyle(0xffffff, 0.8); 
            c.fillCircle(50,50,30); c.fillCircle(90,40,40); c.fillCircle(130,50,30);
            c.generateTexture('clouds', 200, 100);
        }
        if(!this.textures.exists('particle_star')) {
            const p = this.make.graphics({x:0, y:0, add:false});
            p.fillStyle(0xFFD700); p.fillStar(10,10, 5, 10, 5);
            p.generateTexture('particle_star', 20, 20);
        }
        if(!this.textures.exists('enemy_slime')) {
            const e = this.make.graphics({x:0, y:0, add:false});
            e.fillStyle(0xff0000); e.fillCircle(20,20,20);
            e.fillStyle(0x000000); e.fillCircle(10,15,5); e.fillCircle(30,15,5);
            e.generateTexture('enemy_slime', 40, 40);
        }
        // Dummy faces if needed
        if(!this.textures.exists('face_hero')) {
             const c = document.createElement('canvas'); c.width=100; c.height=100;
             const x = c.getContext('2d');
             x.beginPath(); x.arc(50,50,50,0,7); x.fillStyle='#2196F3'; x.fill();
             x.font='50px serif'; x.textAlign='center'; x.fillText('😎', 50, 65);
             this.textures.addCanvas('face_hero', c);
        }
        if(!this.textures.exists('face_love')) {
             const c = document.createElement('canvas'); c.width=100; c.height=100;
             const x = c.getContext('2d');
             x.beginPath(); x.arc(50,50,50,0,7); x.fillStyle='#E91E63'; x.fill();
             x.font='50px serif'; x.textAlign='center'; x.fillText('😍', 50, 65);
             this.textures.addCanvas('face_love', c);
        }
      }

      createLevel() {
        // Block Texture
        if(!this.textures.exists('block')) {
            const ground = this.make.graphics({x:0, y:0, add:false});
            ground.fillStyle(0x4CAF50); ground.fillRect(0,0,50,50);
            ground.fillStyle(0x388E3C); ground.fillRect(0,40,50,10);
            ground.generateTexture('block', 50, 50);
        }

        this.buildPlatform(0, this.scale.height - 50, 30);
        this.buildPlatform(600, this.scale.height - 200, 5);
        this.buildPlatform(1000, this.scale.height - 350, 8);
        this.buildPlatform(1600, this.scale.height - 150, 20);

        this.spikes = this.physics.add.staticGroup();
        this.addSpike(500, this.scale.height - 50);
        this.addSpike(1300, this.scale.height - 50);
      }

      buildPlatform(startX, startY, widthBlocks) {
        for(let i=0; i<widthBlocks; i++) {
            const b = this.platforms.create(startX + (i*50), startY, 'block');
            b.refreshBody();
        }
      }

      addSpike(x, y) {
        if(!this.textures.exists('spike')) {
            const s = this.make.graphics({x:0, y:0, add:false});
            s.fillStyle(0x7f8c8d); s.fillTriangle(0,40, 20,0, 40,40);
            s.generateTexture('spike', 40, 40);
        }
        const spike = this.spikes.create(x, y - 20, 'spike');
        spike.body.setSize(20, 20).setOffset(10, 20);
      }

      spawnEnemy(x, y) {
        const enemy = this.enemies.create(x, y, 'enemy_slime');
        enemy.setVelocityX(100);
        enemy.setBounce(1);
        enemy.setCollideWorldBounds(true);
      }

      createPartner(x, y) {
        this.partner = this.add.container(x, y);
        this.partner.setSize(40, 70);
        this.physics.world.enable(this.partner);
        this.partner.body.setAllowGravity(false);
        this.partner.body.setImmovable(true);

        const tBody = this.add.rectangle(0, 25, 40, 45, 0xFF69B4).setStrokeStyle(2, 0xffffff);
        const partnerTexture = this.textures.exists('userLove') ? 'userLove' : 'face_love';
        const rawHead = this.add.image(0, -15, partnerTexture);
        const scaleX = 60 / rawHead.width;
        rawHead.setScale(scaleX);
        
        const maskShape = this.make.graphics();
        maskShape.fillCircle(0, 0, 30);
        const mask = maskShape.createGeometryMask();
        rawHead.setMask(mask);
        
        const border = this.add.graphics();
        border.lineStyle(4, 0xffffff);
        border.strokeCircle(0, -15, 30);

        this.partner.add([tBody, rawHead, border]);
        this.physics.add.overlap(this.player, this.partner, this.winGame, null, this);
      }

      hitSpike() {
        this.cameras.main.shake(200, 0.01);
        this.player.setTint(0xff0000);
        this.time.delayedCall(300, () => this.scene.restart());
      }

      hitEnemy(player, enemy) {
        if(player.body.velocity.y > 0 && player.y < enemy.y) {
            enemy.destroy();
            player.setVelocityY(-400);
        } else {
            this.hitSpike();
        }
      }

      winGame() {
        this.physics.pause();
        const cam = this.cameras.main;
        
        for(let i=0; i<50; i++) {
            const p = this.add.circle(cam.scrollX + Math.random()*cam.width, cam.scrollY + Math.random()*cam.height, 5, Math.random() * 0xffffff);
            this.tweens.add({
                targets: p, y: p.y + 200, alpha: 0, duration: 1000 + Math.random()*1000
            });
        }

        const box = this.add.rectangle(cam.scrollX + cam.width/2, cam.height/2, 300, 150, 0xffffff).setAlpha(0.9);
        this.add.text(cam.scrollX + cam.width/2, cam.height/2 - 20, 'LOVE WINS!', {
            fontSize: '32px', color: '#ff0055', fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(cam.scrollX + cam.width/2, cam.height/2 + 30, 'Tap to Restart', {
            fontSize: '16px', color: '#333'
        }).setOrigin(0.5);

        this.input.on('pointerdown', () => this.scene.restart());
      }
    }

    const config = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#87CEEB',
      pixelArt: false,
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 1000 }, debug: false }
      },
      scene: GameScene
    };

    gameInstanceRef.current = new Phaser.Game(config);

    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
      }
    };
  }, [playerImage, partnerImage]);

  // Touch Handlers
  const handleTouchStart = (key) => { controlsRef.current[key] = true; };
  const handleTouchEnd = (key) => { controlsRef.current[key] = false; };

  return (
    <>
      <div ref={gameContainerRef} className="w-full h-full" />
      
      {/* Mobile Controls Overlay */}
      <div className="absolute bottom-8 left-0 w-full px-8 flex justify-between pointer-events-none z-30">
        <div className="flex gap-4 pointer-events-auto">
          <button 
            className="w-20 h-20 bg-white/30 backdrop-blur-md border-2 border-white rounded-full flex items-center justify-center active:bg-white/60 active:scale-95 transition-all"
            onTouchStart={() => handleTouchStart('left')}
            onTouchEnd={() => handleTouchEnd('left')}
            onMouseDown={() => handleTouchStart('left')}
            onMouseUp={() => handleTouchEnd('left')}
          >
            <ArrowLeft className="w-10 h-10 text-white" />
          </button>
          <button 
            className="w-20 h-20 bg-white/30 backdrop-blur-md border-2 border-white rounded-full flex items-center justify-center active:bg-white/60 active:scale-95 transition-all"
            onTouchStart={() => handleTouchStart('right')}
            onTouchEnd={() => handleTouchEnd('right')}
            onMouseDown={() => handleTouchStart('right')}
            onMouseUp={() => handleTouchEnd('right')}
          >
            <ArrowRight className="w-10 h-10 text-white" />
          </button>
        </div>

        <button 
          className="w-20 h-20 bg-white/30 backdrop-blur-md border-2 border-white rounded-full flex items-center justify-center pointer-events-auto active:bg-white/60 active:scale-95 transition-all"
          onTouchStart={() => handleTouchStart('jump')}
          onTouchEnd={() => handleTouchEnd('jump')}
          onMouseDown={() => handleTouchStart('jump')}
          onMouseUp={() => handleTouchEnd('jump')}
        >
          <ArrowUp className="w-10 h-10 text-white" />
        </button>
      </div>
    </>
  );
};

export default PhaserGame;
```
