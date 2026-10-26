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
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    let updateBoxSizes = () => {};
    let allBoxes = [];

    const ctx = gsap.context(() => {
      // Create color boxes covering each word
      const createBoxes = (container, defaultColor) => {
        const words = container.querySelectorAll(".fall-word-wrapper");
        return Array.from(words).map((word) => {
          const rect = word.getBoundingClientRect();
          const color = word.getAttribute("data-box-color") || defaultColor;
          const box = document.createElement("div");
          box.className = "fall-color-box";
          box.style.position = "absolute";
          box.style.top = "0";
          box.style.left = "50%";
          box.style.transform = "translateX(-50%)";
          box.style.zIndex = "10";
          box.style.width = `${rect.width * 1.08}px`;
          box.style.height = `${rect.height * 0.96}px`;
          box.style.backgroundColor = color;
          box.style.borderRadius = "4px";
          box.style.pointerEvents = "none";
          box.style.willChange = "transform, opacity";
          box.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.4)";
          word.appendChild(box);
          return box;
        });
      };

      allBoxes = createBoxes(titleEl, "#E1DCC9");

      updateBoxSizes = () => {
        const words = titleEl.querySelectorAll(".fall-word-wrapper");
        words.forEach((word, i) => {
          if (allBoxes[i]) {
            const r = word.getBoundingClientRect();
            allBoxes[i].style.width = `${r.width * 1.08}px`;
            allBoxes[i].style.height = `${r.height * 0.96}px`;
          }
        });
      };
      window.addEventListener("resize", updateBoxSizes);

      // Initial state: tiles fully visible covering words
      gsap.set(allBoxes, {
        opacity: 1,
        visibility: "visible",
        display: "block",
        x: 0,
        y: 0,
        rotation: 0,
      });

      // Falling timeline on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: titleEl,
          start: "top 80%",
          end: "top 35%",
          scrub: 0.6,
          fastScrollEnd: true,
          preventOverlaps: true,
          invalidateOnRefresh: true,
        },
      });

      // Tiles drop down with physics and fade to 0
      tl.to(allBoxes, {
        y: () => window.innerHeight * 1.4,
        x: () => gsap.utils.random(-150, 150),
        rotation: () => gsap.utils.random(-360, 360),
        opacity: 0,
        ease: "power2.in",
        stagger: {
          amount: 0.4,
          from: "random",
        },
        duration: 0.8,
      });
    }, titleEl);

    return () => {
      window.removeEventListener("resize", updateBoxSizes);
      ctx.revert();
      allBoxes.forEach((b) => b.remove());
    };
  }, []);

  return (
    <section id="experience" className="experience-section">
      <div className="experience-header">
        <span>EXPERIENCE</span>

        <h2 ref={titleRef} className="select-none">
          {[
            { text: "Different", brAfter: false, color: "#E1DCC9" },
            { text: "paths,", brAfter: true, color: "#E1DCC9" },
            { text: "one", brAfter: false, color: "#9a6a35" },
            { text: "direction.", brAfter: false, color: "#9a6a35" },
          ].map((item, idx) => (
            <React.Fragment key={idx}>
              <span
                data-box-color={item.color}
                style={{ color: item.color }}
                className="fall-word-wrapper inline-block relative mx-[0.14em]"
              >
                {item.text}
              </span>
              {item.brAfter && <br />}
            </React.Fragment>
          ))}
        </h2>

        <p>
          A journey through engineering, technology, operations and software
          development — each stage shaping how I approach problem solving today.
        </p>
      </div>

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
