/**
 * Stand-ins for the soft grey 3D pieces in the hero reference (plus, map pin,
 * thumbs-up). They're plain SVG with grey gradients so the page works with no
 * extra assets. Replace any of them with your own renders via `decor` in
 * src/config.js.
 */

const GREYS = (
  <>
    <stop offset="0" stopColor="#d4d4d9" />
    <stop offset="0.55" stopColor="#97979e" />
    <stop offset="1" stopColor="#6f6f76" />
  </>
);

const SHADOW = (id) => (
  <filter id={id} x="-30%" y="-30%" width="160%" height="170%">
    <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#09090b" floodOpacity="0.2" />
  </filter>
);

export function Plus3D({ className }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="plus-g" x1="0" y1="0" x2="1" y2="1">{GREYS}</linearGradient>
        {SHADOW('plus-s')}
      </defs>
      <g filter="url(#plus-s)">
        <rect x="42" y="8" width="36" height="104" rx="18" fill="url(#plus-g)" />
        <rect x="8" y="42" width="104" height="36" rx="18" fill="url(#plus-g)" />
      </g>
      <g fill="#fff" opacity="0.28">
        <rect x="48" y="13" width="9" height="38" rx="4.5" />
        <rect x="13" y="48" width="38" height="9" rx="4.5" />
      </g>
    </svg>
  );
}

export function Pin3D({ className }) {
  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="pin-g" x1="0" y1="0" x2="1" y2="1">{GREYS}</linearGradient>
        {SHADOW('pin-s')}
      </defs>
      <g filter="url(#pin-s)">
        <path
          fillRule="evenodd"
          fill="url(#pin-g)"
          d="M60 6C34 6 14 26 14 52c0 30 46 70 46 70s46-40 46-70C106 26 86 6 60 6Zm0 28a18 18 0 1 0 .01 0Z"
        />
      </g>
      <circle cx="60" cy="52" r="18" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" />
      <path d="M30 40c4-14 16-24 30-24" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function Thumb3D({ className }) {
  return (
    <svg viewBox="0 0 320 480" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="th-g" x1="0" y1="0" x2="1" y2="1">{GREYS}</linearGradient>
        <linearGradient id="th-cuff" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#bdbdc3" />
          <stop offset="1" stopColor="#8c8c93" />
        </linearGradient>
        {SHADOW('th-s')}
      </defs>
      <g filter="url(#th-s)">
        {/* cuff with knit ribs */}
        <rect x="196" y="268" width="150" height="230" rx="30" fill="url(#th-cuff)" transform="rotate(-8 270 380)" />
        <g stroke="#fff" strokeOpacity="0.28" strokeWidth="5" strokeLinecap="round" transform="rotate(-8 270 380)">
          <line x1="226" y1="290" x2="226" y2="480" />
          <line x1="256" y1="290" x2="256" y2="480" />
          <line x1="286" y1="290" x2="286" y2="480" />
          <line x1="316" y1="290" x2="316" y2="480" />
        </g>
        {/* palm / fist */}
        <rect x="52" y="190" width="206" height="240" rx="62" fill="url(#th-g)" />
        {/* curled fingers */}
        <rect x="14" y="205" width="130" height="62" rx="31" fill="url(#th-g)" />
        <rect x="6" y="262" width="136" height="62" rx="31" fill="url(#th-g)" />
        <rect x="14" y="319" width="130" height="62" rx="31" fill="url(#th-g)" />
        <rect x="34" y="376" width="112" height="56" rx="28" fill="url(#th-g)" />
        {/* thumb */}
        <rect x="124" y="16" width="78" height="240" rx="39" fill="url(#th-g)" transform="rotate(-9 163 240)" />
      </g>
      <g fill="#fff" opacity="0.26">
        <rect x="136" y="30" width="16" height="130" rx="8" transform="rotate(-9 163 240)" />
        <rect x="26" y="214" width="80" height="12" rx="6" />
        <rect x="18" y="271" width="86" height="12" rx="6" />
        <rect x="26" y="328" width="80" height="12" rx="6" />
      </g>
    </svg>
  );
}
