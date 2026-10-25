import React, { useEffect, useId, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Smartphone, Loader2 } from "lucide-react";

// iPhone hardware dimensions based on authentic Audix iPhone Device Mockup (#118)
// with optimized slim bezels and warm bronze metal theme
const PHONE_WIDTH = 433;
const PHONE_HEIGHT = 882;

// Reduced border geometry (slimmer bezel while preserving authentic corner curvature)
const SCREEN_X = 15;
const SCREEN_Y = 14;
const SCREEN_WIDTH = 403;
const SCREEN_HEIGHT = 854;
const SCREEN_RADIUS = 48;

// Calculated percentages for screen alignment
const LEFT_PCT = (SCREEN_X / PHONE_WIDTH) * 100;
const TOP_PCT = (SCREEN_Y / PHONE_HEIGHT) * 100;
const WIDTH_PCT = (SCREEN_WIDTH / PHONE_WIDTH) * 100;
const HEIGHT_PCT = (SCREEN_HEIGHT / PHONE_HEIGHT) * 100;
const RADIUS_H = (SCREEN_RADIUS / SCREEN_WIDTH) * 100;
const RADIUS_V = (SCREEN_RADIUS / SCREEN_HEIGHT) * 100;

export function Iphone({
  url,
  src,
  className = "",
  style,
  children,
  ...props
}) {
  const uid = useId().replace(/:/g, "");
  const maskId = `screenPunch-${uid}`;
  const clipId = `screenClip-${uid}`;

  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const screenRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 175, height: 370 });

  useEffect(() => {
    setIsLoading(true);
    setIframeError(false);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [url]);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth || el.offsetWidth;
      const h = el.clientHeight || el.offsetHeight;
      if (w > 0 && h > 0) {
        setDimensions({ width: w, height: h });
      }
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  // Standard mobile viewport: 375px width (iPhone standard viewport)
  const mobileViewportWidth = 375;
  const scale = (dimensions.width || 175) / mobileViewportWidth;
  const mobileViewportHeight = (dimensions.height || 370) / scale;

  const hasMedia = !!url || !!src || !!children;

  return (
    <div
      className={cn(
        "relative inline-block w-full align-middle leading-none select-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.92)]",
        className
      )}
      style={{
        aspectRatio: `${PHONE_WIDTH}/${PHONE_HEIGHT}`,
        ...style,
      }}
      {...props}
    >
      {/* 1. Screen Display Container (Mounted behind the SVG hardware mask) */}
      <div
        ref={screenRef}
        className="absolute z-0 overflow-hidden bg-[#09090b]"
        style={{
          left: `${LEFT_PCT}%`,
          top: `${TOP_PCT}%`,
          width: `${WIDTH_PCT}%`,
          height: `${HEIGHT_PCT}%`,
          borderRadius: `${RADIUS_H}% / ${RADIUS_V}%`,
        }}
      >
        {url && !iframeError ? (
          <div className="relative h-full w-full overflow-hidden bg-white">
            {isLoading && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0d0d0e] text-center p-3">
                <Loader2 className="h-5 w-5 text-[#d8a05e] animate-spin mb-1.5" />
                <span className="text-[9.5px] font-mono text-[#e1dcc9]/70">
                  Loading mobile view...
                </span>
              </div>
            )}
            {/* Scaled True Mobile Viewport (375px width standard) */}
            <div
              style={{
                width: `${mobileViewportWidth}px`,
                height: `${mobileViewportHeight}px`,
                transform: `scale(${scale})`,
                transformOrigin: "0 0",
              }}
              className="absolute top-0 left-0"
            >
              <iframe
                key={`iphone-${url}`}
                src={url}
                title="iPhone Live Preview"
                className="h-full w-full border-0 bg-white"
                onLoad={() => setIsLoading(false)}
                onError={() => setIframeError(true)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
              />
            </div>
          </div>
        ) : src ? (
          <img
            src={src}
            alt="iPhone Preview"
            className="h-full w-full object-cover object-top"
          />
        ) : children ? (
          children
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center bg-[#09090b]">
            <div className="relative mb-2 flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <Smartphone className="h-4 w-4 text-[#d8a05e]" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[#e1dcc9]/55 uppercase">
              Mobile Standby
            </span>
          </div>
        )}

        {/* Screen Glass Glare / Gloss Effect */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.035]" />
      </div>

      {/* 2. Authentic SVG Hardware Chassis Overlay - Classic Normal Black Finish */}
      <svg
        viewBox={`0 0 ${PHONE_WIDTH} ${PHONE_HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute inset-0 size-full z-10"
        style={{ transform: "translateZ(0)" }}
      >
        <defs>
          {/* Screen Punch Mask: Punches out the screen area cleanly */}
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width={PHONE_WIDTH} height={PHONE_HEIGHT} fill="white" />
            <rect
              x={SCREEN_X}
              y={SCREEN_Y}
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
              rx={SCREEN_RADIUS}
              ry={SCREEN_RADIUS}
              fill="black"
            />
          </mask>

          <clipPath id={clipId}>
            <rect
              x={SCREEN_X}
              y={SCREEN_Y}
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
              rx={SCREEN_RADIUS}
              ry={SCREEN_RADIUS}
            />
          </clipPath>
        </defs>

        {/* Chassis Body and Hardware Buttons Masked around Screen */}
        <g mask={hasMedia ? `url(#${maskId})` : undefined}>
          {/* Outer Rounded Chassis Rim - Normal Deep Space Black */}
          <path
            d="M2 73C2 32.6832 34.6832 0 75 0H357C397.317 0 430 32.6832 430 73V809C430 849.317 397.317 882 357 882H75C34.6832 882 2 849.317 2 809V73Z"
            fill="#2c2c30"
          />

          {/* Action Button */}
          <path
            d="M0 171C0 170.448 0.447715 170 1 170H3V204H1C0.447715 204 0 203.552 0 203V171Z"
            fill="#38383c"
          />

          {/* Volume Up Button */}
          <path
            d="M1 234C1 233.448 1.44772 233 2 233H3.5V300H2C1.44772 300 1 299.552 1 299V234Z"
            fill="#38383c"
          />

          {/* Volume Down Button */}
          <path
            d="M1 319C1 318.448 1.44772 318 2 318H3.5V385H2C1.44772 385 1 384.552 1 384V319Z"
            fill="#38383c"
          />

          {/* Side Power / Sleep Button */}
          <path
            d="M430 279H432C432.552 279 433 279.448 433 280V384C433 384.552 432.552 385 432 385H430V279Z"
            fill="#38383c"
          />

          {/* Inner Chassis Bezel - Normal Classic Black */}
          <path
            d="M6 74C6 35.3401 37.3401 4 76 4H356C394.66 4 426 35.3401 426 74V808C426 846.66 394.66 878 356 878H76C37.3401 878 6 846.66 6 808V74Z"
            fill="#101012"
          />
        </g>

        {/* Top Speaker Earpiece */}
        <path
          opacity="0.6"
          d="M174 5H258V5.5C258 6.60457 257.105 7.5 256 7.5H176C174.895 7.5 174 6.60457 174 5.5V5Z"
          fill="#3e3e42"
        />

        {/* Subtle Screen Outline - Normal Black/Dark Bezel */}
        <rect
          x={SCREEN_X}
          y={SCREEN_Y}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          rx={SCREEN_RADIUS}
          ry={SCREEN_RADIUS}
          fill="none"
          stroke="#202024"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

export const Iphone16Pro = Iphone;
