import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../services/audioService';
import { Heart, Sparkles, Utensils } from 'lucide-react';

interface Props {
  onInteract?: () => void;
}

export const TigerIllustration: React.FC<Props> = ({ onInteract }) => {
  const [isRoaring, setIsRoaring] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleRoar = () => {
    setIsRoaring(true);
    audio.playRoar();
    audio.speak('Rraawwr! Harimau gagah!', 0.9, 1.2);
    onInteract?.();
    setTimeout(() => setIsRoaring(false), 1400);
  };

  const handlePet = (e: React.MouseEvent<HTMLDivElement>) => {
    audio.playDing();
    const rect = e.currentTarget.getBoundingClientRect();
    const newHeart = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left - 12,
      y: e.clientY - rect.top - 12,
    };
    setHearts((prev) => [...prev.slice(-4), newHeart]);
    onInteract?.();
  };

  const handleFeed = () => {
    setIsEating(true);
    audio.playChomp();
    audio.speak('Nyam nyam! Dagingnya lezat sekali!', 0.9, 1.2);
    onInteract?.();
    setTimeout(() => {
      setIsEating(false);
      audio.playSuccess();
    }, 1200);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto select-none">
      {/* Interactive Main Canvas */}
      <div
        onClick={handlePet}
        className="relative w-72 h-72 sm:w-80 sm:h-80 cursor-pointer flex items-center justify-center group"
        title="Ketuk untuk mengelus Harimau!"
      >
        {/* Floating Heart Particles */}
        <AnimatePresence>
          {hearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, scale: 0.5, y: h.y, x: h.x }}
              animate={{ opacity: 0, scale: 1.5, y: h.y - 60 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute pointer-events-none text-rose-500 z-30"
            >
              <Heart className="w-8 h-8 fill-rose-500" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Tiger SVG Drawing */}
        <motion.svg
          viewBox="0 0 300 300"
          className="w-full h-full drop-shadow-xl"
          animate={
            isRoaring
              ? { scale: [1, 1.1, 1.05, 1], rotate: [0, -3, 3, 0] }
              : isEating
              ? { y: [0, -8, 0, -8, 0] }
              : { y: [0, -4, 0] }
          }
          transition={{
            duration: isRoaring ? 0.6 : isEating ? 0.3 : 2.5,
            repeat: isRoaring || isEating ? 1 : Infinity,
            repeatType: 'reverse',
          }}
        >
          {/* Background Aura Glow */}
          <circle cx="150" cy="150" r="135" fill="#FEF3C7" opacity="0.6" />

          {/* Ears */}
          <motion.g
            animate={isRoaring ? { rotate: [0, -8, 8, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            {/* Left Ear */}
            <circle cx="75" cy="80" r="32" fill="#F59E0B" />
            <circle cx="75" cy="80" r="20" fill="#FCD34D" />
            <circle cx="75" cy="80" r="10" fill="#F87171" />
            {/* Right Ear */}
            <circle cx="225" cy="80" r="32" fill="#F59E0B" />
            <circle cx="225" cy="80" r="20" fill="#FCD34D" />
            <circle cx="225" cy="80" r="10" fill="#F87171" />
          </motion.g>

          {/* Head Base */}
          <ellipse cx="150" cy="155" rx="100" ry="88" fill="#F59E0B" />
          <ellipse cx="150" cy="155" rx="92" ry="80" fill="#FB923C" />

          {/* Cheeks Cream Fur */}
          <ellipse cx="95" cy="180" rx="35" ry="30" fill="#FEF3C7" />
          <ellipse cx="205" cy="180" rx="35" ry="30" fill="#FEF3C7" />
          <ellipse cx="150" cy="185" rx="42" ry="34" fill="#FFFBEB" />

          {/* Tiger Head Stripes (Iconic Letter H Vibe!) */}
          <path d="M150 75 L150 105" stroke="#78350F" strokeWidth="8" strokeLinecap="round" />
          <path d="M135 88 L165 88" stroke="#78350F" strokeWidth="7" strokeLinecap="round" />
          <path d="M60 140 L85 145" stroke="#78350F" strokeWidth="7" strokeLinecap="round" />
          <path d="M58 160 L82 163" stroke="#78350F" strokeWidth="7" strokeLinecap="round" />
          <path d="M240 140 L215 145" stroke="#78350F" strokeWidth="7" strokeLinecap="round" />
          <path d="M242 160 L218 163" stroke="#78350F" strokeWidth="7" strokeLinecap="round" />

          {/* Big Cartoon Eyes */}
          <circle cx="115" cy="140" r="18" fill="#FFFFFF" />
          <circle cx="185" cy="140" r="18" fill="#FFFFFF" />
          {/* Pupils */}
          <circle cx={isRoaring ? "115" : "117"} cy="140" r="10" fill="#1E293B" />
          <circle cx={isRoaring ? "185" : "187"} cy="140" r="10" fill="#1E293B" />
          {/* Eye Sparkles */}
          <circle cx="119" cy="136" r="4" fill="#FFFFFF" />
          <circle cx="189" cy="136" r="4" fill="#FFFFFF" />

          {/* Pink Nose */}
          <polygon points="150,166 140,154 160,154" fill="#F43F5E" />

          {/* Mouth & Teeth */}
          {isRoaring ? (
            <g>
              <ellipse cx="150" cy="192" rx="26" ry="20" fill="#881337" />
              {/* Tongue */}
              <ellipse cx="150" cy="202" rx="16" ry="10" fill="#FB7185" />
              {/* Little Fangs */}
              <polygon points="135,178 140,188 145,178" fill="#FFFFFF" />
              <polygon points="155,178 160,188 165,178" fill="#FFFFFF" />
            </g>
          ) : (
            <path
              d="M136 170 Q150 180 150 170 Q150 180 164 170"
              stroke="#78350F"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Rosy Blush */}
          <circle cx="85" cy="170" r="12" fill="#F43F5E" opacity="0.3" />
          <circle cx="215" cy="170" r="12" fill="#F43F5E" opacity="0.3" />

          {/* Whiskers */}
          <line x1="82" y1="175" x2="40" y2="170" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <line x1="82" y1="182" x2="38" y2="185" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <line x1="218" y1="175" x2="260" y2="170" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <line x1="218" y1="182" x2="262" y2="185" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />

          {/* Letter H Medallion */}
          <circle cx="150" cy="250" r="22" fill="#DC2626" stroke="#FEF3C7" strokeWidth="3" />
          <text
            x="150"
            y="259"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="24"
            fontWeight="bold"
            fontFamily="Fredoka, sans-serif"
          >
            H
          </text>
        </motion.svg>
      </div>

      {/* Interactive Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
        <button
          onClick={handleRoar}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold rounded-2xl shadow-md transition-all text-base sm:text-lg"
        >
          <Sparkles className="w-5 h-5" />
          Mengaum Rrraawwr!
        </button>

        <button
          onClick={handleFeed}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 active:scale-95 text-white font-bold rounded-2xl shadow-md transition-all text-base sm:text-lg"
        >
          <Utensils className="w-5 h-5" />
          Beri Makan Daging 🥩
        </button>
      </div>

      <p className="text-xs sm:text-sm text-amber-700 font-medium mt-2 text-center">
        💡 Ketuk kepala harimau untuk mengelus dengan penuh kasih sayang!
      </p>
    </div>
  );
};
