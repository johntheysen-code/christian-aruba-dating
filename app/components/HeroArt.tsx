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

        <ellipse cx="250" cy="130" rx="40" ry="6" fill="white" fillOpacity="0.45" />
        <ellipse cx="310" cy="105" rx="28" ry="5" fill="white" fillOpacity="0.35" />
        <ellipse cx="60" cy="90" rx="22" ry="4" fill="white" fillOpacity="0.3" />

        <path
          d="M0,330 Q60,310 130,320 Q200,330 280,315 Q340,305 400,318 L400,360 L0,360 Z"
          fill="#074d65"
          fillOpacity="0.28"
        />

        <path d="M0,358 L400,358 L400,500 L0,500 Z" fill="url(#hero-sea)" />

        <path
          d="M0,376 Q70,370 140,377 T280,374 T400,375 L400,384 L0,384 Z"
          fill="white"
          fillOpacity="0.18"
        />
        <path
          d="M0,398 Q90,392 180,398 T360,396 T400,398 L400,404 L0,404 Z"
          fill="white"
          fillOpacity="0.12"
        />

        <path
          d="M0,425 Q80,415 160,420 Q240,425 320,415 Q360,410 400,420 L400,500 L0,500 Z"
          fill="#f9d6a4"
          fillOpacity="0.75"
        />

        <g transform="translate(285, 250)" fill="#074d65">
          <path d="M2,170 C-2,138 -4,108 -8,80 C-12,55 -20,35 -30,18 C-18,32 -10,52 -6,76 C-2,108 6,138 14,170 Z" />
          <ellipse cx="-38" cy="15" rx="34" ry="10" />
          <ellipse cx="-60" cy="5" rx="22" ry="7" />
          <ellipse cx="-22" cy="0" rx="26" ry="8" />
          <ellipse cx="-68" cy="22" rx="18" ry="6" />
          <ellipse cx="-42" cy="-8" rx="20" ry="6" />
          <ellipse cx="-15" cy="10" rx="14" ry="4" />
        </g>

        <g transform="translate(330, 110)" fill="#074d65" fillOpacity="0.55">
          <path d="M0,8 C0,2 -8,-4 -14,2 C-20,8 -14,14 0,28 C14,14 20,8 14,2 C8,-4 0,2 0,8 Z" />
        </g>

        <path
          d="M40,140 q5,-3 10,0 q-5,3 -10,0 z M48,144 q5,-3 10,0 q-5,3 -10,0 z"
          fill="#074d65"
          fillOpacity="0.4"
        />
      </svg>
    </div>
  );
}
