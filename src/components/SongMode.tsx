import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { audio } from '../services/audioService';
import { Play, Pause, Music, Volume2, Sparkles, Bell } from 'lucide-react';

const SONG_VERSES = [
  {
    letter: 'H',
    text: 'H untuk Harimau yang gagah mengaum!',
    sfxWord: 'Rrraawwr! 🐯',
    color: 'bg-amber-100 border-amber-300 text-amber-900',
    audioCue: 'H untuk Harimau yang gagah mengaum! Rrraawwr!',
  },
  {
    letter: 'H',
    text: 'H untuk Helikopter baling-baling berputar!',
    sfxWord: 'Wuusssh! 🚁',
    color: 'bg-sky-100 border-sky-300 text-sky-900',
    audioCue: 'H untuk Helikopter baling-baling berputar! Wuusssh!',
  },
  {
    letter: 'H',
    text: 'H untuk Hiu berenang di lautan luas!',
    sfxWord: 'Nyam-nyam! 🦈',
    color: 'bg-teal-100 border-teal-300 text-teal-900',
    audioCue: 'H untuk Hiu berenang di lautan luas! Nyam-nyam!',
  },
  {
    letter: 'H',
    text: 'H untuk Hidung mencium wangi mawar!',
    sfxWord: 'Hatsyii! 👃',
    color: 'bg-pink-100 border-pink-300 text-pink-900',
    audioCue: 'H untuk Hidung mencium wangi mawar! Hatsyii!',
  },
  {
    letter: 'H',
    text: 'H untuk Hadiah kejutan pesta kado!',
    sfxWord: 'Horeee! 🎁',
    color: 'bg-purple-100 border-purple-300 text-purple-900',
    audioCue: 'H untuk Hadiah kejutan pesta kado! Horeee!',
  },
  {
    letter: 'H',
    text: 'H untuk Hujan sejuk menyirami bumi!',
    sfxWord: 'Tik-tik-tik! 🌧️',
    color: 'bg-blue-100 border-blue-300 text-blue-900',
    audioCue: 'H untuk Hujan sejuk menyirami bumi! Tik-tik-tik!',
  },
];

export const SongMode: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIdx, setCurrentVerseIdx] = useState(0);
  const playTimeoutRef = useRef<number | null>(null);

  const startSong = async () => {
    setIsPlaying(true);
    audio.playDing();

    for (let i = 0; i < SONG_VERSES.length; i++) {
      setCurrentVerseIdx(i);
      await audio.speak(SONG_VERSES[i].audioCue, 0.9, 1.22);
      audio.playDing();
      await new Promise((r) => setTimeout(r, 450));
    }

    // Finale cheer
    await audio.speak('H besar... h kecil... kita pintar menghafal huruf Hh! Yaaay!', 0.9, 1.25);
    audio.playSuccess();
    audio.playCheer();
    setIsPlaying(false);
  };

  const stopSong = () => {
    setIsPlaying(false);
    audio.stopSpeaking();
    if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
  };

  const handleTapVerse = (idx: number) => {
    setCurrentVerseIdx(idx);
    audio.playDing();
    audio.speak(SONG_VERSES[idx].audioCue, 0.9, 1.22);
  };

  // Play playful rhythm instrument
  const playDrum = () => {
    audio.playBoing();
  };

  const playChime = () => {
    audio.playDing();
  };

  const playWhistle = () => {
    audio.playPop();
  };

  useEffect(() => {
    return () => {
      stopSong();
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4 px-3 py-2 select-none">
      {/* Header Banner */}
      <div className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white rounded-3xl p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Music className="w-8 h-8 text-white animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">Lagu Huruf Hh Ceria</h2>
            <p className="text-xs sm:text-sm text-pink-100">Bernyanyi bersama untuk mudah mengingat kosakata huruf H!</p>
          </div>
        </div>

        <button
          onClick={isPlaying ? stopSong : startSong}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-base shadow-lg transition-all active:scale-95 ${
            isPlaying
              ? 'bg-white text-rose-600 hover:bg-rose-50'
              : 'bg-amber-400 text-slate-900 hover:bg-amber-300'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          {isPlaying ? 'Berhenti' : 'Putar Lagu 🎵'}
        </button>
      </div>

      {/* Karaoke Lyrics Carousel Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SONG_VERSES.map((verse, idx) => {
          const isActive = idx === currentVerseIdx && isPlaying;
          return (
            <motion.button
              key={idx}
              onClick={() => handleTapVerse(idx)}
              animate={isActive ? { scale: [1, 1.03, 1] } : {}}
              transition={{ repeat: isActive ? Infinity : 0, duration: 1 }}
              className={`p-4 rounded-3xl border-3 text-left transition-all flex items-center gap-3 shadow-md ${
                verse.color
              } ${
                isActive
                  ? 'ring-4 ring-amber-400 bg-white scale-102 border-amber-500 shadow-xl'
                  : 'hover:bg-white/90'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-2xl text-slate-800 shrink-0 border border-slate-200">
                {verse.letter}
              </div>

              <div className="flex-1">
                <p className="font-bold text-sm sm:text-base leading-snug">{verse.text}</p>
                <span className="inline-block mt-1 font-black text-sm px-2.5 py-0.5 rounded-full bg-white/80 shadow-xs">
                  {verse.sfxWord}
                </span>
              </div>

              {isActive && <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />}
            </motion.button>
          );
        })}
      </div>

      {/* Interactive Playful Instruments for Children */}
      <div className="w-full bg-white rounded-3xl p-4 shadow-lg border-4 border-amber-200 flex flex-col items-center gap-3">
        <span className="text-xs sm:text-sm font-black text-amber-800 tracking-wide uppercase">
          🥁 Alat Musik Pengiring Lagu (Ketuk untuk Bunyi!)
        </span>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={playDrum}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 active:scale-90 text-white font-black rounded-2xl shadow-md transition-transform"
          >
            <span>🥁</span>
            <span>Kendang Dung!</span>
          </button>

          <button
            onClick={playChime}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 active:scale-90 text-amber-950 font-black rounded-2xl shadow-md transition-transform"
          >
            <Bell className="w-5 h-5" />
            <span>Bel Ting-Ting!</span>
          </button>

          <button
            onClick={playWhistle}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 active:scale-90 text-teal-950 font-black rounded-2xl shadow-md transition-transform"
          >
            <span>🫧</span>
            <span>Plop Pop!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
