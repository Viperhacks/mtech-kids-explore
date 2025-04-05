
import api from '@/lib/api';

// Badge types
export type BadgeType = 
  | 'login_streak'
  | 'quiz_master'
  | 'fast_learner'
  | 'super_reader'
  | 'video_watcher'
  | 'perfect_score'
  | 'helpful_teacher'
  | 'content_creator';

// Badge definitions
export const badges = {
  login_streak: {
    id: 'login_streak',
    name: 'Dedicated Learner',
    description: 'Logged in for 7 consecutive days',
    icon: '🔥',
    role: 'student',
    thresholds: [7, 30, 90], // Days
  },
  quiz_master: {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Completed 10 quizzes successfully',
    icon: '🧠',
    role: 'student',
    thresholds: [10, 50, 100], // Quizzes
  },
  fast_learner: {
    id: 'fast_learner',
    name: 'Fast Learner',
    description: 'Completed course material 30% faster than average',
    icon: '⚡',
    role: 'student',
    thresholds: [30, 50, 70], // Percent faster
  },
  super_reader: {
    id: 'super_reader',
    name: 'Super Reader',
    description: 'Read 20 or more documents',
    icon: '📚',
    role: 'student',
    thresholds: [20, 50, 100], // Documents
  },
  video_watcher: {
    id: 'video_watcher',
    name: 'Video Enthusiast',
    description: 'Watched 15 or more educational videos',
    icon: '🎬',
    role: 'student',
    thresholds: [15, 40, 80], // Videos
  },
  perfect_score: {
    id: 'perfect_score',
    name: 'Perfect Scorer',
    description: 'Achieved perfect scores on 5 quizzes',
    icon: '🌟',
    role: 'student',
    thresholds: [5, 15, 30], // Perfect quizzes
  },
  helpful_teacher: {
    id: 'helpful_teacher',
    name: 'Helpful Teacher',
    description: 'Created content that helped many students',
    icon: '🏆',
    role: 'teacher',
    thresholds: [50, 200, 500], // Student views
  },
  content_creator: {
    id: 'content_creator',
    name: 'Content Creator',
    description: 'Created multiple high-quality learning resources',
    icon: '✏️',
    role: 'teacher',
    thresholds: [10, 30, 50], // Resources created
  },
};

class BadgeService {
  // Check if user qualifies for new badges
  async checkForBadges(userId: string): Promise<void> {
    try {
      const response = await api.get(`/users/${userId}/activity-stats`);
      const stats = response.data;
      const currentBadges = await this.getUserBadges(userId);
      const newBadges = this.processStats(stats, currentBadges);
      
      if (newBadges.length > 0) {
        await this.awardBadges(userId, newBadges);
      }
    } catch (error) {
      console.error('Error checking for badges:', error);
    }
  }
  
  // Process user stats against badge criteria
  private processStats(stats: any, currentBadges: string[]): BadgeType[] {
    const newBadges: BadgeType[] = [];
    
    // Login streak check
    if (stats.loginStreak >= badges.login_streak.thresholds[0] && 
        !currentBadges.includes('login_streak')) {
      newBadges.push('login_streak');
    }
    
    // Quiz master check
    if (stats.quizzesCompleted >= badges.quiz_master.thresholds[0] && 
        !currentBadges.includes('quiz_master')) {
      newBadges.push('quiz_master');
    }
    
    // Fast learner check
    if (stats.learningSpeed >= badges.fast_learner.thresholds[0] && 
        !currentBadges.includes('fast_learner')) {
      newBadges.push('fast_learner');
    }
    
    // Super reader check
    if (stats.documentsRead >= badges.super_reader.thresholds[0] && 
        !currentBadges.includes('super_reader')) {
      newBadges.push('super_reader');
    }
    
    // Video watcher check
    if (stats.videosWatched >= badges.video_watcher.thresholds[0] && 
        !currentBadges.includes('video_watcher')) {
      newBadges.push('video_watcher');
    }
    
    // Perfect score check
    if (stats.perfectQuizzes >= badges.perfect_score.thresholds[0] && 
        !currentBadges.includes('perfect_score')) {
      newBadges.push('perfect_score');
    }
    
    // Teacher badges
    if (stats.role === 'teacher') {
      // Helpful teacher check
      if (stats.contentViews >= badges.helpful_teacher.thresholds[0] && 
          !currentBadges.includes('helpful_teacher')) {
        newBadges.push('helpful_teacher');
      }
      
      // Content creator check
      if (stats.resourcesCreated >= badges.content_creator.thresholds[0] && 
          !currentBadges.includes('content_creator')) {
        newBadges.push('content_creator');
      }
    }
    
    return newBadges;
  }
  
  // Get user's current badges
  async getUserBadges(userId: string): Promise<string[]> {
    try {
      const response = await api.get(`/users/${userId}/badges`);
      return response.data.map((badge: any) => badge.type);
    } catch (error) {
      console.error('Error getting user badges:', error);
      return [];
    }
  }
  
  // Award badges to user
  private async awardBadges(userId: string, badgeTypes: BadgeType[]): Promise<void> {
    try {
      await api.post(`/users/${userId}/badges`, { badges: badgeTypes });
    } catch (error) {
      console.error('Error awarding badges:', error);
    }
  }
  
  // Get badge details
  getBadgeDetails(badgeType: BadgeType) {
    return badges[badgeType];
  }
}

export const badgeService = new BadgeService();
export default badgeService;
