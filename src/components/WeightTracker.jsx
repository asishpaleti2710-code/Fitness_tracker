import React, { useState, useEffect } from 'react';
import Card from './Card';
import { Scale, Trash2, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import './WeightTracker.css';

const WeightTracker = ({ history: propHistory, onHistoryChange }) => {
    const [weight, setWeight] = useState('');
    const [internalHistory, setInternalHistory] = useState(() => {
        const saved = localStorage.getItem('weight_history');
        return saved ? JSON.parse(saved) : [];
    });

    const history = propHistory || internalHistory;

    const setHistory = (newHistory) => {
        if (onHistoryChange) {
            onHistoryChange(newHistory);
        } else {
            setInternalHistory(newHistory);
        }
    };

    useEffect(() => {
        localStorage.setItem('weight_history', JSON.stringify(history));
    }, [history]);

    const handleLog = (e) => {
        e.preventDefault();
        if (!weight) return;

        const newEntry = {
            id: Date.now(),
            date: new Date().toISOString(),
            weight: parseFloat(weight)
        };

        // Sort by date descending
        const newHistory = [newEntry, ...history].sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(newHistory);
        setWeight('');
    };

    const deleteEntry = (id) => {
        if (window.confirm('Delete this entry?')) {
            setHistory(history.filter(h => h.id !== id));
        }
    };

    // Calculate Trend
    const latest = history[0]?.weight;
    const previous = history[1]?.weight;
    let trend = null;
    if (latest && previous) {
        const diff = latest - previous;
        if (diff < 0) trend = { icon: TrendingDown, color: 'var(--color-success)', text: `${Math.abs(diff.toFixed(1))} lbs` };
        else if (diff > 0) trend = { icon: TrendingUp, color: 'var(--color-danger)', text: `+${diff.toFixed(1)} lbs` };
        else trend = { icon: Minus, color: 'var(--text-muted)', text: 'No change' };
    }

    return (
        <div className="weight-tracker">
            <Card title="Log Weight">
                <form onSubmit={handleLog} className="wt-form">
                    <div className="wt-input-wrapper">
                        <Scale size={18} className="wt-icon" />
                        <input
                            type="number"
                            step="0.1"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Enter lbs..."
                            className="wt-input"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!weight}
                        className="wt-button"
                    >
                        Log
                    </button>
                </form>

                {trend && (
                    <div className="wt-trend">
                        <span className="wt-trend-label">Since last log:</span>
                        <div className="wt-trend-value" style={{ color: trend.color }}>
                            <trend.icon size={16} />
                            {trend.text}
                        </div>
                    </div>
                )}
            </Card>

            <div className="wt-history">
                <h3 className="wt-history-title">History</h3>
                {history.length === 0 ? (
                    <p className="wt-empty">No weight logs yet.</p>
                ) : (
                    <div className="wt-list">
                        {history.map(entry => (
                            <div key={entry.id} className="wt-item">
                                <div>
                                    <span className="wt-weight-text">{entry.weight} lbs</span>
                                    <div className="wt-date-text">
                                        {new Date(entry.date).toLocaleDateString()} &bull; {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteEntry(entry.id)}
                                    className="wt-delete-btn"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeightTracker;
