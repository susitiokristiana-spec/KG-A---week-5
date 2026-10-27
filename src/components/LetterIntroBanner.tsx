import React from 'react';
import { motion } from 'motion/react';
import { audio } from '../services/audioService';
import { Volume2, Sparkles } from 'lucide-react';

export const LetterIntroBanner: React.FC = () => {
  const handlePlayLetterPhonics = () => {
    audio.playDing();
    audio.speak(
      'Ini adalah Huruf H! Huruf H besar... dan huruf h kecil. Bunyinya seperti menghembuskan napas lembut... /h/... ha... ha... Harimau!',
      0.86,
      1.18
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-4 sm:p-5 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 select-none border-4 border-amber-200">
      {/* Left: Big Animated H and h Badges */}
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center gap-2"
        >
          {/* Huruf Besar H */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white text-orange-600 shadow-lg flex flex-col items-center justify-center border-4 border-orange-200">
            <span className="text-3xl sm:text-4xl font-black">H</span>
            <span className="text-[10px] sm:text-xs font-bold text-orange-400 -mt-1">BESAR</span>
          </div>

          {/* Huruf Kecil h */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-amber-100 text-amber-800 shadow-lg flex flex-col items-center justify-center border-4 border-amber-200">
            <span className="text-2xl sm:text-3xl font-black">h</span>
            <span className="text-[10px] sm:text-xs font-bold text-amber-600 -mt-1">KECIL</span>
          </div>
        </motion.div>

        {/* Text Title */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-100">
              Belajar Huruf TK A
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white drop-shadow-sm">
            Petualangan Huruf Hh
          </h1>
          <p className="text-xs sm:text-sm text-white/90 font-medium">
            Mengenal huruf & 6 kosakata bergambar besar bersuara!
          </p>
        </div>
      </div>

      {/* Right: Audio Phonics Button */}
      <button
        onClick={handlePlayLetterPhonics}
        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-amber-50 text-orange-600 font-black shadow-lg active:scale-95 transition-all text-sm sm:text-base shrink-0"
      >
        <Volume2 className="w-6 h-6 animate-pulse text-rose-500" />
        <span>Bunyi Huruf H 🔊</span>
      </button>
    </div>
  );
};
