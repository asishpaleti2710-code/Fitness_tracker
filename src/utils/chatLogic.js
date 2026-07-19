/**
 * Simple Rule-Based AI Engine for Fitness Tracker App.
 * Handles user queries by matching keywords to a knowledge base.
 */

const KNOWLEDGE_BASE = [
    {
        keywords: ['gym', 'workout', 'exercise', 'lift', 'training', 'train'],
        answer: "Yo! You ready to get stronger? Head to the **Gym Tracker** tab and click the dumbbell! You can also check the **Guide** tab to learn some new moves. Let's push past our limits!"
    },
    {
        keywords: ['food', 'eat', 'meal', 'diet', 'calories', 'protein', 'macro', 'hunger', 'ki'],
        answer: "You gotta eat big to get big! Use the **Food Tracker** (Utensils icon) to log your meals. Don't forget your protein! We'll track your energy levels automatically."
    },
    {
        keywords: ['step', 'walk', 'run', 'distance', 'pedometer', 'fly'],
        answer: "Training your legs is important too! Check the **Step Tracker** (Footprints icon). We'll count every step you take. Maybe one day you'll be fast enough to run across Snake Way!"
    },
    {
        keywords: ['profile', 'account', 'name', 'avatar', 'photo', 'power'],
        answer: "Want to update your fighter profile? Tap your avatar in the top left corner. You can change your name, picture, and manage your stats there!"
    },
    {
        keywords: ['delete', 'remove', 'account', 'destroy'],
        answer: "Whoa, are you sure? To delete your account, go to the **Profile** page and find 'Delete Account'. But think about all the training progress you'll lose!"
    },
    {
        keywords: ['login', 'logout', 'sign', 'password'],
        answer: "Heading out? You can log out from the top right header. Come back soon for more training!"
    },
    {
        keywords: ['theme', 'dark', 'light', 'mode', 'color'],
        answer: "Light or Dark? It's up to you! Toggle the Sun/Moon icon in the top right header."
    },
    {
        keywords: ['hello', 'hi', 'hey', 'start'],
        answer: "Yo! I'm Kakarot! I'm your training partner. Ask me anything about the app and let's get stronger together!"
    },
    {
        keywords: ['who', 'creator', 'made', 'developer'],
        answer: "I was built by a powerful creator using React! They made sure I'm fast and reliable for your training."
    }
];

const FALLBACK_ANSWERS = [
    "Not sure what that means, but it sounds strong! Try asking about workouts or food.",
    "I'm mostly focused on training and this app. Ask me how to log a workout!",
    "Is that a new technique? I can only help with the app features right now. Let's train!"
];

// Use VITE_API_URL from .env.local (dev) or .env.production (production)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const getBotResponse = async (userMessage, username) => {
    try {
        const response = await fetch(`${API_URL}/api/ai/chat?message=${encodeURIComponent(userMessage)}&username=${encodeURIComponent(username || 'fighter')}`, {
            method: 'POST'
        });
        if (response.ok) {
            const data = await response.json();
            return data.response;
        }
    } catch (error) {
        console.warn("FastAPI chat unavailable, falling back to local rule engine:", error);
    }

    // Simulate network delay for "AI" feel
    await new Promise(resolve => setTimeout(resolve, 600));

    const lowerMsg = userMessage.toLowerCase();

    // Find best match
    const match = KNOWLEDGE_BASE.find(item =>
        item.keywords.some(keyword => lowerMsg.includes(keyword))
    );

    if (match) {
        return match.answer;
    }

    // Random fallback
    return FALLBACK_ANSWERS[Math.floor(Math.random() * FALLBACK_ANSWERS.length)];
};

