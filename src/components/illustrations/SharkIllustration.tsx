import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../services/audioService';
import { Waves, Sparkles } from 'lucide-react';

interface Props {
  onInteract?: () => void;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const SharkIllustration: React.FC<Props> = ({ onInteract }) => {
  const [isChomping, setIsChomping] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([
    { id: 1, x: 30, y: 50, size: 28 },
    { id: 2, x: 75, y: 35, size: 20 },
    { id: 3, x: 220, y: 45, size: 32 },
    { id: 4, x: 260, y: 70, size: 24 },
  ]);
  const [eatenCount, setEatenCount] = useState(0);

  const handlePopBubble = (id: number) => {
    audio.playPop();
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setEatenCount((prev) => prev + 1);
    onInteract?.();
    // Spawn a new bubble after delay
    setTimeout(() => {
      setBubbles((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: 20 + Math.random() * 240,
          y: 30 + Math.random() * 80,
          size: 20 + Math.random() * 16,
        },
      ]);
    }, 1200);
  };

  const handleChomp = () => {
    setIsChomping(true);
    audio.playChomp();
    audio.speak('Nyam nyam! Hiu berenang cepat di lautan!', 0.9, 1.2);
    setEatenCount((prev) => prev + 2);
    onInteract?.();
    setTimeout(() => {
      setIsChomping(false);
      audio.playSuccess();
    }, 1000);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto select-none">
      {/* Underwater Ocean Box */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-teal-400 via-cyan-500 to-teal-700 border-4 border-teal-300 shadow-inner">
        {/* Floating Poppable Bubbles */}
        <AnimatePresence>
          {bubbles.map((b) => (
            <motion.button
              key={b.id}
              onClick={() => handlePopBubble(b.id)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 0.9,
                y: [b.y, b.y - 15, b.y],
              }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{
                y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 0.3 },
              }}
              style={{
                left: `${b.x}px`,
                top: `${b.y}px`,
                width: `${b.size}px`,
                height: `${b.size}px`,
              }}
              className="absolute rounded-full bg-white/40 border-2 border-white/80 cursor-pointer shadow-lg active:scale-125 z-20 flex items-center justify-center"
              title="Ketuk untuk meletuskan gelembung!"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-1 left-1" />
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Swimming Friendly Shark Entity */}
        <motion.div
          animate={
            isChomping
              ? { x: [0, 25, 0], scale: [1, 1.08, 1] }
              : { x: [-10, 10, -10], y: [0, -6, 0] }
          }
          transition={{
            duration: isChomping ? 0.6 : 3,
            repeat: isChomping ? 1 : Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-64 h-64 flex items-center justify-center cursor-pointer"
          onClick={handleChomp}
          title="Ketuk Hiu untuk berenang dan makan!"
        >
          <svg viewBox="0 0 300 240" className="w-full h-full drop-shadow-2xl">
            {/* Dorsal Fin */}
            <path d="M125 75 Q150 15 175 75 Z" fill="#0D9488" stroke="#115E59" strokeWidth="2" />

            {/* Tail Fin */}
            <motion.g
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '40px 130px' }}
            >
              <polygon points="40,130 5,75 15,130 5,185" fill="#0F766E" />
            </motion.g>

            {/* Shark Body */}
            <path
              d="M35 130 C45 80 180 65 245 110 C265 125 260 145 220 165 C160 190 65 175 35 130 Z"
              fill="#0D9488"
            />
            {/* White/Cream Underbelly */}
            <path
              d="M75 145 C120 175 190 175 220 165 C180 160 130 150 75 145 Z"
              fill="#F0FDFA"
            />

            {/* Pectoral Side Fin */}
            <path d="M130 145 Q150 185 180 155 Z" fill="#14B8A6" />

            {/* Gills (3 lines) */}
            <path d="M185 115 Q182 125 185 135" stroke="#115E59" strokeWidth="3" strokeLinecap="round" />
            <path d="M192 116 Q189 125 192 134" stroke="#115E59" strokeWidth="3" strokeLinecap="round" />
            <path d="M199 117 Q196 125 199 133" stroke="#115E59" strokeWidth="3" strokeLinecap="round" />

            {/* Friendly Big Eyes with Swimming Goggles */}
            <ellipse cx="220" cy="105" rx="14" ry="14" fill="#0284C7" stroke="#38BDF8" strokeWidth="3" />
            <circle cx="220" cy="105" r="9" fill="#0F172A" />
            <circle cx="222" cy="102" r="3.5" fill="#FFFFFF" />

            {/* Shark Mouth */}
            {isChomping ? (
              <g>
                <path d="M210 135 Q240 160 255 135 Z" fill="#991B1B" />
                {/* Sharp little white cartoon teeth */}
                <polygon points="215,135 220,143 225,135" fill="#FFFFFF" />
                <polygon points="228,135 233,143 238,135" fill="#FFFFFF" />
                <polygon points="241,135 246,143 251,135" fill="#FFFFFF" />
              </g>
            ) : (
              <path
                d="M212 138 Q235 152 245 135"
                stroke="#042F2E"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            )}

            {/* Letter H on Dorsal Fin or Body */}
            <circle cx="100" cy="125" r="18" fill="#FACC15" stroke="#EAB308" strokeWidth="3" />
            <text
              x="100"
              y="133"
              textAnchor="middle"
              fill="#713F12"
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
          onClick={handleChomp}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 active:scale-95 text-white font-bold rounded-2xl shadow-md transition-all text-base sm:text-lg"
        >
          <Waves className="w-5 h-5" />
          Berenang & Gigit Gelembung!
        </button>

        <div className="flex items-center gap-1.5 px-4 py-2 bg-teal-100 border border-teal-300 rounded-2xl text-teal-800 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-teal-600" />
          Gelembung Pecah: {eatenCount} 🫧
        </div>
      </div>

      <p className="text-xs sm:text-sm text-teal-800 font-medium mt-2 text-center">
        💡 Ketuk gelembung air di laut untuk meletuskannya! Pop pop!
      </p>
    </div>
  );
};
