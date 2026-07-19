// Use VITE_API_URL from .env.local (dev) or .env.production (production)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const fetchAIHealth = async () => {
    try {
        const response = await fetch(`${API_URL}/api/ai/health`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching AI health:", error);
        return null;
    }
};

export const generateWorkout = async (goal, fitnessLevel) => {
    try {
        const response = await fetch(`${API_URL}/api/ai/generate-workout?goal=${goal}&fitness_level=${fitnessLevel}`, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error generating workout:", error);
        return null;
    }
};

export const scanMeal = async (textHint) => {
    try {
        const response = await fetch(`${API_URL}/api/ai/scan-meal?text_hint=${encodeURIComponent(textHint)}`, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error scanning meal:", error);
        return null;
    }
};

export const trainScouter = async () => {
    try {
        const response = await fetch(`${API_URL}/api/ai/train-scouter`, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error training scouter model:", error);
        return null;
    }
};

export const getScouterStatus = async () => {
    try {
        const response = await fetch(`${API_URL}/api/ai/scouter-status`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error getting scouter status:", error);
        return null;
    }
};

