import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Globe, Loader2 } from "lucide-react";

export function MacbookPro({ url, src, className, children, ...props }) {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const screenRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 560, height: 350 });

  useEffect(() => {
    setIsLoading(true);
    setIframeError(false);

    // Auto-dismiss loading after 3.5s in case iframe onload event is blocked or delayed
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

  // Standard desktop viewport (1280px width standard 16:10 display)
  const desktopViewportWidth = 1280;
  const scale = dimensions.width / desktopViewportWidth;
  const desktopViewportHeight = dimensions.height / scale;

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-[680px] flex-col items-center select-none",
        className
      )}
      {...props}
    >
      {/* Refined Slim Bronze-Bordered Curved Display Frame */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] sm:rounded-[22px] border-[1.5px] border-[rgba(225,188,120,0.35)] bg-[#0c0c0e] p-[3px] sm:p-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.88),0_0_24px_rgba(216,160,94,0.16)]">
        {/* Inner Screen Bezel */}
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[14px] sm:rounded-[18px] bg-[#050505]">
          {/* Screen Content */}
          <div
            ref={screenRef}
            className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#0c0c0e] via-[#070708] to-[#040405]"
          >
            {url && !iframeError ? (
              <div className="relative h-full w-full overflow-hidden bg-white">
                {isLoading && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0d0d0d] text-center">
                    <Loader2 className="h-6 w-6 text-[#d8a05e] animate-spin mb-2" />
                    <span className="text-[11px] font-mono text-[#e1dcc9]/60">Loading desktop preview...</span>
                  </div>
                )}
                {/* Scaled True Desktop Canvas (1280px standard desktop width) */}
                <div
                  style={{
                    width: `${desktopViewportWidth}px`,
                    height: `${desktopViewportHeight}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: "0 0",
                  }}
                  className="absolute top-0 left-0"
                >
                  <iframe
                    key={url}
                    src={url}
                    title="Live Desktop Preview"
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
                alt="Desktop Preview"
                className="h-full w-full object-cover"
              />
            ) : children ? (
              children
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6">
                <div className="relative mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(225,188,120,0.25)] bg-[rgba(216,160,94,0.08)] shadow-[0_0_20px_rgba(216,160,94,0.1)]">
                  <Globe className="h-5 w-5 text-[#d8a05e]" />
                </div>
                <span className="text-[12px] font-mono tracking-widest text-[#e1dcc9]/70 uppercase">
                  Select a project with live demo
                </span>
              </div>
            )}

            {/* Screen Glass Glare / Gloss Effect */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.03]" />
          </div>
        </div>
      </div>
    </div>
  );
}
