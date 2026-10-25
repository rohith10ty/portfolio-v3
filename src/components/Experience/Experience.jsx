import BorderGlow from "../BorderGlow/BorderGlow";
import "./Experience.css";

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
  return (
    <section id="experience" className="experience-section">
      <div className="experience-header">
        <span>EXPERIENCE / 04</span>

        <h2>
          Different paths,
          <br />
          <strong>one direction.</strong>
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
