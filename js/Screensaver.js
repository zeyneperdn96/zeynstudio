/* ========================================
   XP SCREENSAVER - Starfield
   Activates after idle, dismissed on input
   ======================================== */

class Screensaver {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.overlay = null;
        this.active = false;
        this.enabled = false;
        this.idleTimer = null;
        this.animFrame = null;
        this.stars = [];
        this.IDLE_TIMEOUT = 30000; // 30 seconds
        this.NUM_STARS = 200;
    }

    initialize() {
        this._createDOM();
        this._initStars();
        this._bindEvents();
        this.enabled = true;
        this._resetIdle();
    }

    _createDOM() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'screensaver-overlay';

        this.canvas = document.createElement('canvas');
        this.canvas.className = 'screensaver-canvas';
        this.overlay.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.overlay);

        this._resize();
    }

    _resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    _initStars() {
        this.stars = [];
        for (let i = 0; i < this.NUM_STARS; i++) {
            this.stars.push({
                x: Math.random() * 2 - 1,      // -1 to 1 from center
                y: Math.random() * 2 - 1,
                z: Math.random() * 1.5 + 0.5,   // depth
                speed: Math.random() * 0.02 + 0.005
            });
        }
    }

    _bindEvents() {
        const dismiss = () => {
            if (this.active) {
                this.deactivate();
            }
            this._resetIdle();
        };

        // Any user input dismisses screensaver and resets idle
        document.addEventListener('mousemove', dismiss);
        document.addEventListener('mousedown', dismiss);
        document.addEventListener('keydown', dismiss);
        document.addEventListener('touchstart', dismiss, { passive: true });
        document.addEventListener('scroll', dismiss, { passive: true });

        window.addEventListener('resize', () => this._resize());
    }

    _resetIdle() {
        clearTimeout(this.idleTimer);
        if (!this.enabled) return;
        this.idleTimer = setTimeout(() => {
            if (this.enabled && !this.active) {
                this.activate();
            }
        }, this.IDLE_TIMEOUT);
    }

    activate() {
        if (this.active) return;
        this.active = true;
        this._resize();
        this._initStars();
        this.overlay.classList.add('screensaver-active');
        this._animate();
    }

    deactivate() {
        this.active = false;
        this.overlay.classList.remove('screensaver-active');
        if (this.animFrame) {
            cancelAnimationFrame(this.animFrame);
            this.animFrame = null;
        }
    }

    _animate() {
        if (!this.active) return;

        const w = this.canvas.width;
        const h = this.canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        // Fade trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        this.ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < this.stars.length; i++) {
            const s = this.stars[i];

            // Move star toward viewer
            s.z -= s.speed;

            // Reset if past viewer
            if (s.z <= 0.01) {
                s.x = Math.random() * 2 - 1;
                s.y = Math.random() * 2 - 1;
                s.z = 1.5;
                s.speed = Math.random() * 0.02 + 0.005;
            }

            // Project 3D to 2D
            const px = cx + (s.x / s.z) * cx;
            const py = cy + (s.y / s.z) * cy;

            // Size based on depth
            const size = Math.max(0.5, (1 - s.z) * 3);

            // Brightness based on depth
            const brightness = Math.min(255, Math.floor((1 - s.z / 1.5) * 255));

            // Draw star
            this.ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            this.ctx.beginPath();
            this.ctx.arc(px, py, size, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw streak line for fast/close stars
            if (s.z < 0.5) {
                const streakLen = (1 - s.z) * 8;
                const dx = (s.x / s.z) - (s.x / (s.z + s.speed * 3));
                const dy = (s.y / s.z) - (s.y / (s.z + s.speed * 3));
                this.ctx.strokeStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.5)`;
                this.ctx.lineWidth = size * 0.5;
                this.ctx.beginPath();
                this.ctx.moveTo(px, py);
                this.ctx.lineTo(px - dx * streakLen * cx * 0.1, py - dy * streakLen * cy * 0.1);
                this.ctx.stroke();
            }
        }

        this.animFrame = requestAnimationFrame(() => this._animate());
    }

    destroy() {
        this.enabled = false;
        this.deactivate();
        clearTimeout(this.idleTimer);
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
    }
}

window.Screensaver = new Screensaver();
