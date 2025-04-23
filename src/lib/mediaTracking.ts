
import { userTrackingService } from '@/lib/userTracking';

interface MediaProgress {
  resourceId: string | number;
  progress: number;
  duration: number;
  lastPosition: number;
  completed: boolean;
  lastUpdated: string;
}

const mediaTrackingHelper = {
  // Store media progress for a video
  saveVideoProgress: (user: any, resourceId: string | number, progress: number, duration: number): void => {
    try {
      const mediaKey = 'mediaProgress';
      const currentProgress = user ? 
        userTrackingService.getUserData(mediaKey, {}) : 
        JSON.parse(localStorage.getItem(mediaKey) || '{}');
      
      // Update progress entry
      currentProgress[resourceId] = {
        resourceId,
        progress, // 0-100 percentage
        duration,
        lastPosition: (progress / 100) * duration,
        completed: progress >= 90, // Consider complete at 90%
        lastUpdated: new Date().toISOString()
      };
      
      if (user) {
        userTrackingService.storeUserData(mediaKey, currentProgress);
      } else {
        localStorage.setItem(mediaKey, JSON.stringify(currentProgress));
      }
    } catch (error) {
      console.error("Error saving video progress:", error);
    }
  },
  
  // Get media progress for a video
  getVideoProgress: (user: any, resourceId: string | number): MediaProgress | undefined => {
    try {
      const mediaKey = 'mediaProgress';
      const allProgress = user ? 
        userTrackingService.getUserData(mediaKey, {}) : 
        JSON.parse(localStorage.getItem(mediaKey) || '{}');
        
      return allProgress[resourceId];
    } catch (error) {
      console.error("Error getting video progress:", error);
      return undefined;
    }
  },
  
  // Get all completed video IDs
  getCompletedVideos: (user: any): string[] => {
    try {
      const mediaKey = 'mediaProgress';
      const allProgress = user ? 
        userTrackingService.getUserData(mediaKey, {}) : 
        JSON.parse(localStorage.getItem(mediaKey) || '{}');
        
      return Object.values(allProgress)
        .filter((item: any) => item.completed)
        .map((item: any) => item.resourceId.toString());
    } catch (error) {
      console.error("Error getting completed videos:", error);
      return [];
    }
  },
  
  // Count completed media by subject
  getCompletedCountBySubject: (user: any, subject: string, resources: any[]): number => {
    try {
      const completedIds = new Set(mediaTrackingHelper.getCompletedVideos(user));
      
      // Get viewed documents
      const viewedDocuments = user ? 
        userTrackingService.getUserData('viewedDocuments', {}) : 
        JSON.parse(localStorage.getItem('viewedDocuments') || '{}');
      
      // Add completed document IDs
      Object.entries(viewedDocuments).forEach(([id, data]: [string, any]) => {
        if (data.completed) {
          completedIds.add(id);
        }
      });
      
      // Count resources of this subject that are in the completed list
      return resources
        .filter(r => r.response.subject === subject)
        .filter(r => completedIds.has(r.response.id.toString()))
        .length;
    } catch (error) {
      console.error("Error counting completed media:", error);
      return 0;
    }
  }
};

export default mediaTrackingHelper;
