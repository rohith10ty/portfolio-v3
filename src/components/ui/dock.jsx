import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";

const DEFAULT_MAGNIFICATION = 58;
const DEFAULT_DISTANCE = 140;
const DEFAULT_SIZE = 36;

/**
 * Dock component (Magic UI Rhombus Dock with Elastic Spring Magnification Wave)
 */
export const Dock = React.forwardRef(
  (
    {
      className,
      children,
      magnification = DEFAULT_MAGNIFICATION,
      distance = DEFAULT_DISTANCE,
      direction = "middle",
      ...props
    },
    ref
  ) => {
    const mouseX = useMotionValue(Infinity);

    const renderChildren = () => {
      return React.Children.toArray(children).map((child) => {
        if (React.isValidElement(child)) {
          if (
            child.type === DockSeparator ||
            child.props?.["data-dock-separator"] ||
            child.type?.displayName === "DockSeparator"
          ) {
            return child;
          }
          return React.cloneElement(child, {
            mouseX,
            magnification,
            distance,
          });
        }
        return child;
      });
    };

    return (
      <div
        ref={ref}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        {...props}
        className={cn(
          "relative isolate flex h-[50px] items-center gap-1.5 px-3.5 py-1",
          className
        )}
      >
        {/* Rhombus background frame behind all items (-z-10) */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 -skew-x-12 rounded-[7px] border border-[rgba(225,188,120,0.38)] bg-[#140d07]/92 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(139,98,52,0.18)]"
          aria-hidden="true"
        />

        {/* Icon items with spring wave expansion */}
        {renderChildren()}
      </div>
    );
  }
);

Dock.displayName = "Dock";

/**
 * DockSeparator component - Crisp Luxury Gold Divider Line
 */
export const DockSeparator = ({ className, style, ...props }) => (
  <div
    role="separator"
    data-dock-separator="true"
    className={cn(
      "relative z-10 mx-2 h-5 w-[1px] min-w-[1px] shrink-0 self-center rounded-full bg-[rgba(225,220,201,0.35)] shadow-[0_0_6px_rgba(216,160,94,0.3)]",
      className
    )}
    style={{
      width: "1px",
      minWidth: "1px",
      height: "20px",
      flexShrink: 0,
      backgroundColor: "rgba(225, 220, 201, 0.35)",
      ...style,
    }}
    aria-hidden="true"
    {...props}
  />
);

DockSeparator.displayName = "DockSeparator";

/**
 * DockIcon component - Elastic Spring Expanding Wave + Link & Click Support
 */
export const DockIcon = ({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  tooltip,
  href,
  target,
  rel,
  onClick,
  ...props
}) => {
  const ref = useRef(null);
  const fallbackMouseX = useMotionValue(Infinity);
  const activeMouseX = mouseX || fallbackMouseX;

  const distanceCalc = useTransform(activeMouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, magnification, size]
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const Component = href ? motion.a : motion.div;

  return (
    <Component
      ref={ref}
      style={{ width }}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      className={cn(
        "group relative flex aspect-square cursor-pointer items-center justify-center text-[rgba(225,220,201,0.75)] transition-colors duration-150 hover:text-[#f0cd9b]",
        className
      )}
      {...props}
    >
      {/* Icon expands in lockstep with the dock magnification wave */}
      <div className="flex h-full w-full items-center justify-center pointer-events-none transition-transform duration-150 ease-out group-hover:scale-110 [&_svg]:h-[52%] [&_svg]:w-[52%]">
        {children}
      </div>

      {/* Tooltip on hover */}
      {tooltip && (
        <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[4px] border border-[rgba(216,160,94,0.35)] bg-[#1a120b]/95 px-2 py-0.5 text-[10.5px] font-medium tracking-wider text-[#e1dcc9] shadow-lg backdrop-blur-md opacity-0 translate-y-1 scale-95 transition-all duration-150 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 z-50">
          {tooltip}
        </div>
      )}
    </Component>
  );
};

DockIcon.displayName = "DockIcon";

