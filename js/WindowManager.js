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

        // Touch support for mobile
        document.addEventListener('touchmove', (e) => this.handleDrag(e.touches[0]), { passive: false });
        document.addEventListener('touchend', () => this.stopDrag());
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
            showreel: { width: 500, height: 580 },
            metbic: { width: 820, height: 520 },
            firebox: { width: 820, height: 520 },
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

        // Cleanup media player
        if (windowId === 'showreel' && windowData.mediaPlayer) {
            windowData.mediaPlayer.destroy();
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

        const startDrag = (clientX, clientY) => {
            const rect = windowEl.getBoundingClientRect();
            this.dragState = {
                isDragging: true,
                currentWindow: windowEl,
                offsetX: clientX - rect.left,
                offsetY: clientY - rect.top
            };
            const windowId = windowEl.dataset.windowId;
            this.focusWindow(windowId);
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
}

window.WindowManager = WindowManager;
