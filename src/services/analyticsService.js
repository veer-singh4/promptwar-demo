/**
 * Wrapper for Google Analytics 4 tracking with dynamic script loader
 */

const GA_ID = import.meta.env.VITE_GA4_ID || "G-XXXXXXXXXX";

/**
 * Dynamically injects the Google Analytics 4 script into the document head
 * and initializes the global dataLayer for event tracking.
 * 
 * @returns {void}
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

/**
 * Pushes a custom event to the Google Analytics dataLayer.
 * If GA is not initialized (e.g., in dev mode or missing API key), it falls back to console.debug.
 * 
 * @param {string} eventName - The canonical name of the event to track.
 * @param {Object} [params={}] - Additional metric payloads or dimensions.
 * @returns {void}
 */
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

/**
 * Tracks a standard page view event.
 * 
 * @param {string} path - The URL path of the viewed page.
 * @returns {void}
 */
export const trackPageView = (path) => {
  trackEvent('page_view', { page_path: path });
};

// High-value domain events

/**
 * Tracks a critical emergency or SOS raised by an attendee.
 * Flags the event with high priority for immediate dashboard visibility.
 * 
 * @param {string} type - The nature of the emergency (e.g., 'medical', 'security').
 * @param {string} location - The physical zone where the emergency was reported.
 * @returns {void}
 */
export const trackEmergency = (type, location) => {
  trackEvent('emergency_report', { 
    emergency_type: type, 
    location_id: location,
    priority: 'high'
  });
};

/**
 * Measures user engagement with the AI assistant.
 * 
 * @param {number} queryLength - The character length of the user's prompt.
 * @param {boolean} successful - Whether the Gemini API returned a valid response.
 * @returns {void}
 */
export const trackAIQuery = (queryLength, successful) => {
  trackEvent('ai_assistant_query', { 
    query_length: queryLength,
    status: successful ? 'success' : 'error'
  });
};

/**
 * Tracks public address (PA) system broadcasts deployed by the Host.
 * 
 * @param {string} message - The content of the broadcast payload.
 * @returns {void}
 */
export const trackBroadcast = (message) => {
  trackEvent('host_broadcast', { 
    message_length: message.length 
  });
};

/**
 * Updates the persistent user profile data in Google Analytics.
 * Essential for segmenting behaviors between Attendees and Hosts.
 * 
 * @param {string} role - The current active role ('HOST' or 'ATTENDEE').
 * @returns {void}
 */
export const setAnalyticsUser = (role) => {
  if (typeof window.gtag === 'function') {
    window.gtag('set', 'user_properties', {
      user_role: role
    });
  }
};
