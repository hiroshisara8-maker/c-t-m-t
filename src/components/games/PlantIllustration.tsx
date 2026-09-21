import React from 'react';

interface PlantIllustrationProps {
  seedId: string;
  stage: number; // 1 to 5
  isWatering: boolean;
}

export const PlantIllustration: React.FC<PlantIllustrationProps> = ({
  seedId,
  stage,
  isWatering,
}) => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center select-none">
      {/* Sun rays & atmospheric glow */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none ${
          stage === 5
            ? 'bg-radial from-amber-200/50 via-emerald-100/30 to-transparent scale-110'
            : 'bg-radial from-amber-100/30 via-transparent to-transparent'
        }`}
      />

      {/* Animated Watering Can & Droplets when watering */}
      {isWatering && (
        <div className="absolute top-2 right-6 z-30 animate-in fade-in slide-in-from-top duration-300 pointer-events-none">
          <svg className="w-16 h-16 text-sky-400 filter drop-shadow-md rotate-[-20deg]" viewBox="0 0 100 100" fill="currentColor">
            {/* Cute Watering Can */}
            <path d="M20 40 L65 40 L55 85 L25 85 Z" fill="#38bdf8" />
            <path d="M60 45 L92 28 L94 36 L65 58 Z" fill="#0284c7" />
            <circle cx="94" cy="32" r="6" fill="#0369a1" />
            {/* Handle */}
            <path d="M22 45 C5 45 5 78 24 80" fill="none" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
          </svg>

          {/* Falling Water drops */}
          <div className="absolute top-12 left-10 flex flex-col gap-1 items-center animate-bounce">
            <div className="w-2 h-3 bg-sky-300 rounded-full blur-[0.5px]" />
            <div className="w-1.5 h-2.5 bg-sky-400 rounded-full" />
            <div className="w-2 h-3.5 bg-sky-300 rounded-full" />
          </div>
        </div>
      )}

      {/* Main SVG Botanical Illustration */}
      <svg
        viewBox="0 0 200 220"
        className="w-full h-full filter drop-shadow-md transition-all duration-500 overflow-visible"
      >
        <defs>
          <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="60%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>
          <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fdba74" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
          <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isWatering ? '#3e2723' : '#5d4037'} />
            <stop offset="100%" stopColor="#271c19" />
          </linearGradient>
          <linearGradient id="stemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="sunflowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <linearGradient id="cherryPetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff1f2" />
            <stop offset="60%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
          <linearGradient id="succulentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#99f6e4" />
            <stop offset="60%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
        </defs>

        {/* 1. PLANT POT & SOIL (Base) */}
        <g id="flower-pot">
          {/* Ground shadow */}
          <ellipse cx="100" cy="208" rx="55" ry="8" fill="#cbd5e1" opacity="0.6" />

          {/* Pot Body */}
          <polygon points="56,155 144,155 132,204 68,204" fill="url(#potGrad)" />
          {/* Decorative band on pot */}
          <polygon points="59,165 141,165 138,172 62,172" fill="#fff" opacity="0.25" />
          {/* Pot Rim */}
          <rect x="50" y="146" width="100" height="12" rx="4" fill="url(#rimGrad)" />
          {/* Soil */}
          <ellipse cx="100" cy="151" rx="44" ry="7" fill="url(#soilGrad)" />

          {/* Tiny soil pebble textures */}
          <circle cx="85" cy="152" r="1.5" fill="#a1887f" />
          <circle cx="118" cy="150" r="1.2" fill="#8d6e63" />
          <circle cx="70" cy="153" r="1.8" fill="#d7ccc8" />
          <circle cx="128" cy="152" r="1" fill="#a1887f" />
        </g>

        {/* 2. PLANT GROWTH STAGES BASED ON SEED TYPE */}
        {/* STAGE 1: Seed underground / cracking */}
        {stage === 1 && (
          <g className="animate-in fade-in zoom-in duration-300">
            {/* Warm glow around seed */}
            <circle cx="100" cy="142" r="16" fill="#fef08a" opacity="0.4" className="animate-pulse" />
            {/* The seed */}
            <ellipse cx="100" cy="144" rx="9" ry="12" fill="#78350f" transform="rotate(-15 100 144)" />
            <path d="M96 138 Q100 144 98 152" stroke="#d97706" strokeWidth="1.5" fill="none" />
            {/* First white taproot starting to dig down */}
            <path d="M101 154 Q103 162 100 168" stroke="#fef9c3" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Tiny green sprout tip poking out */}
            <path d="M96 134 Q98 128 102 127 Q101 133 97 135 Z" fill="#86efac" />
          </g>
        )}

        {/* STAGE 2: Sprout with 2 cotyledon leaves */}
        {stage === 2 && (
          <g className="animate-in fade-in zoom-in duration-300">
            {/* Tender root */}
            <path d="M100 152 Q97 165 92 172" stroke="#e2e8f0" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M100 155 Q104 167 108 174" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Tender green stem */}
            <path d="M100 152 Q100 135 100 120" stroke="url(#stemGrad)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Left Cotyledon leaf */}
            <path d="M99 122 C85 116 80 128 98 128 Z" fill="url(#leafGrad)" />
            {/* Right Cotyledon leaf */}
            <path d="M101 122 C115 116 120 128 102 128 Z" fill="url(#leafGrad)" />
            {/* Dew droplet */}
            <circle cx="89" cy="120" r="2" fill="#bae6fd" opacity="0.9" />
          </g>
        )}

        {/* STAGE 3: Vigorous stem with leafy branches */}
        {stage === 3 && (
          <g className="animate-in fade-in zoom-in duration-300">
            {/* Main stem */}
            <path d="M100 152 Q98 125 100 95" stroke="url(#stemGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            {/* Lower left leaf */}
            <path d="M98 132 C75 125 70 145 96 140 Z" fill="url(#leafGrad)" />
            <path d="M97 134 Q82 133 76 136" stroke="#15803d" strokeWidth="1" fill="none" />
            {/* Lower right leaf */}
            <path d="M102 126 C125 118 130 138 103 134 Z" fill="url(#leafGrad)" />
            <path d="M103 128 Q118 127 124 130" stroke="#15803d" strokeWidth="1" fill="none" />
            {/* Mid left leaf */}
            <path d="M99 110 C80 98 75 118 98 116 Z" fill="url(#leafGrad)" />
            {/* Top right shoot */}
            <path d="M101 102 C120 92 122 112 102 108 Z" fill="url(#leafGrad)" />
            {/* Top emerging leaf */}
            <path d="M100 96 C94 80 106 80 100 96 Z" fill="#86efac" />
            {/* Morning dew */}
            <circle cx="78" cy="132" r="2.2" fill="#e0f2fe" />
          </g>
        )}

        {/* STAGE 4: Lush plant with swelling flower bud */}
        {stage === 4 && (
          <g className="animate-in fade-in zoom-in duration-300">
            {/* Main tall stem */}
            <path d="M100 152 Q102 115 100 75" stroke="url(#stemGrad)" strokeWidth="6.5" strokeLinecap="round" fill="none" />
            {/* Big healthy side leaves */}
            <path d="M98 135 C65 125 60 155 97 145 Z" fill="url(#leafGrad)" />
            <path d="M102 128 C135 118 140 148 103 138 Z" fill="url(#leafGrad)" />
            <path d="M98 108 C70 95 65 125 99 118 Z" fill="url(#leafGrad)" />
            <path d="M102 98 C130 85 135 115 102 108 Z" fill="url(#leafGrad)" />

            {/* Species-specific swollen bud */}
            {seedId === 'clover' && (
              <g>
                <circle cx="95" cy="72" r="9" fill="#22c55e" />
                <circle cx="105" cy="72" r="9" fill="#22c55e" />
                <circle cx="100" cy="65" r="9" fill="#4ade80" />
              </g>
            )}

            {seedId === 'sunflower' && (
              <g>
                <circle cx="100" cy="70" r="14" fill="#65a30d" />
                {/* Yellow petal tips peeking out */}
                <path d="M96 56 L100 50 L104 56 Z" fill="#facc15" />
                <path d="M86 64 L80 60 L87 70 Z" fill="#facc15" />
                <path d="M114 64 L120 60 L113 70 Z" fill="#facc15" />
                <circle cx="100" cy="70" r="8" fill="#451a03" />
              </g>
            )}

            {seedId === 'cherry' && (
              <g>
                <path d="M100 75 Q90 60 100 52 Q110 60 100 75 Z" fill="#f43f5e" />
                <path d="M100 75 Q108 62 115 68 Q110 78 100 75 Z" fill="#fbcfe8" />
              </g>
            )}

            {seedId === 'succulent' && (
              <g>
                <path d="M100 85 C80 80 80 105 100 100 Z" fill="url(#succulentGrad)" />
                <path d="M100 85 C120 80 120 105 100 100 Z" fill="url(#succulentGrad)" />
                <path d="M100 75 C85 65 85 88 100 85 Z" fill="#5eead4" />
                <path d="M100 75 C115 65 115 88 100 85 Z" fill="#5eead4" />
              </g>
            )}

            {seedId === 'magic_bean' && (
              <g>
                {/* Spiral vine */}
                <path d="M100 85 C85 75 115 65 100 55" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" fill="none" />
                <circle cx="100" cy="52" r="8" fill="#818cf8" className="animate-pulse" />
              </g>
            )}

            {/* Sparkles of life */}
            <circle cx="100" cy="60" r="3" fill="#fef08a" opacity="0.8" className="animate-ping" />
          </g>
        )}

        {/* STAGE 5: FULL GLORIOUS BLOOM! */}
        {stage === 5 && (
          <g className="animate-in zoom-in duration-500">
            {/* Main sturdy plant stem */}
            <path d="M100 152 Q100 115 100 75" stroke="url(#stemGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />

            {/* Rich side leaves */}
            <path d="M98 135 C60 125 55 155 97 145 Z" fill="url(#leafGrad)" />
            <path d="M102 128 C140 118 145 148 103 138 Z" fill="url(#leafGrad)" />
            <path d="M98 110 C68 95 62 125 99 118 Z" fill="url(#leafGrad)" />
            <path d="M102 102 C132 88 138 118 102 110 Z" fill="url(#leafGrad)" />

            {/* 1. CLOVER: Full Four-Leaf Clover with Golden Aura */}
            {seedId === 'clover' && (
              <g id="full-clover" className="animate-bounce" style={{ animationDuration: '3s' }}>
                <circle cx="100" cy="60" r="35" fill="#86efac" opacity="0.25" />
                {/* 4 heart shaped leaves */}
                {/* Top */}
                <path d="M100 60 C88 40 100 28 100 40 C100 28 112 40 100 60 Z" fill="#22c55e" />
                {/* Bottom */}
                <path d="M100 60 C88 80 100 92 100 80 C100 92 112 80 100 60 Z" fill="#16a34a" />
                {/* Left */}
                <path d="M100 60 C80 48 68 60 80 60 C68 60 80 72 100 60 Z" fill="#15803d" />
                {/* Right */}
                <path d="M100 60 C120 48 132 60 120 60 C132 60 120 72 100 60 Z" fill="#4ade80" />
                <circle cx="100" cy="60" r="5" fill="#fef08a" />
              </g>
            )}

            {/* 2. SUNFLOWER: Grand Glowing Sunflower */}
            {seedId === 'sunflower' && (
              <g id="full-sunflower">
                {/* Golden glowing rays */}
                <circle cx="100" cy="55" r="42" fill="#fef08a" opacity="0.3" className="animate-pulse" />
                {/* Golden Petals Ring */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
                  <ellipse
                    key={idx}
                    cx="100"
                    cy="28"
                    rx="6.5"
                    ry="17"
                    fill="url(#sunflowerGrad)"
                    stroke="#ca8a04"
                    strokeWidth="0.6"
                    transform={`rotate(${angle} 100 55)`}
                  />
                ))}
                {/* Inner rich seed disk */}
                <circle cx="100" cy="55" r="18" fill="#451a03" stroke="#78350f" strokeWidth="2.5" />
                {/* Seed spirals */}
                <circle cx="100" cy="55" r="12" fill="#713f12" />
                <circle cx="100" cy="55" r="6" fill="#a16207" />
                {/* Cute smile on the flower! */}
                <circle cx="94" cy="52" r="1.8" fill="#fef08a" />
                <circle cx="106" cy="52" r="1.8" fill="#fef08a" />
                <path d="M96 58 Q100 62 104 58" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* 3. CHERRY BLOSSOM: Delicate Pink Sakura Bloom */}
            {seedId === 'cherry' && (
              <g id="full-sakura">
                <circle cx="100" cy="55" r="40" fill="#fce7f3" opacity="0.4" />
                {/* 5 rounded Sakura petals */}
                {[0, 72, 144, 216, 288].map((angle, idx) => (
                  <path
                    key={idx}
                    d="M100 55 C90 32 94 22 100 26 C106 22 110 32 100 55 Z"
                    fill="url(#cherryPetal)"
                    stroke="#fb7185"
                    strokeWidth="0.7"
                    transform={`rotate(${angle} 100 55)`}
                  />
                ))}
                {/* Sakura Pistils */}
                <circle cx="100" cy="55" r="8" fill="#f43f5e" />
                <circle cx="100" cy="55" r="4" fill="#fff" />
                {/* Floating petals in breeze */}
                <path d="M60 40 Q65 35 70 42 Q65 48 60 40 Z" fill="#fbcfe8" opacity="0.85" className="animate-pulse" />
                <path d="M140 35 Q145 30 150 37 Q145 43 140 35 Z" fill="#fbcfe8" opacity="0.85" />
              </g>
            )}

            {/* 4. SUCCULENT: Sacred Geometry Layered Lotus */}
            {seedId === 'succulent' && (
              <g id="full-succulent">
                {/* Outer rosette */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
                  <ellipse
                    key={idx}
                    cx="100"
                    cy="36"
                    rx="8.5"
                    ry="18"
                    fill="url(#succulentGrad)"
                    stroke="#115e59"
                    strokeWidth="0.8"
                    transform={`rotate(${angle} 100 62)`}
                  />
                ))}
                {/* Mid rosette */}
                {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, idx) => (
                  <ellipse
                    key={idx}
                    cx="100"
                    cy="44"
                    rx="7"
                    ry="14"
                    fill="#5eead4"
                    stroke="#0f766e"
                    strokeWidth="0.6"
                    transform={`rotate(${angle} 100 62)`}
                  />
                ))}
                {/* Crown rosette */}
                <circle cx="100" cy="62" r="9" fill="#ccfbf1" stroke="#14b8a6" strokeWidth="1" />
                {/* Lotus flower on top */}
                <path d="M100 62 C95 48 105 48 100 62 Z" fill="#f472b6" />
              </g>
            )}

            {/* 5. MAGIC BEAN: Rainbow Cloud Climbing Vine */}
            {seedId === 'magic_bean' && (
              <g id="full-bean">
                {/* Swirling Rainbow clouds */}
                <ellipse cx="100" cy="35" rx="42" ry="16" fill="#e0e7ff" opacity="0.8" />
                <ellipse cx="80" cy="32" rx="22" ry="14" fill="#c7d2fe" />
                <ellipse cx="120" cy="32" rx="22" ry="14" fill="#c7d2fe" />
                {/* Rainbow arc */}
                <path d="M72 35 A30 30 0 0 1 128 35" stroke="#f43f5e" strokeWidth="3" fill="none" opacity="0.8" />
                <path d="M74 35 A28 28 0 0 1 126 35" stroke="#facc15" strokeWidth="3" fill="none" opacity="0.8" />
                <path d="M76 35 A26 26 0 0 1 124 35" stroke="#38bdf8" strokeWidth="3" fill="none" opacity="0.8" />
                {/* Glowing Star on Top */}
                <polygon points="100,10 104,22 116,22 106,29 110,40 100,33 90,40 94,29 84,22 96,22" fill="#fde047" stroke="#ca8a04" strokeWidth="1" className="animate-pulse" />
              </g>
            )}

            {/* Fluttering Butterflies & Sparkles */}
            <g className="animate-bounce" style={{ animationDuration: '2.5s' }}>
              <text x="145" y="45" fontSize="20">🦋</text>
            </g>
            <g className="animate-pulse">
              <text x="45" y="55" fontSize="18">✨</text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
