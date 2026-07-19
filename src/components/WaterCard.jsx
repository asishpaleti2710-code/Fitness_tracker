import React, { useState, useEffect } from 'react';
import Card from './Card';
import { Droplet, Plus, Minus } from 'lucide-react';

const WaterCard = () => {
    const todayStr = new Date().toDateString();

    const [glasses, setGlasses] = useState(() => {
        const saved = localStorage.getItem('water_intake');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.date === todayStr) {
                return parsed.count;
            }
        }
        return 0;
    });

    const [goal] = useState(() => {
        const goals = localStorage.getItem('user_goals');
        if (goals) {
            try {
                const parsed = JSON.parse(goals);
                if (parsed.water) return parsed.water;
            } catch {
                // Ignore error parsing goals
            }
        }
        return 8;
    });

    useEffect(() => {
        localStorage.setItem('water_intake', JSON.stringify({
            date: todayStr,
            count: glasses
        }));
    }, [glasses, todayStr]);

    return (
        <Card title="Hydration">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    position: 'relative',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                }}>
                    <Droplet
                        size={60}
                        fill={glasses > 0 ? "var(--color-secondary)" : "none"}
                        color="var(--color-secondary)"
                        style={{ opacity: 0.2, position: 'absolute' }}
                    />
                    <div style={{ zIndex: 1, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-highlight)' }}>
                        {glasses}
                    </div>
                </div>

                {/* Visual Glasses Row */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {Array.from({ length: goal }).map((_, i) => (
                        <div key={i} style={{
                            width: '8px',
                            height: '24px',
                            borderRadius: '4px',
                            backgroundColor: i < glasses ? 'var(--color-secondary)' : 'var(--bg-input)',
                            transition: 'background-color 0.3s'
                        }} />
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    <button
                        onClick={() => setGlasses(Math.max(0, glasses - 1))}
                        style={{
                            padding: '10px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-muted)'
                        }}
                    >
                        <Minus size={20} />
                    </button>
                    <button
                        onClick={() => setGlasses(glasses + 1)}
                        style={{
                            padding: '10px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(var(--secondary-hue), 90%, 50%, 0.2)', // translucent blue
                            color: 'var(--color-secondary)'
                        }}
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default WaterCard;
