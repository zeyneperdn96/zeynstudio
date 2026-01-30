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
        this.welcomeContainer = document.getElementById('welcome-container');
        this.desktopContainer = document.getElementById('desktop-container');

        this.hasStarted = false;
        this.hasLoggedIn = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Log video errors for debugging
        if (this.bootVideo) {
            this.bootVideo.addEventListener('error', (e) => {
                console.error('Video error:', e);
            });
        }

        // Auto-start boot immediately
        this.startBoot();
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

            // Auto-transition to desktop after 1.5 seconds
            setTimeout(() => {
                this.handleLogin();
            }, 1500);
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

        console.log('Transitioning to welcome screen...');

        // Fade out login screen
        if (this.loginContainer) {
            this.loginContainer.classList.add('fade-out');
        }

        setTimeout(() => {
            // Hide login
            if (this.loginContainer) {
                this.loginContainer.classList.add('hidden');
            }

            // Show welcome screen with music
            this.showWelcomeScreen();
        }, 500);
    }

    showWelcomeScreen() {
        console.log('Showing welcome screen...');

        // Play XP startup sound with welcome screen
        const startupSound = document.getElementById('xp-startup-sound');
        if (startupSound) {
            startupSound.volume = 0.7;
            startupSound.currentTime = 0;
            startupSound.play().catch(() => {
                const playAudio = () => {
                    startupSound.play().then(() => {
                        document.removeEventListener('click', playAudio);
                        document.removeEventListener('touchstart', playAudio);
                        document.removeEventListener('keydown', playAudio);
                    }).catch(() => {});
                };
                document.addEventListener('click', playAudio, { once: false });
                document.addEventListener('touchstart', playAudio, { once: false });
                document.addEventListener('keydown', playAudio, { once: false });
            });
        }

        // Show welcome container
        if (this.welcomeContainer) {
            this.welcomeContainer.classList.remove('hidden');
            this.welcomeContainer.offsetHeight;
            this.welcomeContainer.classList.add('active');
        }

        // Transition to desktop quickly
        setTimeout(() => {
            this.showDesktop();
        }, 1000);
    }

    showDesktop() {
        // Lazy-load desktop images
        document.querySelectorAll('img[data-src]')
            .forEach(img => { img.src = img.dataset.src; });

        console.log('Transitioning to desktop...');

        // Fade out welcome screen
        if (this.welcomeContainer) {
            this.welcomeContainer.classList.add('fade-out');
        }

        setTimeout(() => {
            // Hide welcome
            if (this.welcomeContainer) {
                this.welcomeContainer.classList.add('hidden');
            }

            // Show desktop
            this.desktopContainer.classList.remove('hidden');

            if (window.desktopManager) {
                window.desktopManager.initialize();
            }
        }, 800);
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.BootSequence = BootSequence;
