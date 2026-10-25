import { smoothScrollTo } from "../../utils/smoothScroll";
import Magnetic from "../ui/Magnetic";

const GITHUB_URL = "https://github.com/rohith10ty";
const LINKEDIN_URL = "https://www.linkedin.com/in/naidurohith/";
const INSTAGRAM_URL = "https://www.instagram.com/rohn.exe/";

export default function Footer() {
  const scrollToTop = () => {
    smoothScrollTo(0, { duration: 2.6 });
  };

  return (
    <footer
      className="
        relative
        z-[2]

        grid
        min-h-[88px]

        grid-cols-[1fr_auto]

        items-center

        gap-4

        px-[clamp(20px,5vw,90px)]
        py-[25px]

        text-[14px]
        text-[#E1DCC9]/55

        sm:grid-cols-[1fr_auto_1fr]
        sm:gap-7
      "
    >
      {/* =====================================================
          COPYRIGHT
      ===================================================== */}

      <span>© 2026 Rohith Naidu</span>

      {/* =====================================================
          SOCIAL LINKS

          Mobile:
          moves to second row.

          Desktop:
          stays exactly in the center column.
      ===================================================== */}

      <nav
        aria-label="Social links"
        className="
          col-span-2
          row-start-2

          flex
          items-center
          justify-start

          gap-6

          sm:col-auto
          sm:row-auto
          sm:justify-center
        "
      >
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="
            transition-colors
            duration-200

            hover:text-[#E1DCC9]

            focus-visible:text-[#E1DCC9]
            focus-visible:outline-none
          "
        >
          GitHub
        </a>

        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noreferrer"
          className="
            transition-colors
            duration-200

            hover:text-[#E1DCC9]

            focus-visible:text-[#E1DCC9]
            focus-visible:outline-none
          "
        >
          LinkedIn
        </a>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="
            transition-colors
            duration-200

            hover:text-[#E1DCC9]

            focus-visible:text-[#E1DCC9]
            focus-visible:outline-none
          "
        >
          Instagram
        </a>
      </nav>

      {/* =====================================================
          BACK TO TOP

          Magnetic creates NO extra layout wrapper
          if you're using the cloneElement version
          we created.

          Therefore justify-self-end works exactly
          like your original CSS.
      ===================================================== */}

      <Magnetic strength={0.5}>
        <button
          type="button"
          onClick={scrollToTop}
          className="
            justify-self-end

            border-0
            bg-transparent

            py-2

            text-[14px]
            text-[#A97942]

            transition-colors
            duration-200

            hover:text-[#E1DCC9]

            focus-visible:text-[#E1DCC9]
            focus-visible:outline-none

            cursor-pointer
          "
        >
          Back to top ↑
        </button>
      </Magnetic>
    </footer>
  );
}
