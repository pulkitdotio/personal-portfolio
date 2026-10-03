import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import Menu from "lucide-react/dist/esm/icons/menu.mjs";
import X from "lucide-react/dist/esm/icons/x.mjs";
import Pause from "lucide-react/dist/esm/icons/pause.mjs";
import Play from "lucide-react/dist/esm/icons/play.mjs";
import feather from "../../assets/identity/feather.webp";
import { navigationItems } from "../../data/navigation";
import { Container } from "./Container";
import { useMotionPreferences } from "../motion/MotionPreferences";

export function Header() {
  const { enabled, reduced, toggle } = useMotionPreferences();
  const { scrollYProgress } = useScroll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new Event("portfolio-menu-change"));
    mobileMenuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === "Tab") {
        const controls = [
          menuButtonRef.current,
          ...Array.from(
            mobileMenuRef.current?.querySelectorAll<HTMLAnchorElement>(
              "a[href]",
            ) ?? [],
          ),
        ].filter((el): el is HTMLButtonElement | HTMLAnchorElement =>
          Boolean(el),
        );
        const first = controls[0],
          last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.dispatchEvent(new Event("portfolio-menu-change"));
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
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
      <Container className="header-inner">
        <a className="brand-link" href="#top" aria-label="Pulkit - back to top">
          <img src={feather} alt="" width="30" height="30" />
          <span>
            pulkit<span className="brand-dot">.</span>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "location" : undefined}
            >
              {item.label}
              {active === item.href && (
                <motion.span
                  layoutId={enabled ? "active-nav" : undefined}
                  className="nav-active-dot"
                />
              )}
            </a>
          ))}
        </nav>
        <div className="header-controls">
          <button
            className="motion-toggle icon-button"
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
            title={
              reduced
                ? "Reduced motion is enabled on your device"
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
          </button>
          <button
            ref={menuButtonRef}
            className="menu-button icon-button"
            type="button"
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
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
      <motion.div
        className="reading-progress"
        style={{ scaleX: scrollYProgress }}
      />
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu-shell"
            id="mobile-navigation"
            ref={mobileMenuRef}
            initial={enabled ? { opacity: 0, y: -8 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="mobile-nav" aria-label="Mobile navigation">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => closeMenu(item.href)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <p className="mobile-menu-caption">
              Pulkit Sharma &middot; Full Stack Developer
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
