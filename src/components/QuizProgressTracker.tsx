
import { useState, useEffect } from 'react';

interface QuizAttempt {
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  percentage: number;
}

interface QuizProgress {
  [quizId: string]: {
    attempts: QuizAttempt[];
    bestScore: number;
    lastAttempt: string;
    completed: boolean;
  };
}

export const useQuizProgress = (userId: string) => {
  const [progress, setProgress] = useState<QuizProgress>({});

  useEffect(() => {
    const savedProgress = localStorage.getItem(`quiz_progress_${userId}`);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, [userId]);

  const saveProgress = (newProgress: QuizProgress) => {
    setProgress(newProgress);
    localStorage.setItem(`quiz_progress_${userId}`, JSON.stringify(newProgress));
  };

  const recordQuizAttempt = (quizId: string, score: number, totalQuestions: number) => {
    const attempt: QuizAttempt = {
      quizId,
      score,
      totalQuestions,
      completedAt: new Date().toISOString(),
      percentage: Math.round((score / totalQuestions) * 100)
    };

    const newProgress = { ...progress };
    
    if (!newProgress[quizId]) {
      newProgress[quizId] = {
        attempts: [],
        bestScore: 0,
        lastAttempt: '',
        completed: false
      };
    }

    newProgress[quizId].attempts.push(attempt);
    newProgress[quizId].bestScore = Math.max(newProgress[quizId].bestScore, attempt.percentage);
    newProgress[quizId].lastAttempt = attempt.completedAt;
    newProgress[quizId].completed = true;

    saveProgress(newProgress);
  };

  const getQuizProgress = (quizId: string) => {
    return progress[quizId] || {
      attempts: [],
      bestScore: 0,
      lastAttempt: '',
      completed: false
    };
  };

  const isQuizCompleted = (quizId: string) => {
    return progress[quizId]?.completed || false;
  };

  const getBestScore = (quizId: string) => {
    return progress[quizId]?.bestScore || 0;
  };

  const getTotalCompletedQuizzes = () => {
    return Object.values(progress).filter(p => p.completed).length;
  };

  return {
    progress,
    recordQuizAttempt,
    getQuizProgress,
    isQuizCompleted,
    getBestScore,
    getTotalCompletedQuizzes
  };
};

export default useQuizProgress;
