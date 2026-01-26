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
                .metbic-sidebar { width: 160px; background: linear-gradient(180deg, #f0f0f0 0%, #d4d4d4 100%); border-right: 1px solid #808080; display: flex; flex-direction: column; }
                .metbic-sidebar-header { padding: 8px 10px; background: linear-gradient(180deg, #4a7eba 0%, #3d6a9e 100%); color: #fff; font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #2d5a8a; }
                .metbic-module { padding: 8px 10px; cursor: pointer; border-bottom: 1px solid #c0c0c0; display: flex; align-items: center; gap: 8px; transition: background 0.1s; }
                .metbic-module:hover { background: #e8f4fc; }
                .metbic-module.active { background: #cce8ff; border-left: 3px solid #0078d4; }
                .metbic-module-icon { width: 16px; height: 16px; background: #808080; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-size: 10px; }
                .metbic-module-name { font-size: 11px; color: #333; }
                .metbic-main { flex: 1; display: flex; flex-direction: column; background: #fff; min-width: 0; }
                .metbic-toolbar { padding: 6px 10px; background: linear-gradient(180deg, #fafafa 0%, #e8e8e8 100%); border-bottom: 1px solid #a0a0a0; display: flex; gap: 6px; flex-wrap: wrap; }
                .metbic-btn { padding: 4px 10px; background: linear-gradient(180deg, #fff 0%, #e8e8e8 100%); border: 1px solid #808080; border-radius: 3px; font-size: 10px; cursor: pointer; display: flex; align-items: center; gap: 4px; }
                .metbic-btn:hover { background: linear-gradient(180deg, #e8f4fc 0%, #cce8ff 100%); }
                .metbic-btn:active { background: linear-gradient(180deg, #cce8ff 0%, #a8d8ff 100%); }
                .metbic-content { flex: 1; display: flex; padding: 12px; gap: 12px; overflow: hidden; }
                .metbic-preview { flex: 1; background: #1a1a2e; border: 2px inset #808080; border-radius: 4px; display: flex; align-items: center; justify-content: center; min-width: 0; }
                .metbic-preview img { max-width: 100%; max-height: 100%; object-fit: contain; }
                .metbic-info { width: 200px; display: flex; flex-direction: column; gap: 10px; }
                .metbic-info-box { background: #f5f5f5; border: 1px solid #c0c0c0; border-radius: 3px; padding: 12px; }
                .metbic-info-title { font-size: 10px; font-weight: bold; color: #0066cc; margin-bottom: 8px; text-transform: uppercase; }
                .metbic-info-text { font-size: 11px; color: #333; line-height: 1.6; }
                .metbic-statusbar { padding: 4px 10px; background: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%); border-top: 1px solid #a0a0a0; display: flex; justify-content: space-between; font-size: 10px; color: #444; }
                .metbic-status-item { display: flex; align-items: center; gap: 4px; }
                .metbic-status-led { width: 8px; height: 8px; border-radius: 50%; background: #00cc00; box-shadow: 0 0 4px #00cc00; }
            </style>

            <div class="metbic-container">
                <!-- Left Sidebar -->
                <div class="metbic-sidebar">
                    <div class="metbic-sidebar-header">🔧 Tool Modules</div>
                    <div class="metbic-module active" data-module="tire-lever">
                        <div class="metbic-module-icon">🔩</div>
                        <span class="metbic-module-name">Tire Lever</span>
                    </div>
                    <div class="metbic-module" data-module="hex-nut">
                        <div class="metbic-module-icon">⚙️</div>
                        <span class="metbic-module-name">Hex Nut Set</span>
                    </div>
                    <div class="metbic-module" data-module="wheel-align">
                        <div class="metbic-module-icon">🎯</div>
                        <span class="metbic-module-name">Wheel Alignment</span>
                    </div>
                    <div class="metbic-module" data-module="file">
                        <div class="metbic-module-icon">📐</div>
                        <span class="metbic-module-name">Double-Sided File</span>
                    </div>
                    <div class="metbic-module" data-module="screwdriver">
                        <div class="metbic-module-icon">🪛</div>
                        <span class="metbic-module-name">Screwdriver Bits</span>
                    </div>
                    <div class="metbic-module" data-module="storage">
                        <div class="metbic-module-icon">📦</div>
                        <span class="metbic-module-name">Storage Unit</span>
                    </div>
                    <div style="flex: 1;"></div>
                    <div style="padding: 10px; border-top: 1px solid #c0c0c0; background: #e8e8e8;">
                        <div style="font-size: 9px; color: #666; text-align: center;">
                            METBIC v1.0<br>
                            Offline Repair OS
                        </div>
                    </div>
                </div>

                <!-- Main Area -->
                <div class="metbic-main">
                    <!-- Toolbar -->
                    <div class="metbic-toolbar">
                        <button class="metbic-btn" data-action="toolkit">📂 OPEN TOOLKIT</button>
                        <button class="metbic-btn" data-action="repair">🔧 REPAIR MODE</button>
                        <button class="metbic-btn" data-action="load">📥 LOAD MODULES</button>
                        <button class="metbic-btn" data-action="recovery">💾 RECOVERY</button>
                    </div>

                    <!-- Content Area -->
                    <div class="metbic-content">
                        <!-- Preview -->
                        <div class="metbic-preview">
                            <img src="assets/projects/metbic/hero.png" alt="METBIC" id="metbic-preview-img">
                        </div>

                        <!-- Info Panel -->
                        <div class="metbic-info">
                            <div class="metbic-info-box">
                                <div class="metbic-info-title">📋 Module Info</div>
                                <div class="metbic-info-text" id="metbic-module-info">
                                    <strong>Tire Lever</strong><br>
                                    Specialized lever for quick tire removal. Ergonomic grip design.
                                </div>
                            </div>

                            <div class="metbic-info-box">
                                <div class="metbic-info-title">📐 Specifications</div>
                                <div class="metbic-info-text">
                                    <strong>Size:</strong> 90×60×30mm<br>
                                    <strong>Material:</strong> Polymer + Metal<br>
                                    <strong>Weight:</strong> 145g
                                </div>
                            </div>

                            <div class="metbic-info-box" style="flex: 1;">
                                <div class="metbic-info-title">🔧 Features</div>
                                <div class="metbic-info-text">
                                    • Modular design<br>
                                    • Magnetic screwdriver<br>
                                    • Waterproof storage<br>
                                    • Pocket-sized
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Status Bar -->
                    <div class="metbic-statusbar">
                        <div class="metbic-status-item">
                            <div class="metbic-status-led"></div>
                            <span>System Ready</span>
                        </div>
                        <div class="metbic-status-item">
                            <span>No internet. No service. No problem.</span>
                        </div>
                        <div class="metbic-status-item">
                            <span>6 Modules Loaded</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};

window.WindowTemplates = WindowTemplates;
