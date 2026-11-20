/* ========================================
   ZEYN CINEMA — PIXEL ART
   Original pixel sprites drawn in code and rendered as crisp SVG
   (no image files, no fonts). Used by ZeynCinema.js; the desktop
   icon assets/icons/icon-cinema.svg is generated from the same bucket.
   ======================================== */

(function (root) {
    'use strict';

    // ---- palette: one character = one colour (optional CSS class for animation)
    const PAL = {
        k: '#2b1a12',   // outline
        r: '#e2392f', R: '#a8221d',   // bucket red / shade
        w: '#fff4e0', W: '#e6cfa8',   // cream / shade
        y: '#ffe58f', Y: '#f2b84b', o: '#e8962e', s: '#ffffff', // popcorn
        p: '#ff8fa3',   // blush
        t: '#ffb43c', T: '#e0861c', n: '#8a2a12', // ticket
        g: '#a9b3bf', G: '#dfe6ee', d: '#2c323b', D: '#454d58', // metal / slate
        m: '#5b0f1c', M: '#7d1a2a', // sign board
        a: { fill: '#ffd54a', cls: 'zc-bulb-a' },
        b: { fill: '#ffd54a', cls: 'zc-bulb-b' },
        x: { fill: '#ffe680', cls: 'zc-sign-glow' }, // sign text
        X: '#b5541a'    // sign text shadow
    };

    // ---- tiny grid helpers
    function grid(w, h) {
        const g = [];
        for (let y = 0; y < h; y++) g.push(new Array(w).fill('.'));
        g.w = w; g.h = h;
        return g;
    }
    function put(g, x, y, c) {
        if (x >= 0 && y >= 0 && x < g.w && y < g.h) g[y][x] = c;
    }
    function rows(lines) {
        const g = grid(lines[0].length, lines.length);
        lines.forEach((l, y) => [...l].forEach((c, x) => { g[y][x] = c; }));
        return g;
    }

    // Grid -> SVG. Horizontal runs of one colour are merged into one <rect>.
    function toSVG(g, opts = {}) {
        const out = [];
        for (let y = 0; y < g.h; y++) {
            let x = 0;
            while (x < g.w) {
                const c = g[y][x];
                if (c === '.' || !PAL[c]) { x++; continue; }
                let run = 1;
                while (x + run < g.w && g[y][x + run] === c) run++;
                const p = PAL[c];
                const fill = typeof p === 'string' ? p : p.fill;
                const cls = typeof p === 'string' ? '' : ` class="${p.cls}"`;
                out.push(`<rect x="${x}" y="${y}" width="${run}" height="1" fill="${fill}"${cls}/>`);
                x += run;
            }
        }
        const cls = opts.className ? ` class="${opts.className}"` : '';
        const label = opts.label ? ` role="img" aria-label="${opts.label}"` : ' aria-hidden="true" focusable="false"';
        return `<svg xmlns="http://www.w3.org/2000/svg"${cls} viewBox="0 0 ${g.w} ${g.h}" width="${g.w}" height="${g.h}" shape-rendering="crispEdges"${label}>${out.join('')}</svg>`;
    }

    // ---- 3x5-ish pixel font (variable width), only the glyphs we need
    const FONT = {
        A: ['010', '101', '111', '101', '101'], B: ['110', '101', '110', '101', '110'],
        C: ['011', '100', '100', '100', '011'], D: ['110', '101', '101', '101', '110'],
        E: ['111', '100', '110', '100', '111'], F: ['111', '100', '110', '100', '100'],
        G: ['0111', '1000', '1011', '1001', '0111'], H: ['101', '101', '111', '101', '101'],
        I: ['111', '010', '010', '010', '111'], K: ['101', '101', '110', '101', '101'],
        L: ['100', '100', '100', '100', '111'], M: ['10001', '11011', '10101', '10001', '10001'],
        N: ['1001', '1101', '1011', '1001', '1001'], O: ['0110', '1001', '1001', '1001', '0110'],
        P: ['110', '101', '110', '100', '100'], R: ['110', '101', '110', '101', '101'],
        S: ['011', '100', '010', '001', '110'], T: ['111', '010', '010', '010', '010'],
        U: ['101', '101', '101', '101', '111'], V: ['101', '101', '101', '101', '010'],
        W: ['10001', '10001', '10101', '11011', '10001'], Y: ['101', '101', '010', '010', '010'],
        Z: ['111', '001', '010', '100', '111'],
        0: ['111', '101', '101', '101', '111'], 1: ['010', '110', '010', '010', '111'],
        2: ['111', '001', '111', '100', '111'], 3: ['111', '001', '011', '001', '111'],
        4: ['101', '101', '111', '001', '001'], 5: ['111', '100', '111', '001', '111'],
        6: ['111', '100', '111', '101', '111'], 7: ['111', '001', '010', '010', '010'],
        8: ['111', '101', '111', '101', '111'], 9: ['111', '101', '111', '001', '111'],
        ' ': ['00', '00', '00', '00', '00'], '.': ['0', '0', '0', '0', '1'],
        '-': ['000', '000', '111', '000', '000'], '!': ['1', '1', '1', '0', '1'],
        '#': ['01010', '11111', '01010', '11111', '01010']
    };
    function textWidth(str) {
        let w = 0;
        [...str.toUpperCase()].forEach((ch, i) => { w += (FONT[ch] || FONT[' '])[0].length + (i ? 1 : 0); });
        return w;
    }
    function drawText(g, str, x0, y0, c, shadow) {
        let x = x0;
        [...str.toUpperCase()].forEach((ch) => {
            const gl = FONT[ch] || FONT[' '];
            gl.forEach((row, y) => [...row].forEach((bit, i) => {
                if (bit === '1') {
                    if (shadow) put(g, x + i + 1, y0 + y + 1, shadow);
                }
            }));
            gl.forEach((row, y) => [...row].forEach((bit, i) => {
                if (bit === '1') put(g, x + i, y0 + y, c);
            }));
            x += gl[0].length + 1;
        });
    }

    // Plain pixel text (used for the ZEYN CINEMA wordmark)
    function text(str, colour = 'w', shadow = 'k') {
        const g = grid(textWidth(str) + 1, 6);
        drawText(g, str, 0, 0, colour, shadow);
        return g;
    }

    // ---- POPCORN BUCKET (32 x 36) with a cute face
    function bucket() {
        const W = 32, H = 36, g = grid(W, H);
        const top = 18, bot = H - 1;
        const L = (y) => Math.round(3 + (y - top) * (4 / (bot - top)));
        const R = (y) => W - 1 - L(y);

        // popcorn mound: overlapping round kernels
        const kernels = [
            [5, 11], [10, 9], [16, 10], [22, 9], [27, 11], [8, 5],
            [14, 4], [20, 5], [25, 6], [12, 12], [19, 12], [17, 1]
        ];
        const owner = grid(W, H);
        kernels.forEach(([cx, cy], i) => {
            for (let y = cy - 3; y <= cy + 3; y++) {
                for (let x = cx - 3; x <= cx + 3; x++) {
                    const dx = x - cx, dy = y - cy;
                    if (dx * dx + dy * dy <= 10 && y < 14 && y >= 0) {
                        owner[y][x] = i;
                        const shade = dx + dy >= 3 ? 'Y' : (dx <= -1 && dy <= -1 && dx + dy <= -3 ? 's' : 'y');
                        put(g, x, y, shade);
                    }
                }
            }
        });
        // seams between kernels + outline around the mound
        for (let y = 0; y < 14; y++) {
            for (let x = 0; x < W; x++) {
                if (g[y][x] === '.') {
                    const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => {
                        const yy = y + b, xx = x + a;
                        return yy >= 0 && yy < 14 && xx >= 0 && xx < W && g[yy][xx] !== '.' && g[yy][xx] !== 'k';
                    });
                    if (n) g[y][x] = 'k';
                } else if (g[y][x] !== 'k' && x > 0 && owner[y][x] !== owner[y][x - 1] && owner[y][x - 1] !== '.' && g[y][x - 1] !== 'k') {
                    if ((x + y) % 2 === 0) g[y][x] = 'Y';
                }
            }
        }
        // butter drops
        [[9, 8], [21, 8], [15, 7], [26, 10], [6, 12]].forEach(([x, y]) => put(g, x, y, 'o'));

        // rim
        const rimL = L(top) - 1, rimR = R(top) + 1;
        for (let x = rimL; x <= rimR; x++) {
            put(g, x, 13, 'k');
            put(g, x, 14, x === rimL || x === rimR ? 'k' : 'w');
            put(g, x, 15, x === rimL || x === rimR ? 'k' : 'w');
            put(g, x, 16, x === rimL || x === rimR ? 'k' : 'W');
            put(g, x, 17, 'k');
        }
        // body with vertical stripes, narrowing to the base
        for (let y = top; y <= bot; y++) {
            const l = L(y), r = R(y);
            for (let x = l; x <= r; x++) {
                if (x === l || x === r || y === bot) { put(g, x, y, 'k'); continue; }
                const u = (x - l) / (r - l);
                const stripe = Math.floor(u * 7) % 2 === 0;
                const shaded = u > 0.82;
                put(g, x, y, stripe ? (shaded ? 'R' : 'r') : (shaded ? 'W' : 'w'));
            }
        }
        // cream label with the face
        for (let y = 21; y <= 31; y++) {
            for (let x = 9; x <= 22; x++) {
                const corner = (y === 21 || y === 31) && (x === 9 || x === 22);
                if (corner) continue;
                const edge = y === 21 || y === 31 || x === 9 || x === 22;
                put(g, x, y, edge ? 'k' : 'w');
            }
        }
        put(g, 10, 22, 'k'); put(g, 21, 22, 'k'); put(g, 10, 30, 'k'); put(g, 21, 30, 'k');
        // eyes (2x3, with a sparkle)
        [[12, 24], [18, 24]].forEach(([x, y]) => {
            put(g, x, y, 'k'); put(g, x + 1, y, 'k');
            put(g, x, y + 1, 'k'); put(g, x + 1, y + 1, 'k');
            put(g, x, y + 2, 'k'); put(g, x + 1, y + 2, 'k');
            put(g, x, y, 's');
        });
        // blush
        put(g, 10, 27, 'p'); put(g, 11, 27, 'p'); put(g, 20, 27, 'p'); put(g, 21, 27, 'p');
        // smile
        put(g, 14, 27, 'k'); put(g, 17, 27, 'k'); put(g, 15, 28, 'k'); put(g, 16, 28, 'k');
        return g;
    }

    // ---- single popped kernel (7 x 6)
    function kernel() {
        return rows([
            '..kkk..',
            '.kssyk.',
            'kysyyyk',
            'kyyyoYk',
            '.kyYYk.',
            '..kkk..'
        ]);
    }

    // ---- ADMIT ONE ticket (56 x 16)
    function ticket() {
        const W = 56, H = 16, g = grid(W, H);
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                const edge = y === 0 || y === H - 1 || x === 0 || x === W - 1;
                put(g, x, y, edge ? 'k' : (y >= H - 3 ? 'T' : 't'));
            }
        }
        // notches
        [[0, 6], [0, 7], [0, 8], [0, 9], [1, 7], [1, 8]].forEach(([x, y]) => {
            put(g, x, y, '.'); put(g, W - 1 - x, y, '.');
        });
        put(g, 1, 6, 'k'); put(g, 1, 9, 'k'); put(g, 2, 7, 'k'); put(g, 2, 8, 'k');
        put(g, W - 2, 6, 'k'); put(g, W - 2, 9, 'k'); put(g, W - 3, 7, 'k'); put(g, W - 3, 8, 'k');
        // perforation
        for (let y = 2; y < H - 2; y += 2) put(g, 11, y, 'T');
        // star on the stub
        [[5, 5], [4, 6], [5, 6], [6, 6], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [4, 8], [6, 8], [4, 9], [6, 9]]
            .forEach(([x, y]) => put(g, x + 1, y - 1, 'n'));
        drawText(g, 'ADMIT ONE', 15, 5, 'n');
        return g;
    }

    // ---- film reel (22 x 22)
    function reel() {
        const W = 22, H = 22, g = grid(W, H), c = 10.5;
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                const d = Math.hypot(x - c, y - c);
                if (d <= 10.6) put(g, x, y, d > 9.6 ? 'k' : (x + y < 16 ? 'G' : 'g'));
            }
        }
        for (let i = 0; i < 5; i++) {
            const a = -Math.PI / 2 + i * (Math.PI * 2 / 5);
            const hx = c + Math.cos(a) * 5.8, hy = c + Math.sin(a) * 5.8;
            for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
                const d = Math.hypot(x - hx, y - hy);
                if (d <= 2.6) put(g, x, y, d > 1.7 ? 'k' : 'd');
            }
        }
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
            const d = Math.hypot(x - c, y - c);
            if (d <= 1.9) put(g, x, y, 'k');
        }
        return g;
    }

    // ---- clapperboard: base (24 x 15) and hinged top stick (24 x 6)
    function clapperBase() {
        const W = 24, H = 15, g = grid(W, H);
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
            const edge = y === 0 || y === H - 1 || x === 0 || x === W - 1;
            put(g, x, y, edge ? 'k' : 'd');
        }
        for (let x = 1; x < W - 1; x++) put(g, x, 1, ((x >> 1) % 2) ? 'w' : 'd');
        [[3, 5, 12], [3, 8, 18], [3, 11, 9], [14, 11, 20]].forEach(([x0, y, x1]) => {
            for (let x = x0; x <= x1; x++) put(g, x, y, 'D');
        });
        drawText(g, 'ZC', 15, 4, 'w');
        return g;
    }
    function clapperTop() {
        const W = 24, H = 6, g = grid(W, H);
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
            const edge = y === 0 || y === H - 1 || x === 0 || x === W - 1;
            put(g, x, y, edge ? 'k' : (((x + y) % 6) < 3 ? 'w' : 'd'));
        }
        return g;
    }

    // ---- sparkle (5 x 5)
    function sparkle() {
        return rows(['..y..', '..Y..', 'yYsYy', '..Y..', '..y..']);
    }

    // ---- NOW SHOWING marquee board (70 x 24) with chasing bulbs
    function sign(str = 'NOW SHOWING') {
        const tw = textWidth(str);
        const W = Math.max(70, tw + 20), H = 24, g = grid(W, H);
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
            const outer = y === 0 || y === H - 1 || x === 0 || x === W - 1;
            const inner = y === 1 || y === H - 2 || x === 1 || x === W - 2;
            put(g, x, y, outer ? 'k' : inner ? 'M' : 'm');
        }
        let i = 0;
        for (let x = 3; x < W - 3; x += 3) { put(g, x, 3, i % 2 ? 'b' : 'a'); put(g, W - 1 - x, H - 4, i % 2 ? 'b' : 'a'); i++; }
        for (let y = 6; y < H - 5; y += 3) { put(g, 3, y, i % 2 ? 'b' : 'a'); put(g, W - 4, y, i % 2 ? 'a' : 'b'); i++; }
        drawText(g, str, Math.floor((W - tw) / 2), 9, 'x', 'X');
        return g;
    }

    const PixelArt = {
        toSVG, text,
        bucket, kernel, ticket, reel, clapperBase, clapperTop, sparkle, sign,
        svg(name, opts) {
            const fn = PixelArt[name];
            return toSVG(fn(), opts);
        }
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = PixelArt;
    else root.CinemaPixelArt = PixelArt;
})(typeof window !== 'undefined' ? window : globalThis);
