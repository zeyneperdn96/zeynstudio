/* ========================================
   XP SOUND EFFECTS
   Web Audio API synthesized sounds
   ======================================== */

class SoundEffects {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.initialized = false;
    }

    // Lazy-init AudioContext on first user interaction
    _ensureContext() {
        if (this.ctx) return true;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            return true;
        } catch (e) {
            return false;
        }
    }

    play(name) {
        if (!this.enabled) return;
        if (!this._ensureContext()) return;

        // Resume if suspended (browser autoplay policy)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        switch (name) {
            case 'windowOpen': this._windowOpen(); break;
            case 'windowClose': this._windowClose(); break;
            case 'click': this._click(); break;
            case 'error': this._error(); break;
            case 'startMenu': this._startMenu(); break;
            case 'notify': this._notify(); break;
        }
    }

    // Short ascending chime - window open
    _windowOpen() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.linearRampToValueAtTime(600, t + 0.08);
        osc.frequency.linearRampToValueAtTime(800, t + 0.15);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.2);
    }

    // Short descending tone - window close
    _windowClose() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.linearRampToValueAtTime(300, t + 0.15);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.18);
    }

    // Soft click
    _click() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.05);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.06);
    }

    // Short warning beep
    _error() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.setValueAtTime(0.08, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.15);
    }

    // Pop/chime for start menu
    _startMenu() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, t);
        osc.frequency.linearRampToValueAtTime(700, t + 0.06);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
    }

    // Notification chime for Clippy
    _notify() {
        const t = this.ctx.currentTime;
        // Two-tone chime
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        const gain2 = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523, t); // C5
        gain1.gain.setValueAtTime(0.1, t);
        gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(t);
        osc1.stop(t + 0.15);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659, t + 0.08); // E5
        gain2.gain.setValueAtTime(0, t);
        gain2.gain.setValueAtTime(0.1, t + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(t);
        osc2.stop(t + 0.22);
    }
}

window.SoundEffects = new SoundEffects();
