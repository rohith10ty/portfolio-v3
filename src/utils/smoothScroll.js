let lenisInstance = null;
let fallbackAnimationFrame = 0;

const easeInOutSine = (progress) =>
  -(Math.cos(Math.PI * progress) - 1) / 2;

export function registerLenis(instance) {
  lenisInstance = instance;

  return () => {
    if (lenisInstance === instance) lenisInstance = null;
  };
}

export function smoothScrollTo(target, options = {}) {
  const { offset = 0, duration = 1.75 } = options;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const destination =
    typeof target === "number"
      ? target
      : target.getBoundingClientRect().top + window.scrollY + offset;
  const distance = destination - window.scrollY;
  const adaptiveDuration = Math.min(
    4.2,
    Math.max(duration, Math.abs(distance) / 2300),
  );

  if (reducedMotion) {
    window.scrollTo(0, destination);
    return;
  }

  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset,
      duration: adaptiveDuration,
      easing: easeInOutSine,
      force: true,
    });
    return;
  }

  window.cancelAnimationFrame(fallbackAnimationFrame);

  const start = window.scrollY;
  const startedAt = performance.now();
  const durationMs = Math.min(
    4200,
    Math.max(adaptiveDuration * 1000, Math.abs(distance) * 0.42),
  );

  const animate = (time) => {
    const progress = Math.min((time - startedAt) / durationMs, 1);
    window.scrollTo(0, start + distance * easeInOutSine(progress));

    if (progress < 1) {
      fallbackAnimationFrame = window.requestAnimationFrame(animate);
    }
  };

  fallbackAnimationFrame = window.requestAnimationFrame(animate);
}
