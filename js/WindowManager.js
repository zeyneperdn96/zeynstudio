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

        // Custom sizes for specific windows
        const windowSizes = {
            about: { width: 900, height: 700 },
            work: { width: 700, height: 550 },
            showreel: { width: 400, height: 450 },
            metbic: { width: 820, height: 520 }
        };

        const customSize = windowSizes[windowId] || {};

        const defaultPos = {
            top: 60 + (this.windows.size * 30),
            left: 80 + (this.windows.size * 30),
            width: options.width || customSize.width || 600,
            height: options.height || customSize.height || 500
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

    maximizeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        const windowEl = windowData.element;

        if (windowData.isMaximized) {
            // Restore to original size
            windowEl.style.top = windowData.originalPosition.top;
            windowEl.style.left = windowData.originalPosition.left;
            windowEl.style.width = windowData.originalPosition.width;
            windowEl.style.height = windowData.originalPosition.height;
            windowEl.classList.remove('maximized');
            windowData.isMaximized = false;
        } else {
            // Save original position
            windowData.originalPosition = {
                top: windowEl.style.top,
                left: windowEl.style.left,
                width: windowEl.style.width,
                height: windowEl.style.height
            };

            // Maximize (full screen minus taskbar)
            windowEl.style.top = '0px';
            windowEl.style.left = '0px';
            windowEl.style.width = '100vw';
            windowEl.style.height = 'calc(100vh - 40px)';
            windowEl.classList.add('maximized');
            windowData.isMaximized = true;
        }
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
                else if (action === 'maximize') this.maximizeWindow(windowId);
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

            const renderAndBindProjects = (filter) => {
                projectsGrid.innerHTML = projectsManager.renderProjectsHTML(filter);

                // Add click handlers for project cards
                projectsGrid.querySelectorAll('.project-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const projectId = card.dataset.projectId;
                        const project = projectsManager.getProjectById(projectId);
                        if (project) {
                            this.openCaseStudyWindow(project, projectsManager);
                        }
                    });
                });
            };

            renderAndBindProjects('all');

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => {
                        b.classList.remove('btn-primary', 'active');
                        b.classList.add('btn-secondary');
                    });
                    btn.classList.remove('btn-secondary');
                    btn.classList.add('btn-primary', 'active');

                    const filter = btn.dataset.filter;
                    renderAndBindProjects(filter);
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

        // METBIC.exe interactive window
        if (windowId === 'metbic') {
            this.initializeMetbicWindow(windowEl);
        }
    }

    openCaseStudyWindow(project, projectsManager) {
        // Special handling for METBIC - open XP-style window
        if (project.title === 'METBİC') {
            this.openWindow('metbic', { width: 800, height: 520 });
            return;
        }

        const windowId = `casestudy-${project.id}`;

        // If already open, focus it
        if (this.windows.has(windowId)) {
            this.focusWindow(windowId);
            return;
        }

        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.dataset.windowId = windowId;

        windowEl.innerHTML = `
            <div class="window-titlebar">
                <span class="window-title">📁 ${project.title} - Case Study</span>
                <div class="window-controls">
                    <button class="win-btn win-minimize" data-action="minimize">_</button>
                    <button class="win-btn win-maximize" data-action="maximize">□</button>
                    <button class="win-btn win-close" data-action="close">×</button>
                </div>
            </div>
            <div class="window-content" style="padding: 0; overflow: hidden;">
                ${projectsManager.renderCaseStudyHTML(project)}
            </div>
        `;

        // Position and size
        windowEl.style.top = '40px';
        windowEl.style.left = '100px';
        windowEl.style.width = '750px';
        windowEl.style.height = '600px';
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
    }

    initializeMetbicWindow(windowEl) {
        const log = windowEl.querySelector('#metbic-log');
        const moduleInfo = windowEl.querySelector('#metbic-module-info');
        const previewImg = windowEl.querySelector('#metbic-preview-img');
        const modules = windowEl.querySelectorAll('.metbic-module');
        const buttons = windowEl.querySelectorAll('.metbic-btn');

        const moduleData = {
            'tire-lever': {
                name: 'Tire Lever',
                desc: 'Specialized lever for quick tire removal. Ergonomic grip design prevents hand fatigue.',
                img: 'assets/projects/metbic/hero.png'
            },
            'hex-nut': {
                name: 'Hex Nut Set',
                desc: '15mm, 10mm, 8mm sizes included. Hardened steel construction for durability.',
                img: 'assets/projects/metbic/render1.png'
            },
            'wheel-align': {
                name: 'Wheel Alignment Tool',
                desc: 'Precision rim straightener. Fixes minor wheel wobbles on the trail.',
                img: 'assets/projects/metbic/render2.png'
            },
            'file': {
                name: 'Double-Sided File',
                desc: 'Coarse and fine sides. Perfect for brake pad adjustment and burr removal.',
                img: 'assets/projects/metbic/context.png'
            },
            'screwdriver': {
                name: 'Screwdriver Bits',
                desc: '6 interchangeable heads with magnetic holder. Phillips, flathead, and hex included.',
                img: 'assets/projects/metbic/technical.png'
            },
            'storage': {
                name: 'Storage Compartment',
                desc: 'Secure space for spare screws, chain links, and small parts. Waterproof seal.',
                img: 'assets/projects/metbic/hero.png'
            }
        };

        const addLog = (type, message) => {
            const line = document.createElement('div');
            line.className = `metbic-log-line metbic-log-${type}`;
            const prefix = type === 'info' ? '[INFO]' : type === 'warning' ? '[WARNING]' : type === 'action' ? '[ACTION]' : type === 'status' ? '[STATUS]' : '[ERROR]';
            line.textContent = `${prefix} ${message}`;
            log.appendChild(line);
            log.scrollTop = log.scrollHeight;
        };

        // Module clicks
        modules.forEach(mod => {
            mod.addEventListener('click', () => {
                modules.forEach(m => m.classList.remove('active'));
                mod.classList.add('active');

                const moduleKey = mod.dataset.module;
                const data = moduleData[moduleKey];

                if (data) {
                    moduleInfo.innerHTML = `<strong>${data.name}</strong><br>${data.desc}`;
                    if (data.img) previewImg.src = data.img;
                    addLog('info', `Module selected: ${data.name}`);
                }
            });
        });

        // Button clicks
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;

                if (action === 'toolkit') {
                    addLog('action', 'Opening toolkit interface...');
                    addLog('status', 'All 6 modules accessible');
                } else if (action === 'repair') {
                    addLog('warning', 'Repair mode activated');
                    addLog('action', 'Diagnostics running...');
                    setTimeout(() => addLog('status', 'System ready for repair'), 800);
                } else if (action === 'load') {
                    addLog('info', 'Loading modules from storage...');
                    setTimeout(() => addLog('status', '6 modules loaded successfully'), 600);
                } else if (action === 'recovery') {
                    addLog('warning', 'Initiating system recovery...');
                    setTimeout(() => addLog('info', 'Recovery point created'), 500);
                    setTimeout(() => addLog('status', 'System stable'), 1000);
                }
            });
        });

        // Initial log
        setTimeout(() => addLog('status', 'Ready for operation'), 500);
    }
}

window.WindowManager = WindowManager;
