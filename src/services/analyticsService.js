/**
 * Wrapper for Google Analytics 4 tracking with dynamic script loader
 */

const GA_ID = import.meta.env.VITE_GA4_ID || "G-XXXXXXXXXX";

/**
 * Dynamically injects the GA4 script into the document head
 */
export const initAnalytics = () => {
  if (window.gtag || !GA_ID || GA_ID === "G-XXXXXXXXXX") return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    send_page_view: true,
    persistence_type: 'SESSION'
  });
};

export const trackEvent = (eventName, params = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...params,
      app_name: 'VenueIQ',
      timestamp: new Date().toISOString()
    });
  } else {
    console.debug(`[Analytics Offline] ${eventName}`, params);
  }
};

export const trackPageView = (path) => {
  trackEvent('page_view', { page_path: path });
};

// High-value domain events
export const trackEmergency = (type, location) => {
  trackEvent('emergency_report', { 
    emergency_type: type, 
    location_id: location,
    priority: 'high'
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

export const setAnalyticsUser = (role) => {
  if (typeof window.gtag === 'function') {
    window.gtag('set', 'user_properties', {
      user_role: role
    });
  }
};
