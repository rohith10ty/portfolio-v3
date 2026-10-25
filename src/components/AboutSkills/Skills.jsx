import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./Skills.css";

gsap.registerPlugin(ScrollTrigger);

const capabilityCards = [
  {
    id: "card-1",
    number: "01",
    title: "Plan",
    items: [
      "Discovery",
      "Audit",
      "User Flow",
      "Site Map",
      "Personas",
      "Strategy",
    ],
  },
  {
    id: "card-2",
    number: "02",
    title: "Design",
    items: [
      "Wireframes",
      "UI Kits",
      "Prototypes",
      "Visual Style",
      "Interaction",
      "Design QA",
    ],
  },
  {
    id: "card-3",
    number: "03",
    title: "Develop",
    items: [
      "HTML/CSS/JS",
      "CMS Build",
      "GSAP Motion",
      "Responsive",
      "Optimization",
      "Launch",
    ],
  },
];

const smoothStep = (p) => p * p * (3 - 2 * p);

function Skills() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const mobileTopCardsContainerRef = useRef(null);
  const cardsContainerRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const mobileTopContainer = mobileTopCardsContainerRef.current;
    const cardsContainer = cardsContainerRef.current;

    if (!section || !stage || !cardsContainer) return undefined;

    const cards = gsap.utils.toArray(
      section.querySelectorAll(".skills-cards-container .skill-card"),
    );
    const mobileTopCards = mobileTopContainer
      ? gsap.utils.toArray(mobileTopContainer.querySelectorAll(".mobile-top-card"))
      : [];

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();

      // ==========================================
      // DESKTOP & TABLET / LAPTOP (> 768px) - CLASSIC 3D ENTRANCE & FLIP
      // ==========================================
      media.add("(min-width: 769px)", () => {
        if (reducedMotion) {
          gsap.set(cards, { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 });
          cards.forEach((card) => {
            const inner = card.querySelector(".flip-card-inner");
            if (inner) gsap.set(inner, { rotationY: 180 });
          });
          return undefined;
        }

        // Z-Index: Card 1 front (3), Card 2 middle (2), Card 3 back (1)
        gsap.set(cards[0], { zIndex: 3 });
        gsap.set(cards[1], { zIndex: 2 });
        gsap.set(cards[2], { zIndex: 1 });

        // Initial entry from top
        gsap.set(cards, {
          opacity: 0,
          scale: 0.25,
          y: "-120%",
          rotate: (i) => (i === 0 ? -5 : i === 1 ? 0 : 5),
          x: (i) => (i === 0 ? "100%" : i === 1 ? "0%" : "-100%"),
        });

        cards.forEach((card) => {
          const inner = card.querySelector(".flip-card-inner");
          if (inner) gsap.set(inner, { rotationY: 0 });
        });

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=380%",
          pin: section,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 6,
          onUpdate: (self) => {
            const progress = self.progress;

            // Animate cards to full flip within 0..0.68 of scroll, and HOLD them completely for 0.68..1.0
            const animProgress = gsap.utils.clamp(0, 1, progress / 0.68);

            cards.forEach((cardEl, index) => {
              const delay = index * 0.45;
              const cardProgress = gsap.utils.clamp(
                0,
                1,
                (animProgress - delay * 0.1) / (0.9 - delay * 0.1),
              );

              const innerCard = cardEl.querySelector(".flip-card-inner");

              let y;
              if (cardProgress < 0.4) {
                const norm = cardProgress / 0.4;
                y = gsap.utils.interpolate("-120%", "40%", smoothStep(norm));
              } else if (cardProgress < 0.6) {
                const norm = (cardProgress - 0.4) / 0.2;
                y = gsap.utils.interpolate("40%", "0%", smoothStep(norm));
              } else {
                y = "0%";
              }

              let scale;
              if (cardProgress < 0.4) {
                const norm = cardProgress / 0.4;
                scale = gsap.utils.interpolate(0.25, 0.75, smoothStep(norm));
              } else if (cardProgress < 0.6) {
                const norm = (cardProgress - 0.4) / 0.2;
                scale = gsap.utils.interpolate(0.75, 1, smoothStep(norm));
              } else {
                scale = 1;
              }

              let opacity;
              if (cardProgress < 0.2) {
                const norm = cardProgress / 0.2;
                opacity = smoothStep(norm);
              } else {
                opacity = 1;
              }

              let x;
              let rotate;
              let rotationY;

              if (cardProgress < 0.6) {
                x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
                rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
                rotationY = 0;
              } else if (cardProgress < 1) {
                const norm = (cardProgress - 0.6) / 0.4;
                x = gsap.utils.interpolate(
                  index === 0 ? "100%" : index === 1 ? "0%" : "-100%",
                  "0%",
                  smoothStep(norm),
                );
                rotate = gsap.utils.interpolate(
                  index === 0 ? -5 : index === 1 ? 0 : 5,
                  0,
                  smoothStep(norm),
                );
                rotationY = smoothStep(norm) * 180;
              } else {
                x = "0%";
                rotate = 0;
                rotationY = 180;
              }

              gsap.set(cardEl, {
                opacity,
                y,
                x,
                rotate,
                scale,
              });

              if (innerCard) {
                gsap.set(innerCard, {
                  rotationY,
                });
              }
            });
          },
        });

        return () => trigger.kill();
      });

      // ==========================================
      // MOBILE (<= 768px): 3 TOP CARDS TRAVEL BEHIND DECK -> DECK ROTATES & SHOWS DETAILS
      // ==========================================
      media.add("(max-width: 768px)", () => {
        if (reducedMotion) {
          if (mobileTopContainer) gsap.set(mobileTopContainer, { display: "none" });
          gsap.set(cards, { opacity: 1, scale: 1, x: 0, y: 0 });
          return undefined;
        }

        // Initial setup for top 3 horizontal cards
        if (mobileTopCards.length > 0) {
          gsap.set(mobileTopCards, { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 });
        }

        // Initial setup for main deck of cards (starts at y: 220% well below screen with NO peeking)
        gsap.set(cards[0], { opacity: 1, scale: 0.95, y: "220%", rotate: -4, x: 0, zIndex: 10 });
        gsap.set(cards[1], { opacity: 1, scale: 0.92, y: "220%", rotate: 0, x: 0, zIndex: 5 });
        gsap.set(cards[2], { opacity: 1, scale: 0.88, y: "220%", rotate: 4, x: 0, zIndex: 3 });

        cards.forEach((card) => {
          const inner = card.querySelector(".flip-card-inner");
          if (inner) gsap.set(inner, { rotationY: 0 });
        });

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=380%",
          pin: section,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 6,
          onUpdate: (self) => {
            const p = self.progress;

            // 1. Top 3 horizontal cards:
            // Stage 1: the horizontal cards close into a compact fan.
            // Stage 2: hold the gathered fan so it reads clearly.
            // Stage 3: use the same down/up overshoot used by the larger cards.
            // Stage 4: tighten into a single compact stack.
            // Stage 5: keep the stack visible while the main deck rises over it.
            if (mobileTopCards.length > 0) {
              if (p < 0.11) {
                const norm = p / 0.11;
                mobileTopCards.forEach((miniCard, i) => {
                  const targetX = i === 0 ? "92%" : i === 2 ? "-92%" : "0%";
                  const targetY = i === 0 ? "16px" : i === 2 ? "-16px" : "0px";
                  const targetRotate = i === 0 ? -4 : i === 2 ? 4 : 0;
                  const x = gsap.utils.interpolate("0%", targetX, smoothStep(norm));
                  const y = gsap.utils.interpolate("0px", targetY, smoothStep(norm));
                  const rotate = gsap.utils.interpolate(0, targetRotate, smoothStep(norm));
                  const scale = gsap.utils.interpolate(1, 0.95, smoothStep(norm));
                  const zIndex = i === 0 ? 3 : i === 1 ? 2 : 1;
                  gsap.set(miniCard, { y, x, rotate, scale, opacity: 1, zIndex });
                });
              } else if (p < 0.18) {
                mobileTopCards.forEach((miniCard, i) => {
                  const x = i === 0 ? "92%" : i === 2 ? "-92%" : "0%";
                  const y = i === 0 ? "16px" : i === 2 ? "-16px" : "0px";
                  const rotate = i === 0 ? -4 : i === 2 ? 4 : 0;
                  const zIndex = i === 0 ? 3 : i === 1 ? 2 : 1;
                  gsap.set(miniCard, { y, x, rotate, scale: 0.95, opacity: 1, zIndex });
                });
              } else if (p < 0.33) {
                mobileTopCards.forEach((miniCard, i) => {
                  const staggerDelay = i * 0.018;
                  const bounceP = gsap.utils.clamp(
                    0,
                    1,
                    (p - 0.18 - staggerDelay) / (0.13 - staggerDelay),
                  );

                  const baseX = i === 0 ? "92%" : i === 2 ? "-92%" : "0%";
                  const startY = i === 0 ? 16 : i === 2 ? -16 : 0;
                  // After bounce: cards settle level at y=0 in clean fan (-4deg, 0deg, +4deg)
                  const endY = 0;
                  const rotate = i === 0 ? -4 : i === 2 ? 4 : 0;

                  let bounceY;
                  let scaleVal;

                  if (bounceP < 0.42) {
                    const norm = bounceP / 0.42;
                    bounceY = startY + gsap.utils.interpolate(0, 48, smoothStep(norm));
                    scaleVal = gsap.utils.interpolate(0.95, 0.88, smoothStep(norm));
                  } else if (bounceP < 0.82) {
                    const norm = (bounceP - 0.42) / 0.4;
                    bounceY = gsap.utils.interpolate(startY + 48, endY - 10, smoothStep(norm));
                    scaleVal = gsap.utils.interpolate(0.88, 1.02, smoothStep(norm));
                  } else {
                    const norm = (bounceP - 0.82) / 0.18;
                    bounceY = gsap.utils.interpolate(endY - 10, endY, smoothStep(norm));
                    scaleVal = gsap.utils.interpolate(1.02, 0.95, smoothStep(norm));
                  }

                  const zIndex = i === 0 ? 3 : i === 1 ? 2 : 1;
                  gsap.set(miniCard, {
                    y: `${bounceY}px`,
                    x: baseX,
                    rotate,
                    scale: scaleVal,
                    opacity: 1,
                    zIndex,
                  });
                });
              } else if (p < 0.38) {
                const norm = (p - 0.33) / 0.05;
                mobileTopCards.forEach((miniCard, i) => {
                  const x = i === 0 ? "92%" : i === 2 ? "-92%" : "0%";
                  const rotate = i === 0 ? -4 : i === 2 ? 4 : 0;
                  const scale = gsap.utils.interpolate(0.95, 0.36, smoothStep(norm));
                  const zIndex = i === 0 ? 3 : i === 1 ? 2 : 1;
                  gsap.set(miniCard, { y: "0px", x, rotate, scale, opacity: 1, zIndex });
                });
              } else if (p < 0.46) {
                const norm = (p - 0.38) / 0.08;
                mobileTopCards.forEach((miniCard, i) => {
                  const x = i === 0 ? "92%" : i === 2 ? "-92%" : "0%";
                  const y = gsap.utils.interpolate("0px", "40px", smoothStep(norm));
                  const rotate = i === 0 ? -4 : i === 2 ? 4 : 0;
                  const scale = gsap.utils.interpolate(0.36, 0.12, smoothStep(norm));
                  const zIndex = i === 0 ? 3 : i === 1 ? 2 : 1;
                  gsap.set(miniCard, { y, x, rotate, scale, opacity: 1, zIndex });
                });
              } else {
                gsap.set(mobileTopCards, { opacity: 0 });
              }
            }

            // 2. Main Deck of Cards - Rises from bottom (y: 220% -> 0%), holds for 1 scroll, then rotates sequentially
            cards.forEach((cardEl, idx) => {
              const innerCard = cardEl.querySelector(".flip-card-inner");

              let opacity = 1;
              let scale = 1;
              let y = "0%";
              let x = 0;
              let rotate = 0;
              let rotationY = 0;
              let zIndex = 1;

              // Step A (0.0 -> 0.36): Deck is well below screen (y: 220%)
              if (p < 0.36) {
                opacity = 1;
                y = "220%";
                scale = 0.95;
                rotate = idx === 0 ? -4 : idx === 1 ? 0 : 4;
                rotationY = 0;
                zIndex = idx === 0 ? 10 : idx === 1 ? 5 : 3;
              }

              // Step B (0.36 -> 0.48): Deck rises from bottom into center stage
              else if (p < 0.48) {
                const norm = (p - 0.36) / 0.12;
                opacity = 1;
                y = gsap.utils.interpolate("220%", "0%", smoothStep(norm));
                if (idx === 0) {
                  scale = gsap.utils.interpolate(0.95, 1, smoothStep(norm));
                  rotate = -4;
                  rotationY = 0;
                  zIndex = 10;
                } else if (idx === 1) {
                  scale = gsap.utils.interpolate(0.92, 0.96, smoothStep(norm));
                  rotate = 0;
                  rotationY = 0;
                  zIndex = 5;
                } else if (idx === 2) {
                  scale = gsap.utils.interpolate(0.88, 0.92, smoothStep(norm));
                  rotate = 4;
                  rotationY = 0;
                  zIndex = 3;
                }
              }

              // Phase 1 Hold (0.48 -> 0.58): Deck holds steady in the center for 1 scroll before rotating
              else if (p < 0.58) {
                opacity = 1;
                y = "0%";
                rotationY = 0;
                if (idx === 0) {
                  scale = 1;
                  rotate = -4;
                  zIndex = 10;
                } else if (idx === 1) {
                  scale = 0.96;
                  rotate = 0;
                  zIndex = 5;
                } else if (idx === 2) {
                  scale = 0.92;
                  rotate = 4;
                  zIndex = 3;
                }
              }

              // Phase 2 (0.58 -> 0.68): 1st Card rotates 180° in front of deck to show its details
              else if (p < 0.68) {
                const norm = (p - 0.58) / 0.10;
                if (idx === 0) {
                  opacity = 1;
                  scale = 1;
                  y = 0;
                  rotate = gsap.utils.interpolate(-4, 0, smoothStep(norm));
                  rotationY = smoothStep(norm) * 180;
                  zIndex = 10;
                } else if (idx === 1) {
                  opacity = 0.9;
                  scale = 0.96;
                  y = 0;
                  rotate = 0;
                  rotationY = 0;
                  zIndex = 5;
                } else if (idx === 2) {
                  opacity = 0.8;
                  scale = 0.92;
                  y = 0;
                  rotate = 4;
                  rotationY = 0;
                  zIndex = 2;
                }
              }

              // Phase 3 (0.68 -> 0.78): 1st Card details holds steady on screen
              else if (p < 0.78) {
                if (idx === 0) {
                  opacity = 1;
                  scale = 1;
                  y = 0;
                  rotate = 0;
                  rotationY = 180;
                  zIndex = 10;
                } else if (idx === 1) {
                  opacity = 0.9;
                  scale = 0.96;
                  y = 0;
                  rotate = 0;
                  rotationY = 0;
                  zIndex = 5;
                } else if (idx === 2) {
                  opacity = 0.8;
                  scale = 0.92;
                  y = 0;
                  rotate = 4;
                  rotationY = 0;
                  zIndex = 2;
                }
              }

              // Phase 4 (0.78 -> 0.88): 1st Card rotates & slides away, 2nd Card moves to front & rotates 180° to show details
              else if (p < 0.88) {
                const norm = (p - 0.78) / 0.10;
                if (idx === 0) {
                  opacity = 1 - smoothStep(norm);
                  scale = gsap.utils.interpolate(1, 1.12, smoothStep(norm));
                  x = gsap.utils.interpolate(0, -60, smoothStep(norm));
                  y = gsap.utils.interpolate(0, -20, smoothStep(norm));
                  rotate = gsap.utils.interpolate(0, -15, smoothStep(norm));
                  rotationY = 180;
                  zIndex = 8;
                } else if (idx === 1) {
                  opacity = 1;
                  scale = gsap.utils.interpolate(0.96, 1, smoothStep(norm));
                  y = 0;
                  rotate = 0;
                  rotationY = smoothStep(norm) * 180;
                  zIndex = 10;
                } else if (idx === 2) {
                  opacity = 0.85;
                  scale = gsap.utils.interpolate(0.92, 0.96, smoothStep(norm));
                  y = 0;
                  rotate = 4;
                  rotationY = 0;
                  zIndex = 2;
                }
              }

              // Phase 5 (0.88 -> 0.95): 2nd Card details holds steady on screen
              else if (p < 0.95) {
                if (idx === 0) {
                  opacity = 0;
                  zIndex = 1;
                } else if (idx === 1) {
                  opacity = 1;
                  scale = 1;
                  y = 0;
                  rotate = 0;
                  rotationY = 180;
                  zIndex = 10;
                } else if (idx === 2) {
                  opacity = 0.85;
                  scale = 0.96;
                  y = 0;
                  rotate = 4;
                  rotationY = 0;
                  zIndex = 2;
                }
              }

              // Phase 6 (0.95 -> 0.98): 2nd Card rotates & slides away, 3rd Card moves to front & rotates 180° to show details
              else if (p < 0.98) {
                const norm = (p - 0.95) / 0.03;
                if (idx === 0) {
                  opacity = 0;
                  zIndex = 1;
                } else if (idx === 1) {
                  opacity = 1 - smoothStep(norm);
                  scale = gsap.utils.interpolate(1, 1.12, smoothStep(norm));
                  x = gsap.utils.interpolate(0, -60, smoothStep(norm));
                  y = gsap.utils.interpolate(0, -20, smoothStep(norm));
                  rotate = gsap.utils.interpolate(0, -15, smoothStep(norm));
                  rotationY = 180;
                  zIndex = 8;
                } else if (idx === 2) {
                  opacity = 1;
                  scale = gsap.utils.interpolate(0.96, 1, smoothStep(norm));
                  y = 0;
                  rotate = gsap.utils.interpolate(4, 0, smoothStep(norm));
                  rotationY = smoothStep(norm) * 180;
                  zIndex = 10;
                }
              }

              // Phase 7 (0.98 -> 1.0): 3rd Card details holds steady on screen until section end
              else {
                if (idx === 2) {
                  opacity = 1;
                  scale = 1;
                  y = 0;
                  x = 0;
                  rotate = 0;
                  rotationY = 180;
                  zIndex = 10;
                } else {
                  opacity = 0;
                  zIndex = 1;
                }
              }

              gsap.set(cardEl, {
                opacity,
                scale,
                y,
                x,
                rotate,
                zIndex,
              });

              if (innerCard) {
                gsap.set(innerCard, {
                  rotationY,
                });
              }
            });
          },
        });

        return () => trigger.kill();
      });

      return () => media.revert();
    }, section);

    const refreshFrame = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills-section"
      className="skills-3d-section"
      aria-label="Capabilities"
    >
      <div ref={stageRef} className="skills-3d-stage">
        {/* Ambient Bronze Background Glows */}
        <div className="skills-ambient-glow" aria-hidden="true" />

        {/* Mobile-Only: 3 Top Horizontal Cards */}
        <div ref={mobileTopCardsContainerRef} className="skills-mobile-top-cards">
          {capabilityCards.map((card, idx) => (
            <div
              key={`mobile-top-${card.id}`}
              id={`mobile-top-card-${idx + 1}`}
              className="mobile-top-card"
            >
              <div
                className="card-wrapper"
                style={{ animationDelay: `${idx * 0.25}s` }}
              >
                <div className="mobile-top-card-body bronze-glass">
                  <div className="card-title">
                    <span>{card.title}</span>
                    <span>{card.number}</span>
                  </div>
                  <div className="card-title">
                    <span>{card.number}</span>
                    <span>{card.title}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3D Animated Cards Container (Desktop, Laptop, Tablet & Mobile Details) */}
        <div ref={cardsContainerRef} className="skills-cards-container">
          {capabilityCards.map((card, idx) => (
            <div
              key={card.id}
              id={`skill-card-${idx + 1}`}
              className="skill-card"
            >
              <div
                className="card-wrapper"
                style={{ animationDelay: `${idx * 0.25}s` }}
              >
                <div className="flip-card-inner">
                  {/* Front Face */}
                  <div className="flip-card-front bronze-glass">
                    <div className="card-title">
                      <span>{card.title}</span>
                      <span>{card.number}</span>
                    </div>

                    <div className="card-title">
                      <span>{card.number}</span>
                      <span>{card.title}</span>
                    </div>
                  </div>

                  {/* Back Face */}
                  <div className="flip-card-back bronze-glass">
                    <div className="card-title">
                      <span>{card.title}</span>
                      <span>{card.number}</span>
                    </div>

                    <div className="card-copy">
                      {card.items.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>

                    <div className="card-title">
                      <span>{card.number}</span>
                      <span>{card.title}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
