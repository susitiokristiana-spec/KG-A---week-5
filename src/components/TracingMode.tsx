import React, { useState, useRef, useEffect } from 'react';
import { audio } from '../services/audioService';
import { Eraser, CheckCircle2, RotateCcw, Volume2, Sparkles } from 'lucide-react';

interface Props {
  onSuccess: () => void;
}

const BRUSH_COLORS = [
  { id: 'rainbow', name: 'Pelangi', color: '#F43F5E', isRainbow: true },
  { id: 'blue', name: 'Biru', color: '#0284C7', isRainbow: false },
  { id: 'amber', name: 'Emas', color: '#F59E0B', isRainbow: false },
  { id: 'green', name: 'Hijau', color: '#10B981', isRainbow: false },
  { id: 'purple', name: 'Ungu', color: '#8B5CF6', isRainbow: false },
];

export const TracingMode: React.FC<Props> = ({ onSuccess }) => {
  const [selectedCase, setSelectedCase] = useState<'upper' | 'lower'>('upper');
  const [currentColor, setCurrentColor] = useState(BRUSH_COLORS[0]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const rainbowHueRef = useRef(0);

  // Play instructions based on case
  const speakGuide = (c: 'upper' | 'lower') => {
    if (c === 'upper') {
      audio.speak(
        'Huruf H besar! Pertama, tarik garis turun di kiri (satu)... tarik garis turun di kanan (dua)... lalu hubungkan garis di tengah (tiga)!',
        0.86,
        1.15
      );
    } else {
      audio.speak(
        'Huruf h kecil! Tarik garis tegak panjang dari atas ke bawah... lalu buat lengkungan bukit ke kanan!',
        0.86,
        1.15
      );
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setIsCompleted(false);
    audio.playDing();
  };

  // Switch uppercase / lowercase
  const handleSelectCase = (c: 'upper' | 'lower') => {
    setSelectedCase(c);
    clearCanvas();
    speakGuide(c);
  };

  // Drawing event handlers
  const startDrawing = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    setHasDrawn(true);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 22; // thick child-friendly brush

    audio.playDing();
  };

  const draw = (x: number, y: number) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (currentColor.isRainbow) {
      rainbowHueRef.current = (rainbowHueRef.current + 5) % 360;
      ctx.strokeStyle = `hsl(${rainbowHueRef.current}, 90%, 55%)`;
    } else {
      ctx.strokeStyle = currentColor.color;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    startDrawing(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    draw(e.clientX - rect.left, e.clientY - rect.top);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      draw(touch.clientX - rect.left, touch.clientY - rect.top);
    }
  };

  const handleFinish = () => {
    setIsCompleted(true);
    audio.playSuccess();
    audio.playCheer();
    audio.speak('HOREEE! Tulisan huruf H kamu rapi dan bagus sekali! Hebat!', 0.9, 1.25);
    onSuccess();
  };

  useEffect(() => {
    speakGuide(selectedCase);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4 px-3 py-2 select-none">
      {/* Mode Navigation & Case Switcher */}
      <div className="w-full bg-white rounded-3xl p-4 shadow-lg border-4 border-amber-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectCase('upper')}
            className={`px-5 py-2 rounded-2xl font-black text-xl transition-all ${
              selectedCase === 'upper'
                ? 'bg-amber-500 text-white shadow-md scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-amber-50'
            }`}
          >
            H (Besar)
          </button>
          <button
            onClick={() => handleSelectCase('lower')}
            className={`px-5 py-2 rounded-2xl font-black text-xl transition-all ${
              selectedCase === 'lower'
                ? 'bg-amber-500 text-white shadow-md scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-amber-50'
            }`}
          >
            h (Kecil)
          </button>
        </div>

        <button
          onClick={() => speakGuide(selectedCase)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-2xl text-sm"
        >
          <Volume2 className="w-4 h-4" />
          Dengar Panduan
        </button>
      </div>

      {/* Tracing Canvas Area */}
      <div className="relative w-full max-w-md h-[380px] sm:h-[420px] bg-amber-50/50 rounded-3xl border-4 border-dashed border-amber-300 shadow-xl overflow-hidden flex items-center justify-center">
        {/* Background Stroke Template Guide */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none">
          {selectedCase === 'upper' ? (
            /* Dotted Uppercase H with Step Numbers */
            <svg viewBox="0 0 300 360" className="w-full h-full p-4">
              {/* Vertical Left Line (1) */}
              <line
                x1="80"
                y1="50"
                x2="80"
                y2="310"
                stroke="#CBD5E1"
                strokeWidth="24"
                strokeDasharray="14 14"
                strokeLinecap="round"
              />
              {/* Step 1 badge */}
              <circle cx="80" cy="40" r="18" fill="#F59E0B" />
              <text x="80" y="46" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold">
                1 ↓
              </text>

              {/* Vertical Right Line (2) */}
              <line
                x1="220"
                y1="50"
                x2="220"
                y2="310"
                stroke="#CBD5E1"
                strokeWidth="24"
                strokeDasharray="14 14"
                strokeLinecap="round"
              />
              {/* Step 2 badge */}
              <circle cx="220" cy="40" r="18" fill="#3B82F6" />
              <text x="220" y="46" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold">
                2 ↓
              </text>

              {/* Horizontal Connecting Crossbar (3) */}
              <line
                x1="80"
                y1="180"
                x2="220"
                y2="180"
                stroke="#CBD5E1"
                strokeWidth="24"
                strokeDasharray="14 14"
                strokeLinecap="round"
              />
              {/* Step 3 badge */}
              <circle cx="150" cy="180" r="18" fill="#EC4899" />
              <text x="150" y="186" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold">
                3 →
              </text>
            </svg>
          ) : (
            /* Dotted Lowercase h with Step Numbers */
            <svg viewBox="0 0 300 360" className="w-full h-full p-4">
              {/* Vertical Tall Stem (1) */}
              <line
                x1="90"
                y1="40"
                x2="90"
                y2="310"
                stroke="#CBD5E1"
                strokeWidth="24"
                strokeDasharray="14 14"
                strokeLinecap="round"
              />
              {/* Step 1 badge */}
              <circle cx="90" cy="35" r="18" fill="#F59E0B" />
              <text x="90" y="41" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold">
                1 ↓
              </text>

              {/* Arch Hump to the right (2) */}
              <path
                d="M90 190 Q150 140 200 190 L200 310"
                stroke="#CBD5E1"
                strokeWidth="24"
                strokeDasharray="14 14"
                fill="none"
                strokeLinecap="round"
              />
              {/* Step 2 badge */}
              <circle cx="150" cy="145" r="18" fill="#10B981" />
              <text x="150" y="151" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold">
                2 ↷
              </text>
            </svg>
          )}
        </div>

        {/* Foreground Interactive Paint Canvas */}
        <canvas
          ref={canvasRef}
          width={360}
          height={400}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={stopDrawing}
          className="relative z-10 w-full h-full cursor-crosshair touch-none"
        />

        {/* Completion Star Badge */}
        {isCompleted && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center z-20 pointer-events-none">
            <Sparkles className="w-20 h-20 text-amber-500 fill-amber-400 animate-pop-star" />
            <h3 className="text-3xl font-black text-amber-700 mt-2">HEBAT SEKALI! ⭐</h3>
            <p className="text-slate-600 font-bold">Tulisan huruf H kamu sangat rapi!</p>
          </div>
        )}
      </div>

      {/* Brush Palette Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 mr-1">Warna Kuas:</span>
        {BRUSH_COLORS.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              setCurrentColor(b);
              audio.playDing();
            }}
            style={{ backgroundColor: b.color }}
            className={`w-9 h-9 rounded-full shadow-md transition-transform active:scale-90 ${
              currentColor.id === b.id ? 'ring-4 ring-amber-400 scale-110' : ''
            }`}
            title={b.name}
          />
        ))}

        <button
          onClick={clearCanvas}
          className="ml-2 flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl active:scale-95 text-xs"
          title="Hapus Tulisan"
        >
          <Eraser className="w-4 h-4" />
          Hapus
        </button>
      </div>

      {/* Bottom Submit Action */}
      <div className="flex gap-3">
        <button
          onClick={handleFinish}
          disabled={!hasDrawn}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-base shadow-lg transition-all ${
            hasDrawn
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 active:scale-95 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          Selesai Menulis! ⭐
        </button>

        <button
          onClick={clearCanvas}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 active:scale-95 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Ulangi
        </button>
      </div>
    </div>
  );
};
