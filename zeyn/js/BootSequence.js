/* ========================================
   VIDEO BOOT SEQUENCE CONTROLLER
   Boot → Login (image) → Desktop
   ======================================== */

class BootSequence {
    constructor() {
        this.container = document.getElementById('boot-container');
        this.biosStage = document.getElementById('boot-bios');
        this.bootVideo = document.getElementById('boot-video');
        this.clickCatcher = document.getElementById('boot-click-catcher');
        this.loginContainer = document.getElementById('login-container');
        this.loginHitArea = document.getElementById('login-hit-area');
        this.desktopContainer = document.getElementById('desktop-container');

        this.hasStarted = false;
        this.hasLoggedIn = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Click catcher - play video on click
        if (this.clickCatcher) {
            this.clickCatcher.addEventListener('click', () => {
                this.startBoot();
            });
            this.clickCatcher.addEventListener('mousedown', () => {
                this.startBoot();
            });
        }

        // Enter key to start boot
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.hasStarted) {
                this.startBoot();
            }
        });

        // When video ends, show login screen
        if (this.bootVideo) {
            this.bootVideo.addEventListener('ended', async () => {
                console.log('Video ended, showing login screen...');
                await this.wait(500);
                this.showLoginScreen();
            });

            // Log video errors for debugging
            this.bootVideo.addEventListener('error', (e) => {
                console.error('Video error:', e);
            });
        }

        // Login hit area click - show selected state then go to desktop
        if (this.loginHitArea) {
            this.loginHitArea.addEventListener('click', () => {
                this.handleLogin();
            });
        }
    }

    async startBoot() {
        // Guard: only run once
        if (this.hasStarted) return;
        this.hasStarted = true;

        console.log('Starting boot video...');

        // Hide click catcher
        if (this.clickCatcher) {
            this.clickCatcher.classList.add('hidden');
        }

        // Play boot video
        if (this.bootVideo) {
            try {
                this.bootVideo.playbackRate = 1.0;
                const playPromise = this.bootVideo.play();

                if (playPromise !== undefined) {
                    await playPromise;
                    console.log('Boot video playing successfully');

                    // Stop video after 2 seconds and show login
                    setTimeout(() => {
                        this.bootVideo.pause();
                        this.showLoginScreen();
                    }, 2000);
                }
            } catch (error) {
                console.error('Video playback failed:', error);
                // Fallback: show login after 2 seconds
                await this.wait(2000);
                this.showLoginScreen();
            }
        }
    }

    showLoginScreen() {
        console.log('Showing login screen...');

        // Fade out boot container
        this.container.style.transition = 'opacity 0.5s ease-out';
        this.container.style.opacity = '0';

        setTimeout(() => {
            this.container.classList.add('hidden');

            // Show login container
            if (this.loginContainer) {
                this.loginContainer.classList.remove('hidden');
                // Trigger reflow for transition
                this.loginContainer.offsetHeight;
                this.loginContainer.classList.add('active');
            }
        }, 500);
    }

    async handleLogin() {
        // Guard: only run once
        if (this.hasLoggedIn) return;
        this.hasLoggedIn = true;

        console.log('Login hit area clicked...');

        // Add selected state
        if (this.loginHitArea) {
            this.loginHitArea.classList.add('selected');
        }

        // Wait for selected state to be visible (200ms)
        await this.wait(200);

        console.log('Transitioning to desktop...');

        // Fade out login screen
        if (this.loginContainer) {
            this.loginContainer.classList.add('fade-out');
        }

        setTimeout(() => {
            // Hide login
            if (this.loginContainer) {
                this.loginContainer.classList.add('hidden');
            }

            // Show desktop
            this.desktopContainer.classList.remove('hidden');

            if (window.desktopManager) {
                window.desktopManager.initialize();
            }
        }, 500);
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.BootSequence = BootSequence;
