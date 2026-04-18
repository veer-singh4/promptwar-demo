# VenueIQ — Intelligent Match Day Assistant

**VenueIQ** is a production-grade, dual-interface web application designed to transform the large-scale event experience. By combining real-time venue logistics with Google’s cutting-edge AI (Gemini), VenueIQ ensures that fans spend less time in queues and more time enjoying the event, while providing staff with the command tools they need for operational excellence.

---

## 🔗 Live Demo & Testing

Experience VenueIQ instantly on Google Cloud Run. The application adapts its interface based on your login credentials.

**Live Application URL**: [https://promptwar-demo-781746952048.us-central1.run.app](https://promptwar-demo-781746952048.us-central1.run.app)

### Demo Credentials:
- **Host / Manager View** (Command Dashboard):
  - Login ID: `HostAdmin` (or any string containing "Host")
- **Attendee / Fan View** (Navigation & AI):
  - Login ID: `TX-123` (or any generic ticket ID)

---
- **Google Services**: 
  - **Gemini 1.5 Flash**: Context-aware assistant for routing and incident drafting.
  - **Google Maps (React)**: Live-tracked markers, custom dark-mode styling, and interactive zone analysis.
  - **Google Analytics 4**: High-value event tracking for SOS, AI, and Broadcast actions.
- **Premium Aesthetics**: Glassmorphism UI, Recharts trend analysis, and motion-optimized transitions.

---

## 🧐 Approach & Logic

VenueIQ operates on a **Context-Aware Intelligence** model. Unlike static applications, our solution understands the *physical state* of the venue (wait times, gate loads, parking occupancy) and uses this as a "System Instruction" for the built-in Gemini AI.

### How It Works:
1. **Live Data Simulation**: A built-in "Simulation Engine" varies crowd density and service speeds across 15+ venue nodes.
2. **Context Injection**: Every AI query automatically injects the current venue state and user role into the Gemini 1.5 Flash model.
3. **Role-Based Logic**: 
   - **Fans (Attendee)**: Focus on comfort, navigation, and time-saving.
   - **Staff (Host)**: Focus on operational efficiency, system stress analysis, and emergency responses.

---

## 🚀 Key Google Integrations

### 1. Gemini 1.5 Flash (Smart Assistant)
A context-aware assistant that provides dynamic answers based on live venue metrics.
- **Features**: Multi-turn chat sessions and safety-filtered outputs.
- **Sanitization**: All AI responses are sanitized via `DOMPurify` before rendering to ensure session safety.

### 2. Google Maps (Interactive Logistics)
Built using `@vis.gl/react-google-maps`.
- **Interactivity**: Clickable markers for gates and parking sectors with live load data.
- **Custom Styling**: Advanced dark-mode JSON styling to match the premium application aesthetic.

### 3. Google Analytics 4 (GA4)
Integrated event tracking to monitor high-impact user actions.
- **Tracking**: Emergency SOS triggers, AI Query frequency, and Host Broadcasts.

---

## 🔬 Simulation Controls (For Judges)
In the **Host Dashboard**, we've included a **Simulation Control Board** that allows you to:
- **Boost Traffic**: Manually stress test the system by increasing gate loads.
- **Trigger Chaos**: Simulate high-congested states to see Gemini's mitigation recommendations in action.

---

## 🔒 Security & Quality
- **Sanitization**: Robust HTML sanitization for all user and AI content.
- **Error Boundaries**: Root-level error catching ensures zero app crashes.
- **Vitest Suite**: Unit tests for all core AI and utility services.

---

## 🛠️ Getting Started

### Environment Variables
Create a `.env` file in the root using the provided `.env.example`:
```env
VITE_GEMINI_API_KEY=your_key_here
VITE_GOOGLE_MAPS_API_KEY=your_key_here
VITE_GA4_ID=G-XXXXXXXXXX
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
