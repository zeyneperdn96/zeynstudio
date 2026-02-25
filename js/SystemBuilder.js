/* ========================================
   SYSTEM BUILDER
   Design methodology as modular architecture
   ======================================== */

class SystemBuilder {
    constructor(windowEl, windowManager) {
        this.windowEl = windowEl;
        this.wm = windowManager;
        this.slots = [null, null];
        this.discoveredProjects = new Set();
        this.dragClone = null;
        this.dragBrickId = null;
        this.isMobile = window.matchMedia('(max-width: 768px)').matches;
        this.selectedBrick = null;

        this.BRICKS = [
            { id: 'research',       label: 'Research',        desc: 'User studies, market analysis, contextual inquiry' },
            { id: 'form',           label: 'Form',            desc: 'Geometry, ergonomics, material expression' },
            { id: 'function',       label: 'Function',        desc: 'Mechanism, usability, engineering logic' },
            { id: 'ux',             label: 'UX',              desc: 'Flows, interfaces, human-centered mapping' },
            { id: '3d',             label: '3D Modeling',      desc: 'Rhino, KeyShot, digital prototyping' },
            { id: 'ai',             label: 'AI Integration',   desc: 'Intelligent systems, adaptive behavior' },
            { id: 'sustainability', label: 'Sustainability',   desc: 'Circular design, material innovation' },
            { id: 'systems',        label: 'Systems Thinking', desc: 'Holistic frameworks, interconnected logic' }
        ];

        this.COMBINATIONS = [
            { a: 'research',       b: 'systems',        project: 'MarineSentry',  windowId: 'marinesentry',
              tagline: 'Decision-Support Underwater Drone', category: 'Industrial Design' },
            { a: 'form',           b: 'function',       project: 'METBIC',        windowId: 'metbic',
              tagline: 'Compact Modular Bicycle Repair Kit', category: 'Industrial Design' },
            { a: 'form',           b: '3d',             project: 'FIREBOX',       windowId: 'firebox',
              tagline: 'Portable Camp & Cooking Station', category: 'Industrial Design' },
            { a: 'sustainability', b: 'systems',        project: 'CoffeeForm',    windowId: 'coffeeform',
              tagline: 'Sustainable Laptop Stand from Coffee Waste', category: 'Industrial Design' },
            { a: 'function',       b: 'ux',             project: 'FuncArt',       windowId: 'funcart',
              tagline: 'Modular Ceramic Studio System', category: 'Industrial Design' },
            { a: 'ai',             b: 'research',       project: 'GUSTO',         windowId: 'gusto',
              tagline: 'Personal Air Management Device', category: 'Industrial Design' },
            { a: 'ux',             b: 'ai',             project: 'Moodie',        windowId: null, link: 'moodie-case-study.html',
              tagline: 'Mobile Wellness & Mood Tracking App', category: 'UI/UX Design' },
            { a: 'ux',             b: 'systems',        project: 'Pockety',       windowId: null, link: 'pockety-case-study.html',
              tagline: 'Smart Budget Companion App', category: 'UI/UX Design' }
        ];

        this._onPointerMove = this._handlePointerMove.bind(this);
        this._onPointerUp   = this._handlePointerUp.bind(this);

        this.initialize();
    }

    /* ── Init ────────────────────────────── */

    initialize() {
        this.paletteEl    = this.windowEl.querySelector('.sb-module-grid');
        this.slotEls      = this.windowEl.querySelectorAll('.sb-slot');
        this.svgEl        = this.windowEl.querySelector('.sb-connector-svg');
        this.outputPanel  = this.windowEl.querySelector('.sb-output');
        this.counterEl    = this.windowEl.querySelector('.sb-counter-value');
        this.progressEl   = this.windowEl.querySelector('.sb-progress-fill');
        this.quoteEl      = this.windowEl.querySelector('.sb-quote');
        this.hintEl       = this.windowEl.querySelector('.sb-assembly-hint');

        this._renderPalette();
        this._bindSlots();
        this._bindClear();
        this._updateCounter();
        this._animateEntrance();
    }

    _animateEntrance() {
        const modules = this.paletteEl.querySelectorAll('.sb-module');
        modules.forEach((m, i) => {
            m.style.opacity = '0';
            m.style.transform = 'translateY(8px)';
            setTimeout(() => {
                m.style.transition = 'opacity .3s ease, transform .3s ease';
                m.style.opacity = '1';
                m.style.transform = 'translateY(0)';
            }, 60 * i);
        });
    }

    /* ── Valid Partners ──────────────────── */

    _getValidPartners(brickId) {
        const partners = new Set();
        this.COMBINATIONS.forEach(c => {
            if (c.a === brickId) partners.add(c.b);
            if (c.b === brickId) partners.add(c.a);
        });
        return partners;
    }

    _updatePaletteAvailability() {
        const firstSlot = this.slots[0];
        const secondSlot = this.slots[1];

        this.paletteEl.querySelectorAll('.sb-module').forEach(el => {
            const id = el.dataset.brickId;
            el.classList.remove('sb-used', 'sb-locked');

            // Already placed in a slot
            if (id === firstSlot || id === secondSlot) {
                el.classList.add('sb-used');
                return;
            }

            // If one slot is filled, lock modules that don't pair with it
            if (firstSlot && !secondSlot) {
                const valid = this._getValidPartners(firstSlot);
                if (!valid.has(id)) {
                    el.classList.add('sb-locked');
                }
            } else if (secondSlot && !firstSlot) {
                const valid = this._getValidPartners(secondSlot);
                if (!valid.has(id)) {
                    el.classList.add('sb-locked');
                }
            }
            // If both slots empty or both filled: everything available (except placed ones)
        });
    }

    /* ── Palette ─────────────────────────── */

    _renderPalette() {
        this.paletteEl.innerHTML = this.BRICKS.map(b => `
            <div class="sb-module" data-brick-id="${b.id}" title="${b.desc}">
                <div class="sb-module-bar"></div>
                <div class="sb-module-body">
                    <span class="sb-module-label">${b.label}</span>
                </div>
            </div>
        `).join('');

        this.paletteEl.querySelectorAll('.sb-module').forEach(el => {
            if (this.isMobile) {
                el.addEventListener('click', () => this._mobileTapSelect(el));
            } else {
                el.addEventListener('pointerdown', (e) => this._startDrag(e, el));
            }
        });
    }

    /* ── Assembly Slots ──────────────────── */

    _bindSlots() {
        this.slotEls.forEach((slot, i) => {
            if (this.isMobile) {
                slot.addEventListener('click', () => this._mobileTapPlace(i));
            }
            slot.addEventListener('dblclick', () => this._clearSlot(i));
        });
    }

    _clearSlot(index) {
        if (!this.slots[index]) return;
        const el = this.slotEls[index];
        el.classList.add('sb-slot-exit');
        setTimeout(() => {
            this.slots[index] = null;
            el.classList.remove('sb-slot-exit', 'sb-slot-filled', 'sb-slot-valid');
            el.innerHTML = this._slotPlaceholder(index);
            this._updatePaletteAvailability();
            this._updateConnector();
            this._clearOutput();
            this._updateCounter();
            this._showHint(this.slots[0] || this.slots[1] ? 'Now add a second module.' : 'Select a module to begin.');
        }, 200);
    }

    _fillSlot(index, brickId) {
        if (this.slots[index] === brickId) return;
        this.slots[index] = brickId;

        const brick = this.BRICKS.find(b => b.id === brickId);
        const el = this.slotEls[index];
        el.classList.remove('sb-slot-valid', 'sb-slot-exit');
        el.classList.add('sb-slot-filled');
        el.innerHTML = `
            <div class="sb-slot-content sb-slot-enter">
                <div class="sb-slot-bar"></div>
                <span class="sb-slot-label">${brick.label}</span>
                <span class="sb-slot-remove" data-slot="${index}">&times;</span>
            </div>
        `;
        el.querySelector('.sb-slot-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            this._clearSlot(index);
        });

        this._updatePaletteAvailability();

        // Both slots filled → always a valid combo now
        if (this.slots[0] && this.slots[1]) {
            this._evaluate();
        } else {
            this._showHint('Now add a second module.');
            this._updateConnector();
        }
    }

    _slotPlaceholder(index) {
        const labels = ['Module A', 'Module B'];
        return `<span class="sb-slot-placeholder">${labels[index]}</span>`;
    }

    /* ── Drag (Desktop) ──────────────────── */

    _startDrag(e, sourceEl) {
        e.preventDefault();
        const brickId = sourceEl.dataset.brickId;
        if (sourceEl.classList.contains('sb-used') || sourceEl.classList.contains('sb-locked')) return;
        const brick = this.BRICKS.find(b => b.id === brickId);
        if (!brick) return;

        this.dragBrickId = brickId;
        this.dragClone = document.createElement('div');
        this.dragClone.className = 'sb-drag-ghost';
        this.dragClone.textContent = brick.label;
        document.body.appendChild(this.dragClone);
        this._positionClone(e.clientX, e.clientY);

        this.slotEls.forEach(s => s.classList.add('sb-slot-hover-ready'));

        document.addEventListener('pointermove', this._onPointerMove);
        document.addEventListener('pointerup', this._onPointerUp);
    }

    _handlePointerMove(e) {
        if (!this.dragClone) return;
        this._positionClone(e.clientX, e.clientY);
    }

    _handlePointerUp(e) {
        document.removeEventListener('pointermove', this._onPointerMove);
        document.removeEventListener('pointerup', this._onPointerUp);
        this.slotEls.forEach(s => s.classList.remove('sb-slot-hover-ready'));

        if (!this.dragClone || !this.dragBrickId) { this._cleanupDrag(); return; }

        let placed = false;
        this.slotEls.forEach((slot, i) => {
            const r = slot.getBoundingClientRect();
            if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
                this._fillSlot(i, this.dragBrickId);
                placed = true;
            }
        });

        if (!placed) {
            const assemblyArea = this.windowEl.querySelector('.sb-assembly');
            if (assemblyArea) {
                const r = assemblyArea.getBoundingClientRect();
                if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
                    const emptyIdx = this.slots[0] === null ? 0 : this.slots[1] === null ? 1 : -1;
                    if (emptyIdx >= 0) this._fillSlot(emptyIdx, this.dragBrickId);
                }
            }
        }

        this._cleanupDrag();
    }

    _positionClone(x, y) {
        if (!this.dragClone) return;
        this.dragClone.style.left = (x + 12) + 'px';
        this.dragClone.style.top  = (y - 14) + 'px';
    }

    _cleanupDrag() {
        if (this.dragClone) { this.dragClone.remove(); this.dragClone = null; }
        this.dragBrickId = null;
    }

    /* ── Tap (Mobile) ────────────────────── */

    _mobileTapSelect(sourceEl) {
        const brickId = sourceEl.dataset.brickId;
        if (sourceEl.classList.contains('sb-used') || sourceEl.classList.contains('sb-locked')) return;

        if (this.selectedBrick === brickId) {
            this.selectedBrick = null;
            this.paletteEl.querySelectorAll('.sb-module').forEach(m => m.classList.remove('sb-selected'));
            return;
        }

        this.paletteEl.querySelectorAll('.sb-module').forEach(m => m.classList.remove('sb-selected'));
        sourceEl.classList.add('sb-selected');
        this.selectedBrick = brickId;

        // Auto-place into first empty slot
        const emptyIdx = this.slots[0] === null ? 0 : this.slots[1] === null ? 1 : -1;
        if (emptyIdx >= 0) {
            this._fillSlot(emptyIdx, brickId);
            this.selectedBrick = null;
            this.paletteEl.querySelectorAll('.sb-module').forEach(m => m.classList.remove('sb-selected'));
        }
    }

    _mobileTapPlace(slotIndex) {
        if (!this.selectedBrick) return;
        this._fillSlot(slotIndex, this.selectedBrick);
        this.selectedBrick = null;
        this.paletteEl.querySelectorAll('.sb-module').forEach(m => m.classList.remove('sb-selected'));
    }

    /* ── SVG Connector ───────────────────── */

    _updateConnector() {
        if (!this.svgEl) return;
        this.svgEl.innerHTML = '';
        if (!this.slots[0] || !this.slots[1]) return;

        const s0 = this.slotEls[0].getBoundingClientRect();
        const s1 = this.slotEls[1].getBoundingClientRect();
        const svg = this.svgEl.getBoundingClientRect();

        const x1 = s0.right - svg.left;
        const y1 = s0.top + s0.height / 2 - svg.top;
        const x2 = s1.left - svg.left;
        const y2 = s1.top + s1.height / 2 - svg.top;

        const mx = (x1 + x2) / 2;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`);
        path.setAttribute('class', 'sb-conn-valid');
        this.svgEl.appendChild(path);

        // Animated dot
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '3');
        circle.setAttribute('class', 'sb-conn-dot');
        const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        anim.setAttribute('dur', '1.5s');
        anim.setAttribute('repeatCount', 'indefinite');
        anim.setAttribute('path', `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`);
        circle.appendChild(anim);
        this.svgEl.appendChild(circle);
    }

    /* ── Evaluation (always valid now) ──── */

    _findCombo(a, b) {
        return this.COMBINATIONS.find(c =>
            (c.a === a && c.b === b) || (c.a === b && c.b === a)
        );
    }

    _evaluate() {
        const combo = this._findCombo(this.slots[0], this.slots[1]);
        this._updateConnector();

        // Always valid because palette filtering prevents mismatches
        if (combo) {
            this.discoveredProjects.add(combo.project);
            this.slotEls.forEach(s => s.classList.add('sb-slot-valid'));
            this._showOutput(combo);
            this._showHint('System resolved. Open the case study below.');
        }
        this._updateCounter();
    }

    /* ── Output Panel ────────────────────── */

    _showOutput(combo) {
        if (!this.outputPanel) return;
        const isExt = !combo.windowId;
        this.outputPanel.innerHTML = `
            <div class="sb-output-card sb-output-enter">
                <div class="sb-output-tag">${combo.category}</div>
                <div class="sb-output-name">${combo.project}</div>
                <div class="sb-output-desc">${combo.tagline}</div>
                <button class="sb-output-btn" data-wid="${combo.windowId || ''}" data-link="${combo.link || ''}">
                    ${isExt ? 'View Case Study \u2192' : 'Open Project \u2192'}
                </button>
            </div>
        `;
        this.outputPanel.querySelector('.sb-output-btn').addEventListener('click', () => {
            if (isExt && combo.link) window.open(combo.link, '_blank');
            else if (combo.windowId && this.wm) this.wm.openWindow(combo.windowId);
        });
    }

    _clearOutput() {
        if (!this.outputPanel) return;
        this.outputPanel.innerHTML = `
            <div class="sb-output-empty">
                <div class="sb-output-empty-label">Output</div>
                <div class="sb-output-empty-hint">Pair two modules to reveal a project.</div>
            </div>
        `;
    }

    /* ── Status ───────────────────────────── */

    _updateCounter() {
        const count = this.discoveredProjects.size;
        const total = this.COMBINATIONS.length;
        if (this.counterEl) this.counterEl.textContent = `${count}/${total}`;
        if (this.progressEl) this.progressEl.style.width = Math.round((count / total) * 100) + '%';

        const quotes = [
            '"I don\'t just design objects \u2014 I design the logic behind them."',
            '"Every product is a system waiting to be understood."',
            '"Constraints are the raw material of innovation."',
            '"Good design disappears. Great systems endure."',
            '"Form follows research. Function follows empathy."',
            '"Sustainability is architecture, not decoration."',
            '"The best interface is the one you never notice."',
            '"Modularity isn\'t a method \u2014 it\'s a mindset."'
        ];
        if (this.quoteEl) this.quoteEl.textContent = quotes[count % quotes.length];
    }

    _showHint(text) {
        if (!this.hintEl) return;
        this.hintEl.textContent = text;
    }

    /* ── Reset / Destroy ─────────────────── */

    reset() {
        this.slots = [null, null];
        this.slotEls.forEach((el, i) => {
            el.classList.remove('sb-slot-filled', 'sb-slot-valid', 'sb-slot-exit');
            el.innerHTML = this._slotPlaceholder(i);
        });
        this.paletteEl.querySelectorAll('.sb-module').forEach(m => m.classList.remove('sb-used', 'sb-selected', 'sb-locked'));
        if (this.svgEl) this.svgEl.innerHTML = '';
        this._clearOutput();
        this._updateCounter();
        this._showHint('Select a module to begin.');
    }

    destroy() {
        document.removeEventListener('pointermove', this._onPointerMove);
        document.removeEventListener('pointerup', this._onPointerUp);
        this._cleanupDrag();
    }
}

window.SystemBuilder = SystemBuilder;
