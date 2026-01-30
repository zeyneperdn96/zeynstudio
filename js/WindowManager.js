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
            games: { width: 420, height: 520 },
            zeynshat: { width: 500, height: 700 },
            illustration: { width: 800, height: 600 },
            illustrationWork: { width: 800, height: 600 }
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

        // Cleanup matrix animation
        if (windowId === 'terminal') {
            Terminal.cleanup(windowData.element);
        }

        // Cleanup media player
        if (windowId === 'showreel' && windowData.mediaPlayer) {
            windowData.mediaPlayer.destroy();
        }

        // Cleanup games
        if (windowId === 'games' && windowData.gamesCleanup) {
            windowData.gamesCleanup();
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

            const renderAndBindProjects = (filter) => {
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

        // Gallery lightbox
        if (windowId === 'illustration' || windowId === 'illustrationWork') {
            this.initializeGalleryWindow(windowEl);
        }
    }

    openCaseStudyWindow(project, projectsManager) {
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

        // Special handling for Illustration - open illustration-only gallery
        if (project.title === 'Illustration') {
            this.openWindow('illustrationWork', { width: 800, height: 600 });
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
    }

    initializeGamesWindow(windowEl) {
        const windowData = this.windows.get('games');
        const tabs = windowEl.querySelectorAll('.games-tab');
        const gamesArea = windowEl.querySelector('#games-area');
        let currentGame = 'minesweeper';
        let msTimer = null;
        let snakeInterval = null;
        let snakeKeyHandler = null;

        // Cleanup function
        windowData.gamesCleanup = () => {
            if (msTimer) clearInterval(msTimer);
            if (snakeInterval) clearInterval(snakeInterval);
            if (snakeKeyHandler) document.removeEventListener('keydown', snakeKeyHandler);
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
                currentGame = game;
                if (game === 'minesweeper') initMinesweeper();
                else initSnake();
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

        // Start with Minesweeper
        initMinesweeper();
    }
}

window.WindowManager = WindowManager;
