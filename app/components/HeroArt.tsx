export function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <svg
        className="hero-art-svg"
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hero-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6fb3c9" />
            <stop offset="55%" stopColor="#f4a58a" />
            <stop offset="100%" stopColor="#f9d6a4" />
          </linearGradient>
          <linearGradient id="hero-sea" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a6b8a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#074d65" />
          </linearGradient>
          <radialGradient id="hero-sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.7" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="500" fill="url(#hero-sky)" />
        <circle cx="110" cy="170" r="110" fill="url(#hero-sun-glow)" />
        <circle cx="110" cy="170" r="50" fill="white" fillOpacity="0.95" />
        <path d="M0,358 L400,358 L400,500 L0,500 Z" fill="url(#hero-sea)" />
        <g transform="translate(285, 250)" fill="#074d65">
          <path d="M2,170 C-2,138 -4,108 -8,80 C-12,55 -20,35 -30,18 C-18,32 -10,52 -6,76 C-2,108 6,138 14,170 Z" />
          <ellipse cx="-38" cy="15" rx="34" ry="10" />
          <ellipse cx="-60" cy="5" rx="22" ry="7" />
          <ellipse cx="-22" cy="0" rx="26" ry="8" />
        </g>
      </svg>
      <div
        className="hero-art-image"
        style={{ backgroundImage: "url(/hero.jpg)" }}
      />
    </div>
  );
}
