import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useMotionPreferences } from "./MotionPreferences";

export function SmoothScroll() {
  const { enabled } = useMotionPreferences();
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: true,
      anchors: false,
    });
    let frame = 0;
    const gate = () => {
      if (document.hidden || document.body.style.overflow === "hidden")
        lenis.stop();
      else lenis.start();
    };
    const refresh = () => {
      lenis.resize();
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    };
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!link || link.target || link.hasAttribute("download")) return;
      const hash = link.getAttribute("href")!;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      if (location.hash !== hash) history.pushState(null, "", hash);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // React has closed the mobile menu and released the body lock by now.
        gate();
        lenis.resize();
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        // Lenis reads the same CSS scroll-padding and scroll-margin as native anchors.
        lenis.scrollTo(target);
      });
    };
    const onHistory = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const target = document.getElementById(location.hash.slice(1));
        lenis.resize();
        if (target) lenis.scrollTo(target, { immediate: true, force: true });
        else refresh();
      });
    };
    document.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", gate);
    window.addEventListener("portfolio-menu-change", gate);
    window.addEventListener("portfolio-layout-change", refresh);
    window.addEventListener("popstate", onHistory);
    gate();
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", gate);
      window.removeEventListener("portfolio-menu-change", gate);
      window.removeEventListener("portfolio-layout-change", refresh);
      window.removeEventListener("popstate", onHistory);
      lenis.destroy();
    };
  }, [enabled]);
  return null;
}
