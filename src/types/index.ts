export type GameMode = 'explore' | 'quiz' | 'bubbles' | 'trace' | 'song';

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
