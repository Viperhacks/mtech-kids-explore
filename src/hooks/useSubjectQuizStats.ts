
import { useEffect, useState } from 'react';
import { getAllQuizzes } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';
import { useCompletion } from '@/context/CompletionContext';
import { Quiz } from '@/components/types/apiTypes';

interface SubjectQuizStats {
  total: number;
  completed: number;
}

const useSubjectQuizStats = (subject?: string, grade?: string): SubjectQuizStats => {
  const { user } = useAuth();
  const { completedResources, isLoading: completionLoading } = useCompletion();
  const [stats, setStats] = useState<SubjectQuizStats>({ total: 0, completed: 0 });

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const userGrade = grade || user?.grade || user?.gradeLevel || '1';
        
        const res = await getAllQuizzes();
        let filteredQuizzes = res.data.filter((quiz: Quiz) => quiz.grade === userGrade);
        
        // Filter by subject if provided
        if (subject) {
          filteredQuizzes = filteredQuizzes.filter((quiz: Quiz) => 
            quiz.subject?.toLowerCase() === subject.toLowerCase()
          );
        }

        // Get completed quizzes from completion context
        const completedQuizIds = completedResources
          .filter(resource => resource.type === 'quiz')
          .map(resource => resource.resourceId);

        const completedCount = filteredQuizzes.filter((quiz: Quiz) => 
          completedQuizIds.includes(quiz.quizId)
        ).length;

        setStats({
          total: filteredQuizzes.length,
          completed: completedCount
        });
      } catch (err) {
        console.error('Failed to load subject quiz stats', err);
        setStats({ total: 0, completed: 0 });
      }
    };

    if (!completionLoading) {
      fetchQuizzes();
    }
  }, [user, subject, grade, completedResources, completionLoading]);

  return stats;
};

export default useSubjectQuizStats;
