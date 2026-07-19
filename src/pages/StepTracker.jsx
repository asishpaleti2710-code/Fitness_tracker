import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Footprints, Target, BarChart as BarIcon } from 'lucide-react';

const StepTracker = () => {
    const todayKey = new Date().toDateString();

    const [stepHistory, setStepHistory] = useState(() => {
        const saved = localStorage.getItem('daily_steps');
        // Migration logic
        try {
            const parsed = JSON.parse(saved);
            if (typeof parsed === 'number') {
                return { [todayKey]: parsed };
            }
            return parsed || { [todayKey]: 0 };
        } catch {
            // Default or legacy plain number
            const num = parseInt(saved, 10);
            return { [todayKey]: isNaN(num) ? 0 : num };
        }
    });

    const [goal] = useState(10000);

    useEffect(() => {
        localStorage.setItem('daily_steps', JSON.stringify(stepHistory));
    }, [stepHistory]);

    const addSteps = (amount) => {
        setStepHistory(prev => ({
            ...prev,
            [todayKey]: (prev[todayKey] || 0) + amount
        }));
    };

    const todaySteps = stepHistory[todayKey] || 0;
    const percentage = Math.min(100, Math.round((todaySteps / goal) * 100));

    // Generate last 7 days data for chart
    const chartData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i)); // Go back 6 days to today
        const key = d.toDateString();
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
        return { label: dayLabel, value: stepHistory[key] || 0, isToday: i === 6 };
    });

    const maxVal = Math.max(...chartData.map(d => d.value), goal); // Scale chart to at least goal

    return (
        <div className="step-page">
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                <div style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(to right, var(--color-primary), var(--color-accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1
                }}>
                    {todaySteps.toLocaleString()}
                </div>
                <div style={{ color: 'var(--text-muted)' }}>Steps Today</div>
            </div>

            <Card className="progress-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Daily Goal</span>
                    <span>{percentage}%</span>
                </div>
                <div style={{
                    height: '12px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-input)',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                        transition: 'width 0.5s ease-out'
                    }}></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: 'var(--space-md)', color: 'var(--text-muted)' }}>
                    <Target size={16} />
                    <span>Target: {goal.toLocaleString()}</span>
                </div>
            </Card>

            {/* Weekly Bar Chart */}
            <Card title="Last 7 Days" className="chart-card">
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '150px', paddingTop: '20px' }}>
                    {chartData.map((day, idx) => {
                        const heightPct = Math.min(100, (day.value / maxVal) * 100);
                        return (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    {/* Tooltip on hover could go here, for now just the bar */}
                                    <div style={{
                                        width: '12px',
                                        height: `${heightPct}%`,
                                        backgroundColor: day.isToday ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                                        borderRadius: '4px',
                                        transition: 'height 0.3s ease'
                                    }}></div>
                                </div>
                                <span style={{ fontSize: '0.7rem', color: day.isToday ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                                    {day.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <button
                onClick={() => addSteps(500)} // Simulation button
                style={{
                    width: '100%',
                    padding: 'var(--space-md)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--color-primary-light)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-sm)',
                    marginTop: 'var(--space-md)'
                }}
            >
                <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(var(--primary-hue), 80%, 60%, 0.1)' }}>
                    <Footprints size={20} />
                </div>
                Simulate 500 Steps
            </button>
        </div>
    );
};

export default StepTracker;
