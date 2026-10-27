import React, { useState } from 'react';
import { motion } from 'motion/react';
import { audio } from '../../services/audioService';
import { Wind, Rocket, Star } from 'lucide-react';

interface Props {
  onInteract?: () => void;
}

export const HelicopterIllustration: React.FC<Props> = ({ onInteract }) => {
  const [rotorSpeed, setRotorSpeed] = useState<number>(1.2); // seconds per rotation
  const [isFlyingHigh, setIsFlyingHigh] = useState(false);
  const [collectedStars, setCollectedStars] = useState(0);

  const handleTurboRotor = () => {
    setRotorSpeed(0.12);
    audio.playHelicopter();
    audio.speak('Baling-baling berputar wuuush! Cepat sekali!', 0.9, 1.2);
    onInteract?.();
    setTimeout(() => {
      setRotorSpeed(0.8);
    }, 2200);
  };

  const handleFlyUp = () => {
    setIsFlyingHigh(true);
    audio.playHelicopter();
    audio.playSuccess();
    setCollectedStars((prev) => prev + 1);
    audio.speak('Helikopter terbang tinggi menembus awan! Wuussh!', 0.9, 1.2);
    onInteract?.();
    setTimeout(() => {
      setIsFlyingHigh(false);
    }, 1800);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto select-none">
      {/* Visual Canvas Area */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-sky-200 via-sky-100 to-blue-50 border-4 border-sky-300 shadow-inner">
        {/* Floating Clouds Background */}
        <motion.div
          animate={{ x: [-30, 40, -30] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-6 left-4 text-white/80"
        >
          <svg width="70" height="35" viewBox="0 0 100 50" fill="currentColor">
            <path d="M20 40 Q10 40 10 30 Q10 20 22 20 Q25 10 38 10 Q50 10 54 20 Q65 15 72 25 Q82 25 82 35 Q82 40 70 40 Z" />
          </svg>
        </motion.div>

        <motion.div
          animate={{ x: [40, -30, 40] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 right-2 text-white/70"
        >
          <svg width="60" height="30" viewBox="0 0 100 50" fill="currentColor">
            <path d="M20 40 Q10 40 10 30 Q10 20 22 20 Q25 10 38 10 Q50 10 54 20 Q65 15 72 25 Q82 25 82 35 Q82 40 70 40 Z" />
          </svg>
        </motion.div>

        {/* Floating Stars */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-4 right-8 text-amber-400"
        >
          <Star className="w-7 h-7 fill-amber-400" />
        </motion.div>

        {/* Animated Helicopter Entity */}
        <motion.div
          animate={
            isFlyingHigh
              ? { y: [-10, -70, -10], x: [0, 20, -15, 0], scale: [1, 1.15, 1] }
              : { y: [0, -12, 0], rotate: [-2, 2, -2] }
          }
          transition={{
            duration: isFlyingHigh ? 1.8 : 2.5,
            repeat: isFlyingHigh ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-64 h-64 flex items-center justify-center cursor-pointer"
          onClick={handleTurboRotor}
          title="Ketuk Helikopter untuk memutar baling-baling!"
        >
          <svg viewBox="0 0 300 240" className="w-full h-full drop-shadow-xl">
            {/* Top Mast */}
            <rect x="144" y="52" width="12" height="24" fill="#334155" rx="3" />
            <circle cx="150" cy="52" r="8" fill="#0284C7" />

            {/* Rotating Rotor Blades */}
            <motion.g
              style={{ transformOrigin: '150px 52px' }}
              animate={{ rotate: 360 }}
              transition={{ duration: rotorSpeed, repeat: Infinity, ease: 'linear' }}
            >
              <ellipse cx="150" cy="52" rx="110" ry="8" fill="#0369A1" opacity="0.9" />
              <circle cx="45" cy="52" r="6" fill="#FACC15" />
              <circle cx="255" cy="52" r="6" fill="#FACC15" />
            </motion.g>

            {/* Helicopter Body */}
            <path
              d="M75 135 C75 85 190 80 215 110 C235 135 220 175 160 175 C100 175 75 165 75 135 Z"
              fill="#0284C7"
            />
            {/* Accent Belly */}
            <path
              d="M90 155 C120 175 160 175 195 160 C170 170 120 170 90 155 Z"
              fill="#FACC15"
            />

            {/* Tail Boom */}
            <path d="M60 125 L15 110 L15 125 L65 138 Z" fill="#0369A1" />
            {/* Tail Fin */}
            <polygon points="12,95 24,95 18,135 8,135" fill="#FACC15" />

            {/* Tail Rotor */}
            <motion.g
              style={{ transformOrigin: '16px 110px' }}
              animate={{ rotate: -360 }}
              transition={{ duration: rotorSpeed * 0.7, repeat: Infinity, ease: 'linear' }}
            >
              <line x1="16" y1="90" x2="16" y2="130" stroke="#E2E8F0" strokeWidth="4" />
              <circle cx="16" cy="110" r="4" fill="#DC2626" />
            </motion.g>

            {/* Windshield Cockpit Glass */}
            <path
              d="M145 92 C185 92 205 112 205 135 L145 135 Z"
              fill="#E0F2FE"
              stroke="#BAE6FD"
              strokeWidth="3"
            />
            {/* Happy Eyes inside cockpit */}
            <circle cx="165" cy="115" r="7" fill="#0F172A" />
            <circle cx="188" cy="115" r="7" fill="#0F172A" />
            <circle cx="167" cy="113" r="2.5" fill="#FFFFFF" />
            <circle cx="190" cy="113" r="2.5" fill="#FFFFFF" />
            {/* Smile */}
            <path d="M172 126 Q177 132 182 126" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Landing Skids */}
            {/* Skid legs */}
            <line x1="110" y1="175" x2="105" y2="200" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            <line x1="165" y1="175" x2="160" y2="200" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            {/* Skid Bar */}
            <rect x="80" y="198" width="115" height="8" rx="4" fill="#334155" />
            {/* Curved Skid front */}
            <path d="M195 202 Q205 200 210 190" stroke="#334155" strokeWidth="8" fill="none" strokeLinecap="round" />

            {/* Big Letter H Logo on Side */}
            <circle cx="115" cy="132" r="18" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
            <text
              x="115"
              y="140"
              textAnchor="middle"
              fill="#854D0E"
              fontSize="20"
              fontWeight="bold"
              fontFamily="Fredoka, sans-serif"
            >
              H
            </text>
          </svg>
        </motion.div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
        <button
          onClick={handleTurboRotor}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-95 text-white font-bold rounded-2xl shadow-md transition-all text-base sm:text-lg"
        >
          <Wind className="w-5 h-5 animate-spin" />
          Putar Baling-Baling!
        </button>

        <button
          onClick={handleFlyUp}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold rounded-2xl shadow-md transition-all text-base sm:text-lg"
        >
          <Rocket className="w-5 h-5" />
          Terbang Tinggi ☁️
          {collectedStars > 0 && <span className="ml-1 text-xs bg-white text-amber-600 px-2 py-0.5 rounded-full font-black">+{collectedStars} ⭐</span>}
        </button>
      </div>

      <p className="text-xs sm:text-sm text-sky-800 font-medium mt-2 text-center">
        💡 Ketuk badan helikopter untuk mendengar baling-baling berputar wush-wush!
      </p>
    </div>
  );
};
