import { useLayoutEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";

import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SplitText } from "gsap/SplitText";
import { ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* =========================================================
   OTHER PROJECT DATA
========================================================= */

const otherProjects = {
  flex: {
    name: "Flex Living",

    url: "https://flex-housing.vercel.app/",
  },

  naturer: {
    name: "Naturer",

    url: "https://naturer.vercel.app/",
  },

  kalyan: {
    name: "Kalyan & Veda",

    url: "https://kalyanveda.invitation.rohithnaidu.com/",
  },
};

/* =========================================================
   PROJECT LINK
========================================================= */

function EditorialProjectLink({ project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      data-preview-project
      data-preview-name={project.name}
      data-preview-url={project.url}
      className="group relative inline-block align-baseline text-[1.2em] font-semibold leading-none text-[#f4efe0] underline decoration-[#c59253] decoration-[2px] underline-offset-[6px] transition-all duration-200 hover:text-[#e8ad65] hover:decoration-[#e8ad65] hover:underline-offset-[4px] cursor-pointer focus-visible:rounded-sm focus-visible:text-[#e8ad65] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#c59253]"
      aria-label={`Open ${project.name} in a new tab`}
    >
      <span>{project.name}</span>
      <ExternalLink className="inline-block ml-1.5 h-[0.62em] w-[0.62em] text-[#c59253] -translate-y-[2px] opacity-85 group-hover:opacity-100 group-hover:text-[#e8ad65] group-hover:translate-x-0.5 group-hover:-translate-y-1 transition-all" />
    </a>
  );
}

/* =========================================================
   WEBSITE PREVIEW
========================================================= */

function OtherProjectPreview({ project, position, x }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!project) return null;

  const width = 200;
  const height = 125;

  const screenshotUrl =
    `https://api.microlink.io/?url=${encodeURIComponent(project.url)}` +
    "&screenshot=true" +
    "&meta=false" +
    "&embed=screenshot.url" +
    "&viewport.width=1200" +
    "&viewport.height=750" +
    "&viewport.deviceScaleFactor=1";

  return createPortal(
    <motion.div
      key={project.url}
      initial={{
        opacity: 0,
        scale: 0.65,
        y: 18,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
        y: 10,
      }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 18,
        mass: 0.7,
      }}
      style={{
        position: "fixed",

        left: position.left,
        top: position.top,

        x,

        width,
        height,

        zIndex: 2147483647,

        pointerEvents: "none",

        transformOrigin: "bottom center",
      }}
    >
      <div
        style={{
          position: "relative",

          width: "100%",
          height: "100%",

          overflow: "hidden",

          borderRadius: "11px",

          background: "#080604",

          border: "1px solid rgba(225,220,201,0.3)",

          boxShadow:
            "0 20px 60px rgba(0,0,0,0.72), 0 0 28px rgba(185,130,69,0.16)",

          padding: "3px",
        }}
      >
        <div
          style={{
            position: "relative",

            width: "100%",
            height: "100%",

            overflow: "hidden",

            borderRadius: "8px",

            background: "#080604",
          }}
        >
          {!imageFailed && (
            <img
              src={screenshotUrl}
              alt={`${project.name} preview`}
              onError={() => {
                setImageFailed(true);
              }}
              style={{
                position: "absolute",

                inset: 0,

                width: "100%",
                height: "100%",

                objectFit: "cover",

                objectPosition: "top",
              }}
            />
          )}

          {imageFailed && (
            <iframe
              src={project.url}
              title={`${project.name} preview`}
              tabIndex={-1}
              scrolling="no"
              style={{
                position: "absolute",

                left: 0,
                top: 0,

                width: "1200px",
                height: "750px",

                border: 0,

                pointerEvents: "none",

                transform: `scale(${184 / 1200})`,

                transformOrigin: "top left",
              }}
            />
          )}
        </div>

        <div
          style={{
            position: "absolute",

            inset: 0,

            pointerEvents: "none",

            borderRadius: "11px",

            background:
              "linear-gradient(135deg, rgba(255,255,255,0.04), transparent 55%, rgba(139,98,52,0.04))",
          }}
        />
      </div>
    </motion.div>,

    document.body,
  );
}

/* =========================================================
   OTHER PROJECTS
========================================================= */

function OtherProjects() {
  const sectionRef = useRef(null);

  const copyRef = useRef(null);

  const labelRef = useRef(null);

  const hintRef = useRef(null);

  const [activeProject, setActiveProject] = useState(null);

  const [previewPosition, setPreviewPosition] = useState({
    left: 0,
    top: 0,
  });

  const previewOffsetX = useMotionValue(0);

  const smoothPreviewX = useSpring(previewOffsetX, {
    stiffness: 115,

    damping: 18,

    mass: 0.45,
  });

  /* =====================================================
     HOVER PREVIEW
  ===================================================== */

  useLayoutEffect(() => {
    const copy = copyRef.current;

    if (!copy) return undefined;

    let currentLink = null;

    const setPreviewCoordinates = (clientX, link, updateAnchor = false) => {
      const width = 200;
      const height = 125;
      const gutter = 15;

      const rect = link.getBoundingClientRect();

      const left = Math.min(
        Math.max(
          rect.left + rect.width / 2 - width / 2,

          gutter,
        ),

        window.innerWidth - width - gutter,
      );

      const top =
        rect.top - height - 24 < gutter
          ? rect.bottom + 16
          : rect.top - height - 24;

      if (updateAnchor) {
        setPreviewPosition({
          left,
          top,
        });
      }

      const offsetFromCenter = (clientX - (rect.left + rect.width / 2)) / 2;

      if (updateAnchor) {
        previewOffsetX.jump(offsetFromCenter);
      } else {
        previewOffsetX.set(offsetFromCenter);
      }
    };

    const getLink = (target) => {
      if (!(target instanceof Element)) {
        return null;
      }

      return target.closest("[data-preview-project]");
    };

    const openPreview = (link, clientX) => {
      currentLink = link;

      setActiveProject({
        name: link.dataset.previewName,

        url: link.dataset.previewUrl,
      });

      setPreviewCoordinates(clientX, link, true);
    };

    const handleMouseOver = (event) => {
      const link = getLink(event.target);

      if (!link || !copy.contains(link)) {
        return;
      }

      if (currentLink === link) {
        return;
      }

      openPreview(link, event.clientX);
    };

    const handleMouseMove = (event) => {
      const link = getLink(event.target);

      if (!link || !copy.contains(link)) {
        return;
      }

      if (currentLink !== link) {
        openPreview(link, event.clientX);

        return;
      }

      setPreviewCoordinates(event.clientX, link);
    };

    const handleMouseOut = (event) => {
      if (!currentLink) return;

      const nextTarget = event.relatedTarget;

      if (nextTarget instanceof Node && currentLink.contains(nextTarget)) {
        return;
      }

      const nextLink = getLink(nextTarget);

      if (nextLink && copy.contains(nextLink)) {
        openPreview(nextLink, event.clientX);

        return;
      }

      currentLink = null;

      setActiveProject(null);
    };

    const handleScroll = () => {
      currentLink = null;

      setActiveProject(null);
    };

    copy.addEventListener("mouseover", handleMouseOver);

    copy.addEventListener("mousemove", handleMouseMove);

    copy.addEventListener("mouseout", handleMouseOut);

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      copy.removeEventListener("mouseover", handleMouseOver);

      copy.removeEventListener("mousemove", handleMouseMove);

      copy.removeEventListener("mouseout", handleMouseOut);

      window.removeEventListener("scroll", handleScroll);
    };
  }, [previewOffsetX]);

  /* =====================================================
     SPLITTEXT REVEAL
  ===================================================== */

  useLayoutEffect(() => {
    const section = sectionRef.current;

    const copy = copyRef.current;

    if (!section || !copy) {
      return undefined;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      return undefined;
    }

    const splits = [];

    const allLines = [];

    const context = gsap.context(
      () => {
        const paragraphs = Array.from(
          copy.querySelectorAll("[data-reveal-copy]"),
        );

        paragraphs.forEach((paragraph) => {
          const split = SplitText.create(paragraph, {
            type: "lines",

            mask: "lines",

            linesClass: "portfolio-reveal-line++",

            lineThreshold: 0.1,
          });

          splits.push(split);

          allLines.push(...split.lines);
        });

        gsap.set(allLines, {
          y: "100%",
        });

        gsap.set(labelRef.current, {
          autoAlpha: 0,

          y: 15,
        });

        gsap.set(hintRef.current, {
          autoAlpha: 0,

          y: 15,
        });

        gsap.to(labelRef.current, {
          autoAlpha: 1,

          y: 0,

          duration: 0.7,

          ease: "power3.out",

          scrollTrigger: {
            trigger: section,

            start: "top 78%",

            once: true,
          },
        });

        gsap.to(allLines, {
          y: "0%",

          duration: 1,

          stagger: 0.1,

          ease: "power4.out",

          scrollTrigger: {
            trigger: copy,

            start: "top 75%",

            once: true,
          },
        });

        gsap.to(hintRef.current, {
          autoAlpha: 1,

          y: 0,

          duration: 0.7,

          delay: 0.25,

          ease: "power3.out",

          scrollTrigger: {
            trigger: copy,

            start: "top 70%",

            once: true,
          },
        });
      },

      section,
    );

    return () => {
      splits.forEach((split) => {
        split?.revert();
      });

      context.revert();
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="
          relative
          mx-auto
          mt-0

          flex
          min-h-[90vh]
          w-full
          max-w-[1400px]
          flex-col
          items-center
          justify-center

          px-4
          pb-[100px]
          pt-[60px]

          text-center

          md:mt-0
          md:px-8

          lg:min-h-screen
        "
      >
        {/* HEADER */}

        <div
          ref={labelRef}
          className="
            mb-[65px]

            flex
            items-center
            justify-center

            gap-5

            md:mb-[80px]
          "
        >
          <div
            className="
              h-px
              w-[55px]
              bg-[#8B6234]/60

              md:w-[85px]
            "
          />

          <span
            className="
              whitespace-nowrap

              text-[10px]
              font-semibold
              tracking-[0.25em]

              text-[#E1DCC9]/70

              md:text-[12px]
            "
          >
            MORE / SELECTED WORK
          </span>

          <div
            className="
              h-px
              w-[55px]
              bg-[#8B6234]/60

              md:w-[85px]
            "
          />
        </div>

        {/* COPY */}

        <div
          ref={copyRef}
          className="
            mx-auto
            w-full
            max-w-[1150px]

            text-center
          "
        >
          <p
            data-reveal-copy
            className="
              m-0

              text-[20px]
              font-normal
              leading-[1.65]
              tracking-[-0.025em]

              text-[#E1DCC9]/70

              sm:text-[22px]
              md:text-[25px]
              lg:text-[28px]
              xl:text-[30px]
            "
          >
            Beyond the featured work, I built{" "}
            <EditorialProjectLink project={otherProjects.flex} /> for smarter
            rental discovery.
          </p>

          <p
            data-reveal-copy
            className="
              m-0
              mt-[20px]

              text-[20px]
              font-normal
              leading-[1.65]
              tracking-[-0.025em]

              text-[#E1DCC9]/70

              sm:text-[22px]
              md:text-[25px]

              lg:whitespace-nowrap
              lg:text-[28px]

              xl:text-[30px]
            "
          >
            I explored a calmer visual direction with{" "}
            <EditorialProjectLink project={otherProjects.naturer} />.
          </p>

          <p
            data-reveal-copy
            className="
              m-0
              mt-[20px]

              text-[20px]
              font-normal
              leading-[1.65]
              tracking-[-0.025em]

              text-[#E1DCC9]/70

              sm:text-[22px]
              md:text-[25px]
              lg:text-[28px]
              xl:text-[30px]
            "
          >
            And turned a wedding invitation into an immersive experience with{" "}
            <EditorialProjectLink project={otherProjects.kalyan} />.
          </p>
        </div>

        {/* HINT */}

        <div
          ref={hintRef}
          className="
            mt-[65px]

            flex
            items-center
            justify-center

            gap-3

            text-[9px]
            font-medium
            tracking-[0.2em]

            text-[#E1DCC9]/45

            md:mt-[80px]
            md:text-[10px]
          "
        >
          <span
            className="
              h-[5px]
              w-[5px]

              rounded-full

              bg-[#B98245]
            "
          />
          HOVER PROJECT NAMES TO EXPLORE
        </div>
      </section>

      <AnimatePresence>
        {activeProject && (
          <OtherProjectPreview
            key={activeProject.url}
            project={activeProject}
            position={previewPosition}
            x={smoothPreviewX}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default OtherProjects;
