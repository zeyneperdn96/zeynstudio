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

        // Bind once for reuse
        this._onMouseMove = (e) => this.handleDrag(e);
        this._onMouseUp = () => this.stopDrag();
        this._onTouchMove = (e) => this.handleDrag(e.touches[0]);
        this._onTouchEnd = () => this.stopDrag();

        // Listen for iframe postMessage (e.g. zeynshat controls)
        window.addEventListener('message', (e) => {
            if (e.data && e.data.type === 'zeynshat-control') {
                const action = e.data.action;
                if (action === 'close') this.closeWindow('zeynshat');
                else if (action === 'minimize') this.minimizeWindow('zeynshat');
                else if (action === 'maximize') this.maximizeWindow('zeynshat');
            }
            if (e.data && e.data.type === 'zeynshat-open-window') {
                this.openWindow(e.data.windowId);
            }
            // Drag start from iframe titlebar
            if (e.data && e.data.type === 'zeynshat-drag-start') {
                const windowData = this.windows.get('zeynshat');
                if (!windowData) return;
                const windowEl = windowData.element;
                // Delta-based: store initial screen coords and window position
                this.dragState = {
                    isDragging: true,
                    currentWindow: windowEl,
                    startScreenX: e.data.clientX,
                    startScreenY: e.data.clientY,
                    startLeft: parseInt(windowEl.style.left) || 0,
                    startTop: parseInt(windowEl.style.top) || 0,
                    useScreen: true
                };
                this.focusWindow('zeynshat');
                // Disable pointer events on iframe so parent gets mousemove
                const iframe = windowEl.querySelector('iframe');
                if (iframe) iframe.style.pointerEvents = 'none';
                document.addEventListener('mousemove', this._onMouseMove);
                document.addEventListener('mouseup', this._onMouseUp);
                document.addEventListener('touchmove', this._onTouchMove, { passive: false });
                document.addEventListener('touchend', this._onTouchEnd);
            }
        });
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

        // Play window open sound
        if (window.SoundEffects) window.SoundEffects.play('windowOpen');

        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.dataset.windowId = windowId;
        windowEl.innerHTML = template();

        // Custom sizes for specific windows
        const windowSizes = {
            about: { width: 900, height: 700 },
            work: { width: 700, height: 550 },
            showreel: { width: 680, height: 440 },
            metbic: { width: 820, height: 520 },
            firebox: { width: 820, height: 520 },
            coffeeform: { width: 820, height: 520 },
            games: { width: 420, height: 520 },
            zeynshat: { width: 500, height: 700 },
            illustration: { width: 800, height: 600 },
            illustrationWork: { width: 800, height: 600 },
            aiVisualsWork: { width: 860, height: 640 },
            paint: { width: 750, height: 550 },
            cv: { width: 720, height: 560 },
            systembuilder: { width: 880, height: 520 },
            archive: { width: 1000, height: 660 }
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

        // Frameless window for zeynshat (MSN has its own chrome)
        if (windowId === 'zeynshat') {
            windowEl.style.border = 'none';
            windowEl.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
            windowEl.style.borderRadius = '6px';
            windowEl.style.overflow = 'hidden';
            windowEl.style.background = 'transparent';
        }

        // CV skill bar animation
        if (windowId === 'cv') {
            setTimeout(() => {
                const skillBars = windowEl.querySelectorAll('.cv-skill-fill');
                skillBars.forEach((bar, i) => {
                    const targetWidth = bar.style.width;
                    bar.style.setProperty('width', '0', 'important');
                    setTimeout(() => {
                        bar.style.setProperty('width', targetWidth, 'important');
                    }, 100 + (i * 150));
                });
            }, 200);
        }

        this.container.appendChild(windowEl);

        // Lazy load iframes - set src from data-src when window opens
        windowEl.querySelectorAll('iframe[data-src]').forEach(iframe => {
            iframe.src = iframe.dataset.src;
        });

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

        // Play window close sound
        if (window.SoundEffects) window.SoundEffects.play('windowClose');

        // Cleanup matrix animation
        if (windowId === 'terminal') {
            Terminal.cleanup(windowData.element);
        }

        // Cleanup media player
        if (windowId === 'showreel' && windowData.mediaPlayer) {
            windowData.mediaPlayer.destroy();
        }

        // Cleanup games
        if (windowId === 'archive' && windowData.archiveCleanup) {
            windowData.archiveCleanup();
        }

        if (windowId === 'games' && windowData.gamesCleanup) {
            windowData.gamesCleanup();
        }

        // Cleanup paint
        if (windowId === 'paint' && windowData.paintCleanup) {
            windowData.paintCleanup();
        }

        // Cleanup SystemBuilder
        if (windowId === 'systembuilder' && windowData.systemBuilder) {
            windowData.systemBuilder.destroy();
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

        // Only update previous active + new active (avoid iterating all windows)
        if (this.activeWindow && this.activeWindow !== windowId) {
            const prev = this.windows.get(this.activeWindow);
            if (prev) {
                const prevTitlebar = prev.element.querySelector('.window-titlebar');
                if (prevTitlebar) prevTitlebar.classList.add('inactive');
            }
        }
        const titlebar = windowData.element.querySelector('.window-titlebar');
        if (titlebar) titlebar.classList.remove('inactive');

        this.activeWindow = windowId;
        this.updateTaskbarActive(windowId);
    }

    makeDraggable(windowEl) {
        const titlebar = windowEl.querySelector('.window-titlebar');

        const startDrag = (clientX, clientY) => {
            const rect = windowEl.getBoundingClientRect();
            this.dragState = {
                isDragging: true,
                currentWindow: windowEl,
                offsetX: clientX - rect.left,
                offsetY: clientY - rect.top,
                maxX: window.innerWidth - 100,
                maxY: window.innerHeight - 100
            };
            const windowId = windowEl.dataset.windowId;
            this.focusWindow(windowId);

            // Attach move/up listeners only during drag
            document.addEventListener('mousemove', this._onMouseMove);
            document.addEventListener('mouseup', this._onMouseUp);
            document.addEventListener('touchmove', this._onTouchMove, { passive: false });
            document.addEventListener('touchend', this._onTouchEnd);
        };

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;
            startDrag(e.clientX, e.clientY);
        });

        // Touch support for mobile - only on larger screens
        titlebar.addEventListener('touchstart', (e) => {
            if (e.target.closest('.window-controls')) return;
            if (window.innerWidth > 768) {
                startDrag(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
    }

    handleDrag(e) {
        const win = this.dragState.currentWindow;

        let x, y;
        if (this.dragState.useScreen) {
            // Delta-based for iframe drag: initial position + mouse delta
            const dx = e.screenX - this.dragState.startScreenX;
            const dy = e.screenY - this.dragState.startScreenY;
            x = this.dragState.startLeft + dx;
            y = this.dragState.startTop + dy;
        } else {
            x = e.clientX - this.dragState.offsetX;
            y = e.clientY - this.dragState.offsetY;
        }

        const maxX = this.dragState.maxX || (window.innerWidth - 100);
        const maxY = this.dragState.maxY || (window.innerHeight - 100);

        win.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        win.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    }

    stopDrag() {
        // Restore pointer events on iframe if it was an iframe drag
        if (this.dragState.currentWindow) {
            const iframe = this.dragState.currentWindow.querySelector('iframe');
            if (iframe) iframe.style.pointerEvents = '';
        }

        this.dragState.isDragging = false;
        this.dragState.currentWindow = null;
        this.dragState.useScreen = false;

        // Detach move/up listeners when drag ends
        document.removeEventListener('mousemove', this._onMouseMove);
        document.removeEventListener('mouseup', this._onMouseUp);
        document.removeEventListener('touchmove', this._onTouchMove);
        document.removeEventListener('touchend', this._onTouchEnd);
    }

    setupWindowControls(windowEl) {
        const controls = windowEl.querySelectorAll('.window-controls button');
        const windowId = windowEl.dataset.windowId;
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        controls.forEach(btn => {
            // Click handler for mouse
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;

                if (action === 'close') this.closeWindow(windowId);
                else if (action === 'minimize') this.minimizeWindow(windowId);
                else if (action === 'maximize') this.maximizeWindow(windowId);
            });

            // Touch handler for better mobile response
            if (isTouchDevice) {
                btn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const action = btn.dataset.action;

                    // Visual feedback
                    btn.style.transform = 'scale(0.9)';
                    setTimeout(() => { btn.style.transform = ''; }, 100);

                    if (action === 'close') this.closeWindow(windowId);
                    else if (action === 'minimize') this.minimizeWindow(windowId);
                    else if (action === 'maximize') this.maximizeWindow(windowId);
                });
            }
        });

        // Make window content focusable on click/tap
        windowEl.addEventListener('click', () => {
            this.focusWindow(windowId);
        });

        if (isTouchDevice) {
            windowEl.addEventListener('touchstart', () => {
                this.focusWindow(windowId);
            }, { passive: true });
        }
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
        if (this._activeTaskbarBtn) this._activeTaskbarBtn.classList.remove('active');
        const btn = this.taskbarWindows.querySelector(`[data-taskbar-window="${windowId}"]`);
        if (btn) btn.classList.add('active');
        this._activeTaskbarBtn = btn;
    }

    initializeWindowContent(windowId, windowEl) {
        // Initialize specific window content
        if (windowId === 'work') {
            const projectsManager = new ProjectsManager();
            const projectsGrid = windowEl.querySelector('#projects-grid');
            const filterBtns = windowEl.querySelectorAll('[data-filter]');

            const illustrations = [
                { src: 'assets/projects/illustration/map-of-us.jpg', label: 'Map of Us' },
                { src: 'assets/projects/illustration/pet-portrait.jpg', label: 'Pet Portrait' },
                { src: 'assets/projects/illustration/character-expressions.jpg', label: 'Character Expressions' },
                { src: 'assets/projects/illustration/map-of-dreams.jpg', label: 'Map of Our Dreams' },
                { src: 'assets/projects/illustration/christmas-market.jpg', label: 'Christmas Market' },
                { src: 'assets/projects/illustration/christmas-postcard.jpg', label: 'Christmas Postcard' },
                { src: 'assets/projects/illustration/wedding-welcome.jpg', label: 'Wedding Welcome' },
                { src: 'assets/projects/illustration/wedding-vintage.jpg', label: 'Wedding Vintage' },
                { src: 'assets/projects/illustration/couple-portal.jpg', label: 'Couple Portal' },
                { src: 'assets/projects/illustration/valentines-day.jpg', label: 'Valentine\'s Day' },
                { src: 'assets/projects/illustration/crispy-magic.jpg', label: 'Crispy Magic' },
            ];

            const renderIllustrations = () => {
                projectsGrid.innerHTML = illustrations.map(img => `
                    <div class="project-card illustration-card" style="cursor: pointer;">
                        <div class="project-thumbnail" style="background: url('${img.src}') center/cover no-repeat; height: 100px;"></div>
                        <div class="project-info">
                            <div class="project-title">${img.label}</div>
                            <div class="project-category">Illustration</div>
                        </div>
                    </div>
                `).join('');

                projectsGrid.querySelectorAll('.illustration-card').forEach(card => {
                    card.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.openWindow('illustrationWork', { width: 800, height: 600 });
                    });
                });
            };

            const renderAiVisuals = () => {
                const items = (typeof AI_VISUALS !== 'undefined') ? AI_VISUALS : [];
                projectsGrid.innerHTML = items.map((it, i) => `
                    <div class="project-card ai-visual-card" data-index="${i}" style="cursor: pointer;">
                        <div class="project-thumbnail" style="height: 100px; position: relative; overflow: hidden;">
                            <img src="${it.thumb}" alt="${it.label}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
                            ${it.type === 'video' ? '<span style="position:absolute; top:6px; right:6px; width:22px; height:22px; background:rgba(0,0,0,0.6); color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; padding-left:2px;">▶</span>' : ''}
                        </div>
                        <div class="project-info">
                            <div class="project-title">${it.label}</div>
                            <div class="project-category">AI Visuals${it.type === 'video' ? ' · Video' : ''}</div>
                        </div>
                    </div>
                `).join('');

                projectsGrid.querySelectorAll('.ai-visual-card').forEach(card => {
                    card.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this._aiVisualsStartIndex = parseInt(card.dataset.index, 10) || 0;
                        this.openWindow('aiVisualsWork', { width: 860, height: 640 });
                    });
                });
            };

            const renderAndBindProjects = (filter) => {
                if (filter === 'illustration') {
                    renderIllustrations();
                    return;
                }
                if (filter === 'ai-visuals') {
                    renderAiVisuals();
                    return;
                }

                projectsGrid.innerHTML = projectsManager.renderProjectsHTML(filter);

                // Add click handlers for project cards
                projectsGrid.querySelectorAll('.project-card').forEach(card => {
                    card.addEventListener('click', (e) => {
                        e.stopPropagation();
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

        // Archive.exe - 3D card gallery
        if (windowId === 'archive') {
            this.initializeArchiveWindow(windowEl);
        }

        // Games window
        if (windowId === 'games') {
            this.initializeGamesWindow(windowEl);
        }

        // METBIC.exe interactive window
        if (windowId === 'metbic') {
            this.initializeMetbicWindow(windowEl);
        }

        // FIREBOX.exe interactive window
        if (windowId === 'firebox') {
            this.initializeFireboxWindow(windowEl);
        }

        // FUNCART.exe interactive window
        if (windowId === 'funcart') {
            this.initializeFuncartWindow(windowEl);
        }

        // GUSTO.exe interactive window
        if (windowId === 'gusto') {
            this.initializeGustoWindow(windowEl);
        }

        // MARINESENTRY.exe interactive window
        if (windowId === 'marinesentry') {
            this.initializeMarinesentryWindow(windowEl);
        }

        // COFFEEFORM.exe interactive window
        if (windowId === 'coffeeform') {
            this.initializeCoffeeformWindow(windowEl);
        }

        // Gallery lightbox
        if (windowId === 'illustration' || windowId === 'illustrationWork') {
            this.initializeGalleryWindow(windowEl);
        }

        // AI Visuals gallery (images + videos)
        if (windowId === 'aiVisualsWork') {
            this.initializeAiVisualsGallery(windowEl);
        }

        // Paint window
        if (windowId === 'paint') {
            this.initializePaintWindow(windowEl);
        }

        // SystemBuilder window
        if (windowId === 'systembuilder') {
            const sb = new SystemBuilder(windowEl, this);
            const windowData = this.windows.get(windowId);
            if (windowData) windowData.systemBuilder = sb;
        }
    }

    openCaseStudyWindow(project, projectsManager) {
        // External link projects - open in new tab
        if (project.externalLink) {
            window.open(project.externalLink, '_blank');
            return;
        }

        // Projects that open an existing in-OS window (e.g. Games.exe)
        if (project.opensWindow) {
            this.openWindow(project.opensWindow);
            return;
        }

        // Special handling for METBIC - open XP-style window
        if (project.title === 'METBIC') {
            this.openWindow('metbic', { width: 820, height: 520 });
            return;
        }

        // Special handling for FIREBOX - open XP-style window
        if (project.title === 'FIREBOX') {
            this.openWindow('firebox', { width: 820, height: 520 });
            return;
        }

        // Special handling for MarineSentry - open XP-style window
        if (project.title === 'MarineSentry') {
            this.openWindow('marinesentry', { width: 820, height: 520 });
            return;
        }

        // Special handling for MarineSentry - open XP-style window
        if (project.title === 'MarineSentry') {
            this.openWindow('marinesentry', { width: 820, height: 520 });
            return;
        }

        // Special handling for GUSTO - open XP-style window
        if (project.title === 'GUSTO') {
            this.openWindow('gusto', { width: 820, height: 520 });
            return;
        }

        // Special handling for FuncArt - open XP-style window
        if (project.title === 'FuncArt') {
            this.openWindow('funcart', { width: 820, height: 520 });
            return;
        }

        // Special handling for CoffeeForm - open XP-style window
        if (project.title === 'CoffeeForm') {
            this.openWindow('coffeeform', { width: 820, height: 520 });
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

    initializeGalleryWindow(windowEl) {
        const preview = windowEl.querySelector('#gal-preview');
        const label = windowEl.querySelector('#gal-label');
        const counter = windowEl.querySelector('#gal-counter');
        const prevBtn = windowEl.querySelector('#gal-prev');
        const nextBtn = windowEl.querySelector('#gal-next');
        const thumbstrip = windowEl.querySelector('#gal-thumbstrip');
        const thumbs = windowEl.querySelectorAll('.gal-thumb');
        const total = thumbs.length;
        let currentIndex = 0;

        const goTo = (index) => {
            if (index < 0) index = total - 1;
            if (index >= total) index = 0;
            currentIndex = index;
            const thumb = thumbs[currentIndex];
            preview.style.opacity = '0';
            setTimeout(() => {
                preview.src = thumb.dataset.src;
                preview.alt = thumb.dataset.label;
                preview.style.opacity = '1';
            }, 100);
            if (label) label.textContent = thumb.dataset.label;
            if (counter) counter.textContent = `${currentIndex + 1} / ${total}`;
            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        };

        prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
        nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

        thumbs.forEach((thumb, i) => {
            thumb.addEventListener('click', () => goTo(i));
        });

        // Keyboard navigation when window is focused
        windowEl.setAttribute('tabindex', '0');
        windowEl.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { goTo(currentIndex - 1); e.preventDefault(); }
            if (e.key === 'ArrowRight') { goTo(currentIndex + 1); e.preventDefault(); }
        });
        windowEl.focus();
    }

    initializeAiVisualsGallery(windowEl) {
        const preview = windowEl.querySelector('#aiv-preview');
        const video = windowEl.querySelector('#aiv-video');
        const label = windowEl.querySelector('#aiv-label');
        const counter = windowEl.querySelector('#aiv-counter');
        const prevBtn = windowEl.querySelector('#aiv-prev');
        const nextBtn = windowEl.querySelector('#aiv-next');
        const thumbs = windowEl.querySelectorAll('.aiv-thumb');
        const total = thumbs.length;
        if (!total) return;

        let currentIndex = 0;

        const goTo = (index) => {
            if (index < 0) index = total - 1;
            if (index >= total) index = 0;
            currentIndex = index;
            const thumb = thumbs[currentIndex];
            const type = thumb.dataset.type;
            const src = thumb.dataset.src;

            // Always pause/reset any playing video when switching
            if (video) {
                video.pause();
            }

            if (type === 'video') {
                if (preview) preview.style.display = 'none';
                if (video) {
                    video.style.display = '';
                    video.src = src;
                    video.poster = thumb.dataset.thumb;
                    video.load();
                }
            } else {
                if (video) {
                    video.style.display = 'none';
                    video.removeAttribute('src');
                }
                if (preview) {
                    preview.style.display = '';
                    preview.style.opacity = '0';
                    setTimeout(() => {
                        preview.src = src;
                        preview.alt = thumb.dataset.label;
                        preview.style.opacity = '1';
                    }, 100);
                }
            }

            if (label) label.textContent = thumb.dataset.label;
            if (counter) counter.textContent = `${currentIndex + 1} / ${total}`;
            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        };

        prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
        nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

        thumbs.forEach((thumb, i) => {
            thumb.addEventListener('click', () => goTo(i));
        });

        // Keyboard navigation when window is focused
        windowEl.setAttribute('tabindex', '0');
        windowEl.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { goTo(currentIndex - 1); e.preventDefault(); }
            if (e.key === 'ArrowRight') { goTo(currentIndex + 1); e.preventDefault(); }
        });

        // Open at the card the user clicked (set by the Work grid), default 0
        const startIndex = (typeof this._aiVisualsStartIndex === 'number') ? this._aiVisualsStartIndex : 0;
        this._aiVisualsStartIndex = 0;
        goTo(startIndex);
        windowEl.focus();
    }

    initializeMetbicWindow(windowEl) {
        const previewImg = windowEl.querySelector('#metbic-preview-img');
        const thumbs = windowEl.querySelectorAll('.metbic-thumb');
        const prevBtn = windowEl.querySelector('#metbic-prev');
        const nextBtn = windowEl.querySelector('#metbic-next');
        const counter = windowEl.querySelector('.metbic-counter');

        let currentIndex = 0;
        const totalImages = thumbs.length;

        // Function to update gallery
        const updateGallery = (index) => {
            currentIndex = index;
            if (currentIndex < 0) currentIndex = totalImages - 1;
            if (currentIndex >= totalImages) currentIndex = 0;

            const targetThumb = thumbs[currentIndex];
            const imgSrc = targetThumb.dataset.img;

            // Update active thumb
            thumbs.forEach(t => t.classList.remove('active'));
            targetThumb.classList.add('active');

            // Update preview image with fade
            if (imgSrc && previewImg) {
                previewImg.style.opacity = '0';
                setTimeout(() => {
                    previewImg.src = imgSrc;
                    previewImg.style.opacity = '1';
                }, 150);
            }

            // Update counter
            if (counter) {
                counter.textContent = `${currentIndex + 1} / ${totalImages}`;
            }

            // Scroll thumb into view
            targetThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };

        // Arrow button clicks
        if (prevBtn) {
            prevBtn.addEventListener('click', () => updateGallery(currentIndex - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => updateGallery(currentIndex + 1));
        }

        // Gallery thumbnail clicks
        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => updateGallery(index));
        });

        // Add smooth transition to preview image
        if (previewImg) {
            previewImg.style.transition = 'opacity 0.15s ease';
        }

        this.addProjectLightbox(windowEl, '#metbic-preview-img');
        this.addProjectKeyboard(windowEl, updateGallery, () => currentIndex, () => totalImages);
    }

    initializeCoffeeformWindow(windowEl) {
        const previewImg = windowEl.querySelector('#coffeeform-preview-img');
        const thumbs = windowEl.querySelectorAll('.coffeeform-thumb');
        const prevBtn = windowEl.querySelector('#coffeeform-prev');
        const nextBtn = windowEl.querySelector('#coffeeform-next');
        const counter = windowEl.querySelector('.coffeeform-counter');

        let currentIndex = 0;
        const totalImages = thumbs.length;

        const updateGallery = (index) => {
            currentIndex = index;
            if (currentIndex < 0) currentIndex = totalImages - 1;
            if (currentIndex >= totalImages) currentIndex = 0;

            const targetThumb = thumbs[currentIndex];
            const imgSrc = targetThumb.dataset.img;

            thumbs.forEach(t => t.classList.remove('active'));
            targetThumb.classList.add('active');

            if (imgSrc && previewImg) {
                previewImg.style.opacity = '0';
                setTimeout(() => {
                    previewImg.src = imgSrc;
                    previewImg.style.opacity = '1';
                }, 150);
            }

            if (counter) {
                counter.textContent = `${currentIndex + 1} / ${totalImages}`;
            }

            targetThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => updateGallery(currentIndex - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => updateGallery(currentIndex + 1));
        }

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => updateGallery(index));
        });

        if (previewImg) {
            previewImg.style.transition = 'opacity 0.15s ease';
        }

        this.addProjectLightbox(windowEl, '#coffeeform-preview-img');
        this.addProjectKeyboard(windowEl, updateGallery, () => currentIndex, () => totalImages);
    }

    initializeFireboxWindow(windowEl) {
        const previewImg = windowEl.querySelector('#firebox-preview-img');
        const previewVideo = windowEl.querySelector('#firebox-preview-video');
        const thumbs = windowEl.querySelectorAll('.firebox-thumb');
        const prevBtn = windowEl.querySelector('#firebox-prev');
        const nextBtn = windowEl.querySelector('#firebox-next');
        const counter = windowEl.querySelector('.firebox-counter');

        let currentIndex = 0;
        const totalImages = thumbs.length;

        // Function to update gallery
        const updateGallery = (index) => {
            currentIndex = index;
            if (currentIndex < 0) currentIndex = totalImages - 1;
            if (currentIndex >= totalImages) currentIndex = 0;

            const targetThumb = thumbs[currentIndex];
            const imgSrc = targetThumb.dataset.img;
            const videoSrc = targetThumb.dataset.video;

            // Update active thumb
            thumbs.forEach(t => t.classList.remove('active'));
            targetThumb.classList.add('active');

            if (videoSrc && previewVideo) {
                // Show video, hide image
                previewImg.style.display = 'none';
                previewVideo.style.display = 'block';
                previewVideo.src = videoSrc;
                previewVideo.play();
            } else if (imgSrc && previewImg) {
                // Show image, hide video
                if (previewVideo) {
                    previewVideo.pause();
                    previewVideo.style.display = 'none';
                }
                previewImg.style.display = 'block';
                previewImg.style.opacity = '0';
                setTimeout(() => {
                    previewImg.src = imgSrc;
                    previewImg.style.opacity = '1';
                }, 150);
            }

            // Update counter
            if (counter) {
                counter.textContent = `${currentIndex + 1} / ${totalImages}`;
            }

            // Scroll thumb into view
            targetThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };

        // Arrow button clicks
        if (prevBtn) {
            prevBtn.addEventListener('click', () => updateGallery(currentIndex - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => updateGallery(currentIndex + 1));
        }

        // Gallery thumbnail clicks
        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => updateGallery(index));
        });

        // Add smooth transition to preview image
        if (previewImg) {
            previewImg.style.transition = 'opacity 0.15s ease';
        }

        this.addProjectLightbox(windowEl, '#firebox-preview-img');
        this.addProjectKeyboard(windowEl, updateGallery, () => currentIndex, () => totalImages);
    }

    initializeMarinesentryWindow(windowEl) {
        const previewImg = windowEl.querySelector('#msentry-preview-img');
        const previewVideo = windowEl.querySelector('#msentry-preview-video');
        const thumbs = windowEl.querySelectorAll('.msentry-thumb');
        const prevBtn = windowEl.querySelector('#msentry-prev');
        const nextBtn = windowEl.querySelector('#msentry-next');
        const counter = windowEl.querySelector('.msentry-counter');

        let currentIndex = 0;
        const totalImages = thumbs.length;

        const updateGallery = (index) => {
            currentIndex = index;
            if (currentIndex < 0) currentIndex = totalImages - 1;
            if (currentIndex >= totalImages) currentIndex = 0;

            const targetThumb = thumbs[currentIndex];
            const imgSrc = targetThumb.dataset.img;
            const videoSrc = targetThumb.dataset.video;

            thumbs.forEach(t => t.classList.remove('active'));
            targetThumb.classList.add('active');

            if (videoSrc && previewVideo) {
                previewImg.style.display = 'none';
                previewVideo.style.display = 'block';
                previewVideo.src = videoSrc;
                previewVideo.play();
            } else if (imgSrc && previewImg) {
                if (previewVideo) {
                    previewVideo.pause();
                    previewVideo.style.display = 'none';
                }
                previewImg.style.display = 'block';
                previewImg.style.opacity = '0';
                setTimeout(() => {
                    previewImg.src = imgSrc;
                    previewImg.style.opacity = '1';
                }, 150);
            }

            if (counter) {
                counter.textContent = `${currentIndex + 1} / ${totalImages}`;
            }

            targetThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };

        if (prevBtn) prevBtn.addEventListener('click', () => updateGallery(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => updateGallery(currentIndex + 1));
        thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => updateGallery(index)));
        if (previewImg) previewImg.style.transition = 'opacity 0.15s ease';

        this.addProjectLightbox(windowEl, '#msentry-preview-img');
        this.addProjectKeyboard(windowEl, updateGallery, () => currentIndex, () => totalImages);
    }

    initializeGustoWindow(windowEl) {
        const previewImg = windowEl.querySelector('#gusto-preview-img');
        const thumbs = windowEl.querySelectorAll('.gusto-thumb');
        const prevBtn = windowEl.querySelector('#gusto-prev');
        const nextBtn = windowEl.querySelector('#gusto-next');
        const counter = windowEl.querySelector('.gusto-counter');

        let currentIndex = 0;
        const totalImages = thumbs.length;

        const updateGallery = (index) => {
            currentIndex = index;
            if (currentIndex < 0) currentIndex = totalImages - 1;
            if (currentIndex >= totalImages) currentIndex = 0;

            const targetThumb = thumbs[currentIndex];
            const imgSrc = targetThumb.dataset.img;

            thumbs.forEach(t => t.classList.remove('active'));
            targetThumb.classList.add('active');

            if (imgSrc && previewImg) {
                previewImg.style.opacity = '0';
                setTimeout(() => {
                    previewImg.src = imgSrc;
                    previewImg.style.opacity = '1';
                }, 150);
            }

            if (counter) {
                counter.textContent = `${currentIndex + 1} / ${totalImages}`;
            }

            targetThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => updateGallery(currentIndex - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => updateGallery(currentIndex + 1));
        }

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => updateGallery(index));
        });

        if (previewImg) {
            previewImg.style.transition = 'opacity 0.15s ease';
        }

        this.addProjectLightbox(windowEl, '#gusto-preview-img');
        this.addProjectKeyboard(windowEl, updateGallery, () => currentIndex, () => totalImages);
    }

    initializeFuncartWindow(windowEl) {
        const previewImg = windowEl.querySelector('#funcart-preview-img');
        const thumbs = windowEl.querySelectorAll('.funcart-thumb');
        const prevBtn = windowEl.querySelector('#funcart-prev');
        const nextBtn = windowEl.querySelector('#funcart-next');
        const counter = windowEl.querySelector('.funcart-counter');

        let currentIndex = 0;
        const totalImages = thumbs.length;

        const updateGallery = (index) => {
            currentIndex = index;
            if (currentIndex < 0) currentIndex = totalImages - 1;
            if (currentIndex >= totalImages) currentIndex = 0;

            const targetThumb = thumbs[currentIndex];
            const imgSrc = targetThumb.dataset.img;

            thumbs.forEach(t => t.classList.remove('active'));
            targetThumb.classList.add('active');

            if (imgSrc && previewImg) {
                previewImg.style.opacity = '0';
                setTimeout(() => {
                    previewImg.src = imgSrc;
                    previewImg.style.opacity = '1';
                }, 150);
            }

            if (counter) {
                counter.textContent = `${currentIndex + 1} / ${totalImages}`;
            }

            targetThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => updateGallery(currentIndex - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => updateGallery(currentIndex + 1));
        }

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => updateGallery(index));
        });

        if (previewImg) {
            previewImg.style.transition = 'opacity 0.15s ease';
        }

        this.addProjectLightbox(windowEl, '#funcart-preview-img');
        this.addProjectKeyboard(windowEl, updateGallery, () => currentIndex, () => totalImages);
    }

    // ========== SHARED: Lightbox + Keyboard for project windows ==========
    openLightbox(src) {
        if (!src || src.endsWith('.mp4')) return;
        const overlay = document.createElement('div');
        overlay.className = 'project-lightbox';
        overlay.innerHTML = `
            <button class="project-lightbox-close">&times;</button>
            <img src="${src}" alt="Preview">
        `;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('active'));

        const close = () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 200);
            document.removeEventListener('keydown', escHandler);
        };
        const escHandler = (e) => { if (e.key === 'Escape') close(); };
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('project-lightbox-close')) close();
        });
        document.addEventListener('keydown', escHandler);
    }

    addProjectKeyboard(windowEl, updateGalleryFn, getCurrentIndex, getTotal) {
        windowEl.setAttribute('tabindex', '0');
        windowEl.focus();
        windowEl.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); updateGalleryFn(getCurrentIndex() - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); updateGalleryFn(getCurrentIndex() + 1); }
        });
    }

    addProjectLightbox(windowEl, previewImgSelector) {
        const img = windowEl.querySelector(previewImgSelector);
        if (img) {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => this.openLightbox(img.src));
        }
    }

    initializeArchiveWindow(windowEl) {
        const stage = windowEl.querySelector('#archive-stage');
        if (!stage || typeof ArchiveGallery === 'undefined') return;

        const cards = window.ARCHIVE_CARDS || [];
        if (!cards.length) {
            stage.innerHTML = '<div style="color:#8ba4b4;font:12px Tahoma;padding:24px">No cards in ARCHIVE_CARDS.</div>';
            return;
        }

        // The stage needs its real size before the intro is choreographed.
        requestAnimationFrame(() => {
            const gallery = new ArchiveGallery(stage, cards);
            const windowData = this.windows.get('archive');
            if (!windowData) { gallery.destroy(); return; }
            windowData.archiveGallery = gallery;
            windowData.archiveCleanup = () => gallery.destroy();
        });
    }

    initializeGamesWindow(windowEl) {
        const windowData = this.windows.get('games');
        const tabs = windowEl.querySelectorAll('.games-tab');
        const gamesArea = windowEl.querySelector('#games-area');
        let currentGame = 'minesweeper';
        let msTimer = null;
        let snakeInterval = null;
        let snakeKeyHandler = null;
        let tetrisInterval = null;
        let tetrisKeyHandler = null;
        let pongInterval = null;
        let pongKeyHandler = null;
        let pongKeyUpHandler = null;

        // Cleanup function
        windowData.gamesCleanup = () => {
            if (msTimer) clearInterval(msTimer);
            if (snakeInterval) clearInterval(snakeInterval);
            if (snakeKeyHandler) document.removeEventListener('keydown', snakeKeyHandler);
            if (tetrisInterval) cancelAnimationFrame(tetrisInterval);
            if (tetrisKeyHandler) document.removeEventListener('keydown', tetrisKeyHandler);
            if (pongInterval) cancelAnimationFrame(pongInterval);
            if (pongKeyHandler) document.removeEventListener('keydown', pongKeyHandler);
            if (pongKeyUpHandler) document.removeEventListener('keyup', pongKeyUpHandler);
        };

        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const game = tab.dataset.game;
                if (game === currentGame) return;
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                // Cleanup previous game
                if (msTimer) { clearInterval(msTimer); msTimer = null; }
                if (snakeInterval) { clearInterval(snakeInterval); snakeInterval = null; }
                if (snakeKeyHandler) { document.removeEventListener('keydown', snakeKeyHandler); snakeKeyHandler = null; }
                if (tetrisInterval) { cancelAnimationFrame(tetrisInterval); tetrisInterval = null; }
                if (tetrisKeyHandler) { document.removeEventListener('keydown', tetrisKeyHandler); tetrisKeyHandler = null; }
                if (pongInterval) { cancelAnimationFrame(pongInterval); pongInterval = null; }
                if (pongKeyHandler) { document.removeEventListener('keydown', pongKeyHandler); pongKeyHandler = null; }
                if (pongKeyUpHandler) { document.removeEventListener('keyup', pongKeyUpHandler); pongKeyUpHandler = null; }
                currentGame = game;
                if (game === 'minesweeper') initMinesweeper();
                else if (game === 'snake') initSnake();
                else if (game === 'tetris') initTetris();
                else if (game === 'pong') initPong();
            });
        });

        // ===================== MINESWEEPER =====================
        const ROWS = 9, COLS = 9, MINES = 10;
        let msGrid, msRevealed, msFlags, msMines, msGameOver, msWon, msFirstClick, msTimerVal;

        function initMinesweeper() {
            gamesArea.innerHTML = `
                <div class="ms-container" id="ms-container">
                    <div class="ms-header">
                        <div class="ms-counter" id="ms-mines">010</div>
                        <div class="ms-face" id="ms-face">😊</div>
                        <div class="ms-counter" id="ms-timer">000</div>
                    </div>
                    <div class="ms-grid" id="ms-grid"></div>
                </div>`;
            msGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
            msRevealed = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
            msFlags = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
            msMines = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
            msGameOver = false; msWon = false; msFirstClick = true; msTimerVal = 0;
            if (msTimer) clearInterval(msTimer);
            msTimer = null;
            renderMsGrid();
            const face = windowEl.querySelector('#ms-face');
            if (face) face.addEventListener('click', initMinesweeper);
        }

        function placeMines(safeR, safeC) {
            let placed = 0;
            while (placed < MINES) {
                const r = Math.floor(Math.random() * ROWS);
                const c = Math.floor(Math.random() * COLS);
                if (msMines[r][c]) continue;
                if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
                msMines[r][c] = true;
                placed++;
            }
            // Calculate numbers
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    if (msMines[r][c]) { msGrid[r][c] = -1; continue; }
                    let count = 0;
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            const nr = r + dr, nc = c + dc;
                            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && msMines[nr][nc]) count++;
                        }
                    }
                    msGrid[r][c] = count;
                }
            }
        }

        function renderMsGrid() {
            const gridEl = windowEl.querySelector('#ms-grid');
            if (!gridEl) return;
            gridEl.innerHTML = '';
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const cell = document.createElement('div');
                    cell.className = 'ms-cell';
                    cell.dataset.r = r;
                    cell.dataset.c = c;
                    if (msRevealed[r][c]) {
                        cell.classList.add('revealed');
                        if (msMines[r][c]) {
                            cell.textContent = '💣';
                        } else if (msGrid[r][c] > 0) {
                            cell.textContent = msGrid[r][c];
                            cell.dataset.num = msGrid[r][c];
                        }
                    } else if (msFlags[r][c]) {
                        cell.textContent = '🚩';
                    }
                    cell.addEventListener('click', (e) => msLeftClick(r, c));
                    cell.addEventListener('contextmenu', (e) => { e.preventDefault(); msRightClick(r, c); });
                    cell.addEventListener('mousedown', () => { if (!msGameOver && !msWon) setFace('😮'); });
                    cell.addEventListener('mouseup', () => { if (!msGameOver && !msWon) setFace('😊'); });
                    gridEl.appendChild(cell);
                }
            }
            updateMsCounter();
        }

        function setFace(emoji) {
            const face = windowEl.querySelector('#ms-face');
            if (face) face.textContent = emoji;
        }

        function updateMsCounter() {
            const minesEl = windowEl.querySelector('#ms-mines');
            let flagCount = 0;
            for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (msFlags[r][c]) flagCount++;
            if (minesEl) minesEl.textContent = String(MINES - flagCount).padStart(3, '0');
        }

        function startMsTimer() {
            if (msTimer) return;
            msTimerVal = 0;
            msTimer = setInterval(() => {
                msTimerVal++;
                const timerEl = windowEl.querySelector('#ms-timer');
                if (timerEl) timerEl.textContent = String(Math.min(msTimerVal, 999)).padStart(3, '0');
            }, 1000);
        }

        function msLeftClick(r, c) {
            if (msGameOver || msWon) return;
            if (msFlags[r][c]) return;
            if (msRevealed[r][c]) return;

            if (msFirstClick) {
                msFirstClick = false;
                placeMines(r, c);
                startMsTimer();
            }

            if (msMines[r][c]) {
                // Game over
                msGameOver = true;
                if (msTimer) { clearInterval(msTimer); msTimer = null; }
                // Reveal all mines
                for (let rr = 0; rr < ROWS; rr++)
                    for (let cc = 0; cc < COLS; cc++)
                        if (msMines[rr][cc]) msRevealed[rr][cc] = true;
                setFace('💀');
                renderMsGrid();
                // Mark the hit mine
                const hitCell = windowEl.querySelector(`#ms-grid .ms-cell[data-r="${r}"][data-c="${c}"]`);
                if (hitCell) hitCell.classList.add('mine-hit');
                return;
            }

            // Flood fill reveal
            floodReveal(r, c);
            checkMsWin();
            renderMsGrid();
        }

        function floodReveal(r, c) {
            if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
            if (msRevealed[r][c] || msFlags[r][c] || msMines[r][c]) return;
            msRevealed[r][c] = true;
            if (msGrid[r][c] === 0) {
                for (let dr = -1; dr <= 1; dr++)
                    for (let dc = -1; dc <= 1; dc++)
                        floodReveal(r + dr, c + dc);
            }
        }

        function msRightClick(r, c) {
            if (msGameOver || msWon) return;
            if (msRevealed[r][c]) return;
            msFlags[r][c] = !msFlags[r][c];
            renderMsGrid();
        }

        function checkMsWin() {
            let unrevealed = 0;
            for (let r = 0; r < ROWS; r++)
                for (let c = 0; c < COLS; c++)
                    if (!msRevealed[r][c]) unrevealed++;
            if (unrevealed === MINES) {
                msWon = true;
                if (msTimer) { clearInterval(msTimer); msTimer = null; }
                setFace('😎');
            }
        }

        // ===================== SNAKE =====================
        const SNAKE_SIZE = 18;
        const GRID_W = 20, GRID_H = 20;

        function initSnake() {
            gamesArea.innerHTML = `
                <div class="snake-container">
                    <div class="snake-header">
                        <div class="snake-score" id="snake-score">Score: 0</div>
                        <button class="snake-btn" id="snake-restart">New Game</button>
                    </div>
                    <canvas class="snake-canvas" id="snake-canvas" width="${GRID_W * SNAKE_SIZE}" height="${GRID_H * SNAKE_SIZE}" style="touch-action:none"></canvas>
                    <div class="snake-info">Arrow keys or swipe to move</div>
                </div>`;

            const canvas = windowEl.querySelector('#snake-canvas');
            const ctx = canvas.getContext('2d');
            let snake, dir, nextDir, food, score, gameOver;

            function resetSnake() {
                snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
                dir = { x: 1, y: 0 };
                nextDir = { x: 1, y: 0 };
                score = 0;
                gameOver = false;
                placeFood();
                updateScoreDisplay();
            }

            function placeFood() {
                do {
                    food = { x: Math.floor(Math.random() * GRID_W), y: Math.floor(Math.random() * GRID_H) };
                } while (snake.some(s => s.x === food.x && s.y === food.y));
            }

            function updateScoreDisplay() {
                const el = windowEl.querySelector('#snake-score');
                if (el) el.textContent = `Score: ${score}`;
            }

            function drawSnake() {
                // Background - dark green grid
                ctx.fillStyle = '#1a2e1a';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Grid lines
                ctx.strokeStyle = '#1f351f';
                ctx.lineWidth = 0.5;
                for (let x = 0; x <= GRID_W; x++) {
                    ctx.beginPath(); ctx.moveTo(x * SNAKE_SIZE, 0); ctx.lineTo(x * SNAKE_SIZE, canvas.height); ctx.stroke();
                }
                for (let y = 0; y <= GRID_H; y++) {
                    ctx.beginPath(); ctx.moveTo(0, y * SNAKE_SIZE); ctx.lineTo(canvas.width, y * SNAKE_SIZE); ctx.stroke();
                }
                // Food
                ctx.fillStyle = '#ff3333';
                ctx.fillRect(food.x * SNAKE_SIZE + 2, food.y * SNAKE_SIZE + 2, SNAKE_SIZE - 4, SNAKE_SIZE - 4);
                // Snake
                snake.forEach((seg, i) => {
                    ctx.fillStyle = i === 0 ? '#4caf50' : '#388e3c';
                    ctx.fillRect(seg.x * SNAKE_SIZE + 1, seg.y * SNAKE_SIZE + 1, SNAKE_SIZE - 2, SNAKE_SIZE - 2);
                });
                // Game over overlay
                if (gameOver) {
                    ctx.fillStyle = 'rgba(0,0,0,0.6)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 20px Segoe UI, Tahoma, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
                    ctx.font = '13px Segoe UI, Tahoma, sans-serif';
                    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 14);
                    ctx.fillText('Press Space, tap, or click New Game', canvas.width / 2, canvas.height / 2 + 36);
                }
            }

            function tick() {
                if (gameOver) return;
                dir = nextDir;
                const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
                // Wall collision
                if (head.x < 0 || head.x >= GRID_W || head.y < 0 || head.y >= GRID_H) {
                    gameOver = true;
                    drawSnake();
                    return;
                }
                // Self collision
                if (snake.some(s => s.x === head.x && s.y === head.y)) {
                    gameOver = true;
                    drawSnake();
                    return;
                }
                snake.unshift(head);
                if (head.x === food.x && head.y === food.y) {
                    score += 10;
                    updateScoreDisplay();
                    placeFood();
                } else {
                    snake.pop();
                }
                drawSnake();
            }

            snakeKeyHandler = (e) => {
                if (e.key === ' ' && gameOver) {
                    resetSnake();
                    drawSnake();
                    if (snakeInterval) clearInterval(snakeInterval);
                    snakeInterval = setInterval(tick, 150);
                    return;
                }
                const keyMap = {
                    'ArrowUp': { x: 0, y: -1 },
                    'ArrowDown': { x: 0, y: 1 },
                    'ArrowLeft': { x: -1, y: 0 },
                    'ArrowRight': { x: 1, y: 0 }
                };
                const nd = keyMap[e.key];
                if (nd) {
                    // Prevent reversing
                    if (nd.x !== -dir.x || nd.y !== -dir.y) {
                        nextDir = nd;
                    }
                    e.preventDefault();
                }
            };
            document.addEventListener('keydown', snakeKeyHandler);

            // Touch swipe controls
            let touchStartX = null, touchStartY = null;

            canvas.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                e.preventDefault();
                e.stopPropagation();
            }, { passive: false });

            canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (touchStartX === null) return;
                const dx = e.changedTouches[0].clientX - touchStartX;
                const dy = e.changedTouches[0].clientY - touchStartY;
                const minSwipe = 20;

                if (gameOver && Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) {
                    resetSnake(); drawSnake();
                    if (snakeInterval) clearInterval(snakeInterval);
                    snakeInterval = setInterval(tick, 150);
                    touchStartX = null; return;
                }

                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= minSwipe) {
                    const nd = dx > 0 ? {x:1,y:0} : {x:-1,y:0};
                    if (nd.x !== -dir.x || nd.y !== -dir.y) nextDir = nd;
                } else if (Math.abs(dy) >= minSwipe) {
                    const nd = dy > 0 ? {x:0,y:1} : {x:0,y:-1};
                    if (nd.x !== -dir.x || nd.y !== -dir.y) nextDir = nd;
                }
                touchStartX = null; touchStartY = null;
            }, { passive: false });

            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, { passive: false });

            const restartBtn = windowEl.querySelector('#snake-restart');
            if (restartBtn) restartBtn.addEventListener('click', () => {
                resetSnake();
                drawSnake();
                if (snakeInterval) clearInterval(snakeInterval);
                snakeInterval = setInterval(tick, 150);
            });

            resetSnake();
            drawSnake();
            snakeInterval = setInterval(tick, 150);
        }

        // ===================== TETRIS =====================
        const T_COLS = 10, T_ROWS = 20, T_CELL = 18;
        const TETROMINOS = [
            { shape: [[1,1,1,1]], color: '#00f0f0' },           // I
            { shape: [[1,1],[1,1]], color: '#f0f000' },          // O
            { shape: [[0,1,0],[1,1,1]], color: '#a000f0' },      // T
            { shape: [[0,1,1],[1,1,0]], color: '#00f000' },      // S
            { shape: [[1,1,0],[0,1,1]], color: '#f00000' },      // Z
            { shape: [[1,0,0],[1,1,1]], color: '#0000f0' },      // J
            { shape: [[0,0,1],[1,1,1]], color: '#f0a000' }       // L
        ];

        function initTetris() {
            gamesArea.innerHTML = `
                <div class="tetris-container">
                    <div class="tetris-header">
                        <div class="tetris-stat" id="tetris-score">Score: 0</div>
                        <div class="tetris-stat" id="tetris-level">Level: 1</div>
                        <button class="tetris-btn" id="tetris-restart">New Game</button>
                    </div>
                    <div style="display:flex;align-items:flex-start;">
                        <canvas class="tetris-canvas" id="tetris-canvas" width="${T_COLS * T_CELL}" height="${T_ROWS * T_CELL}" style="touch-action:none"></canvas>
                        <div class="tetris-side">
                            <div class="tetris-label">NEXT</div>
                            <canvas class="tetris-next-canvas" id="tetris-next" width="${4 * T_CELL}" height="${4 * T_CELL}"></canvas>
                            <div class="tetris-stat" id="tetris-lines">Lines: 0</div>
                        </div>
                    </div>
                    <div class="tetris-info">Arrow keys / swipe to move</div>
                </div>`;

            const canvas = windowEl.querySelector('#tetris-canvas');
            const ctx = canvas.getContext('2d');
            const nextCanvas = windowEl.querySelector('#tetris-next');
            const nextCtx = nextCanvas.getContext('2d');
            let board, current, next, curX, curY, tScore, tLines, tLevel, tGameOver, dropCounter, dropInterval, lastTime;

            function newPiece() {
                const idx = Math.floor(Math.random() * TETROMINOS.length);
                return { shape: TETROMINOS[idx].shape.map(r => [...r]), color: TETROMINOS[idx].color };
            }

            function resetTetris() {
                board = Array.from({ length: T_ROWS }, () => Array(T_COLS).fill(null));
                current = newPiece();
                next = newPiece();
                curX = Math.floor((T_COLS - current.shape[0].length) / 2);
                curY = 0;
                tScore = 0; tLines = 0; tLevel = 1;
                tGameOver = false;
                dropCounter = 0;
                dropInterval = 800;
                lastTime = 0;
                updateTetrisUI();
            }

            function updateTetrisUI() {
                const sEl = windowEl.querySelector('#tetris-score');
                const lvEl = windowEl.querySelector('#tetris-level');
                const lnEl = windowEl.querySelector('#tetris-lines');
                if (sEl) sEl.textContent = `Score: ${tScore}`;
                if (lvEl) lvEl.textContent = `Level: ${tLevel}`;
                if (lnEl) lnEl.textContent = `Lines: ${tLines}`;
            }

            function collides(shape, offX, offY) {
                for (let r = 0; r < shape.length; r++) {
                    for (let c = 0; c < shape[r].length; c++) {
                        if (!shape[r][c]) continue;
                        const nx = offX + c, ny = offY + r;
                        if (nx < 0 || nx >= T_COLS || ny >= T_ROWS) return true;
                        if (ny >= 0 && board[ny][nx]) return true;
                    }
                }
                return false;
            }

            function merge() {
                for (let r = 0; r < current.shape.length; r++) {
                    for (let c = 0; c < current.shape[r].length; c++) {
                        if (!current.shape[r][c]) continue;
                        const ny = curY + r;
                        if (ny < 0) { tGameOver = true; return; }
                        board[ny][curX + c] = current.color;
                    }
                }
            }

            function clearLines() {
                let cleared = 0;
                for (let r = T_ROWS - 1; r >= 0; r--) {
                    if (board[r].every(cell => cell !== null)) {
                        board.splice(r, 1);
                        board.unshift(Array(T_COLS).fill(null));
                        cleared++;
                        r++; // recheck same row
                    }
                }
                if (cleared > 0) {
                    const points = [0, 100, 300, 500, 800];
                    tScore += (points[cleared] || 800) * tLevel;
                    tLines += cleared;
                    tLevel = Math.floor(tLines / 10) + 1;
                    dropInterval = Math.max(100, 800 - (tLevel - 1) * 70);
                    updateTetrisUI();
                }
            }

            function rotate(shape) {
                const rows = shape.length, cols = shape[0].length;
                const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));
                for (let r = 0; r < rows; r++)
                    for (let c = 0; c < cols; c++)
                        rotated[c][rows - 1 - r] = shape[r][c];
                return rotated;
            }

            function tryRotate() {
                const rotated = rotate(current.shape);
                // Wall kick: try 0, -1, +1, -2, +2
                for (const kick of [0, -1, 1, -2, 2]) {
                    if (!collides(rotated, curX + kick, curY)) {
                        current.shape = rotated;
                        curX += kick;
                        return;
                    }
                }
            }

            function drop() {
                if (tGameOver) return;
                if (!collides(current.shape, curX, curY + 1)) {
                    curY++;
                } else {
                    merge();
                    if (tGameOver) return;
                    clearLines();
                    current = next;
                    next = newPiece();
                    curX = Math.floor((T_COLS - current.shape[0].length) / 2);
                    curY = 0;
                    if (collides(current.shape, curX, curY)) {
                        tGameOver = true;
                    }
                }
            }

            function hardDrop() {
                while (!collides(current.shape, curX, curY + 1)) curY++;
                drop();
            }

            function drawBoard() {
                ctx.fillStyle = '#111';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Grid
                ctx.strokeStyle = '#1a1a1a';
                ctx.lineWidth = 0.5;
                for (let x = 0; x <= T_COLS; x++) { ctx.beginPath(); ctx.moveTo(x * T_CELL, 0); ctx.lineTo(x * T_CELL, canvas.height); ctx.stroke(); }
                for (let y = 0; y <= T_ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * T_CELL); ctx.lineTo(canvas.width, y * T_CELL); ctx.stroke(); }
                // Placed blocks
                for (let r = 0; r < T_ROWS; r++) {
                    for (let c = 0; c < T_COLS; c++) {
                        if (board[r][c]) {
                            ctx.fillStyle = board[r][c];
                            ctx.fillRect(c * T_CELL + 1, r * T_CELL + 1, T_CELL - 2, T_CELL - 2);
                            ctx.fillStyle = 'rgba(255,255,255,0.15)';
                            ctx.fillRect(c * T_CELL + 1, r * T_CELL + 1, T_CELL - 2, 2);
                        }
                    }
                }
                // Current piece
                if (current) {
                    for (let r = 0; r < current.shape.length; r++) {
                        for (let c = 0; c < current.shape[r].length; c++) {
                            if (!current.shape[r][c]) continue;
                            const dx = (curX + c) * T_CELL, dy = (curY + r) * T_CELL;
                            ctx.fillStyle = current.color;
                            ctx.fillRect(dx + 1, dy + 1, T_CELL - 2, T_CELL - 2);
                            ctx.fillStyle = 'rgba(255,255,255,0.2)';
                            ctx.fillRect(dx + 1, dy + 1, T_CELL - 2, 2);
                        }
                    }
                }
                // Game over
                if (tGameOver) {
                    ctx.fillStyle = 'rgba(0,0,0,0.7)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 18px Segoe UI, Tahoma, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
                    ctx.font = '12px Segoe UI, Tahoma, sans-serif';
                    ctx.fillText(`Score: ${tScore}`, canvas.width / 2, canvas.height / 2 + 12);
                    ctx.fillText('Click New Game to restart', canvas.width / 2, canvas.height / 2 + 30);
                }
                // Next piece preview
                nextCtx.fillStyle = '#111';
                nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
                if (next) {
                    const offX = Math.floor((4 - next.shape[0].length) / 2);
                    const offY = Math.floor((4 - next.shape.length) / 2);
                    for (let r = 0; r < next.shape.length; r++) {
                        for (let c = 0; c < next.shape[r].length; c++) {
                            if (!next.shape[r][c]) continue;
                            nextCtx.fillStyle = next.color;
                            nextCtx.fillRect((offX + c) * T_CELL + 1, (offY + r) * T_CELL + 1, T_CELL - 2, T_CELL - 2);
                        }
                    }
                }
            }

            function tetrisLoop(time) {
                if (tGameOver) { drawBoard(); return; }
                const delta = time - lastTime;
                lastTime = time;
                dropCounter += delta;
                if (dropCounter >= dropInterval) {
                    drop();
                    dropCounter = 0;
                }
                drawBoard();
                tetrisInterval = requestAnimationFrame(tetrisLoop);
            }

            // Use requestAnimationFrame instead of setInterval for smoother gameplay
            function startTetrisLoop() {
                if (tetrisInterval) cancelAnimationFrame(tetrisInterval);
                lastTime = performance.now();
                dropCounter = 0;
                tetrisInterval = requestAnimationFrame(tetrisLoop);
            }

            tetrisKeyHandler = (e) => {
                if (tGameOver) return;
                switch (e.key) {
                    case 'ArrowLeft':
                        if (!collides(current.shape, curX - 1, curY)) curX--;
                        e.preventDefault(); break;
                    case 'ArrowRight':
                        if (!collides(current.shape, curX + 1, curY)) curX++;
                        e.preventDefault(); break;
                    case 'ArrowDown':
                        if (!collides(current.shape, curX, curY + 1)) { curY++; tScore += 1; updateTetrisUI(); }
                        e.preventDefault(); break;
                    case 'ArrowUp':
                        tryRotate();
                        e.preventDefault(); break;
                    case ' ':
                        hardDrop();
                        e.preventDefault(); break;
                }
            };
            document.addEventListener('keydown', tetrisKeyHandler);

            // Touch controls
            let tTouchStartX = null, tTouchStartY = null, tTouchTime = null;
            canvas.addEventListener('touchstart', (e) => {
                tTouchStartX = e.touches[0].clientX;
                tTouchStartY = e.touches[0].clientY;
                tTouchTime = Date.now();
                e.preventDefault();
            }, { passive: false });

            canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (tTouchStartX === null) return;
                const dx = e.changedTouches[0].clientX - tTouchStartX;
                const dy = e.changedTouches[0].clientY - tTouchStartY;
                const elapsed = Date.now() - tTouchTime;
                const minSwipe = 25;

                if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe && elapsed < 300) {
                    // Tap = rotate
                    tryRotate();
                } else if (Math.abs(dy) > Math.abs(dx) && dy > minSwipe) {
                    // Swipe down = hard drop
                    hardDrop();
                } else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= minSwipe) {
                    if (dx > 0) { if (!collides(current.shape, curX + 1, curY)) curX++; }
                    else { if (!collides(current.shape, curX - 1, curY)) curX--; }
                }
                tTouchStartX = null; tTouchStartY = null;
            }, { passive: false });

            canvas.addEventListener('touchmove', (e) => { e.preventDefault(); }, { passive: false });

            const tetrisRestart = windowEl.querySelector('#tetris-restart');
            if (tetrisRestart) tetrisRestart.addEventListener('click', () => {
                resetTetris();
                startTetrisLoop();
            });

            resetTetris();
            drawBoard();
            startTetrisLoop();
        }

        // ===================== PONG =====================
        const PONG_W = 360, PONG_H = 260;
        const PADDLE_H = 50, PADDLE_W = 8, BALL_R = 5, WIN_SCORE = 5;

        function initPong() {
            gamesArea.innerHTML = `
                <div class="pong-container">
                    <div class="pong-header">
                        <div class="pong-score" id="pong-score">0 : 0</div>
                        <button class="pong-btn" id="pong-restart">New Game</button>
                    </div>
                    <canvas class="pong-canvas" id="pong-canvas" width="${PONG_W}" height="${PONG_H}" style="touch-action:none"></canvas>
                    <div class="pong-info">W/S or Arrow keys to move paddle</div>
                </div>`;

            const canvas = windowEl.querySelector('#pong-canvas');
            const ctx = canvas.getContext('2d');
            let p1Y, p2Y, ballX, ballY, ballVX, ballVY, p1Score, p2Score, pGameOver, winner;
            let keysDown = {};

            function resetBall() {
                ballX = PONG_W / 2;
                ballY = PONG_H / 2;
                const angle = (Math.random() * Math.PI / 3) - Math.PI / 6;
                const dir = Math.random() > 0.5 ? 1 : -1;
                ballVX = dir * 3 * Math.cos(angle);
                ballVY = 3 * Math.sin(angle);
            }

            function resetPong() {
                p1Y = PONG_H / 2 - PADDLE_H / 2;
                p2Y = PONG_H / 2 - PADDLE_H / 2;
                p1Score = 0; p2Score = 0;
                pGameOver = false; winner = '';
                resetBall();
                updatePongScore();
            }

            function updatePongScore() {
                const el = windowEl.querySelector('#pong-score');
                if (el) el.textContent = `${p1Score} : ${p2Score}`;
            }

            function drawPong() {
                // Background
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, PONG_W, PONG_H);
                // Center line
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(PONG_W / 2, 0);
                ctx.lineTo(PONG_W / 2, PONG_H);
                ctx.stroke();
                ctx.setLineDash([]);
                // Paddles
                ctx.fillStyle = '#fff';
                ctx.fillRect(10, p1Y, PADDLE_W, PADDLE_H);
                ctx.fillRect(PONG_W - 10 - PADDLE_W, p2Y, PADDLE_W, PADDLE_H);
                // Ball
                ctx.beginPath();
                ctx.arc(ballX, ballY, BALL_R, 0, Math.PI * 2);
                ctx.fill();
                // Score display on canvas
                ctx.font = 'bold 28px Consolas, Courier New, monospace';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#222';
                ctx.fillText(p1Score, PONG_W / 4, 36);
                ctx.fillText(p2Score, 3 * PONG_W / 4, 36);
                // Game over
                if (pGameOver) {
                    ctx.fillStyle = 'rgba(0,0,0,0.7)';
                    ctx.fillRect(0, 0, PONG_W, PONG_H);
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 22px Segoe UI, Tahoma, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(winner + ' WINS!', PONG_W / 2, PONG_H / 2 - 10);
                    ctx.font = '13px Segoe UI, Tahoma, sans-serif';
                    ctx.fillText(`${p1Score} - ${p2Score}`, PONG_W / 2, PONG_H / 2 + 14);
                    ctx.fillText('Click New Game to play again', PONG_W / 2, PONG_H / 2 + 34);
                }
            }

            function pongTick() {
                if (pGameOver) { drawPong(); return; }

                // Player 1 input
                const pSpeed = 4;
                if (keysDown['w'] || keysDown['W'] || keysDown['ArrowUp']) p1Y = Math.max(0, p1Y - pSpeed);
                if (keysDown['s'] || keysDown['S'] || keysDown['ArrowDown']) p1Y = Math.min(PONG_H - PADDLE_H, p1Y + pSpeed);

                // AI for player 2
                const p2Center = p2Y + PADDLE_H / 2;
                const aiSpeed = 2.8;
                if (ballVX > 0) {
                    if (p2Center < ballY - 8) p2Y += aiSpeed;
                    else if (p2Center > ballY + 8) p2Y -= aiSpeed;
                } else {
                    // Return to center when ball is going away
                    const center = PONG_H / 2 - PADDLE_H / 2;
                    if (p2Y < center - 2) p2Y += aiSpeed * 0.5;
                    else if (p2Y > center + 2) p2Y -= aiSpeed * 0.5;
                }
                p2Y = Math.max(0, Math.min(PONG_H - PADDLE_H, p2Y));

                // Ball movement
                ballX += ballVX;
                ballY += ballVY;

                // Top/bottom walls
                if (ballY - BALL_R <= 0) { ballY = BALL_R; ballVY = Math.abs(ballVY); }
                if (ballY + BALL_R >= PONG_H) { ballY = PONG_H - BALL_R; ballVY = -Math.abs(ballVY); }

                // Left paddle collision
                if (ballX - BALL_R <= 10 + PADDLE_W && ballX - BALL_R >= 10 && ballY >= p1Y && ballY <= p1Y + PADDLE_H) {
                    ballX = 10 + PADDLE_W + BALL_R;
                    const hitPos = (ballY - p1Y) / PADDLE_H - 0.5; // -0.5 to 0.5
                    const speed = Math.sqrt(ballVX * ballVX + ballVY * ballVY) + 0.15;
                    const angle = hitPos * (Math.PI / 3);
                    ballVX = Math.abs(speed * Math.cos(angle));
                    ballVY = speed * Math.sin(angle);
                }

                // Right paddle collision
                if (ballX + BALL_R >= PONG_W - 10 - PADDLE_W && ballX + BALL_R <= PONG_W - 10 && ballY >= p2Y && ballY <= p2Y + PADDLE_H) {
                    ballX = PONG_W - 10 - PADDLE_W - BALL_R;
                    const hitPos = (ballY - p2Y) / PADDLE_H - 0.5;
                    const speed = Math.sqrt(ballVX * ballVX + ballVY * ballVY) + 0.15;
                    const angle = hitPos * (Math.PI / 3);
                    ballVX = -Math.abs(speed * Math.cos(angle));
                    ballVY = speed * Math.sin(angle);
                }

                // Scoring
                if (ballX - BALL_R < 0) {
                    p2Score++;
                    updatePongScore();
                    if (p2Score >= WIN_SCORE) { pGameOver = true; winner = 'CPU'; }
                    else resetBall();
                }
                if (ballX + BALL_R > PONG_W) {
                    p1Score++;
                    updatePongScore();
                    if (p1Score >= WIN_SCORE) { pGameOver = true; winner = 'YOU'; }
                    else resetBall();
                }

                drawPong();
                pongInterval = requestAnimationFrame(pongTick);
            }

            pongKeyHandler = (e) => {
                if (['w', 'W', 's', 'S', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                    keysDown[e.key] = true;
                    e.preventDefault();
                }
            };
            pongKeyUpHandler = (e) => { delete keysDown[e.key]; };

            document.addEventListener('keydown', pongKeyHandler);
            document.addEventListener('keyup', pongKeyUpHandler);

            // Touch controls for mobile
            let pTouchY = null;
            canvas.addEventListener('touchstart', (e) => {
                pTouchY = e.touches[0].clientY;
                e.preventDefault();
            }, { passive: false });

            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (pTouchY === null) return;
                const dy = e.touches[0].clientY - pTouchY;
                p1Y = Math.max(0, Math.min(PONG_H - PADDLE_H, p1Y + dy));
                pTouchY = e.touches[0].clientY;
            }, { passive: false });

            canvas.addEventListener('touchend', (e) => {
                pTouchY = null;
                e.preventDefault();
            }, { passive: false });

            const pongRestart = windowEl.querySelector('#pong-restart');
            if (pongRestart) pongRestart.addEventListener('click', () => {
                resetPong();
                if (pongInterval) cancelAnimationFrame(pongInterval);
                pongInterval = requestAnimationFrame(pongTick);
            });

            resetPong();
            drawPong();
            pongInterval = requestAnimationFrame(pongTick);
        }

        // Start with Minesweeper
        initMinesweeper();
    }

    // ===================== PAINT =====================
    initializePaintWindow(windowEl) {
        const canvas = windowEl.querySelector('#paint-canvas');
        const ctx = canvas.getContext('2d');
        const paletteEl = windowEl.querySelector('#paint-palette');
        const posEl = windowEl.querySelector('#paint-pos');
        const toolNameEl = windowEl.querySelector('#paint-tool-name');
        const brushSizeInput = windowEl.querySelector('#paint-brush-size');

        // State
        let currentTool = 'pencil';
        let fgColor = '#000000';
        let bgColor = '#ffffff';
        let brushSize = 2;
        let drawing = false;
        let startX = 0, startY = 0, lastX = 0, lastY = 0;
        let undoStack = [];
        let shapeSnapshot = null;

        // Classic MS Paint palette colors
        const PALETTE = [
            '#000000','#808080','#800000','#808000','#008000','#008080','#000080','#800080',
            '#808040','#004040','#0080ff','#004080','#8000ff','#804000','#ff8040','#000000',
            '#ffffff','#c0c0c0','#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff',
            '#ffff80','#00ff80','#80ffff','#8080ff','#ff0080','#ff8000','#ffff80','#ffffff'
        ];

        // Init canvas white
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveUndo();

        // Build palette
        PALETTE.forEach(color => {
            const s = document.createElement('div');
            s.className = 'paint-swatch';
            s.style.background = color;
            s.addEventListener('click', () => { fgColor = color; windowEl.querySelector('#paint-fg').style.background = color; });
            s.addEventListener('contextmenu', (e) => { e.preventDefault(); bgColor = color; windowEl.querySelector('#paint-bg').style.background = color; });
            paletteEl.appendChild(s);
        });

        // Tool selection
        const tools = windowEl.querySelectorAll('.paint-tool[data-tool]');
        tools.forEach(btn => {
            btn.addEventListener('click', () => {
                tools.forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                currentTool = btn.dataset.tool;
                const names = { pencil:'Pencil', brush:'Brush', eraser:'Eraser', line:'Line', rect:'Rectangle', circle:'Ellipse', fill:'Fill', text:'Text', picker:'Color Picker' };
                if (toolNameEl) toolNameEl.textContent = names[currentTool] || currentTool;
                canvas.style.cursor = currentTool === 'fill' ? 'crosshair' : currentTool === 'picker' ? 'crosshair' : currentTool === 'text' ? 'text' : 'crosshair';
            });
        });

        // Brush size
        brushSizeInput.addEventListener('change', () => { brushSize = Math.max(1, Math.min(50, parseInt(brushSizeInput.value) || 2)); });

        function saveUndo() {
            undoStack.push(canvas.toDataURL());
            if (undoStack.length > 30) undoStack.shift();
        }

        function undo() {
            if (undoStack.length > 1) {
                undoStack.pop();
                const img = new Image();
                img.onload = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0); };
                img.src = undoStack[undoStack.length - 1];
            }
        }

        // Undo button
        windowEl.querySelector('#paint-undo').addEventListener('click', undo);

        // Clear button
        windowEl.querySelector('#paint-clear').addEventListener('click', () => {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            saveUndo();
        });

        // File menu — save as PNG
        windowEl.querySelector('#paint-file').addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'painting.png';
            link.href = canvas.toDataURL();
            link.click();
        });

        // Edit menu — clear
        windowEl.querySelector('#paint-edit').addEventListener('click', undo);

        function getCanvasPos(e) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: Math.floor((clientX - rect.left) * scaleX),
                y: Math.floor((clientY - rect.top) * scaleY)
            };
        }

        // Flood fill
        function floodFill(sx, sy, fillColor) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const w = canvas.width, h = canvas.height;
            const idx = (y, x) => (y * w + x) * 4;
            const target = [data[idx(sy,sx)], data[idx(sy,sx)+1], data[idx(sy,sx)+2], data[idx(sy,sx)+3]];

            // Parse fill color
            const tmp = document.createElement('canvas').getContext('2d');
            tmp.fillStyle = fillColor;
            tmp.fillRect(0,0,1,1);
            const fc = tmp.getImageData(0,0,1,1).data;

            if (target[0] === fc[0] && target[1] === fc[1] && target[2] === fc[2]) return;

            const stack = [[sx, sy]];
            const visited = new Uint8Array(w * h);

            while (stack.length > 0) {
                const [cx, cy] = stack.pop();
                if (cx < 0 || cx >= w || cy < 0 || cy >= h) continue;
                const pi = cy * w + cx;
                if (visited[pi]) continue;
                const i = pi * 4;
                if (Math.abs(data[i] - target[0]) > 10 || Math.abs(data[i+1] - target[1]) > 10 || Math.abs(data[i+2] - target[2]) > 10) continue;
                visited[pi] = 1;
                data[i] = fc[0]; data[i+1] = fc[1]; data[i+2] = fc[2]; data[i+3] = 255;
                stack.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);
            }
            ctx.putImageData(imageData, 0, 0);
        }

        function drawLine(x0, y0, x1, y1, color, size) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        }

        // Mouse / touch handlers
        function onPointerDown(e) {
            e.preventDefault();
            const pos = getCanvasPos(e);
            drawing = true;
            startX = pos.x; startY = pos.y;
            lastX = pos.x; lastY = pos.y;

            if (currentTool === 'fill') {
                floodFill(pos.x, pos.y, fgColor);
                saveUndo();
                drawing = false;
                return;
            }

            if (currentTool === 'picker') {
                const pixel = ctx.getImageData(pos.x, pos.y, 1, 1).data;
                fgColor = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
                windowEl.querySelector('#paint-fg').style.background = fgColor;
                drawing = false;
                return;
            }

            if (currentTool === 'text') {
                const text = prompt('Enter text:');
                if (text) {
                    ctx.fillStyle = fgColor;
                    ctx.font = `${Math.max(12, brushSize * 4)}px 'Segoe UI', Tahoma, sans-serif`;
                    ctx.fillText(text, pos.x, pos.y);
                    saveUndo();
                }
                drawing = false;
                return;
            }

            if (currentTool === 'line' || currentTool === 'rect' || currentTool === 'circle') {
                shapeSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
            }

            if (currentTool === 'pencil' || currentTool === 'brush' || currentTool === 'eraser') {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, (currentTool === 'brush' ? brushSize * 2 : brushSize) / 2, 0, Math.PI * 2);
                ctx.fillStyle = currentTool === 'eraser' ? bgColor : fgColor;
                ctx.fill();
            }
        }

        function onPointerMove(e) {
            const pos = getCanvasPos(e);
            if (posEl) posEl.textContent = `${pos.x}, ${pos.y}`;
            if (!drawing) return;
            e.preventDefault();

            if (currentTool === 'pencil' || currentTool === 'brush') {
                const size = currentTool === 'brush' ? brushSize * 2 : brushSize;
                drawLine(lastX, lastY, pos.x, pos.y, fgColor, size);
                lastX = pos.x; lastY = pos.y;
            } else if (currentTool === 'eraser') {
                drawLine(lastX, lastY, pos.x, pos.y, bgColor, brushSize * 3);
                lastX = pos.x; lastY = pos.y;
            } else if (currentTool === 'line') {
                if (shapeSnapshot) ctx.putImageData(shapeSnapshot, 0, 0);
                drawLine(startX, startY, pos.x, pos.y, fgColor, brushSize);
            } else if (currentTool === 'rect') {
                if (shapeSnapshot) ctx.putImageData(shapeSnapshot, 0, 0);
                ctx.strokeStyle = fgColor;
                ctx.lineWidth = brushSize;
                ctx.strokeRect(startX, startY, pos.x - startX, pos.y - startY);
            } else if (currentTool === 'circle') {
                if (shapeSnapshot) ctx.putImageData(shapeSnapshot, 0, 0);
                ctx.beginPath();
                const rx = Math.abs(pos.x - startX) / 2;
                const ry = Math.abs(pos.y - startY) / 2;
                const cx = startX + (pos.x - startX) / 2;
                const cy = startY + (pos.y - startY) / 2;
                ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                ctx.strokeStyle = fgColor;
                ctx.lineWidth = brushSize;
                ctx.stroke();
            }
        }

        function onPointerUp(e) {
            if (!drawing) return;
            drawing = false;
            shapeSnapshot = null;
            saveUndo();
        }

        // Mouse events
        canvas.addEventListener('mousedown', onPointerDown);
        canvas.addEventListener('mousemove', onPointerMove);
        canvas.addEventListener('mouseup', onPointerUp);
        canvas.addEventListener('mouseleave', onPointerUp);

        // Touch events
        canvas.addEventListener('touchstart', (e) => { onPointerDown(e); }, { passive: false });
        canvas.addEventListener('touchmove', (e) => { onPointerMove(e); }, { passive: false });
        canvas.addEventListener('touchend', (e) => { onPointerUp(e); }, { passive: false });

        // Keyboard shortcut for undo
        const paintKeyHandler = (e) => {
            if (e.ctrlKey && e.key === 'z') { undo(); e.preventDefault(); }
        };
        document.addEventListener('keydown', paintKeyHandler);

        // Store cleanup
        const windowData = this.windows.get('paint');
        if (windowData) {
            windowData.paintCleanup = () => {
                document.removeEventListener('keydown', paintKeyHandler);
            };
        }
    }
}

window.WindowManager = WindowManager;
