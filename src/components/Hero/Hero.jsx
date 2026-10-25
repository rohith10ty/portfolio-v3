import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedGridPattern } from "../ui/animated-grid-pattern";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return undefined;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(
        [
          ".hero-panel-left .char span",
          ".hero-panel-right .char span",
        ],
        { y: "0%" },
      );

      gsap.set(
        [
          ".hero-role-wrapper",
          ".hero-support-block",
          ".hero-scroll-indicator",
        ],
        { opacity: 1, y: 0, x: 0, xPercent: 0 },
      );

      gsap.set([".hero-panel-left", ".hero-panel-right"], {
        xPercent: 0,
      });

      gsap.set(
        [
          ".hero-panel-left .char-r",
          ".hero-panel-right .char-n",
        ],
        {
          x: 0,
          scale: 1,
        },
      );

      gsap.set([".hero-panel-left .panel-word", ".hero-panel-right .panel-word"], {
        x: "0.26em",
      });

      gsap.set(".hero-grid-sublayer", {
        opacity: 1,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: 1.4,
          pin: wrapper,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "power1.inOut" },
      });

      // 1. As scroll starts: Role badge, bottom slogan, and scroll indicator fade out
      tl.to(
        ".hero-role-wrapper",
        {
          opacity: 0,
          y: 20,
          duration: 0.4,
        },
        0,
      )
        .to(
          ".hero-support-block",
          {
            opacity: 0,
            y: 25,
            duration: 0.4,
          },
          0,
        )
        .to(
          ".hero-scroll-indicator",
          {
            opacity: 0,
            y: 15,
            duration: 0.3,
          },
          0,
        );

      // 2. Letters dissolve: "OHITH" & "AIDU" slide down and collapse smoothly
      tl.to(
        [
          ".hero-panel-left .word-ohith .char span",
          ".hero-panel-right .word-aidu .char span",
        ],
        {
          y: "105%",
          duration: 0.8,
          stagger: 0.03,
        },
        0.2,
      );

      // 3. Words collapse to 0 width so R and N touch seamlessly in the center to form the united "RN" monogram
      // AND smoothly fade the grid background to pure solid black!
      tl.to(
        [
          ".hero-panel-left .word-ohith",
          ".hero-panel-right .word-aidu",
        ],
        {
          width: 0,
          opacity: 0,
          duration: 1.0,
        },
        0.6,
      )
        .to(
          [".hero-panel-left .panel-word", ".hero-panel-right .panel-word"],
          {
            x: 0,
            duration: 1.0,
          },
          0.6,
        )
        .to(
          [
            ".hero-panel-left .char-r",
            ".hero-panel-right .char-n",
          ],
          {
            scale: 1.35,
            color: "#f0cd9b",
            duration: 1.0,
          },
          0.6,
        )
        .to(
          ".hero-grid-sublayer",
          {
            opacity: 0,
            duration: 0.9,
            ease: "power2.inOut",
          },
          0.6,
        );

      // 4. Hold the complete united "RN" monogram in the center with pure black background (1.6 -> 2.0)

      // 5. Slower Swoosh Opening with breathing margin offset for R and N
      tl.to(
        ".hero-panel-left",
        {
          xPercent: -100,
          duration: 1.8,
          ease: "power2.inOut",
        },
        2.0,
      )
        .to(
          ".hero-panel-right",
          {
            xPercent: 100,
            duration: 1.8,
            ease: "power2.inOut",
          },
          2.0,
        )
        // Offset R leftward away from the door edge so it has a comfortable breathing gap
        .to(
          ".hero-panel-left .char-r",
          {
            x: -48,
            scale: 1.18,
            opacity: 0.85,
            duration: 1.8,
            ease: "power2.inOut",
          },
          2.0,
        )
        // Offset N rightward away from the door edge so it has a comfortable breathing gap
        .to(
          ".hero-panel-right .char-n",
          {
            x: 48,
            scale: 1.18,
            opacity: 0.85,
            duration: 1.8,
            ease: "power2.inOut",
          },
          2.0,
        )
        .to(
          wrapper,
          {
            autoAlpha: 0,
            duration: 0.2,
          },
          3.9,
        );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div id="home" ref={containerRef} className="hero-scroll-container">
      <div ref={wrapperRef} className="hero-pinned-wrapper">
        {/* ========================================================
            LEFT DOOR PANEL (Carries letter "R" + Left Grid)
            ======================================================== */}
        <div className="hero-panel hero-panel-left">
          {/* Aligned Full-Screen Animated Grid Pattern with skew-y-12 */}
          <div className="hero-grid-sublayer absolute top-0 left-0 w-[100vw] h-[100vh] pointer-events-none z-0 will-change-[opacity]">
            <AnimatedGridPattern
              numSquares={42}
              maxOpacity={0.52}
              className="[mask-image:radial-gradient(620px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
            />
          </div>

          <div className="panel-word left-word">
            <h1 className="door-heading">
              <span className="char initial char-r">
                <span>R</span>
              </span>
              <span className="rest word-ohith">
                <span className="char">
                  <span>O</span>
                </span>
                <span className="char">
                  <span>H</span>
                </span>
                <span className="char">
                  <span>I</span>
                </span>
                <span className="char">
                  <span>T</span>
                </span>
                <span className="char">
                  <span>H</span>
                </span>
              </span>
            </h1>
          </div>
        </div>

        {/* ========================================================
            RIGHT DOOR PANEL (Carries letter "N" + Right Grid)
            ======================================================== */}
        <div className="hero-panel hero-panel-right">
          {/* Aligned Full-Screen Animated Grid Pattern with skew-y-12 */}
          <div className="hero-grid-sublayer absolute top-0 left-[-50vw] w-[100vw] h-[100vh] pointer-events-none z-0 will-change-[opacity]">
            <AnimatedGridPattern
              numSquares={42}
              maxOpacity={0.52}
              className="[mask-image:radial-gradient(620px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
            />
          </div>

          <div className="panel-word right-word">
            <h1 className="door-heading">
              <span className="char initial char-n">
                <span>N</span>
              </span>
              <span className="rest word-aidu">
                <span className="char">
                  <span>A</span>
                </span>
                <span className="char">
                  <span>I</span>
                </span>
                <span className="char">
                  <span>D</span>
                </span>
                <span className="char">
                  <span>U</span>
                </span>
              </span>
            </h1>
          </div>
        </div>

        {/* ========================================================
            UI OVERLAYS: Role Rhombus, Bottom-Right Slogan & Scroll Indicator
            ======================================================== */}
        <div className="hero-ui-overlay">
          {/* Centered Role Rhombus Badge */}
          <div className="hero-role-wrapper">
            <div className="hero-role-rhombus">
              <span className="hero-role-text">MERN STACK DEVELOPER</span>
            </div>
          </div>

          {/* Bottom-Right Supporting Slogan Block */}
          <aside className="hero-support-block" aria-label="Philosophy">
            <span className="hero-support-eyebrow">DRIVEN BY CLEAN CODE</span>

            <h2 className="hero-support-heading">
              Build to
              <br />
              <strong>scale.</strong>
            </h2>

            <p className="hero-support-desc">
              From database to display, creating complete web experiences that
              perform.
            </p>
          </aside>

          {/* Scroll Explorer Indicator */}
          <div className="hero-scroll-indicator" aria-hidden="true">
            <span>SCROLL TO EXPLORE</span>
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
