
import { useCallback } from 'react';
import { getAllQuizzes } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

interface Quiz {
  resource: any;
  quizId: string;
  resourceId?: string;
  standaAlone: boolean;
  title: string;
  subject: string;
  grade: string;
}

export const useAutoQuizOpen = () => {
  const { toast } = useToast();

  const findAndOpenAssociatedQuiz = useCallback(async (
    videoId: string, 
    grade: string, 
    subject: string,
    onQuizFound: (quiz: Quiz) => void
  ) => {
    try {
      const response = await getAllQuizzes();
      console.log(response,"after watch with id",videoId);
      const quizzes = response.data as Quiz[];
      
      // Find the quiz that's linked to this video
      const associatedQuiz = quizzes.find(quiz => 
        quiz.resource.resourceId === videoId && 
        !quiz.standaAlone &&
        quiz.grade === grade &&
        quiz.subject === subject
      );

      if (associatedQuiz) {
        console.log('Found associated quiz:', associatedQuiz);
        toast({
          title: "Quiz Available!",
          description: `Time to test your knowledge with "${associatedQuiz.title}"`,
        });
        
        // Small delay to let the video end animation complete
        setTimeout(() => {
          onQuizFound(associatedQuiz);
        }, 1000);
      } else {
        console.log('No associated quiz found for video:', videoId);
      }
    } catch (error) {
      console.error('Failed to fetch associated quiz:', error);
    }
  }, [toast]);

  return { findAndOpenAssociatedQuiz };
};
