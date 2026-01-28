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
                <button class="btn btn-sm btn-secondary" data-filter="illustration">Illustration</button>
                <button class="btn btn-sm btn-secondary" data-filter="industrial">Industrial Design</button>
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
            <iframe src="trading-cards.html" style="width: 100%; border: none; flex: 1;"></iframe>
        </div>
    `,

    // Mail.exe - Contact form
    contact: () => `
        <div class="window-titlebar">
            <span class="window-title">📧 Mail.exe - New Message</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content">
            <form id="contact-form" style="max-width: 400px;">
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" class="form-control" id="contact-name" required>
                </div>
                <div class="form-group" style="margin-top: 12px;">
                    <label>Email:</label>
                    <input type="email" class="form-control" id="contact-email" required>
                </div>
                <div class="form-group" style="margin-top: 12px;">
                    <label>Message:</label>
                    <textarea class="form-control" id="contact-message" rows="6" required></textarea>
                </div>
                <div style="margin-top: 16px; display: flex; gap: 8px;">
                    <button type="submit" class="btn btn-primary">Send Message</button>
                    <button type="reset" class="btn btn-secondary">Clear</button>
                </div>
            </form>
        </div>
    `,

    // Illustration.exe
    illustration: () => `
        <div class="window-titlebar">
            <span class="window-title">🎨 Illustration.exe - Gallery</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content">
            <h3>Illustration Gallery</h3>
            <p>A collection of digital art, character designs, and visual storytelling.</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; margin-top: 16px;">
                ${[1, 2, 3, 4, 5, 6].map(i => `
                    <div style="aspect-ratio: 1; background: linear-gradient(135deg, #${Math.floor(Math.random() * 16777215).toString(16)} 0%, #${Math.floor(Math.random() * 16777215).toString(16)} 100%); border: 2px solid #808080;"></div>
                `).join('')}
            </div>
        </div>
    `,

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

    // Media Player - Audio with Playlist
    showreel: () => `
        <div class="window-titlebar">
            <span class="window-title">🎵 Media Player</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content media-player-content" style="padding: 0; display: flex; flex-direction: column; background: #000;">
            <!-- Visualization Area -->
            <div class="mp-visual" style="background: linear-gradient(180deg, #0a0a2e 0%, #1a0a3e 100%); height: 120px; display: flex; align-items: center; justify-content: center; border-bottom: 2px solid #333;">
                <div class="mp-now-playing" style="color: #0f0; font-family: 'Courier New', monospace; font-size: 13px; text-align: center; padding: 8px;">
                    <div class="mp-track-name">No track loaded</div>
                </div>
            </div>
            <!-- Progress Bar -->
            <div class="mp-progress-wrapper" style="padding: 6px 10px; background: #1a1a1a;">
                <div class="mp-progress-bar" style="width: 100%; height: 8px; background: #333; border-radius: 4px; cursor: pointer; position: relative;">
                    <div class="mp-progress-fill" style="width: 0%; height: 100%; background: linear-gradient(90deg, #4a9eff, #00d4ff); border-radius: 4px; transition: width 0.1s;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 3px;">
                    <span class="mp-time-current" style="color: #888; font-size: 10px;">0:00</span>
                    <span class="mp-time-total" style="color: #888; font-size: 10px;">0:00</span>
                </div>
            </div>
            <!-- Controls -->
            <div class="mp-controls" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 8px; background: #2d2d2d; border-bottom: 1px solid #444;">
                <button class="mp-btn mp-prev" title="Previous" style="background: none; border: none; color: #ccc; font-size: 16px; cursor: pointer; padding: 4px 8px;">⏮</button>
                <button class="mp-btn mp-play" title="Play" style="background: none; border: none; color: #fff; font-size: 22px; cursor: pointer; padding: 4px 10px;">▶</button>
                <button class="mp-btn mp-next" title="Next" style="background: none; border: none; color: #ccc; font-size: 16px; cursor: pointer; padding: 4px 8px;">⏭</button>
                <div style="margin-left: 16px; display: flex; align-items: center; gap: 4px;">
                    <span style="color: #888; font-size: 12px;">🔊</span>
                    <input type="range" class="mp-volume" min="0" max="100" value="80" style="width: 60px; cursor: pointer;">
                </div>
            </div>
            <!-- Playlist -->
            <div class="mp-playlist" style="flex: 1; overflow-y: auto; background: #1e1e2e; max-height: 180px;">
                ${(window.CONFIG.playlist || []).map((track, i) => `
                    <div class="mp-track" data-index="${i}" style="padding: 6px 12px; color: #ccc; font-size: 11px; cursor: pointer; border-bottom: 1px solid #2a2a3a; display: flex; align-items: center; gap: 8px;">
                        <span style="color: #666; font-size: 10px; width: 18px;">${i + 1}.</span>
                        <span class="mp-track-title">${track.title}</span>
                    </div>
                `).join('')}
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
                        <img src="assets/projects/metbic/hero.png" alt="Hero">
                    </div>
                    <div class="metbic-thumb" data-img="assets/projects/metbic/render1.png" data-index="1">
                        <img src="assets/projects/metbic/render1.png" alt="Render 1">
                    </div>
                    <div class="metbic-thumb" data-img="assets/projects/metbic/render2.png" data-index="2">
                        <img src="assets/projects/metbic/render2.png" alt="Render 2">
                    </div>
                    <div class="metbic-thumb" data-img="assets/projects/metbic/render3.png" data-index="3">
                        <img src="assets/projects/metbic/render3.png" alt="Render 3">
                    </div>
                    <div class="metbic-thumb" data-img="assets/projects/metbic/render4.png" data-index="4">
                        <img src="assets/projects/metbic/render4.png" alt="Render 4">
                    </div>
                    <div class="metbic-thumb" data-img="assets/projects/metbic/render5.png" data-index="5">
                        <img src="assets/projects/metbic/render5.png" alt="Render 5">
                    </div>
                    <div class="metbic-thumb" data-img="assets/projects/metbic/context.png" data-index="6">
                        <img src="assets/projects/metbic/context.png" alt="Context">
                    </div>
                    <div class="metbic-thumb" data-img="assets/projects/metbic/technical.png" data-index="7">
                        <img src="assets/projects/metbic/technical.png" alt="Technical">
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
                    <div class="firebox-thumb active" data-img="assets/projects/firebox/hero.png" data-index="0">
                        <img src="assets/projects/firebox/hero.png" alt="Hero">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/technical.png" data-index="1">
                        <img src="assets/projects/firebox/technical.png" alt="Technical">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/exploded.png" data-index="2">
                        <img src="assets/projects/firebox/exploded.png" alt="Exploded">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/exploded-fire.png" data-index="3">
                        <img src="assets/projects/firebox/exploded-fire.png" alt="Exploded Fire">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/details.png" data-index="4">
                        <img src="assets/projects/firebox/details.png" alt="Details">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/inuse.png" data-index="5">
                        <img src="assets/projects/firebox/inuse.png" alt="In Use">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/context.png" data-index="6">
                        <img src="assets/projects/firebox/context.png" alt="Context">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/carrying.png" data-index="7">
                        <img src="assets/projects/firebox/carrying.png" alt="Carrying">
                    </div>
                    <div class="firebox-thumb" data-img="assets/projects/firebox/product.png" data-index="8">
                        <img src="assets/projects/firebox/product.png" alt="Product">
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
                            <img src="assets/projects/firebox/hero.png" alt="FIREBOX" id="firebox-preview-img">
                            <button class="firebox-arrow firebox-arrow-right" id="firebox-next" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.9); border: 1px solid #ccc; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: all 0.15s;">❯</button>
                            <div class="firebox-counter" style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 11px;">1 / 9</div>
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

    // Zeyn Chat - MSN Messenger Style Chatbot
    zeynshat: () => `
        <div class="window-titlebar">
            <img src="assets/icons/zeyn-chat-logo.png" alt="Zeyn Chat" style="height: 16px; margin-right: 6px;">
            <span class="window-title">Zeyn Chat</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; overflow: hidden; flex: 1; display: flex;">
            <iframe src="msn-chatbot.html" style="width: 100%; height: 100%; border: none; flex: 1;"></iframe>
        </div>
    `
};

window.WindowTemplates = WindowTemplates;
