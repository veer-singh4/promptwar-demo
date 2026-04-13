import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Generates a system prompt based on the current venue state
 */
const getSystemPrompt = (venueData, role) => {
  const { gates, facilities, parking, alerts } = venueData;
  
  const gateInfo = gates.map(g => `${g.label}: ${g.pct}% capacity (${g.status})`).join(", ");
  const facilityInfo = facilities.map(f => `${f.label}: ${f.wait} min wait`).join(", ");
  const parkingInfo = parking.map(p => `${p.label}: ${p.pct}% full`).join(", ");
  const alertInfo = alerts.map(a => a.text).join(" | ");

  const basePrompt = `You are VenueIQ Assistant, an AI expert for a major sports stadium. 
  Current Venue State:
  - Gates: ${gateInfo}
  - Facilities: ${facilityInfo}
  - Parking: ${parkingInfo}
  - Active Alerts: ${alertInfo}

  User Role: ${role}

  Instructions:
  - Be concise, professional, and helpful.
  - If a gate is >70% capacity, suggest an alternative.
  - If food wait is >10 min, find a faster alternative in the data.
  - Always base your advice on the provided data.
  - If the User is a HOST, focus on operational efficiency and emergency responses.
  - If the User is an ATTENDEE, focus on their comfort, navigation, and time-saving.
  - If API key is missing, explain you are in offline demo mode.`;

  return basePrompt;
};

/**
 * Sends a message to Gemini and returns the response
 */
export async function askGemini(userQuery, venueData, role) {
  if (!genAI) {
    return "I'm currently in demo mode. To enable my AI intelligence, please provide a VITE_GEMINI_API_KEY in the environment variables.";
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: getSystemPrompt(venueData, role)
    });

    const result = await model.generateContent(userQuery);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try asking again in a moment.";
  }
}
