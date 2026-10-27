export type GameMode = 'explore' | 'quiz' | 'bubbles' | 'trace' | 'song' | 'classroom';

export interface Student {
  id: number;
  name: string;
  avatar: string;
  stars: number;
  completedMission: boolean;
  team: 'H' | 'F' | 'G';
}

export interface ClassMission {
  id: string;
  type: 'action' | 'sound' | 'quiz' | 'mystery';
  title: string;
  instruction: string;
  audioPrompt: string;
  icon: string;
  letterFocus: 'H' | 'F' | 'G';
  targetWord?: string;
}

export interface Syllable {
  text: string;
  pronunciation: string;
  color: string;
}

export interface VocabItem {
  id: string;
  word: string;
  letter: string;
  syllables: Syllable[];
  category: string;
  soundEffect: string; // id for sound
  audioPrompt: string; // text for TTS
  shortDescription: string;
  interactivePrompt: string;
  emoji: string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    cardBg: string;
    accent: string;
  };
}

export interface QuizQuestion {
  targetVocab: VocabItem;
  options: VocabItem[];
}

export interface StickerReward {
  id: string;
  title: string;
  vocabId: string;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
}
