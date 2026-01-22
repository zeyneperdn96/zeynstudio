/* ================================================================
   START MENU MANAGER
   Two-column Start menu with programs, links, and system controls
   =============================================================== */

class StartMenu {
    constructor(windowManager) {
        this.windowManager = windowManager;
        this.menu = document.getElementById('start-menu');
        this.startBtn = document.getElementById('start-btn');
        this.isOpen = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Start button toggle
        this.startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // Menu items
        const menuItems = this.menu.querySelectorAll('.start-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;

                if (action === 'window') {
                    const windowId = item.dataset.window;
                    this.windowManager.openWindow(windowId);
                    this.close();
                } else if (action === 'link') {
                    const linkType = item.dataset.link;
                    this.handleLink(linkType);
                    this.close();
                }
            });
        });

        // Log Off / Shut Down
        document.getElementById('logoff-btn').addEventListener('click', () => {
            this.handleLogOff();
        });

        document.getElementById('shutdown-btn').addEventListener('click', () => {
            this.handleShutDown();
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target) && !this.startBtn.contains(e.target)) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.menu.classList.remove('hidden');
        this.startBtn.classList.add('active');
        this.isOpen = true;
    }

    close() {
        this.menu.classList.add('hidden');
        this.startBtn.classList.remove('active');
        this.isOpen = false;
    }

    handleLink(linkType) {
        const config = window.CONFIG.social;
        const links = {
            instagram: config.instagram,
            github: config.github,
            linkedin: config.linkedin,
            resume: window.CONFIG.assets.resume
        };

        const url = links[linkType];
        if (url) {
            window.open(url, '_blank');
        }
    }

    handleLogOff() {
        if (confirm('Log off Zeyn XP?')) {
            this.close();

            // Fade out desktop
            const desktop = document.getElementById('desktop-container');
            desktop.style.transition = 'opacity 0.5s';
            desktop.style.opacity = '0';

            setTimeout(() => {
                desktop.classList.add('hidden');
                desktop.style.opacity = '1';

                // Show login screen
                const bootContainer = document.getElementById('boot-container');
                const loginStage = document.getElementById('boot-login');

                bootContainer.classList.remove('hidden');
                bootContainer.style.opacity = '1';
                loginStage.classList.add('active');

                // Close all windows
                this.windowManager.windows.forEach((data, id) => {
                    this.windowManager.closeWindow(id);
                });
            }, 500);
        }
    }

    handleShutDown() {
        if (confirm('Shut down Zeyn XP?')) {
            this.close();

            // Create shutdown screen
            const shutdownScreen = document.createElement('div');
            shutdownScreen.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(180deg, #0054E3 0%, #000 100%);
                z-index: 99999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-family: Tahoma, sans-serif;
                opacity: 0;
                transition: opacity 0.5s;
            `;

            shutdownScreen.innerHTML = `
                <h1 style="font-size: 48px; margin-bottom: 20px;">Zeyn XP</h1>
                <p style="font-size: 18px; margin-bottom: 40px;">It's now safe to turn off your computer.</p>
                <button class="btn btn-primary" onclick="location.reload()">Restart</button>
            `;

            document.body.appendChild(shutdownScreen);
            setTimeout(() => shutdownScreen.style.opacity = '1', 10);
        }
    }
}

window.StartMenu = StartMenu;
