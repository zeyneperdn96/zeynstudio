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

        // Games window
        if (windowId === 'games') {
            this.initializeGamesWindow(windowEl);
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
                            cell.textContent = '\u{1F4A3}';
                        } else if (msGrid[r][c] > 0) {
                            cell.textContent = msGrid[r][c];
                            cell.dataset.num = msGrid[r][c];
                        }
                    } else if (msFlags[r][c]) {
                        cell.textContent = '\u{1F6A9}';
                    }
                    cell.addEventListener('click', () => msLeftClick(r, c));
                    cell.addEventListener('contextmenu', (e) => { e.preventDefault(); msRightClick(r, c); });
                    cell.addEventListener('mousedown', () => { if (!msGameOver && !msWon) setFace('\u{1F62E}'); });
                    cell.addEventListener('mouseup', () => { if (!msGameOver && !msWon) setFace('\u{1F60A}'); });
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
                msGameOver = true;
                if (msTimer) { clearInterval(msTimer); msTimer = null; }
                for (let rr = 0; rr < ROWS; rr++)
                    for (let cc = 0; cc < COLS; cc++)
                        if (msMines[rr][cc]) msRevealed[rr][cc] = true;
                setFace('\u{1F480}');
                renderMsGrid();
                const hitCell = windowEl.querySelector(`#ms-grid .ms-cell[data-r="${r}"][data-c="${c}"]`);
                if (hitCell) hitCell.classList.add('mine-hit');
                return;
            }

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
                setFace('\u{1F60E}');
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
                    <canvas class="snake-canvas" id="snake-canvas" width="${GRID_W * SNAKE_SIZE}" height="${GRID_H * SNAKE_SIZE}"></canvas>
                    <div class="snake-info">Arrow keys to move</div>
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
                if (el) el.textContent = 'Score: ' + score;
            }

            function drawSnake() {
                ctx.fillStyle = '#1a2e1a';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = '#1f351f';
                ctx.lineWidth = 0.5;
                for (let x = 0; x <= GRID_W; x++) {
                    ctx.beginPath(); ctx.moveTo(x * SNAKE_SIZE, 0); ctx.lineTo(x * SNAKE_SIZE, canvas.height); ctx.stroke();
                }
                for (let y = 0; y <= GRID_H; y++) {
                    ctx.beginPath(); ctx.moveTo(0, y * SNAKE_SIZE); ctx.lineTo(canvas.width, y * SNAKE_SIZE); ctx.stroke();
                }
                ctx.fillStyle = '#ff3333';
                ctx.fillRect(food.x * SNAKE_SIZE + 2, food.y * SNAKE_SIZE + 2, SNAKE_SIZE - 4, SNAKE_SIZE - 4);
                snake.forEach((seg, i) => {
                    ctx.fillStyle = i === 0 ? '#4caf50' : '#388e3c';
                    ctx.fillRect(seg.x * SNAKE_SIZE + 1, seg.y * SNAKE_SIZE + 1, SNAKE_SIZE - 2, SNAKE_SIZE - 2);
                });
                if (gameOver) {
                    ctx.fillStyle = 'rgba(0,0,0,0.6)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 20px Segoe UI, Tahoma, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
                    ctx.font = '13px Segoe UI, Tahoma, sans-serif';
                    ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 14);
                    ctx.fillText('Press Space or click New Game', canvas.width / 2, canvas.height / 2 + 36);
                }
            }

            function tick() {
                if (gameOver) return;
                dir = nextDir;
                const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
                if (head.x < 0 || head.x >= GRID_W || head.y < 0 || head.y >= GRID_H) {
                    gameOver = true; drawSnake(); return;
                }
                if (snake.some(s => s.x === head.x && s.y === head.y)) {
                    gameOver = true; drawSnake(); return;
                }
                snake.unshift(head);
                if (head.x === food.x && head.y === food.y) {
                    score += 10; updateScoreDisplay(); placeFood();
                } else {
                    snake.pop();
                }
                drawSnake();
            }

            snakeKeyHandler = (e) => {
                if (e.key === ' ' && gameOver) {
                    resetSnake(); drawSnake();
                    if (snakeInterval) clearInterval(snakeInterval);
                    snakeInterval = setInterval(tick, 150);
                    return;
                }
                const keyMap = {
                    'ArrowUp': { x: 0, y: -1 }, 'ArrowDown': { x: 0, y: 1 },
                    'ArrowLeft': { x: -1, y: 0 }, 'ArrowRight': { x: 1, y: 0 }
                };
                const nd = keyMap[e.key];
                if (nd) {
                    if (nd.x !== -dir.x || nd.y !== -dir.y) nextDir = nd;
                    e.preventDefault();
                }
            };
            document.addEventListener('keydown', snakeKeyHandler);

            const restartBtn = windowEl.querySelector('#snake-restart');
            if (restartBtn) restartBtn.addEventListener('click', () => {
                resetSnake(); drawSnake();
                if (snakeInterval) clearInterval(snakeInterval);
                snakeInterval = setInterval(tick, 150);
            });

            resetSnake(); drawSnake();
            snakeInterval = setInterval(tick, 150);
        }

        // Start with Minesweeper
        initMinesweeper();
    }
}

window.WindowManager = WindowManager;
