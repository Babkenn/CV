import type { SVGProps } from "react";

/** Desk scene: table with legs, monitor on stand, cup of tea */
export function DevSceneSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 130"
      fill="none"
      aria-hidden
      {...props}
    >
      <defs>
        <linearGradient id="dev-table-top" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="dev-table-leg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="dev-tea-liquid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4a574" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
        <linearGradient id="dev-cup-ceramic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="30%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>

      {/* Table legs – left and right only (no center legs) */}
      <rect x="18" y="88" width="14" height="42" rx="2" fill="url(#dev-table-leg)" stroke="rgba(148,163,184,0.35)" strokeWidth="0.8" />
      <rect x="148" y="88" width="14" height="42" rx="2" fill="url(#dev-table-leg)" stroke="rgba(148,163,184,0.35)" strokeWidth="0.8" />

      {/* Table top */}
      <rect x="0" y="76" width="180" height="14" rx="3" fill="url(#dev-table-top)" stroke="rgba(148,163,184,0.4)" strokeWidth="1" />

      {/* Monitor stand: base on table + neck (moved up so base sits on table) */}
      <rect x="76" y="76" width="28" height="8" rx="2" fill="#334155" stroke="rgba(148,163,184,0.5)" strokeWidth="0.8" />
      <rect x="84" y="70" width="12" height="8" fill="#475569" stroke="rgba(148,163,184,0.4)" strokeWidth="0.6" />

      {/* Monitor on stand */}
      <rect x="58" y="22" width="64" height="48" rx="4" fill="#1e293b" stroke="rgba(148,163,184,0.5)" strokeWidth="1.5" />
      <rect x="62" y="26" width="56" height="40" rx="2" fill="#0f172a" className="dev-svg-screen" />

      {/* Cup of tea on table */}
      <g className="dev-svg-tea">
        <path d="M 132 68 L 150 68 L 148 84 L 134 84 Z" fill="url(#dev-cup-ceramic)" stroke="#94a3b8" strokeWidth="0.8" />
        <ellipse cx="141" cy="84" rx="8" ry="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.6" />
        <path d="M 132 68 L 150 68" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" fill="none" />
        <ellipse cx="141" cy="69" rx="8.5" ry="2" fill="url(#dev-tea-liquid)" />
        <path d="M 150 70 Q 159 73 150 80" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 150 70 Q 159 73 150 80" stroke="url(#dev-cup-ceramic)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* Smoke / steam on top of cup (moved a little higher) */}
        <path d="M 133 62 Q 135 58 138 62" stroke="rgba(248,250,252,0.55)" strokeWidth="0.9" fill="none" className="dev-svg-steam" />
        <path d="M 137 61 Q 141 56 145 61" stroke="rgba(248,250,252,0.5)" strokeWidth="0.85" fill="none" className="dev-svg-steam" />
        <path d="M 142 62 Q 144 58 148 62" stroke="rgba(248,250,252,0.5)" strokeWidth="0.85" fill="none" className="dev-svg-steam" />
        <path d="M 136 59 Q 141 54 146 59" stroke="rgba(248,250,252,0.4)" strokeWidth="0.75" fill="none" className="dev-svg-steam" />
        <path d="M 140 60 Q 142 56 147 60" stroke="rgba(248,250,252,0.45)" strokeWidth="0.8" fill="none" className="dev-svg-steam" />
      </g>
    </svg>
  );
}
