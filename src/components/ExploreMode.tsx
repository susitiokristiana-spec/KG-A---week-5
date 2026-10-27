import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VocabItem } from '../types';
import { audio } from '../services/audioService';
import { TigerIllustration } from './illustrations/TigerIllustration';
import { HelicopterIllustration } from './illustrations/HelicopterIllustration';
import { SharkIllustration } from './illustrations/SharkIllustration';
import { NoseIllustration } from './illustrations/NoseIllustration';
import { GiftIllustration } from './illustrations/GiftIllustration';
import { RainIllustration } from './illustrations/RainIllustration';
import { Volume2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface Props {
  vocabList: VocabItem[];
  onRewardStar: (vocabId: string) => void;
}

export const ExploreMode: React.FC<Props> = ({ vocabList, onRewardStar }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentVocab = vocabList[currentIndex];

  const handleNext = () => {
    audio.playDing();
    const nextIdx = (currentIndex + 1) % vocabList.length;
    setCurrentIndex(nextIdx);
    readCurrentVocab(vocabList[nextIdx]);
  };

  const handlePrev = () => {
    audio.playDing();
    const prevIdx = (currentIndex - 1 + vocabList.length) % vocabList.length;
    setCurrentIndex(prevIdx);
    readCurrentVocab(vocabList[prevIdx]);
  };

  const handleSelectVocab = (idx: number) => {
    audio.playDing();
    setCurrentIndex(idx);
    readCurrentVocab(vocabList[idx]);
  };

  const readCurrentVocab = (item: VocabItem) => {
    audio.speak(item.audioPrompt, 0.88, 1.15);
  };

  const handleSyllableClick = (syllableText: string) => {
    audio.playDing();
    audio.speak(syllableText, 0.75, 1.25);
  };

  const handleSpellWord = () => {
    audio.playDing();
    const spelling = currentVocab.word.split('').join('... ');
    audio.speak(`${spelling}... dibaca... ${currentVocab.word}!`, 0.82, 1.15);
  };

  const renderIllustration = () => {
    switch (currentVocab.id) {
      case 'harimau':
        return <TigerIllustration onInteract={() => onRewardStar(currentVocab.id)} />;
      case 'helikopter':
        return <HelicopterIllustration onInteract={() => onRewardStar(currentVocab.id)} />;
      case 'hiu':
        return <SharkIllustration onInteract={() => onRewardStar(currentVocab.id)} />;
      case 'hidung':
        return <NoseIllustration onInteract={() => onRewardStar(currentVocab.id)} />;
      case 'hadiah':
        return <GiftIllustration onInteract={() => onRewardStar(currentVocab.id)} />;
      case 'hujan':
        return <RainIllustration onInteract={() => onRewardStar(currentVocab.id)} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-5 px-3 py-2">
      {/* Top Prominent Word Card */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-amber-200 flex flex-col items-center">
        {/* Navigation & Header */}
        <div className="w-full flex items-center justify-between mb-2">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold active:scale-95 shadow-sm transition-all"
            aria-label="Kosakata Sebelumnya"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          {/* Letter H Focus Banner */}
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full font-black text-sm sm:text-base shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>KOSAKATA HURUF Hh</span>
            <span className="bg-white text-orange-600 px-2 py-0.5 rounded-full text-xs">
              {currentIndex + 1} / {vocabList.length}
            </span>
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold active:scale-95 shadow-sm transition-all"
            aria-label="Kosakata Selanjutnya"
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Word Title & Big Letter H Spotlight */}
        <div className="flex flex-col items-center gap-2 text-center my-1">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-red-500 to-rose-400 text-white text-3xl sm:text-4xl font-black rounded-2xl shadow-md border-2 border-white">
              H
            </span>
            <span className="text-3xl sm:text-5xl font-black tracking-wide text-slate-800">
              {currentVocab.word}
            </span>
            <button
              onClick={() => readCurrentVocab(currentVocab)}
              className="p-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-2xl shadow-md transition-all"
              title="Dengarkan Suara"
            >
              <Volume2 className="w-7 h-7" />
            </button>
          </div>

          {/* Syllable Breakdown (Suku Kata) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 mr-1">Eja Suku Kata:</span>
            {currentVocab.syllables.map((syl, sIdx) => (
              <button
                key={sIdx}
                onClick={() => handleSyllableClick(syl.text)}
                className={`px-3.5 py-1.5 rounded-xl font-black text-lg sm:text-xl shadow-sm hover:scale-105 active:scale-95 transition-all ${syl.color}`}
                title={`Ketuk untuk mengeja "${syl.text}"`}
              >
                {syl.text}
              </button>
            ))}

            <button
              onClick={handleSpellWord}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl active:scale-95 transition-all"
            >
              🔤 Eja Huruf
            </button>
          </div>
        </div>

        {/* Big Illustration Area */}
        <div className="w-full my-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVocab.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              {renderIllustration()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Short Fun Fact & Child Prompt */}
        <div className="w-full max-w-lg bg-amber-50 rounded-2xl p-3 border border-amber-200 text-center">
          <p className="text-sm sm:text-base text-amber-900 font-medium">
            "{currentVocab.shortDescription}"
          </p>
        </div>
      </div>

      {/* Vocabulary Carousel Thumbnails */}
      <div className="w-full flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-2 px-1">
        {vocabList.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectVocab(idx)}
              className={`flex flex-col items-center gap-1 p-2 sm:p-3 rounded-2xl transition-all font-bold min-w-[70px] sm:min-w-[95px] active:scale-95 ${
                isActive
                  ? 'bg-amber-500 text-white shadow-lg scale-105 border-2 border-amber-300'
                  : 'bg-white text-slate-700 hover:bg-amber-50 shadow-sm border border-slate-200'
              }`}
            >
              <span className="text-2xl sm:text-3xl">{item.emoji}</span>
              <span className="text-xs sm:text-sm uppercase tracking-tight">{item.word}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
