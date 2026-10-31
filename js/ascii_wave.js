// A small ASCII universe: four surfaces share a mesh, so they can morph continuously.
function initAsciiWave() {
    const canvas = document.getElementById('asciiWaveCanvas');
    if (!canvas || canvas.dataset.initialized) return;
    const hero = canvas.closest('.hero-section');
    const portrait = hero?.querySelector('.hero-image-wrapper');
    const copy = hero?.querySelector('.hero-text');
    const ctx = canvas.getContext('2d');
    if (!ctx || !portrait || !copy) return;
    canvas.dataset.initialized = 'true';

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const TAU = Math.PI * 2;
    const names = ['vortex', 'wave', 'knot', 'orbits'];
    const glyphs = '.,:;=+*#';
    const clamp = x => Math.max(0, Math.min(1, x));
    const smooth = x => { const t = clamp(x); return t * t * (3 - 2 * t); };
    const mix = (a, b, t) => a + (b - a) * t;
    const columns = 192, rows = 36, pointCount = columns * rows;

    function surface(shape, u, v) {
        const a = u * TAU, b = v * TAU;
        if (shape === 0) {
            // A spiralling funnel with five crests winding into its throat.
            const radius = 0.14 + v * 0.88;
            const angle = a + (1 - v) * 3.4;
            const ridge = Math.sin(a * 5 + v * 9) * 0.055 * v;
            return [radius * Math.cos(angle), radius * Math.sin(angle),
                0.65 * (1 - v) ** 2 + ridge - 0.2];
        }
        if (shape === 1) {
            const x = (u - 0.5) * 1.85, y = (v - 0.5) * 1.85;
            return [x, y, Math.sin(x * 4.8 + y * 2) * 0.21 + Math.cos(y * 5 - x) * 0.15];
        }
        if (shape === 2) {
            // A thick trefoil: a continuous ribbon loops through itself in 3D.
            const radius = 0.56 + 0.22 * Math.cos(3 * a) + 0.135 * Math.cos(b);
            return [radius * Math.cos(2 * a), radius * Math.sin(2 * a),
                0.29 * Math.sin(3 * a) + 0.135 * Math.sin(b)];
        }
        // Three inclined orbital bands form an armillary sphere.
        const band = Math.min(2, Math.floor(v * 3));
        const radius = 0.86 + (v * 3 - band - 0.5) * 0.12;
        const tilt = (band - 1) * 1.05;
        const x = Math.cos(a) * radius, y = Math.sin(a) * radius;
        return [x * Math.cos(tilt), y, x * Math.sin(tilt)];
    }

    const meshes = names.map((_, shape) => {
        const mesh = new Float32Array(pointCount * 6);
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const u = col / columns, v = (row + 0.5) / rows;
                const p = surface(shape, u, v);
                const pu = surface(shape, u + 0.0001, v);
                const pv = surface(shape, u, v + 0.0001);
                const ax = pu[0] - p[0], ay = pu[1] - p[1], az = pu[2] - p[2];
                const bx = pv[0] - p[0], by = pv[1] - p[1], bz = pv[2] - p[2];
                const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
                const length = Math.hypot(nx, ny, nz) || 1;
                mesh.set([...p, nx / length, ny / length, nz / length], (row * columns + col) * 6);
            }
        }
        return mesh;
    });

    let width, height, cx, cy, radius, cellX, cellY, gridWidth, gridHeight;
    let depth, shade, fade;
    let phase = 0, age = 0, shape = 0;
    let visible = false, frame = null, lastTime = 0;
    // Each five-second cycle holds the form for three seconds, then morphs for two.
    const cycleTime = 5, morphTime = 2;

    function describe() {
        canvas.dataset.shape = names[shape];
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        depth.fill(-Infinity);
        const blending = smooth((age - (cycleTime - morphTime)) / morphTime);
        const from = meshes[shape], to = meshes[(shape + 1) % meshes.length];
        const tilt = 0.46 + Math.sin(phase * 0.18) * 0.22;
        const turn = phase * 0.12 - 0.24;
        const ca = Math.cos(tilt), sa = Math.sin(tilt);
        const cb = Math.cos(turn), sb = Math.sin(turn);
        for (let i = 0; i < from.length; i += 6) {
            const x = mix(from[i], to[i], blending);
            const y = mix(from[i + 1], to[i + 1], blending);
            const z = mix(from[i + 2], to[i + 2], blending);
            const ty = y * ca - z * sa, tz = y * sa + z * ca;
            const rx = x * cb - ty * sb, ry = x * sb + ty * cb;
            const perspective = 3.8 / (3.8 - tz);
            const col = Math.floor((cx + rx * radius * perspective) / cellX);
            const row = Math.floor((cy + ry * radius * perspective) / cellY);
            if (col < 0 || row < 0 || col >= gridWidth || row >= gridHeight) continue;
            const index = row * gridWidth + col;
            if (tz <= depth[index]) continue;
            depth[index] = tz;
            const nx = mix(from[i + 3], to[i + 3], blending);
            const ny = mix(from[i + 4], to[i + 4], blending);
            const nz = mix(from[i + 5], to[i + 5], blending);
            const normalY = ny * ca - nz * sa, normalZ = ny * sa + nz * ca;
            // Two-sided lighting keeps folded surfaces readable during a morph.
            shade[index] = clamp(0.22 + Math.abs(-0.3 * (nx * cb - normalY * sb)
                - 0.45 * (nx * sb + normalY * cb) + normalZ * 0.7) * 0.72 + tz * 0.1);
        }
        for (let i = 0; i < depth.length; i++) {
            if (depth[i] === -Infinity || fade[i] < 0.01) continue;
            const light = shade[i];
            ctx.globalAlpha = fade[i] * (0.16 + light * 0.34);
            ctx.fillText(glyphs[Math.min(glyphs.length - 1, Math.floor(light * glyphs.length))],
                (i % gridWidth + 0.5) * cellX, (Math.floor(i / gridWidth) + 0.5) * cellY);
        }
        ctx.globalAlpha = 1;
    }

    function resize() {
        const bounds = canvas.getBoundingClientRect();
        const image = portrait.getBoundingClientRect(), text = copy.getBoundingClientRect();
        width = bounds.width;
        height = bounds.height;
        const stacked = text.top >= image.bottom;
        cx = image.left - bounds.left + image.width * 0.5;
        cy = image.top - bounds.top + image.height * 0.37 + (stacked ? 50 : 75);
        radius = image.width * (stacked ? 0.63 : 0.88);
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        cellX = width <= 600 ? 5.5 : 7;
        cellY = cellX * 1.45;
        gridWidth = Math.ceil(width / cellX);
        gridHeight = Math.ceil(height / cellY);
        depth = new Float32Array(gridWidth * gridHeight);
        shade = new Float32Array(depth.length);
        fade = new Float32Array(depth.length);
        ctx.font = `${width <= 600 ? 9 : 11}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#363641';
        for (let i = 0; i < fade.length; i++) {
            const x = (i % gridWidth + 0.5) * cellX;
            const y = (Math.floor(i / gridWidth) + 0.5) * cellY;
            const dx = Math.max(text.left - bounds.left - x, 0, x - (text.right - bounds.left));
            const dy = Math.max(text.top - bounds.top - y, 0, y - (text.bottom - bounds.top));
            fade[i] = smooth(Math.hypot(dx, dy) / 55)
                * smooth(Math.min(x, width - x) / 30)
                * smooth((y - 88) / 50) * smooth((height - y) / 35);
        }
        draw();
    }

    function animate(now) {
        const elapsed = (now - lastTime) / 1000;
        if (elapsed >= 1 / 30) {
            const dt = Math.min(elapsed, 0.06);
            lastTime = now;
            phase += dt;
            age += dt;
            if (age >= cycleTime) {
                shape = (shape + 1) % meshes.length;
                age -= cycleTime;
                describe();
            }
            draw();
        }
        frame = requestAnimationFrame(animate);
    }

    function syncPlayback() {
        const play = visible && !document.hidden && !motion.matches;
        if (play && frame === null) {
            lastTime = performance.now();
            frame = requestAnimationFrame(animate);
        } else if (!play && frame !== null) {
            cancelAnimationFrame(frame);
            frame = null;
        }
        if (motion.matches) draw();
    }

    const resizeObserver = new ResizeObserver(resize);
    [hero, portrait, copy].forEach(element => resizeObserver.observe(element));
    const visibilityObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback();
    });
    visibilityObserver.observe(hero);
    document.addEventListener('visibilitychange', syncPlayback);
    motion.addEventListener('change', syncPlayback);
    window.addEventListener('resize', resize);
    describe();
    resize();
}
