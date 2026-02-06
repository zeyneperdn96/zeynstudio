/* ========================================
   MSN TOAST NOTIFICATIONS
   Classic MSN Messenger style popups
   ======================================== */

class MsnNotify {
    constructor() {
        this.container = null;
        this.queue = [];
        this.showing = false;
        this.enabled = false;
        this.intervalId = null;
        this.shownCount = 0;

        this.notifications = [
            {
                title: "Zeynep Erden",
                subtitle: "is now online",
                icon: "assets/icons/zeyn-avatar.png"
            },
            {
                title: "MSN Messenger",
                subtitle: "You have 1 new message",
                icon: "assets/icons/zeyn-chat-logo.png"
            },
            {
                title: "Zeynep says:",
                subtitle: "Check out my projects! :)",
                icon: "assets/icons/zeyn-avatar.png"
            },
            {
                title: "MSN Messenger",
                subtitle: "Zeynep wants to chat!",
                icon: "assets/icons/zeyn-chat-logo.png"
            },
            {
                title: "Zeynep says:",
                subtitle: "Don't forget to see Resume!",
                icon: "assets/icons/zeyn-avatar.png"
            },
            {
                title: "MSN Messenger",
                subtitle: "Zeynep changed her status",
                icon: "assets/icons/zeyn-chat-logo.png"
            }
        ];
    }

    initialize() {
        this._createContainer();
        this.enabled = true;

        // First notification after 8 seconds
        setTimeout(() => {
            if (this.enabled) this._showRandom();
        }, 8000);

        // Then every 40-60 seconds randomly
        this._scheduleNext();
    }

    _createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'msn-notify-container';
        document.body.appendChild(this.container);
    }

    _scheduleNext() {
        if (this.intervalId) clearTimeout(this.intervalId);
        const delay = 40000 + Math.random() * 20000; // 40-60s
        this.intervalId = setTimeout(() => {
            if (this.enabled && this.shownCount < 10) {
                this._showRandom();
            }
            if (this.shownCount < 10) {
                this._scheduleNext();
            }
        }, delay);
    }

    _showRandom() {
        const notif = this.notifications[Math.floor(Math.random() * this.notifications.length)];
        this.show(notif.title, notif.subtitle, notif.icon);
    }

    show(title, subtitle, iconSrc) {
        if (!this.enabled || !this.container) return;

        const toast = document.createElement('div');
        toast.className = 'msn-toast';
        toast.innerHTML = `
            <div class="msn-toast-header">
                <span class="msn-toast-header-text">MSN Messenger</span>
                <button class="msn-toast-close">x</button>
            </div>
            <div class="msn-toast-body">
                <img src="${iconSrc}" alt="" class="msn-toast-avatar">
                <div class="msn-toast-content">
                    <div class="msn-toast-title">${title}</div>
                    <div class="msn-toast-subtitle">${subtitle}</div>
                </div>
            </div>
        `;

        // Close button
        toast.querySelector('.msn-toast-close').addEventListener('click', (e) => {
            e.stopPropagation();
            this._dismiss(toast);
        });

        // Click to open chat
        toast.querySelector('.msn-toast-body').addEventListener('click', () => {
            if (window.windowManager) {
                window.windowManager.openWindow('zeynshat');
            }
            this._dismiss(toast);
        });

        this.container.appendChild(toast);
        this.shownCount++;

        // Play notify sound
        if (window.SoundEffects) {
            window.SoundEffects.play('notify');
        }

        // Trigger slide-in
        requestAnimationFrame(() => {
            toast.classList.add('msn-toast-visible');
        });

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            this._dismiss(toast);
        }, 5000);
    }

    _dismiss(toast) {
        if (!toast || !toast.parentNode) return;
        toast.classList.remove('msn-toast-visible');
        toast.classList.add('msn-toast-leaving');
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 400);
    }

    destroy() {
        this.enabled = false;
        if (this.intervalId) clearTimeout(this.intervalId);
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

window.MsnNotify = new MsnNotify();
