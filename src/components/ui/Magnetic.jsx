import React, { useRef } from "react";
import gsap from "gsap";

export default function Magnetic({ children, strength = 0.5 }) {
  const targetRef = useRef(null);

  const child = React.Children.only(children);

  const handleMouseMove = (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const target = targetRef.current;

    if (!target) return;

    const rect = target.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (event.clientX - centerX) * strength;
    const y = (event.clientY - centerY) * strength;

    gsap.killTweensOf(target);

    gsap.to(target, {
      x,
      y,
      duration: 0.35,
      ease: "power3.out",
      overwrite: true,
    });

    child.props.onMouseMove?.(event);
  };

  const handleMouseLeave = (event) => {
    const target = targetRef.current;

    if (!target) return;

    gsap.killTweensOf(target);

    gsap.to(target, {
      x: 0,
      y: 0,
      duration: 1.1,
      ease: "elastic.out(1, 0.3)",
      overwrite: true,
    });

    child.props.onMouseLeave?.(event);
  };

  return React.cloneElement(child, {
    ref: targetRef,

    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,

    style: {
      ...child.props.style,
      willChange: "transform",
    },
  });
}
