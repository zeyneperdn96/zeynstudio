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

    // About.txt - About window
    about: () => `
        <div class="window-titlebar">
            <span class="window-title">📄 About.txt - Notepad</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.6;">
            <h2 style="font-family: Tahoma, sans-serif;">About Zeyn</h2>
            <p><strong>Name:</strong> ${window.CONFIG.personal.name}</p>
            <p><strong>Title:</strong> ${window.CONFIG.personal.title}</p>
            <p><strong>Studio:</strong> ${window.CONFIG.personal.studio}</p>
            <br>
            <p>${window.CONFIG.personal.bio}</p>
            <br>
            <h3 style="font-family: Tahoma, sans-serif;">Skills</h3>
            <ul>
                <li>UI/UX Design & Prototyping</li>
                <li>Digital Illustration</li>
                <li>Industrial Design & 3D Modeling</li>
                <li>Creative Direction</li>
            </ul>
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

    // Showreel.mp4 - Media Player
    showreel: () => `
        <div class="window-titlebar">
            <span class="window-title">🎬 Showreel.mp4 - Media Player</span>
            <div class="window-controls">
                <button class="win-btn win-minimize" data-action="minimize">_</button>
                <button class="win-btn win-maximize" data-action="maximize">□</button>
                <button class="win-btn win-close" data-action="close">×</button>
            </div>
        </div>
        <div class="window-content" style="text-align: center;">
            <div style="background: #000; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 48px;">
                ▶️
            </div>
            <p style="margin-top: 12px; color: #666;">Showreel placeholder - Add your video here</p>
            <div style="margin-top: 16px; display: flex; gap: 8px; justify-content: center;">
                <button class="btn btn-primary btn-sm">▶️ Play</button>
                <button class="btn btn-secondary btn-sm">⏸️ Pause</button>
                <button class="btn btn-secondary btn-sm">⏹️ Stop</button>
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
    `
};

window.WindowTemplates = WindowTemplates;
