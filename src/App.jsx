import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import PortfolioBackground from "./components/Background/PortfolioBackground";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import AboutSkills from "./components/AboutSkills/AboutSkills";
import Skills from "./components/AboutSkills/Skills";
import Projects from "./components/Projects/Projects";
import Experience from "./components/Experience/Experience";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import { registerLenis } from "./utils/smoothScroll";

import "./App.css";

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 0.85,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.1,
      wheelMultiplier: 1.0,
    });
    const unregisterLenis = registerLenis(lenis);
    const updateScrollTrigger = () => ScrollTrigger.update();
    const updateLenis = (time) => lenis.raf(time * 1000);

    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(updateLenis);

    return () => {
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(updateLenis);
      unregisterLenis();
      lenis.destroy();
    };
  }, []);

  return (
    <div className="portfolio-app">
      <PortfolioBackground />
      <Navbar />
      <main>
        <Hero />
        <AboutSkills />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
