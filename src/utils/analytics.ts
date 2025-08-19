interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface UserAction {
  action: string;
  category: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

class Analytics {
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean;
  private queue: AnalyticsEvent[] = [];
  private sessionStart: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.userId = this.getUserId();
    
    // Send session start
    this.track('session_start', 'engagement');
    
    // Track page visibility changes
    this.setupVisibilityTracking();
    
    // Track scroll depth
    this.setupScrollTracking();
    
    // Track performance metrics
    this.trackPerformance();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserId(): string | undefined {
    let userId = localStorage.getItem('theme_gallery_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('theme_gallery_user_id', userId);
    }
    return userId;
  }

  private setupVisibilityTracking() {
    let startTime = Date.now();
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        const timeSpent = Date.now() - startTime;
        this.track('page_view_time', 'engagement', undefined, timeSpent);
      } else {
        startTime = Date.now();
      }
    });
  }

  private setupScrollTracking() {
    let maxScroll = 0;
    const checkpoints = [25, 50, 75, 90, 100];
    const reached: boolean[] = new Array(checkpoints.length).fill(false);

    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      maxScroll = Math.max(maxScroll, scrollPercent);
      
      checkpoints.forEach((checkpoint, index) => {
        if (scrollPercent >= checkpoint && !reached[index]) {
          reached[index] = true;
          this.track('scroll_depth', 'engagement', `${checkpoint}%`, checkpoint);
        }
      });
    };

    window.addEventListener('scroll', trackScroll, { passive: true });
  }

  private trackPerformance() {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.track('lcp', 'performance', undefined, Math.round(lastEntry.startTime));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          const fidEntry = entry as any; // Type assertion for FID specific properties
          if (fidEntry.processingStart && fidEntry.startTime) {
            this.track('fid', 'performance', undefined, Math.round(fidEntry.processingStart - fidEntry.startTime));
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const clsEntry = entry as any; // Type assertion for CLS specific properties
          if (!clsEntry.hadRecentInput && clsEntry.value !== undefined) {
            clsValue += clsEntry.value;
          }
        }
        this.track('cls', 'performance', undefined, Math.round(clsValue * 1000));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Page load time
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.track('page_load_time', 'performance', undefined, Math.round(navigation.loadEventEnd - navigation.fetchStart));
        }
      }, 0);
    });
  }

  // Public methods
  track(event: string, category: string, label?: string, value?: number, customParams?: Record<string, any>) {
    if (!this.isEnabled) {
      console.log('Analytics Event:', { event, category, label, value, customParams });
      return;
    }

    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      label,
      value,
      custom_parameters: {
        session_id: this.sessionId,
        user_id: this.userId,
        page_url: window.location.href,
        timestamp: Date.now(),
        ...customParams
      }
    };

    // Send to Google Analytics 4
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', event, {
        event_category: category,
        event_label: label,
        value: value,
        ...analyticsEvent.custom_parameters
      });
    }

    // Store for batch sending or local analytics
    this.queue.push(analyticsEvent);
    this.processQueue();
  }

  // Image-specific tracking
  trackImageView(imageId: string, category: string, source: string) {
    this.track('image_view', 'images', `${category}/${imageId}`, 1, {
      image_id: imageId,
      image_category: category,
      image_source: source
    });
  }

  trackImageDownload(imageId: string, category: string, format: string) {
    this.track('image_download', 'images', `${category}/${imageId}`, 1, {
      image_id: imageId,
      image_category: category,
      download_format: format
    });
  }

  trackSearch(query: string, resultsCount: number, filters?: any) {
    this.track('search', 'search', query, resultsCount, {
      search_query: query,
      results_count: resultsCount,
      filters: filters
    });
  }

  trackThemeView(themeId: string, themeName: string) {
    this.track('theme_view', 'themes', `${themeId}/${themeName}`, 1, {
      theme_id: themeId,
      theme_name: themeName
    });
  }

  trackFavoriteToggle(imageId: string, action: 'add' | 'remove') {
    this.track('favorite_toggle', 'engagement', `${action}/${imageId}`, action === 'add' ? 1 : -1, {
      image_id: imageId,
      action: action
    });
  }

  trackError(error: string, context?: string) {
    this.track('error', 'errors', context || 'unknown', 1, {
      error_message: error,
      context: context,
      user_agent: navigator.userAgent,
      url: window.location.href
    });
  }

  // User engagement tracking
  trackFeatureUsage(feature: string, details?: any) {
    this.track('feature_usage', 'features', feature, 1, {
      feature_name: feature,
      feature_details: details
    });
  }

  // Performance tracking
  trackApiCall(endpoint: string, duration: number, success: boolean) {
    this.track('api_call', 'performance', endpoint, duration, {
      endpoint: endpoint,
      duration: duration,
      success: success
    });
  }

  private processQueue() {
    // In a real implementation, you might batch send events
    // or send to your own analytics endpoint
    if (this.queue.length > 10) {
      // Send batch to your analytics service
      // this.sendBatch(this.queue.splice(0, 10));
    }
  }

  // Get analytics insights (for admin dashboard)
  getSessionStats() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      sessionDuration: Date.now() - this.sessionStart,
      eventsTracked: this.queue.length,
      currentPage: window.location.pathname
    };
  }

  // GDPR compliance
  setConsent(hasConsent: boolean) {
    this.isEnabled = hasConsent && process.env.NODE_ENV === 'production';
    if (!hasConsent) {
      this.queue = [];
      localStorage.removeItem('theme_gallery_user_id');
    }
  }

  // Clean up
  destroy() {
    const sessionEnd = Date.now();
    const sessionDuration = sessionEnd - this.sessionStart;
    this.track('session_end', 'engagement', undefined, sessionDuration);
    
    // Final flush
    this.processQueue();
  }
}

// Global analytics instance
export const analytics = new Analytics();

// Convenience functions
export const trackImageView = (imageId: string, category: string, source: string) => {
  analytics.trackImageView(imageId, category, source);
};

export const trackImageDownload = (imageId: string, category: string, format = 'jpg') => {
  analytics.trackImageDownload(imageId, category, format);
};

export const trackSearch = (query: string, resultsCount: number, filters?: any) => {
  analytics.trackSearch(query, resultsCount, filters);
};

export const trackThemeView = (themeId: string, themeName: string) => {
  analytics.trackThemeView(themeId, themeName);
};

export const trackError = (error: string, context?: string) => {
  analytics.trackError(error, context);
};

// Setup global error tracking
window.addEventListener('error', (event) => {
  trackError(event.error?.message || 'Unknown error', 'global_error_handler');
});

window.addEventListener('unhandledrejection', (event) => {
  trackError(event.reason?.message || 'Unhandled promise rejection', 'promise_rejection');
});

export default analytics;