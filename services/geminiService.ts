
import { GoogleGenAI } from "@google/genai";
import { ActivityType } from "../types";

const getApiKey = (): string => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
    }
    return apiKey;
};

export const getWorkoutTip = async (activityType: ActivityType): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        
        let prompt = '';
        switch(activityType) {
            case ActivityType.WEIGHT_LIFTING:
                prompt = 'Provide a short, actionable tip for improving weight lifting form or results. Focus on one specific aspect. For example, "Focus on a slow, controlled negative on your next set of bicep curls to maximize muscle growth."';
                break;
            case ActivityType.SWIMMING:
                prompt = 'Give a concise, helpful tip for a swimmer looking to improve their technique or endurance. Focus on one specific aspect. For example, "To improve your freestyle rotation, imagine your body is a log rolling in the water, driven by your hips and core."';
                break;
            case ActivityType.RUNNING:
                prompt = 'Offer a brief, practical tip for a runner aiming to increase speed or prevent injury. Focus on one specific aspect. For example, "Try to increase your running cadence by about 5% to reduce over-striding and lower impact on your joints."';
                break;
            default:
                prompt = 'Give a general fitness tip.';
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });

        return response.text;

    } catch (error) {
        console.error("Error fetching workout tip from Gemini:", error);
        return "Sorry, I couldn't fetch a tip right now. Please check your connection and API key.";
    }
};
