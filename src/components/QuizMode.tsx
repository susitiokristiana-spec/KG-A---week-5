import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VocabItem } from '../types';
import { VOCABULARY_LIST_F, VOCABULARY_LIST_G } from '../data/vocabulary';
import { audio } from '../services/audioService';
import { Volume2, Star, CheckCircle, RotateCcw, Award, Sparkles } from 'lucide-react';

interface Props {
  vocabList: VocabItem[]; // Letter H vocabulary list
  onCorrectAnswer: (vocabId: string) => void;
}

export const QuizMode: React.FC<Props> = ({ vocabList, onCorrectAnswer }) => {
  const [targetLetter, setTargetLetter] = useState<'H' | 'F' | 'G'>('H');
  const [targetItem, setTargetItem] = useState<VocabItem>(vocabList[0]);
  const [currentOptions, setCurrentOptions] = useState<VocabItem[]>([]);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; show: boolean; tappedItem?: VocabItem } | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [quizFilter, setQuizFilter] = useState<'only_h' | 'random_fgh'>('only_h');

  // Generate a comparative question with 1 from F, 1 from G, 1 from H
  const generateComparativeQuestion = (
    forcedTargetLetter?: 'H' | 'F' | 'G',
    previousTargetId?: string
  ) => {
    // Determine which letter to ask for:
    // If 'only_h', always ask to find H (comparing against F & G distractors)
    // If 'random_fgh', can randomly ask for F, G, or H
    let chosenLetter: 'H' | 'F' | 'G' = 'H';
    if (forcedTargetLetter) {
      chosenLetter = forcedTargetLetter;
    } else if (quizFilter === 'random_fgh') {
      const letters: ('H' | 'F' | 'G')[] = ['H', 'H', 'F', 'G']; // slight bias to H
      chosenLetter = letters[Math.floor(Math.random() * letters.length)];
    }

    setTargetLetter(chosenLetter);

    // Pick 1 random item from each letter pool
    const availableH = vocabList.filter((item) => item.id !== previousTargetId);
    const itemH = availableH[Math.floor(Math.random() * availableH.length)] || vocabList[0];

    const itemF = VOCABULARY_LIST_F[Math.floor(Math.random() * VOCABULARY_LIST_F.length)];
    const itemG = VOCABULARY_LIST_G[Math.floor(Math.random() * VOCABULARY_LIST_G.length)];

    // Target is whichever corresponds to chosenLetter
    let target = itemH;
    if (chosenLetter === 'F') target = itemF;
    if (chosenLetter === 'G') target = itemG;

    // Shuffle the 3 options (1 from F, 1 from G, 1 from H)
    const options = [itemH, itemF, itemG].sort(() => 0.5 - Math.random());

    setTargetItem(target);
    setCurrentOptions(options);
    setFeedback(null);

    // Audio prompt with slight delay
    setTimeout(() => {
      speakQuestionPrompt(target, chosenLetter);
    }, 300);
  };

  const speakQuestionPrompt = (target: VocabItem, letter: 'H' | 'F' | 'G') => {
    if (letter === 'H') {
      audio.speak(
        `Perhatikan gambar! Mana benda yang berawalan huruf H? Coba cari gambar ${target.word}!`,
        0.88,
        1.18
      );
    } else if (letter === 'F') {
      audio.speak(
        `Perhatikan gambar! Mana benda yang berawalan huruf F? Coba cari gambar ${target.word}!`,
        0.88,
        1.18
      );
    } else {
      audio.speak(
        `Perhatikan gambar! Mana benda yang berawalan huruf G? Coba cari gambar ${target.word}!`,
        0.88,
        1.18
      );
    }
  };

  useEffect(() => {
    generateComparativeQuestion('H');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizFilter]);

  const handleSelectOption = (selected: VocabItem) => {
    if (feedback?.show) return; // prevent spamming while animating

    if (selected.letter === targetLetter && selected.id === targetItem.id) {
      // Correct!
      audio.playSuccess();
      const praises = [
        `HEBAT SEKALI! Benar, ${selected.word} berawalan huruf ${targetLetter}!`,
        `PINTAR! Luar biasa, itu ${selected.word} huruf ${targetLetter}!`,
        `YAAAY! Kamu jago membedakan huruf F, G, dan H!`,
        `TEPAT SEKALI! ${selected.word} adalah huruf ${targetLetter}!`,
      ];
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];
      audio.speak(randomPraise, 0.9, 1.25);

      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      setFeedback({ isCorrect: true, show: true, tappedItem: selected });

      if (selected.letter === 'H') {
        onCorrectAnswer(selected.id);
      }

      setTimeout(() => {
        generateComparativeQuestion(undefined, targetItem.id);
      }, 1800);
    } else {
      // Wrong option chosen -> Explain which letter was tapped to educate child
      audio.playBoing();
      audio.speak(
        `Itu gambar ${selected.word}, berawalan huruf ${selected.letter}. Yang dicari adalah huruf ${targetLetter} (${targetItem.word}) ya sayang! Ayo coba lagi!`,
        0.88,
        1.15
      );
      setFeedback({ isCorrect: false, show: true, tappedItem: selected });
      setTimeout(() => {
        setFeedback(null);
      }, 1600);
    }
  };

  const handleLetterHeaderSound = (letter: 'F' | 'G' | 'H') => {
    audio.playDing();
    if (letter === 'F') {
      audio.speak('Huruf F! Contohnya: Flamingo, Foto, Futsal, dan Feri!', 0.88, 1.2);
    } else if (letter === 'G') {
      audio.speak('Huruf G! Contohnya: Gajah, Gitar, Gurita, dan Gigi!', 0.88, 1.2);
    } else {
      audio.speak('Huruf H! Contohnya: Harimau, Helikopter, Hiu, Hidung, Hadiah, dan Hujan!', 0.88, 1.2);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-5 px-3 py-2 select-none">
      {/* Top Banner: Letter Comparison Showcase (F - G - H) */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 shadow-lg border-4 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800">
              Tebak Gambar: Bandingkan Huruf F, G, dan H
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Bedakan gambar huruf <span className="font-bold text-rose-600">F</span>,{' '}
              <span className="font-bold text-indigo-600">G</span>, dan{' '}
              <span className="font-bold text-amber-600">H</span>!
            </p>
          </div>
        </div>

        {/* Comparison Letter Badges (Tap to Listen) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleLetterHeaderSound('F')}
            className="flex flex-col items-center px-3 py-1.5 rounded-2xl bg-rose-50 border-2 border-rose-300 hover:bg-rose-100 active:scale-95 transition-transform"
            title="Dengarkan huruf F"
          >
            <span className="text-xs font-bold text-rose-500">Huruf</span>
            <span className="text-xl font-black text-rose-700">F</span>
          </button>

          <span className="text-slate-300 font-black text-lg">→</span>

          <button
            onClick={() => handleLetterHeaderSound('G')}
            className="flex flex-col items-center px-3 py-1.5 rounded-2xl bg-indigo-50 border-2 border-indigo-300 hover:bg-indigo-100 active:scale-95 transition-transform"
            title="Dengarkan huruf G"
          >
            <span className="text-xs font-bold text-indigo-500">Huruf</span>
            <span className="text-xl font-black text-indigo-700">G</span>
          </button>

          <span className="text-slate-300 font-black text-lg">→</span>

          <button
            onClick={() => handleLetterHeaderSound('H')}
            className="flex flex-col items-center px-3.5 py-1.5 rounded-2xl bg-amber-100 border-2 border-amber-400 hover:bg-amber-200 active:scale-95 transition-transform shadow-xs"
            title="Dengarkan huruf H"
          >
            <span className="text-xs font-bold text-amber-600">Huruf</span>
            <span className="text-xl font-black text-amber-800">H ⭐</span>
          </button>

          {/* Star Counter */}
          <div className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 text-white rounded-2xl font-black text-base shadow-sm ml-2">
            <Star className="w-5 h-5 fill-white text-white" />
            <span>{score}</span>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs (Fokus Huruf H vs Acak F-G-H) */}
      <div className="flex items-center gap-2 p-1.5 bg-amber-100/80 rounded-2xl border border-amber-200">
        <button
          onClick={() => setQuizFilter('only_h')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            quizFilter === 'only_h'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-amber-900 hover:bg-amber-200/50'
          }`}
        >
          🎯 Cari Huruf H (Bandingkan F & G)
        </button>
        <button
          onClick={() => setQuizFilter('random_fgh')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            quizFilter === 'random_fgh'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-amber-900 hover:bg-amber-200/50'
          }`}
        >
          🎲 Tebak Campuran (Huruf F, G, atau H)
        </button>
      </div>

      {/* Main Question Card */}
      <div className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col items-center gap-3 text-center border-4 border-amber-300">
        <span className="text-xs sm:text-sm font-black tracking-wide uppercase bg-black/20 px-4 py-1 rounded-full">
          Tantangan Tebak Gambar
        </span>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <h3 className="text-2xl sm:text-4xl font-black tracking-wide">
            "Mana gambar yang berawalan huruf{' '}
            <span className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-white text-orange-600 rounded-2xl text-3xl sm:text-4xl shadow-md border-2 border-orange-200 mx-1">
              {targetLetter}
            </span>
            ?"
          </h3>
        </div>

        <p className="text-sm sm:text-base font-bold text-amber-100">
          Cari gambar: <span className="underline decoration-wavy decoration-white font-black text-white">{targetItem.word}</span>!
        </p>

        <button
          onClick={() => speakQuestionPrompt(targetItem, targetLetter)}
          className="flex items-center gap-2 px-6 py-2.5 bg-white text-orange-600 font-black rounded-2xl shadow-md hover:bg-orange-50 active:scale-95 transition-all text-base sm:text-lg mt-1"
        >
          <Volume2 className="w-6 h-6 animate-pulse" />
          Dengarkan Suara Pertanyaan 🔊
        </button>
      </div>

      {/* 3 Comparative Options (1 from F, 1 from G, 1 from H) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        {currentOptions.map((option) => {
          const isTargetOption = option.id === targetItem.id && option.letter === targetLetter;
          const letterBg =
            option.letter === 'F'
              ? 'bg-rose-500 text-white'
              : option.letter === 'G'
              ? 'bg-indigo-500 text-white'
              : 'bg-amber-500 text-white';

          const cardBorder =
            feedback?.show && feedback.isCorrect && isTargetOption
              ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300 scale-105'
              : feedback?.show && !feedback.isCorrect && feedback.tappedItem?.id === option.id
              ? 'border-rose-400 bg-rose-50'
              : 'border-amber-200 hover:border-amber-400 bg-white hover:bg-amber-50/50';

          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectOption(option)}
              className={`relative flex flex-col items-center justify-center p-6 rounded-3xl border-4 shadow-lg transition-all cursor-pointer min-h-[220px] ${cardBorder}`}
            >
              {/* Prominent Initial Letter Badge in top corner */}
              <div
                className={`absolute top-4 left-4 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xl shadow-md ${letterBg}`}
              >
                {option.letter}
              </div>

              {/* Big Illustration / Emoji */}
              <span className="text-7xl sm:text-8xl my-3 drop-shadow-md select-none">
                {option.emoji}
              </span>

              {/* Word Display with initial letter highlighted */}
              <div className="flex items-center text-2xl font-black text-slate-800 tracking-wide mt-1">
                <span className="text-3xl text-orange-600 underline decoration-4 mr-0.5">
                  {option.word[0]}
                </span>
                <span>{option.word.slice(1)}</span>
              </div>

              {/* Category / Phonics hint */}
              <span className="text-xs font-semibold text-slate-500 mt-1">
                {option.category} · Huruf {option.letter}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback Alert Overlay */}
      <AnimatePresence>
        {feedback?.show && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`w-full max-w-lg p-4 rounded-3xl font-black text-center shadow-lg text-lg flex items-center justify-center gap-3 ${
              feedback.isCorrect
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-400 text-amber-950'
            }`}
          >
            {feedback.isCorrect ? (
              <>
                <CheckCircle className="w-8 h-8 text-white shrink-0" />
                <span>HEBAT SEKALI! {feedback.tappedItem?.word} BERAWALAN HURUF {targetLetter}! 🎉</span>
              </>
            ) : (
              <>
                <span className="text-2xl">💡</span>
                <span>
                  Itu {feedback.tappedItem?.word} (Huruf {feedback.tappedItem?.letter}). Cari yang huruf {targetLetter} ya!
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Question Control */}
      <div className="flex items-center gap-3 mt-1">
        <button
          onClick={() => generateComparativeQuestion()}
          className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-amber-50 text-slate-700 font-bold rounded-2xl border-2 border-slate-200 active:scale-95 shadow-sm text-sm"
        >
          <RotateCcw className="w-4 h-4 text-amber-500" />
          Ganti Gambar Perbandingan Lain
        </button>
      </div>

      {/* Pedagogical helper tip for teachers */}
      <div className="w-full max-w-lg bg-amber-50 rounded-2xl p-3 border border-amber-200 text-center text-xs text-amber-900 font-medium">
        💡 <span className="font-bold">Tips Belajar TK A:</span> Setiap putaran selalu membandingkan 1 gambar huruf <span className="font-bold text-rose-600">F</span>, 1 gambar huruf <span className="font-bold text-indigo-600">G</span>, dan 1 gambar huruf <span className="font-bold text-amber-600">H</span> agar anak paham urutan dan perbedaan bentuk huruf!
      </div>
    </div>
  );
};
