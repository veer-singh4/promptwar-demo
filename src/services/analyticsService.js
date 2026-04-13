/**
 * Wrapper for Google Analytics 4 tracking
 */

const GA_ID = "G-XXXXXXXXXX"; // Placeholder

export const trackEvent = (eventName, params = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...params,
      app_name: 'VenueIQ',
      timestamp: new Date().toISOString()
    });
  } else {
    console.debug(`[Analytics Mock] ${eventName}`, params);
  }
};

export const trackPageView = (path) => {
  trackEvent('page_view', { page_path: path });
};

// High-value domain events
export const trackEmergency = (type, location) => {
  trackEvent('emergency_report', { 
    emergency_type: type, 
    location_id: location 
  });
};

export const trackAIQuery = (queryLength, successful) => {
  trackEvent('ai_assistant_query', { 
    query_length: queryLength,
    status: successful ? 'success' : 'error'
  });
};

export const trackBroadcast = (message) => {
  trackEvent('host_broadcast', { 
    message_length: message.length 
  });
};
