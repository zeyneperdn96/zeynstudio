/* ========================================
   WINDOW TEMPLATES
   HTML templates for different window types
   ======================================== */

const WindowTemplates = {
    // Work.exe - Projects window with filters
    work: () => `
        <div class="window-titlebar">
            <span class="window-title">💼 Work.exe - My Projects</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content">
            <div class="explorer-toolbar" style="margin: -16px -16px 16px -16px; padding: 8px; background: #C0C0C0; border-bottom: 2px solid #808080;">
                <button class="btn btn-sm btn-primary active" data-filter="all">All Projects</button>
                <button class="btn btn-sm btn-secondary" data-filter="ui-ux">UI/UX</button>
                <button class="btn btn-sm btn-secondary" data-filter="industrial">Industrial Design</button>
                <button class="btn btn-sm btn-secondary" data-filter="illustration">Illustration</button>
            </div>
            <div class="projects-grid" id="projects-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px;">
                <!-- Projects rendered here -->
            </div>
        </div>
    `,

    // About.txt - Trading Cards About window
    about: () => `
        <div class="window-titlebar">
            <span class="window-title">🎴 About Me - Trading Cards</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; overflow: hidden; flex: 1; display: flex;">
            <iframe data-src="trading-cards.html" style="width: 100%; border: none; flex: 1;"></iframe>
        </div>
    `,

    // Games.exe - Minesweeper & Snake
    games: () => `
        <div class="window-titlebar">
            <span class="window-title">Games.exe</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; display: flex; flex-direction: column; height: 100%; overflow: hidden; font-family: 'Segoe UI', Tahoma, sans-serif;">
            <style>
                .games-tabs { display: flex; background: #ece9d8; border-bottom: 1px solid #aca899; padding: 2px 4px 0; }
                .games-tab { padding: 4px 16px; font-size: 11px; cursor: pointer; background: #d6d2c2; border: 1px solid #aca899; border-bottom: none; border-radius: 3px 3px 0 0; margin-right: 2px; color: #444; }
                .games-tab.active { background: #fff; color: #000; font-weight: 600; border-bottom: 1px solid #fff; margin-bottom: -1px; position: relative; z-index: 1; }
                .games-tab:hover:not(.active) { background: #e8e4d8; }
                .games-area { flex: 1; display: flex; align-items: center; justify-content: center; background: #c0c0c0; overflow: hidden; }

                /* Minesweeper Styles */
                .ms-container { display: flex; flex-direction: column; align-items: center; background: #c0c0c0; padding: 6px; border: 3px outset #e0e0e0; }
                .ms-header { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 4px; margin-bottom: 6px; background: #c0c0c0; border: 2px inset #a0a0a0; }
                .ms-counter { background: #000; color: #f00; font-family: 'Consolas', 'Courier New', monospace; font-size: 22px; font-weight: 700; padding: 2px 4px; min-width: 46px; text-align: center; border: 1px inset #808080; letter-spacing: 2px; }
                .ms-face { width: 30px; height: 30px; font-size: 18px; cursor: pointer; border: 2px outset #e0e0e0; background: #c0c0c0; display: flex; align-items: center; justify-content: center; line-height: 1; }
                .ms-face:active { border-style: inset; }
                .ms-grid { display: grid; grid-template-columns: repeat(9, 22px); grid-template-rows: repeat(9, 22px); border: 3px inset #a0a0a0; }
                .ms-cell { width: 22px; height: 22px; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; cursor: pointer; user-select: none; border: 2px outset #e0e0e0; background: #c0c0c0; font-family: 'Segoe UI', Tahoma, sans-serif; }
                .ms-cell.revealed { border: 1px solid #808080; background: #bdbdbd; cursor: default; }
                .ms-cell.mine-hit { background: #f00; }
                .ms-cell.flagged::after { content: ''; }
                .ms-cell[data-num="1"] { color: #0000ff; }
                .ms-cell[data-num="2"] { color: #008000; }
                .ms-cell[data-num="3"] { color: #ff0000; }
                .ms-cell[data-num="4"] { color: #000080; }
                .ms-cell[data-num="5"] { color: #800000; }
                .ms-cell[data-num="6"] { color: #008080; }
                .ms-cell[data-num="7"] { color: #000; }
                .ms-cell[data-num="8"] { color: #808080; }

                /* Snake Styles */
                .snake-container { display: flex; flex-direction: column; align-items: center; gap: 8px; }
                .snake-header { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 4px 0; }
                .snake-score { background: #000; color: #0f0; font-family: 'Consolas', 'Courier New', monospace; font-size: 16px; padding: 2px 8px; border: 1px inset #808080; min-width: 80px; text-align: center; }
                .snake-canvas { border: 3px inset #a0a0a0; background: #000; image-rendering: pixelated; }
                .snake-info { font-size: 10px; color: #555; text-align: center; }
                .snake-btn { padding: 4px 12px; font-size: 11px; cursor: pointer; border: 2px outset #e0e0e0; background: #c0c0c0; font-family: 'Segoe UI', Tahoma, sans-serif; }
                .snake-btn:active { border-style: inset; }

                /* Tetris Styles */
                .tetris-container { display: flex; flex-direction: column; align-items: center; gap: 8px; }
                .tetris-header { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 4px 0; }
                .tetris-stat { background: #000; color: #0ff; font-family: 'Consolas', 'Courier New', monospace; font-size: 13px; padding: 2px 8px; border: 1px inset #808080; min-width: 80px; text-align: center; }
                .tetris-canvas { border: 3px inset #a0a0a0; background: #000; image-rendering: pixelated; }
                .tetris-info { font-size: 10px; color: #555; text-align: center; }
                .tetris-btn { padding: 4px 12px; font-size: 11px; cursor: pointer; border: 2px outset #e0e0e0; background: #c0c0c0; font-family: 'Segoe UI', Tahoma, sans-serif; }
                .tetris-btn:active { border-style: inset; }
                .tetris-side { display: flex; flex-direction: column; align-items: center; gap: 6px; margin-left: 10px; }
                .tetris-next-canvas { border: 2px inset #808080; background: #111; }
                .tetris-label { font-size: 10px; color: #555; font-weight: 600; }

                /* Pong Styles */
                .pong-container { display: flex; flex-direction: column; align-items: center; gap: 8px; }
                .pong-header { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 4px 0; }
                .pong-score { background: #000; color: #fff; font-family: 'Consolas', 'Courier New', monospace; font-size: 16px; padding: 2px 8px; border: 1px inset #808080; min-width: 100px; text-align: center; }
                .pong-canvas { border: 3px inset #a0a0a0; background: #000; }
                .pong-info { font-size: 10px; color: #555; text-align: center; }
                .pong-btn { padding: 4px 12px; font-size: 11px; cursor: pointer; border: 2px outset #e0e0e0; background: #c0c0c0; font-family: 'Segoe UI', Tahoma, sans-serif; }
                .pong-btn:active { border-style: inset; }
            </style>

            <!-- Tab Bar -->
            <div class="games-tabs">
                <div class="games-tab active" data-game="minesweeper">Minesweeper</div>
                <div class="games-tab" data-game="snake">Snake</div>
                <div class="games-tab" data-game="tetris">Tetris</div>
                <div class="games-tab" data-game="pong">Pong</div>
            </div>

            <!-- Game Area -->
            <div class="games-area" id="games-area">
                <!-- Minesweeper (default) -->
                <div class="ms-container" id="ms-container">
                    <div class="ms-header">
                        <div class="ms-counter" id="ms-mines">010</div>
                        <div class="ms-face" id="ms-face">😊</div>
                        <div class="ms-counter" id="ms-timer">000</div>
                    </div>
                    <div class="ms-grid" id="ms-grid"></div>
                </div>
            </div>
        </div>
    `,

    // Illustration.exe
    illustration: () => {
        const allImages = [
            { src: 'assets/projects/metbic/hero.png', label: 'METBIC — Hero' },
            { src: 'assets/projects/metbic/render1.png', label: 'METBIC — Render 1' },
            { src: 'assets/projects/metbic/render2.png', label: 'METBIC — Render 2' },
            { src: 'assets/projects/metbic/render3.png', label: 'METBIC — Render 3' },
            { src: 'assets/projects/metbic/render4.png', label: 'METBIC — Render 4' },
            { src: 'assets/projects/metbic/context.png', label: 'METBIC — Context' },
            { src: 'assets/projects/metbic/technical.png', label: 'METBIC — Technical' },
            { src: 'assets/projects/firebox/hero.jpg', label: 'FIREBOX — Hero' },
            { src: 'assets/projects/firebox/technical.jpg', label: 'FIREBOX — Technical' },
            { src: 'assets/projects/firebox/exploded.jpg', label: 'FIREBOX — Exploded' },
            { src: 'assets/projects/firebox/exploded-fire.jpg', label: 'FIREBOX — Exploded Fire' },
            { src: 'assets/projects/firebox/details.jpg', label: 'FIREBOX — Details' },
            { src: 'assets/projects/firebox/inuse.jpg', label: 'FIREBOX — In Use' },
            { src: 'assets/projects/firebox/context.jpg', label: 'FIREBOX — Context' },
            { src: 'assets/projects/firebox/carrying.jpg', label: 'FIREBOX — Carrying' },
            { src: 'assets/projects/firebox/product.jpg', label: 'FIREBOX — Product' },
            { src: 'assets/projects/funcart/hero.png', label: 'FuncArt — Hero' },
            { src: 'assets/projects/funcart/workflex.png', label: 'FuncArt — WorkFlex' },
            { src: 'assets/projects/funcart/liftrack.png', label: 'FuncArt — LiftRack' },
            { src: 'assets/projects/funcart/mobsit.png', label: 'FuncArt — MobSit' },
            { src: 'assets/projects/funcart/workflow.png', label: 'FuncArt — Workflow' },
            { src: 'assets/projects/funcart/features.png', label: 'FuncArt — Features' },
            { src: 'assets/projects/funcart/workshop.png', label: 'FuncArt — Workshop' },
            { src: 'assets/projects/gusto/hero.png', label: 'GUSTO — Hero' },
            { src: 'assets/projects/gusto/context.png', label: 'GUSTO — Context' },
            { src: 'assets/projects/gusto/colors.png', label: 'GUSTO — Colors' },
            { src: 'assets/projects/gusto/technical.png', label: 'GUSTO — Technical' },
            { src: 'assets/projects/gusto/design.png', label: 'GUSTO — Design' },
            { src: 'assets/projects/gusto/overview.png', label: 'GUSTO — Overview' },
            { src: 'assets/projects/gusto/exploded.png', label: 'GUSTO — Exploded' },
            { src: 'assets/projects/marinesentry/hero.png', label: 'MarineSentry — Hero' },
            { src: 'assets/projects/marinesentry/render.png', label: 'MarineSentry — Render' },
            { src: 'assets/projects/marinesentry/exploded.png', label: 'MarineSentry — Exploded' },
            { src: 'assets/projects/marinesentry/board.png', label: 'MarineSentry — Board' },
            { src: 'assets/projects/marinesentry/components.png', label: 'MarineSentry — Components' },
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
        return `
        <div class="window-titlebar">
            <span class="window-title">🎨 Gallery.exe - Project Gallery</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; display: flex; flex-direction: column; height: 100%; overflow: hidden;">
            <style>
                .gal-viewer { flex: 1; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%); position: relative; min-height: 0; overflow: hidden; }
                .gal-viewer img { max-width: 95%; max-height: 95%; object-fit: contain; transition: opacity 0.2s; }
                .gal-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.85); border: 1px solid #aaa; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: all 0.15s; }
                .gal-arrow:hover { background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
                .gal-arrow-left { left: 12px; }
                .gal-arrow-right { right: 12px; }
                .gal-counter { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: #fff; padding: 4px 14px; border-radius: 12px; font-size: 11px; font-family: 'Segoe UI', Tahoma, sans-serif; }
                .gal-label { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.55); color: #fff; padding: 4px 14px; border-radius: 12px; font-size: 11px; font-family: 'Segoe UI', Tahoma, sans-serif; white-space: nowrap; }
                .gal-thumbstrip { height: 80px; min-height: 80px; background: #e8e8e8; border-top: 1px solid #a0a0a0; display: flex; align-items: center; gap: 6px; padding: 8px 12px; overflow-x: auto; overflow-y: hidden; }
                .gal-thumb { width: 56px; height: 56px; min-width: 56px; border: 2px solid #c0c0c0; border-radius: 3px; overflow: hidden; cursor: pointer; transition: all 0.15s; background: #f0f0f0; }
                .gal-thumb:hover { border-color: #0078d4; transform: scale(1.05); }
                .gal-thumb.active { border-color: #0078d4; box-shadow: 0 0 0 2px rgba(0,120,212,0.4); }
                .gal-thumb img { width: 100%; height: 100%; object-fit: cover; }
                .gal-statusbar { padding: 4px 12px; background: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%); border-top: 1px solid #a0a0a0; display: flex; justify-content: space-between; font-size: 10px; color: #555; font-family: 'Segoe UI', Tahoma, sans-serif; }
            </style>

            <!-- Main Preview -->
            <div class="gal-viewer">
                <button class="gal-arrow gal-arrow-left" id="gal-prev">❮</button>
                <img src="${allImages[0].src}" alt="${allImages[0].label}" id="gal-preview">
                <button class="gal-arrow gal-arrow-right" id="gal-next">❯</button>
                <div class="gal-label" id="gal-label">${allImages[0].label}</div>
                <div class="gal-counter" id="gal-counter">1 / ${allImages.length}</div>
            </div>

            <!-- Thumbnail Strip -->
            <div class="gal-thumbstrip" id="gal-thumbstrip">
                ${allImages.map((img, i) => `
                    <div class="gal-thumb${i === 0 ? ' active' : ''}" data-index="${i}" data-src="${img.src}" data-label="${img.label}">
                        <img src="${img.src}" alt="${img.label}" loading="lazy">
                    </div>
                `).join('')}
            </div>

            <!-- Status Bar -->
            <div class="gal-statusbar">
                <span>${allImages.length} images — METBIC, FIREBOX & Illustration</span>
                <span>Use ← → arrows to navigate</span>
            </div>
        </div>
    `;
    },

    // Illustration Gallery (My Work version - illustration only)
    illustrationWork: () => {
        const allImages = [
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
        return `
        <div class="window-titlebar">
            <span class="window-title">🎨 Illustration.exe - Custom Illustrations</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; display: flex; flex-direction: column; height: 100%; overflow: hidden;">
            <style>
                .gal-viewer { flex: 1; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%); position: relative; min-height: 0; overflow: hidden; }
                .gal-viewer img { max-width: 95%; max-height: 95%; object-fit: contain; transition: opacity 0.2s; }
                .gal-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.85); border: 1px solid #aaa; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: all 0.15s; }
                .gal-arrow:hover { background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
                .gal-arrow-left { left: 12px; }
                .gal-arrow-right { right: 12px; }
                .gal-counter { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: #fff; padding: 4px 14px; border-radius: 12px; font-size: 11px; font-family: 'Segoe UI', Tahoma, sans-serif; }
                .gal-label { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.55); color: #fff; padding: 4px 14px; border-radius: 12px; font-size: 11px; font-family: 'Segoe UI', Tahoma, sans-serif; white-space: nowrap; }
                .gal-thumbstrip { height: 80px; min-height: 80px; background: #e8e8e8; border-top: 1px solid #a0a0a0; display: flex; align-items: center; gap: 6px; padding: 8px 12px; overflow-x: auto; overflow-y: hidden; }
                .gal-thumb { width: 56px; height: 56px; min-width: 56px; border: 2px solid #c0c0c0; border-radius: 3px; overflow: hidden; cursor: pointer; transition: all 0.15s; background: #f0f0f0; }
                .gal-thumb:hover { border-color: #0078d4; transform: scale(1.05); }
                .gal-thumb.active { border-color: #0078d4; box-shadow: 0 0 0 2px rgba(0,120,212,0.4); }
                .gal-thumb img { width: 100%; height: 100%; object-fit: cover; }
                .gal-statusbar { padding: 4px 12px; background: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%); border-top: 1px solid #a0a0a0; display: flex; justify-content: space-between; font-size: 10px; color: #555; font-family: 'Segoe UI', Tahoma, sans-serif; }
            </style>

            <div class="gal-viewer">
                <button class="gal-arrow gal-arrow-left" id="gal-prev">❮</button>
                <img src="${allImages[0].src}" alt="${allImages[0].label}" id="gal-preview">
                <button class="gal-arrow gal-arrow-right" id="gal-next">❯</button>
                <div class="gal-label" id="gal-label">${allImages[0].label}</div>
                <div class="gal-counter" id="gal-counter">1 / ${allImages.length}</div>
            </div>

            <div class="gal-thumbstrip" id="gal-thumbstrip">
                ${allImages.map((img, i) => `
                    <div class="gal-thumb${i === 0 ? ' active' : ''}" data-index="${i}" data-src="${img.src}" data-label="${img.label}">
                        <img src="${img.src}" alt="${img.label}" loading="lazy">
                    </div>
                `).join('')}
            </div>

            <div class="gal-statusbar">
                <span>${allImages.length} images — Illustrations</span>
                <span>Use ← → arrows to navigate</span>
            </div>
        </div>
    `;
    },

    // IndustrialDesign.exe
    industrial: () => `
        <div class="window-titlebar">
            <span class="window-title">🔧 IndustrialDesign.exe - Products</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content">
            <h3>Industrial Design</h3>
            <p>Physical product design, 3D modeling, and manufacturing-ready concepts.</p>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 16px;">
                ${['Smart Speaker', 'Ergonomic Chair', 'Desk Lamp', 'Wireless Charger'].map(name => `
                    <div style="padding: 16px; background: #F0F0F0; border: 2px solid #808080;">
                        <div style="aspect-ratio: 4/3; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin-bottom: 8px;"></div>
                        <strong>${name}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
    `,

    // Media Player - Windows Media Player 11 Style
    showreel: () => `
        <div class="window-titlebar" style="background: linear-gradient(180deg, #0058e6 0%, #3a80f0 8%, #2a6ad8 20%, #1a50b8 80%, #0a3a90 100%); border-bottom: none;">
            <span class="window-title" style="color: #fff; font-weight: 700; font-size: 12px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">Windows Media Player</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content media-player-content" style="padding: 0; display: flex; flex-direction: column; background: #d6dfe9; overflow: hidden; font-family: Tahoma, sans-serif; font-size: 11px;">
            <!-- XP-style Menu Bar -->
            <div style="display: flex; align-items: center; background: linear-gradient(180deg, #f6f8fb 0%, #e4e9f0 50%, #d6dde8 100%); padding: 1px 4px; border-bottom: 1px solid #a4b4c8; gap: 0;">
                <div style="padding: 2px 8px; color: #1a3050; font-size: 11px; cursor: default;">File</div>
                <div style="padding: 2px 8px; color: #1a3050; font-size: 11px; cursor: default;">View</div>
                <div style="padding: 2px 8px; color: #1a3050; font-size: 11px; cursor: default;">Play</div>
                <div style="padding: 2px 8px; color: #1a3050; font-size: 11px; cursor: default;">Tools</div>
                <div style="padding: 2px 8px; color: #1a3050; font-size: 11px; cursor: default;">Help</div>
            </div>
            <!-- WMP9 Feature Tab Bar (XP style raised tabs) -->
            <div class="mp-tabbar" style="display: flex; align-items: flex-end; background: linear-gradient(180deg, #6e96c8 0%, #4a78b0 50%, #3a68a0 100%); padding: 3px 4px 0; gap: 2px; border-bottom: none;">
                <div style="padding: 3px 12px 4px; font-size: 11px; font-weight: 700; background: linear-gradient(180deg, #f8fafe 0%, #e0e8f2 60%, #d0daea 100%); color: #0a2040; border-radius: 4px 4px 0 0; border: 1px solid #8aa0c0; border-bottom: 1px solid #d0daea; cursor: default; margin-bottom: -1px; position: relative; z-index: 1;">Now Playing</div>
                <div style="padding: 3px 10px 4px; color: #e0eaff; font-size: 11px; cursor: default; border-radius: 4px 4px 0 0; background: rgba(255,255,255,0.08);">Media Guide</div>
                <div style="padding: 3px 10px 4px; color: #e0eaff; font-size: 11px; cursor: default; border-radius: 4px 4px 0 0; background: rgba(255,255,255,0.08);">Copy from CD</div>
                <div style="padding: 3px 10px 4px; color: #e0eaff; font-size: 11px; cursor: default; border-radius: 4px 4px 0 0; background: rgba(255,255,255,0.08);">Media Library</div>
                <div style="padding: 3px 10px 4px; color: #e0eaff; font-size: 11px; cursor: default; border-radius: 4px 4px 0 0; background: rgba(255,255,255,0.08);">Radio Tuner</div>
            </div>
            <!-- Main Area: Visualizer (left) + Playlist (right) -->
            <div class="mp-main" style="display: flex; flex: 1; min-height: 0; overflow: hidden; background: #d0daea; border: 1px solid #8aa0c0; border-top: none; margin: 0 3px;">
                <!-- Left: Visualization -->
                <div class="mp-visual" style="flex: 1; background: #000; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; min-width: 0; overflow: hidden; border: 2px inset #a0b0c0;">
                    <canvas class="mp-visualizer-canvas" width="460" height="220" style="width: 100%; height: auto;"></canvas>
                    <div class="mp-now-playing" style="position: absolute; bottom: 20px; left: 0; right: 0; color: #90d0ff; font-size: 11px; text-align: center; padding: 0 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        <span class="mp-track-name">No track loaded</span>
                    </div>
                    <div class="mp-track-artist" style="position: absolute; bottom: 6px; left: 0; right: 0; color: #5090c0; font-size: 10px; text-align: center; padding: 0 12px;">
                        <span class="mp-artist-name"></span>
                    </div>
                </div>
                <!-- Right: Playlist (XP ListView style) -->
                <div class="mp-playlist-panel" style="width: 200px; display: flex; flex-direction: column; background: #fff; border-left: 2px solid #8aa0c0;">
                    <div class="mp-playlist-header" style="padding: 3px 8px; background: linear-gradient(180deg, #fff 0%, #ece9d8 100%); border-bottom: 1px solid #aca899; font-size: 10px; color: #000; display: flex; align-items: center; gap: 4px;">
                        <span style="font-weight: 400;">▶</span>
                        <span style="font-weight: 700;">Now Playing List</span>
                    </div>
                    <div class="mp-playlist" style="flex: 1; overflow-y: auto; background: #fff;">
                        ${(window.CONFIG.playlist || []).map((track, i) => `
                            <div class="mp-track" data-index="${i}" style="display: flex; align-items: center; padding: 2px 6px; color: #000; font-size: 11px; cursor: pointer; border-bottom: 1px solid #f0f0f0; transition: background 0.1s; gap: 4px; ${i % 2 === 1 ? 'background: #f5f8fc;' : ''}">
                                <span style="color: #808080; font-size: 10px; width: 16px; flex-shrink: 0; text-align: right;">${i + 1}</span>
                                <span style="color: #808080; font-size: 10px; flex-shrink: 0;">♪</span>
                                <span class="mp-track-title" style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${track.title}</span>
                                <span class="mp-track-duration" style="color: #808080; font-size: 10px; flex-shrink: 0;">--:--</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <!-- Bottom: Transport Controls (XP WMP9 style) -->
            <div class="mp-bottom" style="background: linear-gradient(180deg, #e8ecf2 0%, #d0d8e4 50%, #bcc8d8 100%); border-top: 1px solid #8aa0c0; padding: 0; margin: 0 3px 3px;">
                <!-- Seek Bar (XP trackbar style) -->
                <div class="mp-progress-wrapper" style="padding: 5px 8px 3px;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span class="mp-time-current" style="color: #1a3050; font-size: 10px; min-width: 30px; text-align: right;">0:00</span>
                        <div class="mp-progress-bar" style="flex: 1; height: 4px; background: #fff; border-radius: 0; cursor: pointer; position: relative; border: 1px solid #a0a0a0; box-shadow: inset 0 1px 1px rgba(0,0,0,0.15);">
                            <div class="mp-progress-fill" style="width: 0%; height: 100%; background: linear-gradient(180deg, #3a80d0 0%, #2060b0 100%); position: relative;">
                                <div class="mp-seek-thumb" style="position: absolute; right: -5px; top: -6px; width: 11px; height: 16px; background: linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 40%, #c8c8c8 100%); border-radius: 2px; border: 1px solid #808080; cursor: grab; display: none; box-shadow: 0 1px 1px rgba(0,0,0,0.2);"></div>
                            </div>
                        </div>
                        <span class="mp-time-total" style="color: #1a3050; font-size: 10px; min-width: 30px;">0:00</span>
                    </div>
                </div>
                <!-- Controls Row (XP raised buttons) -->
                <div class="mp-controls" style="display: flex; align-items: center; padding: 1px 6px 5px; gap: 0;">
                    <!-- Transport Controls -->
                    <div style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 3px;">
                        <button class="mp-btn mp-shuffle" title="Shuffle" style="background: none; border: 1px solid transparent; color: #4070a0; font-size: 11px; cursor: pointer; padding: 2px 4px; border-radius: 2px; transition: all 0.1s;">🔀</button>
                        <button class="mp-btn mp-prev" title="Previous" style="background: linear-gradient(180deg, #fff 0%, #ece9d8 100%); border: 1px solid #aca899; border-top-color: #fff; border-left-color: #fff; color: #1a3050; font-size: 12px; cursor: pointer; padding: 3px 7px; border-radius: 0; transition: all 0.1s;">⏮</button>
                        <button class="mp-btn mp-play" title="Play" style="background: linear-gradient(180deg, #fff 0%, #ece9d8 100%); border: 1px solid #aca899; border-top-color: #fff; border-left-color: #fff; color: #1a3050; font-size: 15px; cursor: pointer; border-radius: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; transition: all 0.1s;">▶</button>
                        <button class="mp-btn mp-stop" title="Stop" style="background: linear-gradient(180deg, #fff 0%, #ece9d8 100%); border: 1px solid #aca899; border-top-color: #fff; border-left-color: #fff; color: #1a3050; font-size: 11px; cursor: pointer; padding: 3px 7px; border-radius: 0; transition: all 0.1s;">⏹</button>
                        <button class="mp-btn mp-next" title="Next" style="background: linear-gradient(180deg, #fff 0%, #ece9d8 100%); border: 1px solid #aca899; border-top-color: #fff; border-left-color: #fff; color: #1a3050; font-size: 12px; cursor: pointer; padding: 3px 7px; border-radius: 0; transition: all 0.1s;">⏭</button>
                        <button class="mp-btn mp-repeat" title="Repeat" style="background: none; border: 1px solid transparent; color: #4070a0; font-size: 11px; cursor: pointer; padding: 2px 4px; border-radius: 2px; transition: all 0.1s;">🔁</button>
                    </div>
                    <!-- Volume (right) -->
                    <div style="display: flex; align-items: center; gap: 3px; min-width: 80px; justify-content: flex-end;">
                        <span class="mp-volume-icon" style="color: #4070a0; font-size: 11px; cursor: pointer;">🔊</span>
                        <input type="range" class="mp-volume" min="0" max="100" value="80" style="width: 55px; cursor: pointer; accent-color: #3a80d0;">
                    </div>
                </div>
            </div>
            <!-- XP Status Bar -->
            <div style="display: flex; align-items: center; background: linear-gradient(180deg, #ece9d8 0%, #d6d2c2 100%); border-top: 1px solid #fff; padding: 2px 8px; font-size: 10px; color: #444; margin: 0 3px 3px; border: 1px solid #a0a0a0; border-top: 1px solid #fff;">
                <span style="flex: 1;">Ready</span>
                <span style="border-left: 1px solid #a0a0a0; padding-left: 8px;">Windows Media Player 9 Series</span>
            </div>
        </div>
    `,

    // Image Viewer
    imageviewer: () => `
        <div class="window-titlebar">
            <span class="window-title">🖼️ Image Viewer</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="text-align: center;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); aspect-ratio: 16/10; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 24px;">
                🖼️ Image Viewer
            </div>
            <p style="margin-top: 12px; color: #666;">Drag and drop images here or browse files</p>
            <button class="btn btn-primary btn-sm" style="margin-top: 8px;">Browse Files</button>
        </div>
    `,

    // METBIC.exe - Portable Repair System
    metbic: () => `
        <div class="window-titlebar">
            <span class="window-title">🧰 METBIC.exe — Portable Repair System</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; display: flex; flex-direction: column; height: 100%; font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 11px;">
            <style>
                .metbic-container { display: flex; flex: 1; min-height: 0; }
                .metbic-gallery { width: 100px; background: #f0f0f0; border-right: 1px solid #a0a0a0; display: flex; flex-direction: column; padding: 8px; gap: 8px; overflow-y: auto; }
                .metbic-gallery-title { font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 6px; border-bottom: 1px solid #ccc; margin-bottom: 4px; }
                .metbic-thumb { width: 100%; aspect-ratio: 1; background: #fff; border: 2px solid #c0c0c0; border-radius: 3px; cursor: pointer; overflow: hidden; transition: all 0.15s; }
                .metbic-thumb:hover { border-color: #0078d4; transform: scale(1.02); }
                .metbic-thumb.active { border-color: #0078d4; box-shadow: 0 0 0 2px rgba(0,120,212,0.3); }
                .metbic-thumb img { width: 100%; height: 100%; object-fit: cover; }
                .metbic-main { flex: 1; display: flex; flex-direction: column; background: #fff; min-width: 0; }
                .metbic-header { padding: 12px 16px; background: linear-gradient(180deg, #4a7eba 0%, #3d6a9e 100%); color: #fff; }
                .metbic-header h2 { margin: 0; font-size: 14px; font-weight: 600; }
                .metbic-header p { margin: 4px 0 0; font-size: 11px; opacity: 0.9; }
                .metbic-content { flex: 1; display: flex; padding: 16px; gap: 16px; overflow: hidden; }
                .metbic-preview { flex: 1; background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%); border: 2px solid #808080; border-radius: 4px; display: flex; align-items: center; justify-content: center; min-width: 0; }
                .metbic-preview img { max-width: 95%; max-height: 95%; object-fit: contain; border-radius: 4px; }
                .metbic-info { width: 180px; display: flex; flex-direction: column; gap: 12px; }
                .metbic-info-box { background: #f8f8f8; border: 1px solid #d0d0d0; border-radius: 4px; padding: 12px; }
                .metbic-info-title { font-size: 9px; font-weight: bold; color: #0066cc; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
                .metbic-info-text { font-size: 11px; color: #444; line-height: 1.6; }
                .metbic-statusbar { padding: 6px 12px; background: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%); border-top: 1px solid #a0a0a0; display: flex; justify-content: space-between; font-size: 10px; color: #555; }
                .metbic-status-item { display: flex; align-items: center; gap: 6px; }
                .metbic-status-led { width: 8px; height: 8px; border-radius: 50%; background: #00cc00; box-shadow: 0 0 4px #00cc00; }
            </style>

            <div class="metbic-container">
                <!-- Gallery Sidebar -->
                <div class="metbic-gallery">
                    <div class="metbic-gallery-title">Gallery</div>
                    <div class="metbic-thumb active" data-img="assets/projects/metbic/hero.png" data-index="0">
                        <img src="assets/projects/metbic/hero.png" alt="Hero" loading="lazy">
                    </div>
                    <div class="metbic-thumb" data-img="assets/projects/metbic/render1.png" data-index="1">
                        <img src="assets/projects/metbic/render1.png" alt="Render 1" loading="lazy">
                    </div>
                    <div class="metbic-thumb" data-img="assets/projects/metbic/render2.png" data-index="2">
                        <img src="assets/projects/metbic/render2.png" alt="Render 2" loading="lazy">
                    </div>
                    <div class="metbic-thumb" data-img="assets/projects/metbic/render3.png" data-index="3">
                        <img src="assets/projects/metbic/render3.png" alt="Render 3" loading="lazy">
                    </div>
                    <div class="metbic-thumb" data-img="assets/projects/metbic/render4.png" data-index="4">
                        <img src="assets/projects/metbic/render4.png" alt="Render 4" loading="lazy">
                    </div>
                    <div class="metbic-thumb" data-img="assets/projects/metbic/context.png" data-index="6">
                        <img src="assets/projects/metbic/context.png" alt="Context" loading="lazy">
                    </div>
                    <div class="metbic-thumb" data-img="assets/projects/metbic/technical.png" data-index="7">
                        <img src="assets/projects/metbic/technical.png" alt="Technical" loading="lazy">
                    </div>
                </div>

                <!-- Main Area -->
                <div class="metbic-main">
                    <!-- Header -->
                    <div class="metbic-header">
                        <h2>METBIC — Modular Bicycle Repair Kit</h2>
                        <p>Compact toolkit for mountain bikers • 2026 • Product Design</p>
                    </div>

                    <!-- Content Area -->
                    <div class="metbic-content">
                        <!-- Preview with Arrow Navigation -->
                        <div class="metbic-preview" style="position: relative;">
                            <button class="metbic-arrow metbic-arrow-left" id="metbic-prev" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.9); border: 1px solid #ccc; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: all 0.15s;">❮</button>
                            <img src="assets/projects/metbic/hero.png" alt="METBIC" id="metbic-preview-img">
                            <button class="metbic-arrow metbic-arrow-right" id="metbic-next" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.9); border: 1px solid #ccc; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: all 0.15s;">❯</button>
                            <div class="metbic-counter" style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 11px;">1 / 8</div>
                        </div>

                        <!-- Info Panel - Scrollable Case Study -->
                        <div class="metbic-info" style="width: 220px; overflow-y: auto;">
                            <div class="metbic-info-box">
                                <div class="metbic-info-title">Project Overview</div>
                                <div class="metbic-info-text">
                                    METBİC is a pocket-sized, all-in-one repair kit designed for mountain bikers. It transforms from a compact 90×60mm unit into a fully functional workshop.
                                </div>
                            </div>

                            <div class="metbic-info-box">
                                <div class="metbic-info-title">The Challenge</div>
                                <div class="metbic-info-text">
                                    Professional mountain bikers face mechanical failures on remote trails. Carrying multiple standalone tools disrupts the riding experience and takes up valuable space.
                                </div>
                            </div>

                            <div class="metbic-info-box">
                                <div class="metbic-info-title">My Role</div>
                                <div class="metbic-info-text">
                                    <strong>Product Designer</strong><br>
                                    User Research, Concept Development, Sketching, 3D Modeling (Rhino), Prototyping
                                </div>
                            </div>

                            <div class="metbic-info-box">
                                <div class="metbic-info-title">Key Features</div>
                                <div class="metbic-info-text">
                                    • Modular tool organization<br>
                                    • Magnetic screwdriver slot<br>
                                    • 6 interchangeable bits<br>
                                    • Integrated tire lever<br>
                                    • Rim straightener<br>
                                    • Secure storage compartment
                                </div>
                            </div>

                            <div class="metbic-info-box">
                                <div class="metbic-info-title">Specifications</div>
                                <div class="metbic-info-text">
                                    <strong>Dimensions:</strong> 90×60×30mm<br>
                                    <strong>Material:</strong> Durable Polymer + Metal<br>
                                    <strong>Weight:</strong> 145g<br>
                                    <strong>Hex Sizes:</strong> 8mm, 10mm, 15mm
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Status Bar -->
                    <div class="metbic-statusbar">
                        <div class="metbic-status-item">
                            <div class="metbic-status-led"></div>
                            <span>Industrial Design Project</span>
                        </div>
                        <div class="metbic-status-item">
                            <span>Zeynep Erden • 2026</span>
                        </div>
                        <div class="metbic-status-item">
                            <span>8 Renders</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    // FIREBOX.exe - Portable Camp & Cooking Station
    firebox: () => `
        <div class="window-titlebar">
            <span class="window-title">🔥 FIREBOX.exe — Portable Cooking Station</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; display: flex; flex-direction: column; height: 100%; font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 11px;">
            <style>
                .firebox-container { display: flex; flex: 1; min-height: 0; }
                .firebox-gallery { width: 100px; background: #f0f0f0; border-right: 1px solid #a0a0a0; display: flex; flex-direction: column; padding: 8px; gap: 8px; overflow-y: auto; }
                .firebox-gallery-title { font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 6px; border-bottom: 1px solid #ccc; margin-bottom: 4px; }
                .firebox-thumb { width: 100%; aspect-ratio: 1; background: #fff; border: 2px solid #c0c0c0; border-radius: 3px; cursor: pointer; overflow: hidden; transition: all 0.15s; }
                .firebox-thumb:hover { border-color: #e85d04; transform: scale(1.02); }
                .firebox-thumb.active { border-color: #e85d04; box-shadow: 0 0 0 2px rgba(232,93,4,0.3); }
                .firebox-thumb img { width: 100%; height: 100%; object-fit: cover; }
                .firebox-main { flex: 1; display: flex; flex-direction: column; background: #fff; min-width: 0; }
                .firebox-header { padding: 12px 16px; background: linear-gradient(180deg, #e85d04 0%, #dc2f02 100%); color: #fff; }
                .firebox-header h2 { margin: 0; font-size: 14px; font-weight: 600; }
                .firebox-header p { margin: 4px 0 0; font-size: 11px; opacity: 0.9; }
                .firebox-content { flex: 1; display: flex; padding: 16px; gap: 16px; overflow: hidden; }
                .firebox-preview { flex: 1; background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%); border: 2px solid #808080; border-radius: 4px; display: flex; align-items: center; justify-content: center; min-width: 0; position: relative; }
                .firebox-preview img { max-width: 95%; max-height: 95%; object-fit: contain; border-radius: 4px; }
                .firebox-info { width: 220px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
                .firebox-info-box { background: #fff8f0; border: 1px solid #ffd6a5; border-radius: 4px; padding: 12px; }
                .firebox-info-title { font-size: 9px; font-weight: bold; color: #e85d04; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
                .firebox-info-text { font-size: 11px; color: #444; line-height: 1.6; }
                .firebox-statusbar { padding: 6px 12px; background: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%); border-top: 1px solid #a0a0a0; display: flex; justify-content: space-between; font-size: 10px; color: #555; }
                .firebox-status-item { display: flex; align-items: center; gap: 6px; }
                .firebox-status-led { width: 8px; height: 8px; border-radius: 50%; background: #e85d04; box-shadow: 0 0 4px #e85d04; }
            </style>

            <div class="firebox-container">
                <!-- Gallery Sidebar -->
                <div class="firebox-gallery">
                    <div class="firebox-gallery-title">Gallery</div>
                    <div class="firebox-thumb active" data-video="assets/projects/firebox/render.mp4" data-index="0">
                        <div style="width:100%;height:100%;background:#1a1a2e;display:flex;align-items:center;justify-content:center;font-size:24px;">▶</div>
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/hero.jpg" data-index="1">
                        <img src="assets/projects/firebox/hero.jpg" alt="Hero" loading="lazy">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/technical.jpg" data-index="2">
                        <img src="assets/projects/firebox/technical.jpg" alt="Technical" loading="lazy">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/exploded.jpg" data-index="3">
                        <img src="assets/projects/firebox/exploded.jpg" alt="Exploded" loading="lazy">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/exploded-fire.jpg" data-index="4">
                        <img src="assets/projects/firebox/exploded-fire.jpg" alt="Exploded Fire" loading="lazy">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/details.jpg" data-index="5">
                        <img src="assets/projects/firebox/details.jpg" alt="Details" loading="lazy">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/inuse.jpg" data-index="6">
                        <img src="assets/projects/firebox/inuse.jpg" alt="In Use" loading="lazy">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/context.jpg" data-index="7">
                        <img src="assets/projects/firebox/context.jpg" alt="Context" loading="lazy">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/carrying.jpg" data-index="8">
                        <img src="assets/projects/firebox/carrying.jpg" alt="Carrying" loading="lazy">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/product.jpg" data-index="9">
                        <img src="assets/projects/firebox/product.jpg" alt="Product" loading="lazy">
                    </div>
                </div>

                <!-- Main Area -->
                <div class="firebox-main">
                    <!-- Header -->
                    <div class="firebox-header">
                        <h2>FIREBOX — Portable Camp & Cooking Station</h2>
                        <p>Foldable fire pit and grill for outdoor adventures • 2025 • Product Design</p>
                    </div>

                    <!-- Content Area -->
                    <div class="firebox-content">
                        <!-- Preview with Arrow Navigation -->
                        <div class="firebox-preview">
                            <button class="firebox-arrow firebox-arrow-left" id="firebox-prev" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.9); border: 1px solid #ccc; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: all 0.15s;">❮</button>
                            <img src="assets/projects/firebox/hero.jpg" alt="FIREBOX" id="firebox-preview-img" style="display:none;">
                            <video id="firebox-preview-video" src="assets/projects/firebox/render.mp4" style="max-width:95%; max-height:95%; border-radius:4px;" controls loop autoplay muted></video>
                            <button class="firebox-arrow firebox-arrow-right" id="firebox-next" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.9); border: 1px solid #ccc; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: all 0.15s;">❯</button>
                            <div class="firebox-counter" style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 11px;">1 / 10</div>
                        </div>

                        <!-- Info Panel - Scrollable Case Study -->
                        <div class="firebox-info">
                            <div class="firebox-info-box">
                                <div class="firebox-info-title">Project Overview</div>
                                <div class="firebox-info-text">
                                    FIREBOX is a portable, foldable fire pit and cooking station. It transforms from a compact briefcase into a fully functional grill and campfire setup.
                                </div>
                            </div>

                            <div class="firebox-info-box">
                                <div class="firebox-info-title">The Challenge</div>
                                <div class="firebox-info-text">
                                    Traditional camping fire pits are bulky and difficult to transport. Outdoor enthusiasts need a lightweight, portable solution that combines fire pit and cooking functionality.
                                </div>
                            </div>

                            <div class="firebox-info-box">
                                <div class="firebox-info-title">My Role</div>
                                <div class="firebox-info-text">
                                    <strong>Product Designer</strong><br>
                                    User Research, Concept Development, Sketching, 3D Modeling (Rhino), Rendering
                                </div>
                            </div>

                            <div class="firebox-info-box">
                                <div class="firebox-info-title">Key Features</div>
                                <div class="firebox-info-text">
                                    • Foldable compact design<br>
                                    • Heat-resistant silicone handles<br>
                                    • Integrated ash drawer<br>
                                    • Airflow ventilation system<br>
                                    • Removable grill grate<br>
                                    • Modular quick setup<br>
                                    • Sliding lock mechanism
                                </div>
                            </div>

                            <div class="firebox-info-box">
                                <div class="firebox-info-title">Specifications</div>
                                <div class="firebox-info-text">
                                    <strong>Material:</strong> Stainless Steel<br>
                                    <strong>Handles:</strong> Heat-Resistant Silicone<br>
                                    <strong>Features:</strong> Foldable panels, Ash drawer
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Status Bar -->
                    <div class="firebox-statusbar">
                        <div class="firebox-status-item">
                            <div class="firebox-status-led"></div>
                            <span>Industrial Design Project</span>
                        </div>
                        <div class="firebox-status-item">
                            <span>Zeynep Erden • 2025</span>
                        </div>
                        <div class="firebox-status-item">
                            <span>9 Renders</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    // FUNCART.exe - Modular Ceramic Studio System
    funcart: () => `
        <div class="window-titlebar">
            <span class="window-title">🎨 FuncArt.exe — Modular Ceramic Studio System</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; display: flex; flex-direction: column; height: 100%; font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 11px;">
            <style>
                .funcart-container { display: flex; flex: 1; min-height: 0; }
                .funcart-gallery { width: 100px; background: #f0f0f0; border-right: 1px solid #a0a0a0; display: flex; flex-direction: column; padding: 8px; gap: 8px; overflow-y: auto; }
                .funcart-gallery-title { font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 6px; border-bottom: 1px solid #ccc; margin-bottom: 4px; }
                .funcart-thumb { width: 100%; aspect-ratio: 1; background: #fff; border: 2px solid #c0c0c0; border-radius: 3px; cursor: pointer; overflow: hidden; transition: all 0.15s; }
                .funcart-thumb:hover { border-color: #6b8e5a; transform: scale(1.02); }
                .funcart-thumb.active { border-color: #6b8e5a; box-shadow: 0 0 0 2px rgba(107,142,90,0.3); }
                .funcart-thumb img { width: 100%; height: 100%; object-fit: cover; }
                .funcart-main { flex: 1; display: flex; flex-direction: column; background: #fff; min-width: 0; }
                .funcart-header { padding: 12px 16px; background: linear-gradient(180deg, #6b8e5a 0%, #4a6e3a 100%); color: #fff; }
                .funcart-header h2 { margin: 0; font-size: 14px; font-weight: 600; }
                .funcart-header p { margin: 4px 0 0; font-size: 11px; opacity: 0.9; }
                .funcart-content { flex: 1; display: flex; padding: 16px; gap: 16px; overflow: hidden; }
                .funcart-preview { flex: 1; background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%); border: 2px solid #808080; border-radius: 4px; display: flex; align-items: center; justify-content: center; min-width: 0; position: relative; }
                .funcart-preview img { max-width: 95%; max-height: 95%; object-fit: contain; border-radius: 4px; }
                .funcart-info { width: 220px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
                .funcart-info-box { background: #f4f8f2; border: 1px solid #c5d9b8; border-radius: 4px; padding: 12px; }
                .funcart-info-title { font-size: 9px; font-weight: bold; color: #4a6e3a; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
                .funcart-info-text { font-size: 11px; color: #444; line-height: 1.6; }
                .funcart-statusbar { padding: 6px 12px; background: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%); border-top: 1px solid #a0a0a0; display: flex; justify-content: space-between; font-size: 10px; color: #555; }
                .funcart-status-item { display: flex; align-items: center; gap: 6px; }
                .funcart-status-led { width: 8px; height: 8px; border-radius: 50%; background: #6b8e5a; box-shadow: 0 0 4px #6b8e5a; }
            </style>

            <div class="funcart-container">
                <!-- Gallery Sidebar -->
                <div class="funcart-gallery">
                    <div class="funcart-gallery-title">Gallery</div>
                    <div class="funcart-thumb active" data-img="assets/projects/funcart/hero.png" data-index="0">
                        <img src="assets/projects/funcart/hero.png" alt="Hero" loading="lazy">
                    </div>
                    <div class="funcart-thumb" data-img="assets/projects/funcart/workflex.png" data-index="1">
                        <img src="assets/projects/funcart/workflex.png" alt="WorkFlex" loading="lazy">
                    </div>
                    <div class="funcart-thumb" data-img="assets/projects/funcart/liftrack.png" data-index="2">
                        <img src="assets/projects/funcart/liftrack.png" alt="LiftRack" loading="lazy">
                    </div>
                    <div class="funcart-thumb" data-img="assets/projects/funcart/mobsit.png" data-index="3">
                        <img src="assets/projects/funcart/mobsit.png" alt="MobSit" loading="lazy">
                    </div>
                    <div class="funcart-thumb" data-img="assets/projects/funcart/workflow.png" data-index="4">
                        <img src="assets/projects/funcart/workflow.png" alt="Workflow" loading="lazy">
                    </div>
                    <div class="funcart-thumb" data-img="assets/projects/funcart/features.png" data-index="5">
                        <img src="assets/projects/funcart/features.png" alt="Features" loading="lazy">
                    </div>
                    <div class="funcart-thumb" data-img="assets/projects/funcart/workshop.png" data-index="6">
                        <img src="assets/projects/funcart/workshop.png" alt="Workshop" loading="lazy">
                    </div>
                </div>

                <!-- Main Area -->
                <div class="funcart-main">
                    <!-- Header -->
                    <div class="funcart-header">
                        <h2>FuncArt — Modular Ceramic Studio System</h2>
                        <p>Adaptable furniture system for ceramic workshops • 2026 • Product Design</p>
                    </div>

                    <!-- Content Area -->
                    <div class="funcart-content">
                        <!-- Preview with Arrow Navigation -->
                        <div class="funcart-preview">
                            <button class="funcart-arrow funcart-arrow-left" id="funcart-prev" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.9); border: 1px solid #ccc; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: all 0.15s;">❮</button>
                            <img src="assets/projects/funcart/hero.png" alt="FuncArt" id="funcart-preview-img">
                            <button class="funcart-arrow funcart-arrow-right" id="funcart-next" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.9); border: 1px solid #ccc; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: all 0.15s;">❯</button>
                            <div class="funcart-counter" style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 11px;">1 / 7</div>
                        </div>

                        <!-- Info Panel - Scrollable Case Study -->
                        <div class="funcart-info">
                            <div class="funcart-info-box">
                                <div class="funcart-info-title">Project Overview</div>
                                <div class="funcart-info-text">
                                    FuncArt is a modular furniture system designed for ceramic artists. It provides adaptable workstations that transform to support different stages of the creative process.
                                </div>
                            </div>

                            <div class="funcart-info-box">
                                <div class="funcart-info-title">The Challenge</div>
                                <div class="funcart-info-text">
                                    Ceramic artists work across multiple stages — wedging, throwing, trimming, glazing — each requiring different surfaces and heights. Traditional furniture forces a choice between specialized stations or generic tables.
                                </div>
                            </div>

                            <div class="funcart-info-box">
                                <div class="funcart-info-title">My Role</div>
                                <div class="funcart-info-text">
                                    <strong>Product Designer</strong><br>
                                    User Research, Concept Development, Sketching, 3D Modeling (Rhino), Prototyping
                                </div>
                            </div>

                            <div class="funcart-info-box">
                                <div class="funcart-info-title">Key Features</div>
                                <div class="funcart-info-text">
                                    • Modular interlocking system<br>
                                    • Water & glaze resistant surfaces<br>
                                    • Sustainable materials (birch + steel)<br>
                                    • Tool-free height adjustment<br>
                                    • Lockable casters on all modules<br>
                                    • Compact nested storage
                                </div>
                            </div>

                            <div class="funcart-info-box">
                                <div class="funcart-info-title">System Components</div>
                                <div class="funcart-info-text">
                                    <strong>WorkFlex:</strong> Adjustable worktable<br>
                                    <strong>LiftRack:</strong> Drying/storage rack<br>
                                    <strong>MobSit:</strong> Ergonomic mobile seat
                                </div>
                            </div>

                            <div class="funcart-info-box">
                                <div class="funcart-info-title">Specifications</div>
                                <div class="funcart-info-text">
                                    <strong>Material:</strong> Birch Plywood + Recycled Steel<br>
                                    <strong>WorkFlex:</strong> 120×80cm<br>
                                    <strong>LiftRack:</strong> 60×40cm<br>
                                    <strong>Components:</strong> 3 modules
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Status Bar -->
                    <div class="funcart-statusbar">
                        <div class="funcart-status-item">
                            <div class="funcart-status-led"></div>
                            <span>Industrial Design Project</span>
                        </div>
                        <div class="funcart-status-item">
                            <span>Zeynep Erden • 2026</span>
                        </div>
                        <div class="funcart-status-item">
                            <span>7 Renders</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    // MARINESENTRY.exe - Decision-Support Underwater Drone
    marinesentry: () => `
        <div class="window-titlebar">
            <span class="window-title">🌊 MarineSentry.exe — Underwater Drone</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; display: flex; flex-direction: column; height: 100%; font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 11px;">
            <style>
                .msentry-container { display: flex; flex: 1; min-height: 0; }
                .msentry-gallery { width: 100px; background: #f0f0f0; border-right: 1px solid #a0a0a0; display: flex; flex-direction: column; padding: 8px; gap: 8px; overflow-y: auto; }
                .msentry-gallery-title { font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 6px; border-bottom: 1px solid #ccc; margin-bottom: 4px; }
                .msentry-thumb { width: 100%; aspect-ratio: 1; background: #fff; border: 2px solid #c0c0c0; border-radius: 3px; cursor: pointer; overflow: hidden; transition: all 0.15s; }
                .msentry-thumb:hover { border-color: #e07020; transform: scale(1.02); }
                .msentry-thumb.active { border-color: #e07020; box-shadow: 0 0 0 2px rgba(224,112,32,0.3); }
                .msentry-thumb img { width: 100%; height: 100%; object-fit: cover; }
                .msentry-main { flex: 1; display: flex; flex-direction: column; background: #fff; min-width: 0; }
                .msentry-header { padding: 12px 16px; background: linear-gradient(180deg, #2a3a4a 0%, #1a2a3a 100%); color: #fff; }
                .msentry-header h2 { margin: 0; font-size: 14px; font-weight: 600; }
                .msentry-header p { margin: 4px 0 0; font-size: 11px; opacity: 0.9; }
                .msentry-content { flex: 1; display: flex; padding: 16px; gap: 16px; overflow: hidden; }
                .msentry-preview { flex: 1; background: linear-gradient(135deg, #0a1520 0%, #1a2a3a 100%); border: 2px solid #808080; border-radius: 4px; display: flex; align-items: center; justify-content: center; min-width: 0; position: relative; }
                .msentry-preview img { max-width: 95%; max-height: 95%; object-fit: contain; border-radius: 4px; }
                .msentry-info { width: 220px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
                .msentry-info-box { background: #f0f5fa; border: 1px solid #b8d0e8; border-radius: 4px; padding: 12px; }
                .msentry-info-title { font-size: 9px; font-weight: bold; color: #2a5a8a; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
                .msentry-info-text { font-size: 11px; color: #444; line-height: 1.6; }
                .msentry-statusbar { padding: 6px 12px; background: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%); border-top: 1px solid #a0a0a0; display: flex; justify-content: space-between; font-size: 10px; color: #555; }
                .msentry-status-item { display: flex; align-items: center; gap: 6px; }
                .msentry-status-led { width: 8px; height: 8px; border-radius: 50%; background: #e07020; box-shadow: 0 0 4px #e07020; }
            </style>

            <div class="msentry-container">
                <div class="msentry-gallery">
                    <div class="msentry-gallery-title">Gallery</div>
                    <div class="msentry-thumb active" data-video="assets/projects/marinesentry/video.mp4" data-index="0">
                        <div style="width:100%;height:100%;background:#1a2a3a;display:flex;align-items:center;justify-content:center;color:#e07020;font-size:24px;">&#9654;</div>
                    </div>
                    <div class="msentry-thumb" data-img="assets/projects/marinesentry/hero.png" data-index="1">
                        <img src="assets/projects/marinesentry/hero.png" alt="Hero" loading="lazy">
                    </div>
                    <div class="msentry-thumb" data-img="assets/projects/marinesentry/render.png" data-index="2">
                        <img src="assets/projects/marinesentry/render.png" alt="Render" loading="lazy">
                    </div>
                    <div class="msentry-thumb" data-img="assets/projects/marinesentry/exploded.png" data-index="3">
                        <img src="assets/projects/marinesentry/exploded.png" alt="Exploded" loading="lazy">
                    </div>
                    <div class="msentry-thumb" data-img="assets/projects/marinesentry/board.png" data-index="4">
                        <img src="assets/projects/marinesentry/board.png" alt="Board" loading="lazy">
                    </div>
                    <div class="msentry-thumb" data-img="assets/projects/marinesentry/components.png" data-index="5">
                        <img src="assets/projects/marinesentry/components.png" alt="Components" loading="lazy">
                    </div>
                </div>

                <div class="msentry-main">
                    <div class="msentry-header">
                        <h2>MarineSentry — Decision-Support Underwater Drone</h2>
                        <p>Compact underwater drone for rescue & inspection • 2026 • Product Design</p>
                    </div>

                    <div class="msentry-content">
                        <div class="msentry-preview">
                            <button id="msentry-prev" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.9); border: 1px solid #ccc; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: all 0.15s;">❮</button>
                            <video src="assets/projects/marinesentry/video.mp4" id="msentry-preview-video" controls autoplay style="max-width:95%;max-height:95%;border-radius:4px;"></video>
                            <img src="assets/projects/marinesentry/hero.png" alt="MarineSentry" id="msentry-preview-img" style="display:none;">
                            <button id="msentry-next" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.9); border: 1px solid #ccc; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: all 0.15s;">❯</button>
                            <div class="msentry-counter" style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 11px;">1 / 6</div>
                        </div>

                        <div class="msentry-info">
                            <div class="msentry-info-box">
                                <div class="msentry-info-title">Project Overview</div>
                                <div class="msentry-info-text">
                                    A compact, decision-support underwater drone for low-visibility rescue and inspection. Provides sonar and thermal data before human entry, enabling safer rescue decisions.
                                </div>
                            </div>

                            <div class="msentry-info-box">
                                <div class="msentry-info-title">The Challenge</div>
                                <div class="msentry-info-text">
                                    Underwater rescue operations take place in zero-visibility conditions. Divers enter blindly, increasing risk, response time, and uncertainty during critical moments.
                                </div>
                            </div>

                            <div class="msentry-info-box">
                                <div class="msentry-info-title">My Role</div>
                                <div class="msentry-info-text">
                                    <strong>Product Designer</strong><br>
                                    User Research, Problem Definition, Concept Development, Industrial Design, System Logic, 3D Modeling, Visual Storytelling
                                </div>
                            </div>

                            <div class="msentry-info-box">
                                <div class="msentry-info-title">Key Features</div>
                                <div class="msentry-info-text">
                                    • Sonar-based zero-visibility detection<br>
                                    • Thermal heat signature sensing<br>
                                    • Human-centered decision workflow<br>
                                    • Compact deploy-before-dive system<br>
                                    • Guidance without replacing judgment
                                </div>
                            </div>

                            <div class="msentry-info-box">
                                <div class="msentry-info-title">Specifications</div>
                                <div class="msentry-info-text">
                                    <strong>Material:</strong> Polycarbonate + PU Foam<br>
                                    <strong>Propulsion:</strong> Dual thrusters<br>
                                    <strong>Sensors:</strong> Sonar, Thermal camera<br>
                                    <strong>Colors:</strong> Black, Dark Grey, Orange
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="msentry-statusbar">
                        <div class="msentry-status-item">
                            <div class="msentry-status-led"></div>
                            <span>Industrial Design Project</span>
                        </div>
                        <div class="msentry-status-item">
                            <span>Zeynep Erden • 2026</span>
                        </div>
                        <div class="msentry-status-item">
                            <span>6 Items</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    // GUSTO.exe - Personal Air Management Device
    gusto: () => `
        <div class="window-titlebar">
            <span class="window-title">🌬️ GUSTO.exe — Personal Air Management Device</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; display: flex; flex-direction: column; height: 100%; font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 11px;">
            <style>
                .gusto-container { display: flex; flex: 1; min-height: 0; }
                .gusto-gallery { width: 100px; background: #f0f0f0; border-right: 1px solid #a0a0a0; display: flex; flex-direction: column; padding: 8px; gap: 8px; overflow-y: auto; }
                .gusto-gallery-title { font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 6px; border-bottom: 1px solid #ccc; margin-bottom: 4px; }
                .gusto-thumb { width: 100%; aspect-ratio: 1; background: #fff; border: 2px solid #c0c0c0; border-radius: 3px; cursor: pointer; overflow: hidden; transition: all 0.15s; }
                .gusto-thumb:hover { border-color: #6b3a3a; transform: scale(1.02); }
                .gusto-thumb.active { border-color: #6b3a3a; box-shadow: 0 0 0 2px rgba(107,58,58,0.3); }
                .gusto-thumb img { width: 100%; height: 100%; object-fit: cover; }
                .gusto-main { flex: 1; display: flex; flex-direction: column; background: #fff; min-width: 0; }
                .gusto-header { padding: 12px 16px; background: linear-gradient(180deg, #6b3a3a 0%, #4a2828 100%); color: #fff; }
                .gusto-header h2 { margin: 0; font-size: 14px; font-weight: 600; }
                .gusto-header p { margin: 4px 0 0; font-size: 11px; opacity: 0.9; }
                .gusto-content { flex: 1; display: flex; padding: 16px; gap: 16px; overflow: hidden; }
                .gusto-preview { flex: 1; background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%); border: 2px solid #808080; border-radius: 4px; display: flex; align-items: center; justify-content: center; min-width: 0; position: relative; }
                .gusto-preview img { max-width: 95%; max-height: 95%; object-fit: contain; border-radius: 4px; }
                .gusto-info { width: 220px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
                .gusto-info-box { background: #f8f2f2; border: 1px solid #d9c0c0; border-radius: 4px; padding: 12px; }
                .gusto-info-title { font-size: 9px; font-weight: bold; color: #6b3a3a; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
                .gusto-info-text { font-size: 11px; color: #444; line-height: 1.6; }
                .gusto-statusbar { padding: 6px 12px; background: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%); border-top: 1px solid #a0a0a0; display: flex; justify-content: space-between; font-size: 10px; color: #555; }
                .gusto-status-item { display: flex; align-items: center; gap: 6px; }
                .gusto-status-led { width: 8px; height: 8px; border-radius: 50%; background: #6b3a3a; box-shadow: 0 0 4px #6b3a3a; }
            </style>

            <div class="gusto-container">
                <!-- Gallery Sidebar -->
                <div class="gusto-gallery">
                    <div class="gusto-gallery-title">Gallery</div>
                    <div class="gusto-thumb active" data-img="assets/projects/gusto/hero.png" data-index="0">
                        <img src="assets/projects/gusto/hero.png" alt="Hero" loading="lazy">
                    </div>
                    <div class="gusto-thumb" data-img="assets/projects/gusto/context.png" data-index="1">
                        <img src="assets/projects/gusto/context.png" alt="Context" loading="lazy">
                    </div>
                    <div class="gusto-thumb" data-img="assets/projects/gusto/colors.png" data-index="2">
                        <img src="assets/projects/gusto/colors.png" alt="Colors" loading="lazy">
                    </div>
                    <div class="gusto-thumb" data-img="assets/projects/gusto/technical.png" data-index="3">
                        <img src="assets/projects/gusto/technical.png" alt="Technical" loading="lazy">
                    </div>
                    <div class="gusto-thumb" data-img="assets/projects/gusto/design.png" data-index="4">
                        <img src="assets/projects/gusto/design.png" alt="Design" loading="lazy">
                    </div>
                    <div class="gusto-thumb" data-img="assets/projects/gusto/overview.png" data-index="5">
                        <img src="assets/projects/gusto/overview.png" alt="Overview" loading="lazy">
                    </div>
                    <div class="gusto-thumb" data-img="assets/projects/gusto/exploded.png" data-index="6">
                        <img src="assets/projects/gusto/exploded.png" alt="Exploded" loading="lazy">
                    </div>
                </div>

                <!-- Main Area -->
                <div class="gusto-main">
                    <!-- Header -->
                    <div class="gusto-header">
                        <h2>GUSTO — Personal Air Management Device</h2>
                        <p>Compact air management for professional kitchens • 2026 • Product Design</p>
                    </div>

                    <!-- Content Area -->
                    <div class="gusto-content">
                        <!-- Preview with Arrow Navigation -->
                        <div class="gusto-preview">
                            <button id="gusto-prev" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.9); border: 1px solid #ccc; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: all 0.15s;">❮</button>
                            <img src="assets/projects/gusto/hero.png" alt="GUSTO" id="gusto-preview-img">
                            <button id="gusto-next" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.9); border: 1px solid #ccc; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: all 0.15s;">❯</button>
                            <div class="gusto-counter" style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 11px;">1 / 7</div>
                        </div>

                        <!-- Info Panel -->
                        <div class="gusto-info">
                            <div class="gusto-info-box">
                                <div class="gusto-info-title">Project Overview</div>
                                <div class="gusto-info-text">
                                    A compact, personal air management solution for chefs in intense professional kitchens. Filters polluted air, neutralizes odors, circulates clean airflow, and diffuses calming aromas.
                                </div>
                            </div>

                            <div class="gusto-info-box">
                                <div class="gusto-info-title">The Challenge</div>
                                <div class="gusto-info-text">
                                    Professional kitchens are closed, hot, and poorly ventilated. Chefs face smoke, oil particles, heavy odors, and mental fatigue. Existing systems focus on the space, not the individual.
                                </div>
                            </div>

                            <div class="gusto-info-box">
                                <div class="gusto-info-title">My Role</div>
                                <div class="gusto-info-text">
                                    <strong>Product Designer</strong><br>
                                    User Research, Persona Development, Concept Development, Sketching, 3D Modeling, Usage Scenario Design
                                </div>
                            </div>

                            <div class="gusto-info-box">
                                <div class="gusto-info-title">Key Features</div>
                                <div class="gusto-info-text">
                                    • Personal air filtering system<br>
                                    • Odor neutralization & clean airflow<br>
                                    • Integrated aroma diffusion<br>
                                    • Compact, portable countertop form<br>
                                    • Quiet fan for pro kitchens<br>
                                    • Type-C charging & rechargeable<br>
                                    • Soft-touch ergonomic surface<br>
                                    • Multiple color variations
                                </div>
                            </div>

                            <div class="gusto-info-box">
                                <div class="gusto-info-title">Design Approach</div>
                                <div class="gusto-info-text">
                                    Organic, protective forms follow airflow logic. The device acts as a personal breathing zone, supporting focus and comfort without disrupting workflow.
                                </div>
                            </div>

                            <div class="gusto-info-box">
                                <div class="gusto-info-title">Specifications</div>
                                <div class="gusto-info-text">
                                    <strong>Material:</strong> ABS + Soft-Touch Coating<br>
                                    <strong>Size:</strong> 110mm (H) × 95mm (W)<br>
                                    <strong>Charging:</strong> USB Type-C<br>
                                    <strong>Colors:</strong> Deep Burgundy, Muted Purple, Midnight Blue
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Status Bar -->
                    <div class="gusto-statusbar">
                        <div class="gusto-status-item">
                            <div class="gusto-status-led"></div>
                            <span>Industrial Design Project</span>
                        </div>
                        <div class="gusto-status-item">
                            <span>Zeynep Erden • 2026</span>
                        </div>
                        <div class="gusto-status-item">
                            <span>7 Renders</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    // Zeyn Chat - MSN Messenger Style Chatbot (frameless - MSN has its own chrome)
    zeynshat: () => `
        <div class="window-titlebar" style="display: none;">
            <span class="window-title">Zeyn Chat</span>
            <div class="window-controls">
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; overflow: hidden; flex: 1; display: flex; border: none; background: transparent;">
            <iframe data-src="msn-chatbot.html" class="zeynshat-iframe" style="width: 100%; height: 100%; border: none; flex: 1;"></iframe>
        </div>
    `
,

    // Paint - MS Paint style drawing app
    paint: () => `
        <div class="window-titlebar">
            <span class="window-title">🎨 Paint</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; display: flex; flex-direction: column; height: 100%; overflow: hidden; font-family: 'Segoe UI', Tahoma, sans-serif;">
            <style>
                .paint-menubar { display: flex; gap: 2px; padding: 1px 4px; background: #ece9d8; border-bottom: 1px solid #aca899; font-size: 11px; }
                .paint-menu-item { padding: 2px 6px; cursor: pointer; color: #000; }
                .paint-menu-item:hover { background: #316ac5; color: #fff; }
                .paint-toolbar { display: flex; align-items: center; gap: 2px; padding: 2px 4px; background: #ece9d8; border-bottom: 1px solid #aca899; flex-wrap: wrap; }
                .paint-tool { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid transparent; font-size: 14px; border-radius: 2px; background: none; padding: 0; }
                .paint-tool:hover { border-color: #c0c0c0; background: #e8e8e8; }
                .paint-tool.active { border: 1px inset #808080; background: #d0d0d0; }
                .paint-tool-sep { width: 1px; height: 22px; background: #aca899; margin: 0 2px; }
                .paint-size-group { display: flex; align-items: center; gap: 4px; margin-left: 4px; font-size: 10px; color: #333; }
                .paint-size-input { width: 36px; height: 18px; font-size: 10px; text-align: center; border: 1px inset #808080; }
                .paint-body { flex: 1; display: flex; overflow: hidden; }
                .paint-canvas-wrap { flex: 1; overflow: auto; background: #808080; display: flex; align-items: flex-start; justify-content: flex-start; padding: 4px; }
                .paint-canvas { background: #fff; cursor: crosshair; border: 1px solid #000; }
                .paint-colors { display: flex; align-items: center; gap: 1px; padding: 3px 4px; background: #ece9d8; border-top: 1px solid #aca899; }
                .paint-color-current { display: flex; align-items: center; gap: 2px; margin-right: 6px; }
                .paint-fg { width: 18px; height: 18px; border: 1px solid #808080; position: relative; z-index: 2; }
                .paint-bg { width: 18px; height: 18px; border: 1px solid #808080; margin-left: -8px; margin-top: 6px; }
                .paint-palette { display: flex; flex-wrap: wrap; gap: 1px; max-width: 340px; }
                .paint-swatch { width: 14px; height: 14px; border: 1px solid #808080; cursor: pointer; }
                .paint-swatch:hover { border-color: #fff; }
                .paint-statusbar { font-size: 10px; color: #444; padding: 2px 6px; background: #ece9d8; border-top: 1px solid #aca899; display: flex; justify-content: space-between; }
            </style>

            <!-- Menu Bar -->
            <div class="paint-menubar">
                <div class="paint-menu-item" id="paint-file">File</div>
                <div class="paint-menu-item" id="paint-edit">Edit</div>
                <div class="paint-menu-item" id="paint-view">View</div>
            </div>

            <!-- Toolbar -->
            <div class="paint-toolbar">
                <button class="paint-tool active" data-tool="pencil" title="Pencil">✏️</button>
                <button class="paint-tool" data-tool="brush" title="Brush">🖌️</button>
                <button class="paint-tool" data-tool="eraser" title="Eraser">🧹</button>
                <div class="paint-tool-sep"></div>
                <button class="paint-tool" data-tool="line" title="Line">╱</button>
                <button class="paint-tool" data-tool="rect" title="Rectangle">▢</button>
                <button class="paint-tool" data-tool="circle" title="Ellipse">◯</button>
                <button class="paint-tool" data-tool="fill" title="Fill">🪣</button>
                <div class="paint-tool-sep"></div>
                <button class="paint-tool" data-tool="text" title="Text">A</button>
                <button class="paint-tool" data-tool="picker" title="Color Picker">💉</button>
                <div class="paint-tool-sep"></div>
                <div class="paint-size-group">
                    Size: <input type="number" class="paint-size-input" id="paint-brush-size" value="2" min="1" max="50">
                </div>
                <div class="paint-tool-sep"></div>
                <button class="paint-tool" id="paint-undo" title="Undo">↩</button>
                <button class="paint-tool" id="paint-clear" title="Clear">🗑️</button>
            </div>

            <!-- Canvas -->
            <div class="paint-body">
                <div class="paint-canvas-wrap" id="paint-canvas-wrap">
                    <canvas class="paint-canvas" id="paint-canvas" width="640" height="400"></canvas>
                </div>
            </div>

            <!-- Color Palette -->
            <div class="paint-colors">
                <div class="paint-color-current">
                    <div>
                        <div class="paint-fg" id="paint-fg" style="background:#000"></div>
                        <div class="paint-bg" id="paint-bg" style="background:#fff"></div>
                    </div>
                </div>
                <div class="paint-palette" id="paint-palette"></div>
            </div>

            <!-- Status Bar -->
            <div class="paint-statusbar">
                <span id="paint-pos">0, 0</span>
                <span id="paint-tool-name">Pencil</span>
            </div>
        </div>
    `,

    // CoffeeForm.exe - Sustainable Laptop Stand
    coffeeform: () => `
        <div class="window-titlebar">
            <span class="window-title">☕ CoffeeForm.exe — Sustainable Laptop Stand</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; display: flex; flex-direction: column; height: 100%; font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 11px;">
            <style>
                .coffeeform-container { display: flex; flex: 1; min-height: 0; }
                .coffeeform-gallery { width: 100px; background: #f0f0f0; border-right: 1px solid #a0a0a0; display: flex; flex-direction: column; padding: 8px; gap: 8px; overflow-y: auto; }
                .coffeeform-gallery-title { font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 6px; border-bottom: 1px solid #ccc; margin-bottom: 4px; }
                .coffeeform-thumb { width: 100%; aspect-ratio: 1; background: #fff; border: 2px solid #c0c0c0; border-radius: 3px; cursor: pointer; overflow: hidden; transition: all 0.15s; }
                .coffeeform-thumb:hover { border-color: #8B6914; transform: scale(1.02); }
                .coffeeform-thumb.active { border-color: #8B6914; box-shadow: 0 0 0 2px rgba(139,105,20,0.3); }
                .coffeeform-thumb img { width: 100%; height: 100%; object-fit: cover; }
                .coffeeform-main { flex: 1; display: flex; flex-direction: column; background: #fff; min-width: 0; }
                .coffeeform-header { padding: 12px 16px; background: linear-gradient(180deg, #8B6914 0%, #6B4F10 100%); color: #fff; }
                .coffeeform-header h2 { margin: 0; font-size: 14px; font-weight: 600; }
                .coffeeform-header p { margin: 4px 0 0; font-size: 11px; opacity: 0.9; }
                .coffeeform-content { flex: 1; display: flex; padding: 16px; gap: 16px; overflow: hidden; }
                .coffeeform-preview { flex: 1; background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%); border: 2px solid #808080; border-radius: 4px; display: flex; align-items: center; justify-content: center; min-width: 0; position: relative; }
                .coffeeform-preview img { max-width: 95%; max-height: 95%; object-fit: contain; border-radius: 4px; }
                .coffeeform-info { width: 220px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
                .coffeeform-info-box { background: #faf6f0; border: 1px solid #dbc9a0; border-radius: 4px; padding: 12px; }
                .coffeeform-info-title { font-size: 9px; font-weight: bold; color: #8B6914; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
                .coffeeform-info-text { font-size: 11px; color: #444; line-height: 1.6; }
                .coffeeform-statusbar { padding: 6px 12px; background: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%); border-top: 1px solid #a0a0a0; display: flex; justify-content: space-between; font-size: 10px; color: #555; }
                .coffeeform-status-item { display: flex; align-items: center; gap: 6px; }
                .coffeeform-status-led { width: 8px; height: 8px; border-radius: 50%; background: #8B6914; box-shadow: 0 0 4px #8B6914; }
            </style>

            <div class="coffeeform-container">
                <!-- Gallery Sidebar -->
                <div class="coffeeform-gallery">
                    <div class="coffeeform-gallery-title">Gallery</div>
                    <div class="coffeeform-thumb active" data-img="assets/projects/coffeeform/hero.png" data-index="0">
                        <img src="assets/projects/coffeeform/hero.png" alt="Hero" loading="lazy">
                    </div>
                    <div class="coffeeform-thumb" data-img="assets/projects/coffeeform/context.png" data-index="1">
                        <img src="assets/projects/coffeeform/context.png" alt="Context" loading="lazy">
                    </div>
                    <div class="coffeeform-thumb" data-img="assets/projects/coffeeform/technical.png" data-index="2">
                        <img src="assets/projects/coffeeform/technical.png" alt="Technical" loading="lazy">
                    </div>
                    <div class="coffeeform-thumb" data-img="assets/projects/coffeeform/exploded.png" data-index="3">
                        <img src="assets/projects/coffeeform/exploded.png" alt="Exploded View" loading="lazy">
                    </div>
                </div>

                <!-- Main Area -->
                <div class="coffeeform-main">
                    <!-- Header -->
                    <div class="coffeeform-header">
                        <h2>CoffeeForm — Sustainable Laptop Stand</h2>
                        <p>Recycled coffee ground composite • 2026 • Product Design</p>
                    </div>

                    <!-- Content Area -->
                    <div class="coffeeform-content">
                        <!-- Preview with Arrow Navigation -->
                        <div class="coffeeform-preview">
                            <button id="coffeeform-prev" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.9); border: 1px solid #ccc; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: all 0.15s;">❮</button>
                            <img src="assets/projects/coffeeform/hero.png" alt="CoffeeForm" id="coffeeform-preview-img">
                            <button id="coffeeform-next" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.9); border: 1px solid #ccc; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: all 0.15s;">❯</button>
                            <div class="coffeeform-counter" style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 11px;">1 / 8</div>
                        </div>

                        <!-- Info Panel -->
                        <div class="coffeeform-info">
                            <div class="coffeeform-info-box">
                                <div class="coffeeform-info-title">Project Overview</div>
                                <div class="coffeeform-info-text">
                                    CoffeeForm is an ergonomic laptop stand made primarily from recycled coffee grounds. A foldable, flat-pack product that transforms into a stable stand through tool-free assembly — using only material logic and form.
                                </div>
                            </div>

                            <div class="coffeeform-info-box">
                                <div class="coffeeform-info-title">Material & Sustainability</div>
                                <div class="coffeeform-info-text">
                                    The primary material is recycled coffee grounds collected from coffee shops, dried & cleaned, mixed with natural binders and wood particles, then hot-pressed into rigid panels. The result is a durable, biodegradable composite with a natural matte finish.
                                </div>
                            </div>

                            <div class="coffeeform-info-box">
                                <div class="coffeeform-info-title">Key Features</div>
                                <div class="coffeeform-info-text">
                                    • Recycled coffee ground material<br>
                                    • Foldable, flat-pack structure<br>
                                    • Tool-free assembly<br>
                                    • Ergonomic elevation up to 25 cm<br>
                                    • Integrated mouse surface<br>
                                    • Lightweight and portable<br>
                                    • Biodegradable composite
                                </div>
                            </div>

                            <div class="coffeeform-info-box">
                                <div class="coffeeform-info-title">User Experience</div>
                                <div class="coffeeform-info-text">
                                    Designed for immediate understanding: open the flat surface, remove the rear support piece, insert it through the front slot — instantly transforms into a stable stand. No instructions, no fasteners.
                                </div>
                            </div>

                            <div class="coffeeform-info-box">
                                <div class="coffeeform-info-title">Circular Design</div>
                                <div class="coffeeform-info-text">
                                    Developed as a circular design concept for coffee brands. Coffee waste from daily consumption is transformed into a long-lasting object, encouraging users to rethink waste, material value, and everyday sustainability.
                                </div>
                            </div>

                            <div class="coffeeform-info-box">
                                <div class="coffeeform-info-title">My Role</div>
                                <div class="coffeeform-info-text">
                                    <strong>Product Designer</strong><br>
                                    Concept Development, Material Research (coffee-based composites), Sketching & Ideation, Prototyping, 3D Modeling, Product Storytelling & Presentation
                                </div>
                            </div>

                            <div class="coffeeform-info-box">
                                <div class="coffeeform-info-title">Specifications</div>
                                <div class="coffeeform-info-text">
                                    <strong>Open Length:</strong> 54.7 cm<br>
                                    <strong>Width:</strong> 22.5 cm<br>
                                    <strong>Max Height:</strong> 25 cm<br>
                                    <strong>Material:</strong> Coffee + Wood Chip Composite<br>
                                    <strong>Binder:</strong> 100% Natural Resin
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Status Bar -->
                    <div class="coffeeform-statusbar">
                        <div class="coffeeform-status-item">
                            <div class="coffeeform-status-led"></div>
                            <span>Industrial Design Project</span>
                        </div>
                        <div class="coffeeform-status-item">
                            <span>Zeynep Erden • 2026</span>
                        </div>
                        <div class="coffeeform-status-item">
                            <span>4 Images</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    // Resume.exe - CV / Resume Window
    cv: () => `
        <div class="window-titlebar">
            <span class="window-title">📄 Resume.exe</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; display: flex; flex-direction: column; height: 100%; font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 11px;">
            <style>
                .cv-container {
                    flex: 1;
                    display: flex;
                    overflow: hidden;
                    min-height: 0;
                    background: linear-gradient(135deg, #f2b8d0 0%, #c8b8e8 30%, #a8d0f0 60%, #90d8e0 100%);
                }

                /* === LEFT COLUMN === */
                .cv-left {
                    width: 200px;
                    min-width: 200px;
                    padding: 16px 14px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    overflow-y: auto;
                    background: rgba(255,255,255,0.15);
                    border-right: 1px solid rgba(255,255,255,0.3);
                }

                .cv-left-label {
                    font-size: 9px;
                    font-weight: 700;
                    color: #555;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    align-self: flex-start;
                }

                .cv-avatar {
                    width: 100px;
                    height: 100px;
                    border-radius: 8px;
                    border: 3px solid #fff;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    object-fit: cover;
                    cursor: pointer;
                    transition: transform 0.15s, box-shadow 0.15s;
                }

                .cv-avatar:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                }

                /* XP-style Lightbox */
                .cv-lightbox {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.7);
                    z-index: 99999;
                    align-items: center;
                    justify-content: center;
                }

                .cv-lightbox.active {
                    display: flex;
                }

                .cv-lightbox-window {
                    background: #ece9d8;
                    border: 2px solid #0054e3;
                    border-radius: 8px 8px 0 0;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                    max-width: 90%;
                    max-height: 90%;
                    overflow: hidden;
                }

                .cv-lightbox-titlebar {
                    background: linear-gradient(180deg, #0a246a 0%, #0054e3 8%, #0054e3 92%, #0a246a 100%);
                    padding: 4px 6px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-radius: 6px 6px 0 0;
                }

                .cv-lightbox-title {
                    color: #fff;
                    font-size: 11px;
                    font-weight: 700;
                    text-shadow: 1px 1px 1px rgba(0,0,0,0.3);
                }

                .cv-lightbox-close {
                    width: 21px;
                    height: 21px;
                    background: linear-gradient(180deg, #c83c28 0%, #b02818 50%, #9c2010 100%);
                    border: 1px solid #fff;
                    border-radius: 3px;
                    color: #fff;
                    font-size: 13px;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                }

                .cv-lightbox-close:hover {
                    background: linear-gradient(180deg, #e04830 0%, #c83020 50%, #b02818 100%);
                }

                .cv-lightbox-content {
                    padding: 12px;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .cv-lightbox-img {
                    max-width: 400px;
                    max-height: 500px;
                    border: 1px solid #808080;
                    box-shadow: inset 1px 1px 0 #fff, 2px 2px 4px rgba(0,0,0,0.2);
                }

                .cv-name {
                    font-size: 14px;
                    font-weight: 700;
                    color: #2c2c2c;
                    text-align: center;
                    margin: 0;
                    line-height: 1.2;
                }

                .cv-title {
                    font-size: 10px;
                    color: #555;
                    text-align: center;
                    margin-top: -6px;
                }

                .cv-skills {
                    width: 100%;
                }

                .cv-skills-header {
                    font-size: 9px;
                    font-weight: 700;
                    color: #555;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                    padding-bottom: 4px;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                }

                .cv-skill {
                    margin-bottom: 8px;
                }

                .cv-skill-label {
                    display: flex;
                    justify-content: space-between;
                    font-size: 10px;
                    color: #333;
                    margin-bottom: 3px;
                }

                .cv-skill-bar {
                    height: 14px;
                    background: rgba(255,255,255,0.6);
                    border: 1px solid rgba(0,0,0,0.15);
                    border-radius: 2px;
                    overflow: hidden;
                    position: relative;
                }

                .cv-skill-fill {
                    height: 100%;
                    position: relative;
                    border-radius: 1px;
                }

                .cv-skill-fill.sk-blue {
                    background: linear-gradient(180deg, #6ab4f7 0%, #3d8be0 100%);
                }
                .cv-skill-fill.sk-pink {
                    background: linear-gradient(180deg, #f0829a 0%, #d85a78 100%);
                }
                .cv-skill-fill.sk-purple {
                    background: linear-gradient(180deg, #b088e0 0%, #8a5cc0 100%);
                }
                .cv-skill-fill.sk-teal {
                    background: linear-gradient(180deg, #60c8b8 0%, #3aa898 100%);
                }
                .cv-skill-fill.sk-orange {
                    background: linear-gradient(180deg, #f0a060 0%, #d88040 100%);
                }

                /* Skill bar animation */
                .cv-skill-fill {
                    transition: width 0.8s ease-out;
                }

                /* XP segmented look */
                .cv-skill-fill::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(0,0,0,0.1) 7px, rgba(0,0,0,0.1) 9px);
                }

                .cv-contact {
                    width: 100%;
                    margin-top: auto;
                    padding-top: 8px;
                    border-top: 1px solid rgba(0,0,0,0.1);
                }

                .cv-contact-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 10px;
                    color: #444;
                    padding: 2px 0;
                }

                .cv-contact-item span:first-child {
                    font-size: 11px;
                    width: 16px;
                    text-align: center;
                }

                .cv-contact-item a {
                    color: #2a5a8a;
                    text-decoration: none;
                }

                .cv-contact-item a:hover {
                    text-decoration: underline;
                }

                /* === RIGHT COLUMN === */
                .cv-right {
                    flex: 1;
                    padding: 12px 16px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    min-height: 0;
                }

                .cv-right::-webkit-scrollbar {
                    width: 8px;
                }
                .cv-right::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.05);
                }
                .cv-right::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.15);
                    border-radius: 4px;
                }
                .cv-right::-webkit-scrollbar-thumb:hover {
                    background: rgba(0,0,0,0.25);
                }

                .cv-file {
                    background: rgba(255,255,255,0.82);
                    border: 1px solid rgba(0,0,0,0.1);
                    border-radius: 4px;
                    overflow: hidden;
                    border-left: 4px solid #aaa;
                    flex-shrink: 0;
                    transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
                }

                .cv-file:hover {
                    transform: translateX(3px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
                    background: rgba(255,255,255,0.95);
                }

                .cv-file.accent-blue { border-left-color: #5a9ee0; }
                .cv-file.accent-blue:hover { border-left-color: #3080d0; }
                .cv-file.accent-pink { border-left-color: #e070a0; }
                .cv-file.accent-pink:hover { border-left-color: #d05080; }
                .cv-file.accent-green { border-left-color: #50b898; }
                .cv-file.accent-green:hover { border-left-color: #30a078; }
                .cv-file.accent-purple { border-left-color: #9070c8; }
                .cv-file.accent-purple:hover { border-left-color: #7050b0; }
                .cv-file.accent-orange { border-left-color: #e09050; }
                .cv-file.accent-orange:hover { border-left-color: #d07030; }
                .cv-file.accent-teal { border-left-color: #40b0c0; }
                .cv-file.accent-teal:hover { border-left-color: #2090a0; }

                .cv-file-header {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 5px 10px;
                    background: rgba(255,255,255,0.5);
                    border-bottom: 1px solid rgba(0,0,0,0.06);
                    font-size: 11px;
                    font-weight: 600;
                    color: #333;
                }

                .cv-file-icon {
                    font-size: 12px;
                }

                .cv-file-path {
                    font-family: 'Consolas', 'Courier New', monospace;
                    color: #0066cc;
                    font-size: 10px;
                    font-weight: 400;
                }

                .cv-file-body {
                    padding: 8px 10px;
                    font-size: 11px;
                    color: #2c2c2c;
                    line-height: 1.55;
                }

                .cv-file-body p {
                    margin: 0 0 4px 0;
                }

                .cv-file-body p:last-child {
                    margin-bottom: 0;
                }

                .cv-comment {
                    color: #888;
                    font-style: italic;
                    font-size: 10px;
                }

                .cv-key {
                    color: #2a5a8a;
                    font-weight: 600;
                }

                /* === STATUS BAR === */
                .cv-statusbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 4px 10px;
                    background: linear-gradient(180deg, #ece9d8 0%, #d6d2c2 100%);
                    border-top: 1px solid #fff;
                    font-size: 10px;
                    color: #444;
                    flex-shrink: 0;
                }

                .cv-status-left {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .cv-status-led {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #4caf50;
                    box-shadow: 0 0 3px rgba(76,175,80,0.5);
                }
            </style>

            <div class="cv-container">
                <!-- LEFT: Profile + Skills -->
                <div class="cv-left">
                    <div class="cv-left-label">Identity Card</div>
                    <img class="cv-avatar" src="assets/icons/zeynep-avatar.jpg" alt="Zeynep Erden" onclick="this.closest('.window-content').querySelector('.cv-lightbox').classList.add('active')">
                    <div class="cv-name">Zeynep Erden</div>
                    <div class="cv-title">Industrial Designer</div>

                    <div class="cv-skills">
                        <div class="cv-skills-header">Installed Skills</div>

                        <div class="cv-skill">
                            <div class="cv-skill-label"><span>Industrial Design</span><span>95%</span></div>
                            <div class="cv-skill-bar"><div class="cv-skill-fill sk-blue" style="width: 95%"></div></div>
                        </div>

                        <div class="cv-skill">
                            <div class="cv-skill-label"><span>3D Modeling</span><span>90%</span></div>
                            <div class="cv-skill-bar"><div class="cv-skill-fill sk-purple" style="width: 90%"></div></div>
                        </div>

                        <div class="cv-skill">
                            <div class="cv-skill-label"><span>Graphic Design</span><span>85%</span></div>
                            <div class="cv-skill-bar"><div class="cv-skill-fill sk-pink" style="width: 85%"></div></div>
                        </div>

                        <div class="cv-skill">
                            <div class="cv-skill-label"><span>Motion</span><span>85%</span></div>
                            <div class="cv-skill-bar"><div class="cv-skill-fill sk-orange" style="width: 85%"></div></div>
                        </div>

                        <div class="cv-skill">
                            <div class="cv-skill-label"><span>UI/UX</span><span>75%</span></div>
                            <div class="cv-skill-bar"><div class="cv-skill-fill sk-teal" style="width: 75%"></div></div>
                        </div>
                    </div>

                    <div class="cv-contact">
                        <div class="cv-contact-item"><span>📍</span> Istanbul, Turkey</div>
                        <div class="cv-contact-item"><span>🔗</span> <a href="https://www.linkedin.com/in/zeyneperden/" target="_blank">LinkedIn</a></div>
                        <div class="cv-contact-item"><span>🗣️</span> Turkish, English</div>
                    </div>
                </div>

                <!-- RIGHT: File sections -->
                <div class="cv-right">
                    <!-- experience.log -->
                    <div class="cv-file accent-blue">
                        <div class="cv-file-header">
                            <span class="cv-file-icon">💼</span>
                            <span class="cv-file-path">C:\\Zeynep\\experience.log</span>
                        </div>
                        <div class="cv-file-body">
                            <p class="cv-comment">// Professional experience (newest first)</p>
                            <p><span class="cv-key">CoTech</span> — UI/UX & Product Designer, Istanbul (2025 - Present)</p>
                            <p style="margin-left: 12px; color: #555;">Figma wireframes, mobile UI design, UI component development.</p>
                            <p><span class="cv-key">Chinese & Sushi Express</span> — Graphic Designer, Istanbul (2022)</p>
                            <p style="margin-left: 12px; color: #555;">BNS — Marketing visuals, menus & promotional materials.</p>
                            <p><span class="cv-key">SushiCo</span> — Graphic Designer & Social Media, Istanbul (Nov 2021)</p>
                            <p style="margin-left: 12px; color: #555;">BNS — Daily content, data-driven optimization, motion graphics.</p>
                            <p><span class="cv-key">ITU VAKFI</span> — Graphic Designer, Istanbul (2024, 2 months)</p>
                            <p><span class="cv-key">Animanya</span> — 3D Modeler, Ankara (2016 - 2017 Intern, 2018 Full-time)</p>
                            <p style="margin-left: 12px; color: #555;">Started as intern (2 internships), then hired full-time. 2D/3D animation assets, rendering.</p>
                        </div>
                    </div>

                    <!-- education.txt -->
                    <div class="cv-file accent-purple">
                        <div class="cv-file-header">
                            <span class="cv-file-icon">🎓</span>
                            <span class="cv-file-path">C:\\Zeynep\\education.txt</span>
                        </div>
                        <div class="cv-file-body">
                            <p><span class="cv-key">Beykent University</span> — Industrial Products Design, Licence · %100 Scholarship</p>
                            <p><span class="cv-key">Anadolu University</span> — Cooking, Associate Degree</p>
                        </div>
                    </div>

                    <!-- tools.ini -->
                    <div class="cv-file accent-pink">
                        <div class="cv-file-header">
                            <span class="cv-file-icon">🔧</span>
                            <span class="cv-file-path">C:\\Zeynep\\tools.ini</span>
                        </div>
                        <div class="cv-file-body">
                            <p class="cv-comment">; Primary design & modeling tools</p>
                            <p><span class="cv-key">3D_Modeling</span> = Rhino, Blender, 3ds Max</p>
                            <p><span class="cv-key">Rendering</span> = KeyShot</p>
                            <p><span class="cv-key">2D_Design</span> = Photoshop, Illustrator, Sketch, Canva</p>
                            <p><span class="cv-key">Motion</span> = After Effects</p>
                            <p><span class="cv-key">Illustration</span> = Procreate</p>
                            <p><span class="cv-key">Other</span> = Unity, AutoCAD</p>
                        </div>
                    </div>

                    <!-- awards.txt -->
                    <div class="cv-file accent-orange">
                        <div class="cv-file-header">
                            <span class="cv-file-icon">🏆</span>
                            <span class="cv-file-path">C:\\Zeynep\\awards.txt</span>
                        </div>
                        <div class="cv-file-body">
                            <p><span class="cv-key">(BSH) FRANCIS Frugal Innovation Challenge</span></p>
                            <p>Semi-final honorable mention — April 2023</p>
                        </div>
                    </div>

                    <!-- community.log -->
                    <div class="cv-file accent-green">
                        <div class="cv-file-header">
                            <span class="cv-file-icon">🤝</span>
                            <span class="cv-file-path">C:\\Zeynep\\community.log</span>
                        </div>
                        <div class="cv-file-body">
                            <p class="cv-comment">// Organizations & volunteering</p>
                            <p><span class="cv-key">AIESEC</span> — Team Leader, Global Volunteer - Germany</p>
                            <p><span class="cv-key">LOSEV</span> — Volunteer, Ankara</p>
                            <p><span class="cv-key">Sea Turtles Conservation</span> — Volunteer, Mersin</p>
                        </div>
                    </div>

                    <!-- certificates.txt -->
                    <div class="cv-file accent-teal">
                        <div class="cv-file-header">
                            <span class="cv-file-icon">📜</span>
                            <span class="cv-file-path">C:\\Zeynep\\certificates.txt</span>
                        </div>
                        <div class="cv-file-body">
                            <p><span class="cv-key">Google Game & App Academy</span> — Trainee (10 months)</p>
                            <p style="margin-left: 12px; color: #555;">Game Development, Project Management, Unity</p>
                            <p><span class="cv-key">Wireframe Training for UI/UX Designers</span> — Udemy</p>
                            <p><span class="cv-key">Practical Figma Training</span> — Userspots</p>
                            <p><span class="cv-key">UX Research Training</span> — Userspots</p>
                            <p><span class="cv-key">CMF Applications in Industrial Design</span> — Beykent University</p>
                            <p><span class="cv-key">Intellectual and Industrial Property Rights</span> — ETMK Istanbul</p>
                            <p><span class="cv-key">Project Management Fundamentals</span> — Coursera</p>
                            <p><span class="cv-key">Initiating the Project: Starting Successfully</span> — Coursera</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- XP-style Lightbox for Avatar -->
            <div class="cv-lightbox" onclick="if(event.target === this) this.classList.remove('active')">
                <div class="cv-lightbox-window">
                    <div class="cv-lightbox-titlebar">
                        <span class="cv-lightbox-title">📷 zeynep_erden.jpg - Windows Picture Viewer</span>
                        <button class="cv-lightbox-close" onclick="this.closest('.cv-lightbox').classList.remove('active')">×</button>
                    </div>
                    <div class="cv-lightbox-content">
                        <img class="cv-lightbox-img" src="assets/icons/zeynep-avatar.jpg" alt="Zeynep Erden">
                    </div>
                </div>
            </div>

            <!-- Status Bar -->
            <div class="cv-statusbar">
                <div class="cv-status-left">
                    <div class="cv-status-led"></div>
                    <span>Ready</span>
                </div>
                <span>Build: ZeynStudio v1.0</span>
            </div>
        </div>
    `
};

window.WindowTemplates = WindowTemplates;
