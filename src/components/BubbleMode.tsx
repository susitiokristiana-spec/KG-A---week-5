import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../services/audioService';
import { Trophy, Play, RotateCcw, Volume2, Sparkles } from 'lucide-react';

interface Props {
  onRewardBonus: () => void;
}

interface Balloon {
  id: number;
  letter: string;
  isTarget: boolean;
  x: number; // percentage 10% - 85%
  y: number; // percentage
  speed: number;
  color: string;
  size: number;
}

const BALLOON_COLORS = [
  'bg-red-400 border-red-500 text-white',
  'bg-amber-400 border-amber-500 text-white',
  'bg-emerald-400 border-emerald-500 text-white',
  'bg-sky-400 border-sky-500 text-white',
  'bg-purple-400 border-purple-500 text-white',
  'bg-pink-400 border-pink-500 text-white',
];

export const BubbleMode: React.FC<Props> = ({ onRewardBonus }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const [hasWonTrophy, setHasWonTrophy] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const animationFrameRef = useRef<number | null>(null);

  // Spawn initial balloons
  const spawnBalloon = (): Balloon => {
    const isTarget = Math.random() < 0.65; // 65% target H or h
    const letter = isTarget
      ? Math.random() < 0.5 ? 'H' : 'h'
      : ['A', 'B', 'M', 'O', 'K', 'T'][Math.floor(Math.random() * 6)];

    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];

    return {
      id: Date.now() + Math.random(),
      letter,
      isTarget,
      x: 10 + Math.random() * 75,
      y: 105, // start below viewport
      speed: 0.18 + Math.random() * 0.12, // gentle kindergarten speed
      color,
      size: 72 + Math.floor(Math.random() * 20),
    };
  };

  useEffect(() => {
    // Initial batch
    setBalloons([
      { ...spawnBalloon(), y: 30 },
      { ...spawnBalloon(), y: 55 },
      { ...spawnBalloon(), y: 80 },
    ]);

    audio.speak('Ayo pecahkan balon yang bertuliskan huruf H besar dan h kecil ya!', 0.88, 1.15);
  }, []);

  // Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    let lastSpawn = Date.now();

    const loop = () => {
      const now = Date.now();

      // Spawn periodically if less than 6 balloons
      if (now - lastSpawn > 1800) {
        lastSpawn = now;
        setBalloons((prev) => {
          if (prev.length < 6) {
            return [...prev, spawnBalloon()];
          }
          return prev;
        });
      }

      // Move balloons upward
      setBalloons((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y > -20) // remove after exiting top
      );

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  const handlePop = (balloon: Balloon) => {
    if (balloon.isTarget) {
      audio.playPop();
      audio.playDing();

      if (balloon.letter === 'H') {
        audio.speak('H besar!', 0.95, 1.3);
      } else {
        audio.speak('h kecil!', 0.95, 1.3);
      }

      const nextCount = poppedCount + 1;
      setPoppedCount(nextCount);
      setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));

      if (nextCount === 10 && !hasWonTrophy) {
        setHasWonTrophy(true);
        audio.playSuccess();
        audio.playCheer();
        audio.speak('HOREEE! Kamu berhasil meletuskan 10 balon huruf H! Hebat sekali!', 0.9, 1.2);
        onRewardBonus();
      }
    } else {
      audio.playBoing();
      audio.speak(`Itu huruf ${balloon.letter} sayang. Cari balon huruf H atau h ya!`, 0.9, 1.15);
    }
  };

  const handleReset = () => {
    setPoppedCount(0);
    setHasWonTrophy(false);
    setBalloons([spawnBalloon(), spawnBalloon(), spawnBalloon()]);
    audio.playDing();
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4 px-3 py-2 select-none">
      {/* Game Status Bar */}
      <div className="w-full bg-white rounded-3xl p-4 shadow-lg border-4 border-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 font-black text-2xl border border-amber-300">
            Hh
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Pecahkan Balon Huruf H & h</h2>
            <p className="text-xs text-slate-500">Sentuh balon yang memiliki huruf H atau h!</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-2xl font-black text-lg shadow-sm">
            <span>🎈</span>
            <span>{poppedCount}</span>
          </div>

          <button
            onClick={() => audio.speak('Cari dan sentuh balon dengan huruf H besar atau h kecil!', 0.88, 1.2)}
            className="p-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl"
            title="Dengarkan Petunjuk"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Balloon Play Sky Arena */}
      <div className="relative w-full h-[420px] sm:h-[460px] bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 rounded-3xl border-4 border-sky-300 shadow-xl overflow-hidden">
        {/* Sky Clouds */}
        <div className="absolute top-4 left-6 text-white/70 text-5xl pointer-events-none">☁️</div>
        <div className="absolute top-12 right-8 text-white/70 text-4xl pointer-events-none">☁️</div>
        <div className="absolute top-36 left-1/2 text-white/50 text-3xl pointer-events-none">☁️</div>

        {/* Floating Balloons */}
        {balloons.map((b) => (
          <button
            key={b.id}
            onClick={() => handlePop(b)}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.size}px`,
              height: `${b.size * 1.25}px`,
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-[50%_50%_50%_50%/40%_40%_60%_60%] border-4 shadow-xl active:scale-125 transition-transform duration-75 cursor-pointer z-20 ${b.color}`}
          >
            {/* Balloon Gloss Highlight */}
            <div className="w-2.5 h-6 rounded-full bg-white/50 absolute top-2 left-3 rotate-12" />

            {/* Letter on Balloon */}
            <span className="text-3xl sm:text-4xl font-black drop-shadow-md select-none font-sans">
              {b.letter}
            </span>

            {/* Balloon knot and string */}
            <div className="absolute -bottom-2 w-3 h-2 bg-inherit border-2 border-inherit rounded-sm" />
            <div className="absolute -bottom-6 w-0.5 h-5 bg-white/70" />
          </button>
        ))}

        {/* Trophy Celebration Overlay upon reaching 10 */}
        <AnimatePresence>
          {hasWonTrophy && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center p-6 z-40 text-center"
            >
              <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-400 flex flex-col items-center max-w-sm">
                <Trophy className="w-20 h-20 text-amber-500 fill-amber-400 animate-bounce mb-2" />
                <h3 className="text-2xl font-black text-slate-800">JUARA BALON HURUF H!</h3>
                <p className="text-sm text-slate-600 mt-1 mb-4 font-medium">
                  Kamu berhasil memecahkan 10 balon huruf Hh dengan sangat teliti!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-md active:scale-95 flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Main Lagi!
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-amber-50 text-slate-700 font-bold rounded-2xl border-2 border-slate-200 active:scale-95 shadow-sm text-sm"
        >
          <Play className="w-4 h-4" />
          {isPlaying ? 'Jeda Game' : 'Lanjut Main'}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-amber-50 text-slate-700 font-bold rounded-2xl border-2 border-slate-200 active:scale-95 shadow-sm text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Ulangi Permainan
        </button>
      </div>
    </div>
  );
};
