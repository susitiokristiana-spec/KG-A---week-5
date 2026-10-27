import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StickerReward } from '../types';
import { audio } from '../services/audioService';
import { X, Trophy, Lock, Sparkles, Star } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stickers: StickerReward[];
  totalStars: number;
}

export const StickerAlbumModal: React.FC<Props> = ({ isOpen, onClose, stickers, totalStars }) => {
  if (!isOpen) return null;

  const handleStickerClick = (s: StickerReward) => {
    if (s.unlocked) {
      audio.playDing();
      audio.speak(`Stiker ${s.title}! Hebat, kamu sudah mengoleksinya!`, 0.9, 1.2);
    } else {
      audio.playBoing();
      audio.speak(`Stiker ini masih terkunci. Mainkan game untuk membukanya ya!`, 0.9, 1.15);
    }
  };

  const unlockedCount = stickers.filter((s) => s.unlocked).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-5 sm:p-6 flex flex-col items-center max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              audio.playDing();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 active:scale-90"
            title="Tutup Album"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Header */}
          <div className="flex flex-col items-center text-center gap-1 mb-4">
            <div className="flex items-center gap-2 text-amber-500">
              <Trophy className="w-8 h-8 fill-amber-400" />
              <h2 className="text-2xl font-black text-slate-800">Album Koleksi Huruf Hh</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Kumpulkan semua stiker dengan memainkan kosakata dan tebak gambar!
            </p>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-xs font-bold text-amber-800">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{totalStars} Bintang Dikumpulkan</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200 text-xs font-bold text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>{unlockedCount} / {stickers.length} Stiker Terbuka</span>
              </div>
            </div>
          </div>

          {/* Sticker Grid */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3 my-2">
            {stickers.map((stk) => (
              <motion.button
                key={stk.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStickerClick(stk)}
                className={`p-4 rounded-3xl border-3 flex flex-col items-center justify-center text-center transition-all ${
                  stk.unlocked
                    ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-300 shadow-md hover:scale-105'
                    : 'bg-slate-100 border-slate-200 opacity-60'
                }`}
              >
                {stk.unlocked ? (
                  <>
                    <span className="text-5xl mb-2 drop-shadow-sm">{stk.icon}</span>
                    <span className="text-sm font-black text-slate-800 leading-tight">{stk.title}</span>
                    <span className="text-xs text-amber-700 font-bold mt-1">✨ Terbuka</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                      <Lock className="w-6 h-6 text-slate-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-500">Terkunci</span>
                  </>
                )}
              </motion.button>
            ))}
          </div>

          {/* Close Action Button */}
          <button
            onClick={() => {
              audio.playDing();
              onClose();
            }}
            className="w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-2xl shadow-md hover:from-amber-600 active:scale-95 text-base"
          >
            Lanjut Bermain! 🚀
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
