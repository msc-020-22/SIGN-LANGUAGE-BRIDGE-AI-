import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, Sparkles, CheckCircle2, XCircle, RefreshCw, 
  HelpCircle, Camera, Play, ArrowRight, RotateCcw, Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ASL_ALPHABET_DATA } from '../data/aslAlphabet';
import { SignAlphabetInfo } from '../types';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';

export const PracticePage: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'quiz' | 'flashcards' | 'challenge'>('quiz');

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Challenge state
  const [challengeTarget, setChallengeTarget] = useState<SignAlphabetInfo>(ASL_ALPHABET_DATA[0]);
  const [challengeSuccess, setChallengeSuccess] = useState(false);

  // Generate 10 quiz questions
  const [questions, setQuestions] = useState<Array<{
    sign: SignAlphabetInfo;
    options: string[];
    correctAnswer: string;
  }>>([]);

  const initQuiz = () => {
    const shuffled = [...ASL_ALPHABET_DATA].sort(() => 0.5 - Math.random()).slice(0, 10);
    const generated = shuffled.map((sign) => {
      // Pick 3 distractors
      const distractors = ASL_ALPHABET_DATA.filter((s) => s.letter !== sign.letter)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((s) => s.letter);

      const options = [sign.letter, ...distractors].sort(() => 0.5 - Math.random());
      return {
        sign,
        options,
        correctAnswer: sign.letter,
      };
    });

    setQuestions(generated);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  useEffect(() => {
    initQuiz();
  }, []);

  const handleSelectOption = (opt: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(opt);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      // Update profile
      storageService.updateProfile({ quizStreak: storageService.getProfile().quizStreak + 1 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#DCE5F0]">
        <div>
          <h1 className="text-2xl font-black text-[#123B70] tracking-tight">Practice & Skill Testing</h1>
          <p className="text-xs text-gray-500">
            Reinforce your sign comprehension through randomized quizzes, interactive flashcards, and gesture drills.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-[#DCE5F0] shadow-xs">
          <button
            onClick={() => setActiveMode('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeMode === 'quiz'
                ? 'bg-[#123B70] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#123B70]'
            }`}
          >
            Quiz Mode
          </button>
          <button
            onClick={() => setActiveMode('flashcards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeMode === 'flashcards'
                ? 'bg-[#123B70] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#123B70]'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setActiveMode('challenge')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeMode === 'challenge'
                ? 'bg-[#123B70] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#123B70]'
            }`}
          >
            Gesture Drills
          </button>
        </div>
      </div>

      {/* Mode 1: Multiple Choice Quiz */}
      {activeMode === 'quiz' && (
        <div className="max-w-2xl mx-auto">
          {!quizFinished && questions.length > 0 ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-6">
              {/* Progress and Score */}
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-[#2878E5] font-bold">
                  Score: {score} / {questions.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#2878E5] h-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="text-center space-y-3 py-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Which ASL letter matches this description?
                </span>
                <div className="p-4 rounded-2xl bg-[#F2F7FD] border border-[#DCE5F0] text-sm font-medium text-[#172B45] leading-relaxed">
                  &quot;{questions[currentQuestionIndex].sign.description}&quot;
                </div>
                <p className="text-xs text-gray-500">
                  Category: <b>{questions[currentQuestionIndex].sign.category}</b> • Difficulty:{' '}
                  <b>{questions[currentQuestionIndex].sign.difficulty}</b>
                </p>
              </div>

              {/* 4 Multiple Choice Options */}
              <div className="grid grid-cols-2 gap-3">
                {questions[currentQuestionIndex].options.map((opt) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = opt === questions[currentQuestionIndex].correctAnswer;

                  let btnStyle = 'bg-white border-[#DCE5F0] text-[#123B70] hover:border-[#2878E5]';
                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-red-50 border-red-500 text-red-800 font-bold';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-[#123B70] border-[#123B70] text-white shadow-sm font-bold';
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(opt)}
                      disabled={isAnswerSubmitted}
                      className={`p-4 rounded-2xl border-2 text-2xl font-black transition-all flex items-center justify-center space-x-2 ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Note on Submit */}
              {isAnswerSubmitted && (
                <div
                  className={`p-4 rounded-2xl text-xs space-y-1 animate-in fade-in ${
                    selectedAnswer === questions[currentQuestionIndex].correctAnswer
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border border-amber-200 text-amber-950'
                  }`}
                >
                  <p className="font-bold">
                    {selectedAnswer === questions[currentQuestionIndex].correctAnswer
                      ? '✓ Correct!'
                      : `✗ Incorrect — Correct sign is letter ${questions[currentQuestionIndex].correctAnswer}.`}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    💡 <b>Tip:</b> {questions[currentQuestionIndex].sign.mnemonicTip}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={initQuiz}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
                >
                  Restart Quiz
                </button>

                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    className="px-6 py-2.5 rounded-xl bg-[#123B70] hover:bg-[#2878E5] disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl bg-[#2878E5] hover:bg-[#123B70] text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-1.5"
                  >
                    <span>{currentQuestionIndex + 1 === questions.length ? 'View Results' : 'Next Question'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Completed Scorecard */
            <div className="p-8 rounded-3xl bg-white border border-[#DCE5F0] shadow-md text-center space-y-5 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl bg-[#2878E5]/10 text-[#2878E5] flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#35C6D4]">Quiz Finished</span>
                <h3 className="text-2xl font-black text-[#123B70] mt-1">Excellent Effort!</h3>
                <p className="text-3xl font-black text-[#2878E5] mt-2">
                  {score} / {questions.length} Correct
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  You scored {((score / questions.length) * 100).toFixed(0)}% on this ASL alphabet evaluation.
                </p>
              </div>

              <div className="pt-2 flex justify-center space-x-3">
                <button
                  onClick={initQuiz}
                  className="px-6 py-3 rounded-xl bg-[#123B70] hover:bg-[#2878E5] text-white font-bold text-xs shadow-md transition-colors"
                >
                  Take Another Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Interactive Flashcards */}
      {activeMode === 'flashcards' && (
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-center text-xs text-gray-500">
            Card {flashcardIndex + 1} of {ASL_ALPHABET_DATA.length} • Click card to flip
          </div>

          <div
            onClick={() => setIsCardFlipped(!isCardFlipped)}
            className="w-full h-80 rounded-3xl bg-white border-2 border-[#DCE5F0] hover:border-[#2878E5] p-8 shadow-md flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all group"
          >
            {!isCardFlipped ? (
              <div className="space-y-4 animate-in fade-in">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2878E5]/10 text-[#2878E5]">
                  {ASL_ALPHABET_DATA[flashcardIndex].category} Handshape
                </span>
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#123B70] to-[#2878E5] text-white flex items-center justify-center text-6xl font-black shadow-lg">
                  {ASL_ALPHABET_DATA[flashcardIndex].letter}
                </div>
                <p className="text-xs text-gray-400 font-medium">Tap to reveal hand formation & mnemonic</p>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in">
                <span className="text-xs font-bold text-[#123B70]">
                  Formation Guide: Letter {ASL_ALPHABET_DATA[flashcardIndex].letter}
                </span>
                <p className="text-xs text-[#172B45] leading-relaxed">
                  {ASL_ALPHABET_DATA[flashcardIndex].description}
                </p>
                <div className="p-3 bg-[#F2F7FD] rounded-xl text-xs text-gray-700">
                  💡 <b>Mnemonic:</b> {ASL_ALPHABET_DATA[flashcardIndex].mnemonicTip}
                </div>
                <span className="text-[10px] text-gray-400 block">Tap to flip back</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setIsCardFlipped(false);
                setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : ASL_ALPHABET_DATA.length - 1));
              }}
              className="px-4 py-2 rounded-xl border border-[#DCE5F0] text-xs font-bold text-gray-700 hover:bg-[#F2F7FD]"
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                setIsCardFlipped(false);
                setFlashcardIndex((prev) => (prev + 1) % ASL_ALPHABET_DATA.length);
              }}
              className="px-4 py-2 rounded-xl bg-[#123B70] text-white text-xs font-bold hover:bg-[#2878E5]"
            >
              Next Card →
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Gesture Drills */}
      {activeMode === 'challenge' && (
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs text-center space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2878E5]">
              Target Practice Drill
            </span>
            <h3 className="text-xl font-bold text-[#123B70] mt-1">
              Form the sign for letter &quot;{challengeTarget.letter}&quot;
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              Follow the instructions below and position your hand in the live recognition camera.
            </p>
          </div>

          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#123B70] via-[#2878E5] to-[#35C6D4] text-white flex items-center justify-center text-6xl font-black mx-auto shadow-xl">
            {challengeTarget.letter}
          </div>

          <div className="p-4 rounded-2xl bg-[#F2F7FD] border border-[#DCE5F0] text-xs text-left space-y-2">
            <p className="font-semibold text-[#172B45]">{challengeTarget.description}</p>
            <p className="text-gray-600">💡 {challengeTarget.mnemonicTip}</p>
          </div>

          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => {
                const random = ASL_ALPHABET_DATA[Math.floor(Math.random() * ASL_ALPHABET_DATA.length)];
                setChallengeTarget(random);
              }}
              className="px-5 py-2.5 rounded-xl border border-[#DCE5F0] text-xs font-bold text-gray-700 hover:bg-[#F2F7FD]"
            >
              Next Random Letter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
