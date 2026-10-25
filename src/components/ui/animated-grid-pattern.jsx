import React, { useEffect, useId, useRef, useState } from "react";
import { cn } from "../../lib/utils";

/**
 * AnimatedGridPattern - Dynamic Organic Fading Grid Background
 * Selects random box coordinates across the entire grid surface,
 * fading them in and out smoothly with cooldown memory to prevent immediate repeats.
 */
export function AnimatedGridPattern({
  width = 44,
  height = 44,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  maxActive = 12,
  cols = 44,
  rows = 26,
  className = "",
  maxOpacity = 0.32,
}) {
  const id = useId();
  const [activeBoxes, setActiveBoxes] = useState([]);
  const recentlyUsedRef = useRef(new Set());
  const historyQueueRef = useRef([]);
  const boxIdCounterRef = useRef(0);

  useEffect(() => {
    // Total cooldown history length before a square can fade in again
    const COOLDOWN_LIMIT = Math.min(130, Math.floor((cols * rows) * 0.45));

    const spawnFadingBox = () => {
      let attempts = 0;
      let targetX = 0;
      let targetY = 0;
      let key = "";

      // Pick an unused coordinate not in recent cooldown
      do {
        targetX = Math.floor(Math.random() * cols);
        targetY = Math.floor(Math.random() * rows);
        key = `${targetX}:${targetY}`;
        attempts += 1;
      } while (recentlyUsedRef.current.has(key) && attempts < 50);

      // Add to cooldown history
      recentlyUsedRef.current.add(key);
      historyQueueRef.current.push(key);
      if (historyQueueRef.current.length > COOLDOWN_LIMIT) {
        const oldest = historyQueueRef.current.shift();
        recentlyUsedRef.current.delete(oldest);
      }

      boxIdCounterRef.current += 1;
      const duration = 3.0 + Math.random() * 1.8; // 3.0s to 4.8s smooth breathing duration

      const newBox = {
        id: boxIdCounterRef.current,
        x: targetX,
        y: targetY,
        duration,
        opacity: +(maxOpacity * (0.8 + Math.random() * 0.4)).toFixed(2),
        createdAt: Date.now(),
      };

      setActiveBoxes((prev) => {
        const now = Date.now();
        // Remove expired boxes
        const alive = prev.filter((b) => now - b.createdAt < b.duration * 1000);
        if (alive.length >= maxActive) return alive;
        return [...alive, newBox];
      });
    };

    // Staggered initial population
    for (let i = 0; i < 7; i += 1) {
      setTimeout(spawnFadingBox, i * 220);
    }

    // Gentle spawner interval
    const interval = setInterval(spawnFadingBox, 360);

    return () => clearInterval(interval);
  }, [cols, rows, maxActive, maxOpacity]);

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-[#d8a05e]/25 stroke-[rgba(225,195,140,0.22)]",
        className
      )}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>

      {/* Grid Pattern Lines */}
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />

      {/* Dynamic Smooth Fading Boxes with Warm Gold Lighting */}
      <svg x={x} y={y} className="overflow-visible">
        {activeBoxes.map((box) => (
          <rect
            strokeWidth="0"
            key={box.id}
            width={width - 1}
            height={height - 1}
            x={box.x * width + 1}
            y={box.y * height + 1}
            className="fill-[#e5ab66] animate-box-fade"
            style={{
              animationDuration: `${box.duration}s`,
              "--fade-opacity": Math.min(0.7, box.opacity * 1.35),
            }}
          />
        ))}
      </svg>
    </svg>
  );
}

export default AnimatedGridPattern;
