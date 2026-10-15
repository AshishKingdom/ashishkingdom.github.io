// A softly lit ASCII torus: fixed geometry, slow rotation, no simulation.
function initAsciiWave() {
    const canvas = document.getElementById('asciiWaveCanvas');
    if (!canvas || canvas.dataset.initialized) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.dataset.initialized = 'true';

    const hero = canvas.closest('.hero-section');
    const portrait = hero.querySelector('.hero-image-wrapper');
    const text = hero.querySelector('.hero-text');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const glyphs = '.,:;=+*';
    const mesh = [];
    // Precompute the surface and its normals once. Only rotation changes per frame.
    for (let u = 0; u < 180; u++) {
        const longitude = u * Math.PI * 2 / 180;
        const cu = Math.cos(longitude);
        const su = Math.sin(longitude);
        for (let v = 0; v < 56; v++) {
            const latitude = v * Math.PI * 2 / 56;
            const cv = Math.cos(latitude);
            const sv = Math.sin(latitude);
            mesh.push([cu * (1.6 + 0.58 * cv), su * (1.6 + 0.58 * cv), 0.58 * sv,
                cu * cv, su * cv, sv]);
        }
    }

    let width, height, cols, rows, cellWidth, cellHeight, centerX, centerY, scale;
    let depth, light, opacity;
    let frame = null;
    let visible = false;
    let phase = 0;
    let lastTime = 0;
    let lastDraw = 0;

    function draw() {
        ctx.clearRect(0, 0, width, height);
        depth.fill(-Infinity);
        const tilt = 0.72 + Math.sin(phase * 0.7) * 0.26;
        const turn = phase * 0.32 - 0.4;
        const ca = Math.cos(tilt), sa = Math.sin(tilt);
        const cb = Math.cos(turn), sb = Math.sin(turn);
        for (const point of mesh) {
            const [x, y, z, nx, ny, nz] = point;
            const tiltedY = y * ca - z * sa;
            const tiltedZ = y * sa + z * ca;
            const rotatedX = x * cb - tiltedY * sb;
            const rotatedY = x * sb + tiltedY * cb;
            const perspective = 7 / (7 - tiltedZ);
            const col = Math.floor((centerX + rotatedX * scale * perspective) / cellWidth);
            const row = Math.floor((centerY + rotatedY * scale * perspective) / cellHeight);
            if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
            const index = row * cols + col;
            if (tiltedZ <= depth[index]) continue;
            depth[index] = tiltedZ;
            const normalY = ny * ca - nz * sa;
            const normalZ = ny * sa + nz * ca;
            const luminance = Math.max(0, Math.min(1,
                0.25 - (nx * cb - normalY * sb) * 0.3
                - (nx * sb + normalY * cb) * 0.45 + normalZ * 0.65));
            light[index] = Math.round(luminance * 255);
        }
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                if (depth[index] === -Infinity) continue;
                const shade = light[index] / 255;
                ctx.globalAlpha = opacity[index] * (0.5 + shade * 0.5);
                ctx.fillText(glyphs[Math.round(shade * (glyphs.length - 1))],
                    (col + 0.5) * cellWidth, (row + 0.5) * cellHeight);
            }
        }
        ctx.globalAlpha = 1;
    }

    function resize() {
        const bounds = canvas.getBoundingClientRect();
        width = bounds.width;
        height = bounds.height;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.font = '13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333';
        // Keep character proportions and cap buffer size on very large screens.
        cellWidth = Math.max(width < 769 ? 7 : 8, Math.sqrt(width * height / 18000));
        cellHeight = cellWidth * 1.5;
        cols = Math.ceil(width / cellWidth);
        rows = Math.ceil(height / cellHeight);
        depth = new Float32Array(cols * rows);
        light = new Uint8Array(cols * rows);
        opacity = new Float32Array(cols * rows);

        const imageBounds = portrait.getBoundingClientRect();
        const stacked = text.getBoundingClientRect().top >= imageBounds.bottom;
        centerX = imageBounds.left - bounds.left + imageBounds.width * (stacked ? 0.5 : 0.55);
        centerY = imageBounds.top - bounds.top + imageBounds.height * 0.5;
        const radius = imageBounds.width * (stacked ? (width <= 600 ? 0.85 : 0.95) : 1.1);
        scale = radius / 2.18;
        const textBounds = text.getBoundingClientRect();
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = (col + 0.5) * cellWidth;
                const y = (row + 0.5) * cellHeight;
                // A soft clear area preserves legibility without a visible rectangular mask.
                const dx = Math.max(textBounds.left - bounds.left - x, 0, x - (textBounds.right - bounds.left));
                const dy = Math.max(textBounds.top - bounds.top - y, 0, y - (textBounds.bottom - bounds.top));
                const textFade = Math.min(1, Math.hypot(dx, dy) / 60);
                const edgeFade = Math.max(0, Math.min(1, x / 35, (width - x) / 35, (y - 96) / 48, (height - y) / 40));
                opacity[row * cols + col] = (0.07 + 0.33 * textFade) * edgeFade;
            }
        }
        draw();
    }

    function animate(now) {
        phase += Math.min((now - lastTime) / 1000, 0.1) * 0.28;
        lastTime = now;
        if (now - lastDraw >= 1000 / 15) {
            draw();
            lastDraw = now;
        }
        frame = window.requestAnimationFrame(animate);
    }

    function syncPlayback() {
        const shouldPlay = visible && !document.hidden && !reducedMotion.matches;
        if (shouldPlay && frame === null) {
            lastTime = performance.now();
            lastDraw = lastTime;
            frame = window.requestAnimationFrame(animate);
        } else if (!shouldPlay && frame !== null) {
            window.cancelAnimationFrame(frame);
            frame = null;
        }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);
    resizeObserver.observe(portrait);
    resizeObserver.observe(text);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback();
    });
    visibilityObserver.observe(hero);
    document.addEventListener('visibilitychange', syncPlayback);
    reducedMotion.addEventListener('change', syncPlayback);
    window.addEventListener('resize', resize);
    resize();
}
