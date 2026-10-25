import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import profileImage from "../../assets/rohith-profile.PNG";
import { CometCard } from "../ui/CometCard";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Tailwind CSS",
  "Node.js",
  "Express.js",
  "MongoDB",
  "MySQL",
  "Git & GitHub",
];

const FRAME_COUNT = 95;
const mobileFramesQuery = "(max-width: 767px)";
const sequentialQuery = "(max-width: 767px)";
const simultaneousQuery = "(min-width: 768px)";

const frameUrl = (index, mobile) =>
  `/portrait-frames/${mobile ? "mobile" : "desktop"}/frame_${String(index).padStart(4, "0")}.webp`;

function AboutSkills() {
  const sectionRef = useRef(null);
  const wheelRef = useRef(null);
  const portraitRef = useRef(null);
  const canvasRef = useRef(null);
  const itemRefs = useRef([]);
  const drawRef = useRef(() => {});
  const targetFrameRef = useRef(0);
  const activeSkillRef = useRef(0);

  const [activeSkill, setActiveSkill] = useState(0);
  const [mobileFrames, setMobileFrames] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(mobileFramesQuery).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(mobileFramesQuery);
    const update = () => setMobileFrames(media.matches);

    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const frames = new Array(FRAME_COUNT);
    let cancelled = false;
    let resizeRaf = 0;

    canvas.classList.remove("opacity-100");

    const nearestLoadedFrame = (requested) => {
      if (frames[requested]?.naturalWidth) return frames[requested];

      for (let distance = 1; distance < FRAME_COUNT; distance += 1) {
        const before = frames[requested - distance];
        const after = frames[requested + distance];
        if (before?.naturalWidth) return before;
        if (after?.naturalWidth) return after;
      }

      return null;
    };

    const draw = (requested = targetFrameRef.current) => {
      if (cancelled) return;

      const image = nearestLoadedFrame(requested);
      const rect = canvas.getBoundingClientRect();
      if (!image || !rect.width || !rect.height) return;

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        mobileFrames ? 1.75 : 2,
      );
      const width = Math.round(rect.width * dpr);
      const height = Math.round(rect.height * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const context = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true,
      });
      if (!context) return;

      const scale = Math.max(
        canvas.width / image.naturalWidth,
        canvas.height / image.naturalHeight,
      );
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;

      context.fillStyle = "#f7f7f5";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(
        image,
        (canvas.width - drawWidth) / 2,
        (canvas.height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );

      canvas.classList.add("opacity-100");
    };

    drawRef.current = draw;

    [
      0,
      FRAME_COUNT - 1,
      ...Array.from({ length: FRAME_COUNT - 2 }, (_, index) => index + 1),
    ].forEach((index) => {
      const image = new Image();
      frames[index] = image;
      image.decoding = "async";
      image.onload = () => {
        if (
          !cancelled &&
          (index === 0 || Math.abs(index - targetFrameRef.current) <= 2)
        ) {
          draw(targetFrameRef.current);
        }
      };
      image.src = frameUrl(index, mobileFrames);
    });

    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => draw(targetFrameRef.current));
    });
    resizeObserver.observe(canvas);

    return () => {
      cancelled = true;
      cancelAnimationFrame(resizeRaf);
      resizeObserver.disconnect();
      frames.forEach((image) => {
        if (image) image.onload = null;
      });
      drawRef.current = () => {};
    };
  }, [mobileFrames]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const wheel = wheelRef.current;
    const portrait = portraitRef.current;
    if (!section || !wheel || !portrait) return undefined;

    const clamp = gsap.utils.clamp(0, 1);
    const media = gsap.matchMedia();
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let canvasRaf = 0;
    let refreshTimer = 0;

    const renderPortrait = (progress) => {
      targetFrameRef.current = Math.round(clamp(progress) * (FRAME_COUNT - 1));
      if (canvasRaf) return;

      canvasRaf = requestAnimationFrame(() => {
        canvasRaf = 0;
        drawRef.current(targetFrameRef.current);
      });
    };

    const renderSkills = (progress) => {
      const normalized = clamp(progress);
      const position = normalized * (skills.length - 1);
      const isMobile = window.innerWidth < 768;
      const spacing = window.innerHeight < 760 ? (isMobile ? 44 : 52) : (isMobile ? 48 : 64);

      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const offset = index - position;
        const distance = Math.min(Math.abs(offset), 4);

        // On mobile, keep items neatly indented without pushing them into negative X
        const xShift = isMobile
          ? Math.pow(distance, 1.2) * 5
          : Math.pow(distance, 1.45) * 14 * Math.sign(offset);

        gsap.set(item, {
          x: xShift,
          y: offset * spacing,
          scale: Math.max(0.74, 1 - distance * 0.075),
          opacity: Math.max(0.07, 1 - distance * 0.24),
          zIndex: 20 - Math.round(distance),
        });
      });

      const nextSkill = Math.min(
        skills.length - 1,
        Math.round(normalized * (skills.length - 1)),
      );
      if (nextSkill !== activeSkillRef.current) {
        activeSkillRef.current = nextSkill;
        setActiveSkill(nextSkill);
      }
    };

    const context = gsap.context(() => {
      renderPortrait(0);
      renderSkills(0);
      if (reducedMotion) return;

      media.add(
        { sequential: sequentialQuery, simultaneous: simultaneousQuery },
        ({ conditions }) => {
          const sequential = Boolean(conditions.sequential);
          const portraitEnd = 0.45;
          const transitionEnd = 0.55;

          gsap.set([portrait, wheel], {
            clearProps: "transform,opacity,visibility",
          });

          if (sequential) {
            gsap.set(portrait, {
              xPercent: -50,
              yPercent: -50,
              autoAlpha: 1,
            });
            gsap.set(wheel, {
              xPercent: -50,
              yPercent: -50,
              autoAlpha: 0,
            });
          } else {
            gsap.set(portrait, {
              clearProps: "transform",
              autoAlpha: 1,
            });
            gsap.set(wheel, {
              clearProps: "transform",
              autoAlpha: 1,
            });
          }

          // Trigger starts only after Hero preloader & split curtains have completed + 1 scroll buffer
          const trigger = ScrollTrigger.create({
            trigger: section,
            start: () => `+=${window.innerHeight * 3.2} top`,
            end: "bottom bottom",
            scrub: sequential ? 0.42 : 0.6,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              if (!sequential) {
                renderPortrait(progress);
                renderSkills(progress);
                return;
              }

              const portraitProgress = clamp(progress / portraitEnd);
              const transitionProgress = clamp(
                (progress - portraitEnd) / (transitionEnd - portraitEnd),
              );
              const skillsProgress = clamp(
                (progress - transitionEnd) / (1 - transitionEnd),
              );

              renderPortrait(portraitProgress);
              renderSkills(skillsProgress);
              gsap.set(portrait, {
                xPercent: -50 - transitionProgress * 8,
                yPercent: -50,
                autoAlpha: 1 - transitionProgress,
              });
              gsap.set(wheel, {
                xPercent: -50,
                yPercent: -50,
                autoAlpha: transitionProgress,
              });
            },
          });

          return () => trigger.kill();
        },
      );

      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    }, section);

    return () => {
      clearTimeout(refreshTimer);
      cancelAnimationFrame(canvasRaf);
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-20 h-[600svh] text-[#e1dcc9]"
    >
      <div className="sticky top-0 isolate h-[100svh] w-full overflow-hidden">
        <header className="absolute left-1/2 top-[4.5svh] z-10 w-[min(92vw,650px)] -translate-x-1/2 text-center max-md:top-[72px] max-md:w-[90vw]">
          <span className="text-[11px] font-semibold tracking-[0.35em] text-[#8d877d]">
            ABOUT / SKILLS
          </span>
          <h2 className="mt-3 text-[clamp(32px,3.5vw,62px)] font-semibold leading-[0.94] tracking-[-0.055em] max-md:text-[28px] max-md:leading-tight">
            Building with
            <br />
            <strong className="font-semibold text-[#9a6a35]">
              clarity &amp; intent.
            </strong>
          </h2>
          <p className="mx-auto mt-4 max-w-[610px] text-[clamp(13px,1.1vw,18px)] leading-relaxed text-[#9d978d] max-md:hidden">
            I enjoy creating complete web experiences — from the structure
            behind the scenes to the interface people actually interact with.
          </p>
        </header>

        <div
          ref={wheelRef}
          id="skills"
          className="absolute left-1/2 top-[55%] h-[52vh] w-[min(90vw,360px)] md:left-[clamp(24px,4vw,60px)] md:top-[26svh] md:h-[min(56vh,500px)] md:w-[clamp(320px,38vw,560px)]"
        >
          <div className="absolute left-0 top-0 flex flex-col items-start text-[11px] font-semibold tracking-[0.25em] text-[#8d877d]">
            <span className="whitespace-nowrap">SELECTED TOOLKIT</span>
            <strong className="mt-2 font-semibold tracking-normal text-[#b0a99d]">
              {String(activeSkill + 1).padStart(2, "0")}/
              {String(skills.length).padStart(2, "0")}
            </strong>
          </div>

          <div className="absolute inset-x-0 bottom-4 top-16 overflow-hidden">
            {skills.map((skill, index) => (
              <div
                key={skill}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className="absolute left-[20px] top-1/2 flex w-[calc(100%-24px)] origin-left items-baseline gap-4 will-change-transform"
              >
                <span
                  className={`min-w-6 text-[10px] ${
                    index === activeSkill
                      ? "text-[#a97942]"
                      : "text-[#e1dcc938]"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong
                  className={`whitespace-nowrap text-[clamp(28px,3vw,50px)] font-medium leading-none tracking-[-0.055em] max-md:text-[clamp(24px,7vw,34px)] ${
                    index === activeSkill
                      ? "text-[#e1dcc9] drop-shadow-[0_0_18px_rgba(154,106,53,0.2)]"
                      : "text-[#e1dcc947]"
                  }`}
                >
                  {skill}
                </strong>
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 left-0 top-16 w-px overflow-hidden bg-[#e1dcc91a]">
            <span
              className="block w-full bg-[#9a6a35] transition-[height] duration-200"
              style={{
                height: `${((activeSkill + 1) / skills.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div
          ref={portraitRef}
          className="absolute left-1/2 top-[55%] z-20 w-[min(74vw,310px)] md:left-auto md:right-[clamp(24px,4vw,60px)] md:top-[26svh] md:w-[clamp(240px,22vw,315px)]"
        >
          <CometCard rotateDepth={6} translateDepth={5}>
            <div className="relative aspect-[1080/1392] w-full overflow-hidden rounded-[3px_38px_3px_38px] border border-[#e1dcc91c] bg-[#f7f7f5] shadow-[0_24px_70px_rgba(0,0,0,0.34)] max-md:rounded-[3px_28px_3px_28px]">
              <span className="absolute left-5 top-5 z-30 text-[11px] tracking-[0.2em] text-[#9a6a354d]">
                01
              </span>

              <img
                src={profileImage}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <canvas
                ref={canvasRef}
                role="img"
                aria-label="Rohith Naidu portrait rotating from side profile to front view"
                className="absolute inset-0 z-10 h-full w-full opacity-0 transition-opacity duration-200"
              />

              <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(to_top,rgba(0,0,0,0.66)_0%,rgba(0,0,0,0.08)_37%,transparent_66%)]" />
              <div className="absolute bottom-7 left-7 z-30 right-6">
                <strong className="block text-[clamp(25px,2vw,34px)] font-semibold tracking-[-0.045em] text-[#e1dcc9]">
                  Rohith Naidu
                </strong>
              </div>
            </div>
          </CometCard>

          <div className="mt-3 grid grid-cols-2 gap-3 max-[380px]:gap-2">
            <div className="min-w-0 rounded-[3px_14px_3px_14px] border border-[#9a6a3538] bg-[#1c120bed] px-4 py-3 shadow-[inset_0_0_20px_rgba(154,106,53,0.06)] max-md:px-3">
              <span className="block text-[9px] font-semibold tracking-[0.2em] text-[#8d877d]">
                ROLE
              </span>
              <strong className="mt-1 block text-[clamp(10px,0.7vw,12px)] font-medium leading-snug text-[#ddd6c6]">
                MERN Stack Developer
              </strong>
            </div>

            <div className="min-w-0 rounded-[3px_14px_3px_14px] border border-[#9a6a3538] bg-[#1c120bed] px-4 py-3 shadow-[inset_0_0_20px_rgba(154,106,53,0.06)] max-md:px-3">
              <span className="block text-[9px] font-semibold tracking-[0.2em] text-[#8d877d]">
                APPROACH
              </span>
              <strong className="mt-1 block text-[clamp(10px,0.7vw,12px)] font-medium leading-snug text-[#ddd6c6]">
                Design → Build → Refine
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSkills;
