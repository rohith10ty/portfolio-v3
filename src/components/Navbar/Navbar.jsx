import React, { useEffect, useRef, useState } from "react";
import {
  Home,
  User,
  FolderGit2,
  Briefcase,
  Mail,
  Menu,
  X as CloseIcon,
} from "lucide-react";
import { Dock, DockIcon, DockSeparator } from "../ui/dock";
import { smoothScrollTo } from "../../utils/smoothScroll";
import "./Navbar.css";

const Icons = {
  github: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  linkedin: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  instagram: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
  youtube: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

const navItems = [
  { label: "Home", target: "home", icon: Home },
  { label: "About", target: "about", icon: User },
  { label: "Projects", target: "projects", icon: FolderGit2 },
  { label: "Experience", target: "experience", icon: Briefcase },
  { label: "Contact", target: "contact", icon: Mail },
];

const socialItems = [
  {
    name: "GitHub",
    url: "https://github.com/rohith10ty",
    icon: Icons.github,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/naidurohith/",
    icon: Icons.linkedin,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/rohn.exe/",
    icon: Icons.instagram,
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@therohithnaidu",
    icon: Icons.youtube,
  },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!navbarRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const scrollTo = (target) => {
    setMenuOpen(false);

    if (target === "home") {
      smoothScrollTo(0, { duration: 2.0 });
      return;
    }

    if (target === "about") {
      // Scroll past the Hero curtain opening directly into the active About section
      const heroOffset = window.innerHeight * 3.2;
      smoothScrollTo(heroOffset, { duration: 2.2 });
      return;
    }

    const section = document.getElementById(target);
    if (section) {
      smoothScrollTo(section, { offset: -72, duration: 2.2 });
    }
  };

  return (
    <header
      ref={navbarRef}
      className={scrolled ? "site-navbar scrolled" : "site-navbar"}
    >
      <button className="navbar-brand" onClick={() => scrollTo("home")}>
        Rohith Naidu
      </button>

      {/* Right-Side Magic UI Dock */}
      <div className="navbar-dock-wrapper max-md:hidden">
        <Dock direction="middle" className="h-12 gap-1.5 px-3">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <DockIcon
                key={item.label}
                tooltip={item.label}
                onClick={() => scrollTo(item.target)}
                aria-label={item.label}
              >
                <IconComponent className="h-4 w-4" />
              </DockIcon>
            );
          })}

          {/* Luxury Gold Separator Line */}
          <DockSeparator />

          {socialItems.map((social) => {
            const SocialIcon = social.icon;
            return (
              <DockIcon
                key={social.name}
                tooltip={social.name}
                aria-label={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon className="h-4 w-4" />
              </DockIcon>
            );
          })}
        </Dock>
      </div>

      {/* Mobile Hamburger Toggle Button */}
      <button
        type="button"
        className="navbar-menu-button"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
      >
        {menuOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Slide-Out Menu */}
      <div
        id="mobile-navigation"
        className={menuOpen ? "navbar-mobile-menu open" : "navbar-mobile-menu"}
      >
        {navItems.map((item) => (
          <button key={item.target} onClick={() => scrollTo(item.target)}>
            {item.label}
          </button>
        ))}
        <div className="my-2 h-px w-full bg-[rgba(225,220,201,0.1)]" />
        <div className="flex items-center gap-3 px-3 py-2">
          {socialItems.map((social) => {
            const SocialIcon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(225,220,201,0.06)] text-[#e1dcc9] transition-colors hover:bg-[rgba(216,160,94,0.2)] hover:text-[#f0cd9b]"
                aria-label={social.name}
              >
                <SocialIcon />
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
