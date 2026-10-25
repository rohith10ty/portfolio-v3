import { useCallback, useEffect, useMemo, useRef } from "react";

import "./BorderGlow.css";

const GRADIENT_POSITIONS = [
  "80% 55%",
  "69% 34%",
  "8% 6%",
  "41% 38%",
  "86% 85%",
  "82% 18%",
  "51% 4%",
];
const GRADIENT_KEYS = [
  "--gradient-one",
  "--gradient-two",
  "--gradient-three",
  "--gradient-four",
  "--gradient-five",
  "--gradient-six",
  "--gradient-seven",
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function parseHSL(hslString) {
  const match = hslString.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);

  if (!match) return { h: 40, s: 44, l: 70 };

  return {
    h: Number.parseFloat(match[1]),
    s: Number.parseFloat(match[2]),
    l: Number.parseFloat(match[3]),
  };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];

  return opacities.reduce((variables, opacity, index) => {
    variables[`--glow-color${keys[index]}`] =
      `hsl(${h}deg ${s}% ${l}% / ${Math.min(opacity * intensity, 100)}%)`;
    return variables;
  }, {});
}

function buildGradientVars(colors) {
  const variables = {};

  GRADIENT_POSITIONS.forEach((position, index) => {
    const color = colors[Math.min(COLOR_MAP[index], colors.length - 1)];
    variables[GRADIENT_KEYS[index]] =
      `radial-gradient(at ${position}, ${color} 0, transparent 50%)`;
  });
  variables["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  variables["--border-one"] = colors[0];
  variables["--border-two"] = colors[Math.min(1, colors.length - 1)];
  variables["--border-three"] = colors[Math.min(2, colors.length - 1)];

  return variables;
}

function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "38 58 72",
  backgroundColor = "#120F17",
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  colors = ["#f0e7cf", "#cb9145", "#9b6b38"],
  fillOpacity = 0.5,
}) {
  const cardRef = useRef(null);

  const handlePointerMove = useCallback((event) => {
    const card = cardRef.current;

    if (!card || event.pointerType === "touch") return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const kx = dx === 0 ? Infinity : centerX / Math.abs(dx);
    const ky = dy === 0 ? Infinity : centerY / Math.abs(dy);
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

    if (angle < 0) angle += 360;

    card.style.setProperty("--edge-proximity", (edge * 100).toFixed(3));
    card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  }, []);

  const style = useMemo(
    () => ({
      "--card-bg": backgroundColor,
      "--edge-sensitivity": edgeSensitivity,
      "--border-radius": `${borderRadius}px`,
      "--glow-padding": `${glowRadius}px`,
      "--cone-spread": coneSpread,
      "--fill-opacity": fillOpacity,
      ...buildGlowVars(glowColor, glowIntensity),
      ...buildGradientVars(colors),
    }),
    [
      backgroundColor,
      borderRadius,
      colors,
      coneSpread,
      edgeSensitivity,
      fillOpacity,
      glowColor,
      glowIntensity,
      glowRadius,
    ],
  );

  useEffect(() => {
    const card = cardRef.current;

    return () => {
      card?.style.removeProperty("--edge-proximity");
      card?.style.removeProperty("--cursor-angle");
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`.trim()}
      style={style}
    >
      <span className="edge-light" aria-hidden="true" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}

export default BorderGlow;
