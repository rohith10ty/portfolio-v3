import React, { useState, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

/**
 * InteractiveGridPattern - Magic UI Interactive Grid Background
 * Renders an interactive SVG grid where squares highlight dynamically on hover.
 */
export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [32, 20],
  className,
  squaresClassName,
  ...props
}) {
  const [horizontal, vertical] = squares;
  const [hoveredSquare, setHoveredSquare] = useState(null);
  const containerRef = useRef(null);
  const [gridSize, setGridSize] = useState({ cols: horizontal, rows: vertical });

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const cols = Math.max(Math.ceil(clientWidth / width) + 2, 10);
      const rows = Math.max(Math.ceil(clientHeight / height) + 2, 10);
      setGridSize({ cols, rows });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [width, height]);

  const { cols, rows } = gridSize;

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      {...props}
    >
      <svg
        className="pointer-events-auto absolute inset-0 h-full w-full"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="interactive-grid-pattern-hero"
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
            x={-1}
            y={-1}
          >
            <path
              d={`M.5 ${height}V.5H${width}`}
              fill="none"
              stroke="rgba(225, 220, 201, 0.12)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="url(#interactive-grid-pattern-hero)"
        />

        <svg x={-1} y={-1} className="overflow-visible">
          {Array.from({ length: cols * rows }).map((_, index) => {
            const x = (index % cols) * width;
            const y = Math.floor(index / cols) * height;
            const isHovered = hoveredSquare === index;

            return (
              <rect
                key={index}
                x={x}
                y={y}
                width={width}
                height={height}
                className={cn(
                  "cursor-pointer stroke-[rgba(225,220,201,0.06)] transition-all duration-300 ease-out",
                  isHovered
                    ? "fill-[rgba(216,160,94,0.35)] stroke-[rgba(216,160,94,0.6)] duration-0"
                    : "fill-transparent",
                  squaresClassName
                )}
                onMouseEnter={() => setHoveredSquare(index)}
                onMouseLeave={() => setHoveredSquare(null)}
              />
            );
          })}
        </svg>
      </svg>
    </div>
  );
}

export default InteractiveGridPattern;
