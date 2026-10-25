import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Smartphone, Loader2 } from "lucide-react";

export function Iphone16Pro({
  url,
  src,
  className,
  children,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const screenRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 160, height: 340 });

  useEffect(() => {
    setIsLoading(true);
    setIframeError(false);

    // Auto-dismiss loading after 3.5s in case iframe onload doesn't fire due to third-party headers
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

    return () => {
      ro.disconnect();
    };
  }, []);

  // Standard mobile viewport: 375px width (iPhone standard viewport)
  const mobileViewportWidth = 375;
  const scale = (dimensions.width || 160) / mobileViewportWidth;
  const mobileViewportHeight = (dimensions.height || 340) / scale;

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-[280px] aspect-[9/19] select-none flex-col items-center",
        className
      )}
      {...props}
    >
      {/* Modern iPhone Outer Chassis */}
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[24px] border-[2px] border-[rgba(225,220,201,0.2)] bg-[#0d0d0d] p-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.88),0_0_30px_rgba(139,98,52,0.14)]">
        {/* Screen Display Bezel */}
        <div
          ref={screenRef}
          className="relative flex h-full w-full flex-col overflow-hidden rounded-[18px] bg-[#050505]"
        >
          {url && !iframeError ? (
            <div className="relative h-full w-full overflow-hidden bg-white">
              {isLoading && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0d0d0d] text-center p-2">
                  <Loader2 className="h-5 w-5 text-[#d8a05e] animate-spin mb-1.5" />
                  <span className="text-[9px] font-mono text-[#e1dcc9]/60">
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
              className="h-full w-full object-cover"
            />
          ) : children ? (
            children
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center bg-[#08080a]">
              <div className="relative mb-2 flex h-8 w-8 items-center justify-center rounded-xl border border-[rgba(225,188,120,0.25)] bg-[rgba(216,160,94,0.08)] shadow-[0_0_15px_rgba(216,160,94,0.1)]">
                <Smartphone className="h-4 w-4 text-[#d8a05e]" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-[#e1dcc9]/55 uppercase">
                Mobile Standby
              </span>
            </div>
          )}

          {/* Screen Gloss Glare */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.04]" />

          {/* Bottom Home Indicator Bar */}
          <div className="pointer-events-none absolute bottom-1.5 left-1/2 h-[3.5px] w-[80px] -translate-x-1/2 rounded-full bg-white/35 z-30" />
        </div>
      </div>
    </div>
  );
}

export const Iphone = Iphone16Pro;
