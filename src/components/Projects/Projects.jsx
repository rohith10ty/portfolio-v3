import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tree } from "../ui/file-tree";
import { MacbookPro } from "../ui/macbook-pro";
import { Iphone } from "../ui/iphone";
import { FolderGit2, ExternalLink, Laptop, Smartphone } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const GitHubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

/* =========================================================
   PROJECT TREE DATA (Fallback / Base Tree from @rohith10ty)
========================================================= */

const REPO_LIVE_URLS = {
  "Rohn-POS": "https://pos.rohithnaidu.com/",
  "quantum-pharmacy": "https://quantum-pharmacy.netlify.app/",
  "Quantum-management-console": "https://quantum-console.netlify.app/",
  "quantum-management-console": "https://quantum-console.netlify.app/",
  "kalyan-veda": "https://kalyanveda.invitation.rohithnaidu.com/",
  "kalyan_veda_invitation": "https://kalyanveda.invitation.rohithnaidu.com/",
  "auth-app": "https://login-or-signup-app.netlify.app/",
  "hr-dashboard": "https://quantum-hr-dashboard.netlify.app/",
  "rohnoutlet": "https://rohnoutlet.netlify.app/",
  "coffee-haven": "https://coffeeshaven.netlify.app/",
  "coffee-haven-mobile": "https://coffeeshaven.netlify.app/",
  "feeling": "https://feeling-psi.vercel.app",
  "one-root": "https://one-root-rosy.vercel.app",
  "quantum-exchange": "https://quantum-exchange-sigma.vercel.app",
  "quantum-flow": "https://quantum-flow-tawny.vercel.app",
  "quantum-ecommerce": "https://quantum-ecommerce-mu.vercel.app",
  "rohy": "https://rohy-hazel.vercel.app",
  "queue": "https://queue-livid-eta.vercel.app",
  "quantum-journal": "https://quantum-journal-seven.vercel.app",
  "pizza-in": "https://pizzain.vercel.app",
  "aqua": "https://aqua-six-beryl.vercel.app",
  "nesta": "https://nesta-ashy.vercel.app",
  "aura": "https://aura-dun-mu.vercel.app",
  "movable": "https://movable-three.vercel.app",
  "cat-energy": "https://cat-energy-nu.vercel.app",
  "dinky-donuts": "https://dinkydonuts.rohithnaidu.com/",
  "veer-fitness": "https://veer-fitness-six.vercel.app",
  "traveling-soldier": "https://traveling-soldier-six.vercel.app",
  "romato": "https://romato-one.vercel.app",
  "naturer": "https://naturer.vercel.app",
  "vijaya-durga-catering": "https://vijaya-durga-catering.vercel.app",
  "flex-housing": "https://flex-housing.vercel.app",
};

const INITIAL_PROJECTS_TREE = [
  {
    id: "root-repos",
    name: "rohith-repositories",
    children: [
      {
        id: "fullstack-mern",
        name: "fullstack & mern apps",
        children: [
          {
            id: "feeling",
            name: "feeling.app",
            homepage: "https://feeling-psi.vercel.app",
            github: "https://github.com/rohith10ty/feeling",
          },
          {
            id: "one-root",
            name: "one-root.dev",
            homepage: "https://one-root-rosy.vercel.app",
            github: "https://github.com/rohith10ty/one-root",
          },
          {
            id: "quantum-exchange",
            name: "quantum-exchange.io",
            homepage: "https://quantum-exchange-sigma.vercel.app",
            github: "https://github.com/rohith10ty/quantum-exchange",
          },
          {
            id: "quantum-flow",
            name: "quantum-flow.app",
            homepage: "https://quantum-flow-tawny.vercel.app",
            github: "https://github.com/rohith10ty/quantum-flow",
          },
          {
            id: "quantum-ecommerce",
            name: "quantum-ecommerce.store",
            homepage: "https://quantum-ecommerce-mu.vercel.app",
            github: "https://github.com/rohith10ty/quantum-ecommerce",
          },
          {
            id: "rohy",
            name: "rohy-hazel.app",
            homepage: "https://rohy-hazel.vercel.app",
            github: "https://github.com/rohith10ty/rohy",
          },
          {
            id: "queue",
            name: "queue-manager.app",
            homepage: "https://queue-livid-eta.vercel.app",
            github: "https://github.com/rohith10ty/queue",
          },
          {
            id: "quantum-journal",
            name: "quantum-journal.app",
            homepage: "https://quantum-journal-seven.vercel.app",
            github: "https://github.com/rohith10ty/quantum-journal",
          },
          {
            id: "quantum-chat",
            name: "quantum-chat.io",
            github: "https://github.com/rohith10ty/quantum-chat",
          },
        ],
      },
      {
        id: "commercial-client",
        name: "commercial & client portals",
        children: [
          {
            id: "Rohn-POS",
            name: "rohn-pos.system",
            homepage: "https://pos.rohithnaidu.com/",
            github: "https://github.com/rohith10ty/Rohn-POS",
          },
          {
            id: "quantum-pharmacy",
            name: "quantum-pharmacy.app",
            homepage: "https://quantum-pharmacy.netlify.app/",
            github: "https://github.com/rohith10ty/quantum-pharmacy",
          },
          {
            id: "Quantum-management-console",
            name: "quantum-console.app",
            homepage: "https://quantum-console.netlify.app/",
            github: "https://github.com/rohith10ty/Quantum-management-console",
          },
          {
            id: "auth-app",
            name: "auth-portal.app",
            homepage: "https://login-or-signup-app.netlify.app/",
            github: "https://github.com/rohith10ty/auth-app",
          },
          {
            id: "hr-dashboard",
            name: "hr-dashboard.portal",
            homepage: "https://quantum-hr-dashboard.netlify.app/",
            github: "https://github.com/rohith10ty/hr-dashboard",
          },
          {
            id: "flex-housing",
            name: "flex-housing.app",
            homepage: "https://flex-housing.vercel.app",
            github: "https://github.com/rohith10ty/flex-housing",
          },
          {
            id: "kalyan-veda",
            name: "kalyan-veda-invitation",
            homepage: "https://kalyanveda.invitation.rohithnaidu.com/",
            github: "https://github.com/rohith10ty/kalyan_veda_invitation",
          },
          {
            id: "vijaya-durga-catering",
            name: "vijaya-durga-catering.app",
            homepage: "https://vijaya-durga-catering.vercel.app",
            github: "https://github.com/rohith10ty/vijaya-durga-catering",
          },
        ],
      },
      {
        id: "frontend-design",
        name: "frontend & creative ui",
        children: [
          {
            id: "coffee-haven-mobile",
            name: "coffee-haven.app",
            homepage: "https://coffeeshaven.netlify.app/",
            github: "https://github.com/rohith10ty/coffee-haven-mobile",
          },
          {
            id: "rohnoutlet",
            name: "rohnoutlet.store",
            homepage: "https://rohnoutlet.netlify.app/",
            github: "https://github.com/rohith10ty/rohnoutlet",
          },
          {
            id: "dinky-donuts",
            name: "dinky-donuts.com",
            homepage: "https://dinkydonuts.rohithnaidu.com/",
            github: "https://github.com/rohith10ty/dinky-donuts",
          },
          {
            id: "pizza-in",
            name: "pizza.in",
            homepage: "https://pizzain.vercel.app",
            github: "https://github.com/rohith10ty/pizza.in",
          },
          {
            id: "aqua",
            name: "aqua.studio",
            homepage: "https://aqua-six-beryl.vercel.app",
            github: "https://github.com/rohith10ty/aqua",
          },
          {
            id: "nesta",
            name: "nesta.agency",
            homepage: "https://nesta-ashy.vercel.app",
            github: "https://github.com/rohith10ty/nesta",
          },
          {
            id: "aura",
            name: "aura.design",
            homepage: "https://aura-dun-mu.vercel.app",
            github: "https://github.com/rohith10ty/aura",
          },
          {
            id: "movable",
            name: "movable-motion.dev",
            homepage: "https://movable-three.vercel.app",
            github: "https://github.com/rohith10ty/movable",
          },
          {
            id: "cat-energy",
            name: "cat-energy.fit",
            homepage: "https://cat-energy-nu.vercel.app",
            github: "https://github.com/rohith10ty/cat-energy",
          },
          {
            id: "veer-fitness",
            name: "veer-fitness.club",
            homepage: "https://veer-fitness-six.vercel.app",
            github: "https://github.com/rohith10ty/veer-fitness",
          },
          {
            id: "traveling-soldier",
            name: "traveling-soldier.app",
            homepage: "https://traveling-soldier-six.vercel.app",
            github: "https://github.com/rohith10ty/traveling-soldier",
          },
          {
            id: "romato",
            name: "romato-food.app",
            homepage: "https://romato-one.vercel.app",
            github: "https://github.com/rohith10ty/romato",
          },
          {
            id: "naturer",
            name: "naturer.eco",
            homepage: "https://naturer.vercel.app",
            github: "https://github.com/rohith10ty/naturer",
          },
        ],
      },
    ],
  },
];

// Build categorized tree dynamically from GitHub API repos
const buildDynamicTree = (repos) => {
  if (!repos || !Array.isArray(repos) || repos.length === 0) {
    return INITIAL_PROJECTS_TREE;
  }

  const fullstack = [];
  const client = [];
  const frontend = [];
  const tools = [];

  repos.forEach((repo) => {
    const verifiedHomepage = repo.homepage || REPO_LIVE_URLS[repo.name] || REPO_LIVE_URLS[repo.name.toLowerCase()] || null;
    const item = {
      id: repo.name,
      name: verifiedHomepage ? `${repo.name}.app` : repo.name,
      homepage: verifiedHomepage,
      github: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
    };

    const name = repo.name.toLowerCase();
    const topics = Array.isArray(repo.topics) ? repo.topics.map(t => t.toLowerCase()) : [];
    const desc = (repo.description || "").toLowerCase();

    // 1. Commercial & Client Portals
    if (
      name.includes("pos") ||
      name.includes("pharmacy") ||
      name.includes("console") ||
      name.includes("auth") ||
      name.includes("dashboard") ||
      name.includes("catering") ||
      name.includes("housing") ||
      name.includes("kalyan") ||
      name.includes("portal") ||
      name.includes("client") ||
      topics.includes("portal") ||
      topics.includes("dashboard")
    ) {
      client.push(item);
    }
    // 2. Fullstack & MERN
    else if (
      name.includes("quantum") ||
      name.includes("chat") ||
      name.includes("queue") ||
      name.includes("journal") ||
      name.includes("fullstack") ||
      name.includes("mern") ||
      name.includes("feeling") ||
      name.includes("one-root") ||
      name.includes("rohy") ||
      name.includes("bank") ||
      name.includes("exchange") ||
      name.includes("ecommerce") ||
      topics.includes("fullstack") ||
      topics.includes("mern") ||
      topics.includes("backend") ||
      topics.includes("mongodb") ||
      desc.includes("mern") ||
      desc.includes("full stack")
    ) {
      fullstack.push(item);
    }
    // 3. Frontend & Creative UI
    else if (
      name.includes("pizza") ||
      name.includes("aqua") ||
      name.includes("nesta") ||
      name.includes("aura") ||
      name.includes("movable") ||
      name.includes("energy") ||
      name.includes("donuts") ||
      name.includes("fitness") ||
      name.includes("soldier") ||
      name.includes("romato") ||
      name.includes("nature") ||
      name.includes("outlet") ||
      name.includes("coffee") ||
      name.includes("portfolio") ||
      topics.includes("frontend") ||
      topics.includes("ui") ||
      topics.includes("css") ||
      topics.includes("animation")
    ) {
      frontend.push(item);
    }
    // 4. Open-Source & Tools
    else {
      tools.push(item);
    }
  });

  const children = [
    {
      id: "fullstack-mern",
      name: "fullstack & mern apps",
      children: fullstack.length > 0 ? fullstack : INITIAL_PROJECTS_TREE[0].children[0].children,
    },
    {
      id: "commercial-client",
      name: "commercial & client portals",
      children: client.length > 0 ? client : INITIAL_PROJECTS_TREE[0].children[1].children,
    },
    {
      id: "frontend-design",
      name: "frontend & creative ui",
      children: frontend.length > 0 ? frontend : INITIAL_PROJECTS_TREE[0].children[2].children,
    },
  ];

  if (tools.length > 0) {
    children.push({
      id: "open-source-tools",
      name: "open-source & tools",
      children: tools,
    });
  }

  return [
    {
      id: "root-repos",
      name: "rohith-repositories",
      children,
    },
  ];
};

const flattenTreeToMap = (tree) => {
  const map = {};
  const traverse = (node) => {
    if (node.id && !node.children) {
      map[node.id] = node;
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  };
  tree.forEach(traverse);
  return map;
};

function Projects() {
  const stageRef = useRef(null);
  const treeWrapperRef = useRef(null);

  const [treeElements, setTreeElements] = useState(INITIAL_PROJECTS_TREE);
  const [repoCount, setRepoCount] = useState(30);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isLiveSync, setIsLiveSync] = useState(false);
  const [previewMode, setPreviewMode] = useState("laptop"); // "laptop" (default) | "mobile"

  // Fetch real-time GitHub repositories from GitHub public API
  useEffect(() => {
    let isMounted = true;
    async function fetchGitHubRepos() {
      try {
        const res = await fetch("https://api.github.com/users/rohith10ty/repos?per_page=100&sort=updated");
        if (!res.ok) throw new Error("GitHub rate limited or unavailable");
        const repos = await res.json();
        if (isMounted && Array.isArray(repos) && repos.length > 0) {
          const dynamicTree = buildDynamicTree(repos);
          setTreeElements(dynamicTree);
          setRepoCount(repos.length);
          setIsLiveSync(true);
        }
      } catch {
        // Silently use cached/curated fallback tree
        setIsLiveSync(false);
      }
    }
    fetchGitHubRepos();
    return () => {
      isMounted = false;
    };
  }, []);

  const projectsMap = useMemo(() => flattenTreeToMap(treeElements), [treeElements]);
  const activeProject = selectedProjectId ? projectsMap[selectedProjectId] : null;

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const treeWrapper = treeWrapperRef.current;
    if (!stage || !treeWrapper) return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      gsap.set(treeWrapper, { y: 0, opacity: 1 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      const getOffscreenTop = () => -(window.innerHeight + 350);
      const getOffscreenBottom = () => window.innerHeight + 350;

      // Initial State: Tree is placed off-screen at the TOP
      gsap.set(treeWrapper, {
        y: getOffscreenTop,
        x: 0,
        opacity: 0,
      });

      // Timeline: Top -> Center (stay for scrolls) -> Bottom
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=1800",
          pin: stage,
          pinSpacing: true,
          scrub: 0.18,
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
          invalidateOnRefresh: true,
        },
      });

      // STAGE 1: Smoothly enter from TOP into the center
      tl.to(
        treeWrapper,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power1.out",
        },
        0
      );

      // STAGE 2: Rest in the center
      tl.to({}, { duration: 1.2 });

      // STAGE 3: Smoothly exit to the BOTTOM
      tl.to(
        treeWrapper,
        {
          y: getOffscreenBottom,
          opacity: 0,
          duration: 0.6,
          ease: "power1.in",
        },
        1.8
      );
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      className="relative z-[2] w-full"
    >
      {/* ========================================================
          1. CENTERED HEADER (Middle Content)
          Natural flow: Centered in its own section. When scrolling,
          it smoothly scrolls up and into the top viewport with no effects.
          ======================================================== */}
      <div className="relative flex h-[100svh] w-full flex-col items-center justify-center text-center px-5 max-w-[820px] mx-auto">
        <span className="text-[11px] font-semibold tracking-[0.28em] text-[#E1DCC9]/60 md:text-[12.5px] uppercase">
          PROJECTS / 03
        </span>

        <h2 className="mt-4 text-[clamp(44px,7.5vw,84px)] font-semibold leading-[0.9] tracking-[-0.055em] text-[#E1DCC9]">
          Selected work,
          <br />
          <strong className="font-semibold text-[#9a6a35]">
            crafted for real use.
          </strong>
        </h2>

        <p className="mx-auto mt-6 max-w-[580px] text-[clamp(14px,1.15vw,18px)] font-normal leading-relaxed text-[#E1DCC9]/65">
          Explore my GitHub projects directly through the interactive file tree.
          Select any project to preview across desktop and mobile devices.
        </p>

        <div className="mt-8 flex items-center gap-2 text-[12px] font-mono text-[#9a6a35]/80">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#9a6a35] animate-ping" />
          <span>Scroll to explore project workspace</span>
        </div>
      </div>

      {/* ========================================================
          2. SHOWCASE STAGE: Tree comes from left, stays in center, goes to right
          Responsive proportional scaler for compact mobile (iPhone SE & Samsung A55)
          ======================================================== */}
      <div
        ref={stageRef}
        className="relative z-20 flex h-[100svh] w-full items-center justify-center overflow-hidden px-4 md:px-8 lg:px-12"
      >
        <div
          ref={treeWrapperRef}
          className="relative w-full max-w-[1420px] will-change-transform flex items-center justify-center"
        >
          <div className="projects-stage-scaler w-full flex items-center justify-center">
            <div
              className={`grid grid-cols-1 items-center gap-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full ${
                activeProject
                  ? "lg:grid-cols-12 lg:gap-6 xl:gap-8"
                  : "grid-cols-1 place-items-center"
              }`}
            >
            {/* 1. File Tree Window: Centered when no repo selected, shifts to left column when a repo is clicked */}
            <div
              className={`relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                activeProject
                  ? "lg:col-span-4 max-w-[380px] xl:max-w-[400px] mx-auto lg:mx-0 w-full"
                  : "w-full max-w-[480px] mx-auto"
              }`}
            >
              <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(225,188,120,0.24)] bg-[#120c07]/92 p-1 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_0_20px_rgba(139,98,52,0.14)] backdrop-blur-2xl">
                {/* Window Bar */}
                <div className="flex items-center justify-between border-b border-[rgba(225,188,120,0.12)] bg-[#1a120b]/85 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#e0564c]/85 shadow-[0_0_6px_rgba(224,86,76,0.3)]" />
                    <div className="h-3 w-3 rounded-full bg-[#e5a038]/85 shadow-[0_0_6px_rgba(229,160,56,0.3)]" />
                    <div className="h-3 w-3 rounded-full bg-[#52ba69]/85 shadow-[0_0_6px_rgba(82,186,105,0.3)]" />
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-[#e1dcc9]/60">
                    <FolderGit2 className="h-3.5 w-3.5 text-[#d8a05e]" />
                    <span>github: rohith10ty</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeProject && (
                      <button
                        onClick={() => setSelectedProjectId(null)}
                        className="rounded border border-[rgba(225,188,120,0.25)] bg-[rgba(216,160,94,0.1)] px-2 py-0.5 text-[10px] font-mono text-[#d8a05e] hover:bg-[#d8a05e]/20 hover:text-white transition-colors cursor-pointer"
                        title="Close preview and center categories"
                      >
                        ✕ Close
                      </button>
                    )}
                    <span className="text-[10px] font-mono text-[#e1dcc9]/40">
                      {repoCount} repos
                    </span>
                  </div>
                </div>

                {/* Scrollable File Tree: Restored to full size */}
                <div
                  className="custom-scrollbar h-[360px] md:h-[380px] max-h-[420px] overflow-y-auto overscroll-contain p-3.5"
                >
                  <Tree
                    elements={treeElements}
                    initialSelectedId={selectedProjectId}
                    initialExpandedItems={["root-repos"]}
                    onSelect={(id) => setSelectedProjectId(id)}
                  />
                </div>

                {/* Helper hint banner when no project is selected */}
                {!activeProject && (
                  <div className="border-t border-[rgba(225,188,120,0.12)] bg-[#17100a]/80 px-4 py-2.5 text-center text-[11px] font-mono tracking-wide text-[#e1dcc9]/55">
                    Click a category to open, then select any project to preview
                  </div>
                )}
              </div>
            </div>

            {/* 2. Devices Container: Appears smoothly on screen ONLY when a project is selected */}
            {activeProject && (
              <div
                className="relative lg:col-span-8 flex flex-col items-center justify-center w-full transition-opacity duration-500 ease-out animate-in fade-in"
              >
                {/* Device Selector Tabs: Laptop (Default) / Mobile */}
                <div className="mb-4 inline-flex items-center rounded-xl border border-[rgba(225,188,120,0.22)] bg-[#17100a]/92 p-1 shadow-[0_10px_25px_rgba(0,0,0,0.5)] backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("laptop")}
                    className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-mono text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                      previewMode === "laptop"
                        ? "bg-[#d8a05e] text-[#120c07] font-semibold shadow-[0_0_15px_rgba(216,160,94,0.35)]"
                        : "text-[#e1dcc9]/70 hover:text-white hover:bg-[rgba(216,160,94,0.1)]"
                    }`}
                  >
                    <Laptop className="h-3.5 w-3.5" />
                    <span>Laptop View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-mono text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                      previewMode === "mobile"
                        ? "bg-[#d8a05e] text-[#120c07] font-semibold shadow-[0_0_15px_rgba(216,160,94,0.35)]"
                        : "text-[#e1dcc9]/70 hover:text-white hover:bg-[rgba(216,160,94,0.1)]"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>iPhone View</span>
                  </button>
                </div>

                {/* Display Frame: EITHER Laptop OR iPhone (Separate, Never together) */}
                <div className="relative flex items-center justify-center w-full min-h-[250px] sm:min-h-[290px]">
                  {previewMode === "laptop" ? (
                    <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] xl:max-w-[540px] animate-in fade-in duration-300">
                      <MacbookPro url={activeProject.homepage} className="max-w-full" />
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center w-[160px] sm:w-[185px] md:w-[200px] animate-in fade-in duration-300">
                      <Iphone url={activeProject.homepage} className="w-full" />
                    </div>
                  )}
                </div>

                {/* Code and Live Preview Buttons Just Below the Active Device */}
                <div className="mt-4 flex items-center justify-center gap-3 w-full">
                  {activeProject.github && (
                    <a
                      href={activeProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 rounded-xl border border-[rgba(225,188,120,0.25)] bg-[#140e09]/92 px-4 py-2 text-[12px] font-mono font-medium text-[#e1dcc9] shadow-[0_8px_20px_rgba(0,0,0,0.55)] backdrop-blur-md transition-all duration-200 hover:border-[#d8a05e] hover:bg-[#d8a05e]/20 hover:text-white hover:shadow-[0_0_16px_rgba(216,160,94,0.25)] hover:-translate-y-0.5 cursor-pointer"
                      title="View GitHub Repository Source Code"
                    >
                      <GitHubIcon className="h-4 w-4 text-[#d8a05e] transition-transform duration-200 group-hover:scale-110" />
                      <span>Code</span>
                    </a>
                  )}

                  {activeProject.homepage && (
                    <a
                      href={activeProject.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 rounded-xl border border-[#d8a05e]/45 bg-[rgba(216,160,94,0.14)] px-4 py-2 text-[12px] font-mono font-medium text-[#f4efe0] shadow-[0_8px_20px_rgba(0,0,0,0.55),0_0_12px_rgba(216,160,94,0.12)] backdrop-blur-md transition-all duration-200 hover:border-[#d8a05e] hover:bg-[#d8a05e]/30 hover:text-white hover:shadow-[0_0_20px_rgba(216,160,94,0.35)] hover:-translate-y-0.5 cursor-pointer"
                      title="Open Live Preview in a New Tab"
                    >
                      <ExternalLink className="h-4 w-4 text-[#d8a05e] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      <span>Live Preview</span>
                    </a>
                  )}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;
