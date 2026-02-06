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

    // Helper: wrap touch handler with scroll detection
    _addTouchWithScrollDetect(el, handler) {
        let startX = 0, startY = 0, moved = false;

        el.addEventListener('touchstart', (e) => {
            const t = e.touches[0];
            startX = t.clientX;
            startY = t.clientY;
            moved = false;
        }, { passive: true });

        el.addEventListener('touchmove', (e) => {
            const t = e.touches[0];
            if (Math.abs(t.clientX - startX) > 10 || Math.abs(t.clientY - startY) > 10) {
                moved = true;
            }
        }, { passive: true });

        el.addEventListener('touchend', (e) => {
            if (moved) return; // was scrolling, ignore
            e.preventDefault();
            e.stopPropagation();
            handler(e);
        });
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
            this._addTouchWithScrollDetect(this.startBtn, () => {
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
        const allProgramsBack = document.getElementById('all-programs-back');
        const isMobileWidth = () => window.innerWidth <= 768;

        if (allProgramsBtn && allProgramsSubmenu) {
            const menuPrograms = document.getElementById('start-menu-programs');

            let allProgsLastTouch = 0;

            const openAllPrograms = () => {
                if (isMobileWidth()) {
                    // On mobile: hide main menu, show submenu in its place
                    if (menuPrograms) menuPrograms.classList.add('hidden');
                    allProgramsSubmenu.classList.remove('hidden');
                    if (allProgramsBack) allProgramsBack.classList.remove('hidden');
                } else {
                    allProgramsSubmenu.classList.toggle('hidden');
                }
            };

            const closeAllPrograms = () => {
                allProgramsSubmenu.classList.add('hidden');
                if (allProgramsBack) allProgramsBack.classList.add('hidden');
                if (menuPrograms) menuPrograms.classList.remove('hidden');
            };

            this._closeAllPrograms = closeAllPrograms;

            allProgramsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (Date.now() - allProgsLastTouch < 500) return;
                openAllPrograms();
            });

            if (isTouchDevice) {
                this._addTouchWithScrollDetect(allProgramsBtn, () => {
                    allProgsLastTouch = Date.now();
                    openAllPrograms();
                });
            }

            // Back/close button closes submenu on mobile
            if (allProgramsBack) {
                allProgramsBack.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeAllPrograms();
                });
                if (isTouchDevice) {
                    this._addTouchWithScrollDetect(allProgramsBack, () => {
                        closeAllPrograms();
                    });
                }
            }

            // Submenu item clicks
            allProgramsSubmenu.querySelectorAll('.all-programs-item').forEach(item => {
                let itemLastTouch = 0;
                item.addEventListener('click', () => {
                    if (Date.now() - itemLastTouch < 500) return;
                    this.close();
                });
                if (isTouchDevice) {
                    this._addTouchWithScrollDetect(item, () => {
                        itemLastTouch = Date.now();
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
            let lastTouch = 0;

            item.addEventListener('click', () => {
                if (Date.now() - lastTouch < 500) return;
                handleMenuItem(item);
            });

            if (isTouchDevice) {
                this._addTouchWithScrollDetect(item, () => {
                    lastTouch = Date.now();
                    handleMenuItem(item);
                });
            }
        });

        // Log Off / Shut Down
        const logoffBtn = document.getElementById('logoff-btn');
        const shutdownBtn = document.getElementById('shutdown-btn');

        let logoffLastTouch = 0, shutdownLastTouch = 0;
        logoffBtn.addEventListener('click', () => {
            if (Date.now() - logoffLastTouch < 500) return;
            this.handleLogOff();
        });
        shutdownBtn.addEventListener('click', () => {
            if (Date.now() - shutdownLastTouch < 500) return;
            this.handleShutDown();
        });

        if (isTouchDevice) {
            this._addTouchWithScrollDetect(logoffBtn, () => {
                logoffLastTouch = Date.now();
                this.handleLogOff();
            });
            this._addTouchWithScrollDetect(shutdownBtn, () => {
                shutdownLastTouch = Date.now();
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

        // Play start menu sound
        if (window.SoundEffects) window.SoundEffects.play('startMenu');
    }

    close() {
        this.menu.classList.add('hidden');
        this.startBtn.classList.remove('active');
        this.isOpen = false;
        this.resetAllPrograms();
    }

    resetAllPrograms() {
        const submenu = document.getElementById('all-programs-submenu');
        const back = document.getElementById('all-programs-back');
        const menuPrograms = document.getElementById('start-menu-programs');
        if (submenu) submenu.classList.add('hidden');
        if (back) back.classList.add('hidden');
        if (menuPrograms) menuPrograms.classList.remove('hidden');
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

            // Close all windows
            this.windowManager.windows.forEach((data, id) => {
                this.windowManager.closeWindow(id);
            });

            // Fade out desktop
            const desktop = document.getElementById('desktop-container');
            desktop.style.transition = 'opacity 0.5s';
            desktop.style.opacity = '0';

            setTimeout(() => {
                desktop.classList.add('hidden');
                desktop.style.opacity = '1';

                // Show login screen
                const loginContainer = document.getElementById('login-container');
                if (loginContainer) {
                    loginContainer.classList.remove('hidden', 'fade-out');
                    loginContainer.offsetHeight;
                    loginContainer.classList.add('active');

                    // Click to log back in
                    const loginHandler = () => {
                        loginContainer.removeEventListener('click', loginHandler);
                        loginContainer.classList.add('fade-out');

                        setTimeout(() => {
                            loginContainer.classList.add('hidden');
                            loginContainer.classList.remove('active', 'fade-out');
                            desktop.classList.remove('hidden');
                        }, 300);
                    };
                    loginContainer.addEventListener('click', loginHandler);
                }
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
