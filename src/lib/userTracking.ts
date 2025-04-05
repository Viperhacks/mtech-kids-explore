
import api from '@/lib/api';

// Tracking interval in seconds
const TRACKING_INTERVAL = 60; 

class UserTrackingService {
  private timer: number | null = null;
  private sessionStartTime: number = 0;
  private isTracking: boolean = false;
  private userId: string | null = null;

  constructor() {
    // Bind methods
    this.startTracking = this.startTracking.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
    this.trackPageView = this.trackPageView.bind(this);
    this.sendHeartbeat = this.sendHeartbeat.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  init(userId: string) {
    this.userId = userId;
    this.attachEventListeners();
    this.startTracking();
  }

  private attachEventListeners() {
    // Track when tab visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Track on page navigation
    window.addEventListener('popstate', () => this.trackPageView('navigation'));
  }

  private handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      this.startTracking();
    } else {
      this.stopTracking();
      this.sendSessionData();
    }
  }

  startTracking() {
    if (!this.userId || this.isTracking) return;
    
    this.isTracking = true;
    this.sessionStartTime = Date.now();
    this.trackPageView('pageload');
    
    // Set up interval for periodic heartbeats
    this.timer = window.setInterval(this.sendHeartbeat, TRACKING_INTERVAL * 1000);
  }

  stopTracking() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isTracking = false;
  }

  trackPageView(source: 'pageload' | 'navigation') {
    if (!this.userId) return;

    try {
      const currentPath = window.location.pathname;
      const timestamp = new Date().toISOString();
      
      api.post('/tracking/pageview', {
        userId: this.userId,
        path: currentPath,
        timestamp,
        source
      }).catch(err => console.error('Error tracking page view:', err));
    } catch (error) {
      // Silent fail to not impact user experience
      console.error('Error tracking page view:', error);
    }
  }

  private sendHeartbeat() {
    if (!this.userId || !this.isTracking) return;
    
    try {
      api.post('/tracking/heartbeat', {
        userId: this.userId,
        timestamp: new Date().toISOString()
      }).catch(err => console.error('Error sending heartbeat:', err));
    } catch (error) {
      console.error('Error sending heartbeat:', error);
    }
  }

  private sendSessionData() {
    if (!this.userId || !this.sessionStartTime) return;
    
    const sessionDuration = Math.floor((Date.now() - this.sessionStartTime) / 1000);
    
    if (sessionDuration < 5) return; // Ignore very short sessions
    
    try {
      api.post('/tracking/session', {
        userId: this.userId,
        duration: sessionDuration,
        endTime: new Date().toISOString()
      }).catch(err => console.error('Error sending session data:', err));
    } catch (error) {
      console.error('Error sending session data:', error);
    }
  }

  cleanup() {
    this.stopTracking();
    this.sendSessionData();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    this.userId = null;
  }
}

export const userTrackingService = new UserTrackingService();
export default userTrackingService;
