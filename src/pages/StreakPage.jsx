import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy } from 'lucide-react';

import Card from '../components/Card';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'fitness_streak_data';

const StreakPage = () => {
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkStreak();
    }, []);

    const checkStreak = async () => {
        try {
            const { value } = await Preferences.get({ key: STORAGE_KEY });
            let data = value ? JSON.parse(value) : { currentStreak: 0, lastLoginDate: null };

            const today = new Date().toDateString();

            // If it's the first time ever
            if (!data.lastLoginDate) {
                data.currentStreak = 1;
                data.lastLoginDate = today;
            }
            else if (data.lastLoginDate !== today) {
                const last = new Date(data.lastLoginDate);
                const now = new Date();
                const diffTime = Math.abs(now - last);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    // Consecutive day
                    data.currentStreak += 1;
                } else if (diffDays > 1) {
                    // Broken streak
                    data.currentStreak = 1;
                }
                // Update date
                data.lastLoginDate = today;
            }

            // Save back
            await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(data) });
            setStreak(data.currentStreak);
        } catch (e) {
            console.error("Streak Error", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Syncing streak...
            </div>
        );
    }

    // Calculate Score (Streak * 100 + base 50)
    const score = (streak * 100) + 50;

    return (
        <div className="streak-page" style={{ paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginTop: '40px' }}
            >
                <h2 style={{
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '10px',
                    fontSize: '1rem'
                }}>
                    Consistency Score
                </h2>

                {/* Main Score Display */}
                <div style={{ position: 'relative', display: 'inline-block', padding: '20px' }}>
                    <h1 style={{
                        fontSize: '4rem',
                        fontWeight: '900',
                        margin: 0,
                        color: 'white',
                        textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                    }}>
                        {score.toLocaleString()}
                    </h1>
                </div>

                {/* Day Counter */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '0px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: '1px solid rgba(59, 130, 246, 0.4)'
                    }}>
                        <Flame size={20} color="#60A5FA" fill="#60A5FA" />
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#EFF6FF' }}>{streak} Day Streak</span>
                    </div>
                </div>
            </motion.div>

            {/* Weekly Milestones */}
            <Card className="milestone-card" style={{ marginTop: '40px', background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ margin: '0 0 20px 0', textAlign: 'center', color: 'var(--text-main)' }}>Weekly Milestones</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {[...Array(7)].map((_, i) => {
                        const dayNum = i + 1;
                        const isCompleted = streak % 7 >= dayNum || (streak > 0 && streak % 7 === 0);

                        return (
                            <div key={i} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <div style={{
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '50%',
                                    background: isCompleted ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: isCompleted ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none',
                                    transition: 'all 0.3s'
                                }}>
                                    {isCompleted ? (
                                        <Trophy size={16} color="white" />
                                    ) : (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dayNum}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Complete 7 days to reach the next tier!
                </div>
            </Card>
        </div>
    );
};

export default StreakPage;
