// ============================================
// PHOTOS PAGE
// Builds photos.html from window.PHOTOS_CONFIG (js/photos.config.js)
// and runs the bits CSS can't: hero scroll progress, pointer/tilt depth,
// on-screen video autoplay and the viewer.
// ============================================
(function () {
    'use strict';

    const CFG = window.PHOTOS_CONFIG;
    const root = document.getElementById('photos');
    if (!CFG || !root) return;

    const PAPER = '#f7f4ef';
    const LAYOUTS = ['iris', 'gallery', 'collage', 'cinema', 'grid'];

    // ============================================
    // DRAWN STAND-INS (shown until a src is set)
    // ============================================
    const draw = {
        rng(seed) {
            let s = seed | 0;
            return () => {
                s = (s + 0x6d2b79f5) | 0;
                let t = Math.imul(s ^ (s >>> 15), 1 | s);
                t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
                return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            };
        },

        ridge(seed, W, H, o) {
            const r = this.rng(seed), P = Math.PI, fq = o.fq || 1, sharp = o.sharp == null ? 1 : o.sharp;
            const floor = o.floor == null ? H : o.floor, x0 = o.x0 || 0, x1 = o.x1 == null ? W : o.x1, n = o.n || 96;
            const ph = [r() * 6.283, r() * 6.283, r() * 6.283, r() * 6.283];
            const f = o.smooth
                ? [(2 + r() * 2) * P * fq, (4.5 + r() * 4) * P * fq, (14 + r() * 6) * P, 0]
                : [(1.1 + r() * 1.3) * P * fq, (2.6 + r() * 2.4) * P * fq, (7 + r() * 4) * P, (18 + r() * 9) * P];
            const pts = [];
            for (let i = 0; i <= n; i++) {
                const t = i / n, x = x0 + t * (x1 - x0), u = x / W;
                let v = o.smooth
                    ? Math.pow(0.5 + 0.5 * Math.sin(u * f[0] + ph[0]), 1.7) * 0.62 + Math.pow(0.5 + 0.5 * Math.sin(u * f[1] + ph[1]), 2) * 0.3 + Math.sin(u * f[2] + ph[2]) * 0.025
                    : (1 - Math.abs(Math.sin(u * f[0] + ph[0]))) * 0.58 + (1 - Math.abs(Math.sin(u * f[1] + ph[1]))) * 0.3 * sharp + Math.sin(u * f[2] + ph[2]) * 0.07 + Math.sin(u * f[3] + ph[3]) * 0.035 * sharp;
                if (o.taper) v *= Math.pow(Math.sin(P * t), 0.5);
                pts.push([x, o.base - v * o.amp]);
            }
            const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
            const d = 'M' + x0.toFixed(1) + ' ' + floor + ' ' + line.replace(/^M/, 'L') + ' L' + x1.toFixed(1) + ' ' + floor + ' Z';
            return { d, line, pts };
        },

        trees(pts, seed, count, k, hmin, hmax) {
            const r = this.rng(seed * 13 + 5);
            let d = '';
            for (let i = 0; i < count; i++) {
                const p = pts[Math.floor(r() * pts.length)];
                const h = (hmin + r() * (hmax - hmin)) * k, w = h * 0.42, x = p[0], y = p[1] + 3 * k;
                d += 'M' + (x - w / 2).toFixed(1) + ' ' + y.toFixed(1) + ' L' + x.toFixed(1) + ' ' + (y - h).toFixed(1) + ' L' + (x + w / 2).toFixed(1) + ' ' + y.toFixed(1) + ' Z '
                    + 'M' + (x - w * 0.36).toFixed(1) + ' ' + (y - h * 0.4).toFixed(1) + ' L' + x.toFixed(1) + ' ' + (y - h * 1.12).toFixed(1) + ' L' + (x + w * 0.36).toFixed(1) + ' ' + (y - h * 0.4).toFixed(1) + ' Z ';
            }
            return d;
        },

        scene(uid, seed, kind, mood, W, H, n) {
            const PAL = {
                dawn: { sky: ['#fdd9c9', '#fff3ea'], f: ['#f4c6c2', '#e3a0ae', '#b98aa8', '#7d6a96'], sea: '#e9a9b9', sand: '#fbe3d3', head: '#c79ab3' },
                day: { sky: ['#b9dcf6', '#eef8ff'], f: ['#cfe2f0', '#a6c7e1', '#7fa5c8', '#5a80a8'], sea: '#6cc0de', sand: '#f6e7c9', head: '#86b49b' },
                haze: { sky: ['#e6e2f1', '#f8f6fb'], f: ['#dad3e8', '#c0b6d5', '#9f94bc', '#776c98'], sea: '#b3b8dc', sand: '#efe8f0', head: '#a99cc2' },
                golden: { sky: ['#ffdca2', '#fff3d6'], f: ['#f5cf92', '#e5b277', '#c99263', '#916c5c'], sea: '#f1b98e', sand: '#fde9c7', head: '#c99a6c' },
                mint: { sky: ['#d8f0e6', '#f5fcf8'], f: ['#c1e2cf', '#98c9ae', '#6aab8b', '#3c7c63'], sea: '#7fcdc0', sand: '#eef3df', head: '#6aab8b' },
                sand: { sky: ['#ffe3c2', '#fff6ea'], f: ['#f8d2a2', '#f0b880', '#e29a63', '#c27a4c'], sea: '#7fc6cf', sand: '#fbe4c2', head: '#e29a63' },
                tropic: { sky: ['#c3eaf6', '#f0fbfe'], f: ['#bfe3ea', '#93cdd6', '#5fb1bd', '#3b8f99'], sea: '#4fbfcd', sand: '#fbeacb', head: '#7dbf9f' },
                sunset: { sky: ['#ffc4ab', '#ffe9d4'], f: ['#f6b3a8', '#e48d98', '#bf7590', '#8a5f80'], sea: '#e8a3b0', sand: '#f7dcc6', head: '#c48aa2' }
            };
            const p = PAL[mood] || PAL.day, k = H / 400, r = this.rng(seed * 7 + 3), sw = W / 600;
            const o = {
                uid, s0: p.sky[0], s1: p.sky[1], sun: '#ffffff', rimInk: '#ffffff', ink: '#ffffff', foam: '#ffffff', sea: p.sea,
                d1: '', d2: '', d3: '', d4: '', f1: '#fff', f2: '#fff', f3: '#fff', f4: '#fff', rim: '', seaY: 0, seaH: 0, glint: '', waves: '', trail: '', trees: ''
            };
            let cx = (0.2 + r() * 0.6) * W, cy = (0.14 + r() * 0.16) * H, cr = (18 + r() * 20) * k;
            const layer = (j, base, amp, opt) => this.ridge(seed * 11 + j, W, H, Object.assign({ base: base * k, amp: amp * k, n }, opt));
            if (kind === 'coast') {
                const hz = H * 0.56, left = r() < 0.5;
                if (mood === 'sunset') { cy = hz - cr * 0.3; cr *= 1.5; cx = (0.35 + r() * 0.3) * W; }
                const head = this.ridge(seed * 11 + 1, W, H, { base: hz, amp: 70 * k, sharp: 0.7, floor: hz, x0: left ? -20 * sw : W * 0.58, x1: left ? W * 0.42 : W + 20 * sw, taper: true, n });
                const shore = this.ridge(seed * 11 + 3, W, H, { base: H * 0.88, amp: H * 0.07, smooth: true, n });
                const sand = this.ridge(seed * 11 + 3, W, H, { base: H * 0.88 + 6 * k, amp: H * 0.07, smooth: true, n });
                Object.assign(o, { d1: head.d, f1: p.head, d3: shore.d, f3: '#ffffff', d4: sand.d, f4: p.sand, seaY: hz.toFixed(1), seaH: (H - hz).toFixed(1) });
                let g = '';
                for (let j = 0; j < 11; j++) {
                    const y = hz + (3 + j * 6) * k, w = (46 - j * 3) * k * (0.45 + r() * 0.7);
                    g += 'M' + (cx - w / 2).toFixed(1) + ' ' + y.toFixed(1) + ' h' + w.toFixed(1) + ' v' + (1.6 * k).toFixed(1) + ' h' + (-w).toFixed(1) + ' Z ';
                }
                o.glint = g;
                let wv = '';
                for (let j = 0; j < 6; j++) {
                    const y = hz + (H - hz) * Math.pow(0.1 + j * 0.13, 1.25), a = (1 + j * 0.5) * k;
                    for (let x = 0; x <= W; x += 20 * sw) wv += (x ? ' L' : ' M') + x.toFixed(1) + ' ' + (y + Math.sin(x / (18 * sw) + j * 1.7) * a).toFixed(1);
                }
                o.waves = wv;
            } else {
                const dune = kind === 'dune', trail = kind === 'trail', peak = kind === 'peak';
                const base = dune ? [235, 285, 335, 385] : trail ? [215, 265, 320, 372] : [250, 295, 345, 392];
                const amp = dune ? [70, 80, 90, 80] : trail ? [118, 104, 90, 70] : [190, 170, 140, 90];
                const sharp = peak ? 1.15 : 0.8;
                const R = [0, 1, 2, 3].map((j) => layer(j + 1, base[j], amp[j], { smooth: dune, sharp: j === 3 ? sharp * 0.7 : sharp }));
                Object.assign(o, { d1: R[0].d, d2: R[1].d, d3: R[2].d, d4: R[3].d, f1: p.f[0], f2: p.f[1], f3: p.f[2], f4: p.f[3], rim: R[1].line });
                if (dune) { cr *= 1.6; cy = (0.2 + r() * 0.15) * H; }
                if (trail) {
                    const x0 = (0.42 + r() * 0.2) * W;
                    o.trail = 'M' + x0.toFixed(1) + ' ' + H + ' C ' + (0.18 * W).toFixed(1) + ' ' + (H - 34 * k).toFixed(1) + ', ' + (0.74 * W).toFixed(1) + ' ' + (H - 52 * k).toFixed(1) + ', ' + (0.5 * W).toFixed(1) + ' ' + (H - 64 * k).toFixed(1)
                        + ' S ' + (0.36 * W).toFixed(1) + ' ' + (H - 84 * k).toFixed(1) + ', ' + (0.54 * W).toFixed(1) + ' ' + (H - 94 * k).toFixed(1);
                    o.trees = this.trees(R[3].pts, seed, 18, k, 12, 30);
                }
            }
            o.cx = cx.toFixed(1); o.cy = cy.toFixed(1); o.cr = cr.toFixed(1); o.gr = (cr * 2.3).toFixed(1);
            return o;
        },

        topo(seed) {
            const r = this.rng(seed * 17 + 9), ph = [r() * 6.28, r() * 6.28, r() * 6.28];
            let d = '';
            for (let k = 1; k <= 13; k++) {
                const R = 22 + k * 27;
                for (let i = 0; i <= 120; i++) {
                    const a = (i / 120) * Math.PI * 2;
                    const w = 1 + 0.16 * Math.sin(a * 2 + ph[0] + k * 0.15) + 0.09 * Math.sin(a * 3 + ph[1] - k * 0.1) + 0.05 * Math.sin(a * 5 + ph[2]);
                    d += (i ? 'L' : 'M') + (400 + Math.cos(a) * R * w).toFixed(1) + ' ' + (400 + Math.sin(a) * R * w * 0.86).toFixed(1) + ' ';
                }
                d += 'Z ';
            }
            return d;
        },

        mix(a, b, t) {
            const h = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
            const A = h(a), B = h(b);
            return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
        }
    };

    // ============================================
    // DATA
    // ============================================
    const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const pad = (n) => String(n).padStart(2, '0');
    const ratioOf = (m) => {
        const [a, b] = String(m.ratio || (m.type === 'video' ? '16/9' : '3/2')).split('/').map(Number);
        return [a || 3, b || 2];
    };

    function build() {
        const all = [];
        const places = CFG.places || [];
        let prevTint = PAPER;

        const chapters = places.map((c, ci) => {
            const accent = c.accent || '#e0632f';
            const tint = draw.mix(accent, '#ffffff', 0.9);
            const lay = LAYOUTS.indexOf(c.layout) >= 0 ? c.layout : 'grid';
            const media = (c.media || []).map((m, pi) => {
                const i = all.length, video = m.type === 'video', [a, b] = ratioOf(m), ratio = a / b;
                const p = Object.assign(draw.scene('p' + i, i + 4, m.scene || 'peak', m.mood || 'day', 600, 400, 72), {
                    i, num: pad(i + 1), title: m.title || '', meta: [m.place, m.date].filter(Boolean).join(' · '),
                    label: m.alt || m.title || (video ? 'video' : 'photo'), kind: video ? 'video' : 'photo',
                    src: m.src || '', poster: m.poster || '', isVideo: video,
                    kb: video && !m.src ? 'kb' : '', badge: (video ? 'Video · ' : '') + a + ':' + b + (m.src ? '' : ' · placeholder'),
                    chapter: c.name || '', ar: a + ' / ' + b, ratio, wideAr: ratio >= 1.6 ? a + ' / ' + b : '21 / 9',
                    w: ratio < 0.7 ? 'min(17rem, 50vw)' : ratio < 1 ? 'min(21rem, 58vw)' : 'min(34rem, 80vw)',
                    dy: ['-2rem', '3rem', '-3.5rem', '2rem', '-1rem', '3rem'][pi % 6], z: pi % 2 ? '70px' : '0px',
                    cls: lay === 'collage' ? ['cA', 'cB', 'cC'][pi % 3] : '', m: [2, 6, 3][pi % 3]
                });
                if (pi === 0) p.big = draw.scene('b' + i, i + 4, m.scene || 'peak', m.mood || 'day', 1600, 900, 150);
                all.push(p);
                return p;
            });
            const rest = media.slice(1);
            if (lay !== 'collage') (lay === 'grid' ? media : rest).forEach((p, j) => { p.cls = j % 2 ? 'stag' : ''; });
            const name = c.name || '';
            const vw = Math.min(16, 92 / Math.max(4, name.length) / 0.8);
            const nx = places[ci + 1];
            const ch = {
                id: c.id || 'place-' + (ci + 1), num: pad(ci + 1), name, region: c.region || '', story: c.story || '',
                facts: Object.keys(c.facts || {}).map((k) => ({ k, v: c.facts[k] })),
                accent, accentInk: draw.mix(accent, '#1d1b22', 0.4), tint, prevTint, lay,
                nameSize: 'clamp(3rem, ' + vw.toFixed(2) + 'vw, 16rem)', topo: draw.topo(ci + 3),
                lead: media[0], rest, photos: media,
                countLabel: media.length + (media.length === 1 ? ' frame' : ' frames'),
                nextId: nx ? nx.id || 'place-' + (ci + 2) : 'sheet', nextName: nx ? nx.name : CFG.contactSheet.title,
                nextAccent: nx ? nx.accent || '#1d1b22' : '#1d1b22'
            };
            prevTint = tint;
            return ch;
        });

        // statement: words in [brackets] take the places' colours in turn
        const toks = CFG.statement.text.split(/\s+/).filter(Boolean);
        const step = 76 / Math.max(1, toks.length);
        let hi = 0;
        const words = toks.map((t, i) => {
            const m = t.match(/^\[(.+?)\](.*)$/);
            const c = m ? (chapters.length ? chapters[hi++ % chapters.length].accent : '#e0632f') : '#1d1b22';
            return { t: m ? m[1] + m[2] : t, c, a: (i * step).toFixed(1) + '%', b: (i * step + 10).toFixed(1) + '%' };
        });

        // hero wall: columns of frames drifting up and down behind the title
        const hc = CFG.hero.collage && CFG.hero.collage.length ? CFG.hero.collage : places.reduce((a, c) => a.concat(c.media || []), []);
        const pool = hc.map((m, i) => {
            const video = m.type === 'video', [a, b] = ratioOf(m);
            return Object.assign(draw.scene('h' + i, i + 4, m.scene || 'peak', m.mood || 'day', 600, 400, 60), {
                ar: a + ' / ' + b, src: m.src || '', poster: m.poster || '',
                isImg: !video && !!m.src, isPoster: video && !!m.src && !!m.poster, isLoop: video && !!m.src && !m.poster
            });
        });
        const per = Math.max(6, Math.ceil(pool.length / 5) + 2);
        const heroCols = pool.length ? [0, 1, 2, 3, 4].map((c) => {
            const tiles = [];
            for (let k = 0; k < per; k++) tiles.push(pool[(k * 5 + c * 2) % pool.length]);
            return {
                tiles: tiles.concat(tiles), cls: c >= 3 ? 'hide-sm' : '', dir: c % 2 ? 'reverse' : 'normal', dur: [70, 88, 62, 96, 78][c] + 's',
                off: ['-4rem', '-16rem', '-1rem', '-11rem', '-7rem'][c], pm: ['-12rem', '9rem', '-18rem', '11rem', '-9rem'][c]
            };
        }) : [];

        const rev = all.slice().reverse();
        return {
            all, chapters, words, heroCols,
            roll: all.concat(all), roll2: rev.concat(rev), lastTint: prevTint,
            sheetTint: chapters.length ? draw.mix(chapters[0].accent, '#ffffff', 0.78) : '#ffe1d2'
        };
    }

    // ============================================
    // TEMPLATES
    // ============================================
    function stand(o, W, H, rim, align) {
        return '<svg class="media" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="' + (align || 'xMidYMid') + ' slice" aria-hidden="true">'
            + '<defs><linearGradient id="' + o.uid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + o.s0 + '"/><stop offset="1" stop-color="' + o.s1 + '"/></linearGradient></defs>'
            + '<rect width="' + W + '" height="' + H + '" fill="url(#' + o.uid + ') ' + o.s0 + '"/>'
            + '<circle cx="' + o.cx + '" cy="' + o.cy + '" r="' + o.gr + '" fill="' + o.sun + '" opacity="0.35"/>'
            + '<circle cx="' + o.cx + '" cy="' + o.cy + '" r="' + o.cr + '" fill="' + o.sun + '"/>'
            + '<path d="' + o.d1 + '" fill="' + o.f1 + '"/><path d="' + o.d2 + '" fill="' + o.f2 + '"/>'
            + '<path class="' + rim + '" d="' + o.rim + '" stroke="' + o.rimInk + '"/>'
            + '<rect y="' + o.seaY + '" width="' + W + '" height="' + o.seaH + '" fill="' + o.sea + '"/>'
            + '<path d="' + o.glint + '" fill="' + o.sun + '" opacity="0.8"/><path class="wv" d="' + o.waves + '" stroke="' + o.foam + '"/>'
            + '<path d="' + o.d3 + '" fill="' + o.f3 + '"/><path d="' + o.d4 + '" fill="' + o.f4 + '"/>'
            + '<path class="tr" d="' + o.trail + '" stroke="' + o.ink + '"/><path d="' + o.trees + '" fill="' + o.f4 + '"/></svg>';
    }

    const PLAY = '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1l7 4-7 4z" fill="currentColor"/></svg>';

    // what goes inside a frame: the photo, the video, or the stand-in
    function media(p, big, align) {
        if (p.src && !p.isVideo) return '<img class="media" src="' + esc(p.src) + '" alt="" loading="lazy">';
        if (p.src) return '<video class="media" data-auto src="' + esc(p.src) + '"' + (p.poster ? ' poster="' + esc(p.poster) + '"' : '') + ' loop muted playsinline preload="metadata"></video>';
        return '<div class="fill ' + p.kb + '">' + (big ? stand(p.big, 1600, 900, 'hrim', align) : stand(p, 600, 400, 'rim')) + '</div>';
    }

    // strips show stills only: the photo, a video's poster, or the stand-in
    function thumb(p) {
        if (p.src && !p.isVideo) return '<img class="media" src="' + esc(p.src) + '" alt="" loading="lazy">';
        if (p.src && p.poster) return '<img class="media" src="' + esc(p.poster) + '" alt="" loading="lazy">';
        return stand(p, 600, 400, 'rim');
    }

    function frame(p, cls, ar, inner, badge) {
        return '<button type="button" class="frame ' + cls + '" data-open="' + p.i + '" aria-label="Open ' + p.kind + ' ' + p.num + ': ' + esc(p.label) + '" style="aspect-ratio: ' + ar + '; background: ' + p.s0 + '">'
            + inner + (p.isVideo ? (badge || '<span class="vbadge">' + PLAY + esc(p.badge) + '</span>') : '') + '</button>';
    }

    function cap(p, ch) {
        return '<figcaption class="figcap"><span class="figcap-l"><span class="mono" style="color: ' + ch.accentInk + '">' + p.num + '</span><span class="figcap-title">' + esc(p.title) + '</span></span>'
            + '<span class="mono figcap-meta">' + esc(p.meta) + '</span></figcaption>';
    }

    const gridFig = (p, ch) => '<figure class="fig unfold ' + p.cls + '">' + frame(p, '', p.ar, '<div class="px"><div class="zoom">' + media(p) + '</div></div>') + cap(p, ch) + '</figure>';

    function heroHTML(d) {
        const h = CFG.hero;
        const cols = d.heroCols.map((col) => '<div class="hcol ' + col.cls + '" style="margin-top: ' + col.off + '; --pm: ' + col.pm + '">'
            + '<div class="hcol-track" style="--dur: ' + col.dur + '; --dir: ' + col.dir + '">'
            + col.tiles.map((t) => '<div class="htile" style="aspect-ratio: ' + t.ar + '; background: ' + t.s0 + '">'
                + (t.isImg ? '<img class="media" src="' + esc(t.src) + '" alt="" loading="lazy">'
                    : t.isPoster ? '<img class="media" src="' + esc(t.poster) + '" alt="" loading="lazy">'
                        : t.isLoop ? '<video class="media" data-auto src="' + esc(t.src) + '" loop muted playsinline preload="metadata"></video>'
                            : stand(t, 600, 400, 'rim'))
                + '</div>').join('')
            + '</div></div>').join('');
        return '<div class="hero-wrap" id="hero">'
            + '<header class="hero" aria-label="' + esc(h.title + ' ' + h.by) + ' — photographs and films">'
            + '<div class="hcollage" aria-hidden="true">' + cols + '</div>'
            + '<div class="hfade" aria-hidden="true"></div>'
            + '<h1 class="mega htitle"><span class="hbig">' + esc(String(h.title || '').toUpperCase()) + '</span><span class="hby">' + esc(h.by) + '</span></h1>'
            + '<div class="hreveal"><span class="mono muted">' + d.all.length + ' frames · ' + d.chapters.length + ' places</span><p>' + esc(h.reveal) + '</p></div>'
            + '<div class="hero-meta">'
            + '<p class="hero-sub">' + esc(h.subtitle) + '</p>'
            + '<a class="hcue" href="#intro" aria-label="Scroll down to the photos"><span class="mono">Scroll</span>'
            + '<span class="hcue-btn"><svg class="ic hbob" width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path d="M12 4v15M6 13l6 6 6-6"/></svg></span></a>'
            + '<p class="mono hero-kicker">' + esc(h.kicker) + '</p>'
            + '</div></header></div>';
    }

    function statementHTML(d) {
        return '<section id="intro" class="stmt" aria-label="Introduction"><div class="stmt-pin">'
            + '<div class="stmt-block"><p class="mono muted">' + esc(CFG.statement.label) + '</p>'
            + '<p class="stmt-text">' + d.words.map((w) => '<span class="w" style="--a: ' + w.a + '; --b: ' + w.b + '; --c: ' + w.c + '">' + esc(w.t) + '</span>').join(' ') + '</p></div>'
            + '<nav class="pidx" aria-label="Places">' + d.chapters.map((c) => '<a href="#' + esc(c.id) + '">'
                + '<span class="pidx-dot" aria-hidden="true" style="background: ' + c.accent + '"></span>'
                + '<span class="pidx-name"><b>' + esc(c.name) + '</b><span class="mono muted" style="letter-spacing: 0.08em">' + esc(c.region) + '</span></span>'
                + '<span class="mono muted">' + c.num + ' · ' + c.countLabel + '</span></a>').join('') + '</nav>'
            + '</div></section>';
    }

    function chapterHTML(ch, total) {
        const L = ch.lead;
        let body = '';
        if (L && ch.lay === 'iris') {
            body = '<div class="iris"><div class="iris-pin">'
                + frame(L, 'iclip', 'auto', '<div class="iscene fill">' + media(L, true, 'xMidYMax') + '</div>')
                + '<p class="mono ihint">Keep scrolling</p>'
                + '<div class="icap"><div class="icap-l"><span class="mono">' + L.num + ' · ' + esc(ch.name) + '</span><span class="icap-title">' + esc(L.title) + '</span></div><span class="mono">' + esc(L.meta) + '</span></div>'
                + '</div></div>'
                + '<div class="grid grid--after-iris">' + ch.rest.map((p) => gridFig(p, ch)).join('') + '</div>';
        } else if (ch.lay === 'gallery') {
            body = '<div class="hwrap"><div class="hpin">'
                + '<div class="wall-head"><span class="mono" style="color: ' + ch.accentInk + '">' + esc(ch.name) + ' — ' + ch.countLabel + '</span>'
                + '<div class="wall-bar" aria-hidden="true"><div class="hbar" style="background: ' + ch.accent + '"></div></div></div>'
                + '<div class="wall-tilt"><div class="htrack">'
                + ch.photos.map((p) => '<figure class="fig" style="width: ' + p.w + '; translate: 0 ' + p.dy + ' ' + p.z + '">'
                    + frame(p, '', p.ar, '<div class="zoom">' + media(p) + '</div>') + cap(p, ch) + '</figure>').join('')
                + '<div class="wall-next"><span class="mono muted">Next</span><a class="mega" href="#' + esc(ch.nextId) + '" style="color: ' + ch.nextAccent + '">' + esc(ch.nextName) + ' ↓</a></div>'
                + '</div></div></div></div>';
        } else if (ch.lay === 'collage') {
            body = '<div class="collage" style="--accent: ' + ch.accent + '">'
                + '<div class="mega slide collage-word" aria-hidden="true">' + esc(ch.name) + '</div>'
                + '<div class="collage-stack">' + ch.photos.map((p) => '<figure class="fig sp ' + p.cls + '" style="--m: ' + p.m + '">'
                    + frame(p, 'rv', p.ar, '<div class="px"><div class="zoom">' + media(p) + '</div></div>') + cap(p, ch) + '</figure>').join('') + '</div>'
                + '</div>';
        } else if (L && ch.lay === 'cinema') {
            body = '<div class="cinema"><figure class="fig cinema-lead">'
                + frame(L, 'curtain', L.wideAr, '<div class="px"><div class="zoom">' + media(L, true) + '</div></div>') + cap(L, ch) + '</figure>'
                + '<div class="grid grid--after-cinema">' + ch.rest.map((p) => gridFig(p, ch)).join('') + '</div></div>';
        } else {
            body = '<div class="grid">' + ch.photos.map((p) => gridFig(p, ch)).join('') + '</div>';
        }
        return '<section class="chapter" id="' + esc(ch.id) + '" aria-labelledby="' + esc(ch.id) + '-title" style="background: linear-gradient(180deg, ' + ch.prevTint + ' 0rem, ' + ch.tint + ' 18rem)">'
            + '<div class="ch-open">'
            + '<svg class="topo" aria-hidden="true" viewBox="0 0 800 800"><path class="tl" d="' + ch.topo + '" stroke="' + ch.accent + '"/></svg>'
            + '<div class="ch-head">'
            + '<div class="ch-meta"><span class="mono" style="color: ' + ch.accentInk + '">' + ch.num + ' / ' + total + '</span><span class="mono muted">' + esc(ch.region) + '</span></div>'
            + '<h2 class="mega ch-name" id="' + esc(ch.id) + '-title" style="font-size: ' + ch.nameSize + '; color: ' + ch.accent + '"><span class="rise">' + esc(ch.name) + '</span></h2>'
            + '<div class="ch-row"><p class="ch-story">' + esc(ch.story) + '</p>'
            + '<dl class="ch-facts">' + ch.facts.map((f) => '<div><dt class="mono muted">' + esc(f.k) + '</dt><dd>' + esc(f.v) + '</dd></div>').join('') + '</dl></div>'
            + '</div></div>' + body + '</section>';
    }

    function sheetHTML(d) {
        const s = CFG.contactSheet;
        const rollA = d.roll.map((p) => '<div class="roll">' + frame(p, '', '3 / 2', '<div class="zoom">' + thumb(p) + '</div>', '<span class="vbadge vbadge--sm">' + PLAY + '</span>')
            + '<span class="mono">' + p.num + 'A ▸ ' + esc(p.chapter) + '</span></div>').join('');
        const rollB = d.roll2.map((p) => '<div class="roll">' + frame(p, '', '3 / 2', '<div class="zoom">' + thumb(p) + '</div>', ' ')
            + '<span class="mono">' + p.num + 'B</span></div>').join('');
        return '<section class="sheet" id="sheet" aria-labelledby="sheet-title" style="background: linear-gradient(180deg, ' + d.lastTint + ' 0rem, ' + PAPER + ' 16rem)">'
            + '<div class="sheet-head"><div><span class="mono muted" style="padding-top: 0.45rem">' + pad(d.chapters.length + 1) + '</span>'
            + '<h2 class="mega" id="sheet-title"><span class="rise">' + esc(s.title) + '</span></h2></div><p>' + esc(s.blurb) + '</p></div>'
            + '<div class="strip strip--a"><div class="perf perf--top" aria-hidden="true"></div><div class="marq">' + rollA + '</div><div class="perf perf--bottom" aria-hidden="true"></div></div>'
            + '<div class="strip strip--b" style="background: ' + d.sheetTint + '"><div class="perf perf--top" aria-hidden="true"></div><div class="marq rev">' + rollB + '</div><div class="perf perf--bottom" aria-hidden="true"></div></div>'
            + '</section>';
    }

    // ============================================
    // RENDER
    // ============================================
    const data = build();
    const total = pad(data.chapters.length);
    root.innerHTML = heroHTML(data) + statementHTML(data) + data.chapters.map((ch) => chapterHTML(ch, total)).join('') + sheetHTML(data);

    const prog = document.querySelector('.prog');
    if (prog && data.chapters.length) prog.style.background = data.chapters[0].accent;

    // ============================================
    // VIEWER
    // ============================================
    const lb = document.getElementById('lb');
    let open = -1, opener = null;

    function renderLB() {
        const p = data.all[open];
        const lbw = 'min(100%, calc((100svh - 13rem) * ' + p.ratio.toFixed(4) + '))';
        const inner = p.src && !p.isVideo ? '<img class="media" src="' + esc(p.src) + '" alt="' + esc(p.label) + '">'
            : p.src ? '<video class="media" src="' + esc(p.src) + '"' + (p.poster ? ' poster="' + esc(p.poster) + '"' : '') + ' controls autoplay playsinline></video>'
                : '<div class="fill ' + p.kb + '">' + stand(Object.assign({}, p, { uid: 'lb' + p.uid }), 600, 400, 'rim') + '</div>';
        lb.innerHTML = '<div class="lb-bar"><span class="mono muted">' + p.num + ' / ' + data.all.length + ' · ' + esc(p.chapter) + '</span>'
            + '<button type="button" class="icon-btn" data-lb="close" aria-label="Close viewer"><svg class="ic" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>'
            + '<div class="lb-stage"><div class="lb-frame" style="width: ' + lbw + '; aspect-ratio: ' + p.ar + '; background: ' + p.s0 + '">' + inner
            + (p.isVideo ? '<span class="vbadge">' + PLAY + esc(p.badge) + '</span>' : '') + '</div></div>'
            + '<div class="lb-foot"><div><span class="lb-title">' + esc(p.title) + '</span><span class="mono muted" style="letter-spacing: 0.08em">' + esc(p.meta) + '</span></div>'
            + '<div><button type="button" class="icon-btn" data-lb="prev" aria-label="Previous"><svg class="ic" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>'
            + '<button type="button" class="icon-btn" data-lb="next" aria-label="Next"><svg class="ic" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button></div></div>';
    }

    function openLB(i, from) {
        if (!data.all.length) return;
        if (open < 0) opener = from || document.activeElement;
        open = (i + data.all.length) % data.all.length;
        renderLB();
        lb.hidden = false;
        document.documentElement.style.overflow = 'hidden';
        lb.querySelector('[data-lb="close"]').focus();
    }

    function closeLB() {
        if (open < 0) return;
        open = -1;
        lb.hidden = true;
        lb.innerHTML = '';
        document.documentElement.style.overflow = '';
        if (opener && opener.focus) opener.focus({ preventScroll: true });
    }

    root.addEventListener('click', (e) => {
        const b = e.target.closest('[data-open]');
        if (b) openLB(Number(b.dataset.open), b);
    });

    lb.addEventListener('click', (e) => {
        const b = e.target.closest('[data-lb]');
        if (!b) return;
        const a = b.dataset.lb;
        if (a === 'close') closeLB();
        else openLB(open + (a === 'next' ? 1 : -1));
    });

    document.addEventListener('keydown', (e) => {
        if (open < 0) return;
        if (e.key === 'Escape') closeLB();
        else if (e.key === 'ArrowRight') openLB(open + 1);
        else if (e.key === 'ArrowLeft') openLB(open - 1);
    });

    // ============================================
    // VIDEOS: muted inline autoplay, only while on screen
    // ============================================
    const vids = root.querySelectorAll('video[data-auto]');
    vids.forEach((v) => { v.muted = true; v.defaultMuted = true; v.playsInline = true; });
    if (window.IntersectionObserver) {
        const io = new IntersectionObserver((entries) => entries.forEach((en) => {
            const v = en.target;
            if (en.isIntersecting) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => { }); } else v.pause();
        }), { threshold: 0.2 });
        vids.forEach((v) => io.observe(v));
    }

    // ============================================
    // HERO: scroll progress (--p) and pointer / tilt depth (--mx, --my)
    // ============================================
    const hero = document.getElementById('hero');
    const target = [0, 0], cur = [0, 0, 0, 0];
    let lastP = -1;

    hero.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        const r = hero.firstChild.getBoundingClientRect();
        target[0] = ((e.clientX - r.left) / r.width - 0.5) * 2;
        target[1] = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    hero.addEventListener('pointerleave', () => { target[0] = 0; target[1] = 0; });
    window.addEventListener('deviceorientation', (e) => {
        if (e.gamma == null) return;
        const c = (v) => Math.max(-1, Math.min(1, v));
        target[0] = c(e.gamma / 25);
        target[1] = c((e.beta - 45) / 25);
    });

    (function loop() {
        requestAnimationFrame(loop);
        const r = hero.getBoundingClientRect(), vh = window.innerHeight || 800;
        const span = Math.max(1, r.height - Math.min(vh, r.height));
        const p = Math.min(1, Math.max(0, -r.top / span));
        if (Math.abs(p - lastP) > 0.0004) { lastP = p; hero.style.setProperty('--p', p.toFixed(4)); }
        if (r.bottom < 0 || r.top > vh) return;
        cur[0] += (target[0] - cur[0]) * 0.06;
        cur[1] += (target[1] - cur[1]) * 0.06;
        if (Math.abs(cur[0] - cur[2]) + Math.abs(cur[1] - cur[3]) > 0.002) {
            cur[2] = cur[0]; cur[3] = cur[1];
            hero.style.setProperty('--mx', cur[0].toFixed(3));
            hero.style.setProperty('--my', cur[1].toFixed(3));
        }
    })();
})();
