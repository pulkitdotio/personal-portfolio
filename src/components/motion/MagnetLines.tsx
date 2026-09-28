// Adapted from React Bits MagnetLines by David Haz.
// See public/licenses/react-bits.txt for the upstream license.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { useMotionPreferences } from "./MotionPreferences";

export function MagnetLines() {
  const ref = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(32);
  const rows = 8;
  const inView = useInView(ref);
  const { enabled, pageVisible } = useMotionPreferences();
  const active = enabled && pageVisible && inView;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      setColumns(Math.max(10, Math.round(entry.contentRect.width / 35)));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = ref.current;
    if (!container || !active) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;
    const lines = Array.from(
      container.querySelectorAll<HTMLSpanElement>("span"),
    );
    let frame = 0;
    let pointer = { x: 0, y: 0 };
    const update = () => {
      frame = 0;
      // One layout read for the entire grid, rather than one per line.
      const rect = container.getBoundingClientRect();
      const cellWidth = rect.width / columns;
      const cellHeight = rect.height / rows;
      lines.forEach((line, index) => {
        const x = rect.left + ((index % columns) + 0.5) * cellWidth;
        const y = rect.top + (Math.floor(index / columns) + 0.5) * cellHeight;
        const angle =
          (Math.atan2(pointer.y - y, pointer.x - x) * 180) / Math.PI;
        const previous = Number.parseFloat(
          line.style.getPropertyValue("--rotate"),
        );
        // A line is symmetric: take the shortest rotation to avoid a seam flip.
        const delta = ((((angle - previous + 90) % 180) + 180) % 180) - 90;
        line.style.setProperty("--rotate", `${previous + delta}deg`);
      });
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, [active, columns]);

  return (
    <div
      ref={ref}
      className="magnet-lines"
      data-active={active}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: rows * columns }, (_, index) => {
        const x = ((index % columns) + 0.5) / columns;
        const y = (Math.floor(index / columns) + 0.5) / rows;
        const angle =
          (Math.atan2((0.5 - y) * rows, (0.5 - x) * columns) * 180) / Math.PI;
        return (
          <span
            key={index}
            style={{ "--rotate": `${angle}deg` } as CSSProperties}
          />
        );
      })}
    </div>
  );
}
