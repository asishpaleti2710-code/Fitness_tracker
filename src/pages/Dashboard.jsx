import React, { useState, useEffect } from 'react';
import { fetchAIHealth } from '../services/api';
import Card from '../components/Card';
import WaterCard from '../components/WaterCard';
import WeightTracker from '../components/WeightTracker';
import { Activity, Flame, Utensils } from 'lucide-react';

const StatRow = ({ icon: Icon, label, value, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div style={{
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: `rgba(${color}, 0.15)`,
                color: `hsl(${color}, 80%, 60%)`
            }}>
                <Icon size={20} />
            </div>
            <span style={{ color: 'var(--text-main)' }}>{label}</span>
        </div>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{value}</span>
    </div>
);

// --- Simple SVG Line Chart Component ---
const ProgressChart = ({ data, color = "#22C55E" }) => {
    // Expects data to be array of { date: string, value: number }
    // For demo/mockup if empty
    const chartData = data && data.length > 0 ? data : [
        { date: '21/01', value: 53.0 },
        { date: '22/01', value: 53.1 },
        { date: '23/01', value: 53.0 },
        { date: '24/01', value: 52.9 },
        { date: '25/01', value: 53.0 },
        { date: '26/01', value: 53.0 },
        { date: '27/01', value: 53.0 },
    ];

    const values = chartData.map(d => d.value);
    const minVal = Math.min(...values) - 1;
    const maxVal = Math.max(...values) + 1;
    const range = maxVal - minVal;

    // SVG Dimensions
    const width = 300;
    const height = 150;
    const padding = 20;

    // Scale functions
    const getX = (index) => padding + (index / (chartData.length - 1)) * (width - 2 * padding);
    const getY = (value) => height - padding - ((value - minVal) / range) * (height - 2 * padding);

    // Generate Path
    const points = chartData.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');

    return (
        <div style={{ padding: '0px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 16px 0' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>Weight</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>1 Week</span>
            </div>
            <div style={{ position: 'relative', width: '100%', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    {/* Grid Lines (Optional) */}
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border-color)" strokeWidth="1" />
                    <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="var(--border-color)" strokeDasharray="4" strokeWidth="1" opacity="0.3" />

                    {/* Chart Line */}
                    <polyline
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        points={points}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Points (Optional) */}
                    {chartData.map((d, i) => (
                        <circle cx={getX(i)} cy={getY(d.value)} r="3" fill="var(--bg-card)" stroke={color} strokeWidth="2" key={i} />
                    ))}
                </svg>
                {/* X-Axis Labels (Simplified) */}
                <div style={{ position: 'absolute', bottom: '0px', width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 20px', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                    <span>{chartData[0].date}</span>
                    <span>{chartData[chartData.length - 1].date}</span>
                </div>
            </div>
        </div>
    );
};

const Dashboard = ({ user }) => {
    const [stats] = useState(() => {
        // 1. Fetch Food Data
        const foodData = localStorage.getItem('food_meals');
        let totalCal = 0;
        if (foodData) {
            try {
                const parsed = JSON.parse(foodData);
                if (Array.isArray(parsed)) {
                    // New Format: Array of objects with date
                    const todayStr = new Date().toDateString();
                    totalCal = parsed
                        .filter(item => new Date(item.date).toDateString() === todayStr)
                        .reduce((acc, item) => acc + (item.cals || 0), 0);
                } else if (parsed) {
                    // Legacy Format: Object of arrays
                    totalCal = Object.values(parsed).flat().reduce((acc, item) => acc + (item.cals || 0), 0);
                }
            } catch {
                // Ignore error parsing food meals
            }
        }

        // 2. Fetch Gym Data
        const gymData = localStorage.getItem('gym_exercises');
        let exerciseCount = 0;
        if (gymData) {
            try {
                const exercises = JSON.parse(gymData);
                exerciseCount = exercises.length;
            } catch {
                // Ignore error parsing gym exercises
            }
        }

        // 3. Fetch Step Data
        const stepData = localStorage.getItem('daily_steps');
        let steps = 0;
        if (stepData) {
            steps = parseInt(stepData, 10) || 0;
        }

        const calculatedBurn = exerciseCount * 50; // Simple simulation + can add steps burn if wanted

        return {
            steps: steps,
            caloriesBurned: calculatedBurn,
            caloriesConsumed: totalCal,
            workoutsCount: exerciseCount
        };
    });

    const [goal] = useState(() => {
        const userGoals = localStorage.getItem('user_goals');
        if (userGoals) {
            try {
                const parsed = JSON.parse(userGoals);
                if (parsed.calories) return parsed.calories;
            } catch {
                // Ignore error parsing goals
            }
        }
        return 2200;
    });
    const [aiStatus, setAiStatus] = useState('checking'); // checking, online, offline
    const [weightHistory, setWeightHistory] = useState(() => {
        const saved = localStorage.getItem('weight_history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        // Check AI Backend Health
        const checkAI = async () => {
            const health = await fetchAIHealth();
            if (health && health.status === "AI Service is running") {
                setAiStatus('online');
            } else {
                setAiStatus('offline');
            }
        };
        checkAI();
    }, []);

    // Derive chart data from logged history (reverse to chronological order)
    const chartData = [...weightHistory]
        .reverse()
        .map(item => ({
            date: new Date(item.date).toLocaleDateString([], { month: '2-digit', day: '2-digit' }),
            value: item.weight
        }));

    // MyFitnessPal Formula: Goal - Food + Exercise = Remaining
    const caloriesRemaining = goal - stats.caloriesConsumed + stats.caloriesBurned;

    return (
        <div className="dashboard-page">
            <div style={{ marginBottom: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--color-highlight)' }}>
                        Welcome back, {user?.name || 'Athlete'}!
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Here is your daily activity overview.</p>
                </div>
                <div style={{
                    padding: '8px 12px',
                    borderRadius: '20px',
                    backgroundColor: aiStatus === 'online' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: aiStatus === 'online' ? '#22c55e' : '#ef4444',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: aiStatus === 'online' ? '#22c55e' : '#ef4444' }}></div>
                    AI Brain: {aiStatus === 'online' ? 'Online' : 'Offline'}
                </div>
            </div>

            {/* Dynamic Progress Chart Section */}
            <ProgressChart data={chartData} />

            <div style={{ marginBottom: 'var(--space-md)' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '10px' }}>Daily Summary</h3>
            </div>

            <Card title="Training Report">
                <StatRow
                    icon={Activity}
                    label="Steps"
                    value={stats.steps}
                    color="190" // Secondary hue
                />
                <StatRow
                    icon={Flame}
                    label="Calories Burned"
                    value={stats.caloriesBurned}
                    color="320" // Accent hue
                />
                <StatRow
                    icon={Utensils}
                    label="Calories Intake"
                    value={stats.caloriesConsumed}
                    color="25" // Goku Orange (Primary hue)
                />
            </Card>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', // Responsive grid
                gap: 'var(--space-md)'
            }}>
                <Card title="Training Log">
                    <div style={{ textAlign: 'center', padding: 'var(--space-sm) 0' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.workoutsCount}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sessions</div>
                    </div>
                </Card>
                <Card title="Calories Remaining">
                    <div style={{ textAlign: 'center', padding: 'var(--space-sm) 0' }}>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: caloriesRemaining >= 0 ? 'var(--color-accent)' : 'var(--color-danger)'
                        }}>
                            {caloriesRemaining}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {goal} (Target) - {stats.caloriesConsumed} (In) + {stats.caloriesBurned} (Out)
                        </div>
                    </div>
                </Card>

                {/* Water Tracker */}
                <WaterCard />
            </div>

            <div style={{ marginTop: 'var(--space-lg)' }}>
                <WeightTracker history={weightHistory} onHistoryChange={setWeightHistory} />
            </div>

        </div>
    );
};

export default Dashboard;
