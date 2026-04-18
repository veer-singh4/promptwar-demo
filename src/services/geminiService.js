import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Persistent chat session cache
let chatSession = null;

/**
 * Generates a system prompt based on the current venue state
 */
const getSystemPrompt = (venueData, role) => {
  const { gates, facilities, parking, alerts } = venueData;
  
  const gateInfo = gates.map(g => `${g.label}: ${g.pct}% capacity (${g.status})`).join(", ");
  const facilityInfo = facilities.map(f => `${f.label}: ${f.wait} min wait`).join(", ");
  const parkingInfo = parking.map(p => `${p.label}: ${p.pct}% full`).join(", ");
  const alertInfo = alerts.map(a => a.text).join(" | ");

  return `You are VenueIQ Assistant, an AI expert for a major sports stadium. 
Current Venue State:
- Gates: ${gateInfo}
- Facilities: ${facilityInfo}
- Parking: ${parkingInfo}
- Active Alerts: ${alertInfo}

Role: ${role}

Instructions:
1. Be concise, professional, and helpful.
2. If gates are >70% capacity, suggest alternatives.
3. If food wait is >10 min, suggest faster spots.
4. Base ALL advice on provided real-time data.
5. Focus on efficiency for HOSTs and comfort/navigation for ATTENDEEs.
6. If API key is missing, inform user you are in demo mode.`;
};

/**
 * Sends a message to Gemini and returns the response, maintaining session history.
 */
export async function askGemini(userQuery, venueData, role, history = []) {
  if (!genAI) {
    return "I'm currently in demo mode. To enable my AI intelligence, please provide a VITE_GEMINI_API_KEY.";
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: getSystemPrompt(venueData, role),
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ]
    });

    // Transform history and ensure it's valid (must start with USER)
    const validHistory = [];
    let foundUser = false;
    for (const msg of history) {
      if (!foundUser && msg.role !== 'user') continue;
      foundUser = true;
      validHistory.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      });
    }

    if (!chatSession || history.length === 0) {
      chatSession = model.startChat({
        history: validHistory,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });
    }

    const result = await chatSession.sendMessage(userQuery);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Self-healing: If it was a session error, reset for next time
    chatSession = null;
    return "I'm having a quick digital nap. Could you try asking me that again? I'll be fresh this time.";
  }
}

/**
 * Resets the current chat session
 */
export function resetChat() {
  chatSession = null;
}
