// Decorative, deterministic streamlines. No dependencies and no idle animation.
function initHeroFlowField() {
    const canvas = document.getElementById('heroFlowField');
    if (!canvas || canvas.dataset.initialized) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.dataset.initialized = 'true';

    // All distances are CSS pixels, except fieldScale and normalized fade radii.
    const config = {
        seed: 73129,
        lineCount: 140,
        mobileLineCount: 75,
        opacity: 0.12,
        lineWidth: 0.7,
        fieldScale: 1,
        pointerRadius: 205,
        mobilePointerRadius: 125,
        maxDisplacement: 20,
        mobileMaxDisplacement: 14,
        recoverySpeed: 11,
        maxPixelRatio: 2,
        fade: { textClearance: 72, textOpacity: 0.16, sectionEdge: 55 }
    };
    const hero = canvas.closest('.hero-section');
    const portrait = hero.querySelector('.hero-image-wrapper');
    const text = hero.querySelector('.hero-text');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: 0, y: 0, dragX: 0, dragY: 0, time: -Infinity, id: null };
    let lines = [];
    const mask = document.createElement('canvas');
    const maskContext = mask.getContext('2d');
    let width = 0, height = 0, ratio = 1, mobile = false;
    let bounds, layoutKey = '';
    let frame = null, resizeFrame = null, lastTime = 0;
    let visible = false, destroyed = false;

    function smoothstep(a, b, value) {
        const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
        return t * t * (3 - 2 * t);
    }

    function randomGenerator(seed) {
        return () => {
            seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
            return seed / 4294967296;
        };
    }

    // A steady current passing two broad eddies. Midpoint integration follows
    // this smooth field in both directions; there is no time-varying noise.
    function angleAt(x, y) {
        const a = (x + 0.42) ** 2 + (y - 0.18) ** 2 + 0.32;
        const b = (x - 0.90) ** 2 + (y + 0.35) ** 2 + 0.32;
        const vx = 0.26 - 0.95 * (y - 0.18) / a + 0.75 * (y + 0.35) / b;
        const vy = -0.10 + 0.95 * (x + 0.42) / a - 0.75 * (x - 0.90) / b
            + 0.20 * Math.sin(x * 2.1 + y * 1.4);
        return Math.atan2(vy, vx);
    }

    function generate(copy) {
        const random = randomGenerator(config.seed);
        const centerX = width * 0.42;
        const centerY = height * 0.5;
        const scale = Math.min(width, height) * 0.6 * config.fieldScale;
        const textLeft = copy.left - bounds.left;
        const textRight = copy.right - bounds.left;
        const textTop = copy.top - bounds.top;
        const textBottom = copy.bottom - bounds.top;
        const count = mobile ? config.mobileLineCount : config.lineCount;

        function opacityAt(x, y) {
            const dx = Math.max(textLeft - x, 0, x - textRight);
            const dy = Math.max(textTop - y, 0, y - textBottom);
            const clearText = config.fade.textOpacity + (1 - config.fade.textOpacity)
                * smoothstep(18, config.fade.textClearance, Math.hypot(dx, dy));
            const edge = smoothstep(0, config.fade.sectionEdge,
                Math.min(x, width - x, y, height - y));
            return clearText * edge;
        }

        // A cached alpha mask keeps whole strokes smooth and the text quiet.
        // It is composited as transparency, never as a visible painted layer.
        mask.width = Math.ceil(width);
        mask.height = Math.ceil(height);
        const pixels = maskContext.createImageData(mask.width, mask.height);
        for (let y = 0; y < mask.height; y++) {
            for (let x = 0; x < mask.width; x++) {
                pixels.data[(y * mask.width + x) * 4 + 3] = Math.round(opacityAt(x, y) * 255);
            }
        }
        maskContext.putImageData(pixels, 0, 0);

        // Spatial exclusion prevents overlapping trajectories and dark tangles.
        // Only accepted lines populate the grid; it is discarded after generation.
        const spacing = mobile ? 8 : 9;
        const cols = Math.ceil(width / spacing) + 2;
        const rows = Math.ceil(height / spacing) + 2;
        const occupied = new Uint8Array(cols * rows);
        function cell(x, y) {
            return (Math.floor(y / spacing) + 1) * cols + Math.floor(x / spacing) + 1;
        }
        lines = [];
        for (let attempt = 0; attempt < count * 28 && lines.length < count; attempt++) {
            const seedX = random() * width;
            const seedY = random() * height;
            if (occupied[cell(seedX, seedY)]) continue;
            const halves = [];
            const steps = (mobile ? 26 : 40) + Math.floor(random() * 16);
            for (const direction of [-1, 1]) {
                let x = seedX, y = seedY;
                const half = [];
                for (let j = 0; j < steps; j++) {
                    const step = (mobile ? 7 : 10) * direction;
                    const angle = angleAt((x - centerX) / scale, (y - centerY) / scale);
                    const midpoint = angleAt((x + Math.cos(angle) * step * 0.5 - centerX) / scale,
                        (y + Math.sin(angle) * step * 0.5 - centerY) / scale);
                    x += Math.cos(midpoint) * step;
                    y += Math.sin(midpoint) * step;
                    if (x < 0 || x >= width || y < 0 || y >= height || occupied[cell(x, y)]) break;
                    if (j > 12 && Math.hypot(x - seedX, y - seedY) < spacing * 2) break;
                    half.push([x, y]);
                }
                halves.push(half);
            }
            const path = [...halves[0].reverse(), [seedX, seedY], ...halves[1]];
            if (path.length < 18) continue;
            const points = new Float32Array(path.length * 2);
            for (let j = 0; j < path.length; j++) {
                const [x, y] = path[j];
                points[j * 2] = x;
                points[j * 2 + 1] = y;
                occupied[cell(x, y)] = 1;
                if (j > 0) occupied[cell((x + path[j - 1][0]) * 0.5,
                    (y + path[j - 1][1]) * 0.5)] = 1;
            }
            lines.push({ points, offsets: new Float32Array(points.length),
                alpha: config.opacity * (0.75 + random() * 0.5),
                width: config.lineWidth * (0.85 + random() * 0.3) });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#111111';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (const line of lines) {
            const p = line.points, d = line.offsets;
            ctx.lineWidth = line.width;
            ctx.globalAlpha = line.alpha;
            ctx.beginPath();
            ctx.moveTo(p[0] + d[0], p[1] + d[1]);
            // One continuous stroke per trajectory avoids segment seams.
            for (let i = 2; i < p.length - 2; i += 2) {
                const x = p[i] + d[i], y = p[i + 1] + d[i + 1];
                ctx.quadraticCurveTo(x, y, (x + p[i + 2] + d[i + 2]) * 0.5,
                    (y + p[i + 3] + d[i + 3]) * 0.5);
            }
            ctx.lineTo(p[p.length - 2] + d[p.length - 2], p[p.length - 1] + d[p.length - 1]);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(mask, 0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
    }

    function stop(reset = true) {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        pointer.time = -Infinity;
        pointer.id = null;
        if (reset) {
            for (const line of lines) line.offsets.fill(0);
            draw();
        }
    }

    function animate(now) {
        frame = null;
        if (!visible || document.hidden || motion.matches || destroyed) return;
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;
        const blend = 1 - Math.exp(-config.recoverySpeed * dt);
        // A stationary pointer relaxes too: even a hovering cursor costs no idle CPU.
        const strength = Math.exp(-Math.max(0, now - pointer.time - 100) / 160);
        const radius = mobile ? config.mobilePointerRadius : config.pointerRadius;
        const max = mobile ? config.mobileMaxDisplacement : config.maxDisplacement;
        let remaining = 0;
        for (const line of lines) {
            for (let i = 0; i < line.points.length; i += 2) {
                const dx = (line.points[i] - pointer.x) / radius;
                const dy = (line.points[i + 1] - pointer.y) / radius;
                const falloff = (1 - smoothstep(0, 1, Math.hypot(dx, dy))) * strength;
                // Bounded radial attraction, tangential curl, and movement drag.
                const targetX = max * falloff * (-0.35 * dx - 0.65 * dy + 0.55 * pointer.dragX);
                const targetY = max * falloff * (-0.35 * dy + 0.65 * dx + 0.55 * pointer.dragY);
                line.offsets[i] += (targetX - line.offsets[i]) * blend;
                line.offsets[i + 1] += (targetY - line.offsets[i + 1]) * blend;
                remaining = Math.max(remaining, Math.abs(line.offsets[i]), Math.abs(line.offsets[i + 1]));
            }
        }
        draw();
        if (remaining > 0.015 || strength > 0.002) frame = requestAnimationFrame(animate);
        else stop();
    }

    function onPointer(event) {
        if (!visible || document.hidden || motion.matches || !event.isPrimary) return;
        if (event.pointerType !== 'mouse' && event.type === 'pointermove' && event.buttons === 0) return;
        const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
        const now = performance.now();
        const continuous = pointer.id === event.pointerId && now - pointer.time < 150;
        // Bound the drag vector so unusually large input deltas remain gentle.
        const dx = continuous ? x - pointer.x : 0;
        const dy = continuous ? y - pointer.y : 0;
        const length = Math.max(40, Math.hypot(dx, dy));
        Object.assign(pointer, { x, y, dragX: dx / length, dragY: dy / length,
            time: now, id: event.pointerId });
        if (frame === null) {
            lastTime = now - 16;
            frame = requestAnimationFrame(animate);
        }
    }

    function release(event) {
        // Keep a brief impulse after pointerup so a fast tap is still painted
        // even when down/up both arrive between two animation frames.
        if (event.type === 'pointercancel'
            || (event.type === 'pointerleave' && event.pointerType === 'mouse')) {
            pointer.time = -Infinity;
        }
        pointer.id = null;
    }

    function resize() {
        resizeFrame = null;
        if (destroyed) return;
        bounds = hero.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const image = portrait.getBoundingClientRect();
        const copy = text.getBoundingClientRect();
        const nextRatio = Math.min(window.devicePixelRatio || 1, config.maxPixelRatio);
        const key = [bounds.width, bounds.height, image.left - bounds.left,
            image.top - bounds.top, image.width, copy.left - bounds.left,
            copy.top - bounds.top, copy.width, copy.height, nextRatio].map(n => Math.round(n * 10)).join(',');
        if (key === layoutKey) return;
        layoutKey = key;
        stop(false);
        width = bounds.width;
        height = bounds.height;
        mobile = width <= 1100;
        ratio = nextRatio;
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        generate(copy);
        draw();
    }

    function scheduleResize() {
        if (resizeFrame === null) resizeFrame = requestAnimationFrame(resize);
    }

    // Scroll changes local coordinates but never requires an animated redraw.
    function refreshBounds() { bounds = hero.getBoundingClientRect(); }
    function onVisibility() { if (document.hidden) stop(); }
    function onMotion() { stop(); }
    function onPageHide(event) { if (event.persisted) stop(); else destroy(); }
    function onPageShow() { scheduleResize(); }

    const resizeObserver = new ResizeObserver(scheduleResize);
    for (const element of [hero, portrait, text]) resizeObserver.observe(element);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) stop();
    });
    intersectionObserver.observe(hero);
    // Passive ancestor listeners preserve links, text selection and native scrolling.
    hero.addEventListener('pointerdown', onPointer, { passive: true });
    hero.addEventListener('pointermove', onPointer, { passive: true });
    for (const type of ['pointerleave', 'pointerup', 'pointercancel']) {
        hero.addEventListener(type, release, { passive: true });
    }
    window.addEventListener('scroll', refreshBounds, { passive: true });
    window.addEventListener('resize', scheduleResize, { passive: true });
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('pageshow', onPageShow);
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onMotion);

    function destroy() {
        destroyed = true;
        stop(false);
        if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        hero.removeEventListener('pointerdown', onPointer);
        hero.removeEventListener('pointermove', onPointer);
        for (const type of ['pointerleave', 'pointerup', 'pointercancel']) hero.removeEventListener(type, release);
        window.removeEventListener('scroll', refreshBounds);
        window.removeEventListener('resize', scheduleResize);
        window.removeEventListener('pagehide', onPageHide);
        window.removeEventListener('pageshow', onPageShow);
        document.removeEventListener('visibilitychange', onVisibility);
        motion.removeEventListener('change', onMotion);
        delete canvas.dataset.initialized;
    }

    resize();
    return destroy;
}
