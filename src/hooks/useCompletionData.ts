
import { useCompletion } from '@/context/CompletionContext';

export const useCompletionData = () => {
  const completion = useCompletion();
  
  const getResourceStats = (resources: any[], subject?: string) => {
    const videos = resources.filter(r => r.response?.type === 'video' || r.type === 'video');
    const documents = resources.filter(r => r.response?.type === 'DOCUMENT' || r.type === 'document');
    
    const completedVideos = videos.filter(video => {
      const resourceId = video.response?.id || video.id;
      return completion.isResourceCompleted(resourceId);
    });
    
    const completedDocuments = documents.filter(doc => {
      const resourceId = doc.response?.id || doc.id;
      return completion.isResourceCompleted(resourceId);
    });

    // Get quiz stats using completion context
    const completedQuizzes = completion.getCompletedByType('quiz', subject);
    
    return {
      videos: videos.length,
      documents: documents.length,
      videosCompleted: completedVideos.length,
      documentsCompleted: completedDocuments.length,
      quizzesCompleted: completedQuizzes.length,
      total: videos.length + documents.length,
      completed: completedVideos.length + completedDocuments.length
    };
  };

  return {
    ...completion,
    getResourceStats
  };
};
