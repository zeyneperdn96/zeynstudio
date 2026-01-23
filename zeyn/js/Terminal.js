/* ========================================
   TERMINAL - MATRIX EFFECT
   Command Prompt with embedded Matrix rain
   ======================================== */

class Terminal {
    static createWindow() {
        const windowHTML = `
            <div class="window-titlebar">
                <span class="window-title">⌨️ Command Prompt</span>
                <div class="window-controls">
                    <button class="win-btn win-minimize" data-action="minimize">_</button>
                    <button class="win-btn win-maximize" data-action="maximize">□</button>
                    <button class="win-btn win-close" data-action="close">×</button>
                </div>
            </div>
            <div class="window-content" style="padding: 0; overflow: hidden; background: #000; position: relative;">
                <canvas id="matrix-canvas" style="display: block; width: 100%; height: 100%;"></canvas>
            </div>
        `;

        return windowHTML;
    }

    static initialize(windowEl) {
        const canvas = windowEl.querySelector('#matrix-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const content = canvas.parentElement;

        // Characters
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()+=<>?';
        const charArray = chars.split('');
        const fontSize = 14;

        let columns, drops, speeds, brightness;
        let animId = null;

        function resize() {
            canvas.width = content.offsetWidth;
            canvas.height = content.offsetHeight;
            initDrops();
        }

        function initDrops() {
            columns = Math.ceil(canvas.width / fontSize);
            drops = new Array(columns).fill(0).map(() => Math.random() * -50);
            speeds = new Array(columns).fill(0).map(() => 0.3 + Math.random() * 0.8);
            brightness = new Array(columns).fill(0).map(() => 0.5 + Math.random() * 0.5);
        }

        resize();

        // Observe resize
        const resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(content);

        function draw() {
            // Fade
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < columns; i++) {
                const char = charArray[Math.floor(Math.random() * charArray.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Lead character (bright)
                const b = brightness[i];
                ctx.fillStyle = `rgba(180, 255, 180, ${b})`;
                ctx.fillText(char, x, y);

                // Random glow on some characters
                if (Math.random() > 0.97) {
                    ctx.fillStyle = `rgba(0, 255, 70, ${b * 0.4})`;
                    ctx.fillText(charArray[Math.floor(Math.random() * charArray.length)], x, y - fontSize * 2);
                }

                // Move
                drops[i] += speeds[i];

                // Reset
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                    speeds[i] = 0.3 + Math.random() * 0.8;
                    brightness[i] = 0.5 + Math.random() * 0.5;
                }
            }

            animId = requestAnimationFrame(draw);
        }

        // Start animation
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        animId = requestAnimationFrame(draw);

        // Store cleanup references
        windowEl._matrixCleanup = () => {
            if (animId) cancelAnimationFrame(animId);
            resizeObserver.disconnect();
            animId = null;
        };
    }

    static cleanup(windowEl) {
        if (windowEl._matrixCleanup) {
            windowEl._matrixCleanup();
        }
    }
}

// Add Terminal template to WindowTemplates
if (window.WindowTemplates) {
    window.WindowTemplates.terminal = Terminal.createWindow;
}

window.Terminal = Terminal;
