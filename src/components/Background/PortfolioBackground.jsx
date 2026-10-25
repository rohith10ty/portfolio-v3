import ShapeGrid from "./ShapeGrid";

import "./PortfolioBackground.css";

function PortfolioBackground() {
  return (
    <div className="portfolio-background" aria-hidden="true">
      <div className="portfolio-background-base" />

      <ShapeGrid />

      <div className="portfolio-background-glow portfolio-background-glow-one" />

      <div className="portfolio-background-glow portfolio-background-glow-two" />

      <div className="portfolio-background-vignette" />

      <div className="portfolio-background-noise" />
    </div>
  );
}

export default PortfolioBackground;
