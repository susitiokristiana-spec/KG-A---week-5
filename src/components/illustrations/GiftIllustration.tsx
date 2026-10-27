import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../services/audioService';
import { Gift, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  onInteract?: () => void;
}

export const GiftIllustration: React.FC<Props> = ({ onInteract }) => {
  const [tapCount, setTapCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleBoxClick = () => {
    if (isOpen) return;

    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    if (nextCount === 1) {
      audio.playDing();
      audio.speak('Satu! Ayo ketuk lagi!', 0.95, 1.2);
    } else if (nextCount === 2) {
      audio.playDing();
      audio.speak('Dua! Kotaknya bergoyang! Satu kali lagi!', 0.95, 1.2);
    } else if (nextCount >= 3) {
      setIsOpen(true);
      audio.playGiftSparkle();
      audio.playCheer();
      audio.speak('HOREEE! Hadiah kejutan terbuka! Ada boneka beruang bermahkota!', 0.9, 1.2);
      onInteract?.();
    }
  };

  const handleReset = () => {
    audio.playDing();
    setTapCount(0);
    setIsOpen(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto select-none">
      {/* Gift Box Canvas */}
      <div
        onClick={handleBoxClick}
        className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-purple-100 via-fuchsia-50 to-pink-100 border-4 border-purple-300 shadow-inner cursor-pointer"
        title="Ketuk 3 kali untuk membuka Hadiah!"
      >
        {/* Surprise Confetti Emitter when Open */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center"
            >
              <div className="absolute top-6 left-8 text-2xl animate-bounce">🎉</div>
              <div className="absolute top-10 right-8 text-2xl animate-bounce">⭐</div>
              <div className="absolute bottom-10 left-10 text-2xl animate-bounce">🎈</div>
              <div className="absolute bottom-8 right-10 text-2xl animate-bounce">✨</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Box Entity */}
        <motion.div
          animate={
            isOpen
              ? { scale: [1, 1.05, 1] }
              : tapCount === 2
              ? { rotate: [-8, 8, -8, 8, 0], scale: [1, 1.06, 1] }
              : tapCount === 1
              ? { rotate: [-4, 4, 0] }
              : { y: [0, -5, 0] }
          }
          transition={{
            duration: isOpen ? 1 : tapCount > 0 ? 0.3 : 2.5,
            repeat: isOpen ? 0 : tapCount > 0 ? 1 : Infinity,
          }}
          className="relative w-64 h-64 flex items-center justify-center"
        >
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
            {isOpen ? (
              /* Opened Gift with Surprise Teddy Bear holding Letter H */
              <g>
                {/* Teddy Bear Body */}
                <ellipse cx="150" cy="180" rx="55" ry="50" fill="#D97706" />
                <ellipse cx="150" cy="185" rx="35" ry="32" fill="#FDE68A" />

                {/* Bear Ears */}
                <circle cx="110" cy="95" r="22" fill="#D97706" />
                <circle cx="110" cy="95" r="12" fill="#FDE68A" />
                <circle cx="190" cy="95" r="22" fill="#D97706" />
                <circle cx="190" cy="95" r="12" fill="#FDE68A" />

                {/* Bear Head */}
                <circle cx="150" cy="125" r="48" fill="#B45309" />
                <circle cx="150" cy="125" r="44" fill="#D97706" />

                {/* Snout */}
                <ellipse cx="150" cy="138" rx="22" ry="16" fill="#FEF3C7" />
                <ellipse cx="150" cy="132" rx="8" ry="6" fill="#451A03" />
                <path d="M150 138 L150 144" stroke="#451A03" strokeWidth="2.5" />
                <path d="M142 144 Q150 150 158 144" stroke="#451A03" strokeWidth="2.5" fill="none" />

                {/* Eyes */}
                <circle cx="132" cy="118" r="6" fill="#1E293B" />
                <circle cx="168" cy="118" r="6" fill="#1E293B" />
                <circle cx="134" cy="116" r="2" fill="#FFFFFF" />
                <circle cx="170" cy="116" r="2" fill="#FFFFFF" />

                {/* Golden Crown */}
                <polygon points="130,85 138,65 150,78 162,65 170,85" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
                <circle cx="150" cy="78" r="3" fill="#DC2626" />

                {/* Bear Hands holding Big Letter H */}
                <circle cx="105" cy="175" r="14" fill="#B45309" />
                <circle cx="195" cy="175" r="14" fill="#B45309" />

                {/* Giant Golden Letter H Plaque */}
                <rect x="120" y="150" width="60" height="65" rx="14" fill="#FEF08A" stroke="#EAB308" strokeWidth="4" />
                <text
                  x="150"
                  y="198"
                  textAnchor="middle"
                  fill="#854D0E"
                  fontSize="46"
                  fontWeight="bold"
                  fontFamily="Fredoka, sans-serif"
                >
                  H
                </text>

                {/* Open Box Lower Base */}
                <rect x="65" y="210" width="170" height="60" rx="8" fill="#7C3AED" />
                {/* Yellow vertical ribbon */}
                <rect x="135" y="210" width="30" height="60" fill="#FACC15" />

                {/* Flying Lid to the side */}
                <g transform="rotate(-25 50 170)">
                  <rect x="10" y="170" width="100" height="24" rx="6" fill="#6D28D9" stroke="#5B21B6" strokeWidth="2" />
                  <ellipse cx="60" cy="165" rx="16" ry="10" fill="#FACC15" />
                </g>
              </g>
            ) : (
              /* Closed Wrapped Gift Box */
              <g>
                {/* Shadow */}
                <ellipse cx="150" cy="270" rx="90" ry="14" fill="#C4B5FD" opacity="0.6" />

                {/* Main Box Body */}
                <rect x="65" y="140" width="170" height="120" rx="12" fill="#8B5CF6" />
                <rect x="65" y="140" width="170" height="120" rx="12" fill="url(#giftGradient)" opacity="0.15" />

                {/* Vertical Ribbon */}
                <rect x="135" y="140" width="30" height="120" fill="#FACC15" />
                {/* Horizontal Ribbon */}
                <rect x="65" y="185" width="170" height="30" fill="#FACC15" />

                {/* Box Lid */}
                <rect x="55" y="115" width="190" height="32" rx="8" fill="#7C3AED" stroke="#6D28D9" strokeWidth="3" />
                <rect x="133" y="115" width="34" height="32" fill="#FACC15" />

                {/* Big Shimmering Ribbon Bow on Top */}
                {/* Left loop */}
                <path d="M150 115 C100 80 100 55 135 90 Z" fill="#FDE047" stroke="#EAB308" strokeWidth="3" />
                {/* Right loop */}
                <path d="M150 115 C200 80 200 55 165 90 Z" fill="#FDE047" stroke="#EAB308" strokeWidth="3" />
                {/* Center Knot */}
                <circle cx="150" cy="112" r="14" fill="#FACC15" stroke="#EAB308" strokeWidth="3" />

                {/* Big Golden Letter H Tag */}
                <circle cx="100" cy="190" r="22" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
                <text
                  x="100"
                  y="199"
                  textAnchor="middle"
                  fill="#713F12"
                  fontSize="26"
                  fontWeight="bold"
                  fontFamily="Fredoka, sans-serif"
                >
                  H
                </text>
              </g>
            )}
          </svg>
        </motion.div>
      </div>

      {/* Control Buttons & Progress */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
        {!isOpen ? (
          <button
            onClick={handleBoxClick}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 active:scale-95 text-white font-black rounded-2xl shadow-lg transition-all text-base sm:text-lg animate-wiggle"
          >
            <Gift className="w-6 h-6" />
            Ketuk Buka Hadiah! ({tapCount}/3) 🎁
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95 text-white font-bold rounded-2xl shadow-md transition-all text-base sm:text-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Bungkus Kado Lagi 🔄
          </button>
        )}
      </div>

      <p className="text-xs sm:text-sm text-purple-800 font-medium mt-2 text-center">
        {!isOpen
          ? '💡 Ayo ketuk kotak hadiah sampai 3 kali untuk melihat hadiah kejutan di dalamnya!'
          : '🎉 Yaaay! Huruf H untuk Hadiah kejutan! Ada boneka beruang bermahkota!'}
      </p>
    </div>
  );
};
