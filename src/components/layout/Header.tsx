import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import Menu from "lucide-react/dist/esm/icons/menu.mjs";
import X from "lucide-react/dist/esm/icons/x.mjs";
import Pause from "lucide-react/dist/esm/icons/pause.mjs";
import Play from "lucide-react/dist/esm/icons/play.mjs";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right.mjs";
import feather from "../../assets/identity/feather.webp";
import { navigationItems } from "../../data/navigation";
import { profileViews } from "../../data/portfolio";
import { Container } from "./Container";
import { useMotionPreferences } from "../motion/MotionPreferences";

function ProfileViews({ className = "" }: { className?: string }) {
  return (
    <p className={`profile-views ${className}`}>
      <span className="profile-views-value">{profileViews.displayValue}</span>
      <span className="profile-views-label">Profile Views</span>
    </p>
  );
}

export function Header() {
  const { enabled, reduced, toggle } = useMotionPreferences();
  const { scrollYProgress } = useScroll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sections = navigationItems
      .map((item) => document.querySelector(item.href))
      .filter((section): section is Element => Boolean(section));
    const update = () => {
      let current: Element | undefined;
      let currentTop = -Infinity;
      for (const section of sections) {
        const top = section.getBoundingClientRect().top;
        // Equal positions keep the last section, matching the previous stable sort.
        if (top <= 180 && top >= currentTop) {
          current = section;
          currentTop = top;
        }
      }
      setActive(current ? "#" + current.id : "");
    };
    let frame = 0;
    const onScroll = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          update();
          frame = 0;
        });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  useEffect(() => {
    if (!isMenuOpen) return;
    const menuButton = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main, .site-footer, .skip-link, .brand-link",
      ),
    ).map((element) => ({ element, inert: element.inert }));
    background.forEach(({ element }) => {
      element.inert = true;
    });
    window.dispatchEvent(new Event("portfolio-menu-change"));
    menuRef.current
      ?.querySelector<HTMLAnchorElement>("a")
      ?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButton?.focus({ preventScroll: true });
      }
      if (event.key === "Tab") {
        const controls = [
          menuButtonRef.current,
          ...Array.from(
            menuRef.current?.querySelectorAll<HTMLElement>(
              "a[href], button:not([disabled])",
            ) ?? [],
          ),
        ].filter((el): el is HTMLElement => Boolean(el));
        const first = controls[0],
          last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (
          (!event.shiftKey && document.activeElement === last) ||
          !controls.includes(document.activeElement as HTMLElement)
        ) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      background.forEach(({ element, inert }) => {
        element.inert = inert;
      });
      menuButton?.focus({ preventScroll: true });
      window.dispatchEvent(new Event("portfolio-menu-change"));
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);
  const closeMenu = (href: string) => {
    setIsMenuOpen(false);
    // Move keyboard focus into the selected section after the overlay closes.
    requestAnimationFrame(() => {
      const section = document.querySelector<HTMLElement>(href);
      section?.setAttribute("tabindex", "-1");
      section?.focus({ preventScroll: true });
    });
  };
  return (
    <header className="site-header">
      <div
        className="navigation-dialog"
        role={isMenuOpen ? "dialog" : undefined}
        aria-modal={isMenuOpen ? true : undefined}
        aria-label={isMenuOpen ? "Navigation menu" : undefined}
      >
        <Container className="header-inner">
          <a
            className="brand-link"
            href="#top"
            aria-label="Pulkit - back to top"
          >
            <img src={feather} alt="" width="30" height="30" />
            <span>
              pulkit<span className="brand-dot">.</span>
            </span>
          </a>
          <div className="header-controls">
            <ProfileViews className="header-profile-views" />
            <button
              ref={menuButtonRef}
              className="menu-button icon-button"
              type="button"
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMenuOpen}
              aria-controls="site-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? (
                <X aria-hidden="true" />
              ) : (
                <Menu aria-hidden="true" />
              )}
            </button>
          </div>
        </Container>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="navigation-menu-shell"
              id="site-navigation"
              ref={menuRef}
              data-lenis-prevent
              initial={enabled ? { opacity: 0, y: -8 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="navigation-menu-inner">
                <div className="menu-intro">
                  <p className="menu-eyebrow">Pulkit Sharma / Portfolio</p>
                  <p className="menu-title">
                    A little more
                    <br />
                    about my work.
                  </p>
                  <ProfileViews className="menu-profile-views" />
                </div>
                <nav className="menu-nav" aria-label="Primary navigation">
                  {navigationItems.map((item, index) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => closeMenu(item.href)}
                      aria-current={
                        active === item.href ? "location" : undefined
                      }
                    >
                      <span className="menu-link-index" aria-hidden="true">
                        0{index + 1}
                      </span>
                      {item.label}
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  ))}
                </nav>
                <div className="menu-footer">
                  <p>Based in India &middot; Open to opportunities</p>
                  <button
                    className="motion-toggle"
                    type="button"
                    onClick={toggle}
                    disabled={reduced}
                    aria-label={
                      reduced
                        ? "Animations disabled by system preference"
                        : enabled
                          ? "Pause animations"
                          : "Resume animations"
                    }
                  >
                    {enabled ? (
                      <Pause aria-hidden="true" />
                    ) : (
                      <Play aria-hidden="true" />
                    )}
                    <span>
                      {reduced
                        ? "System reduced motion"
                        : enabled
                          ? "Pause animations"
                          : "Resume animations"}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        className="reading-progress"
        style={{ scaleX: scrollYProgress }}
      />
    </header>
  );
}
