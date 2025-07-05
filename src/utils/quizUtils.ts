// utils/quizUtils.ts

import { Question } from "@/components/types/apiTypes";

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Optionally shuffle answers and remap the correct answer position
export const shuffleAnswers = (questions: Question[]): Question[] => {
  return questions.map((q) => {
    const options = [...q.options];
    const correctText = options[q.correctAnswerPosition - 1]; // 1-based
    const shuffledOptions = shuffleArray(options);
    const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctText);

    return {
      ...q,
      options: shuffledOptions,
      correctAnswerPosition: newCorrectIndex + 1, // keep it 1-based
    };
  });
};