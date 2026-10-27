import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BorderGlow from "../BorderGlow/BorderGlow";
import "./Experience.css";

gsap.registerPlugin(ScrollTrigger);

const experience = [
  {
    period: "2026 — Present",
    role: "MERN Stack Developer",
    company: "",
    description:
      "Building responsive frontend experiences and full-stack applications using React, JavaScript, Node.js, Express and MongoDB.",
    type: "CURRENT",
  },
  {
    period: "2024 — 2026",
    role: "Rail Replacement Coordinator",
    company: "Transport Operations — UK",
    description:
      "Coordinated replacement transport operations, drivers, passenger movement and service communication during planned rail disruptions.",
    type: "EXPERIENCE",
  },
  {
    period: "2023 — 2024",
    role: "MSc Information Systems",
    company: "University of Portsmouth",
    description:
      "Studied web development, UX design, algorithms, networking and information systems while developing practical software and infrastructure projects.",
    type: "EDUCATION",
  },
  {
    period: "2021 — 2022",
    role: "Process Executive",
    company: "Cognizant",
    description:
      "Worked within structured operational processes while developing professional communication, problem solving and team collaboration skills.",
    type: "EXPERIENCE",
  },
  {
    period: "2015 — 2021",
    role: "Civil & Structural Engineering",
    company: "REVA University",
    description:
      "Completed BTech Civil Engineering followed by postgraduate study in Structural Engineering, building a strong analytical and engineering foundation.",
    type: "EDUCATION",
  },
];

function Experience() {
  const sectionRef = useRef(null);
  const pinContainerRef = useRef(null);
  const headerContentRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);

  useLayoutEffect(() => {
    const pinContainer = pinContainerRef.current;
    const headerContent = headerContentRef.current;
    const titleEl = titleRef.current;
    if (!pinContainer || !headerContent || !titleEl) return;

    let allBoxes = [];

    const ctx = gsap.context(() => {
      // Create color boxes covering each word with full overlap
      const createBoxes = (container, defaultColor) => {
        const words = container.querySelectorAll(".fall-word-wrapper");
        return Array.from(words).map((word) => {
          const color = word.getAttribute("data-box-color") || defaultColor;
          const box = document.createElement("div");
          box.className = "fall-color-box";
          box.style.position = "absolute";
          box.style.top = "15%";
          box.style.bottom = "-1%";
          box.style.left = "0";
          box.style.right = "0";
          box.style.zIndex = "10";
          box.style.backgroundColor = color;
          box.style.borderRadius = "5px";
          box.style.pointerEvents = "none";
          box.style.willChange = "transform, opacity";
          box.style.boxShadow = "0 3px 12px rgba(0, 0, 0, 0.28)";
          word.appendChild(box);
          return box;
        });
      };

      allBoxes = createBoxes(titleEl, "#E1DCC9");

      const getOffscreenTop = () => -(window.innerHeight + 250);

      // Initial state:
      // Header is centered, tiles are fully visible covering words
      gsap.set(headerContent, { y: 0, opacity: 1, pointerEvents: "auto" });
      gsap.set(allBoxes, {
        opacity: 1,
        visibility: "visible",
        display: "block",
        x: 0,
        y: 0,
        rotation: 0,
      });

      // Master Unified Timeline (pinned in viewport center)
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinContainer,
          start: "top top",
          end: "+=2000",
          pin: pinContainer,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
          invalidateOnRefresh: true,
        },
      });

      // 1. Tiles drop down with physics and fade to 0
      masterTl.to(allBoxes, {
        y: () => window.innerHeight * 1.6,
        x: () => gsap.utils.random(-150, 150),
        rotation: () => gsap.utils.random(-360, 360),
        opacity: 0,
        ease: "power2.in",
        stagger: {
          amount: 0.45,
          from: "random",
        },
        duration: 0.85,
      });

      // 2. Short hold so revealed text can be read in the center
      masterTl.to({}, { duration: 0.35 });

      // 3. Header text ascends cleanly into the top viewport
      masterTl.to(headerContent, {
        y: getOffscreenTop,
        opacity: 0,
        ease: "power2.inOut",
        duration: 0.7,
      });
    }, pinContainer);

    return () => {
      ctx.revert();
      const existingBoxes = pinContainer.querySelectorAll(".fall-color-box");
      existingBoxes.forEach((b) => b.remove());
    };
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="experience-section relative z-[2] w-full"
    >
      {/* Pinned Experience Intro Header (Centered in Viewport) */}
      <div
        ref={pinContainerRef}
        className="relative h-screen w-full overflow-hidden flex items-center justify-center pointer-events-auto"
      >
        <div
          ref={headerContentRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 max-w-[840px] mx-auto will-change-transform z-10"
        >
          <span className="text-[11px] font-semibold tracking-[0.28em] text-[#E1DCC9]/60 md:text-[12.5px] uppercase mb-4">
            EXPERIENCE
          </span>

          <h2
            ref={titleRef}
            className="text-[clamp(36px,5.2vw,68px)] font-semibold leading-[1.2] tracking-[-0.04em] mb-6 select-none"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-[0.32em] mb-[0.22em]">
              {[
                { text: "Different", color: "#E1DCC9" },
                { text: "paths,", color: "#E1DCC9" },
              ].map((item, idx) => (
                <span
                  key={idx}
                  data-box-color={item.color}
                  style={{ color: item.color }}
                  className="fall-word-wrapper inline-block relative px-[0.05em]"
                >
                  {item.text}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-[0.32em]">
              {[
                { text: "one", color: "#9a6a35" },
                { text: "direction.", color: "#9a6a35" },
              ].map((item, idx) => (
                <span
                  key={idx}
                  data-box-color={item.color}
                  style={{ color: item.color }}
                  className="fall-word-wrapper inline-block relative px-[0.05em]"
                >
                  {item.text}
                </span>
              ))}
            </div>
          </h2>

          <p
            ref={descRef}
            className="mx-auto max-w-[600px] text-[clamp(14px,1.15vw,18px)] font-normal leading-relaxed text-[#E1DCC9]/65 select-none"
          >
            A journey through engineering, technology, operations and software
            development — each stage shaping how I approach problem solving today.
          </p>
        </div>
      </div>

      {/* Main Experience Layout (Timeline & Cards) */}
      <div className="experience-layout">
        <div className="experience-side">
          <div className="experience-side-line" />

          <span>TIMELINE</span>

          <strong>
            2015
            <br />
            —
            <br />
            2026
          </strong>
        </div>

        <div className="experience-list">
          {experience.map((item, index) => (
            <BorderGlow
              key={`${item.role}-${item.period}`}
              className="experience-glow"
              borderRadius={22}
            >
              <article className="experience-item">
                <div className="experience-index">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="experience-period">{item.period}</div>

                <div className="experience-main">
                  <div className="experience-type">{item.type}</div>

                  <h3>{item.role}</h3>

                  {item.company ? <h4>{item.company}</h4> : null}

                  <p>{item.description}</p>
                </div>

                <div className="experience-dot">
                  <span />
                </div>
              </article>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;
