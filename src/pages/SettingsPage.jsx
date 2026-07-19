import React, { useState } from 'react';
import Card from '../components/Card';
import { Save, AlertTriangle, Target, Trash2 } from 'lucide-react';

const SettingsPage = ({ showToast }) => {
    const [goals, setGoals] = useState(() => {
        const saved = localStorage.getItem('user_goals');
        return saved ? JSON.parse(saved) : {
            calories: 2200,
            water: 8,
            steps: 10000
        };
    });

    const handleSave = () => {
        localStorage.setItem('user_goals', JSON.stringify(goals));
        if (showToast) showToast('Goals updated successfully!', 'success');
        else alert('Goals saved!');
    };

    const handleClearData = () => {
        if (window.confirm('Are you sure? This will delete ALL your history, logs, and profile data. This cannot be undone.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="settings-page">
            <div style={{ marginBottom: 'var(--space-md)' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)' }}>App Settings</h2>
                <p style={{ color: 'var(--text-muted)' }}>Customize your targets and manage data.</p>
            </div>

            <Card title="Daily Goals" icon={Target}>
                <div style={{ display: 'grid', gap: '15px' }}>
                    <div>
                        <label style={styles.label}>Calorie Target (kcal)</label>
                        <input
                            type="number"
                            style={styles.input}
                            value={goals.calories}
                            onChange={e => setGoals({ ...goals, calories: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div>
                        <label style={styles.label}>Water Goal (glasses)</label>
                        <input
                            type="number"
                            style={styles.input}
                            value={goals.water}
                            onChange={e => setGoals({ ...goals, water: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div>
                        <label style={styles.label}>Step Goal</label>
                        <input
                            type="number"
                            style={styles.input}
                            value={goals.steps}
                            onChange={e => setGoals({ ...goals, steps: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        style={styles.saveBtn}
                    >
                        <Save size={18} /> Save Goals
                    </button>
                </div>
            </Card>

            <div style={{ marginTop: 'var(--space-lg)' }}>
                <Card title="Danger Zone" style={{ borderColor: 'var(--color-accent)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontWeight: 'bold', color: 'var(--color-accent)' }}>Clear All Data</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reset everything and start fresh.</div>
                        </div>
                        <button
                            onClick={handleClearData}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: 'rgba(255, 50, 50, 0.2)',
                                color: 'var(--color-accent)',
                                border: '1px solid var(--color-accent)',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Trash2 size={18} /> Reset App
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const styles = {
    label: {
        display: 'block',
        marginBottom: '6px',
        color: 'var(--text-muted)',
        fontSize: '0.9rem'
    },
    input: {
        width: '100%',
        padding: '12px',
        backgroundColor: 'var(--bg-input)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-main)',
        fontSize: '1rem'
    },
    saveBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        borderRadius: 'var(--radius-md)',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '10px',
        border: 'none',
        cursor: 'pointer'
    }
};

export default SettingsPage;
