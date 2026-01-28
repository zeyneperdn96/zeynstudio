/* ========================================
   MAIN APPLICATION
   Initialize desktop environment
   ======================================== */

// Mobile detection disabled - desktop XP experience on all devices
function isMobile() {
    return false;
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {

    // Mobile check
    if (isMobile()) {
        document.getElementById('boot-container').classList.add('hidden');
        document.getElementById('desktop-container').classList.add('hidden');
        document.getElementById('mobile-view').classList.remove('hidden');

        // Update mobile content from config
        document.getElementById('mobile-bio').textContent = CONFIG.personal.bio;
        document.getElementById('mobile-github').href = CONFIG.social.github;
        document.getElementById('mobile-linkedin').href = CONFIG.social.linkedin;

        // Mobile clock
        function updateMobileClock() {
            var now = new Date();
            var h = now.getHours();
            var m = now.getMinutes();
            document.getElementById('mobile-clock').textContent =
                (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
        }
        updateMobileClock();
        setInterval(updateMobileClock, 30000);

        return;
    }

    // Desktop initialization
    const bootSequence = new BootSequence();
    const windowManager = new WindowManager();
    const startMenu = new StartMenu(windowManager);

    // Make globally accessible
    window.windowManager = windowManager;
    window.startMenu = startMenu;
    window.desktopManager = {
        initialize: () => {
            // Update clock
            updateClock();
            setInterval(updateClock, 1000);

            // Setup desktop icons
            setupDesktopIcons();

            // Extend window manager to handle Terminal initialization
            const originalOpenWindow = windowManager.openWindow.bind(windowManager);
            windowManager.openWindow = function (windowId, options) {
                originalOpenWindow(windowId, options);

                // Initialize terminal after window is created
                if (windowId === 'terminal') {
                    setTimeout(() => {
                        const terminalWindow = this.windows.get('terminal');
                        if (terminalWindow) {
                            Terminal.initialize(terminalWindow.element);
                        }
                    }, 100);
                }

                // Initialize media player
                if (windowId === 'showreel') {
                    setTimeout(() => {
                        const mpWindow = this.windows.get('showreel');
                        if (mpWindow) {
                            mpWindow.mediaPlayer = MediaPlayer.initialize(mpWindow.element);
                        }
                    }, 100);
                }
            };
        }
    };

    // Boot sequence auto-starts in constructor
});

// Update clock
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('tray-clock').textContent = `${hours}:${minutes}`;
}

// Setup desktop icons
function setupDesktopIcons() {
    const icons = document.querySelectorAll('.desktop-icon');
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isMobileWidth = () => window.innerWidth <= 768;

    icons.forEach(icon => {
        let touchTimeout = null;
        let lastTap = 0;
        let touchHandled = false;

        // Double-click to open (desktop only)
        icon.addEventListener('dblclick', (e) => {
            // Skip if touch was just handled
            if (touchHandled) {
                touchHandled = false;
                return;
            }
            const windowId = icon.dataset.window;
            window.windowManager.openWindow(windowId);
        });

        // Single click to select (desktop only)
        icon.addEventListener('click', (e) => {
            // Skip if touch was just handled
            if (touchHandled) {
                touchHandled = false;
                return;
            }
            if (e.detail === 1 && !isMobileWidth()) {
                icons.forEach(i => i.classList.remove('selected'));
                icon.classList.add('selected');
            }
        });

        // Touch support - improved for mobile
        if (isTouchDevice) {
            icon.addEventListener('touchstart', (e) => {
                // Clear any pending timeout
                if (touchTimeout) {
                    clearTimeout(touchTimeout);
                    touchTimeout = null;
                }
                // Add visual feedback
                icon.classList.add('selected');
            }, { passive: true });

            icon.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                touchHandled = true;

                // Prevent default to avoid mouse events
                e.preventDefault();

                // Clear selection from others
                icons.forEach(i => {
                    if (i !== icon) i.classList.remove('selected');
                });

                if (tapLength < 300 && tapLength > 0) {
                    // Double tap - open immediately
                    if (touchTimeout) {
                        clearTimeout(touchTimeout);
                        touchTimeout = null;
                    }
                    const windowId = icon.dataset.window;
                    window.windowManager.openWindow(windowId);
                } else {
                    // Single tap on mobile - open after brief delay
                    // This allows for double-tap detection
                    if (isMobileWidth()) {
                        touchTimeout = setTimeout(() => {
                            const windowId = icon.dataset.window;
                            window.windowManager.openWindow(windowId);
                            touchTimeout = null;
                        }, 250);
                    }
                }
                lastTap = currentTime;

                // Reset touch handled flag after a short delay
                setTimeout(() => { touchHandled = false; }, 100);
            });

            icon.addEventListener('touchcancel', () => {
                if (touchTimeout) {
                    clearTimeout(touchTimeout);
                    touchTimeout = null;
                }
            });
        }
    });

    // Clear selection on desktop click/touch
    const desktopContainer = document.getElementById('desktop-container');

    desktopContainer.addEventListener('click', (e) => {
        if (e.target === desktopContainer || e.target.classList.contains('desktop-container')) {
            icons.forEach(i => i.classList.remove('selected'));
        }
    });

    // Also handle touch on desktop background
    if (isTouchDevice) {
        desktopContainer.addEventListener('touchend', (e) => {
            if (e.target === desktopContainer || e.target.classList.contains('desktop-container')) {
                icons.forEach(i => i.classList.remove('selected'));
            }
        }, { passive: true });
    }
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const mobile = isMobile();
        const mobileView = document.getElementById('mobile-view');
        const desktopContainer = document.getElementById('desktop-container');
        const bootContainer = document.getElementById('boot-container');

        if (mobile) {
            bootContainer.classList.add('hidden');
            desktopContainer.classList.add('hidden');
            mobileView.classList.remove('hidden');
        } else {
            if (bootContainer.classList.contains('hidden')) {
                mobileView.classList.add('hidden');
                desktopContainer.classList.remove('hidden');
            }
        }
    }, 250);
});

// F11 fullscreen toggle
document.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
        e.preventDefault();
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
});
