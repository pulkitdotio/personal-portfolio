// Adapted from OriginKit Vector Wordmark (base), retrieved 2026-09-28.
// https://www.originkit.dev/components/vector-wordmark?preset=base
// Original atlas/shader and three-handle lattice; portfolio lifecycle and layout adaptations.
import { useEffect, useRef, type CSSProperties } from "react";

const MAX_DPR = 1.5;
const MAX_TEX = 4096;

// --- OriginKit effect constants -----------------------------------------
const HANDLES = 3; // the source builds exactly three
const CELL_ASPECT = 0.6; // 0.15 / 0.25 — cell height as a fraction of its width
const DRIFT_X = 0.08; // fraction of a cell
const DRIFT_Y = 0.04;
const DRIFT_RATE = 1.3; // radians/sec at Speed 50 (source: t_ms * 0.0013)
const DRIFT_RATE_Y = 1.3 * 1.3;
const SWEEP_RATE = 0.5; // uv/sec at Speed 50
// The source parks its no-pointer sweep at uv.y 0.15 of a frame whose atlas
// occupies 0..0.54 — 28% up the wordmark, through the x-height. Centred, that
// has to be derived from where the wordmark actually is, or the sweep runs
// along empty space below it.
const SWEEP_BAND = 0.28;
const RESNAP = 0.2; // seconds between lattice re-snaps while sweeping
const DAMP_REF = 20; // Damping 100 -> lerp rate 20/sec; the source's 7 is 35
const SPEED_REF = 50;
const DOT_DIAMETER = 4 / 440; // measured off the reference atlas
const DOT_PITCH = 12 / 440;

const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
const fract = (x: number) => x - Math.floor(x);

// --- colour --------------------------------------------------------------
type RGBA = [number, number, number, number];

/**
 * ControlType.Color emits rgb()/rgba()/hsl()/hsla() and var(--token, value) as
 * well as hex, so a hex-only parse leaves the dial looking dead.
 */
function parseColor(input: string | undefined, fallback: RGBA): RGBA {
  if (!input) return fallback;
  let s = String(input).trim();
  if (s.slice(0, 4).toLowerCase() === "var(") {
    const comma = s.indexOf(",");
    const close = s.lastIndexOf(")");
    if (comma < 0 || close < comma) return fallback;
    s = s.slice(comma + 1, close).trim();
  }
  if (s[0] === "#") {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4) {
      let x = "";
      for (const c of h) x += c + c;
      h = x;
    }
    if (h.length === 6) h += "ff";
    if (h.length !== 8 || /[^0-9a-f]/i.test(h)) return fallback;
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255,
      parseInt(h.slice(6, 8), 16) / 255,
    ];
  }
  const m = s.match(/^(rgba?|hsla?)\(([^)]*)\)$/i);
  if (!m) return fallback;
  const parts = m[2].split(/[\s,/]+/).filter((p) => p.length > 0);
  if (parts.length < 3) return fallback;
  const num = (t: string, scale: number) => {
    const v = parseFloat(t);
    if (!Number.isFinite(v)) return 0;
    return t.indexOf("%") >= 0 ? (v / 100) * scale : v;
  };
  const alpha = parts.length > 3 ? clamp(num(parts[3], 1), 0, 1) : 1;
  if (m[1].toLowerCase().slice(0, 3) === "rgb") {
    return [
      clamp(num(parts[0], 255) / 255, 0, 1),
      clamp(num(parts[1], 255) / 255, 0, 1),
      clamp(num(parts[2], 255) / 255, 0, 1),
      alpha,
    ];
  }
  const hh = fract(parseFloat(parts[0]) / 360);
  const sat = clamp(num(parts[1], 1), 0, 1);
  const li = clamp(num(parts[2], 1), 0, 1);
  const q = li < 0.5 ? li * (1 + sat) : li + sat - li * sat;
  const p = 2 * li - q;
  const chan = (t: number) => {
    const u = fract(t);
    if (u < 1 / 6) return p + (q - p) * 6 * u;
    if (u < 1 / 2) return q;
    if (u < 2 / 3) return p + (q - p) * (2 / 3 - u) * 6;
    return p;
  };
  return [chan(hh + 1 / 3), chan(hh), chan(hh - 1 / 3), alpha];
}

// --- GL ------------------------------------------------------------------
const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;

uniform sampler2D uMap;
uniform vec2 uRes;      // host box, css px
uniform vec2 uAtlas;    // drawn wordmark size, css px
uniform vec2 uPtr;      // eased pointer, screen uv
uniform float uReach;   // reveal radius, as a fraction of the host width
uniform vec3 uText;
uniform vec3 uShade;
uniform vec4 uAccent;   // rig colour; its alpha IS the rig intensity
uniform vec2 uV0;
uniform vec2 uV1;
uniform vec2 uV2;
uniform float uHalf;    // handle half-side, in y-normalised units

varying vec2 vUv;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// The source's blur: taps on a ring at even angles, each pushed out by a
// random amount, so six taps read as a soft disc rather than a hexagon.
vec2 blurRG(vec2 uv, float e) {
    vec4 sum = vec4(0.0);
    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float th = radians(fi / 6.0 * 360.0);
        vec2 dir = vec2(cos(th), sin(th));
        vec2 off = dir * (hash(vec2(fi, uv.x + uv.y)) + e);
        sum += texture2D(uMap, uv + off * e);
    }
    return (sum / 6.0).rg;
}

// Perpendicular distance to a segment, plus the parameter along it — the
// parameter is what the dash pattern runs on.
vec2 segment(vec2 p, vec2 a, vec2 b) {
    vec2 ab = b - a;
    vec2 ap = p - a;
    float t = clamp(dot(ap, ab) / max(dot(ab, ab), 1e-8), 0.0, 1.0);
    return vec2(length(ap - ab * t), t);
}

// smoothstep with edge0 > edge1 is UNDEFINED in GLSL — the source's node
// graph writes it that way and gets away with it, raw GLSL does not, and the
// whole rig silently renders nothing. Written as 1 - smoothstep(lo, hi, x).
float stroke(float d, float lw, float px) {
    return 1.0 - smoothstep(lw, lw + px, d);
}

float dashedLine(vec2 p, vec2 a, vec2 b, float lw, float px) {
    vec2 s = segment(p, a, b);
    float dash = step(0.5, fract(s.y * length(b - a) * 100.0));
    return stroke(s.x, lw, px) * dash;
}

float boxEdge(vec2 p, vec2 c, float h, float lw, float px) {
    vec2 q = abs(p - c) - vec2(h);
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    return stroke(abs(d), lw, px);
}

void main() {
    float aspect = uRes.x / uRes.y;

    // Centred on both axes.
    vec2 E = (vUv * uRes - (uRes - uAtlas) * 0.5) / uAtlas;
    float inside = step(0.0, E.x) * step(E.x, 1.0) * step(0.0, E.y) * step(E.y, 1.0);
    vec2 safeUv = clamp(E, 0.0, 1.0);

    float b = clamp(1.0 - E.y * 3.5, 0.0, 1.0) * 0.008;
    vec2 soft = blurRG(safeUv, b);
    vec2 sharp = blurRG(safeUv, b * 0.1);

    float d = length((vUv - uPtr) / vec2(1.0, aspect));
    // Retain a little more solid lettering: 10% less shadow/reveal intensity.
    float k = 0.9 * (1.0 - pow(smoothstep(0.0, max(uReach, 1e-4), d), 3.0));

    float mask = mix(soft.r, sharp.g, k) * inside;
    vec3 fill = mix(uShade, uText, smoothstep(0.0, 1.0, E.y));

    // Rig space: x scaled by aspect so a cell and a handle stay square.
    vec2 P = vec2(vUv.x * aspect, vUv.y);
    float px = 1.0 / uRes.y;
    float lw = px * 0.2;
    float lines = max(
        max(dashedLine(P, uV0, uV1, lw, px), dashedLine(P, uV1, uV2, lw, px)),
        dashedLine(P, uV2, uV0, lw, px)
    );
    float boxes = max(
        max(boxEdge(P, uV0, uHalf, lw, px), boxEdge(P, uV1, uHalf, lw, px)),
        boxEdge(P, uV2, uHalf, lw, px)
    );
    float A = max(lines, boxes) * uAccent.a * (1.0 - vUv.y);

    // Everything premultiplied from here, so the canvas composites cleanly
    // over the root background instead of fringing.
    vec4 card = vec4(fill * mask, mask);
    vec4 comp = vec4(uAccent.rgb * A, A) + card * (1.0 - A);

    // The source melts the wordmark's foot into the page by mixing toward an
    // 80%-opaque plate of the background colour. Bottom-anchored that plate
    // sat on the frame edge and was invisible; centred it would be a band of
    // flat colour under the wordmark. Fading the PREMULTIPLIED composite is
    // algebraically the same result over a background-coloured root — check
    // it at any weight — and needs no plate, so the background colour is now
    // only ever the root's CSS background.
    gl_FragColor = comp * mix(0.48, 1.0, pow(clamp(E.y, 0.0, 1.0), 0.7));
}`;

function compile(gl: WebGLRenderingContext) {
  const shaders: WebGLShader[] = [];
  const program = gl.createProgram();
  if (!program) return null;
  for (const [type, source] of [
    [gl.VERTEX_SHADER, VERT],
    [gl.FRAGMENT_SHADER, FRAG],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) {
      gl.deleteProgram(program);
      return null;
    }
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.bindAttribLocation(program, 0, "aPos");
  gl.linkProgram(program);
  const valid = gl.getProgramParameter(program, gl.LINK_STATUS);
  for (const shader of shaders) {
    gl.detachShader(program, shader);
    gl.deleteShader(shader);
  }
  if (!valid) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

type HandleGroup = { size: number; spread: number; labels: boolean };
interface VectorWordmarkProps {
  text?: string;
  mobileLines?: string[];
  font?: CSSProperties;
  background?: string;
  textColor?: string;
  shade?: string;
  accent?: string;
  reach?: number;
  speed?: number;
  damping?: number;
  handles?: Partial<HandleGroup>;
  style?: CSSProperties;
  enabled?: boolean;
  visible?: boolean;
}

// Retains OriginKit's red fill / green dotted-outline atlas, now fitted to
// measured glyph bounds and supporting multiple centered lines in one texture.
function buildAtlas(
  lines: string[],
  font: CSSProperties,
  width: number,
  height: number,
  dpr: number,
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const family = font.fontFamily || '"Manrope Variable", sans-serif';
  const setFont = (px: number) => {
    ctx.font = `${font.fontStyle || "normal"} ${font.fontWeight || 800} ${px}px ${family}`;
    ctx.letterSpacing = String(font.letterSpacing || "-0.035em");
  };
  setFont(100);
  const metrics = lines.map((line) => ctx.measureText(line));
  const measureWidth = Math.max(
    ...metrics.map((m) =>
      Math.max(m.width, m.actualBoundingBoxLeft + m.actualBoundingBoxRight),
    ),
  );
  const px = Math.min(
    (width * 0.77) / (measureWidth / 100 + 0.24),
    (height * 0.7) / (lines.length * 1.04),
    (Number.parseFloat(String(font.fontSize || 1000)) * 0.82 * width) / 1200,
  );
  const ratio = Math.min(dpr, MAX_TEX / Math.max(width, height));
  const fpx = px * ratio;
  const pad = fpx * 0.12;
  setFont(fpx);
  const measured = lines.map((line) => ctx.measureText(line));
  const ascent = Math.max(...measured.map((m) => m.actualBoundingBoxAscent));
  const descent = Math.max(...measured.map((m) => m.actualBoundingBoxDescent));
  const lineHeight = fpx * 1.04;
  canvas.width = Math.ceil(
    Math.max(
      ...measured.map((m) =>
        Math.max(m.width, m.actualBoundingBoxLeft + m.actualBoundingBoxRight),
      ),
    ) +
      pad * 2,
  );
  canvas.height = Math.ceil(
    ascent + descent + pad * 2 + (lines.length - 1) * lineHeight,
  );
  setFont(fpx);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1, (ascent + descent) * DOT_DIAMETER);
  ctx.setLineDash([0, Math.max(2, (ascent + descent) * DOT_PITCH)]);
  lines.forEach((line, index) => {
    const y = pad + ascent + index * lineHeight;
    ctx.fillStyle = "#ff0000";
    ctx.fillText(line, canvas.width / 2, y);
    ctx.strokeStyle = "#00ff00";
    ctx.strokeText(line, canvas.width / 2, y);
  });
  return { canvas, width: canvas.width / ratio, height: canvas.height / ratio };
}

export default function VectorWordmark({
  text = "VECTOR",
  mobileLines,
  font = {},
  background = "transparent",
  textColor = "#f5f5f5",
  shade = "#a0a0a0",
  accent = "#ffffff88",
  reach = 230,
  speed = 16,
  damping = 60,
  handles,
  style,
  enabled = true,
  visible = true,
}: VectorWordmarkProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const live = useRef({
    text,
    mobileLines,
    font,
    textColor: parseColor(textColor, [1, 1, 1, 1]),
    shade: parseColor(shade, [0.5, 0.5, 0.5, 1]),
    accent: parseColor(accent, [1, 1, 1, 0.5]),
    reach,
    speed,
    damping,
    handles,
    enabled,
    visible,
  });
  const refresh = useRef<() => void>(() => {});
  useEffect(() => {
    live.current = {
      text,
      mobileLines,
      font,
      textColor: parseColor(textColor, [1, 1, 1, 1]),
      shade: parseColor(shade, [0.5, 0.5, 0.5, 1]),
      accent: parseColor(accent, [1, 1, 1, 0.5]),
      reach,
      speed,
      damping,
      handles,
      enabled,
      visible,
    };
    refresh.current();
  }, [
    text,
    mobileLines,
    font,
    textColor,
    shade,
    accent,
    reach,
    speed,
    damping,
    handles,
    enabled,
    visible,
  ]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    // GLSL 1.00 matches the original shader. No WebGL2-only dependency.
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
    });
    if (!gl) return;
    const program = compile(gl);
    if (!program) return;
    const uniforms = Object.fromEntries(
      [
        "uMap",
        "uRes",
        "uAtlas",
        "uPtr",
        "uReach",
        "uText",
        "uShade",
        "uAccent",
        "uV0",
        "uV1",
        "uV2",
        "uHalf",
      ].map((key) => [key, gl.getUniformLocation(program, key)]),
    );
    const quad = gl.createBuffer();
    const texture = gl.createTexture();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    let alive = true,
      lost = false,
      inView = false,
      dirty = true;
    let width = 1,
      height = 1,
      atlasWidth = 1,
      atlasHeight = 1;
    let raf = 0,
      last = 0,
      drift = 0,
      sweepClock = 0,
      hasPointer = false;
    const target = { x: -0.5, y: 0.5 },
      eased = { ...target };
    const cells = Array.from({ length: HANDLES }, () => ({ x: -0.5, y: 0.5 }));
    const verts = cells.map((cell) => ({ ...cell }));
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let touchRelease: ReturnType<typeof setTimeout> | undefined;

    function sync() {
      if (!dirty || !host || !canvas || !gl) return;
      dirty = false;
      width = Math.max(1, host.clientWidth);
      height = Math.max(1, host.clientHeight);
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const L = live.current;
      const lines =
        window.innerWidth < 768 && L.mobileLines ? L.mobileLines : [L.text];
      const atlas = buildAtlas(lines, L.font, width, height, dpr);
      if (!atlas) return;
      atlasWidth = atlas.width;
      atlasHeight = atlas.height;
      host.dataset.lines = String(lines.length);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        atlas.canvas,
      );
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    }
    function snap(x: number, y: number, cw: number, ch: number) {
      const cx = Math.floor(x / cw),
        cy = Math.floor(y / ch);
      const found: { x: number; y: number; d: number }[] = [];
      for (let i = -1; i <= 1; i++)
        for (let j = -1; j <= 1; j++) {
          const px = (cx + i + 0.5) * cw,
            py = (cy + j + 0.5) * ch;
          found.push({ x: px, y: py, d: Math.hypot(px - x, py - y) });
        }
      found.sort((a, b) => a.d - b.d);
      for (let i = 0; i < HANDLES; i++) {
        cells[i].x = found[i + 1].x;
        cells[i].y = found[i + 1].y;
      }
    }
    function draw(dt: number) {
      if (!gl || !canvas || !host || lost) return;
      sync();
      const L = live.current,
        aspect = width / height;
      const cw = Math.max(0.01, (L.handles?.spread ?? 20) / 100),
        ch = cw * CELL_ASPECT;
      const rate = Math.max(0, L.speed) / SPEED_REF;
      if (!hasPointer) {
        target.x += dt * SWEEP_RATE * rate;
        target.y =
          (1 - atlasHeight / height) / 2 + (SWEEP_BAND * atlasHeight) / height;
        if (target.x > 1.5) {
          target.x = -0.5;
          eased.x = -0.5;
        }
        sweepClock += dt;
        if (sweepClock >= RESNAP) {
          snap(target.x * aspect, target.y, cw, ch);
          sweepClock = 0;
        }
      } else snap(target.x * aspect, target.y, cw, ch);
      const damp = clamp((L.damping / 100) * DAMP_REF * dt, 0, 1);
      eased.x += (target.x - eased.x) * damp;
      eased.y += (target.y - eased.y) * damp;
      drift += dt * rate;
      verts.forEach((v, i) => {
        const c = cells[i],
          sx = Math.round(c.x / cw - 0.5),
          sy = Math.round(c.y / ch - 0.5);
        const h1 = fract(Math.sin(sx * 127.1 + sy * 311.7) * 43758.5453);
        const h2 = fract(Math.sin(sx * 269.5 + sy * 183.3) * 43758.5453);
        v.x =
          c.x + DRIFT_X * cw * Math.sin(drift * DRIFT_RATE + h1 * Math.PI * 2);
        v.y =
          c.y +
          DRIFT_Y * ch * Math.sin(drift * DRIFT_RATE_Y + h2 * Math.PI * 2);
        const label = labelRefs.current[i];
        if (label) {
          const labelOffset = (L.handles?.size ?? 18) / 2 + 6;
          const labelX = clamp(
            (v.x / aspect) * width + labelOffset,
            4,
            Math.max(4, width - 68),
          );
          const labelY = clamp(
            (1 - v.y) * height + labelOffset,
            4,
            Math.max(4, height - 20),
          );
          label.style.visibility =
            v.x < 0 || v.x > aspect || v.y < 0 || v.y > 1
              ? "hidden"
              : "visible";
          label.style.transform = `translate(${labelX}px, ${labelY}px)`;
          label.textContent = `${Math.round((v.x / aspect) * 100)}, ${Math.round(v.y * 100)}`;
        }
      });
      const tc = L.textColor,
        sc = L.shade,
        ac = L.accent;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uniforms.uMap, 0);
      gl.uniform2f(uniforms.uRes, width, height);
      gl.uniform2f(uniforms.uAtlas, atlasWidth, atlasHeight);
      gl.uniform2f(uniforms.uPtr, eased.x, eased.y);
      // Radius scales by sqrt(1.1) for 10% more reveal area, including mobile.
      gl.uniform1f(
        uniforms.uReach,
        (Math.min(L.reach, width * 0.27) * Math.sqrt(1.1)) / width,
      );
      gl.uniform3f(uniforms.uText, tc[0], tc[1], tc[2]);
      gl.uniform3f(uniforms.uShade, sc[0], sc[1], sc[2]);
      gl.uniform4f(uniforms.uAccent, ac[0], ac[1], ac[2], ac[3]);
      verts.forEach((v, i) => gl.uniform2f(uniforms[`uV${i}`], v.x, v.y));
      gl.uniform1f(uniforms.uHalf, (L.handles?.size ?? 18) / 2 / height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      host.dataset.ready = "true";
    }
    function active() {
      return (
        alive &&
        !lost &&
        inView &&
        live.current.enabled &&
        live.current.visible &&
        !document.hidden
      );
    }
    function frame(now: number) {
      raf = 0;
      if (!active()) return;
      draw(last ? Math.min(0.05, (now - last) / 1000) : 0);
      last = now;
      raf = requestAnimationFrame(frame);
    }
    function gate() {
      if (!host) return;
      host.dataset.running = String(active());
      if (active()) {
        if (!raf) {
          last = 0;
          raf = requestAnimationFrame(frame);
        }
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }
    const invalidate = () => {
      dirty = true;
      gate();
    };
    refresh.current = invalidate;
    const onMove = (event: PointerEvent) => {
      if (!active() || (!finePointer.matches && event.pointerType !== "touch"))
        return;
      clearTimeout(touchRelease);
      const rect = host.getBoundingClientRect();
      target.x = (event.clientX - rect.left) / rect.width;
      target.y = 1 - (event.clientY - rect.top) / rect.height;
      hasPointer = true;
    };
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      hasPointer = false;
    };
    const onTouchEnd = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      clearTimeout(touchRelease);
      // A tap briefly reveals the rig. Native vertical scrolling stays available;
      // a cancelled scroll gesture immediately returns to the automatic sweep.
      if (event.type === "pointercancel") hasPointer = false;
      else
        touchRelease = setTimeout(() => {
          hasPointer = false;
        }, 750);
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      host.dataset.ready = "false";
      gate();
    };
    // Keep the static fallback after a lost context; a remount can initialize a fresh one.
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      gate();
    });
    const resizeObserver = new ResizeObserver(invalidate);
    observer.observe(host);
    resizeObserver.observe(host);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onMove, { passive: true });
    host.addEventListener("pointerup", onTouchEnd, { passive: true });
    host.addEventListener("pointercancel", onTouchEnd, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", gate);
    document.fonts.ready.then(() => {
      if (alive) invalidate();
    });
    document.fonts.addEventListener("loadingdone", invalidate);
    return () => {
      alive = false;
      gate();
      refresh.current = () => {};
      observer.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onMove);
      host.removeEventListener("pointerup", onTouchEnd);
      host.removeEventListener("pointercancel", onTouchEnd);
      host.removeEventListener("pointerleave", onLeave);
      clearTimeout(touchRelease);
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", gate);
      document.fonts.removeEventListener("loadingdone", invalidate);
      gl.deleteTexture(texture);
      gl.deleteBuffer(quad);
      gl.deleteProgram(program);
      host.dataset.ready = "false";
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="vector-wordmark"
      aria-hidden="true"
      data-enabled={enabled}
      style={{ background, ...style }}
    >
      <div
        className="wordmark-fallback"
        style={{ fontFamily: font.fontFamily, fontWeight: font.fontWeight }}
      >
        <span className="wordmark-desktop">{text}</span>
        <span className="wordmark-mobile">
          {(mobileLines || [text]).map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </span>
      </div>
      <canvas ref={canvasRef} />
      {handles?.labels &&
        [0, 1, 2].map((i) => (
          <span
            key={i}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="wordmark-coordinate"
          />
        ))}
    </div>
  );
}
