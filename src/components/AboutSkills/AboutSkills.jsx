import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";

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
  const messageBoxRef = useRef(null);
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
    const messageBox = messageBoxRef.current;
    if (!section || !wheel || !portrait || !messageBox) return undefined;

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

          gsap.set([portrait, wheel, messageBox], {
            clearProps: "transform,opacity,visibility",
          });

          if (sequential) {
            gsap.set(portrait, {
              xPercent: -50,
              yPercent: -50,
              autoAlpha: 1,
            });
            gsap.set(messageBox, {
              xPercent: -50,
              yPercent: -50,
              autoAlpha: 0,
            });
            gsap.set(wheel, {
              xPercent: -50,
              yPercent: -50,
              autoAlpha: 0,
            });
          } else {
            // Desktop & iPad: flexbox handles exact centering of all 3 columns
            gsap.set([portrait, wheel, messageBox], {
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

              // Mobile 3-Stage Storytelling Sequence:
              // Stage 1: Rotating Portrait (0.00 -> 0.32)
              // Trans 1: Portrait -> Message Box (0.32 -> 0.40)
              // Stage 2: Message Box with philosophy (0.40 -> 0.65)
              // Trans 2: Message Box -> Selected Toolkit (0.65 -> 0.72)
              // Stage 3: Skills Wheel Scroll (0.72 -> 1.00)

              const p1End = 0.32;
              const t1End = 0.40;
              const p2End = 0.65;
              const t2End = 0.72;

              const portraitProgress = clamp(progress / p1End);
              renderPortrait(portraitProgress);

              if (progress < t1End) {
                const trans1 = clamp((progress - p1End) / (t1End - p1End));
                gsap.set(portrait, {
                  autoAlpha: 1 - trans1,
                  xPercent: -50,
                  yPercent: -50,
                });
                gsap.set(messageBox, {
                  autoAlpha: trans1,
                  xPercent: -50,
                  yPercent: -50,
                });
                gsap.set(wheel, { autoAlpha: 0 });
              } else if (progress < t2End) {
                const trans2 = clamp((progress - p2End) / (t2End - p2End));
                gsap.set(portrait, { autoAlpha: 0 });
                gsap.set(messageBox, {
                  autoAlpha: 1 - trans2,
                  xPercent: -50,
                  yPercent: -50,
                });
                gsap.set(wheel, {
                  autoAlpha: trans2,
                  xPercent: -50,
                  yPercent: -50,
                });
                renderSkills(0);
              } else {
                const skillsProgress = clamp((progress - t2End) / (1 - t2End));
                gsap.set(portrait, { autoAlpha: 0 });
                gsap.set(messageBox, { autoAlpha: 0 });
                gsap.set(wheel, {
                  autoAlpha: 1,
                  xPercent: -50,
                  yPercent: -50,
                });
                renderSkills(skillsProgress);
              }
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
        {/* Compact Centered Header */}
        <header className="absolute left-1/2 top-[3.5svh] z-10 w-[min(92vw,650px)] -translate-x-1/2 text-center max-md:top-[56px] max-md:w-[90vw]">
          <span className="text-[11px] font-semibold tracking-[0.35em] text-[#8d877d]">
            ABOUT / SKILLS
          </span>
          <h2 className="mt-2 text-[clamp(26px,2.8vw,50px)] font-semibold leading-[0.96] tracking-[-0.055em] max-md:text-[22px] max-md:leading-tight">
            Building with
            <br />
            <strong className="font-semibold text-[#9a6a35]">
              clarity &amp; intent.
            </strong>
          </h2>
        </header>

        {/* Responsive Stage for Desktop & iPad (Centered 3-Column Composition) */}
        <div className="absolute inset-x-0 bottom-0 top-[12svh] flex items-center justify-center pointer-events-none max-md:block">
          <div className="w-full max-w-[1520px] h-full flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-md:contents">

            {/* 1. LEFT COLUMN: Selected Toolkit (Centered in Left Side) */}
            <div className="flex-1 flex justify-center items-center pointer-events-auto max-md:contents">
              <div
                ref={wheelRef}
                id="skills"
                className="relative h-[min(56vh,480px)] w-full max-w-[320px] lg:max-w-[360px] max-md:absolute max-md:left-1/2 max-md:top-[56%] max-md:h-[52vh] max-md:w-[min(90vw,340px)]"
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
                        className={`whitespace-nowrap text-[clamp(24px,2.4vw,44px)] font-medium leading-none tracking-[-0.055em] max-md:text-[clamp(22px,6.8vw,32px)] ${
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
            </div>

            {/* 2. CENTER COLUMN: Photo Card (Centered & Bigger) */}
            <div className="shrink-0 flex justify-center items-center pointer-events-auto px-2 lg:px-8 max-md:contents">
              <div
                ref={portraitRef}
                className="relative w-[clamp(250px,21vw,330px)] max-md:absolute max-md:left-1/2 max-md:top-[56%] max-md:w-[min(72vw,255px)]"
              >
                <CometCard rotateDepth={6} translateDepth={5}>
                  <div className="relative aspect-[1080/1392] w-full overflow-hidden rounded-[3px_38px_3px_38px] border border-[#e1dcc91c] bg-[#f7f7f5] shadow-[0_24px_70px_rgba(0,0,0,0.34)] max-md:rounded-[3px_24px_3px_24px]">
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
                    <div className="absolute bottom-5 left-5 right-5 z-30 md:bottom-7 md:left-7 md:right-7">
                      <strong className="block text-[clamp(22px,1.9vw,32px)] font-semibold tracking-[-0.045em] text-[#e1dcc9]">
                        Rohith Naidu
                      </strong>
                    </div>
                  </div>
                </CometCard>

                {/* Centered ROLE Badge below photo (APPROACH removed) */}
                <div className="mt-3 flex justify-center">
                  <div className="inline-flex flex-col items-center justify-center rounded-[3px_14px_3px_14px] border border-[#9a6a3538] bg-[#1c120bed] px-5 py-2.5 shadow-[inset_0_0_20px_rgba(154,106,53,0.06)] backdrop-blur-sm">
                    <span className="block text-[9px] font-semibold tracking-[0.22em] text-[#8d877d]">
                      ROLE
                    </span>
                    <strong className="mt-0.5 block text-[clamp(11px,0.8vw,13px)] font-medium leading-snug text-[#ddd6c6]">
                      MERN Stack Developer
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. RIGHT COLUMN: Message Box (Centered in the Right Side) */}
            <div className="flex-1 flex justify-center items-center pointer-events-auto max-md:contents">
              <div
                ref={messageBoxRef}
                className="relative w-full max-w-[320px] lg:max-w-[370px] max-md:absolute max-md:left-1/2 max-md:top-[56%] max-md:w-[min(88vw,330px)]"
              >
                <div className="relative rounded-[3px_26px_3px_26px] border border-[#9a6a3538] bg-[#17110df0] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_0_30px_rgba(154,106,53,0.06)] backdrop-blur-md max-md:p-5">
                  {/* Top Row: Icon Badge & Label */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#9a6a354d] bg-[#2a1a10] text-[#c99a5e] shadow-[0_0_15px_rgba(154,106,53,0.22)]">
                      <Quote className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[9.5px] font-semibold tracking-[0.28em] text-[#8d877d]">
                        PHILOSOPHY
                      </span>
                      <span className="block truncate text-[11px] font-medium text-[#c99a5e]">
                        Full-Stack Craft
                      </span>
                    </div>
                  </div>

                  {/* Decorative Gold Accent Divider */}
                  <div className="my-4 h-px w-full bg-gradient-to-r from-[#9a6a354d] via-[#9a6a351a] to-transparent" />

                  {/* Message Body */}
                  <p className="text-[clamp(13px,1.02vw,15.5px)] font-light leading-relaxed tracking-wide text-[#ddd6c6]">
                    “I enjoy creating complete web experiences — from the structure behind the scenes to the interface people actually interact with.”
                  </p>

                  {/* Bottom Metadata */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#e1dcc90f] pt-3 text-[10.5px] text-[#8d877d]">
                    <span className="font-mono text-[9.5px] tracking-wider text-[#9a6a35]">
                      01 // INTENT
                    </span>
                    <span className="tracking-wide text-[#b0a99d]">
                      Rohith Naidu
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSkills;
