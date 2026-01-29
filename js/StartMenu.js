/* ================================================================
   START MENU MANAGER
   Single-column Start menu with right-side All Programs submenu
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
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        // Start button toggle - click
        this.startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // Start button toggle - touch (for faster response on mobile)
        if (isTouchDevice) {
            let startTouchHandled = false;
            this.startBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!startTouchHandled) {
                    startTouchHandled = true;
                    this.toggle();
                    setTimeout(() => { startTouchHandled = false; }, 300);
                }
            });
        }

        // All Programs submenu toggle
        const allProgramsBtn = document.getElementById('all-programs-btn');
        const allProgramsSubmenu = document.getElementById('all-programs-submenu');

        if (allProgramsBtn && allProgramsSubmenu) {
            allProgramsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                allProgramsSubmenu.classList.toggle('hidden');
            });

            if (isTouchDevice) {
                allProgramsBtn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    allProgramsSubmenu.classList.toggle('hidden');
                });
            }

            // Submenu item clicks
            allProgramsSubmenu.querySelectorAll('.all-programs-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.close();
                });
                if (isTouchDevice) {
                    item.addEventListener('touchend', (e) => {
                        e.preventDefault();
                        this.close();
                    });
                }
            });
        }

        // Menu items - helper function for item action
        const handleMenuItem = (item) => {
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
        };

        // Menu items
        const menuItems = this.menu.querySelectorAll('.start-menu-item:not(.all-programs)');
        menuItems.forEach(item => {
            let itemTouchHandled = false;

            item.addEventListener('click', () => {
                if (itemTouchHandled) {
                    itemTouchHandled = false;
                    return;
                }
                handleMenuItem(item);
            });

            if (isTouchDevice) {
                item.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    itemTouchHandled = true;
                    handleMenuItem(item);
                    setTimeout(() => { itemTouchHandled = false; }, 400);
                });
            }
        });

        // Log Off / Shut Down
        const logoffBtn = document.getElementById('logoff-btn');
        const shutdownBtn = document.getElementById('shutdown-btn');

        logoffBtn.addEventListener('click', () => this.handleLogOff());
        shutdownBtn.addEventListener('click', () => this.handleShutDown());

        if (isTouchDevice) {
            logoffBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleLogOff();
            });
            shutdownBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleShutDown();
            });
        }

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target) && !this.startBtn.contains(e.target)) {
                this.close();
            }
        });

        // Touch outside to close (for mobile)
        if (isTouchDevice) {
            document.addEventListener('touchend', (e) => {
                if (this.isOpen && !this.menu.contains(e.target) && !this.startBtn.contains(e.target)) {
                    this.close();
                }
            }, { passive: true });
        }
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
        this.resetAllPrograms();
    }

    resetAllPrograms() {
        const submenu = document.getElementById('all-programs-submenu');
        if (submenu) submenu.classList.add('hidden');
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

            // Create shutdown screen with mobile-responsive styling
            const isMobile = window.innerWidth <= 768;
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
                padding: 20px;
                box-sizing: border-box;
                text-align: center;
            `;

            shutdownScreen.innerHTML = `
                <h1 style="font-size: ${isMobile ? '28px' : '48px'}; margin-bottom: ${isMobile ? '12px' : '20px'}; line-height: 1.2;">Zeyn XP</h1>
                <p style="font-size: ${isMobile ? '14px' : '18px'}; margin-bottom: ${isMobile ? '24px' : '40px'}; padding: 0 10px;">It's now safe to turn off your computer.</p>
                <button class="btn btn-primary" style="min-height: 44px; padding: 12px 24px; font-size: ${isMobile ? '14px' : '16px'};" onclick="location.reload()">Restart</button>
            `;

            document.body.appendChild(shutdownScreen);
            setTimeout(() => shutdownScreen.style.opacity = '1', 10);
        }
    }
}

window.StartMenu = StartMenu;
