
import { useEffect, useState } from 'react';
import { getAllQuizzes } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';
import { Quiz } from '@/components/types/apiTypes';
interface QuizStats {
  total: number;
  completed: number;
}

const useQuizStats = (): QuizStats => {
  const { user } = useAuth();
  const [stats, setStats] = useState<QuizStats>({ total: 0, completed: 0 });

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const userGrade = user?.grade || user?.gradeLevel || '1';
        const storedCompleted = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');

        const res = await getAllQuizzes();
        const filtered = res.data.filter((quiz: Quiz) => quiz.grade === userGrade);

        setStats({
          total: filtered.length,
          completed: filtered.filter((q: Quiz) => storedCompleted.includes(q.quizId)).length
        });
      } catch (err) {
        console.error('Failed to load quiz stats', err);
      }
    };

    fetchQuizzes();
  }, [user]);

  return stats;
};

export default useQuizStats;
