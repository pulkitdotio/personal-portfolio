export function SentinelPlaceholder() {
  return (
    <div className="project-placeholder sentinel-placeholder" aria-hidden="true">
      <svg className="sentinel-network" viewBox="0 0 800 420" fill="none">
        <defs>
          <linearGradient id="sentinel-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8f97ff" stopOpacity="0.12" />
            <stop offset="0.55" stopColor="#9da5ff" stopOpacity="0.7" />
            <stop offset="1" stopColor="#8f97ff" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d="M142 112 C250 112 274 210 386 210" stroke="url(#sentinel-line)" />
        <path d="M142 210 H386" stroke="url(#sentinel-line)" />
        <path d="M142 308 C250 308 274 210 386 210" stroke="url(#sentinel-line)" />
        <path d="M414 210 C520 210 548 143 664 143" stroke="url(#sentinel-line)" />
        <path d="M414 210 C520 210 548 279 664 279" stroke="url(#sentinel-line)" />
      </svg>

      <div className="probe-node probe-node--one">
        <span className="health-dot health-dot--good" />
        <small>US-E</small>
      </div>
      <div className="probe-node probe-node--two">
        <span className="health-dot health-dot--good" />
        <small>EU-W</small>
      </div>
      <div className="probe-node probe-node--three">
        <span className="health-dot health-dot--warn" />
        <small>AP-S</small>
      </div>

      <div className="service-node">
        <span className="service-pulse" />
        <small>API</small>
        <strong>200</strong>
      </div>

      <div className="incident-node">
        <span>01</span>
        <small>event</small>
      </div>

      <div className="latency-panel">
        <div className="metric-labels">
          <span>p50 <b>84</b></span>
          <span>p95 <b>142</b></span>
          <span>p99 <b>201</b></span>
        </div>
        <svg viewBox="0 0 250 72" fill="none" preserveAspectRatio="none">
          <path d="M0 55 C28 50 39 35 68 42 S112 62 143 35 S195 12 250 27" stroke="#8d96ff" />
          <path d="M0 67 H250" stroke="#ffffff" strokeOpacity="0.08" />
        </svg>
      </div>
    </div>
  );
}
