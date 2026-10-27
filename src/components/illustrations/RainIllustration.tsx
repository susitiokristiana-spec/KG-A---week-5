import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../services/audioService';
import { CloudRain, Umbrella, Sun } from 'lucide-react';

interface Props {
  onInteract?: () => void;
}

export const RainIllustration: React.FC<Props> = ({ onInteract }) => {
  const [isRaining, setIsRaining] = useState(true);
  const [hasUmbrella, setHasUmbrella] = useState(true);

  const handleToggleRain = () => {
    setIsRaining((prev) => {
      const next = !prev;
      if (next) {
        audio.playRainDrops();
        audio.speak('Tik tik tik bunyi hujan di atas genting! Sejuk sekali!', 0.9, 1.2);
      } else {
        audio.playDing();
        audio.speak('Hujan reda, awan tersenyum cerah!', 0.9, 1.2);
      }
      onInteract?.();
      return next;
    });
  };

  const handleToggleUmbrella = () => {
    audio.playDing();
    setHasUmbrella((prev) => {
      const next = !prev;
      if (next) {
        audio.speak('Payung pelangi dibuka! Bebek tidak kehujanan!', 0.9, 1.2);
      } else {
        audio.speak('Bebek suka bermain air hujan!', 0.9, 1.2);
      }
      onInteract?.();
      return next;
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto select-none">
      {/* Sky Canvas Area */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-sky-300 via-blue-200 to-indigo-100 border-4 border-blue-300 shadow-inner">
        {/* Animated Falling Raindrops */}
        <AnimatePresence>
          {isRaining && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {[...Array(14)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 90, opacity: 0 }}
                  animate={{ y: 280, opacity: [0, 1, 0.8, 0] }}
                  transition={{
                    duration: 0.9 + (i % 3) * 0.2,
                    repeat: Infinity,
                    delay: (i * 0.12) % 1,
                    ease: 'linear',
                  }}
                  style={{ left: `${15 + (i * 18) % 250}px` }}
                  className="absolute w-1.5 h-4 bg-blue-500 rounded-full"
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Cloud and Duck Scene */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl">
            {/* The Happy Rain Cloud */}
            <g onClick={handleToggleRain} className="cursor-pointer" aria-label="Awan hujan">
              <title>Ketuk awan untuk mengatur hujan!</title>
              <path
                d="M80 80 C60 80 50 100 65 115 C50 125 60 145 80 145 L220 145 C240 145 250 125 235 115 C250 100 240 80 220 80 C215 60 185 50 165 65 C145 45 105 55 95 75 C90 75 85 75 80 80 Z"
                fill="#38BDF8"
              />
              <path
                d="M85 85 C68 85 60 100 72 112 C60 120 68 138 85 138 L215 138 C232 138 240 120 228 112 C240 100 232 85 215 85 C210 68 185 60 168 72 C150 55 115 65 102 82 C98 82 92 82 85 85 Z"
                fill="#E0F2FE"
              />

              {/* Cloud Smiling Eyes */}
              <circle cx="125" cy="105" r="5" fill="#0369A1" />
              <circle cx="175" cy="105" r="5" fill="#0369A1" />
              {/* Rosy Cheeks */}
              <circle cx="110" cy="115" r="7" fill="#F472B6" opacity="0.6" />
              <circle cx="190" cy="115" r="7" fill="#F472B6" opacity="0.6" />
              {/* Smile */}
              <path d="M140 115 Q150 125 160 115" stroke="#0369A1" strokeWidth="3" fill="none" strokeLinecap="round" />

              {/* Letter H on Cloud */}
              <circle cx="150" cy="40" r="18" fill="#2563EB" stroke="#60A5FA" strokeWidth="2.5" />
              <text
                x="150"
                y="47"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="20"
                fontWeight="bold"
                fontFamily="Fredoka, sans-serif"
              >
                H
              </text>
            </g>

            {/* Rainbow Umbrella (if open) */}
            {hasUmbrella && (
              <g onClick={handleToggleUmbrella} className="cursor-pointer">
                {/* Umbrella Canopy with Rainbow Segments */}
                <path d="M90 190 Q150 140 210 190 Z" fill="#F43F5E" />
                <path d="M110 190 Q150 140 190 190 Z" fill="#FBBF24" />
                <path d="M130 190 Q150 140 170 190 Z" fill="#34D399" />
                <path d="M140 190 Q150 140 160 190 Z" fill="#38BDF8" />

                {/* Umbrella Tip */}
                <circle cx="150" cy="148" r="4" fill="#FBBF24" />

                {/* Umbrella Stick & Curved Handle */}
                <line x1="150" y1="148" x2="150" y2="235" stroke="#78350F" strokeWidth="4" />
                <path d="M150 235 Q150 250 138 245" stroke="#78350F" strokeWidth="4" fill="none" strokeLinecap="round" />
              </g>
            )}

            {/* Cute Yellow Duckling Splashing in Puddle */}
            <g transform="translate(130, 210)">
              {/* Water Puddle */}
              <ellipse cx="25" cy="42" rx="42" ry="10" fill="#38BDF8" opacity="0.7" />

              {/* Duck Body */}
              <ellipse cx="25" cy="25" rx="20" ry="16" fill="#FACC15" />
              <circle cx="38" cy="12" r="12" fill="#FACC15" />
              {/* Eye */}
              <circle cx="42" cy="10" r="2.5" fill="#1E293B" />
              {/* Orange Beak */}
              <polygon points="46,12 55,14 46,17" fill="#F97316" />
              {/* Wing */}
              <ellipse cx="20" cy="24" rx="10" ry="6" fill="#EAB308" />
              {/* Boots */}
              <ellipse cx="16" cy="38" rx="5" ry="4" fill="#EF4444" />
              <ellipse cx="30" cy="38" rx="5" ry="4" fill="#EF4444" />
            </g>
          </svg>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
        <button
          onClick={handleToggleRain}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 active:scale-95 text-white font-bold rounded-2xl shadow-md transition-all text-base sm:text-lg"
        >
          {isRaining ? <CloudRain className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          {isRaining ? 'Rintik Hujan Tik-Tik!' : 'Hujan Reda 🌤️'}
        </button>

        <button
          onClick={handleToggleUmbrella}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 active:scale-95 text-white font-bold rounded-2xl shadow-md transition-all text-base sm:text-lg"
        >
          <Umbrella className="w-5 h-5" />
          {hasUmbrella ? 'Tutup Payung' : 'Buka Payung Pelangi ☂️'}
        </button>
      </div>

      <p className="text-xs sm:text-sm text-blue-800 font-medium mt-2 text-center">
        💡 H untuk Hujan! Dengarkan suara rintik hujan sejuk membasahi bumi!
      </p>
    </div>
  );
};
