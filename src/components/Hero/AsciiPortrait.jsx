import React, { useEffect, useRef } from "react";

/**
 * InteractiveAsciiPortrait
 * High-fidelity interactive ASCII portrait engine with real-time spring-physics,
 * dynamic door opening drag effect, and luxury gold/cream theme mapping.
 */
export function AsciiPortrait({
  imageSrc = "/rohith-ascii-portrait.png",
  className = "",
  style = {},
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId;
    let scrambleInterval;

    const CELL_SIZE = 4.6;
    const CELL_GAP = 1.0;
    const CELL_STEP = CELL_SIZE + CELL_GAP;
    const ASCII_CHARS = ".:+*#%@0369";
    const DARK_CHARS = ["#", "%", "*", "+", "=", "@"];

    const PUSH_RADIUS = 75;
    const PUSH_FORCE = 42;
    const SPRING = 0.038;
    const DAMPING = 0.66;

    let particles = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let isMoving = false;
    let idleTimer = null;
    let currentW = window.innerWidth;
    let currentH = window.innerHeight;
    let targetW = 300;
    let targetH = 388;
    let centerX = currentW / 2;
    let centerY = currentH * 0.57;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    function resizeAndSample() {
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      currentW = w;
      currentH = h;
      centerX = w / 2;

      const isMobile = w < 768;
      centerY = isMobile ? h * 0.58 : h * 0.57;

      targetW = isMobile
        ? Math.min(255, w * 0.72)
        : Math.min(330, Math.max(250, w * 0.21));
      targetH = targetW * (1392 / 1080);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!img.complete || img.naturalWidth === 0) return;

      const sampleCols = Math.round(targetW / CELL_STEP);
      const sampleRows = Math.round(targetH / CELL_STEP);

      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = sampleCols;
      sampleCanvas.height = sampleRows;
      const sCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
      if (!sCtx) return;

      sCtx.drawImage(img, 0, 0, sampleCols, sampleRows);
      const imgData = sCtx.getImageData(0, 0, sampleCols, sampleRows);
      const data = imgData.data;

      const startX = (w - targetW) / 2;
      const startY = centerY - targetH / 2;

      particles = [];
      for (let r = 0; r < sampleRows; r++) {
        for (let c = 0; c < sampleCols; c++) {
          const idx = (r * sampleCols + c) * 4;
          const a = data[idx + 3];

          if (a > 28) {
            const red = data[idx];
            const green = data[idx + 1];
            const blue = data[idx + 2];
            const lum = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
            const alphaNorm = a / 255;

            let char;
            let colorStr;

            if (lum < 0.24) {
              char = DARK_CHARS[(c + r) % DARK_CHARS.length];
              colorStr = `rgba(135, 102, 72, ${(alphaNorm * 0.72).toFixed(2)})`;
            } else if (lum < 0.48) {
              const charIdx = Math.min(
                ASCII_CHARS.length - 1,
                Math.floor(lum * ASCII_CHARS.length)
              );
              char = ASCII_CHARS[charIdx];
              colorStr = `rgba(195, 148, 92, ${(alphaNorm * 0.85).toFixed(2)})`;
            } else if (lum < 0.72) {
              const charIdx = Math.min(
                ASCII_CHARS.length - 1,
                Math.floor(lum * ASCII_CHARS.length)
              );
              char = ASCII_CHARS[charIdx];
              colorStr = `rgba(228, 192, 130, ${(alphaNorm * 0.92).toFixed(2)})`;
            } else {
              const charIdx = Math.min(
                ASCII_CHARS.length - 1,
                Math.floor(lum * ASCII_CHARS.length)
              );
              char = ASCII_CHARS[charIdx];
              colorStr = `rgba(246, 240, 228, ${(alphaNorm * 0.98).toFixed(2)})`;
            }

            const baseX = startX + c * CELL_STEP + CELL_SIZE / 2;
            const baseY = startY + r * CELL_STEP + CELL_SIZE / 2;

            particles.push({
              baseX,
              baseY,
              x: baseX,
              y: baseY,
              char,
              color: colorStr,
              lum,
              vx: 0,
              vy: 0,
            });
          }
        }
      }
    }

    img.onload = () => resizeAndSample();
    if (img.complete && img.naturalWidth > 0) {
      resizeAndSample();
    }

    window.addEventListener("resize", resizeAndSample);

    function updatePhysics() {
      const len = particles.length;
      if (len === 0) return;

      // Read door opening progress (0 = closed, 1 = fully open)
      const doorOpen =
        parseFloat(
          document.documentElement.style.getPropertyValue("--hero-door-open")
        ) || 0;

      const maxDrag = currentW * 0.62 + 80;

      for (let i = 0; i < len; i++) {
        const p = particles[i];

        if (doorOpen > 0.001) {
          // DRAG EFFECT: As the doors open, ASCII numbers drag outward left and right
          const isLeft = p.baseX < centerX;
          const dir = isLeft ? -1 : 1;
          const centerDist = Math.abs(p.baseX - centerX);
          const normDist = Math.min(1, centerDist / (targetW / 2));

          // Center particles pull first with an elastic tearing wave
          const wave = 1.0 + (1 - normDist) * 0.45 + Math.sin(p.baseY * 0.035) * 0.12;
          const dragTargetX = p.baseX + dir * Math.pow(doorOpen, 1.1) * maxDrag * wave;

          const ax = (dragTargetX - p.x) * 0.14;
          p.vx = (p.vx + ax) * 0.74;
          p.x += p.vx;

          // Subtle organic vertical flare as particles part
          const targetY = p.baseY + (p.baseY - centerY) * doorOpen * 0.18;
          const ay = (targetY - p.y) * 0.08;
          p.vy = (p.vy + ay) * 0.74;
          p.y += p.vy;
        } else {
          // Normal idle/hover state
          if (isMoving) {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < PUSH_RADIUS && dist > 0) {
              const force = Math.pow(1 - dist / PUSH_RADIUS, 2) * PUSH_FORCE;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          const ax = (p.baseX - p.x) * SPRING;
          const ay = (p.baseY - p.y) * SPRING;
          p.vx = (p.vx + ax) * DAMPING;
          p.vy = (p.vy + ay) * DAMPING;
          p.x += p.vx;
          p.y += p.vy;
        }
      }
    }

    function render() {
      if (!canvas) return;
      ctx.clearRect(0, 0, currentW, currentH);

      const doorOpen =
        parseFloat(
          document.documentElement.style.getPropertyValue("--hero-door-open")
        ) || 0;

      // Smooth fade out at the very end of door opening
      if (doorOpen > 0.65) {
        ctx.globalAlpha = Math.max(0, 1 - (doorOpen - 0.65) / 0.35);
      } else {
        ctx.globalAlpha = 1;
      }

      ctx.font = `bold ${CELL_SIZE + 1.2}px monospace`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        ctx.fillStyle = p.color;
        ctx.fillText(p.char, p.x, p.y);
      }
    }

    function loop() {
      updatePhysics();
      render();
      animId = requestAnimationFrame(loop);
    }
    loop();

    // Subtle alive shimmer across 12% of particles every 55ms
    scrambleInterval = setInterval(() => {
      const len = particles.length;
      if (len === 0) return;
      const scrambleCount = Math.floor(len * 0.12);
      for (let i = 0; i < scrambleCount; i++) {
        const randIdx = Math.floor(Math.random() * len);
        const p = particles[randIdx];
        if (p.lum < 0.24) {
          p.char = DARK_CHARS[Math.floor(Math.random() * DARK_CHARS.length)];
        } else {
          p.char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
        }
      }
    }, 55);

    function setPointer(clientX, clientY) {
      mouseX = clientX;
      mouseY = clientY;
      isMoving = true;

      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isMoving = false;
      }, 70);
    }

    const handlePointerMove = (e) => setPointer(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        setPointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handlePointerLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      isMoving = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(scrambleInterval);
      window.removeEventListener("resize", resizeAndSample);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [imageSrc]);

  return (
    <div
      className={`fixed inset-0 w-full h-full pointer-events-none select-none z-20 ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
    </div>
  );
}

export default AsciiPortrait;
