import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, ClassMission } from '../types';
import { INITIAL_STUDENTS_17, CLASS_MISSIONS } from '../data/classMissions';
import { audio } from '../services/audioService';
import {
  Users,
  Star,
  Award,
  Sparkles,
  Volume2,
  CheckCircle2,
  RotateCcw,
  Edit3,
  X,
  Shuffle,
  Trophy,
} from 'lucide-react';

interface Props {
  onRewardGlobalStar: () => void;
}

export const ClassroomMode: React.FC<Props> = ({ onRewardGlobalStar }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('hurufH_students_17');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STUDENTS_17;
  });

  const [activeTab, setActiveTab] = useState<'wheel' | 'board' | 'teams'>('wheel');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentMission, setCurrentMission] = useState<ClassMission | null>(null);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editNameInput, setEditNameInput] = useState('');

  const wheelRef = useRef<SVGSVGElement | null>(null);

  // Save students to localStorage
  const saveStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    try {
      localStorage.setItem('hurufH_students_17', JSON.stringify(newStudents));
    } catch {}
  };

  // Spin the 17-student wheel
  const handleSpinWheel = () => {
    if (isSpinning) return;

    audio.playDing();
    setIsSpinning(true);
    setShowMissionModal(false);

    // Pick a random student
    const randomIndex = Math.floor(Math.random() * students.length);
    const targetStudent = students[randomIndex];

    // Compute angle
    const segmentAngle = 360 / students.length;
    // To land near middle of segment, add offset
    const randomRotations = 4 + Math.floor(Math.random() * 3); // 4-6 full rotations
    // The pointer is at top (270 deg or 0 deg). Let's target pointer at top (90 deg or 270 deg)
    const targetAngle =
      rotationAngle +
      randomRotations * 360 +
      (360 - (randomIndex * segmentAngle + segmentAngle / 2));

    setRotationAngle(targetAngle);

    // Tick sounds during spin
    for (let i = 0; i < 14; i++) {
      setTimeout(() => {
        audio.playPop();
      }, i * 220);
    }

    // Finished spinning after 3.5s
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedStudent(targetStudent);

      // Pick a fun mission
      const randomMission =
        CLASS_MISSIONS[Math.floor(Math.random() * CLASS_MISSIONS.length)];
      setCurrentMission(randomMission);
      setShowMissionModal(true);

      audio.playSuccess();
      audio.playCheer();
      audio.speak(
        `HOREEE! Giliran ${targetStudent.name}! Ayo ${targetStudent.name} maju ke depan!`,
        0.88,
        1.2
      );
    }, 3500);
  };

  // Manual selection from board
  const handleSelectStudentDirectly = (st: Student) => {
    setSelectedStudent(st);
    const randomMission =
      CLASS_MISSIONS[Math.floor(Math.random() * CLASS_MISSIONS.length)];
    setCurrentMission(randomMission);
    setShowMissionModal(true);
    audio.playDing();
    audio.speak(`Giliran ${st.name}! Ayo kita selesaikan tantangan!`, 0.88, 1.2);
  };

  // Award star to selected student
  const handleAwardStar = (studentId: number) => {
    audio.playSuccess();
    audio.playCheer();
    audio.speak(
      `HEBAT SEKALI! Bintang emas untuk ${selectedStudent?.name}! Tepuk tangan semuanya!`,
      0.9,
      1.25
    );

    const updated = students.map((s) =>
      s.id === studentId
        ? { ...s, stars: s.stars + 1, completedMission: true }
        : s
    );
    saveStudents(updated);
    onRewardGlobalStar();
    setShowMissionModal(false);
  };

  // Change mission
  const handleChangeMission = () => {
    audio.playDing();
    const available = CLASS_MISSIONS.filter(
      (m) => m.id !== currentMission?.id
    );
    const nextMission =
      available[Math.floor(Math.random() * available.length)];
    setCurrentMission(nextMission);
    audio.speak(nextMission.audioPrompt, 0.88, 1.2);
  };

  // Edit student name
  const handleOpenEdit = (st: Student) => {
    setEditingStudent(st);
    setEditNameInput(st.name);
    setIsEditModalOpen(true);
  };

  const handleSaveName = () => {
    if (!editingStudent || !editNameInput.trim()) return;
    const updated = students.map((s) =>
      s.id === editingStudent.id ? { ...s, name: editNameInput.trim() } : s
    );
    saveStudents(updated);
    setIsEditModalOpen(false);
    audio.playDing();
  };

  const handleResetAllStars = () => {
    audio.playBoing();
    const updated = students.map((s) => ({
      ...s,
      stars: 0,
      completedMission: false,
    }));
    saveStudents(updated);
  };

  const completedCount = students.filter((s) => s.completedMission).length;

  // Calculate team scores
  const teamHScores = students
    .filter((s) => s.team === 'H')
    .reduce((acc, curr) => acc + curr.stars, 0);
  const teamFScores = students
    .filter((s) => s.team === 'F')
    .reduce((acc, curr) => acc + curr.stars, 0);
  const teamGScores = students
    .filter((s) => s.team === 'G')
    .reduce((acc, curr) => acc + curr.stars, 0);

  // Wheel colors
  const segmentColors = [
    '#F59E0B',
    '#FB7185',
    '#6366F1',
    '#10B981',
    '#0EA5E9',
    '#EC4899',
    '#F97316',
    '#8B5CF6',
    '#14B8A6',
    '#EAB308',
    '#F43F5E',
    '#3B82F6',
    '#84CC16',
    '#A855F7',
    '#06B6D4',
    '#D97706',
    '#E11D48',
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-5 px-3 py-2 select-none">
      {/* Top Header Card */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 shadow-lg border-4 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md">
            17
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Game Giliran & Misi 17 Anak
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Dirancang untuk aktivitas kelas TK A: Roda giliran, tantangan seru, & papan bintang!
            </p>
          </div>
        </div>

        {/* Classroom Progress Tracker */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-slate-500">Maju ke Depan:</span>
            <div className="flex items-center gap-1.5 font-black text-amber-700 text-sm sm:text-base">
              <span>{completedCount}</span>
              <span>/</span>
              <span>17 Murid</span>
              {completedCount === 17 && <span className="text-lg">🏆</span>}
            </div>
          </div>

          <button
            onClick={() => {
              audio.playDing();
              audio.speak(
                `Ada 17 anak hebat di kelas TK A! Ayo putar roda giliran untuk menentukan siapa yang maju berikutnya!`,
                0.88,
                1.2
              );
            }}
            className="p-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-2xl"
            title="Dengarkan Petunjuk Guru"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Roda Putar, Papan 17 Murid, 3 Regu) */}
      <div className="flex items-center gap-2 p-1.5 bg-amber-100/80 rounded-2xl border border-amber-200">
        <button
          onClick={() => {
            setActiveTab('wheel');
            audio.playDing();
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'wheel'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-amber-900 hover:bg-amber-200/50'
          }`}
        >
          <span>🎡</span>
          <span>Roda Putar 17 Murid</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('board');
            audio.playDing();
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'board'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-amber-900 hover:bg-amber-200/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Papan Bintang 17 Murid</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('teams');
            audio.playDing();
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'teams'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-amber-900 hover:bg-amber-200/50'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Pesta 3 Regu (H - F - G)</span>
        </button>
      </div>

      {/* TAB 1: RODA PUTAR KEBERUNTUNGAN (17 SEGMEN) */}
      {activeTab === 'wheel' && (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
            {/* Top Pointer Indicator */}
            <div className="absolute -top-3 z-30 flex flex-col items-center">
              <div className="w-7 h-9 bg-red-600 rounded-b-full shadow-lg border-2 border-white flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              </div>
            </div>

            {/* Rotating SVG Wheel */}
            <motion.div
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                transition: isSpinning
                  ? 'transform 3.5s cubic-bezier(0.15, 0.85, 0.35, 1)'
                  : 'none',
              }}
              className="w-full h-full drop-shadow-2xl"
            >
              <svg
                ref={wheelRef}
                viewBox="0 0 400 400"
                className="w-full h-full rounded-full border-8 border-amber-300 bg-white"
              >
                {students.map((student, idx) => {
                  const total = students.length; // 17
                  const angle = 360 / total;
                  const startAngle = idx * angle;
                  const endAngle = (idx + 1) * angle;

                  // Coordinates on circle
                  const x1 = 200 + 190 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                  const y1 = 200 + 190 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                  const x2 = 200 + 190 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                  const y2 = 200 + 190 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                  const textAngle = startAngle + angle / 2;
                  const color = segmentColors[idx % segmentColors.length];

                  return (
                    <g key={student.id}>
                      {/* Segment wedge path */}
                      <path
                        d={`M 200 200 L ${x1} ${y1} A 190 190 0 0 1 ${x2} ${y2} Z`}
                        fill={color}
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                      />

                      {/* Text label with student name & avatar */}
                      <g
                        transform={`rotate(${textAngle} 200 200) translate(200 65)`}
                      >
                        <text
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="13"
                          fontWeight="bold"
                          fontFamily="Fredoka, sans-serif"
                          transform="rotate(-90)"
                          className="drop-shadow-xs"
                        >
                          {student.avatar} {student.name}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Outer rim gold dots */}
                <circle cx="200" cy="200" r="192" fill="none" stroke="#FDE68A" strokeWidth="4" />
              </svg>
            </motion.div>

            {/* Central Big Spin Action Button */}
            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className={`absolute z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-2xl flex flex-col items-center justify-center transition-transform active:scale-90 ${
                isSpinning
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-tr from-red-500 via-rose-500 to-amber-500 text-white hover:scale-105 cursor-pointer animate-pulse'
              }`}
            >
              <Shuffle className="w-6 h-6 mb-0.5" />
              <span className="font-black text-xs sm:text-sm uppercase tracking-wide">
                {isSpinning ? 'MEMUTAR...' : 'PUTAR RODA!'}
              </span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-amber-900 font-bold text-center mt-2">
            🎡 Tekan tombol "PUTAR RODA" untuk memilih giliran 1 dari 17 anak secara acak dan adil!
          </p>
        </div>
      )}

      {/* TAB 2: PAPAN BINTANG 17 MURID (GRID) */}
      {activeTab === 'board' && (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-slate-700">
              Daftar 17 Murid TK A (Ketuk kartu untuk memberi giliran maju):
            </span>

            <button
              onClick={handleResetAllStars}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Bintang Kelas
            </button>
          </div>

          {/* 17 Students Responsive Grid */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {students.map((st) => (
              <div
                key={st.id}
                className={`relative p-3 rounded-3xl border-3 flex flex-col items-center justify-between text-center transition-all shadow-sm ${
                  st.completedMission
                    ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
                    : 'bg-white border-slate-200 hover:border-amber-300'
                }`}
              >
                {/* Team Tag */}
                <div
                  className={`absolute top-2 left-2 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    st.team === 'H'
                      ? 'bg-amber-100 text-amber-800'
                      : st.team === 'F'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  Tim {st.team}
                </div>

                {/* Edit Name Button */}
                <button
                  onClick={() => handleOpenEdit(st)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600"
                  title="Ubah Nama Murid"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {/* Avatar Icon */}
                <div className="text-4xl my-2">{st.avatar}</div>

                {/* Student Name */}
                <h4 className="font-black text-sm text-slate-800 line-clamp-1">
                  {st.name}
                </h4>

                {/* Stars Display */}
                <div className="flex items-center gap-1 my-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span className="font-black text-amber-700 text-sm">
                    {st.stars}
                  </span>
                </div>

                {/* Turn / Give Star Action */}
                <button
                  onClick={() => handleSelectStudentDirectly(st)}
                  className="w-full mt-1 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl text-xs active:scale-95 shadow-2xs"
                >
                  Maju Main 🚀
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PESTA 3 REGU (TIM H, TIM F, TIM G) */}
      {activeTab === 'teams' && (
        <div className="w-full flex flex-col items-center gap-5">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-black text-slate-800">
              Pertandingan Ceria 3 Regu Kelas (17 Anak)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              17 anak dibagi menjadi 3 regu huruf: Harimau (H), Flamingo (F), dan Gajah (G)!
            </p>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Team H */}
            <div className="p-5 rounded-3xl bg-amber-50 border-4 border-amber-300 shadow-md flex flex-col items-center text-center">
              <span className="text-6xl mb-2">🐯</span>
              <h4 className="text-xl font-black text-amber-900">Tim Harimau (H)</h4>
              <span className="text-xs font-bold text-amber-700">6 Anak</span>

              <div className="flex items-center gap-2 my-3 px-4 py-2 bg-amber-500 text-white rounded-2xl font-black text-xl shadow-xs">
                <Star className="w-6 h-6 fill-white" />
                <span>{teamHScores} Bintang</span>
              </div>

              <div className="w-full text-xs text-amber-800 flex flex-wrap gap-1 justify-center">
                {students
                  .filter((s) => s.team === 'H')
                  .map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-1 bg-white rounded-lg font-bold border border-amber-200"
                    >
                      {s.name} ({s.stars} ⭐)
                    </span>
                  ))}
              </div>
            </div>

            {/* Team F */}
            <div className="p-5 rounded-3xl bg-rose-50 border-4 border-rose-300 shadow-md flex flex-col items-center text-center">
              <span className="text-6xl mb-2">🦩</span>
              <h4 className="text-xl font-black text-rose-900">Tim Flamingo (F)</h4>
              <span className="text-xs font-bold text-rose-700">6 Anak</span>

              <div className="flex items-center gap-2 my-3 px-4 py-2 bg-rose-500 text-white rounded-2xl font-black text-xl shadow-xs">
                <Star className="w-6 h-6 fill-white" />
                <span>{teamFScores} Bintang</span>
              </div>

              <div className="w-full text-xs text-rose-800 flex flex-wrap gap-1 justify-center">
                {students
                  .filter((s) => s.team === 'F')
                  .map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-1 bg-white rounded-lg font-bold border border-rose-200"
                    >
                      {s.name} ({s.stars} ⭐)
                    </span>
                  ))}
              </div>
            </div>

            {/* Team G */}
            <div className="p-5 rounded-3xl bg-indigo-50 border-4 border-indigo-300 shadow-md flex flex-col items-center text-center">
              <span className="text-6xl mb-2">🐘</span>
              <h4 className="text-xl font-black text-indigo-900">Tim Gajah (G)</h4>
              <span className="text-xs font-bold text-indigo-700">5 Anak</span>

              <div className="flex items-center gap-2 my-3 px-4 py-2 bg-indigo-500 text-white rounded-2xl font-black text-xl shadow-xs">
                <Star className="w-6 h-6 fill-white" />
                <span>{teamGScores} Bintang</span>
              </div>

              <div className="w-full text-xs text-indigo-800 flex flex-wrap gap-1 justify-center">
                {students
                  .filter((s) => s.team === 'G')
                  .map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-1 bg-white rounded-lg font-bold border border-indigo-200"
                    >
                      {s.name} ({s.stars} ⭐)
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: TANTANGAN MISI MURID YANG TERPILIH */}
      <AnimatePresence>
        {showMissionModal && selectedStudent && currentMission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-amber-400 p-6 flex flex-col items-center text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowMissionModal(false)}
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Student Spotlight Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-5xl shadow-lg border-4 border-white -mt-12 mb-2">
                {selectedStudent.avatar}
              </div>

              <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                Giliran Murid
              </span>

              <h3 className="text-3xl font-black text-slate-800 mt-1">
                {selectedStudent.name}! ⭐
              </h3>

              {/* Mission Card */}
              <div className="w-full bg-gradient-to-b from-amber-50 to-orange-50 rounded-2xl p-4 my-3 border-2 border-amber-200 flex flex-col items-center">
                <span className="text-5xl my-1 animate-bounce">
                  {currentMission.icon}
                </span>

                <h4 className="text-xl font-black text-amber-900 mt-1">
                  {currentMission.title}
                </h4>

                <p className="text-sm sm:text-base font-bold text-slate-700 mt-2 leading-relaxed">
                  "{currentMission.instruction}"
                </p>

                {/* Speak Mission Audio Button */}
                <button
                  onClick={() => audio.speak(currentMission.audioPrompt, 0.88, 1.2)}
                  className="flex items-center gap-1.5 px-4 py-2 mt-3 bg-white text-orange-600 font-bold rounded-xl shadow-xs text-xs hover:bg-orange-50 active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  Dengar Suara Misi
                </button>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-col sm:flex-row gap-2 mt-2">
                <button
                  onClick={() => handleAwardStar(selectedStudent.id)}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-black rounded-2xl shadow-md active:scale-95 flex items-center justify-center gap-2 text-base"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Bagus! Beri Bintang Emas ⭐
                </button>

                <button
                  onClick={handleChangeMission}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl active:scale-95 text-xs flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  Ganti Misi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP MODAL: UBAH NAMA MURID */}
      <AnimatePresence>
        {isEditModalOpen && editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border-4 border-amber-300 flex flex-col items-center"
            >
              <h3 className="text-lg font-black text-slate-800 mb-1">
                Ubah Nama Murid ({editingStudent.id}/17)
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Masukkan nama asli murid di kelas Anda:
              </p>

              <input
                type="text"
                value={editNameInput}
                onChange={(e) => setEditNameInput(e.target.value)}
                placeholder="Nama Murid..."
                maxLength={18}
                className="w-full p-3 rounded-2xl border-2 border-amber-300 font-bold text-slate-800 text-center text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
              />

              <div className="w-full flex gap-2">
                <button
                  onClick={handleSaveName}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl active:scale-95 shadow-sm"
                >
                  Simpan Nama
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-100 text-slate-600 font-bold rounded-xl active:scale-95"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
