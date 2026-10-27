/**
 * @license
 * Petualangan Huruf Hh - Game Belajar Anak TK A
 * Developed for early kindergarten (TK A) with large visuals, voice narrations, and rich interactions.
 */

import React, { useState, useEffect } from 'react';
import { GameMode, StickerReward } from './types';
import { VOCABULARY_LIST, INITIAL_STICKERS } from './data/vocabulary';
import { audio } from './services/audioService';
import { Navbar } from './components/Navbar';
import { LetterIntroBanner } from './components/LetterIntroBanner';
import { ExploreMode } from './components/ExploreMode';
import { QuizMode } from './components/QuizMode';
import { BubbleMode } from './components/BubbleMode';
import { TracingMode } from './components/TracingMode';
import { SongMode } from './components/SongMode';
import { ClassroomMode } from './components/ClassroomMode';
import { StickerAlbumModal } from './components/StickerAlbumModal';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('explore');
  const [totalStars, setTotalStars] = useState<number>(0);
  const [stickers, setStickers] = useState<StickerReward[]>(INITIAL_STICKERS);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isMusicOn, setIsMusicOn] = useState(false); // off by default until child/teacher taps

  // Load saved progress from localStorage if available
  useEffect(() => {
    try {
      const savedStars = localStorage.getItem('hurufH_stars');
      if (savedStars) setTotalStars(parseInt(savedStars, 10));

      const savedStickers = localStorage.getItem('hurufH_stickers');
      if (savedStickers) {
        const parsed = JSON.parse(savedStickers);
        setStickers(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const addStar = (amount: number = 1) => {
    setTotalStars((prev) => {
      const updated = prev + amount;
      try {
        localStorage.setItem('hurufH_stars', String(updated));
      } catch {}
      return updated;
    });
  };

  const unlockSticker = (vocabId: string) => {
    setStickers((prev) => {
      const updated = prev.map((stk) => {
        if (stk.vocabId === vocabId && !stk.unlocked) {
          audio.playSuccess();
          return { ...stk, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return stk;
      });
      try {
        localStorage.setItem('hurufH_stickers', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleRewardStar = (vocabId: string) => {
    addStar(1);
    unlockSticker(vocabId);
  };

  const toggleSound = () => {
    const next = !isSoundOn;
    setIsSoundOn(next);
    audio.setSoundEnabled(next);
    if (next) audio.playDing();
  };

  const toggleMusic = () => {
    const next = !isMusicOn;
    setIsMusicOn(next);
    audio.setMusicEnabled(next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/40 to-yellow-50 flex flex-col font-sans text-slate-800">
      {/* Top Navigation */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        totalStars={totalStars}
        onOpenStickers={() => setIsAlbumOpen(true)}
        isSoundOn={isSoundOn}
        onToggleSound={toggleSound}
        isMusicOn={isMusicOn}
        onToggleMusic={toggleMusic}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-4 flex flex-col gap-4">
        {/* Letter H & h Overview Showcase Banner */}
        <LetterIntroBanner />

        {/* Dynamic Mode Content */}
        <section className="w-full transition-all duration-300">
          {currentMode === 'explore' && (
            <ExploreMode
              vocabList={VOCABULARY_LIST}
              onRewardStar={handleRewardStar}
            />
          )}

          {currentMode === 'quiz' && (
            <QuizMode
              vocabList={VOCABULARY_LIST}
              onCorrectAnswer={handleRewardStar}
            />
          )}

          {currentMode === 'classroom' && (
            <ClassroomMode
              onRewardGlobalStar={() => addStar(1)}
            />
          )}

          {currentMode === 'bubbles' && (
            <BubbleMode
              onRewardBonus={() => {
                addStar(5);
                audio.playCheer();
              }}
            />
          )}

          {currentMode === 'trace' && (
            <TracingMode
              onSuccess={() => {
                addStar(2);
                audio.playSuccess();
              }}
            />
          )}

          {currentMode === 'song' && <SongMode />}
        </section>
      </main>

      {/* Footer Info for Teachers and Parents */}
      <footer className="w-full py-4 px-4 text-center text-xs text-slate-500 border-t border-amber-200 bg-white/70">
        <p className="font-semibold text-amber-900">
          ✨ Dirancang khusus untuk pembelajaran anak TK A · Pengenalan Huruf Hh & Kosakata Bahasa Indonesia
        </p>
        <p className="mt-0.5 text-slate-400">
          Visual Besar · Suara Jelas · Interaksi Mandiri yang Menyenangkan
        </p>
      </footer>

      {/* Sticker Album Modal */}
      <StickerAlbumModal
        isOpen={isAlbumOpen}
        onClose={() => setIsAlbumOpen(false)}
        stickers={stickers}
        totalStars={totalStars}
      />
    </div>
  );
}
