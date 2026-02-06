/* ========================================
   MAIN APPLICATION
   Initialize desktop environment
   ======================================== */

// Set real viewport height for mobile (accounts for browser chrome)
function setVH() {
    document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
}
setVH();
window.addEventListener('resize', setVH);

// Initialize application
document.addEventListener('DOMContentLoaded', () => {

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

            // Initialize Clippy assistant
            if (window.Clippy) {
                window.Clippy.initialize();
            }

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

        // Touch support - improved for mobile with scroll detection
        if (isTouchDevice) {
            let touchStartX = 0;
            let touchStartY = 0;
            let touchMoved = false;

            icon.addEventListener('touchstart', (e) => {
                // Clear any pending timeout
                if (touchTimeout) {
                    clearTimeout(touchTimeout);
                    touchTimeout = null;
                }
                // Track start position for scroll detection
                const touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                touchMoved = false;
                // Add visual feedback
                icon.classList.add('selected');
            }, { passive: true });

            icon.addEventListener('touchmove', (e) => {
                // If finger moved more than 10px, it's a scroll not a tap
                const touch = e.touches[0];
                const dx = Math.abs(touch.clientX - touchStartX);
                const dy = Math.abs(touch.clientY - touchStartY);
                if (dx > 10 || dy > 10) {
                    touchMoved = true;
                    icon.classList.remove('selected');
                    if (touchTimeout) {
                        clearTimeout(touchTimeout);
                        touchTimeout = null;
                    }
                }
            }, { passive: true });

            icon.addEventListener('touchend', (e) => {
                // If user was scrolling, don't open anything
                if (touchMoved) {
                    touchMoved = false;
                    icon.classList.remove('selected');
                    return;
                }

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
                    // Single tap on mobile - open after delay
                    if (isMobileWidth()) {
                        touchTimeout = setTimeout(() => {
                            const windowId = icon.dataset.window;
                            window.windowManager.openWindow(windowId);
                            touchTimeout = null;
                        }, 350);
                    }
                }
                lastTap = currentTime;

                // Reset touch handled flag after enough delay to block click/dblclick
                setTimeout(() => { touchHandled = false; }, 400);
            });

            icon.addEventListener('touchcancel', () => {
                touchMoved = false;
                icon.classList.remove('selected');
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
