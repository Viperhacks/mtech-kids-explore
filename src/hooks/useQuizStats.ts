
import { useEffect, useState } from 'react';
import { getAllQuizzes } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';
import { useCompletion } from '@/context/CompletionContext';
import { Quiz } from '@/components/types/apiTypes';

interface QuizStats {
  total: number;
  completed: number;
}

const useQuizStats = (): QuizStats => {
  const { user } = useAuth();
  const { completedResources, isLoading: completionLoading } = useCompletion();
  const [stats, setStats] = useState<QuizStats>({ total: 0, completed: 0 });

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (completionLoading) return;
      
      try {
        const userGrade = user?.grade || user?.gradeLevel || '1';
        
        const res = await getAllQuizzes();
        const filtered = res.data.filter((quiz: Quiz) => quiz.grade === userGrade);

        // Get completed quizzes from completion context
        const completedQuizIds = completedResources
          .filter(resource => resource.type === 'quiz')
          .map(resource => resource.resourceId);

        const completedCount = filtered.filter((quiz: Quiz) => 
          completedQuizIds.includes(quiz.quizId)
        ).length;

        setStats({
          total: filtered.length,
          completed: completedCount
        });
      } catch (err) {
        console.error('Failed to load quiz stats', err);
        // Fallback to localStorage for backward compatibility
        const storedCompleted = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
        try {
          const res = await getAllQuizzes();
          const userGrade = user?.grade || user?.gradeLevel || '1';
          const filtered = res.data.filter((quiz: Quiz) => quiz.grade === userGrade);
          
          setStats({
            total: filtered.length,
            completed: filtered.filter((q: Quiz) => storedCompleted.includes(q.quizId)).length
          });
        } catch {
          setStats({ total: 0, completed: 0 });
        }
      }
    };

    fetchQuizzes();
  }, [user, completedResources, completionLoading]);

  return stats;
};

export default useQuizStats;
