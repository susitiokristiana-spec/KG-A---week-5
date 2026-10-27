import React from 'react';
import { GameMode } from '../types';
import { audio } from '../services/audioService';
import { Star, Trophy, Volume2, VolumeX, Music, Compass, HelpCircle, Pencil, PlayCircle, Users } from 'lucide-react';

interface Props {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  totalStars: number;
  onOpenStickers: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  isMusicOn: boolean;
  onToggleMusic: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentMode,
  onSelectMode,
  totalStars,
  onOpenStickers,
  isSoundOn,
  onToggleSound,
  isMusicOn,
  onToggleMusic,
}) => {
  const modes: { id: GameMode; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'explore', label: 'Jelajah Hh', icon: <Compass className="w-5 h-5" />, color: 'hover:text-amber-600' },
    { id: 'quiz', label: 'Tebak Gambar', icon: <HelpCircle className="w-5 h-5" />, color: 'hover:text-orange-600' },
    { id: 'classroom', label: 'Game 17 Anak', icon: <Users className="w-5 h-5" />, color: 'hover:text-purple-600' },
    { id: 'bubbles', label: 'Balon Huruf', icon: <span>🎈</span>, color: 'hover:text-sky-600' },
    { id: 'trace', label: 'Jiplak Huruf', icon: <Pencil className="w-5 h-5" />, color: 'hover:text-emerald-600' },
    { id: 'song', label: 'Lagu Ceria', icon: <PlayCircle className="w-5 h-5" />, color: 'hover:text-pink-600' },
  ];

  const handleModeClick = (mode: GameMode, label: string) => {
    audio.playDing();
    audio.speak(`Mode ${label}!`, 0.95, 1.2);
    onSelectMode(mode);
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b-2 border-amber-200 sticky top-0 z-40 px-3 py-2 shadow-xs select-none">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Top bar on small screens: Mode tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto py-1 justify-center">
          {modes.map((m) => {
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleModeClick(m.id, m.label)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-md scale-102 ring-2 ring-amber-300'
                    : 'bg-amber-50/70 text-slate-700 hover:bg-amber-100'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right side utility icons (Star count, Sticker Album, Sound, Music) */}
        <div className="flex items-center gap-2">
          {/* Star Counter */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 rounded-2xl border border-amber-200 shadow-2xs">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400 animate-spin-slow" />
            <span className="font-black text-amber-800 text-sm sm:text-base">{totalStars}</span>
          </div>

          {/* Sticker Album Button */}
          <button
            onClick={() => {
              audio.playDing();
              onOpenStickers();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-2xl shadow-xs active:scale-95 text-xs sm:text-sm hover:from-purple-600"
            title="Buka Album Stiker Koleksi"
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Koleksi</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-2xl border transition-all active:scale-90 ${
              isSoundOn
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={isSoundOn ? 'Matikan Suara Narasi' : 'Nyalakan Suara Narasi'}
            aria-label="Sound Toggle"
          >
            {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Music Toggle */}
          <button
            onClick={onToggleMusic}
            className={`p-2 rounded-2xl border transition-all active:scale-90 ${
              isMusicOn
                ? 'bg-rose-100 text-rose-700 border-rose-300'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={isMusicOn ? 'Matikan Musik Latar' : 'Nyalakan Musik Latar'}
            aria-label="Music Toggle"
          >
            <Music className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
