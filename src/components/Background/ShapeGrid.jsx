import { useEffect, useRef } from "react";
import "./ShapeGrid.css";

function ShapeGrid({
  speed = 0.12,
  hexSize = 39,
  lineColor = "rgba(181, 138, 89, 0.082)",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    /* =========================================
       DEVICE / ACCESSIBILITY
    ========================================= */
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const isTouchDevice = coarsePointer || navigator.maxTouchPoints > 0;

    /* =========================================
       STATE
    ========================================= */
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    let animationFrame = null;
    let offset = 0;
    let pageVisible = !document.hidden;
    let isScrolling = false;
    let scrollTimeout = null;

    let pointerX = -9999;
    let pointerY = -9999;
    let smoothPointerX = pointerX;
    let smoothPointerY = pointerY;
    let hoverActive = false;

    /* =========================================
       RESPONSIVE HEX SIZE
    ========================================= */
    const getHexSize = () => {
      if (window.innerWidth <= 520) return 50;
      if (window.innerWidth <= 900) return 45;
      return hexSize;
    };

    /* =========================================
       PRECOMPUTED VERTEX OFFSETS
    ========================================= */
    let radius = getHexSize();
    const angles = [
      Math.PI / 6,
      Math.PI / 2,
      (5 * Math.PI) / 6,
      (7 * Math.PI) / 6,
      (3 * Math.PI) / 2,
      (11 * Math.PI) / 6,
    ];
    let hexOffsets = angles.map((a) => [radius * Math.cos(a), radius * Math.sin(a)]);

    /* =========================================
       CANVAS SIZE
    ========================================= */
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      radius = getHexSize();
      hexOffsets = angles.map((a) => [radius * Math.cos(a), radius * Math.sin(a)]);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* =========================================
       ACTIVE / HOVERED HEXAGON (Single Cell Highlight)
    ========================================= */
    const drawActiveHexagon = (x, y, r, strength) => {
      ctx.beginPath();
      for (let side = 0; side < 6; side += 1) {
        const px = x + (r - 1) * Math.cos(angles[side]);
        const py = y + (r - 1) * Math.sin(angles[side]);
        if (side === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      const fillGradient = ctx.createRadialGradient(
        x - r * 0.3,
        y - r * 0.35,
        r * 0.05,
        x,
        y,
        r,
      );
      fillGradient.addColorStop(0, `rgba(181, 138, 89, ${0.13 * strength})`);
      fillGradient.addColorStop(0.55, `rgba(139, 94, 60, ${0.08 * strength})`);
      fillGradient.addColorStop(1, `rgba(23, 17, 13, ${0.04 * strength})`);

      ctx.fillStyle = fillGradient;
      ctx.fill();

      ctx.strokeStyle = `rgba(181, 138, 89, ${0.09 + strength * 0.08})`;
      ctx.lineWidth = 1 + strength * 0.2;
      ctx.stroke();
    };

    /* =========================================
       DRAW GRID (Batched Single-Pass Draw)
    ========================================= */
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const horizontalSpacing = Math.sqrt(3) * radius;
      const verticalSpacing = radius * 1.5;

      const moveX = reducedMotion ? 0 : offset % horizontalSpacing;
      const moveY = reducedMotion ? 0 : (offset * 0.58) % verticalSpacing;

      if (!isTouchDevice && hoverActive) {
        smoothPointerX += (pointerX - smoothPointerX) * 0.18;
        smoothPointerY += (pointerY - smoothPointerY) * 0.18;
      }

      const startRow = -3;
      const rowCount = Math.ceil(height / verticalSpacing) + 5;
      const startColumn = -3;
      const columnCount = Math.ceil(width / horizontalSpacing) + 5;

      // 1. Batch ALL normal hexagons into a SINGLE path
      ctx.beginPath();
      for (let row = startRow; row < rowCount; row += 1) {
        const stagger = row % 2 !== 0 ? horizontalSpacing / 2 : 0;
        const y = row * verticalSpacing + moveY;

        for (let column = startColumn; column < columnCount; column += 1) {
          const x = column * horizontalSpacing + stagger + moveX;

          ctx.moveTo(x + hexOffsets[0][0], y + hexOffsets[0][1]);
          ctx.lineTo(x + hexOffsets[1][0], y + hexOffsets[1][1]);
          ctx.lineTo(x + hexOffsets[2][0], y + hexOffsets[2][1]);
          ctx.lineTo(x + hexOffsets[3][0], y + hexOffsets[3][1]);
          ctx.lineTo(x + hexOffsets[4][0], y + hexOffsets[4][1]);
          ctx.lineTo(x + hexOffsets[5][0], y + hexOffsets[5][1]);
          ctx.closePath();
        }
      }
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. If user is hovering on desktop, draw only the hovered hexagon highlight
      if (!isTouchDevice && hoverActive && smoothPointerX > 0 && smoothPointerY > 0) {
        const activeRadius = radius * 1.2;
        // Check only nearby hexagons
        const approxRow = Math.round((smoothPointerY - moveY) / verticalSpacing);
        for (let r = approxRow - 1; r <= approxRow + 1; r += 1) {
          const stagger = r % 2 !== 0 ? horizontalSpacing / 2 : 0;
          const y = r * verticalSpacing + moveY;
          const approxCol = Math.round((smoothPointerX - stagger - moveX) / horizontalSpacing);

          for (let c = approxCol - 1; c <= approxCol + 1; c += 1) {
            const x = c * horizontalSpacing + stagger + moveX;
            const dist = Math.hypot(x - smoothPointerX, y - smoothPointerY);
            if (dist <= activeRadius) {
              const strength = Math.max(0.38, 1 - dist / activeRadius);
              drawActiveHexagon(x, y, radius, strength);
            }
          }
        }
      }

      if (!reducedMotion && pageVisible) {
        const mobileFactor = width <= 768 ? 0.48 : 1;
        offset += speed * mobileFactor;
      }
    };

    /* =========================================
       RAF LOOP
    ========================================= */
    const animate = () => {
      // During active scroll, render once and don't saturate CPU
      if (!isScrolling) {
        draw();
      }

      if (pageVisible) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    /* =========================================
       SCROLL LISTENER (Free CPU/GPU during scroll)
    ========================================= */
    const handleScroll = () => {
      isScrolling = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 100);
    };

    /* =========================================
       POINTER EVENTS
    ========================================= */
    const handlePointerMove = (event) => {
      if (isTouchDevice) return;
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!hoverActive) {
        smoothPointerX = pointerX;
        smoothPointerY = pointerY;
      }
      hoverActive = true;
    };

    const handlePointerLeave = () => {
      hoverActive = false;
      pointerX = -9999;
      pointerY = -9999;
      smoothPointerX = pointerX;
      smoothPointerY = pointerY;
    };

    /* =========================================
       TAB VISIBILITY
    ========================================= */
    const handleVisibility = () => {
      pageVisible = !document.hidden;
      if (!pageVisible && animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      if (pageVisible && !animationFrame) {
        animate();
      }
    };

    /* =========================================
       START
    ========================================= */
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    animate();

    /* =========================================
       CLEANUP
    ========================================= */
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [speed, hexSize, lineColor]);

  return (
    <canvas ref={canvasRef} className="shape-grid-canvas" aria-hidden="true" />
  );
}

export default ShapeGrid;
