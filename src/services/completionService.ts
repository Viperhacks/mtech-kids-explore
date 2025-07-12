
import { markResourceCompleted } from './apiService';
import { toast } from '@/hooks/use-toast';

export const completionService = {
  markComplete: async (
    resourceId: number, 
    type: 'video' | 'document' | 'quiz',
    refreshCallback?: () => Promise<void>
  ) => {
    try {
      await markResourceCompleted(resourceId, type);
      
      // Call refresh callback if provided
      if (refreshCallback) {
        await refreshCallback();
      }
      
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Completed!`,
        description: `Great job! You've completed this ${type}.`,
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to mark ${type} as completed:`, error);
      
      // Fallback to localStorage
      const localCompleted = JSON.parse(localStorage.getItem('completedResources') || '[]');
      const newCompletion = {
        resourceId,
        type,
        completedAt: new Date().toISOString()
      };
      
      if (!localCompleted.some((item: any) => item.resourceId === resourceId)) {
        localCompleted.push(newCompletion);
        localStorage.setItem('completedResources', JSON.stringify(localCompleted));
      }
      
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Completed!`,
        description: `Completion saved locally. Will sync when connection is restored.`,
      });
      
      return false;
    }
  },

  debounceRefresh: (() => {
    let timeout: NodeJS.Timeout;
    return (refreshFn: () => Promise<void>, delay = 1000) => {
      clearTimeout(timeout);
      timeout = setTimeout(refreshFn, delay);
    };
  })()
};
