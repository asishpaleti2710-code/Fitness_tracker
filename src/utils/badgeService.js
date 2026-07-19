import { Trophy, Droplet, Dumbbell, Footprints, Utensils } from 'lucide-react';

export const BADGES = [
    {
        id: 'stepper',
        title: 'First Steps',
        desc: 'Walk 100 steps in a day.',
        icon: Footprints,
        color: 'var(--color-secondary)' // Cyan
    },
    {
        id: 'marathoner',
        title: 'Marathoner',
        desc: 'Walk 10,000 steps in a day.',
        icon: Trophy,
        color: 'gold' // Gold
    },
    {
        id: 'gym_rat',
        title: 'Gym Rat',
        desc: 'Log 5 exercises total.',
        icon: Dumbbell,
        color: 'var(--color-primary)' // Purple
    },
    {
        id: 'hydrated',
        title: 'Hydrated',
        desc: 'Drink 8 glasses of water.',
        icon: Droplet,
        color: 'var(--color-secondary)' // Blue/Cyan
    },
    {
        id: 'foodie',
        title: 'Tracker',
        desc: 'Log your first meal.',
        icon: Utensils,
        color: 'var(--color-accent)' // Pink
    }
];

export const BadgeService = {
    getUnlockedBadges: () => {
        const unlocked = [];

        // 1. Check Steps
        const stepsData = localStorage.getItem('daily_steps');
        if (stepsData) {
            // Logic to check max steps ever... simplified to "current saved" or "today" for now
            // Better: parse history if object
            try {
                const parsed = JSON.parse(stepsData);
                let maxSteps = 0;
                if (typeof parsed === 'number') maxSteps = parsed;
                else maxSteps = Math.max(...Object.values(parsed));

                if (maxSteps >= 100) unlocked.push('stepper');
                if (maxSteps >= 10000) unlocked.push('marathoner');
            } catch {
                // Ignore
            }
        }

        // 2. Check Gym
        const gymData = localStorage.getItem('gym_exercises');
        if (gymData) {
            try {
                const exercises = JSON.parse(gymData);
                if (exercises.length >= 5) unlocked.push('gym_rat');
            } catch {
                // Ignore
            }
        }

        // 3. Check Water (Today only primarily, strictly speaking)
        const waterData = localStorage.getItem('water_intake');
        if (waterData) {
            try {
                const parsed = JSON.parse(waterData);
                // Ideally we'd want to know if *ever* hit 8, but for now check current state
                if (parsed.count >= 8) unlocked.push('hydrated');
            } catch {
                // Ignore
            }
        }

        // 4. Check Food
        const foodData = localStorage.getItem('food_meals');
        if (foodData) {
            try {
                const parsed = JSON.parse(foodData);
                // If array/legacy object has any entries
                let hasFood = false;
                if (Array.isArray(parsed)) hasFood = parsed.length > 0;
                else hasFood = Object.values(parsed).some(arr => arr.length > 0);

                if (hasFood) unlocked.push('foodie');
            } catch {
                // Ignore
            }
        }

        return unlocked;
    }
};
