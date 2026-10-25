import { useLayoutEffect, useRef, useState } from "react";

import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   MAGNETIC BUTTON
========================================================= */

function Magnetic({ children, strength = 0.5 }) {
  const areaRef = useRef(null);
  const buttonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const area = areaRef.current;
    const button = buttonRef.current;

    if (!area || !button) return;

    const rect = area.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    gsap.killTweensOf(button);

    gsap.to(button, {
      x: (event.clientX - centerX) * strength,
      y: (event.clientY - centerY) * strength,
      duration: 0.35,
      ease: "power3.out",
      overwrite: true,
    });
  };

  const handleMouseLeave = () => {
    const button = buttonRef.current;

    if (!button) return;

    gsap.killTweensOf(button);

    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 1.1,
      ease: "elastic.out(1, 0.3)",
      overwrite: true,
    });
  };

  return (
    <div
      ref={areaRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="
        relative
        -m-[24px]
        inline-flex
        items-center
        justify-center
        p-[24px]
      "
    >
      <div
        ref={buttonRef}
        className="inline-flex items-center justify-center will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   SKILL PILL
========================================================= */

function FloatingSkillPill({ children, className = "" }) {
  return (
    <div
      data-skill-pill
      className={`
        absolute
        z-[80]

        inline-flex
        h-[42px]
        min-w-[96px]
        items-center
        justify-center

        rounded-full

        border
        border-[#E1DCC9]/15

        bg-[#412D15]/90

        px-[18px]

        text-[13px]
        font-semibold
        tracking-[0.01em]
        text-[#FFF8E8]

        shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_28px_rgba(0,0,0,0.26)]

        backdrop-blur-[10px]

        will-change-transform

        ${className}
      `}
    >
      {children}
    </div>
  );
}

/* =========================================================
   CANVAS SETTINGS

   This is ONE COMPLETE IPAD.

   It contains:
   - outer frame
   - bezel
   - camera dot
   - exact project screenshot
========================================================= */

const IPAD_WIDTH = 760;
const IPAD_HEIGHT = 570;

const DUST_LAYERS = 64;
const DUST_REPEAT = 2;

/* =========================================================
   ROUNDED RECTANGLE
========================================================= */

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();

  ctx.moveTo(x + r, y);

  ctx.arcTo(x + width, y, x + width, y + height, r);

  ctx.arcTo(x + width, y + height, x, y + height, r);

  ctx.arcTo(x, y + height, x, y, r);

  ctx.arcTo(x, y, x + width, y, r);

  ctx.closePath();
}

/* =========================================================
   DRAW IMAGE USING CONTAIN

   Entire screenshot remains visible.

   No POS / Dinky right-side cropping.
========================================================= */

function drawImageContain(ctx, image, x, y, width, height) {
  const imageRatio = image.naturalWidth / image.naturalHeight;

  const boxRatio = width / height;

  let drawWidth;
  let drawHeight;
  let drawX;
  let drawY;

  if (imageRatio > boxRatio) {
    drawWidth = width;
    drawHeight = width / imageRatio;

    drawX = x;
    drawY = y + (height - drawHeight) / 2;
  } else {
    drawHeight = height;
    drawWidth = height * imageRatio;

    drawX = x + (width - drawWidth) / 2;
    drawY = y;
  }

  ctx.fillStyle = "#050505";

  ctx.fillRect(x, y, width, height);

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

/* =========================================================
   BUILD ONE COMPLETE IPAD CANVAS
========================================================= */

function buildIpadCanvas(image) {
  const canvas = document.createElement("canvas");

  canvas.width = IPAD_WIDTH;
  canvas.height = IPAD_HEIGHT;

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  ctx.clearRect(0, 0, IPAD_WIDTH, IPAD_HEIGHT);

  /* ---------------------------------------------------------
     SHADOW AREA
  --------------------------------------------------------- */

  ctx.save();

  ctx.shadowColor = "rgba(0,0,0,0.48)";
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 14;

  roundedRect(ctx, 22, 22, IPAD_WIDTH - 44, IPAD_HEIGHT - 44, 44);

  ctx.fillStyle = "#151515";
  ctx.fill();

  ctx.restore();

  /* ---------------------------------------------------------
     OUTER IPAD FRAME
  --------------------------------------------------------- */

  roundedRect(ctx, 22, 22, IPAD_WIDTH - 44, IPAD_HEIGHT - 44, 44);

  ctx.fillStyle = "#151515";
  ctx.fill();

  ctx.lineWidth = 5;

  ctx.strokeStyle = "rgba(143,138,130,0.92)";

  ctx.stroke();

  /* ---------------------------------------------------------
     INNER FRAME
  --------------------------------------------------------- */

  roundedRect(ctx, 30, 30, IPAD_WIDTH - 60, IPAD_HEIGHT - 60, 37);

  ctx.strokeStyle = "rgba(255,255,255,0.07)";

  ctx.lineWidth = 2;

  ctx.stroke();

  /* ---------------------------------------------------------
     SCREEN
  --------------------------------------------------------- */

  const screenX = 42;
  const screenY = 42;

  const screenWidth = IPAD_WIDTH - 84;

  const screenHeight = IPAD_HEIGHT - 84;

  ctx.save();

  roundedRect(ctx, screenX, screenY, screenWidth, screenHeight, 30);

  ctx.clip();

  drawImageContain(ctx, image, screenX, screenY, screenWidth, screenHeight);

  ctx.restore();

  /* ---------------------------------------------------------
     CAMERA DOT
  --------------------------------------------------------- */

  ctx.beginPath();

  ctx.arc(26, IPAD_HEIGHT / 2, 5, 0, Math.PI * 2);

  ctx.fillStyle = "#050505";
  ctx.fill();

  ctx.lineWidth = 1;

  ctx.strokeStyle = "rgba(255,255,255,0.16)";

  ctx.stroke();

  return canvas;
}

/* =========================================================
   DISTRIBUTE THE EXACT IPAD INTO PIXEL LAYERS
========================================================= */

function distributePixels(sourceCanvas, count, repeat = 2) {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;

  const ctx = sourceCanvas.getContext("2d", {
    willReadFrequently: true,
  });

  const source = ctx.getImageData(0, 0, width, height);

  const layers = Array.from({ length: count }, () =>
    ctx.createImageData(width, height),
  );

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      const index = (x + y * width) * 4;

      if (source.data[index + 3] === 0) {
        continue;
      }

      for (let r = 0; r < repeat; r += 1) {
        let layerIndex = Math.floor(
          (count * (Math.random() + (2 * x) / width)) / 3,
        );

        layerIndex = Math.max(0, Math.min(count - 1, layerIndex));

        const target = layers[layerIndex].data;

        target[index] = source.data[index];

        target[index + 1] = source.data[index + 1];

        target[index + 2] = source.data[index + 2];

        target[index + 3] = source.data[index + 3];
      }
    }
  }

  return layers;
}

/* =========================================================
   ONE IPAD RENDERER

   THIS IS THE IMPORTANT CHANGE.

   There is no CSS iPad anymore.

   This creates:
   1. one STATIC canvas
   2. dust canvases generated FROM that exact static canvas

   Therefore all states are literally the same object.
========================================================= */

function DustIpad({ imageSrc, staticRef, fragmentsRef, onReady }) {
  useLayoutEffect(() => {
    const staticHost = staticRef.current;
    const fragmentHost = fragmentsRef.current;

    if (!staticHost || !fragmentHost) {
      return undefined;
    }

    staticHost.replaceChildren();
    fragmentHost.replaceChildren();

    let cancelled = false;

    const image = new Image();

    image.decoding = "async";

    image.onload = () => {
      if (cancelled) return;

      /* =====================================================
         CREATE THE ONE MASTER IPAD
      ===================================================== */

      const masterCanvas = buildIpadCanvas(image);

      /* =====================================================
         STATIC HOLD VERSION

         This is a clone of THE SAME master canvas.
      ===================================================== */

      const holdCanvas = document.createElement("canvas");

      holdCanvas.width = IPAD_WIDTH;

      holdCanvas.height = IPAD_HEIGHT;

      holdCanvas.className = "absolute inset-0 h-full w-full";

      holdCanvas.dataset.staticIpad = "true";

      holdCanvas.style.pointerEvents = "none";

      holdCanvas.getContext("2d").drawImage(masterCanvas, 0, 0);

      staticHost.appendChild(holdCanvas);

      /* =====================================================
         DUST VERSION

         Created from THE SAME master canvas.
      ===================================================== */

      const layers = distributePixels(masterCanvas, DUST_LAYERS, DUST_REPEAT);

      layers.forEach((data, index) => {
        const canvas = document.createElement("canvas");

        canvas.width = IPAD_WIDTH;

        canvas.height = IPAD_HEIGHT;

        canvas.dataset.ipadFragment = "true";

        canvas.dataset.fragmentIndex = String(index);

        canvas.className = `
              absolute
              inset-0
              h-full
              w-full
              will-change-transform
            `;

        canvas.style.pointerEvents = "none";

        canvas.style.transformOrigin = "center center";

        canvas.getContext("2d").putImageData(data, 0, 0);

        fragmentHost.appendChild(canvas);
      });

      onReady?.();
    };

    image.onerror = () => {
      console.error(`Could not load project image: ${imageSrc}`);
    };

    image.src = imageSrc;

    return () => {
      cancelled = true;

      image.onload = null;
      image.onerror = null;

      staticHost.replaceChildren();
      fragmentHost.replaceChildren();
    };
  }, [imageSrc, staticRef, fragmentsRef]);

  return null;
}

/* =========================================================
   PROJECT SHOWCASE
========================================================= */

function ProjectShowcase({ project, index }) {
  const sceneRef = useRef(null);
  const stageRef = useRef(null);

  const contentRef = useRef(null);

  const visualRef = useRef(null);

  const staticIpadRef = useRef(null);

  const ipadFragmentsRef = useRef(null);

  const pillsRef = useRef(null);

  const [dustReady, setDustReady] = useState(false);

  const reverse = index % 2 === 1;

  useLayoutEffect(() => {
    const scene = sceneRef.current;

    const stage = stageRef.current;

    const content = contentRef.current;

    const visual = visualRef.current;

    const staticHost = staticIpadRef.current;

    const fragmentHost = ipadFragmentsRef.current;

    const pillsHost = pillsRef.current;

    if (
      !dustReady ||
      !scene ||
      !stage ||
      !content ||
      !visual ||
      !staticHost ||
      !fragmentHost ||
      !pillsHost
    ) {
      return undefined;
    }

    const staticIpad = staticHost.querySelector("[data-static-ipad]");

    const fragments = Array.from(
      fragmentHost.querySelectorAll("[data-ipad-fragment]"),
    );

    const pills = Array.from(pillsHost.querySelectorAll("[data-skill-pill]"));

    if (!staticIpad || !fragments.length) {
      return undefined;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      gsap.set(content, {
        x: 0,
        autoAlpha: 1,
      });

      gsap.set(staticIpad, {
        autoAlpha: 1,
      });

      gsap.set(pills, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
      });

      return undefined;
    }

    const ctx = gsap.context(() => {
      const getLeftStart = (element) => {
        const rect = element.getBoundingClientRect();

        return -(rect.right + Math.max(220, window.innerWidth * 0.12));
      };

      const getRightExit = (element) => {
        const rect = element.getBoundingClientRect();

        return (
          window.innerWidth -
          rect.left +
          Math.max(220, window.innerWidth * 0.12)
        );
      };

      /* =================================================
           INITIAL CONTENT
        ================================================= */

      gsap.set(content, {
        x: () => getLeftStart(content),

        autoAlpha: 1,
      });

      gsap.set(visual, {
        autoAlpha: 1,
      });

      /* =================================================
           STATIC IPAD HIDDEN INITIALLY
        ================================================= */

      gsap.set(staticIpad, {
        autoAlpha: 0,
      });

      /* =================================================
           DUST IPAD INITIAL STATE
        ================================================= */

      gsap.set(fragments, {
        autoAlpha: 0,

        x: (i) => -56 - (i % 11) * 3,

        y: (i) => Math.sin(i * 1.72) * 27,

        rotation: (i) => ((i % 15) - 7) * 1.35,

        scale: (i) => 0.96 + (i % 5) * 0.01,
      });

      /* =================================================
           SKILL CASCADE INITIAL
        ================================================= */

      gsap.set(pills, {
        autoAlpha: 0,

        y: 25,

        scale: 0.84,

        filter: "blur(5px)",
      });

      /* =================================================
           SCROLL TIMELINE
        ================================================= */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scene,

          start: () =>
            window.innerWidth >= 768 && window.innerWidth <= 1024
              ? "top top"
              : "top top+=72",

          end: "+=6500",

          pin: stage,

          pinSpacing: true,

          refreshPriority: 5 - index,

          preventOverlaps: "featured-projects",

          scrub: 0.9,

          anticipatePin: 1,

          fastScrollEnd: false,

          invalidateOnRefresh: true,
        },
      });

      /* =================================================
           1. CONTENT ENTERS
        ================================================= */

      tl.to(content, {
        x: 0,

        duration: 0.17,

        ease: "none",
      });

      tl.to(
        {},
        {
          duration: 0.04,
        },
      );

      /* =================================================
           2. ENTIRE IPAD MATERIALISES

           FRAME + SCREEN + CAMERA ALL TOGETHER.
        ================================================= */

      tl.to(fragments, {
        autoAlpha: 1,

        x: 0,
        y: 0,

        rotation: 0,

        scale: 1,

        duration: 0.27,

        stagger: {
          each: 0.0042,

          from: "end",
        },

        ease: "none",
      });

      /* =================================================
           EXACT SAME MASTER IPAD HOLDS

           Since both came from masterCanvas,
           there is NO visual change here.
        ================================================= */

      tl.set(staticIpad, {
        autoAlpha: 1,
      });

      tl.set(fragments, {
        autoAlpha: 0,
      });

      tl.to(
        {},
        {
          duration: 0.045,
        },
      );

      /* =================================================
           3. SKILLS STAGGERED CASCADE
        ================================================= */

      tl.to(pills, {
        autoAlpha: 1,

        y: 0,

        scale: 1,

        filter: "blur(0px)",

        duration: 0.15,

        stagger: {
          each: 0.06,

          from: "start",
        },

        ease: "power3.out",
      });

      /* =================================================
           4. HOLD EVERYTHING
        ================================================= */

      tl.to(
        {},
        {
          duration: 0.28,
        },
      );

      /* =================================================
           5. SWITCH SAME MASTER BACK TO DUST

           Visually identical at the switching point.
        ================================================= */

      tl.set(
        fragments,
        {
          autoAlpha: 1,

          x: 0,
          y: 0,

          rotation: 0,

          scale: 1,
        },

        "destroy",
      );

      tl.set(
        staticIpad,
        {
          autoAlpha: 0,
        },

        "destroy",
      );

      /* =================================================
   6. ENTIRE IPAD DISINTEGRATES

   FRAME + SCREEN + CAMERA TOGETHER.
================================================= */

      tl.to(
        fragments,
        {
          autoAlpha: 0,

          x: (i) => 48 + (i % 11) * 3.3,

          y: (i) => Math.cos(i * 1.52) * 28,

          rotation: (i) => ((i % 15) - 7) * 1.6,

          scale: (i) => 0.93 - (i % 4) * 0.012,

          duration: 0.32,

          stagger: {
            each: 0.0037,
            from: "start",
          },

          ease: "none",
        },

        "destroy",
      );

      /* =================================================
   7. CONTENT STARTS MOVING WHILE IPAD DISAPPEARS

   This gives the "content is pushing the iPad" feel.
================================================= */

      tl.to(
        content,
        {
          x: () => getRightExit(content),

          duration: 0.34,

          ease: "none",
        },

        "destroy+=0.035",
      );

      /* =================================================
   8. PILLS STAGGER CASCADE OUT

   Pills disappear during the same transition.
================================================= */

      tl.to(
        pills,
        {
          autoAlpha: 0,

          y: -18,

          scale: 0.88,

          filter: "blur(5px)",

          duration: 0.16,

          stagger: {
            each: 0.045,
            from: "start",
          },

          ease: "power2.in",
        },

        "destroy+=0.05",
      );

      tl.to(
        {},
        {
          duration: 0.035,
        },
      );
    }, scene);

    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      window.clearTimeout(timer);

      ctx.revert();
    };
  }, [index, dustReady]);

  /* =========================================================
     PILL POSITIONS
  ========================================================= */

  const pillPositions = reverse
    ? [
        "right-[-48px] top-[28%]",
        "left-[10%] top-[-20px]",
        "right-[27%] bottom-[-20px]",
      ]
    : [
        "left-[-48px] top-[28%]",
        "right-[10%] top-[-20px]",
        "left-[43%] bottom-[-20px]",
      ];

  return (
    <section
      ref={sceneRef}
      className="
        relative
        min-h-[calc(100vh-72px)]
      "
      style={{
        width: "100vw",

        marginLeft: "calc(50% - 50vw)",
      }}
    >
      <article
        ref={stageRef}
        className="
          relative
          h-[calc(100vh-72px)]
          w-screen
          overflow-hidden

          flex
          flex-col
          items-center
          justify-center
          gap-8
          px-5

          lg:block
          lg:px-0
        "
      >
        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className={`
            relative
            z-[5]

            w-full
            max-w-[470px]

            lg:absolute
            lg:top-1/2
            lg:-translate-y-1/2

            ${
              reverse
                ? `
                  lg:left-auto
                  lg:right-[clamp(210px,18vw,320px)]
                  lg:w-[30%]
                  lg:translate-x-0
                `
                : `
                  lg:left-[clamp(210px,18vw,320px)]
                  lg:w-[30%]
                  lg:translate-x-0
                `
            }
          `}
        >
          <div ref={contentRef} className="w-full will-change-transform">
            <h3
              className="
                text-[clamp(43px,12vw,62px)]
                font-medium
                leading-[0.9]
                tracking-[-0.06em]
                text-[#E1DCC9]

                lg:text-[clamp(47px,4.2vw,68px)]
              "
            >
              {project.title}
            </h3>

            <h4
              className="
                mt-4
                text-[15px]
                font-medium
                tracking-[-0.01em]
                text-[#B98245]

                md:text-[17px]
              "
            >
              {project.subtitle}
            </h4>

            <p
              className="
                mt-5
                max-w-[500px]

                text-[14px]
                font-normal
                leading-[1.75]
                text-[#E1DCC9]/70

                sm:text-[15px]
                md:text-[16px]
                lg:text-[17px]
              "
            >
              {project.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Magnetic strength={0.5}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex
                    min-h-[44px]
                    items-center
                    justify-center
                    gap-2

                    rounded-full

                    border
                    border-[#E1DCC9]/15

                    bg-[#412D15]/45

                    px-5

                    text-[13px]
                    font-medium
                    text-[#E1DCC9]/90

                    no-underline

                    backdrop-blur-[8px]

                    transition-all
                    duration-300

                    hover:border-[#D5A66F]/35
                    hover:bg-[#5A3A1D]/55
                    hover:text-[#FFF8E8]

                    md:min-h-[46px]
                    md:text-[14px]
                  "
                >
                  View live
                  <ArrowUpRight size={15} />
                </a>
              </Magnetic>

              {project.githubUrl && (
                <Magnetic strength={0.5}>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      inline-flex
                      min-h-[44px]
                      items-center
                      justify-center
                      gap-2

                      rounded-full

                      border
                      border-[#E1DCC9]/15

                      bg-[#412D15]/45

                      px-5

                      text-[13px]
                      font-medium
                      text-[#E1DCC9]/90

                      no-underline

                      backdrop-blur-[8px]

                      transition-all
                      duration-300

                      hover:border-[#D5A66F]/35
                      hover:bg-[#5A3A1D]/55
                      hover:text-[#FFF8E8]

                      md:min-h-[46px]
                      md:text-[14px]
                    "
                  >
                    <FaGithub size={15} />
                    GitHub
                  </a>
                </Magnetic>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            IPAD AREA
        ================================================= */}

        <div
          className={`
            relative
            z-[4]

            w-[74%]
            max-w-[360px]

            sm:w-[68%]
            md:w-[58%]

            lg:absolute
            lg:top-1/2
            lg:-translate-y-1/2

            ${
              reverse
                ? `
                  lg:left-[clamp(210px,18vw,320px)]
                  lg:w-[29%]
                  lg:max-w-[475px]
                  lg:translate-x-0
                `
                : `
                  lg:left-auto
                  lg:right-[clamp(210px,18vw,320px)]
                  lg:w-[29%]
                  lg:max-w-[475px]
                  lg:translate-x-0
                `
            }
          `}
        >
          <div
            ref={visualRef}
            className="
              relative
              aspect-[4/3]
              w-full
            "
          >
            {/* =============================================
                STATIC VERSION OF SAME MASTER IPAD
            ============================================= */}

            <div
              ref={staticIpadRef}
              className="
                pointer-events-none
                absolute
                inset-0
                z-20
              "
            />

            {/* =============================================
                DUST VERSION OF SAME MASTER IPAD
            ============================================= */}

            <div
              ref={ipadFragmentsRef}
              className="
                pointer-events-none
                absolute
                inset-0
                z-40
                overflow-visible
              "
            />

            <DustIpad
              imageSrc={project.image}
              staticRef={staticIpadRef}
              fragmentsRef={ipadFragmentsRef}
              onReady={() => setDustReady(true)}
            />

            {/* =============================================
                SKILL PILLS
            ============================================= */}

            <div
              ref={pillsRef}
              className="
                pointer-events-none
                absolute
                inset-0
                z-60
                hidden
                lg:block
              "
            >
              {project.stack.map((skill, skillIndex) => (
                <FloatingSkillPill
                  key={skill}
                  className={
                    pillPositions[skillIndex] ||
                    pillPositions[pillPositions.length - 1]
                  }
                >
                  {skill}
                </FloatingSkillPill>
              ))}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export default ProjectShowcase;
