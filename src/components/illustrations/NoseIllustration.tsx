import React, { useState } from 'react';
import { motion } from 'motion/react';
import { audio } from '../../services/audioService';
import { Flower, Glasses, Sparkles } from 'lucide-react';

interface Props {
  onInteract?: () => void;
}

export const NoseIllustration: React.FC<Props> = ({ onInteract }) => {
  const [isSneezing, setIsSneezing] = useState(false);
  const [hasGlasses, setHasGlasses] = useState(false);
  const [flowerNearby, setFlowerNearby] = useState(false);

  const handleSmellFlower = () => {
    setFlowerNearby(true);
    audio.speak('Hmm wangi sekali bunganya... Haaa...', 0.9, 1.2);
    setTimeout(() => {
      setIsSneezing(true);
      audio.playSneeze();
      audio.speak('HATSYII! Hidung bersin!', 0.9, 1.25);
      onInteract?.();
      setTimeout(() => {
        setIsSneezing(false);
        setFlowerNearby(false);
      }, 1500);
    }, 1200);
  };

  const handleToggleGlasses = () => {
    audio.playDing();
    setHasGlasses((prev) => !prev);
    onInteract?.();
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto select-none">
      {/* Face Canvas Area */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-rose-100 via-pink-100 to-amber-50 border-4 border-pink-300 shadow-inner">
        {/* Sneezing Burst Stars */}
        {isSneezing && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.4], opacity: [1, 0] }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center"
          >
            <div className="text-4xl">✨ 💨 🌟 💨 ✨</div>
          </motion.div>
        )}

        {/* Moving Flower */}
        <motion.div
          animate={
            flowerNearby
              ? { x: [-80, -20], y: [40, 10], rotate: [0, 15] }
              : { x: -80, y: 50, opacity: 0.3 }
          }
          transition={{ duration: 0.8 }}
          className="absolute z-20 cursor-pointer"
          onClick={handleSmellFlower}
          title="Bunga mawar wangi"
        >
          <div className="text-5xl">🌹</div>
        </motion.div>

        {/* Cartoon Face with Big Cute Nose */}
        <motion.div
          animate={
            isSneezing
              ? { scale: [1, 1.2, 0.9, 1], rotate: [0, -5, 5, 0] }
              : { y: [0, -4, 0] }
          }
          transition={{
            duration: isSneezing ? 0.6 : 3,
            repeat: isSneezing ? 1 : Infinity,
          }}
          className="relative w-64 h-64 flex items-center justify-center cursor-pointer"
          onClick={handleSmellFlower}
          title="Ketuk hidung untuk mencium wewangian!"
        >
          <svg viewBox="0 0 300 280" className="w-full h-full drop-shadow-xl">
            {/* Friendly Round Face Base */}
            <circle cx="150" cy="140" r="115" fill="#FED7AA" />
            <circle cx="150" cy="140" r="110" fill="#FFEDD5" />

            {/* Rosy Cheeks */}
            <ellipse cx="75" cy="155" rx="20" ry="14" fill="#FDA4AF" opacity="0.6" />
            <ellipse cx="225" cy="155" rx="20" ry="14" fill="#FDA4AF" opacity="0.6" />

            {/* Big Expressive Cartoon Eyes */}
            <circle cx="100" cy="105" r="16" fill="#FFFFFF" stroke="#FDBA74" strokeWidth="2" />
            <circle cx="200" cy="105" r="16" fill="#FFFFFF" stroke="#FDBA74" strokeWidth="2" />

            <circle cx={isSneezing ? "100" : "103"} cy={isSneezing ? "108" : "105"} r="9" fill="#1E293B" />
            <circle cx={isSneezing ? "200" : "203"} cy={isSneezing ? "108" : "105"} r="9" fill="#1E293B" />
            <circle cx="105" cy="102" r="3" fill="#FFFFFF" />
            <circle cx="205" cy="102" r="3" fill="#FFFFFF" />

            {/* Funny Glasses Overlay */}
            {hasGlasses && (
              <g>
                <circle cx="100" cy="105" r="28" fill="none" stroke="#6366F1" strokeWidth="6" />
                <circle cx="200" cy="105" r="28" fill="none" stroke="#6366F1" strokeWidth="6" />
                <path d="M128 105 L172 105" stroke="#6366F1" strokeWidth="6" />
                <path d="M72 105 L45 95" stroke="#6366F1" strokeWidth="5" />
                <path d="M228 105 L255 95" stroke="#6366F1" strokeWidth="5" />
              </g>
            )}

            {/* THE BIG HERO NOSE (Hidung) */}
            <motion.g
              animate={
                isSneezing
                  ? { scale: [1, 1.3, 0.9, 1] }
                  : flowerNearby
                  ? { scale: [1, 1.15, 1], y: [0, -3, 0] }
                  : {}
              }
              transition={{ duration: 0.4 }}
              style={{ transformOrigin: '150px 145px' }}
            >
              {/* Nose Body */}
              <ellipse cx="150" cy="148" rx="34" ry="26" fill="#FB923C" />
              <ellipse cx="150" cy="146" rx="30" ry="22" fill="#F97316" />
              {/* Top highlight */}
              <ellipse cx="145" cy="138" rx="14" ry="7" fill="#FDBA74" />
              {/* Nostrils */}
              <ellipse cx="138" cy="155" rx="6" ry="4" fill="#C2410C" />
              <ellipse cx="162" cy="155" rx="6" ry="4" fill="#C2410C" />
            </motion.g>

            {/* Smiling Mouth */}
            {isSneezing ? (
              <ellipse cx="150" cy="195" rx="18" ry="12" fill="#991B1B" />
            ) : (
              <path
                d="M125 185 Q150 205 175 185"
                stroke="#9A3412"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
            )}

            {/* Letter H Badge on Head */}
            <circle cx="150" cy="40" r="18" fill="#EC4899" stroke="#F43F5E" strokeWidth="2.5" />
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
          </svg>
        </motion.div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
        <button
          onClick={handleSmellFlower}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white font-bold rounded-2xl shadow-md transition-all text-base sm:text-lg"
        >
          <Flower className="w-5 h-5" />
          Cium Bunga Mawar 🌹
        </button>

        <button
          onClick={handleToggleGlasses}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 active:scale-95 text-white font-bold rounded-2xl shadow-md transition-all text-base sm:text-lg"
        >
          <Glasses className="w-5 h-5" />
          {hasGlasses ? 'Lepas Kacamata' : 'Pakai Kacamata 👓'}
        </button>
      </div>

      <p className="text-xs sm:text-sm text-pink-800 font-medium mt-2 text-center">
        💡 Hidung untuk bernapas dan mencium aroma harum! Coba dekatkan bunga!
      </p>
    </div>
  );
};
