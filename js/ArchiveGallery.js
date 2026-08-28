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
                   scaleStep: .07, minScale: .72, visible: 5.5, lift: 10, tilt: 2 },
        tablet:  { cardW: 188, spread: 168, depth: 88,  focusZ: 26, angle: 9,  angleMax: 11,
                   scaleStep: .08, minScale: .74, visible: 4.5, lift: 8,  tilt: 2 },
        mobile:  { cardW: 148, spread: 132, depth: 54,  focusZ: 16, angle: 7,  angleMax: 9,
                   scaleStep: .09, minScale: .76, visible: 3.5, lift: 6,  tilt: 1 }
    };

    // where the gallery's own art lives (the card PNGs come with their paths
    // already resolved, this is only for board furniture)
    var ASSET_DIR = window.ARCHIVE_DIR || 'assets/projects/zeynep-archive/';

    var TRAIL_FADE = [1, .92, .82, .70, .56, .42, .28, .18];

    function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
    function sign(v) { return v < 0 ? -1 : (v > 0 ? 1 : 0); }

    // Small deterministic jitter so the far stack reads as many cards rather
    // than one. Same index always gives the same offsets, so the intro is
    // identical on every replay.
    function jitter(i) {
        var a = Math.sin(i * 12.9898) * 43758.5453;
        var b = Math.sin(i * 78.233)  * 12345.6789;
        var c = Math.sin(i * 45.164)  * 9876.54321;
        a -= Math.floor(a); b -= Math.floor(b); c -= Math.floor(c);
        return { x: (a - .5) * 26, y: (b - .5) * 20, z: (c - .5) * 150,
                 ry: (a - .5) * 9, rz: (b - .5) * 4 };
    }

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
        // lets global toasts (MSN) lift above the gallery's own bottom bar
        if (this.isMobile) document.body.classList.add('archive-mobile-open');
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
            '<div class="archive-mob">' +
              '<div class="m-title"></div><div class="m-id"></div><div class="m-dots"></div>' +
            '</div>' +
            '<div class="archive-debug done"><span class="p">STACK</span><span class="t">0.0s</span></div>' +
            '<div class="archive-hint">DEALING\u2026</div>' +
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
        this.dbg    = this.root.querySelector('.archive-debug');
        this.dbgP   = this.root.querySelector('.archive-debug .p');
        this.dbgT   = this.root.querySelector('.archive-debug .t');
        this.detail = this.root.querySelector('.archive-detail');
        this.stId    = this.root.querySelector('.st-id');
        this.stTitle = this.root.querySelector('.st-title');
        this.stN     = this.root.querySelector('.st-n');
        this.mTitle  = this.root.querySelector('.m-title');
        this.mId     = this.root.querySelector('.m-id');
        this.mDots   = this.root.querySelector('.m-dots');
        this.mob     = this.root.querySelector('.archive-mob');

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
        // 940, not 1024: the default 1000px window would otherwise fall into
        // the tablet tier and leave four cards sitting in the tray
        // A phone gets its own layout, not a shrunken desktop. The desktop
        // path below is untouched.
        this.isMobile = (w <= 700) || (h <= 430);
        this.root.classList.toggle('is-mobile', this.isMobile);

        var name = this.isMobile ? 'mobile' : (w < 940 ? 'tablet' : 'desktop');
        this.tierName = name;
        this.tier = Object.assign({}, TIERS[name]);

        if (this.isMobile) {
            // the active card IS the layout: 70% of the width, capped so it
            // never eats more than 58% of the height
            this.tier.cardW = Math.max(120, Math.round(Math.min(w * .70, (h * .52) / 1.5)));
            this.tier.visible = 2.6;
        } else {
            // keep the focused card inside the window whatever the window size is
            var fit = Math.min(this.tier.cardW, (h - 130) / 1.5, w * 0.30);
            this.tier.cardW = Math.max(96, Math.round(fit));
            var k = this.tier.cardW / TIERS[name].cardW;
            this.tier.spread = Math.round(this.tier.spread * k);
            this.tier.depth  = Math.round(this.tier.depth * k);
        }

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

    // Mobile browse state: one big card in the middle, a sliver of each
    // neighbour showing at the edges, everything else parked off-screen.
    // Continuous in `offset`, so a half-swiped card sits half way there. That
    // is what lets the rail follow the finger instead of jumping at a
    // threshold.
    ArchiveGallery.prototype.mobileRail = function (offset) {
        var d = offset < 0 ? -1 : 1;
        var a = Math.abs(offset);
        var W = this.root.clientWidth || 380;
        var cw = this.tier.cardW;

        var n1 = Math.min(a, 1);                 // 0..1  centre -> neighbour
        var n2 = Math.max(0, Math.min(a - 1, 1));// 0..1  neighbour -> outer
        var n3 = Math.max(0, Math.min(a - 2, 1));

        var s = 1 - .16 * n1 - .14 * n2;         // 1 -> .84 -> .70
        var unit = W / 2 + (cw * .84) * (.5 - .22);   // x when |offset| === 1
        var x = unit * n1 + (cw * .84 * .55) * n2 + (cw * .70 * .5) * n3;

        return {
            x:  d * x,
            y:  0,
            z:  -70 * n1 - 60 * n2,
            rx: 0,
            ry: -d * (13 * n1 + 3 * n2),
            rz: 0,
            s:  s,
            o:  1 - .68 * n2 - .32 * n3
        };
    };

    ArchiveGallery.prototype.railFor = function (offset) {
        if (this.isMobile) return this.mobileRail(offset);
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
            it.el.style.zIndex = String(it.zi != null
                ? Math.max(1, it.zi)
                : Math.max(1, 1000 + Math.round(b.z + f.z + d.z)));
            it.el.style.pointerEvents = b.o > .12 ? 'auto' : 'none';
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
        var self = this;
        // during the intro every card is on screen in some formation
        var r = radius != null ? radius
              : (this.introDone ? Math.ceil(this.tier.visible) + 2 : this.items.length);
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

    ArchiveGallery.prototype.clearTrails = function () {
        while (this.trails.length) {
            var t = this.trails.pop();
            if (this.G) this.G.killTweensOf(t.s);
            if (t.el.parentNode) t.el.parentNode.removeChild(t.el);
        }
    };

    /* ====================================================================
       INTRO STATE  vs  BROWSE STATE

       Two position systems that never mix. The intro places cards by
       formation and calls railFor() exactly once, in the final beat.
       Everything the browse state owns -- focus, hover, drag, idle -- stays
       switched off until enableCarousel().

       Beats, all sized off the stage so the cards fill it:
         0.00 STACK      the deck arrives and piles into the dealer tray
         0.65 BOARD      felt, slots lighting up left to right, lane captions
         1.15 DEAL       twenty cards dealt one at a time onto their slots
         2.60 TRAIL      four cards lift off, laying opaque diagonal ribbons
         3.50 FAN        the HAND lane opens along an arc
         4.20 WAVE       domino across the seated cards, left to right
         4.95 COLLECT    swept back to the tray; clones cleared, board dissolves
         5.55 CAROUSEL   fans out onto the rail
         6.45 done
       ==================================================================== */

    ArchiveGallery.prototype.settleAll = function (immediate) {
        var self = this;
        this.items.forEach(function (it) {
            if (!self.isMobile) it.zi = null;      // desktop keeps depth ordering
            var r = self.railFor(it.index - self.focus);
            if (immediate || !self.G) {
                for (var k in r) it.base[k] = r[k];
            } else {
                self.G.to(it.base, Object.assign({ duration: .6, ease: 'power2.out' }, r));
            }
        });
        this.updateHud();
    };

    // Intro geometry comes from the stage, never from the rail, so the
    // choreography fills whatever window it is given.
    ArchiveGallery.prototype.introSpace = function () {
        var W = this.root.clientWidth || 1000;
        var H = this.root.clientHeight || 640;
        var cw = this.tier.cardW || 200;          // one card at scale 1
        var ch = cw * 1.5;
        var P = 1050;                             // must match --perspective
        // Scale needed for a card to occupy f of the stage height ONCE the
        // perspective at depth z has magnified it. Without the z term the
        // near cards come out far too big.
        var sAt = function (f, z) { return (H * f) / (ch * (P / (P - (z || 0)))); };
        var m = this.tierName === 'mobile' ? .62 : (this.tierName === 'tablet' ? .84 : 1);
        return {
            W: W, H: H, cw: cw, ch: ch, m: m, P: P,
            halfW: W * .36,                    // cards reach +/-36vw
            halfH: H * .22,                    // and +/-22vh
            gap: Math.max(70, Math.min(120, W * .075)),   // clone-to-clone step
            sAt: sAt,
            deck: sAt(.56, 100),
            heroes:   this.tierName === 'mobile' ? 3 : 4,
            perTrail: this.tierName === 'mobile' ? 5 : 7
        };
    };

    /* ---- ribbons: created opaque, and they stay until COLLAPSE -------- */
    // anchor = where the card ends up, step = how far back each copy sits.
    // An explicit step vector (rather than sampling the card's path) is what
    // makes the ribbon read as a long diagonal instead of a tight deck.
    ArchiveGallery.prototype.spawnRibbon = function (it, anchor, step, n) {
        if (!it.loaded || n <= 0) return;
        for (var k = 1; k <= n; k++) {
            if (this.trails.length >= this.trailBudget) break;
            var el = document.createElement('div');
            el.className = 'archive-trail';
            el.style.setProperty('--acw', it.el.style.getPropertyValue('--acw'));
            el.style.setProperty('--ach', it.el.style.getPropertyValue('--ach'));
            el.appendChild(it.img.cloneNode(false));

            var curve = k * k * .045;            // slight bow, so it is not a ruler line
            var rec = { el: el, s: {
                x:  anchor.x + step.x * k + step.y * curve,
                y:  anchor.y + step.y * k - step.x * curve * .35,
                z:  anchor.z + step.z * k,
                ry: (anchor.ry || 0) + k * 2.2,
                rz: (anchor.rz || 0) - k * .9,
                s:  (anchor.s || 1) * (1 - k * .035),
                o:  TRAIL_FADE[k - 1] != null ? TRAIL_FADE[k - 1] : .18
            }};
            var st = rec.s;
            el.style.transform =
                'translate3d(' + st.x + 'px,' + st.y + 'px,' + st.z + 'px)' +
                ' rotateY(' + st.ry + 'deg) rotateZ(' + st.rz + 'deg) scale(' + st.s + ')';
            el.style.opacity = st.o;
            this.rail.appendChild(el);
            this.trails.push(rec);
        }
    };

    ArchiveGallery.prototype.removeTrailClones = function (dur) {
        var self = this, G = this.G;
        this.trails.slice().forEach(function (rec, i) {
            var kill = function () {
                var j = self.trails.indexOf(rec);
                if (j > -1) self.trails.splice(j, 1);
                if (rec.el.parentNode) rec.el.parentNode.removeChild(rec.el);
            };
            if (G) G.to(rec.s, { o: 0, x: rec.s.x * .25, y: rec.s.y * .25, z: rec.s.z - 120,
                                 duration: dur || .4, ease: 'power2.in',
                                 delay: (i % 6) * .01, onComplete: kill });
            else kill();
        });
    };

    /* ---------------------------------------------------------- the board
       Three lanes of slots lying on a tilted surface, plus the deck tray
       they are dealt from. boardLayout() is the single source of truth: the
       same numbers draw the outline and tell a card where to land, so a card
       can never sit off its slot. ------------------------------------- */

    var BOARD_TILT = 68;                       // degrees the surface lies back

    ArchiveGallery.prototype.boardLayout = function () {
        var S = this.introSpace();
        // Five per lane, not seven: seven cards of a readable size cannot sit
        // side by side without overlapping, and the lane was silently
        // squeezing the step instead of the card.
        // Fewer slots on a small screen: five per lane on a phone leaves the
        // cards about 55px wide, which is unreadable. Whatever does not fit
        // stays in the tray instead of being squeezed onto the table.
        if (this.isMobile) return this.boardLayoutMobile(S);
        var per = this.tierName === 'tablet' ? 4 : 5;
        var lanes = [
            { n: per, z:  200, frac: .46, tag: 'HAND' },
            { n: per, z:   10, frac: .40, tag: 'TABLE' },
            { n: per, z: -190, frac: .34, tag: 'STOCK' },
            { n: per, z: -400, frac: .28, tag: 'DECK' }
        ];
        var GAPR = 1.10;                       // step = 1.10 card widths -> a real gap
        var maxLaneW = S.W * .90;
        var baseY = S.H * .17;
        var slots = [];
        lanes.forEach(function (L, li) {
            var k = S.P / (S.P - L.z);         // perspective magnification at this depth
            var s = S.sAt(L.frac, L.z);
            var cardW = S.cw * s;
            // if the lane would not fit on screen, shrink the CARD, never the gap
            var needW = ((L.n - 1) * GAPR + 1) * cardW * k;
            if (needW > maxLaneW) { s *= maxLaneW / needW; cardW = S.cw * s; }
            var cardH = S.ch * s;
            var step = cardW * GAPR;
            var y = baseY - li * (S.H * .082);
            for (var c = 0; c < L.n; c++) {
                slots.push({
                    lane: li, col: c, tag: L.tag,
                    x: (c - (L.n - 1) / 2) * step,
                    y: y,                                   // the floor line
                    cy: y - cardH / 2,                      // where the card centres
                    z: L.z,
                    s: s, w: cardW, h: cardH,
                    ry: -(c - (L.n - 1) / 2) * 2.2
                });
            }
        });
        this.tray = {
            x: 0, y: baseY + S.H * .13, z: 340,
            s: S.sAt(.46, 340),
            w: S.cw * S.sAt(.46, 340) * 1.5,
            h: S.cw * S.sAt(.46, 340) * .72
        };
        return slots;
    };

    // Portrait board: two columns sheared into a diagonal so the cards spread
    // to the corners rather than sitting in one horizontal band.
    ArchiveGallery.prototype.boardLayoutMobile = function (S) {
        var slots = [];
        var cardW = S.cw * .52, cardH = S.ch * .52;
        var stepX = S.W * .30, stepY = S.H * .155;
        var baseY = S.H * .17;
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 2; c++) {
                var z = 140 - r * 210;
                var k = S.P / (S.P - z);
                var s = (S.H * (.30 - r * .04)) / (S.ch * k);
                slots.push({
                    lane: r, col: c, tag: ['HAND', 'TABLE', 'DECK'][r],
                    x: (c - .5) * stepX + (r - 1) * stepX * .42,
                    y: baseY - r * stepY,
                    cy: baseY - r * stepY - (S.ch * s) / 2,
                    z: z, s: s, w: S.cw * s, h: S.ch * s,
                    ry: -(c - .5) * 10
                });
            }
        }
        this.tray = {
            x: 0, y: S.H * .40, z: 300,
            s: S.sAt(.30, 300),
            w: S.cw * S.sAt(.30, 300) * 1.4,
            h: S.cw * S.sAt(.30, 300) * .7
        };
        return slots;
    };

    ArchiveGallery.prototype.buildBoard = function () {
        if (this.boardEl) this.boardEl.remove();
        var slots = this.slots = this.boardLayout();
        var S = this.introSpace();
        var b = document.createElement('div');
        b.className = 'archive-board';

        // felt: one flat plane under everything
        var felt = document.createElement('div');
        felt.className = 'archive-felt';
        var fw = S.W * 1.5, fh = S.H * 1.9;
        felt.style.width  = fw + 'px';
        felt.style.height = fh + 'px';
        felt.style.marginLeft = (-fw / 2) + 'px';
        felt.style.marginTop  = (-fh / 2) + 'px';
        felt.style.transform = 'translate3d(0,' + (S.H * .18) + 'px,-120px) rotateX(' + BOARD_TILT + 'deg)';
        b.appendChild(felt);

        // the ZEYN XP emblem, printed on the table like a card-room logo
        var logo = document.createElement('div');
        logo.className = 'archive-board-logo';
        logo.style.backgroundImage = 'url(' + ASSET_DIR + 'board-logo.png)';
        var lw = Math.min(S.W * .42, S.H * .95);
        logo.style.width = lw + 'px';
        logo.style.height = lw + 'px';
        logo.style.marginLeft = (-lw / 2) + 'px';
        logo.style.marginTop  = (-lw / 2) + 'px';
        logo.style.transform = 'translate3d(0,' + (S.H * .27) + 'px,70px) rotateX(' + BOARD_TILT + 'deg)';
        b.appendChild(logo);
        this.logoEl = logo;

        // one outline per slot, lying flat exactly where its card lands
        this.slotEls = slots.map(function (sl) {
            var d = document.createElement('div');
            d.className = 'archive-slot';
            d.style.width  = (sl.w * 1.04) + 'px';
            d.style.height = (sl.w * .66) + 'px';
            d.style.marginLeft = (-sl.w * 1.04 / 2) + 'px';
            d.style.marginTop  = (-sl.w * .66 / 2) + 'px';
            d.style.transform = 'translate3d(' + sl.x + 'px,' + sl.y + 'px,' + sl.z + 'px) rotateX(' + BOARD_TILT + 'deg)';
            d.innerHTML = '<i></i><i></i><i></i><i></i>';
            b.appendChild(d);
            return d;
        });

        // lane captions, like the labelled bays in the reference
        this.laneTags = [];
        [0, 1, 2, 3].forEach(function (li) {
            var first = slots.filter(function (s) { return s.lane === li; })[0];
            if (!first) return;
            var t = document.createElement('div');
            t.className = 'archive-lane-tag';
            t.textContent = first.tag;
            t.style.transform = 'translate3d(' + (first.x - first.w * .9) + 'px,' +
                                 (first.y - first.h - 14) + 'px,' + first.z + 'px)';
            b.appendChild(t);
            this.laneTags.push(t);
        }, this);

        // the deck tray the cards are dealt from
        var tr = document.createElement('div');
        tr.className = 'archive-tray';
        tr.style.width  = this.tray.w + 'px';
        tr.style.height = this.tray.h + 'px';
        tr.style.marginLeft = (-this.tray.w / 2) + 'px';
        tr.style.marginTop  = (-this.tray.h / 2) + 'px';
        tr.style.transform = 'translate3d(' + this.tray.x + 'px,' + this.tray.y + 'px,' +
                             this.tray.z + 'px) rotateX(' + BOARD_TILT + 'deg)';
        b.appendChild(tr);
        this.trayEl = tr;

        this.rail.insertBefore(b, this.rail.firstChild);
        this.boardEl = b;
    };

    ArchiveGallery.prototype.setIntroStackState = function () {
        var G = this.G, S = this.introSpace();
        this.items.forEach(function (it) {
            it.zi = null;                          // depth ordering during the intro
            var j = jitter(it.index);
            G.set(it.base, {
                x: j.x * .12, y: j.y * .12, z: -1400 + j.z * .08,
                rx: 10, ry: j.ry * .18, rz: j.rz * .25,
                s: S.deck * .10, o: 0
            });
            G.set(it.fx, { x: 0, y: 0, z: 0, rx: 0, ry: 0, s: 1 });
            G.set(it.idle, { y: 0, z: 0, ry: 0 });
        });
    };

    ArchiveGallery.prototype.beat = function (tl, at, name) {
        var self = this;
        tl.call(function () {
            if (!self.dbgP) return;
            self.dbgP.textContent = name;
            // real elapsed time, not the designed position -- if the two ever
            // disagree the label shows it straight away
            var real = self.introT0 ? (Date.now() - self.introT0) / 1000 : at;
            self.dbgT.textContent = real.toFixed(1) + 's / ' + at.toFixed(1) + 's';
        }, null, at);
    };

    // Short intro for a phone: same story beats, 3.7s instead of 6.45s, two
    // heroes instead of four, and it lands on the mobile centre-card rail.
    ArchiveGallery.prototype.introMobile = function () {
        var self = this, G = this.G, S = this.introSpace();
        var N = this.items.length;
        this.trailBudget = 10;

        this.buildBoard();
        var slots = this.slots, tray = this.tray;
        var seat = [], dealt = [], held = [];
        this.items.forEach(function (it, i) {
            if (i < slots.length) { seat[i] = Object.assign({}, slots[i], { si: i }); dealt.push(it); }
            else { seat[i] = null; held.push(it); }
        });

        this.setIntroStackState();
        this.introT0 = Date.now();
        var tl = G.timeline({ onComplete: function () { self.finishIntro(); } });
        this.tl = tl;

        /* 0.00-0.50  STACK */
        this.beat(tl, 0, 'STACK');
        this.items.forEach(function (it, i) {
            tl.to(it.base, { o: 1, duration: .26, ease: 'power1.out' }, i * .005);
        });
        this.items.forEach(function (it, i) {
            var j = jitter(it.index);
            tl.to(it.base, {
                x: tray.x + j.x * .08 + i * .9, y: tray.y - S.ch * tray.s * .5 - i * 1.2,
                z: tray.z + i * 1.8, rx: 4, ry: j.ry * .1, rz: j.rz * .2, s: tray.s,
                duration: .44, ease: 'power3.inOut'
            }, .04 + i * (.05 / N));
        });

        /* 0.50-0.90  BOARD */
        this.beat(tl, .5, 'BOARD');
        tl.to(this.boardEl, { opacity: 1, duration: .28 }, .5);
        tl.to(this.trayEl,  { opacity: 1, duration: .24 }, .52);
        this.slotEls.forEach(function (el, i) {
            tl.to(el, { opacity: 1,  duration: .16 }, .56 + i * .03);
            tl.to(el, { opacity: .36, duration: .18 }, .74 + i * .03);
        });

        /* 0.90-2.00  DEAL — corner to corner, not one band */
        this.beat(tl, .9, 'DEAL');
        dealt.slice().sort(function (a, b) {
            var A = seat[a.index], B = seat[b.index];
            return (A.lane - B.lane) || (A.col - B.col);
        }).forEach(function (it, n) {
            var sl = seat[it.index];
            var at = .9 + n * .14;
            tl.to(it.base, {
                x: (tray.x + sl.x) / 2, y: Math.min(tray.y, sl.cy) - S.H * .10,
                z: (tray.z + sl.z) / 2 + 70, rx: 3, ry: sl.ry * 2.2, rz: sl.ry * .7,
                s: sl.s * 1.12, duration: .16, ease: 'power2.out'
            }, at);
            tl.to(it.base, {
                x: sl.x, y: sl.cy, z: sl.z, rx: 2, ry: sl.ry, rz: 0, s: sl.s, o: 1,
                duration: .2, ease: 'power2.in'
            }, at + .16);
            tl.to(self.slotEls[sl.si], { opacity: 1,  duration: .08 }, at + .34);
            tl.to(self.slotEls[sl.si], { opacity: .3, duration: .24 }, at + .42);
        });

        /* 1.90-2.60  TRAIL — two heroes only */
        this.beat(tl, 1.9, 'TRAIL');
        [dealt[0], dealt[dealt.length - 1]].filter(Boolean).forEach(function (it, n) {
            var sx = n ? -1 : 1;
            var at = 1.9 + n * .16;
            var to = { x: sx * S.W * .24, y: -S.H * .16, z: 180,
                       ry: -sx * 12, rz: sx * 2, s: S.sAt(.40, 180) };
            var step = { x: -sx * S.gap * .8, y: S.gap * .40, z: -S.gap * .8 };
            tl.call(function () { self.spawnRibbon(it, to, step, 4); }, null, at + .16);
            tl.to(it.base, {
                x: to.x, y: to.y, z: to.z, rx: 2, ry: to.ry, rz: to.rz, s: to.s,
                duration: .38, ease: 'power3.out'
            }, at);
        });

        /* 2.60-3.05  WAVE */
        this.beat(tl, 2.6, 'WAVE');
        dealt.forEach(function (it, n) {
            var at = 2.6 + n * (.22 / Math.max(1, dealt.length));
            tl.to(it.fx, { y: -40, z: 120, ry: 7, s: 1.06, duration: .14, ease: 'power2.out' }, at);
            tl.to(it.fx, { y: 0, z: 0, ry: 0, s: 1, duration: .2, ease: 'power2.inOut' }, at + .14);
        });

        /* 3.05-3.70  COLLECT then straight onto the centre-card rail */
        this.beat(tl, 3.05, 'COLLECT');
        tl.call(function () { self.removeTrailClones(.26); }, null, 3.06);
        tl.to(this.boardEl, { opacity: 0, duration: .3, ease: 'power2.in' }, 3.1);
        this.beat(tl, 3.3, 'CAROUSEL');
        this.items.slice().sort(function (a, b) {
            return Math.abs(a.index - self.focus) - Math.abs(b.index - self.focus);
        }).forEach(function (it, n) {
            var r = self.railFor(it.index - self.focus);
            tl.to(it.base, Object.assign({ duration: .44, ease: 'power3.out' }, r),
                  3.15 + Math.min(n, 6) * .035);
        });
        tl.call(function () {}, null, 3.7);
    };

    ArchiveGallery.prototype.intro = function () {
        if (this.isMobile) return this.introMobile();
        var self = this, G = this.G, S = this.introSpace();
        var N = this.items.length;
        this.trailBudget = this.tierName === 'mobile' ? 12 : (this.tierName === 'tablet' ? 30 : 48);
        // dev readout: window.ARCHIVE_DEBUG = true before opening to show it
        if (this.dbg) this.dbg.classList.toggle('done', !window.ARCHIVE_DEBUG);

        this.buildBoard();
        var slots = this.slots;
        var tray = this.tray;

        // every card gets a seat on the board, front lane first
        // The table seats as many as it has slots; the rest stay in the tray
        // and rejoin at COLLECT. Works for any number of cards.
        var seat = [], dealt = [], held = [];
        this.items.forEach(function (it, i) {
            if (i < slots.length) {
                seat[i] = Object.assign({}, slots[i], { si: i });
                dealt.push(it);
            } else {
                seat[i] = null;
                held.push(it);
            }
        });

        this.setIntroStackState();
        this.introT0 = Date.now();
        var tl = G.timeline({ onComplete: function () { self.finishIntro(); } });
        this.tl = tl;

        /* ============ 0.00-0.65  STACK — the deck lands in the tray ==== */
        this.beat(tl, 0, 'STACK');
        this.items.forEach(function (it, i) {
            tl.to(it.base, { o: 1, duration: .3, ease: 'power1.out' }, i * .006);
        });
        this.items.forEach(function (it, i) {
            var j = jitter(it.index);
            tl.to(it.base, {
                x: tray.x + j.x * .10 + i * 1.1,
                y: tray.y - S.ch * tray.s * .5 - i * 1.6,     // stacked in the tray
                z: tray.z + i * 2.2,
                rx: 4, ry: j.ry * .12, rz: j.rz * .2,
                s: tray.s,
                duration: .6, ease: 'power3.inOut'
            }, .05 + i * (.08 / N));
        });

        /* ============ 0.65-1.15  BOARD — the table comes up ============ */
        this.beat(tl, .65, 'BOARD');
        tl.to(this.boardEl, { opacity: 1, duration: .38, ease: 'power2.out' }, .65);
        tl.to(this.trayEl,  { opacity: 1, duration: .3 }, .68);
        tl.to(this.logoEl,  { opacity: .55, duration: .5, ease: 'power2.out' }, .66);
        this.slotEls.forEach(function (el, i) {
            // light up, then settle back so the seat flash below actually reads
            tl.to(el, { opacity: 1,  duration: .18, ease: 'power1.out' }, .74 + i * .014);
            tl.to(el, { opacity: .38, duration: .22, ease: 'power1.inOut' }, .94 + i * .014);
        });
        this.laneTags.forEach(function (el, i) {
            tl.to(el, { opacity: 1, duration: .25 }, .84 + i * .07);
        });

        /* ============ 1.15-2.75  DEAL — one card at a time ==============
           Draw from the tray, short arc over the table, seat in the slot.
           Lane by lane, left to right; the next lane starts as the previous
           one finishes, so it never stalls. */
        this.beat(tl, 1.15, 'DEAL');
        var order = dealt.slice().sort(function (a, b) {
            var A = seat[a.index], B = seat[b.index];
            return (A.lane - B.lane) || (A.col - B.col);
        });
        order.forEach(function (it, n) {
            var sl = seat[it.index];
            var at = 1.15 + n * .062;
            // lift out of the tray and arc across the table
            tl.to(it.base, {
                x: (tray.x + sl.x) / 2,
                y: Math.min(tray.y, sl.cy) - S.H * .13,      // the top of the arc
                z: (tray.z + sl.z) / 2 + 90,
                rx: 3, ry: sl.ry * 2.4, rz: sl.ry * .8,
                s: sl.s * 1.14,
                duration: .2, ease: 'power2.out'
            }, at);
            // and drop onto the slot
            tl.to(it.base, {
                x: sl.x, y: sl.cy, z: sl.z,
                rx: 2, ry: sl.ry, rz: 0, s: sl.s, o: 1,
                duration: .24, ease: 'power2.in'
            }, at + .2);
            // the slot registers the card
            var slotEl = self.slotEls[sl.si];
            tl.to(slotEl, { opacity: 1, duration: .1, ease: 'power2.out' }, at + .4);
            tl.to(slotEl, { opacity: .3, duration: .3, ease: 'power2.out' }, at + .5);
        });

        // the tray visibly settles as cards leave it
        held.forEach(function (it, n) {
            tl.to(it.base, {
                x: tray.x + n * 1.4, y: tray.y - S.ch * tray.s * .5 - n * 1.9, z: tray.z + n * 2.4,
                duration: .4, ease: 'power2.out'
            }, 1.4 + n * .05);
        });

        /* ============ 2.60-3.50  TRAIL — heroes lift off the board ===== */
        this.beat(tl, 2.6, 'TRAIL');
        var heroes = [];
        var hN = Math.max(1, dealt.length);
        for (var h = 0; h < Math.min(S.heroes, hN); h++) {
            heroes.push(dealt[Math.round((h + .5) * (hN / Math.min(S.heroes, hN))) % hN]);
        }
        heroes.forEach(function (it, n) {
            var sx = n < 2 ? 1 : -1;
            var at = 2.6 + n * .13;
            var to = { x: sx * S.halfW * .80, y: -S.halfH * .78, z: 240,
                       ry: -sx * 13, rz: sx * 2, s: S.sAt(.58, 240) };
            var step = { x: -sx * S.gap, y: S.gap * .44, z: -S.gap * .92 };
            tl.call(function () { self.spawnRibbon(it, to, step, S.perTrail); }, null, at + .26);
            tl.to(it.base, {
                x: to.x, y: to.y, z: to.z, rx: 2, ry: to.ry, rz: to.rz, s: to.s,
                duration: .5, ease: 'power3.out'
            }, at);
        });

        /* ============ 3.50-4.20  FAN — the hand lane opens ============= */
        this.beat(tl, 3.5, 'FAN');
        var hand = dealt.filter(function (it) { return seat[it.index] && seat[it.index].lane === 0; });
        // Same fit solver as the lanes: work out the spread the fan needs, and
        // if it will not fit, shrink the CARD rather than closing the gap.
        var fanN = Math.max(1, hand.length);
        var fanK = S.P / (S.P - 200);
        var fanFit = 1;
        var fanCw = S.cw * S.sAt(.52, 200);
        var fanNeed = ((fanN - 1) * 1.12 + 1) * fanCw * fanK;
        var fanMax = S.W * .94;
        if (fanNeed > fanMax) { fanFit = fanMax / fanNeed; fanCw *= fanFit; }
        var fanSpread = (fanN - 1) / 2 * fanCw * 1.12;
        hand.forEach(function (it, n) {
            var t = (n - (hand.length - 1) / 2) / Math.max(1, (hand.length - 1) / 2);
            tl.to(it.base, {
                x: t * fanSpread,
                y: S.H * .06 + Math.abs(t) * S.H * .07,       // an arc, not a line
                z: 200 - Math.abs(t) * 150,
                rx: 2, ry: -t * 22, rz: t * 5,
                s: S.sAt(.52 - Math.abs(t) * .10, 200 - Math.abs(t) * 150) * fanFit,
                duration: .5, ease: 'power3.out'
            }, 3.5 + Math.abs(t) * .18 + n * .012);
        });

        /* ============ 4.20-4.95  WAVE — across the seated cards ======== */
        this.beat(tl, 4.2, 'WAVE');
        dealt.slice().sort(function (a, b) {
            return seat[a.index].x - seat[b.index].x;
        }).forEach(function (it, n) {
            var at = 4.2 + n * (.4 / Math.max(1, dealt.length));
            tl.to(it.fx, { y: -70, z: 180, ry: 8, s: 1.08, duration: .2, ease: 'power2.out' }, at);
            tl.to(it.fx, { y: 0, z: 0, ry: 0, s: 1, duration: .28, ease: 'power2.inOut' }, at + .2);
        });

        /* ============ 4.95-5.55  COLLECT — swept back to the tray ====== */
        this.beat(tl, 4.95, 'COLLECT');
        tl.call(function () { self.removeTrailClones(.34); }, null, 4.97);
        this.items.forEach(function (it, i) {
            var j = jitter(it.index);
            tl.to(it.base, {
                x: j.x * .8 + (i - N / 2) * S.W * .015,
                y: j.y * .8 + (i - N / 2) * S.H * .010,
                z: 150 - i * 22,
                rx: 4, ry: j.ry * .4, rz: j.rz * .4,
                s: S.sAt(.62, 150 - i * 22) * (1 - i * .003), o: 1,
                duration: .44, ease: 'power3.inOut'
            }, 4.95 + i * .008);
        });
        // the table dissolves as the cards leave it
        tl.to(this.boardEl, { opacity: 0, duration: .45, ease: 'power2.in' }, 5.05);

        /* ============ 5.55-6.45  CAROUSEL ============================== */
        this.beat(tl, 5.55, 'CAROUSEL');
        this.items.slice().sort(function (a, b) {
            return Math.abs(a.index - self.focus) - Math.abs(b.index - self.focus);
        }).forEach(function (it, n) {
            var r = self.railFor(it.index - self.focus);
            tl.to(it.base, Object.assign({ duration: .6, ease: 'power3.out' }, r),
                  5.55 + n * .012);
        });
        tl.call(function () {}, null, 6.45);
    };

    ArchiveGallery.prototype.finishIntro = function () {
        this.introDone = true;
        this.interactive = true;
        this.allowTrails = false;          // browse mode is quiet: no more ribbons
        this.activeIndex = this.labelIndex = this.focus;   // a card is definitively active
        this.isTransitioning = false;
        this.writeLabels(this.activeIndex);
        this.showLabel(true);              // labels fade in only after the intro
        if (this.boardEl) { this.boardEl.remove(); this.boardEl = null; }
        if (this.dbg) { this.dbgP.textContent = 'BROWSE'; this.dbgT.textContent = 'intro done'; }
        this.clearTrails();
        this.updateHud();
        this.startIdle();
        var self = this;
        if (this.hint) this.hint.textContent = this.isMobile
            ? '\u2190  SWIPE TO EXPLORE  \u2192'
            : 'DRAG \u00b7 SCROLL \u00b7 ARROW KEYS \u00b7 CLICK TO OPEN';
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

    ArchiveGallery.prototype.setFocus = function (i) {
        var self = this;
        i = clamp(i, 0, this.items.length - 1);
        if (i === this.focus) return;
        if (this.isMobile) { this.snapMobile(i - this.focus); return; }
        this.focus = i;
        this.loadNear();

        this.items.forEach(function (it) {
            var r = self.railFor(it.index - self.focus);
            var d = Math.abs(it.index - self.focus);
            if (self.G) {
                self.G.to(it.base, Object.assign({
                    duration: self.isMobile ? .40 : .42,
                    ease: 'power3.out',
                    delay: self.isMobile ? Math.min(d, 2) * .02 : Math.min(d, 6) * .012
                }, r));
            } else {
                for (var k in r) it.base[k] = r[k];
            }
        });
        this.updateHud();
    };

    // Live drag: rewrite every base from a fractional offset. No tweens here --
    // the finger is the clock.
    ArchiveGallery.prototype.applyMobileDrag = function (frac) {
        var self = this;
        var near = Math.round(this.focus - frac);        // the card closest to centre
        this.items.forEach(function (it) {
            var off = it.index - self.focus + frac;
            var r = self.mobileRail(off);
            for (var k in r) it.base[k] = r[k];
            // Half way through a swipe both cards sit at the same depth, so a
            // z-index derived from z ties and the paint order flips. Rank them
            // by distance from centre instead.
            it.zi = 1000 - Math.round(Math.abs(off) * 40);
            it.el.classList.toggle('is-focus', it.index === near);
        });
    };

    ArchiveGallery.prototype.snapMobile = function (deltaIndex) {
        var self = this;
        var target = clamp(this.focus + deltaIndex, 0, this.items.length - 1);
        var moved = target !== this.focus;
        this.focus = target;
        this.loadNear();

        if (moved) this.showLabel(false);          // nothing is named mid-flight

        // Swipe twice quickly and the second snap would otherwise run on top of
        // the first, both writing the same numbers. Token + overwrite makes the
        // newest swipe the only one that counts.
        var token = (this._snapToken = (this._snapToken || 0) + 1);
        if (moved) this.isTransitioning = true;
        var land = function () {
            // only the newest swipe is allowed to publish an index
            if (self.destroyed || token !== self._snapToken) return;
            self.isTransitioning = false;
            self.activeIndex = self.labelIndex = self.focus;   // the card has landed
            self.writeLabels(self.activeIndex);
            self.showLabel(true);
        };

        this.items.forEach(function (it) {
            var off = it.index - self.focus;
            var r = self.mobileRail(off);
            it.zi = 1000 - Math.round(Math.abs(off) * 40);   // never a tie
            if (self.G) {
                var vars = Object.assign({
                    duration: .34, ease: 'power3.out', overwrite: 'auto'
                }, r);
                if (off === 0) vars.onComplete = land;
                self.G.to(it.base, vars);
            } else {
                for (var k in r) it.base[k] = r[k];
            }
        });
        if (!this.G || !moved) land();
        this.updateHud();
    };

    // Every surface that names a card is written from ONE index, so the label
    // and the picture can never disagree.
    ArchiveGallery.prototype.writeLabels = function (i) {
        var d = this.items[i];
        if (!d) return;
        this.stId.textContent = d.data.id;
        this.stTitle.textContent = d.data.title;
        this.stN.textContent = String(i + 1);
        if (this.mTitle) {
            this.mTitle.textContent = d.data.title;
            this.mId.textContent = d.data.id;
            if (this.mDots.childElementCount !== this.items.length) {
                this.mDots.innerHTML = this.items.map(function () { return '<i></i>'; }).join('');
            }
            var kids = this.mDots.children;
            for (var q = 0; q < kids.length; q++) kids[q].classList.toggle('on', q === i);
        }
    };

    // Mobile only: hide the label while a card is in flight, show it once one
    // has landed. Desktop keeps it on permanently.
    // One switch for every surface that names a card: the title block, the
    // file id in the bottom bar and the counter. They fade and return together,
    // so no frame can show one card's picture with another card's name.
    ArchiveGallery.prototype.showLabel = function (on) {
        if (!this.isMobile) return;
        var v = on ? '1' : '0';
        if (this.mob) this.mob.style.opacity = v;
        var st = this.root.querySelector('.archive-hud .status');
        var ct = this.root.querySelector('.archive-hud .count');
        if (st) st.style.opacity = v;
        if (ct) ct.style.opacity = v;
    };

    ArchiveGallery.prototype.updateHud = function () {
        // On mobile the labels follow the card that has ARRIVED (labelIndex),
        // not the one being swiped toward -- otherwise the old name sits under
        // the new picture for the length of the transition.
        var li = (this.isMobile && this.activeIndex != null) ? this.activeIndex : this.focus;
        this.writeLabels(li);

        var showFocus = this.introDone;      // no caption mid-choreography
        var f = this.focus;
        this.items.forEach(function (it, i) {
            it.el.classList.toggle('is-focus', showFocus && i === f);
        });
        var back = this.root.querySelector('[data-nav="-1"]');
        var next = this.root.querySelector('[data-nav="1"]');
        if (back) back.disabled = li === 0;
        if (next) next.disabled = li === this.items.length - 1;
    };

    /* ------------------------------------------------------ interaction */

    ArchiveGallery.prototype.on = function (el, type, fn, opts) {
        el.addEventListener(type, fn, opts);
        this._binds.push([el, type, fn, opts]);
    };

    ArchiveGallery.prototype.hoverCard = function (it, on) {
        if (!this.interactive || this.detailOpen) return;
        if (this.isMobile) return;                 // touch uses tap, not hover
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
        var pressed = false, dragging = false, lastX = 0, acc = 0, id = null, travel = 0;
        this.on(this.root, 'pointerdown', function (e) {
            if (!self.interactive || self.detailOpen) return;
            if (e.target.closest('.archive-hud') || e.target.closest('.archive-detail')) return;
            // Deliberately NOT capturing here. Pointer capture retargets the
            // click that follows to the capture element, so the card's own
            // click handler would never fire and clicking would do nothing.
            pressed = true; dragging = false; self.dragMoved = false;
            lastX = e.clientX; acc = 0; travel = 0; id = e.pointerId;
        });
        this.on(this.root, 'pointermove', function (e) {
            if (pressed) {
                var dx = e.clientX - lastX;
                lastX = e.clientX;
                travel += Math.abs(dx);          // total distance, not per-event jitter
                if (!dragging) {
                    if (travel < 11) return;     // still a click, not a drag
                    dragging = true;
                    self.dragMoved = true;
                    self.root.classList.add('dragging');
                    try { self.root.setPointerCapture(id); } catch (err) {}
                    // a snap may still be running from the last swipe -- the
                    // finger takes over, so stop it writing over us
                    if (self.G) self.items.forEach(function (it) { self.G.killTweensOf(it.base); });
                }
                acc += dx;
                if (self.isMobile) {
                    // follow the finger: one card per ~72% of the card width
                    var unit = Math.max(70, self.tier.cardW * .55);
                    self.dragFrac = clamp(-acc / unit, -1.15, 1.15);
                    self.vel = dx;
                    if (Math.abs(self.dragFrac) > .12) self.showLabel(false);
                    self.applyMobileDrag(self.dragFrac);
                    return;
                }
                var step = self.tier.spread * .62;
                while (Math.abs(acc) >= step) {
                    self.setFocus(self.focus - sign(acc));
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
            if (!pressed) return;
            pressed = false;
            if (!dragging) return;               // a plain click: leave it alone
            dragging = false;
            if (self.isMobile) {
                var f = self.dragFrac || 0;
                // a quick flick counts even if the finger did not travel far
                if (Math.abs(self.vel || 0) > 6) f += sign(self.vel) * -.35;
                var step = Math.round(clamp(f, -1, 1));
                if (step === 0) self.showLabel(true);
                self.snapMobile(step);
                acc = 0; self.dragFrac = 0; self.vel = 0;
                self.root.classList.remove('dragging');
                try { self.root.releasePointerCapture(id); } catch (err) {}
                setTimeout(function () { self.dragMoved = false; }, 30);
                return;
            }
            self.root.classList.remove('dragging');
            try { self.root.releasePointerCapture(id); } catch (err) {}
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
            if (e.key === 'ArrowLeft')  {
                e.preventDefault();
                if (self.detailOpen) self.stepDetail(-1); else self.setFocus(self.focus - 1);
            }
            else if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (self.detailOpen) self.stepDetail(1); else self.setFocus(self.focus + 1);
            }
            else if (e.key === 'Home')  { if (!self.detailOpen) self.setFocus(0); }
            else if (e.key === 'End')   { if (!self.detailOpen) self.setFocus(self.items.length - 1); }
            else if (e.key === 'Enter') { if (!self.detailOpen) self.openDetail(self.focus); }
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
            // Re-measuring mid-intro would resize the cards while the timeline
            // still holds slot targets from the old geometry, so they would
            // drift off their slots. Leave the intro alone; it is 6s long.
            if (self.tl && self.tl.isActive && self.tl.isActive()) return;
            var prev = self.tierName;
            self.measure();
            self.sizeDetail();
            if (self.introDone || self.reduced || !self.G) self.settleAll(prev !== self.tierName);
        }, 140);
    };

    /* ------------------------------------------------------------ detail */

    // Swap the picture without closing, so the arrow keys the panel advertises
    // actually browse.
    // Bound the picture to the stage in real pixels. With width/height auto the
    // browser scales it proportionally inside that box, so the aspect ratio of
    // the original PNG is preserved whatever its size.
    ArchiveGallery.prototype.sizeDetail = function () {
        var img = this.detail && this.detail.querySelector('img');
        if (!img) return;
        var w = this.root.clientWidth  || 900;
        var h = this.root.clientHeight || 600;
        if (this.isMobile) {
            img.style.maxWidth  = Math.max(120, Math.round(w * .90 - 28)) + 'px';
            img.style.maxHeight = Math.max(120, Math.round(h - 168)) + 'px';
        } else {
            img.style.maxWidth  = Math.max(120, Math.round(w - 96)) + 'px';
            img.style.maxHeight = Math.max(120, Math.round(h - 176)) + 'px';
        }
    };

    ArchiveGallery.prototype.showDetailCard = function (i) {
        var it = this.items[i];
        if (!it) return;
        this.detailIndex = i;
        var img = this.detail.querySelector('img');
        // 1400px delivery copy by default -- the original PNG is ~2 MB per card,
        // which is a slow tap on a phone. Switch in ArchiveData.js to serve it.
        var key = window.ARCHIVE_DETAIL_SOURCE || 'web';
        img.src = it.data[key] || it.data.image;
        this.detail.querySelector('.d-title').textContent = it.data.title;
        this.detail.querySelector('.d-id').textContent = it.data.id;
        this.sizeDetail();
    };

    ArchiveGallery.prototype.stepDetail = function (dir) {
        if (!this.detailOpen) return;
        var i = clamp(this.detailIndex + dir, 0, this.items.length - 1);
        if (i === this.detailIndex) return;
        this.showDetailCard(i);
        this.focus = i;
        this.updateHud();
    };

    ArchiveGallery.prototype.openDetail = function (i) {
        var self = this, it = this.items[i];
        if (!it || this.detailOpen) return;
        this.detailOpen = true;
        this.stopIdle();
        this.showDetailCard(i);

        // the chosen card comes forward, the rest sink back
        this.items.forEach(function (o) {
            var sel = o.index === i;
            var vars = sel
                ? { z: 250, s: 1.12, y: -10, ry: -o.base.ry, rx: -o.base.rx }
                : { z: -100, s: .96 };
            if (self.G) self.G.to(o.fx, Object.assign({ duration: .45, ease: 'power3.out' }, vars));
            else Object.assign(o.fx, vars);
            if (!sel) {
                if (self.G) self.G.to(o.base, { o: o.base.o * .45, duration: .5 });
                else o.base.o *= .45;
            }
        });
        setTimeout(function () { self.detail.classList.add('on'); }, self.reduced ? 0 : 170);
    };

    ArchiveGallery.prototype.closeDetail = function () {
        if (!this.detailOpen) return;
        var self = this;
        this.detailOpen = false;
        this.detailIndex = null;
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
        if (!this.G) { this.settleAll(true); return; }
        if (this.tl) this.tl.kill();
        this.stopIdle();
        this.clearTrails();
        if (this.boardEl) { this.boardEl.remove(); this.boardEl = null; }
        this.closeDetail();
        this.interactive = false;
        this.introDone = false;
        if (this.hint) {
            this.hint.textContent = 'DRAG \u00b7 SCROLL \u00b7 ARROW KEYS \u00b7 CLICK TO OPEN';
            this.hint.classList.remove('gone');
        }
        this.items.forEach(function (it) { it.el.classList.remove('is-hover'); });
        this.intro();
    };

    ArchiveGallery.prototype.start = function () {
        var self = this;
        this.loadNear();
        this.startTicker();
        this.bindEvents();

        this.skipReason = !this.G ? 'GSAP NOT LOADED'
                        : (this.reduced ? 'REDUCED MOTION IS ON' : null);
        if (this.skipReason) {
            // Never fail silently -- if the intro is skipped, say why, and
            // leave Replay able to force it.
            this.settleAll(true);
            this.interactive = true;
            this.introDone = true;
            // finishIntro() never runs on this path, so publish the active card
            // here or the mobile labels would stay faded out for good
            this.activeIndex = this.labelIndex = this.focus;
            this.isTransitioning = false;
            this.writeLabels(this.activeIndex);
            this.showLabel(true);
            this.updateHud();
            if (this.hint) {
                this.hint.textContent = 'INTRO SKIPPED \u2014 ' + this.skipReason +
                                        (this.G ? '  \u00b7  PRESS REPLAY TO PLAY IT ANYWAY' : '');
                this.hint.classList.remove('gone');
            }
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
        document.body.classList.remove('archive-mobile-open');
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
