/* ========================================
   ARCHIVE GALLERY
   A 3D card rail for Archive.exe.

   Every card carries two numeric states:
     base -- where it sits on the rail (intro and navigation tween this)
     fx   -- additive offsets (wave, hover, idle, drag tension)
   One ticker composes base+fx into a single transform per frame, so the
   cinematic intro, the wave and a hover can all run at once without
   fighting over the same style property. Only transform/opacity are
   written; nothing here triggers layout.

   Uses GSAP when it is on the page and degrades to a static, still
   interactive gallery when it is not.
   ======================================== */

(function () {
    'use strict';

    var TIERS = {
        desktop: { cardW: 230, spread: 202, depth: 132, focusZ: 40, angle: 11, angleMax: 13,
                   scaleStep: .07, minScale: .72, visible: 5.5, lift: 10, tilt: 2, trails: 4, waveZ: 100 },
        tablet:  { cardW: 188, spread: 168, depth: 88,  focusZ: 26, angle: 9,  angleMax: 11,
                   scaleStep: .08, minScale: .74, visible: 4.5, lift: 8,  tilt: 2, trails: 2, waveZ: 70 },
        mobile:  { cardW: 148, spread: 132, depth: 54,  focusZ: 16, angle: 7,  angleMax: 9,
                   scaleStep: .09, minScale: .76, visible: 3.5, lift: 6,  tilt: 1, trails: 0, waveZ: 46 }
    };

    var TRAIL_FADE = [.8, .55, .3, .12, .06];

    function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
    function sign(v) { return v < 0 ? -1 : (v > 0 ? 1 : 0); }

    function ArchiveGallery(root, cards, opts) {
        this.root = root;
        this.cards = (cards || []).slice();
        this.opts = opts || {};
        this.G = window.gsap || null;
        this.reduced = window.matchMedia &&
                       window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.focus = Math.floor(this.cards.length / 2);
        this.items = [];
        this.trails = [];
        this.introDone = false;
        this.interactive = false;
        this.destroyed = false;
        this.pointer = { x: 0, y: 0 };
        this.railFx = { ry: 0, rx: 0 };
        this._binds = [];

        this.build();
        this.measure();
        this.start();
    }

    /* ------------------------------------------------------------ build */

    ArchiveGallery.prototype.build = function () {
        var self = this;
        this.root.innerHTML =
            '<div class="archive-env">' +
              '<div class="sky"></div><div class="horizon"></div>' +
              '<div class="floor"></div><div class="haze"></div>' +
            '</div>' +
            '<div class="archive-rail"></div>' +
            '<div class="archive-hint">DRAG &middot; SCROLL &middot; ARROW KEYS &middot; CLICK TO OPEN</div>' +
            '<div class="archive-hud">' +
              '<div class="grp">' +
                '<button class="xpbtn" data-nav="-1">&laquo; <span class="lbl">Back</span></button>' +
                '<button class="xpbtn" data-nav="1"><span class="lbl">Next</span> &raquo;</button>' +
                '<button class="xpbtn" data-act="replay"><span class="lbl">Replay</span> &#8635;</button>' +
              '</div>' +
              '<div class="spacer"></div>' +
              '<div class="status"><b class="st-id">—</b> <span class="st-title"></span></div>' +
              '<div class="count"><span class="st-n">0</span> / ' + this.cards.length + '</div>' +
            '</div>' +
            '<div class="archive-detail">' +
              '<div class="frame">' +
                '<div class="bar"><span class="d-title">FILE</span><button data-act="close">&times;</button></div>' +
                '<div class="body"><img alt=""></div>' +
                '<div class="meta"><span class="d-id"></span><span class="d-hint">Esc / &times; to close &middot; &larr; &rarr; to browse</span></div>' +
              '</div>' +
            '</div>';

        this.rail   = this.root.querySelector('.archive-rail');
        this.hint   = this.root.querySelector('.archive-hint');
        this.detail = this.root.querySelector('.archive-detail');
        this.stId    = this.root.querySelector('.st-id');
        this.stTitle = this.root.querySelector('.st-title');
        this.stN     = this.root.querySelector('.st-n');

        this.cards.forEach(function (data, i) {
            var el = document.createElement('div');
            el.className = 'archive-card';
            el.dataset.index = i;
            el.innerHTML =
                '<div class="plate"><img alt="' + data.title + '"><div class="sheen"></div></div>' +
                '<div class="cap">' + data.title + '</div>';

            var img = el.querySelector('img');
            img.decoding = 'async';
            // the artwork sets the card's aspect, so nothing is ever cropped
            img.addEventListener('load', function () {
                if (img.naturalWidth) self.setAspect(el, img.naturalHeight / img.naturalWidth);
            });

            self.rail.appendChild(el);
            self.items.push({
                data: data, el: el, img: img, index: i, loaded: false,
                base: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, o: 0 },
                fx:   { x: 0, y: 0, z: 0, rx: 0, ry: 0, s: 1 },
                idle: { y: 0, z: 0, ry: 0 }
            });
        });
    };

    ArchiveGallery.prototype.setAspect = function (el, ratio) {
        var w = parseFloat(getComputedStyle(el).getPropertyValue('--acw')) ||
                (this.tier && this.tier.cardW) || TIERS.desktop.cardW;
        el.style.setProperty('--ach', Math.round(w * clamp(ratio, 1.15, 1.7)) + 'px');
    };

    /* ---------------------------------------------------------- measure */

    ArchiveGallery.prototype.measure = function () {
        var w = this.root.clientWidth || 900;
        var h = this.root.clientHeight || 600;
        var name = w < 640 ? 'mobile' : (w < 1024 ? 'tablet' : 'desktop');
        this.tierName = name;
        this.tier = Object.assign({}, TIERS[name]);

        // keep the focused card inside the window whatever the window size is
        var fit = Math.min(this.tier.cardW, (h - 130) / 1.5, w * 0.30);
        this.tier.cardW = Math.max(96, Math.round(fit));
        var k = this.tier.cardW / TIERS[name].cardW;
        this.tier.spread = Math.round(this.tier.spread * k);
        this.tier.depth  = Math.round(this.tier.depth * k);

        this.root.style.setProperty('--acw', this.tier.cardW + 'px');
        this.root.style.setProperty('--ach', Math.round(this.tier.cardW * 1.5) + 'px');

        var self = this;
        this.items.forEach(function (it) {
            it.el.style.setProperty('--acw', self.tier.cardW + 'px');
            if (it.img.naturalWidth) self.setAspect(it.el, it.img.naturalHeight / it.img.naturalWidth);
            else it.el.style.setProperty('--ach', Math.round(self.tier.cardW * 1.5) + 'px');
        });
    };

    /* ------------------------------------------------------- rail maths */

    ArchiveGallery.prototype.railFor = function (offset) {
        var T = this.tier;
        var a = Math.abs(offset), d = sign(offset);
        // spacing compresses outward, so the far cards read as a vanishing point
        var run = a <= 1 ? a : 1 + Math.pow(a - 1, .78) * .92;
        return {
            x:  d * T.spread * run,
            y:  Math.pow(a, 1.5) * T.lift,
            z:  a === 0 ? T.focusZ : -(T.depth * Math.pow(a, 1.22)),
            rx: T.tilt,
            ry: -d * Math.min(T.angle * (a <= 1 ? a : 1 + (a - 1) * .35), T.angleMax),
            rz: -d * a * .6,
            s:  Math.max(T.minScale, 1 - a * T.scaleStep),
            o:  a > T.visible ? 0 : (a > T.visible - 1.5 ? clamp((T.visible - a) / 1.5, 0, 1) : 1)
        };
    };

    ArchiveGallery.prototype.applyRail = function (it, target) {
        var r = this.railFor(it.index - this.focus);
        for (var k in r) target[k] = r[k];
    };

    /* --------------------------------------------------------- compose */

    ArchiveGallery.prototype.compose = function () {
        var i, it, b, f;
        for (i = 0; i < this.items.length; i++) {
            it = this.items[i]; b = it.base; f = it.fx; var d = it.idle;
            it.el.style.transform =
                'translate3d(' + (b.x + f.x).toFixed(2) + 'px,' +
                                 (b.y + f.y + d.y).toFixed(2) + 'px,' +
                                 (b.z + f.z + d.z).toFixed(2) + 'px)' +
                ' rotateX(' + (b.rx + f.rx).toFixed(2) + 'deg)' +
                ' rotateY(' + (b.ry + f.ry + d.ry).toFixed(2) + 'deg)' +
                ' rotateZ(' + b.rz.toFixed(2) + 'deg)' +
                ' scale(' + (b.s * f.s).toFixed(4) + ')';
            it.el.style.opacity = b.o;
            it.el.style.zIndex = String(1000 + Math.round(b.z + f.z + d.z));
            it.el.style.pointerEvents = b.o > .35 ? 'auto' : 'none';
        }
        for (i = 0; i < this.trails.length; i++) {
            var t = this.trails[i], s = t.s;
            t.el.style.transform =
                'translate3d(' + s.x.toFixed(2) + 'px,' + s.y.toFixed(2) + 'px,' + s.z.toFixed(2) + 'px)' +
                ' rotateY(' + s.ry.toFixed(2) + 'deg) rotateZ(' + s.rz.toFixed(2) + 'deg)' +
                ' scale(' + s.s.toFixed(4) + ')';
            t.el.style.opacity = s.o;
        }
        this.rail.style.transform =
            'rotateY(' + this.railFx.ry.toFixed(3) + 'deg) rotateX(' + this.railFx.rx.toFixed(3) + 'deg)';
    };

    ArchiveGallery.prototype.startTicker = function () {
        var self = this;
        this._tick = function () { if (!self.destroyed) self.compose(); };
        if (this.G) this.G.ticker.add(this._tick);
        else {
            var loop = function () {
                if (self.destroyed) return;
                self._tick();
                self._raf = requestAnimationFrame(loop);
            };
            this._raf = requestAnimationFrame(loop);
        }
    };

    /* ------------------------------------------------------ image load */

    // Load in focus-outward order so the visible cards arrive first.
    ArchiveGallery.prototype.loadNear = function (radius) {
        var self = this, r = radius == null ? Math.ceil(this.tier.visible) + 2 : radius;
        var order = this.items.slice().sort(function (a, b) {
            return Math.abs(a.index - self.focus) - Math.abs(b.index - self.focus);
        });
        order.forEach(function (it) {
            if (it.loaded) return;
            if (Math.abs(it.index - self.focus) > r) return;
            it.loaded = true;
            var key = window.ARCHIVE_RAIL_SOURCE || 'preview';
            it.img.src = it.data[key] || it.data.image;
        });
    };

    /* ------------------------------------------------------------ trail */

    // Temporary clones that streak diagonally behind a moving card.
    ArchiveGallery.prototype.spawnTrail = function (it, count, dir) {
        if (this.reduced) return;
        var n = count == null ? this.tier.trails : count;
        if (n <= 0 || !it.loaded) return;
        var self = this, b = it.base, f = it.fx, d = dir || -1;

        for (var k = 1; k <= n; k++) {
            var el = document.createElement('div');
            el.className = 'archive-trail';
            el.style.setProperty('--acw', it.el.style.getPropertyValue('--acw'));
            el.style.setProperty('--ach', it.el.style.getPropertyValue('--ach'));
            var img = it.img.cloneNode(false);     // cached, no new request
            el.appendChild(img);
            this.rail.appendChild(el);

            var gap = 34 + k * 11;                 // 30-80px apart, widening
            var state = {
                x: b.x + f.x + d * gap * k * .55,
                y: b.y + f.y + gap * k * .34,      // diagonal, not a straight line
                z: b.z + f.z - k * 62,
                ry: b.ry + d * k * 3.2,
                rz: b.rz + d * k * .9,
                s: (b.s * f.s) * (1 - k * .035),
                o: TRAIL_FADE[k - 1] != null ? TRAIL_FADE[k - 1] : .06
            };
            var rec = { el: el, s: state };
            this.trails.push(rec);

            (function (rec) {
                var kill = function () {
                    var i = self.trails.indexOf(rec);
                    if (i > -1) self.trails.splice(i, 1);
                    if (rec.el.parentNode) rec.el.parentNode.removeChild(rec.el);
                };
                if (self.G) {
                    self.G.to(rec.s, {
                        x: b.x + f.x, y: b.y + f.y, z: b.z + f.z,
                        ry: b.ry, rz: b.rz, s: b.s * f.s, o: 0,
                        duration: .34 + k * .07, ease: 'power2.out',
                        delay: k * .015, onComplete: kill
                    });
                } else {
                    setTimeout(kill, 260);
                }
            })(rec);
        }
    };

    ArchiveGallery.prototype.clearTrails = function () {
        while (this.trails.length) {
            var t = this.trails.pop();
            if (this.G) this.G.killTweensOf(t.s);
            if (t.el.parentNode) t.el.parentNode.removeChild(t.el);
        }
    };

    /* ------------------------------------------------------------ intro */

    // Small deterministic jitter so the far stack reads as many cards,
    // not one card. Same input always gives the same offsets.
    function jitter(i) {
        var a = Math.sin(i * 12.9898) * 43758.5453;
        var b = Math.sin(i * 78.233)  * 12345.6789;
        var c = Math.sin(i * 45.164)  * 9876.54321;
        a -= Math.floor(a); b -= Math.floor(b); c -= Math.floor(c);
        return {
            x:  (a - .5) * 26,
            y:  (b - .5) * 20,
            z:  (c - .5) * 150,
            ry: (a - .5) * 9,
            rz: (b - .5) * 4
        };
    }

    ArchiveGallery.prototype.stackState = function (it) {
        var j = jitter(it.index);
        return { x: j.x * .42, y: j.y * .42, z: j.z * .30, rx: 6, ry: j.ry * .5, rz: j.rz * .5, s: 1, o: 1 };
    };

    ArchiveGallery.prototype.settleAll = function (immediate) {
        var self = this;
        this.items.forEach(function (it) {
            var r = self.railFor(it.index - self.focus);
            if (immediate || !self.G) {
                for (var k in r) it.base[k] = r[k];
            } else {
                self.G.to(it.base, Object.assign({ duration: .6, ease: 'power2.out' }, r));
            }
        });
        this.updateHud();
    };

    ArchiveGallery.prototype.intro = function () {
        var self = this, G = this.G;
        var vis = this.items.filter(function (it) {
            return Math.abs(it.index - self.focus) <= self.tier.visible + .5;
        });

        // ---- 1. the deck starts far away, barely there
        this.items.forEach(function (it) {
            var j = jitter(it.index);
            G.set(it.base, {
                x: j.x, y: j.y, z: -1000 + j.z, rx: 8, ry: j.ry, rz: j.rz, s: .15, o: 0
            });
            G.set(it.fx, { x: 0, y: 0, z: 0, rx: 0, ry: 0, s: 1 });
        });

        var tl = G.timeline({ onComplete: function () { self.finishIntro(); } });
        this.tl = tl;

        // ---- 2. it travels out of the depth toward the viewer.
        // Cards sitting further back leave later, so the stack has thickness.
        var byDepth = this.items.slice().sort(function (a, b) {
            return jitter(b.index).z - jitter(a.index).z;
        });
        byDepth.forEach(function (it, n) {
            var at = n * .045;
            tl.to(it.base, Object.assign({ duration: 1.25, ease: 'power3.out' }, self.stackState(it)), at);
            tl.call(function () { self.spawnTrail(it, Math.min(3, self.tier.trails), -1); }, null, at + .34);
        });

        // ---- 3. the stack fans open from the middle outward,
        // each card overshooting past its slot before dropping into it
        var fanStart = 1.15;
        var byCentre = this.items.slice().sort(function (a, b) {
            return Math.abs(a.index - self.focus) - Math.abs(b.index - self.focus);
        });
        byCentre.forEach(function (it, n) {
            var r = self.railFor(it.index - self.focus);
            var at = fanStart + n * .045;
            var over = {
                x: r.x * 1.13, y: r.y - 16, z: r.z + 130,
                rx: r.rx, ry: r.ry * 1.7, rz: r.rz * 1.6,
                s: r.s * 1.04, o: r.o,
                duration: .5, ease: 'power2.out'
            };
            tl.to(it.base, over, at);
            tl.to(it.base, Object.assign({ duration: .55, ease: 'power3.out' }, r), at + .46);
            if (Math.abs(it.index - self.focus) <= self.tier.visible) {
                tl.call(function () {
                    self.spawnTrail(it, self.tier.trails, it.index < self.focus ? 1 : -1);
                }, null, at + .05);
            }
        });

        // ---- 4. a wave rolls across the open fan, left to right
        var waveStart = fanStart + byCentre.length * .045 + .5;
        vis.sort(function (a, b) { return a.index - b.index; }).forEach(function (it, n) {
            var at = waveStart + n * .042;
            tl.to(it.fx, {
                y: -35, z: self.tier.waveZ, ry: 7, s: 1.04,
                duration: .34, ease: 'sine.inOut'
            }, at);
            tl.to(it.fx, {
                y: 0, z: 0, ry: 0, s: 1,
                duration: .42, ease: 'sine.inOut'
            }, at + .34);
        });

        // ---- 5. cards bunch into small decks, shift, then open again --
        // travelling left to right rather than all at once
        var groupStart = waveStart + vis.length * .042 + .35;
        var GROUP = 4;
        for (var g = 0; g < vis.length; g += GROUP) {
            (function (members, gi) {
                if (members.length < 2) return;
                var at = groupStart + gi * .3;
                var cx = 0, cy = 0, cz = 0;
                members.forEach(function (it) {
                    var r = self.railFor(it.index - self.focus);
                    cx += r.x; cy += r.y; cz += r.z;
                });
                cx /= members.length; cy /= members.length; cz /= members.length;

                members.forEach(function (it, k) {
                    // gather: a tidy little stack, each card a step behind the last
                    tl.to(it.base, {
                        x: cx + k * 7, y: cy + k * 5, z: cz + 60 - k * 16,
                        ry: -3 + k * 1.5, rz: -1 + k * .6, s: self.railFor(0).s * .94,
                        duration: .4, ease: 'power2.inOut'
                    }, at);
                    // drift as one body
                    tl.to(it.base, { x: '+=26', y: '-=10', duration: .26, ease: 'sine.inOut' }, at + .4);
                    // and open back out
                    var r = self.railFor(it.index - self.focus);
                    tl.to(it.base, Object.assign({ duration: .6, ease: 'power3.out' }, r), at + .66);
                    tl.call(function () { self.spawnTrail(it, Math.min(2, self.tier.trails), -1); }, null, at + .68);
                });
            })(vis.slice(g, g + GROUP), g / GROUP);
        }

        // ---- 6. everything lands
        var endAt = groupStart + Math.ceil(vis.length / GROUP) * .3 + .9;
        this.items.forEach(function (it) {
            var r = self.railFor(it.index - self.focus);
            tl.to(it.base, Object.assign({ duration: .5, ease: 'power2.out' }, r), endAt);
        });
    };

    ArchiveGallery.prototype.finishIntro = function () {
        this.introDone = true;
        this.interactive = true;
        this.clearTrails();
        this.updateHud();
        this.startIdle();
        var self = this;
        setTimeout(function () { if (self.hint) self.hint.classList.add('gone'); }, 3500);
    };

    /* ------------------------------------------------------------- idle */

    // Barely-there drift so the scene breathes without pulling focus.
    ArchiveGallery.prototype.startIdle = function () {
        if (!this.G || this.reduced) return;
        var self = this;
        this.stopIdle();
        this.items.forEach(function (it) {
            var j = jitter(it.index + 7);
            var dur = 4 + Math.abs(j.x) / 26 * 4;          // 4-8s
            it.idleTweens = [
                self.G.to(it.idle, { y: -4 - Math.abs(j.y) * .2, duration: dur, ease: 'sine.inOut',
                                     yoyo: true, repeat: -1, delay: Math.abs(j.z) / 150 * 2 }),
                self.G.to(it.idle, { z: 6 + Math.abs(j.x) * .3, duration: dur * 1.3, ease: 'sine.inOut',
                                     yoyo: true, repeat: -1, delay: Math.abs(j.y) / 20 * 2 }),
                self.G.to(it.idle, { ry: j.ry * .18, duration: dur * 1.6, ease: 'sine.inOut',
                                     yoyo: true, repeat: -1 })
            ];
        });
    };

    ArchiveGallery.prototype.stopIdle = function () {
        var self = this;
        this.items.forEach(function (it) {
            if (it.idleTweens) it.idleTweens.forEach(function (t) { t.kill(); });
            it.idleTweens = null;
            if (self.G) self.G.to(it.idle, { y: 0, z: 0, ry: 0, duration: .3 });
            else { it.idle.y = it.idle.z = it.idle.ry = 0; }
        });
    };

    /* -------------------------------------------------- navigation ---- */

    ArchiveGallery.prototype.setFocus = function (i, silent) {
        var self = this;
        i = clamp(i, 0, this.items.length - 1);
        if (i === this.focus) return;
        var dir = i > this.focus ? -1 : 1;
        this.focus = i;
        this.loadNear();

        this.items.forEach(function (it) {
            var r = self.railFor(it.index - self.focus);
            var d = Math.abs(it.index - self.focus);
            if (self.G) {
                self.G.to(it.base, Object.assign({
                    duration: .62, ease: 'power3.out', delay: Math.min(d, 6) * .022
                }, r));
            } else {
                for (var k in r) it.base[k] = r[k];
            }
        });
        if (!silent && !this.reduced) {
            var near = this.items.filter(function (it) { return Math.abs(it.index - self.focus) <= 2; });
            near.forEach(function (it) { self.spawnTrail(it, Math.min(2, self.tier.trails), dir); });
        }
        this.updateHud();
    };

    ArchiveGallery.prototype.updateHud = function () {
        var d = this.items[this.focus];
        if (!d) return;
        this.stId.textContent = d.data.id;
        this.stTitle.textContent = d.data.title;
        this.stN.textContent = String(this.focus + 1);
        this.items.forEach(function (it, i) {
            it.el.classList.toggle('is-focus', i === d.index);
        });
        var back = this.root.querySelector('[data-nav="-1"]');
        var next = this.root.querySelector('[data-nav="1"]');
        if (back) back.disabled = this.focus === 0;
        if (next) next.disabled = this.focus === this.items.length - 1;
    };

    /* ------------------------------------------------------ interaction */

    ArchiveGallery.prototype.on = function (el, type, fn, opts) {
        el.addEventListener(type, fn, opts);
        this._binds.push([el, type, fn, opts]);
    };

    ArchiveGallery.prototype.hoverCard = function (it, on) {
        if (!this.interactive || this.detailOpen) return;
        var self = this, G = this.G;
        it.el.classList.toggle('is-hover', on);

        var set = function (target, vars) {
            if (G) G.to(target, Object.assign({ duration: on ? .38 : .45, ease: on ? 'power3.out' : 'power2.out' }, vars));
            else Object.assign(target, vars);
        };
        // the card comes at you and squares up to the camera
        set(it.fx, on
            ? { z: 100, y: -15, s: 1.08, ry: -it.base.ry, rx: -it.base.rx }
            : { z: 0, y: 0, s: 1, ry: 0, rx: 0 });

        // and its neighbours make room
        var l = this.items[it.index - 1], r = this.items[it.index + 1];
        if (l) set(l.fx, { x: on ? -12 : 0 });
        if (r) set(r.fx, { x: on ? 12 : 0 });
        if (on && !this.reduced) self.spawnTrail(it, Math.min(2, this.tier.trails), -1);
    };

    ArchiveGallery.prototype.bindEvents = function () {
        var self = this;

        this.items.forEach(function (it) {
            self.on(it.el, 'pointerenter', function () { self.hoverCard(it, true); });
            self.on(it.el, 'pointerleave', function () { self.hoverCard(it, false); });
            self.on(it.el, 'click', function (e) {
                e.stopPropagation();
                if (!self.interactive || self.dragMoved) return;
                if (it.index !== self.focus) self.setFocus(it.index);
                else self.openDetail(it.index);
            });
        });

        // --- drag / swipe along the rail
        var dragging = false, startX = 0, acc = 0, id = null;
        this.on(this.root, 'pointerdown', function (e) {
            if (!self.interactive || self.detailOpen) return;
            if (e.target.closest('.archive-hud') || e.target.closest('.archive-detail')) return;
            dragging = true; self.dragMoved = false;
            startX = e.clientX; acc = 0; id = e.pointerId;
            self.root.classList.add('dragging');
            try { self.root.setPointerCapture(id); } catch (err) {}
        });
        this.on(this.root, 'pointermove', function (e) {
            if (dragging) {
                var dx = e.clientX - startX;
                if (Math.abs(dx) > 6) self.dragMoved = true;
                acc += dx; startX = e.clientX;
                var step = self.tier.spread * .62;
                while (Math.abs(acc) >= step) {
                    self.setFocus(self.focus - sign(acc), true);
                    acc -= sign(acc) * step;
                }
                // a little rotational give while the hand is down
                if (self.G) self.G.to(self.railFx, { ry: clamp(acc / step * 3, -3, 3), duration: .2 });
            } else if (self.interactive && !self.detailOpen) {
                // --- ambient parallax: the room shifts, the cards do not follow
                var b = self.root.getBoundingClientRect();
                var px = (e.clientX - b.left) / b.width * 2 - 1;
                var py = (e.clientY - b.top) / b.height * 2 - 1;
                if (self.G) self.G.to(self.railFx, { ry: px * 2, rx: -py * 1, duration: .9, ease: 'power2.out' });
                else { self.railFx.ry = px * 2; self.railFx.rx = -py; }
            }
        });
        var endDrag = function () {
            if (!dragging) return;
            dragging = false;
            self.root.classList.remove('dragging');
            if (self.G) self.G.to(self.railFx, { ry: 0, duration: .5, ease: 'power2.out' });
            setTimeout(function () { self.dragMoved = false; }, 30);
        };
        this.on(this.root, 'pointerup', endDrag);
        this.on(this.root, 'pointercancel', endDrag);
        this.on(this.root, 'pointerleave', function () {
            endDrag();
            if (self.G) self.G.to(self.railFx, { ry: 0, rx: 0, duration: .7, ease: 'power2.out' });
        });

        // --- wheel
        var wheelLock = 0;
        this.on(this.root, 'wheel', function (e) {
            if (!self.interactive || self.detailOpen) return;
            var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (Math.abs(d) < 4) return;
            e.preventDefault();
            var now = Date.now();
            if (now - wheelLock < 190) return;
            wheelLock = now;
            self.setFocus(self.focus + sign(d));
        }, { passive: false });

        // --- keyboard
        this._onKey = function (e) {
            if (self.destroyed || !self.interactive) return;
            if (!self.root.isConnected) return;
            // the XP shell marks a blurred window's titlebar .inactive --
            // don't steal arrow keys from whatever the user is actually using
            var win = self.root.closest('.window');
            var bar = win && win.querySelector('.window-titlebar');
            if (bar && bar.classList.contains('inactive')) return;
            var ae = document.activeElement;
            if (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) return;
            if (e.key === 'ArrowLeft')  { self.setFocus(self.focus - 1); e.preventDefault(); }
            else if (e.key === 'ArrowRight') { self.setFocus(self.focus + 1); e.preventDefault(); }
            else if (e.key === 'Home')  { self.setFocus(0); }
            else if (e.key === 'End')   { self.setFocus(self.items.length - 1); }
            else if (e.key === 'Enter') { self.openDetail(self.focus); }
            else if (e.key === 'Escape' && self.detailOpen) { self.closeDetail(); }
        };
        document.addEventListener('keydown', this._onKey);

        // --- HUD
        this.on(this.root, 'click', function (e) {
            var nav = e.target.closest('[data-nav]');
            if (nav) { self.setFocus(self.focus + parseInt(nav.dataset.nav, 10)); return; }
            var act = e.target.closest('[data-act]');
            if (!act) return;
            if (act.dataset.act === 'replay') self.replay();
            if (act.dataset.act === 'close') self.closeDetail();
        });

        // --- window resize / maximise
        if (window.ResizeObserver) {
            this._ro = new ResizeObserver(function () { self.onResize(); });
            this._ro.observe(this.root);
        } else {
            this._onWinResize = function () { self.onResize(); };
            window.addEventListener('resize', this._onWinResize);
        }
    };

    ArchiveGallery.prototype.onResize = function () {
        if (this.destroyed) return;
        var self = this;
        clearTimeout(this._rz);
        this._rz = setTimeout(function () {
            if (self.destroyed) return;
            var prev = self.tierName;
            self.measure();
            if (self.introDone || self.reduced || !self.G) self.settleAll(prev !== self.tierName);
        }, 140);
    };

    /* ------------------------------------------------------------ detail */

    ArchiveGallery.prototype.openDetail = function (i) {
        var self = this, it = this.items[i];
        if (!it || this.detailOpen) return;
        this.detailOpen = true;
        this.stopIdle();

        var img = this.detail.querySelector('img');
        img.src = it.data.image;                 // the original PNG, untouched
        this.detail.querySelector('.d-title').textContent = it.data.title;
        this.detail.querySelector('.d-id').textContent = it.data.id;

        // the chosen card comes forward, the rest sink back
        this.items.forEach(function (o) {
            var sel = o.index === i;
            var vars = sel
                ? { z: 250, s: 1.12, y: -10, ry: -o.base.ry, rx: -o.base.rx }
                : { z: -100, s: .96 };
            if (self.G) self.G.to(o.fx, Object.assign({ duration: .6, ease: 'power3.out' }, vars));
            else Object.assign(o.fx, vars);
            if (!sel) {
                if (self.G) self.G.to(o.base, { o: o.base.o * .45, duration: .5 });
                else o.base.o *= .45;
            }
        });
        setTimeout(function () { self.detail.classList.add('on'); }, self.reduced ? 0 : 260);
    };

    ArchiveGallery.prototype.closeDetail = function () {
        if (!this.detailOpen) return;
        var self = this;
        this.detailOpen = false;
        this.detail.classList.remove('on');
        this.items.forEach(function (o) {
            if (self.G) self.G.to(o.fx, { z: 0, y: 0, s: 1, ry: 0, rx: 0, duration: .5, ease: 'power2.out' });
            else Object.assign(o.fx, { z: 0, y: 0, s: 1, ry: 0, rx: 0 });
        });
        this.settleAll(false);
        setTimeout(function () {
            if (!self.destroyed && !self.detailOpen) self.startIdle();
        }, 550);
    };

    /* --------------------------------------------------------- lifecycle */

    ArchiveGallery.prototype.replay = function () {
        if (!this.G || this.reduced) { this.settleAll(true); return; }
        if (this.tl) this.tl.kill();
        this.stopIdle();
        this.clearTrails();
        this.closeDetail();
        this.interactive = false;
        this.introDone = false;
        if (this.hint) this.hint.classList.remove('gone');
        this.items.forEach(function (it) { it.el.classList.remove('is-hover'); });
        this.intro();
    };

    ArchiveGallery.prototype.start = function () {
        var self = this;
        this.loadNear();
        this.startTicker();
        this.bindEvents();

        if (!this.G || this.reduced) {
            // no cinematics: place the gallery and let people use it
            this.settleAll(true);
            this.interactive = true;
            this.introDone = true;
            if (this.hint) this.hint.classList.add('gone');
            this.updateHud();
            return;
        }
        this.updateHud();
        // wait for the first few images so the intro is not a stack of blanks
        var near = this.items.filter(function (it) {
            return Math.abs(it.index - self.focus) <= 2;
        });
        var left = near.length, fired = false;
        var go = function () {
            if (fired || self.destroyed) return;
            fired = true;
            self.intro();
        };
        near.forEach(function (it) {
            if (it.img.complete && it.img.naturalWidth) { if (--left <= 0) go(); return; }
            it.img.addEventListener('load',  function () { if (--left <= 0) go(); });
            it.img.addEventListener('error', function () { if (--left <= 0) go(); });
        });
        if (left <= 0) go();
        setTimeout(go, 1800);          // never hang on a slow image
    };

    ArchiveGallery.prototype.destroy = function () {
        this.destroyed = true;
        if (this.tl) this.tl.kill();
        this.stopIdle();
        this.clearTrails();
        if (this.G) {
            this.G.ticker.remove(this._tick);
            var self = this;
            this.items.forEach(function (it) {
                self.G.killTweensOf(it.base); self.G.killTweensOf(it.fx); self.G.killTweensOf(it.idle);
            });
            this.G.killTweensOf(this.railFx);
        }
        if (this._raf) cancelAnimationFrame(this._raf);
        if (this._ro) this._ro.disconnect();
        if (this._onWinResize) window.removeEventListener('resize', this._onWinResize);
        if (this._onKey) document.removeEventListener('keydown', this._onKey);
        this._binds.forEach(function (b) { b[0].removeEventListener(b[1], b[2], b[3]); });
        this._binds = [];
        clearTimeout(this._rz);
        this.root.innerHTML = '';
    };

    window.ArchiveGallery = ArchiveGallery;
})();
