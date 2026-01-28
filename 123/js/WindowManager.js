/* ========================================
   WINDOW MANAGER
   Draggable windows with focus management
   ======================================== */

class WindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndexCounter = 100;
        this.activeWindow = null;
        this.container = document.getElementById('windows-container');
        this.taskbarWindows = document.getElementById('taskbar-windows');

        this.dragState = {
            isDragging: false,
            currentWindow: null,
            offsetX: 0,
            offsetY: 0
        };

        document.addEventListener('mousemove', (e) => this.handleDrag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
    }

    openWindow(windowId, options = {}) {
        if (this.windows.has(windowId)) {
            this.focusWindow(windowId);
            return;
        }

        const template = window.WindowTemplates[windowId];
        if (!template) {
            console.error(`No template found for window: ${windowId}`);
            return;
        }

        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.dataset.windowId = windowId;
        windowEl.innerHTML = template();

        const defaultPos = {
            top: 60 + (this.windows.size * 30),
            left: 120 + (this.windows.size * 30),
            width: options.width || 600,
            height: options.height || 500
        };

        windowEl.style.top = `${defaultPos.top}px`;
        windowEl.style.left = `${defaultPos.left}px`;
        windowEl.style.width = `${defaultPos.width}px`;
        windowEl.style.height = `${defaultPos.height}px`;
        windowEl.style.zIndex = this.zIndexCounter++;

        this.container.appendChild(windowEl);

        this.windows.set(windowId, {
            element: windowEl,
            isMinimized: false
        });

        this.setupWindowControls(windowEl);
        this.makeDraggable(windowEl);
        this.addToTaskbar(windowId);

        setTimeout(() => windowEl.classList.remove('hidden'), 10);

        this.focusWindow(windowId);
        this.initializeWindowContent(windowId, windowEl);
    }

    closeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        // Cleanup matrix animation
        if (windowId === 'terminal') {
            Terminal.cleanup(windowData.element);
        }

        windowData.element.remove();
        this.windows.delete(windowId);
        this.removeFromTaskbar(windowId);
    }

    minimizeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        windowData.element.classList.add('hidden');
        windowData.isMinimized = true;

        const taskbarBtn = document.querySelector(`[data-taskbar-window="${windowId}"]`);
        if (taskbarBtn) taskbarBtn.classList.remove('active');
    }

    focusWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        if (windowData.isMinimized) {
            windowData.element.classList.remove('hidden');
            windowData.isMinimized = false;
        }

        this.zIndexCounter++;
        windowData.element.style.zIndex = this.zIndexCounter;

        this.windows.forEach((data, id) => {
            const titlebar = data.element.querySelector('.window-titlebar');
            if (id === windowId) {
                titlebar.classList.remove('inactive');
            } else {
                titlebar.classList.add('inactive');
            }
        });

        this.activeWindow = windowId;
        this.updateTaskbarActive(windowId);
    }

    makeDraggable(windowEl) {
        const titlebar = windowEl.querySelector('.window-titlebar');

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;

            const rect = windowEl.getBoundingClientRect();

            this.dragState = {
                isDragging: true,
                currentWindow: windowEl,
                offsetX: e.clientX - rect.left,
                offsetY: e.clientY - rect.top
            };

            const windowId = windowEl.dataset.windowId;
            this.focusWindow(windowId);
        });
    }

    handleDrag(e) {
        if (!this.dragState.isDragging) return;

        const win = this.dragState.currentWindow;
        const x = e.clientX - this.dragState.offsetX;
        const y = e.clientY - this.dragState.offsetY;

        const maxX = window.innerWidth - 100;
        const maxY = window.innerHeight - 100;

        win.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        win.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    }

    stopDrag() {
        this.dragState.isDragging = false;
        this.dragState.currentWindow = null;
    }

    setupWindowControls(windowEl) {
        const controls = windowEl.querySelectorAll('.window-controls button');
        const windowId = windowEl.dataset.windowId;

        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;

                if (action === 'close') this.closeWindow(windowId);
                else if (action === 'minimize') this.minimizeWindow(windowId);
                else if (action === 'maximize') console.log('Maximize not implemented');
            });
        });
    }

    addToTaskbar(windowId) {
        if (document.querySelector(`[data-taskbar-window="${windowId}"]`)) return;

        const windowData = this.windows.get(windowId);
        const title = windowData.element.querySelector('.window-title').textContent;

        const btn = document.createElement('button');
        btn.className = 'taskbar-window-btn';
        btn.dataset.taskbarWindow = windowId;
        btn.textContent = title;

        btn.addEventListener('click', () => {
            if (windowData.isMinimized) {
                this.focusWindow(windowId);
            } else {
                this.minimizeWindow(windowId);
            }
        });

        this.taskbarWindows.appendChild(btn);
    }

    removeFromTaskbar(windowId) {
        const btn = document.querySelector(`[data-taskbar-window="${windowId}"]`);
        if (btn) btn.remove();
    }

    updateTaskbarActive(windowId) {
        const buttons = this.taskbarWindows.querySelectorAll('.taskbar-window-btn');
        buttons.forEach(btn => {
            if (btn.dataset.taskbarWindow === windowId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    initializeWindowContent(windowId, windowEl) {
        // Initialize specific window content
        if (windowId === 'work') {
            const projectsManager = new ProjectsManager();
            const projectsGrid = windowEl.querySelector('#projects-grid');
            const filterBtns = windowEl.querySelectorAll('[data-filter]');

            projectsGrid.innerHTML = projectsManager.renderProjectsHTML('all');

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => {
                        b.classList.remove('btn-primary', 'active');
                        b.classList.add('btn-secondary');
                    });
                    btn.classList.remove('btn-secondary');
                    btn.classList.add('btn-primary', 'active');

                    const filter = btn.dataset.filter;
                    projectsGrid.innerHTML = projectsManager.renderProjectsHTML(filter);
                });
            });
        }

        // Contact form
        if (windowId === 'contact') {
            const form = windowEl.querySelector('#contact-form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Message sent! (Demo - integrate with your email service)');
                form.reset();
            });
        }
    }
}

window.WindowManager = WindowManager;
