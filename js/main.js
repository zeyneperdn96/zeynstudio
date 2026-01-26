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

    icons.forEach(icon => {
        // Double-click to open
        icon.addEventListener('dblclick', () => {
            const windowId = icon.dataset.window;
            window.windowManager.openWindow(windowId);
        });

        // Single click to select
        icon.addEventListener('click', (e) => {
            if (e.detail === 1) {
                icons.forEach(i => i.classList.remove('selected'));
                icon.classList.add('selected');
            }
        });
    });

    // Clear selection on desktop click
    document.getElementById('desktop-container').addEventListener('click', (e) => {
        if (e.target.id === 'desktop-container' || e.target.classList.contains('desktop-container')) {
            icons.forEach(i => i.classList.remove('selected'));
        }
    });
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
