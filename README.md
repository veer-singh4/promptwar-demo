# VenueIQ — Intelligent Match Day Assistant

**VenueIQ** is a production-grade, dual-interface web application designed to transform the large-scale event experience. By combining real-time venue logistics with Google’s cutting-edge AI (Gemini), VenueIQ ensures that fans spend less time in queues and more time enjoying the event, while providing staff with the command tools they need for operational excellence.

---

## 🏆 Competition Metrics 
- **Vertical**: Sports, Event Management & Fan Engagement
- **Google Services**: Gemini AI (contextual assistant), Google Analytics 4 (event tracking), Cloud Run (deployment).
- **Core Stack**: React 19, Vite 8, Tailwind 4, Recharts, Lucide, Vitest.

---

## 🧐 Approach & Logic

VenueIQ operates on a **Context-Aware Intelligence** model. Unlike static applications, our solution understands the *physical state* of the venue (wait times, gate loads, parking occupancy) and uses this as a "System Instruction" for the built-in Gemini AI.

### How It Works:
1. **Live Data Simulation**: The system simulates real-time variations in crowd density and service speeds across 15+ venue nodes.
2. **Context Injection**: Every AI query automatically injects the current venue state and user role into the Gemini 1.5 Flash model.
3. **Role-Based Logic**: 
   - **Fans (Attendee)**: Receive navigation advice, optimized itineraries ("MyPlan"), and live assistance.
   - **Staff (Host)**: Receive system stress analysis, emergency management tools, and broadcast capabilities.

---

## 🚀 Meaningful Google Integrations

### 1. Gemini 1.5 Flash (Smart Assistant)
A context-aware assistant that provides dynamic answers based on live venue metrics.
- **Fans**: "Which gate is least crowded?" → Gemini analyzes gate % and recommends the fastest entry.
- **Staff**: "Current system status?" → Gemini identifies high-load sectors and suggests mitigation strategies.

### 2. Google Analytics 4 (GA4)
Integrated event tracking to monitor high-impact user actions, such as:
- Emergency SOS Triggers
- AI Query frequency and success rates
- System-wide broadcasts

### 3. Google Cloud Run
Containerized with a performance-optimized and hardened Nginx configuration, deployed on serverless infrastructure for 99.9% availability and global scale.

---

## 🔒 Security & Privacy
- **Sanitization**: All user inputs (SOS reports, broadcasts, seat numbers) are sanitized via **DOMPurify** before persistence or rendering to prevent XSS.
- **Rate-Limiting**: Emergency SOS triggers are rate-limited per session to prevent system spam.
- **Header Hardening**: Custom Nginx configuration implements **CSP (Content Security Policy)**, **XSS-Protection**, and **HSTS** to ensure a safe environment for fans.
- **Session Safety**: Auto-logout after 30 minutes of inactivity.

---

## ♿ Accessibility (WCAG 2.1 AA)
VenueIQ is built for everyone, featuring:
- **ARIA Live-Regions**: Real-time alerts and SOS confirmations are announced to screen readers immediately.
- **Semantic HTML**: Proper heading hierarchy and landmark roles (main, nav, region).
- **Keyboard Navigation**: Skip-navigation links and consistent focus-visible indicators.
- **Inclusive Design**: High-contrast ratios and touch-optimized interactive elements (min 44x44px targets).

---

## 🧪 Testing & Quality
We maintain a robust testing suite using **Vitest** and **React Testing Library**:
- **Unit Tests**: Validating all logic utilities, sanitization, and formatting.
- **Integration Tests**: Ensuring the AuthContext properly routes based on identity (Host vs Attendee).
- **Graceful Fallbacks**: Root-level **Error Boundaries** ensure the app remains resilient even in edge-case failures.

---

## 🛠️ Getting Started

### Environment Variables
To enable the AI capabilities, create a `.env` file in the root:
```env
VITE_GEMINI_API_KEY=your_key_here
```

### Local Development
```bash
npm install
npm run dev
```

### Run Tests
```bash
npm run test
```

---

## 📝 Assumptions Made
- The venue possesses IoT sensors (entry gates, BLE beacons) to provide the density metrics used by the system.
- Staff members have verified "Host/Manager" authentication IDs.
