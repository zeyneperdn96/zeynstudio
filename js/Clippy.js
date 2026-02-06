/* ========================================
   ROVER ASSISTANT
   XP Search Dog style animated helper
   ======================================== */

class ClippyAssistant {
    constructor() {
        this.element = null;
        this.bubbleEl = null;
        this.dismissed = false;
        this.visible = false;
        this.messageTimeout = null;
        this.reappearTimeout = null;
        this.idleTimeout = null;
        this.lastContext = null;

        // Context-aware messages
        this.messages = {
            welcome: [
                "Pika pika! Welcome to my portfolio!",
                "Hey there! I'm here to help you explore!",
                "Welcome! Wanna look around?"
            ],
            idle: [
                "Click My Work to see the projects!",
                "Try the Start menu for all programs!",
                "Wanna check out the Gallery?",
                "Click Resume to see skills & experience!",
                "Ask me anything on Zeyn Chat!"
            ],
            work: [
                "Here are the projects! Pick one and explore.",
                "Every project tells a story..."
            ],
            paint: [
                "Time to channel your inner Bob Ross!",
                "Let's create a masterpiece!"
            ],
            games: [
                "Take a break, play a game!",
                "Game time! Pika pika!"
            ],
            cv: [
                "Here are my skills and experience!",
                "Check out the resume!"
            ],
            zeynshat: [
                "Wanna ask Zeynep a question?",
                "Ready for a chat?"
            ],
            showreel: [
                "Music time! Listen to some tunes!",
                "Let's vibe to some music!"
            ],
            about: [
                "Get to know me better!",
                "Curious about who I am?"
            ],
            illustration: [
                "Check out the illustrations!",
                "Every drawing tells a feeling..."
            ],
            terminal: [
                "Hacker mode activated!",
                "Welcome to the command line!"
            ],
            random: [
                "Pika pika! I'm here to help!",
                "Did you know? This site is Windows XP themed!",
                "Double-click the icons on the left to open windows!",
                "Pika! Everything is just a click away!",
                "I choose you... to explore this portfolio!"
            ]
        };
    }

    initialize() {
        if (this.element) return;
        this._createDOM();

        // Appear after 3 seconds
        setTimeout(() => {
            if (!this.dismissed) {
                this.show();
                this.showMessage(this._pick(this.messages.welcome));
            }
        }, 3000);
    }

    _createDOM() {
        // Main container
        this.element = document.createElement('div');
        this.element.className = 'clippy-container';
        this.element.innerHTML = `
            <div class="clippy-dismiss" title="Kapat">x</div>
            <div class="clippy-character">
                <img src="assets/icons/rover.png" alt="Rover" class="clippy-img" draggable="false">
            </div>
            <div class="clippy-bubble">
                <div class="clippy-bubble-text"></div>
                <div class="clippy-bubble-tail"></div>
            </div>
        `;

        this.bubbleEl = this.element.querySelector('.clippy-bubble');
        this.bubbleTextEl = this.element.querySelector('.clippy-bubble-text');

        // Click on character -> wave + new message
        this.element.querySelector('.clippy-character').addEventListener('click', (e) => {
            e.stopPropagation();
            this._wave();
            const msg = this._pick(this.messages.random.concat(this.messages.idle));
            this.showMessage(msg);
        });

        // Dismiss button
        this.element.querySelector('.clippy-dismiss').addEventListener('click', (e) => {
            e.stopPropagation();
            this.dismiss();
        });

        document.getElementById('desktop-container').appendChild(this.element);
    }

    show() {
        if (this.dismissed || this.visible) return;
        this.visible = true;
        this.element.classList.add('clippy-visible');
        this._startIdleTimer();
    }

    hide() {
        this.visible = false;
        this.element.classList.remove('clippy-visible');
        this._hideBubble();
        this._clearTimers();
    }

    dismiss() {
        this.dismissed = true;
        this.element.classList.add('clippy-leaving');
        setTimeout(() => {
            this.hide();
            this.element.classList.remove('clippy-leaving');
        }, 500);
    }

    showMessage(text) {
        if (!this.visible || this.dismissed) return;

        // Play notify sound
        if (window.SoundEffects) {
            window.SoundEffects.play('notify');
        }

        this.bubbleTextEl.textContent = text;
        this.bubbleEl.classList.add('clippy-bubble-visible');

        // Hide after 6 seconds
        clearTimeout(this.messageTimeout);
        this.messageTimeout = setTimeout(() => {
            this._hideBubble();
        }, 6000);

        // Reset idle timer
        this._startIdleTimer();
    }

    // Show context message when a window opens
    onWindowOpen(windowId) {
        if (!this.visible || this.dismissed) return;
        // Don't repeat same context
        if (this.lastContext === windowId) return;
        this.lastContext = windowId;

        const contextMessages = this.messages[windowId];
        if (contextMessages) {
            setTimeout(() => {
                this.showMessage(this._pick(contextMessages));
            }, 500);
        }
    }

    _hideBubble() {
        if (this.bubbleEl) {
            this.bubbleEl.classList.remove('clippy-bubble-visible');
        }
    }

    _wave() {
        const char = this.element.querySelector('.clippy-character');
        char.classList.remove('clippy-wave');
        // Force reflow
        void char.offsetWidth;
        char.classList.add('clippy-wave');
        setTimeout(() => char.classList.remove('clippy-wave'), 600);
    }

    _startIdleTimer() {
        clearTimeout(this.idleTimeout);
        this.idleTimeout = setTimeout(() => {
            if (this.visible && !this.dismissed) {
                this.showMessage(this._pick(this.messages.idle.concat(this.messages.random)));
            }
        }, 25000); // Show idle message every 25s
    }

    _clearTimers() {
        clearTimeout(this.messageTimeout);
        clearTimeout(this.reappearTimeout);
        clearTimeout(this.idleTimeout);
    }

    _pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}

window.Clippy = new ClippyAssistant();
