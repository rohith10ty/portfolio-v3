import { ArrowUpRight, Mail } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

import BorderGlow from "../BorderGlow/BorderGlow";
import "./Contact.css";

// Replace these two placeholders when your public contact details are ready.
const EMAIL = "dev@rohithnaidu.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/naidurohith/";
const GITHUB_URL = "https://github.com/rohith10ty";
const INSTAGRAM_URL = "https://www.instagram.com/rohn.exe/";

const contactItems = [
  {
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    Icon: Mail,
  },
  {
    label: "GitHub",
    value: "rohith10ty",
    href: GITHUB_URL,
    Icon: FaGithub,
    external: true,
  },
  {
    label: "LinkedIn",
    value: "Connect with me",
    href: LINKEDIN_URL,
    Icon: FaLinkedin,
    external: true,
  },
  {
    label: "Instagram",
    value: "Follow me",
    href: INSTAGRAM_URL,
    Icon: FaInstagram,
    external: true,
  },
];

function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-inner">
        <div className="contact-heading">
          <p className="contact-kicker">CONTACT</p>

          <h2>
            Let's build something
            <br />
            <strong>memorable.</strong>
          </h2>

          <p className="contact-text">
            Open to MERN and full-stack opportunities, thoughtful frontend work,
            and collaborations that turn useful ideas into polished web
            experiences.
          </p>
        </div>

        <div className="contact-links" aria-label="Contact links">
          {contactItems.map(({ label, value, href, Icon, external }) => (
            <BorderGlow key={label} className="contact-glow" borderRadius={18}>
              <a
                href={href}
                className="contact-link"
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
              >
                <span className="contact-link-icon">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span className="contact-link-copy">
                  <small>{label}</small>
                  <strong>{value}</strong>
                </span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Contact;
