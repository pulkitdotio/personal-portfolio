import { useEffect, useRef } from "react";
import { useMotionPreferences } from "./MotionPreferences";
type Particle = { x: number; y: number; depth: number; phase: number };
// Original Canvas implementation inspired by OriginKit's Particle Drift behavior.
export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const time = useRef(0);
  const { enabled, pageVisible } = useMotionPreferences();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;
    let width = 0,
      height = 0,
      raf = 0,
      previous = 0;
    const pointer = { x: -1000, y: -1000 };
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const active = enabled && pageVisible;
    const draw = (dt: number) => {
      time.current += dt;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles.current) {
        p.y = (p.y - (dt * (3 + p.depth * 8)) / height + 1) % 1;
        p.x = (p.x + (dt * (1 + p.depth * 2)) / width) % 1;
        let x = p.x * width + Math.sin(time.current * 0.15 + p.phase) * 8;
        let y = p.y * height;
        const dx = x - pointer.x,
          dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (active && fine.matches && distance < 120 && distance > 0) {
          const force = (1 - distance / 120) * 12;
          x += (dx / distance) * force;
          y += (dy / distance) * force;
        }
        const center = Math.abs(x / width - 0.5) * 2;
        const alpha =
          (0.22 + p.depth * 0.36) *
          (0.65 + center * 0.35) *
          (0.88 + Math.sin(time.current * 0.5 + p.phase) * 0.12);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.55 + p.depth * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 768 ? 40 : 90;
      while (particles.current.length < count)
        particles.current.push({
          x: Math.random(),
          y: Math.random(),
          depth: Math.random(),
          phase: Math.random() * Math.PI * 2,
        });
      particles.current.length = count;
      draw(0);
    };
    const tick = (now: number) => {
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      // Slow drift needs only 30 draws per second, leaving room for video decoding.
      if (!previous || now - previous >= 1000 / 30) {
        previous = now;
        draw(dt);
      }
      raf = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const leave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };
    resize();
    window.addEventListener("resize", resize);
    if (active) {
      raf = requestAnimationFrame(tick);
      if (fine.matches) {
        window.addEventListener("pointermove", move, { passive: true });
        document.addEventListener("pointerleave", leave);
      }
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled, pageVisible]);
  return (
    <canvas
      ref={canvasRef}
      className="particle-background"
      aria-hidden="true"
      data-running={enabled && pageVisible}
    />
  );
}
