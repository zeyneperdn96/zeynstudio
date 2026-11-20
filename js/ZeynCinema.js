/* ========================================
   ZEYN CINEMA
   Film viewer window: WMP9-style HTML5 player, category tabs,
   film cards, pixel-art decorations and the Movie Maker-style
   "Explore the Process" window.
   Data: js/CinemaData.js · Sprites: js/CinemaPixelArt.js
   Styles: css/zeyn-cinema.css
   ======================================== */

(function () {
    'use strict';

    const esc = (s) => String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    const fmtTime = (sec) => {
        if (!isFinite(sec) || sec < 0) sec = 0;
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${String(s).padStart(2, '0')}`;
    };

    const reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll ONLY `box` so that `el` sits near its top. (Element.scrollIntoView
    // also scrolls every ancestor — the .window and the desktop — which pushed
    // the window's title bar and close button off screen.)
    const scrollWithin = (box, el, gap = 8) => {
        if (!box || !el) return;
        const top = box.scrollTop + el.getBoundingClientRect().top - box.getBoundingClientRect().top - gap;
        box.scrollTo({ top: Math.max(0, top), behavior: reducedMotion() ? 'auto' : 'smooth' });
    };
    const px = (name, scale, cls) => {
        const art = window.CinemaPixelArt;
        if (!art) return '';
        return art.svg(name, { className: cls })
            .replace(/width="(\d+)" height="(\d+)"/, (m, w, h) => `width="${w * scale}" height="${h * scale}"`);
    };

    const ICONS = {
        play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>',
        pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor"/></svg>',
        stop: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5h9v9h-9z" fill="currentColor"/></svg>',
        prev: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3h2v10H3zM13 3v10L6 8z" fill="currentColor"/></svg>',
        next: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11 3h2v10h-2zM3 3v10l7-5z" fill="currentColor"/></svg>',
        vol: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor"/><path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.6 3.8a6 6 0 0 1 0 8.4" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>',
        mute: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor"/><path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" stroke-width="1.4"/></svg>',
        full: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>'
    };

    class ZeynCinema {
        constructor(root, data, windowManager) {
            this.root = root;
            this.data = data;
            this.wm = windowManager;
            this.category = 'all';
            this.film = null;
            this.mode = 'film';           // 'film' | 'showreel'
            this.seeking = false;
            this._listeners = [];
            this._timers = [];

            this.render();
            this.bind();
            const first = data.films.find(f => f.featured) || data.films[0];
            if (first) this.selectFilm(first.id, { play: false, quiet: true });
            this.renderCards();
        }

        // ------------------------------------------------------------ render
        render() {
            const d = this.data;
            const counts = {};
            d.films.forEach(f => { counts[f.category] = (counts[f.category] || 0) + 1; });
            const tabs = d.categories.map(c => {
                const n = c.id === 'all' ? d.films.length : (counts[c.id] || 0);
                return `<button type="button" class="zc-tab${c.id === 'all' ? ' is-active' : ''}" role="tab" aria-selected="${c.id === 'all'}" data-cat="${esc(c.id)}">${esc(c.label)} <span class="zc-tab-n">${n}</span></button>`;
            }).join('');

            const viewItems = d.categories.map(c => `<button type="button" role="menuitem" data-menu-cat="${esc(c.id)}">${esc(c.label)}</button>`).join('');

            this.root.innerHTML = `
            <div class="zc-app">
                <div class="zc-menubar" role="menubar">
                    <div class="zc-menu"><button type="button" class="zc-menu-btn" aria-haspopup="true" aria-expanded="false"><u>F</u>ile</button>
                        <div class="zc-menu-pop" role="menu">
                            <button type="button" role="menuitem" data-cmd="process">Explore the Process…</button>
                            <hr>
                            <button type="button" role="menuitem" data-cmd="close">Close</button>
                        </div>
                    </div>
                    <div class="zc-menu"><button type="button" class="zc-menu-btn" aria-haspopup="true" aria-expanded="false"><u>V</u>iew</button>
                        <div class="zc-menu-pop" role="menu">${viewItems}</div>
                    </div>
                    <div class="zc-menu"><button type="button" class="zc-menu-btn" aria-haspopup="true" aria-expanded="false"><u>P</u>lay</button>
                        <div class="zc-menu-pop" role="menu">
                            <button type="button" role="menuitem" data-cmd="toggle">Play / Pause <kbd>Space</kbd></button>
                            <button type="button" role="menuitem" data-cmd="next">Next Film <kbd>N</kbd></button>
                            <button type="button" role="menuitem" data-cmd="mute">Mute <kbd>M</kbd></button>
                            <button type="button" role="menuitem" data-cmd="full">Full Screen <kbd>F</kbd></button>
                            <hr>
                            <button type="button" role="menuitem" data-cmd="showreel">Watch Showreel</button>
                        </div>
                    </div>
                    <div class="zc-menu"><button type="button" class="zc-menu-btn" aria-haspopup="true" aria-expanded="false"><u>H</u>elp</button>
                        <div class="zc-menu-pop" role="menu">
                            <button type="button" role="menuitem" data-cmd="about">About the Creator</button>
                        </div>
                    </div>
                </div>

                <div class="zc-scroll">
                    <header class="zc-hero">
                        <div class="zc-hero-brand">
                            <div class="zc-wordmark"></div>
                            <p class="zc-tagline">${esc(d.tagline)}</p>
                        </div>
                        <div class="zc-hero-actions">
                            <button type="button" class="zc-xpbtn zc-btn-showreel" data-cmd="showreel">🎞️ Watch Showreel${d.showreel ? '' : ' <span class="zc-soon">soon</span>'}</button>
                            <button type="button" class="zc-xpbtn" data-cmd="about">👤 About the Creator</button>
                        </div>
                    </header>

                    <nav class="zc-tabs" role="tablist" aria-label="Film categories">${tabs}</nav>
                    <p class="zc-cat-blurb" aria-live="polite"></p>

                    <section class="zc-main">
                        <div class="zc-player-col">
                            <div class="zc-wmp">
                                <div class="zc-wmp-top">
                                    <span class="zc-wmp-badge">Now Playing</span>
                                    <span class="zc-wmp-name"></span>
                                    <span class="zc-wmp-fmt"></span>
                                </div>
                                <div class="zc-stage">
                                    <div class="zc-stage-backdrop" aria-hidden="true"></div>
                                    <video class="zc-video" playsinline preload="none"></video>
                                    <button type="button" class="zc-bigplay" aria-label="Play film">${ICONS.play}</button>
                                    <div class="zc-ended" hidden>
                                        <button type="button" class="zc-xpbtn" data-cmd="replay">↺ Replay</button>
                                        <button type="button" class="zc-xpbtn zc-xpbtn-blue" data-cmd="next">Next film ⏭</button>
                                    </div>
                                </div>
                                <div class="zc-controls">
                                    <input type="range" class="zc-seek" min="0" max="1000" step="1" value="0" aria-label="Seek">
                                    <div class="zc-ctrl-row">
                                        <button type="button" class="zc-cbtn zc-cbtn-play" data-cmd="toggle" aria-label="Play">${ICONS.play}</button>
                                        <button type="button" class="zc-cbtn" data-cmd="stop" aria-label="Stop">${ICONS.stop}</button>
                                        <button type="button" class="zc-cbtn" data-cmd="prev" aria-label="Previous film">${ICONS.prev}</button>
                                        <button type="button" class="zc-cbtn" data-cmd="next" aria-label="Next film">${ICONS.next}</button>
                                        <span class="zc-time"><span class="zc-cur">0:00</span> / <span class="zc-dur">0:00</span></span>
                                        <span class="zc-spacer"></span>
                                        <button type="button" class="zc-cbtn" data-cmd="mute" aria-label="Mute">${ICONS.vol}</button>
                                        <input type="range" class="zc-vol" min="0" max="100" step="1" value="80" aria-label="Volume">
                                        <button type="button" class="zc-cbtn" data-cmd="full" aria-label="Full screen">${ICONS.full}</button>
                                    </div>
                                </div>
                            </div>

                            <div class="zc-info">
                                <div class="zc-info-text">
                                    <h2 class="zc-film-title"></h2>
                                    <div class="zc-film-meta"></div>
                                    <p class="zc-film-desc"></p>
                                    <p class="zc-film-fan" hidden></p>
                                </div>
                                <div class="zc-info-actions">
                                    <button type="button" class="zc-action zc-action-watch" data-cmd="watch">▶ WATCH FILM</button>
                                    <button type="button" class="zc-action zc-action-process" data-cmd="process">🎞 EXPLORE THE PROCESS</button>
                                </div>
                            </div>
                        </div>

                        <aside class="zc-deco" aria-hidden="true">
                            <div class="zc-sign">${px('sign', 2, 'zc-sign-svg')}<div class="zc-sign-title"></div></div>
                            <div class="zc-popcorn">
                                <span class="zc-kernel zc-k1">${px('kernel', 3)}</span>
                                <span class="zc-kernel zc-k2">${px('kernel', 3)}</span>
                                <span class="zc-kernel zc-k3">${px('kernel', 3)}</span>
                                <div class="zc-bucket">${px('bucket', 4)}</div>
                                <span class="zc-spark zc-s1">${px('sparkle', 3)}</span>
                                <span class="zc-spark zc-s2">${px('sparkle', 2)}</span>
                                <span class="zc-spark zc-s3">${px('sparkle', 3)}</span>
                            </div>
                            <div class="zc-props">
                                <div class="zc-reel">${px('reel', 3)}</div>
                                <div class="zc-clapper"><div class="zc-clap-top">${px('clapperTop', 2)}</div>${px('clapperBase', 2)}</div>
                            </div>
                            <div class="zc-ticket-slot"><div class="zc-ticket">${px('ticket', 2)}<span class="zc-ticket-no"></span></div></div>
                        </aside>
                    </section>

                    <section class="zc-shelf">
                        <h3 class="zc-shelf-title"><span>More films</span></h3>
                        <div class="zc-cards" role="list"></div>
                    </section>

                    <footer class="zc-foot">${esc(d.note)} Fan-made pieces are marked on their film page.</footer>
                </div>

                <div class="zc-dialog-layer" hidden></div>
            </div>`;

            // The wordmark uses the pixel font
            const wm = this.root.querySelector('.zc-wordmark');
            if (window.CinemaPixelArt) {
                const g = window.CinemaPixelArt.text('ZEYN CINEMA', 'w', 'k');
                wm.innerHTML = window.CinemaPixelArt.toSVG(g, { label: 'Zeyn Cinema' })
                    .replace(/width="(\d+)" height="(\d+)"/, (m, w, h) => `width="${w * 4}" height="${h * 4}"`);
            } else {
                wm.textContent = 'ZEYN CINEMA';
            }

            const q = (s) => this.root.querySelector(s);
            this.el = {
                app: q('.zc-app'), scroll: q('.zc-scroll'),
                video: q('.zc-video'), stage: q('.zc-stage'), wmp: q('.zc-wmp'),
                backdrop: q('.zc-stage-backdrop'), bigplay: q('.zc-bigplay'), ended: q('.zc-ended'),
                seek: q('.zc-seek'), vol: q('.zc-vol'), cur: q('.zc-cur'), dur: q('.zc-dur'),
                playBtn: q('.zc-cbtn-play'), muteBtn: q('[data-cmd="mute"].zc-cbtn'),
                name: q('.zc-wmp-name'), fmt: q('.zc-wmp-fmt'),
                title: q('.zc-film-title'), meta: q('.zc-film-meta'), desc: q('.zc-film-desc'), fan: q('.zc-film-fan'),
                actions: q('.zc-info-actions'),
                blurb: q('.zc-cat-blurb'), cards: q('.zc-cards'), shelfTitle: q('.zc-shelf-title span'),
                signTitle: q('.zc-sign-title'), ticket: q('.zc-ticket'), ticketNo: q('.zc-ticket-no'),
                clapTop: q('.zc-clap-top'), dialogs: q('.zc-dialog-layer')
            };

            let vol = 0.8;
            try { const v = parseFloat(localStorage.getItem('zcVolume')); if (v >= 0 && v <= 1) vol = v; } catch (e) { /* ignore */ }
            this.el.video.volume = vol;
            this.el.vol.value = Math.round(vol * 100);
            this.paintRange(this.el.vol);
        }

        renderCards() {
            const films = this.visibleFilms();
            const catLabel = (id) => (this.data.categories.find(c => c.id === id) || {}).label || '';
            this.el.cards.innerHTML = films.map((f, i) => `
                <div role="listitem">
                <button type="button" class="zc-card${this.film && f.id === this.film.id && this.mode === 'film' ? ' is-current' : ''}" data-film="${esc(f.id)}" style="--i:${i}">
                    <span class="zc-card-thumb zc-ar-${f.aspect === '9:16' ? 'v' : 'h'}">
                        <img src="${esc(f.thumb || f.poster)}" alt="" loading="lazy" decoding="async">
                        <span class="zc-card-dur">${fmtTime(f.duration)}</span>
                        <span class="zc-card-now">Now showing</span>
                        <span class="zc-card-play" aria-hidden="true">${ICONS.play}</span>
                    </span>
                    <span class="zc-card-body">
                        <span class="zc-card-title">${esc(f.title)}</span>
                        <span class="zc-card-meta">${esc(catLabel(f.category))} · ${f.aspect === '9:16' ? 'Vertical' : 'Widescreen'}</span>
                    </span>
                </button>
                </div>`).join('');
            const cat = this.data.categories.find(c => c.id === this.category);
            this.el.shelfTitle.textContent = this.category === 'all' ? 'All films' : cat.label;
        }

        visibleFilms() {
            return this.category === 'all' ? this.data.films : this.data.films.filter(f => f.category === this.category);
        }

        // ------------------------------------------------------------ events
        on(target, type, fn, opts) {
            target.addEventListener(type, fn, opts);
            this._listeners.push([target, type, fn, opts]);
        }

        bind() {
            const v = this.el.video;

            this.on(this.root, 'click', (e) => {
                const menuBtn = e.target.closest('.zc-menu-btn');
                if (menuBtn) { this.toggleMenu(menuBtn); return; }
                const cmdEl = e.target.closest('[data-cmd]');
                const tab = e.target.closest('.zc-tab');
                const card = e.target.closest('.zc-card');
                const menuCat = e.target.closest('[data-menu-cat]');
                if (!e.target.closest('.zc-menu')) this.closeMenus();
                if (cmdEl) { this.closeMenus(); this.command(cmdEl.dataset.cmd); return; }
                if (menuCat) { this.closeMenus(); this.setCategory(menuCat.dataset.menuCat); return; }
                if (tab) { this.setCategory(tab.dataset.cat); return; }
                if (card) { this.selectFilm(card.dataset.film, { play: true }); return; }
            });

            // XP menus: hovering across an open menubar switches menus
            this.on(this.root, 'mouseover', (e) => {
                const btn = e.target.closest('.zc-menu-btn');
                if (btn && this.root.querySelector('.zc-menu.is-open') && !btn.parentElement.classList.contains('is-open')) {
                    this.closeMenus();
                    this.toggleMenu(btn);
                    this._hoverOpened = { menu: btn.parentElement, at: Date.now() };
                }
            });
            this.on(document, 'pointerdown', (e) => { if (!this.root.contains(e.target)) this.closeMenus(); });

            this.on(this.el.bigplay, 'click', () => this.play());
            this.on(this.el.dialogs, 'click', (e) => { if (e.target === this.el.dialogs) this.closeDialog(); });
            this.on(v, 'click', () => this.toggle());
            this.on(v, 'dblclick', () => this.fullscreen());

            this.on(v, 'play', () => this.syncPlaying());
            this.on(v, 'pause', () => this.syncPlaying());
            this.on(v, 'ended', () => { this.el.ended.hidden = false; this.syncPlaying(); });
            this.on(v, 'loadedmetadata', () => { this.el.dur.textContent = fmtTime(v.duration); });
            this.on(v, 'timeupdate', () => this.syncTime());
            this.on(v, 'progress', () => this.syncTime());
            this.on(v, 'volumechange', () => this.syncVolume());
            this.on(v, 'waiting', () => this.el.stage.classList.add('is-loading'));
            this.on(v, 'playing', () => this.el.stage.classList.remove('is-loading'));
            this.on(v, 'canplay', () => this.el.stage.classList.remove('is-loading'));
            this.on(v, 'error', () => {
                this.el.stage.classList.remove('is-loading');
                if (v.getAttribute('src')) this.toast('This film could not be loaded. Please try again later.');
            });

            const seek = this.el.seek;
            this.on(seek, 'input', () => {
                this.seeking = true;
                if (isFinite(v.duration)) {
                    v.currentTime = (seek.value / 1000) * v.duration;
                    this.el.cur.textContent = fmtTime(v.currentTime);
                }
                this.paintRange(seek);
            });
            this.on(seek, 'change', () => { this.seeking = false; });

            this.on(this.el.vol, 'input', () => {
                v.volume = this.el.vol.value / 100;
                v.muted = v.volume === 0;
                try { localStorage.setItem('zcVolume', String(v.volume)); } catch (e) { /* ignore */ }
            });

            this.on(document, 'keydown', (e) => this.onKey(e));
            this.on(document, 'fullscreenchange', () => {
                this.el.wmp.classList.toggle('is-full', document.fullscreenElement === this.el.wmp);
            });
        }

        isActiveWindow() {
            const win = this.root.closest('.window');
            if (!win || win.classList.contains('hidden')) return false;
            const tb = win.querySelector('.window-titlebar');
            return !(tb && tb.classList.contains('inactive'));
        }

        onKey(e) {
            if (!this.isActiveWindow()) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (e.key === 'Escape') {
                if (!this.el.dialogs.hidden) { this.closeDialog(); e.preventDefault(); return; }
                this.closeMenus();
                return;
            }
            const t = e.target;
            const typing = t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) && t.type !== 'range';
            if (typing) return;
            const onControl = t && (t.tagName === 'BUTTON' || t.tagName === 'A' || t.type === 'range');
            const v = this.el.video;
            switch (e.key) {
                case ' ': case 'k': case 'K':
                    if (onControl && e.key === ' ') return; // let the focused control handle Space
                    e.preventDefault(); this.toggle(); break;
                case 'ArrowRight':
                    if (t && t.type === 'range') return;
                    if (isFinite(v.duration)) { v.currentTime = Math.min(v.duration, v.currentTime + 5); e.preventDefault(); }
                    break;
                case 'ArrowLeft':
                    if (t && t.type === 'range') return;
                    v.currentTime = Math.max(0, v.currentTime - 5); e.preventDefault(); break;
                case 'f': case 'F': this.fullscreen(); break;
                case 'm': case 'M': v.muted = !v.muted; break;
                case 'n': case 'N': this.next(); break;
                default:
            }
        }

        // ------------------------------------------------------------ menus
        toggleMenu(btn) {
            const menu = btn.parentElement;
            // A click that lands right after hovering a menu open keeps it open
            const h = this._hoverOpened;
            this._hoverOpened = null;
            if (h && h.menu === menu && Date.now() - h.at < 600 && menu.classList.contains('is-open')) return;
            const open = !menu.classList.contains('is-open');
            this.closeMenus();
            if (open) {
                menu.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
                const first = menu.querySelector('.zc-menu-pop button');
                if (first && btn.matches(':focus-visible')) first.focus({ preventScroll: true });
            }
        }
        closeMenus() {
            this.root.querySelectorAll('.zc-menu.is-open').forEach(m => {
                m.classList.remove('is-open');
                m.querySelector('.zc-menu-btn').setAttribute('aria-expanded', 'false');
            });
        }

        command(cmd) {
            switch (cmd) {
                case 'toggle': this.toggle(); break;
                case 'watch': this.play(true); break;
                case 'stop': this.stop(); break;
                case 'prev': this.prev(); break;
                case 'next': this.next(); break;
                case 'replay': this.el.video.currentTime = 0; this.play(); break;
                case 'mute': this.el.video.muted = !this.el.video.muted; break;
                case 'full': this.fullscreen(); break;
                case 'process': this.openProcess(); break;
                case 'about': this.showAbout(); break;
                case 'showreel': this.showShowreel(); break;
                case 'close': if (this.wm) this.wm.closeWindow('cinema'); break;
                case 'dialog-close': this.closeDialog(); break;
                case 'open-cv': this.closeDialog(); this.openOther('cv'); break;
                case 'open-chat': this.closeDialog(); this.openOther('zeynshat'); break;
                case 'open-work': this.closeDialog(); this.openOther('work'); break;
                default:
            }
        }

        // ------------------------------------------------------------ categories / films
        setCategory(id) {
            if (!this.data.categories.some(c => c.id === id)) return;
            this.category = id;
            this.root.querySelectorAll('.zc-tab').forEach(t => {
                const on = t.dataset.cat === id;
                t.classList.toggle('is-active', on);
                t.setAttribute('aria-selected', String(on));
            });
            const cat = this.data.categories.find(c => c.id === id);
            this.el.blurb.textContent = cat.blurb || '';
            this.renderCards();
            // Switching tabs never interrupts a film that is playing. When nothing
            // is playing and the film on screen is not in this category, cue the
            // first one (poster only, no playback).
            const list = this.visibleFilms();
            const busy = !this.el.video.paused;
            if (!busy && list.length && (!this.film || this.mode !== 'film' || !list.some(f => f.id === this.film.id))) {
                this.selectFilm(list[0].id, { play: false });
            }
        }

        selectFilm(id, { play = false, quiet = false } = {}) {
            const f = this.data.films.find(x => x.id === id);
            if (!f) return;
            const same = this.film && this.film.id === f.id && this.mode === 'film';
            this.mode = 'film';
            this.film = f;
            if (!same) this.load(f.src, f.poster, f.aspect, play ? 'auto' : 'none');
            this.paintInfo(f);
            this.root.querySelectorAll('.zc-card').forEach(c => c.classList.toggle('is-current', c.dataset.film === f.id));
            if (!same && !quiet) this.celebrate();
            if (!quiet) this.syncProcessWindow();
            if (play) this.play(true);
        }

        load(src, poster, aspect, preload) {
            const v = this.el.video;
            v.pause();
            v.preload = preload;
            v.poster = poster || '';
            v.src = src;
            if (preload !== 'none') v.load();
            this.el.stage.dataset.aspect = aspect === '9:16' ? 'v' : 'h';
            this.el.backdrop.style.backgroundImage = poster ? `url("${poster}")` : '';
            this.el.ended.hidden = true;
            this.el.seek.value = 0; this.paintRange(this.el.seek);
            this.el.cur.textContent = '0:00';
            this.syncPlaying();
        }

        paintInfo(f) {
            const cat = this.data.categories.find(c => c.id === f.category);
            const fmt = f.aspect === '9:16' ? 'Vertical 9:16' : 'Widescreen 16:9';
            this.el.name.textContent = f.title;
            this.el.fmt.textContent = fmt;
            this.el.dur.textContent = fmtTime(f.duration);
            this.el.title.textContent = f.title;
            this.el.meta.innerHTML = `<span class="zc-chip">${esc(cat ? cat.label : '')}</span><span>${fmtTime(f.duration)}</span><span>${fmt}</span><span>AI film</span>${f.fanNote ? '<span class="zc-chip zc-chip-fan">Fan-made</span>' : ''}`;
            this.el.desc.textContent = f.description;
            this.el.fan.hidden = !f.fanNote;
            this.el.fan.textContent = f.fanNote || '';
            this.el.actions.hidden = false;
            this.el.signTitle.textContent = f.title;
            const idx = this.data.films.indexOf(f) + 1;
            this.el.ticketNo.textContent = `No. ${String(idx).padStart(2, '0')}`;
        }

        // Ticket + clapper animation when the film changes
        celebrate() {
            if (reducedMotion()) return;
            [this.el.ticket, this.el.clapTop].forEach(el => {
                el.classList.remove('is-anim');
                void el.offsetWidth; // restart the animation
                el.classList.add('is-anim');
            });
        }

        // ------------------------------------------------------------ playback
        play(scrollIntoView) {
            const v = this.el.video;
            if (!v.getAttribute('src')) return;
            if (v.preload === 'none') v.preload = 'auto';
            this.el.ended.hidden = true;
            this.pauseOtherAudio();
            const p = v.play();
            if (p && p.catch) p.catch(() => { /* blocked or interrupted — the big play button stays visible */ });
            if (scrollIntoView) {
                const box = this.el.scroll;
                if (this.el.wmp.getBoundingClientRect().top < box.getBoundingClientRect().top) scrollWithin(box, this.el.wmp);
            }
        }
        toggle() { this.el.video.paused ? this.play() : this.el.video.pause(); }
        stop() { const v = this.el.video; v.pause(); v.currentTime = 0; this.el.ended.hidden = true; }
        next() {
            const list = this.mode === 'film' ? this.visibleFilms() : this.data.films;
            if (!list.length) return;
            const i = this.film && this.mode === 'film' ? list.findIndex(f => f.id === this.film.id) : -1;
            const n = list[(i + 1) % list.length];
            const wasPlaying = !this.el.video.paused || !this.el.ended.hidden;
            this.selectFilm(n.id, { play: wasPlaying });
        }
        prev() {
            const v = this.el.video;
            if (v.currentTime > 3) { v.currentTime = 0; return; }
            const list = this.visibleFilms();
            if (!list.length || this.mode !== 'film') return;
            const i = list.findIndex(f => f.id === this.film.id);
            const p = list[(i - 1 + list.length) % list.length];
            this.selectFilm(p.id, { play: !v.paused });
        }
        seekTo(t, autoplay) {
            const v = this.el.video;
            const go = () => { try { v.currentTime = t; } catch (e) { /* ignore */ } if (autoplay) this.play(true); };
            if (v.readyState >= 1) go();
            else {
                v.preload = 'auto';
                v.addEventListener('loadedmetadata', go, { once: true });
                v.load();
            }
        }
        fullscreen() {
            const w = this.el.wmp, v = this.el.video;
            if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); return; }
            if (w.requestFullscreen) w.requestFullscreen().catch(() => { if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); });
            else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iPhone Safari
        }

        // Pause the desktop Media Player's music when a film starts
        pauseOtherAudio() {
            try {
                const mp = this.wm && this.wm.windows.get('showreel');
                if (mp && mp.mediaPlayer && mp.mediaPlayer.audio && !mp.mediaPlayer.audio.paused) mp.mediaPlayer.pause();
            } catch (e) { /* ignore */ }
        }

        syncPlaying() {
            const v = this.el.video;
            const playing = !v.paused && !v.ended;
            this.el.app.classList.toggle('is-playing', playing);
            this.el.playBtn.innerHTML = playing ? ICONS.pause : ICONS.play;
            this.el.playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
            this.el.bigplay.hidden = playing || !this.el.ended.hidden;
            this.el.stage.classList.toggle('is-started', playing || v.currentTime > 0);
        }
        syncTime() {
            const v = this.el.video;
            if (!isFinite(v.duration) || !v.duration) return;
            if (!this.seeking) {
                this.el.seek.value = Math.round((v.currentTime / v.duration) * 1000);
                this.el.cur.textContent = fmtTime(v.currentTime);
            }
            let buf = 0;
            for (let i = 0; i < v.buffered.length; i++) {
                if (v.buffered.start(i) <= v.currentTime) buf = Math.max(buf, v.buffered.end(i));
            }
            this.paintRange(this.el.seek, buf / v.duration);
        }
        syncVolume() {
            const v = this.el.video;
            const muted = v.muted || v.volume === 0;
            this.el.muteBtn.innerHTML = muted ? ICONS.mute : ICONS.vol;
            this.el.muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
            this.el.vol.value = muted ? 0 : Math.round(v.volume * 100);
            this.paintRange(this.el.vol);
        }
        paintRange(input, buffered) {
            const pct = (input.value - input.min) / (input.max - input.min) * 100;
            input.style.setProperty('--fill', pct + '%');
            if (buffered != null) input.style.setProperty('--buf', Math.max(pct, buffered * 100) + '%');
        }

        // ------------------------------------------------------------ dialogs
        dialog(title, bodyHTML, cls = '') {
            const layer = this.el.dialogs;
            layer.innerHTML = `
                <div class="zc-dialog ${cls}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
                    <div class="zc-dialog-bar"><span>${esc(title)}</span><button type="button" class="win-btn win-close" data-cmd="dialog-close" aria-label="Close">×</button></div>
                    <div class="zc-dialog-body">${bodyHTML}</div>
                </div>`;
            layer.hidden = false;
            this._lastFocus = document.activeElement;
            const btn = layer.querySelector('.zc-dialog-body button, .zc-dialog-body a') || layer.querySelector('[data-cmd="dialog-close"]');
            if (btn) btn.focus({ preventScroll: true });
        }
        closeDialog() {
            this.el.dialogs.hidden = true;
            this.el.dialogs.innerHTML = '';
            if (this._lastFocus && this._lastFocus.focus) this._lastFocus.focus({ preventScroll: true });
        }
        toast(msg) {
            this.dialog('Zeyn Cinema', `<div class="zc-msg"><span class="zc-msg-icon">ℹ️</span><p>${esc(msg)}</p></div><div class="zc-dialog-btns"><button type="button" class="zc-xpbtn" data-cmd="dialog-close">OK</button></div>`);
        }

        showAbout() {
            const a = this.data.about;
            const linkedin = (window.CONFIG && CONFIG.social && CONFIG.social.linkedin) || 'https://www.linkedin.com/in/zynprdn/';
            this.dialog('About the Creator', `
                <div class="zc-about">
                    <img class="zc-about-avatar" src="assets/icons/zeyn-avatar.png" alt="">
                    <div>
                        <h3>${esc(a.name)}</h3>
                        <div class="zc-about-role">${esc(a.role)} · ${esc(a.location)}</div>
                        <p>${esc(a.intro)}</p>
                    </div>
                </div>
                <fieldset class="zc-fieldset"><legend>What I bring</legend>
                    <ul class="zc-skills">${a.skills.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
                </fieldset>
                <div class="zc-dialog-btns">
                    <a class="zc-xpbtn" href="${esc(linkedin)}" target="_blank" rel="noopener">🔗 LinkedIn</a>
                    <button type="button" class="zc-xpbtn" data-cmd="open-cv">📄 Resume</button>
                    <button type="button" class="zc-xpbtn" data-cmd="open-chat">💬 Zeyn Chat</button>
                    <button type="button" class="zc-xpbtn" data-cmd="open-work">💼 My Work</button>
                </div>`, 'zc-dialog-about');
        }

        showShowreel() {
            const r = this.data.showreel;
            if (!r || !r.src) {
                this.dialog('Watch Showreel', `
                    <div class="zc-msg"><span class="zc-msg-icon">🎞️</span>
                    <p><b>The showreel is in the edit.</b><br>It will appear here as soon as it is ready. In the meantime, every film below is ready to watch.</p></div>
                    <div class="zc-dialog-btns"><button type="button" class="zc-xpbtn" data-cmd="dialog-close">OK</button></div>`);
                return;
            }
            this.mode = 'showreel';
            this.load(r.src, r.poster, r.aspect || '16:9', 'auto');
            this.el.name.textContent = 'Showreel';
            this.el.fmt.textContent = r.aspect === '9:16' ? 'Vertical 9:16' : 'Widescreen 16:9';
            this.el.title.textContent = 'Showreel';
            this.el.meta.innerHTML = `<span class="zc-chip">Showreel</span>${r.duration ? `<span>${fmtTime(r.duration)}</span>` : ''}`;
            this.el.desc.textContent = r.description || '';
            this.el.fan.hidden = true;
            this.el.actions.hidden = true;
            this.el.signTitle.textContent = 'Showreel';
            this.root.querySelectorAll('.zc-card').forEach(c => c.classList.remove('is-current'));
            this.celebrate();
            this.play(true);
        }

        // ------------------------------------------------------------ process window
        // The click that asked for another window still bubbles up to this
        // window's own "focus on click" handler, which would put Zeyn Cinema back
        // on top. Opening on the next tick keeps the new window in front.
        openOther(id) {
            if (!this.wm) return;
            setTimeout(() => {
                if (this.wm.windows.has(id)) this.wm.focusWindow(id);
                else this.wm.openWindow(id);
            }, 0);
        }

        openProcess() {
            if (!this.film || !this.wm) return;
            ZeynCinema.processFilmId = this.film.id;
            this.syncProcessWindow();
            this.openOther('cinemaProcess');
        }
        syncProcessWindow() {
            if (!this.wm || !this.film || !this.wm.windows.has('cinemaProcess')) return;
            ZeynCinema.processFilmId = this.film.id;
            const host = this.wm.windows.get('cinemaProcess').element.querySelector('#zc-process');
            if (host) ZeynCinema.renderProcess(host, this.film.id);
        }

        destroy() {
            const v = this.el.video;
            try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) { /* ignore */ }
            if (document.fullscreenElement === this.el.wmp) document.exitFullscreen().catch(() => {});
            this._listeners.forEach(([t, type, fn, opts]) => t.removeEventListener(type, fn, opts));
            this._listeners = [];
            if (ZeynCinema.instance === this) ZeynCinema.instance = null;
        }
    }

    // ================================================================
    // "Explore the Process" — Windows Movie Maker inspired window
    // ================================================================
    const SECTIONS = [
        ['idea', 'The Idea', '💡'],
        ['direction', 'Creative Direction', '🎨'],
        ['storytelling', 'Storytelling', '📖'],
        ['workflow', 'AI Workflow', '⚙️'],
        ['challenges', 'Challenges', '🧩'],
        ['result', 'Final Result', '🏁']
    ];

    ZeynCinema.renderProcess = function (host, filmId) {
        const data = window.CINEMA_DATA;
        if (!host || !data) return;
        const f = data.films.find(x => x.id === filmId) || data.films[0];
        if (!f) return;
        const cat = data.categories.find(c => c.id === f.category);
        const fmt = f.aspect === '9:16' ? 'Vertical 9:16' : 'Widescreen 16:9';
        const p = f.process || {};
        const soon = '<p class="zc-pm-soon">Notes coming soon.</p>';

        const sectionBody = (key) => {
            const val = p[key];
            if (key === 'storytelling' && Array.isArray(val) && val.length) {
                return `<p class="zc-pm-sub">The film, scene by scene:</p><ol class="zc-pm-beats">${val.map(b => `<li>${esc(b)}</li>`).join('')}</ol>`;
            }
            if (key === 'result') {
                const facts = `<ul class="zc-pm-facts"><li><b>Length</b> ${fmtTime(f.duration)}</li><li><b>Format</b> ${fmt}</li><li><b>Series</b> ${esc(cat ? cat.label : '')}</li></ul>`;
                return facts + (val ? `<p>${esc(val)}</p>` : '');
            }
            if (Array.isArray(val)) return val.length ? `<ul>${val.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : soon;
            return val ? String(val).split(/\n{2,}/).map(par => `<p>${esc(par)}</p>`).join('') : soon;
        };

        const frames = f.frames || [];
        const images = f.processImages || [];
        const options = data.films.map(x => `<option value="${esc(x.id)}"${x.id === f.id ? ' selected' : ''}>${esc(x.title)}</option>`).join('');

        host.innerHTML = `
        <div class="zc-pm">
            <div class="zc-pm-toolbar">
                <label>Project: <select class="zc-pm-select" aria-label="Choose a film">${options}</select></label>
                <span class="zc-spacer"></span>
                <button type="button" class="zc-xpbtn zc-xpbtn-green" data-pm="watch">▶ Watch film</button>
            </div>
            <div class="zc-pm-body">
                <nav class="zc-pm-tasks" aria-label="Process sections">
                    <div class="zc-pm-task-head">Movie Tasks</div>
                    <ol>${SECTIONS.map(([k, label, ic], i) => `<li><a href="#zc-pm-${k}" data-pm-jump="${k}"><span aria-hidden="true">${ic}</span> ${i + 1}. ${label}</a></li>`).join('')}</ol>
                    <div class="zc-pm-task-head">Film Details</div>
                    <dl class="zc-pm-details"><dt>Title</dt><dd>${esc(f.title)}</dd><dt>Series</dt><dd>${esc(cat ? cat.label : '')}</dd><dt>Length</dt><dd>${fmtTime(f.duration)}</dd><dt>Format</dt><dd>${fmt}</dd></dl>
                </nav>
                <div class="zc-pm-content">
                    <h2 class="zc-pm-title">${esc(f.title)} <span>— Creative Process</span></h2>
                    <p class="zc-pm-desc">${esc(f.description)}</p>
                    ${SECTIONS.map(([k, label, ic]) => `<section class="zc-pm-sec" id="zc-pm-${k}"><h3><span aria-hidden="true">${ic}</span> ${label}</h3>${sectionBody(k)}</section>`).join('')}
                    <section class="zc-pm-sec"><h3><span aria-hidden="true">🖼️</span> Process Images</h3>
                        ${images.length ? `<div class="zc-pm-images">${images.map(im => `<figure><img src="${esc(im.src)}" alt="${esc(im.caption || '')}" loading="lazy"><figcaption>${esc(im.caption || '')}</figcaption></figure>`).join('')}</div>` : '<p class="zc-pm-soon">Sketches, look-development and behind-the-scenes images coming soon.</p>'}
                    </section>
                    ${f.fanNote ? `<p class="zc-pm-fan">${esc(f.fanNote)}</p>` : ''}
                </div>
                <div class="zc-pm-monitor">
                    <div class="zc-pm-screen"><img alt="" src="${esc(frames[0] ? frames[0].src : f.poster)}"></div>
                    <div class="zc-pm-monitor-bar"><span class="zc-pm-frame-label">${frames[0] ? `Frame 1 · ${fmtTime(frames[0].t)}` : 'Poster'}</span>
                        ${frames.length ? `<button type="button" class="zc-xpbtn" data-pm="from-here">▶ Play from here</button>` : ''}</div>
                </div>
            </div>
            <div class="zc-pm-storyboard">
                <div class="zc-pm-sb-head">Storyboard <span>— frames from the finished film</span></div>
                <div class="zc-pm-sb-strip">
                    ${frames.map((fr, i) => `
                        <button type="button" class="zc-pm-cell${i === 0 ? ' is-sel' : ''}" data-frame="${i}" aria-label="Frame ${i + 1} at ${fmtTime(fr.t)}">
                            <span class="zc-pm-cell-img zc-ar-${f.aspect === '9:16' ? 'v' : 'h'}"><img src="${esc(fr.src)}" alt="" loading="lazy"></span>
                            <span class="zc-pm-cell-t">${i + 1} · ${fmtTime(fr.t)}</span>
                        </button>${i < frames.length - 1 ? '<span class="zc-pm-arrow" aria-hidden="true">▸</span>' : ''}`).join('')}
                </div>
            </div>
        </div>`;

        let sel = 0;
        const screen = host.querySelector('.zc-pm-screen img');
        const label = host.querySelector('.zc-pm-frame-label');
        host.querySelector('.zc-pm-select').addEventListener('change', (e) => {
            ZeynCinema.processFilmId = e.target.value;
            ZeynCinema.renderProcess(host, e.target.value);
        });
        host.querySelectorAll('[data-frame]').forEach(btn => btn.addEventListener('click', () => {
            sel = +btn.dataset.frame;
            host.querySelectorAll('.zc-pm-cell').forEach(c => c.classList.toggle('is-sel', c === btn));
            screen.src = frames[sel].src;
            label.textContent = `Frame ${sel + 1} · ${fmtTime(frames[sel].t)}`;
        }));
        host.querySelectorAll('[data-pm-jump]').forEach(a => a.addEventListener('click', (e) => {
            e.preventDefault();
            const t = host.querySelector(`#zc-pm-${a.dataset.pmJump}`);
            if (!t) return;
            // desktop: the content column scrolls; narrow windows: the whole body scrolls
            const content = host.querySelector('.zc-pm-content');
            const box = content.scrollHeight > content.clientHeight + 1 ? content : host.querySelector('.zc-pm-body');
            scrollWithin(box, t);
        }));
        const toCinema = (t) => {
            const wm = window.windowManager;
            if (!wm) return;
            if (!wm.windows.has('cinema')) wm.openWindow('cinema');
            const inst = ZeynCinema.instance;
            if (!inst) return;
            if (!inst.film || inst.film.id !== f.id || inst.mode !== 'film') inst.selectFilm(f.id, { play: false });
            if (t != null) inst.seekTo(t, true); else inst.play(true);
            // after this click has bubbled to the process window's own focus handler
            setTimeout(() => wm.focusWindow('cinema'), 0);
        };
        const w = host.querySelector('[data-pm="watch"]');
        if (w) w.addEventListener('click', () => toCinema(null));
        const fh = host.querySelector('[data-pm="from-here"]');
        if (fh) fh.addEventListener('click', () => toCinema(frames[sel].t));
    };

    ZeynCinema.mount = function (root, windowManager) {
        if (ZeynCinema.instance) ZeynCinema.instance.destroy();
        const inst = new ZeynCinema(root, window.CINEMA_DATA, windowManager);
        ZeynCinema.instance = inst;
        return inst;
    };

    ZeynCinema.instance = null;
    ZeynCinema.processFilmId = null;
    window.ZeynCinema = ZeynCinema;
})();
