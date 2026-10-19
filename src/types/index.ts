export interface PredictionResult {
  letter: string;
  confidence: number;
  entropy?: number;
  isUncertain: boolean;
  topK: Array<{ letter: string; confidence: number; classIndex: number }>;
  inferenceTimeMs: number;
  timestamp: string;
}

export interface RecognitionHistoryItem {
  id: string;
  timestamp: string;
  letter: string;
  confidence: number;
  source: 'webcam' | 'image_upload' | 'practice';
  confirmedByUser: boolean;
  correctedTo?: string;
  notes?: string;
}

export interface SavedPhrase {
  id: string;
  phrase: string;
  category: 'General' | 'Greetings' | 'Emergency' | 'Work' | 'Family' | 'Questions' | 'Custom';
  usageCount: number;
  createdAt: string;
  isFavorite: boolean;
}

export interface SignAlphabetInfo {
  letter: string;
  classIndex: number; // 0..23 in model
  datasetLabel: number; // 0..24 excluding 9
  description: string;
  mnemonicTip: string;
  commonMistakes: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  handShapeDescription: string;
  category: 'Fist' | 'Open' | 'Fingers' | 'Pinch';
  svgPathD: string;
}

export interface QuizQuestion {
  id: string;
  letter: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface UserSettings {
  confidenceThreshold: number; // e.g. 0.65
  smoothingWindowSize: number; // e.g. 5 frames
  uncertaintyThreshold: number; // e.g. 0.50
  autoSpeak: boolean;
  speechRate: number; // 0.8 to 1.2
  speechPitch: number; // 1.0
  cameraResolution: '640x480' | '1280x720';
  mirrorCamera: boolean;
  highContrastMode: boolean;
  offlineModeOnly: boolean;
  saveHistory: boolean;
  hapticFeedback: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  preferredSignLanguage: 'ASL' | 'MSL' | 'BSL';
  role: 'learner' | 'deaf_hard_of_hearing' | 'interpreter' | 'educator' | 'ally';
  signsMastered: number;
  totalRecognitions: number;
  quizStreak: number;
  createdAt: string;
}
