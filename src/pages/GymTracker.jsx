import React, { useState } from 'react';
import Card from '../components/Card';
import { Plus, Trash2, Calendar, Clock, X, Dumbbell, History, Save, Play, BookOpen, Video, TrendingUp, Search } from 'lucide-react';
import GymExercises, { EXERCISE_DATA } from '../components/GymExercises';

import WorkoutSession from '../components/WorkoutSession';

const GymTracker = () => {

    // Initialize from LocalStorage with migration for old data
    const [exercises, setExercises] = useState(() => {
        const saved = localStorage.getItem('gym_exercises');
        let parsed = saved ? JSON.parse(saved) : [];
        // Migration: Ensure all have a date
        return parsed.map(ex => ({
            ...ex,
            date: ex.date || new Date().toISOString()
        }));
    });

    const [routines, setRoutines] = useState(() => {
        const saved = localStorage.getItem('gym_routines');
        return saved ? JSON.parse(saved) : [];
    });

    // Active Session State
    const [activeSession, setActiveSession] = useState(null);

    React.useEffect(() => {
        try {
            const isGuideMode = localStorage.getItem('active_workout_mode');
            const guideProgram = localStorage.getItem('active_program');

            if (isGuideMode === 'true' && guideProgram) {
                const parsed = JSON.parse(guideProgram);
                if (parsed && typeof parsed === 'object') {
                    setActiveSession(parsed);
                }
            }
        } catch (e) {
            console.error("Failed to load active session", e);
            // Auto-cleanup if corrupt
            localStorage.removeItem('active_workout_mode');
            localStorage.removeItem('active_program');
        }
    }, []);

    const handleCloseSession = () => {
        setActiveSession(null);
        localStorage.removeItem('active_workout_mode');
        localStorage.removeItem('active_program');
    };

    const handleCompleteSession = () => {
        alert("Great workout! Session complete.");
        handleCloseSession();
        // Maybe trigger confetti or switch tab?
        setActiveTab('log');
    };

    const handleLogActiveExercise = (exerciseData) => {
        const exerciseEntry = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...exerciseData
        };
        setExercises(prev => [exerciseEntry, ...prev]);
    };


    const [activeTab, setActiveTab] = useState('log'); // 'log' | 'history' | 'routines' | 'guide' | 'progress'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newExercise, setNewExercise] = useState({ name: '', sets: '', reps: '', weight: '' });
    const [viewVideo, setViewVideo] = useState(null); // URL of video to watch

    // Save to LocalStorage
    React.useEffect(() => {
        localStorage.setItem('gym_exercises', JSON.stringify(exercises));
    }, [exercises]);

    React.useEffect(() => {
        localStorage.setItem('gym_routines', JSON.stringify(routines));
    }, [routines]);

    const handleAddExercise = (e) => {
        e.preventDefault();
        if (!newExercise.name) return;

        const exerciseEntry = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...newExercise
        };

        setExercises([exerciseEntry, ...exercises]); // Add to top
        setNewExercise({ name: '', sets: '', reps: '', weight: '' });
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        setExercises(exercises.filter(ex => ex.id !== id));
    };

    // Filter for Today
    const todayStr = new Date().toDateString();
    const todaysExercises = exercises.filter(ex => new Date(ex.date).toDateString() === todayStr);

    const handleSaveRoutine = React.useCallback(() => {
        if (todaysExercises.length === 0) return;
        const name = prompt("Name your routine (e.g., 'Leg Day'):");
        if (!name) return;

        const newRoutine = {
            id: Date.now(),
            name,
            exercises: todaysExercises.map(ex => ({
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight
            }))
        };

        setRoutines(prev => [...prev, newRoutine]);
    }, [todaysExercises]);

    const handleLoadRoutine = (routine) => {
        // Option to start as active session or just load
        // For now, let's upgrade it to the Active Session text
        if (!window.confirm(`Start '${routine.name}'? This will launch the interactive workout guide.`)) return;

        // Start the session
        setActiveSession(routine);

        // Ensure unique IDs when we log them later? 
        // The session handler generates new IDs when logging, so we are good.
    };

    const handleDeleteRoutine = (id) => {
        if (window.confirm("Delete this routine?")) {
            setRoutines(routines.filter(r => r.id !== id));
        }
    };

    // Group for History
    const historyGroups = exercises.reduce((groups, ex) => {
        const dateKey = new Date(ex.date).toDateString();
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(ex);
        return groups;
    }, {});

    const handleAddToWorkoutFromGuide = (exerciseName) => {
        setNewExercise({ ...newExercise, name: exerciseName });
        setActiveTab('log');
        setIsModalOpen(true);
    };

    // Weekly Schedule State
    const [selectedDayIndex, setSelectedDayIndex] = useState(null); // For accordion expansion
    const [activeDaySession, setActiveDaySession] = useState(null); // The actual workout being run from the schedule

    // Auto-expand current day when entering schedule view
    React.useEffect(() => {
        if (activeSession?.weeklySchedule && selectedDayIndex === null) {
            const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDayName = daysMap[new Date().getDay()];
            const dayIndex = activeSession.weeklySchedule.findIndex(d => d.day === currentDayName);
            if (dayIndex !== -1) setSelectedDayIndex(dayIndex);
            else setSelectedDayIndex(0);
        }
    }, [activeSession, selectedDayIndex]);

    const handleStartDayWorkout = (dayRoutine) => {
        // Create a temporary routine object for the session
        const daySession = {
            title: `${activeSession.title} - ${dayRoutine.day}`,
            exercises: dayRoutine.exercises
        };
        setActiveDaySession(daySession);
    };

    const handleCompleteDaySession = () => {
        alert("Great job! Day complete.");
        setActiveDaySession(null);
        // Optionally mark day as complete in local storage or state
    };

    // RENDER SESSION OVERLAY
    if (activeSession) {
        // Validation: Check if session has valid data
        const isValidSession = activeSession && (
            (activeSession.weeklySchedule && Array.isArray(activeSession.weeklySchedule)) ||
            (activeSession.exercises && Array.isArray(activeSession.exercises) && activeSession.exercises.length > 0)
        );

        if (!isValidSession) {
            return (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    margin: '-1.5rem', // Counteract main padding
                    backgroundColor: '#121212', zIndex: 9999,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'white', padding: '20px', textAlign: 'center'
                }}>
                    <div style={{ marginBottom: '20px', color: 'var(--color-danger, #ef4444)' }}>
                        <X size={48} />
                    </div>
                    <h3 style={{ marginBottom: '10px' }}>Unable to load program data</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                        The program data seems to be missing or corrupted.
                    </p>
                    <button
                        onClick={handleCloseSession}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <X size={18} /> Close Session
                    </button>
                    <button
                        onClick={() => {
                            handleCloseSession();
                            window.location.reload();
                        }}
                        style={{
                            marginTop: '20px', background: 'none', border: 'none',
                            color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem'
                        }}
                    >
                        Force Reset
                    </button>
                </div>
            );
        }

        // 1. If we are running a specific day's workout from the schedule
        if (activeDaySession) {
            return (
                <div style={{ position: 'absolute', inset: 0, margin: '-1.5rem', zIndex: 9999, background: 'black' }}>
                    <WorkoutSession
                        routine={activeDaySession}
                        onClose={() => setActiveDaySession(null)}
                        onComplete={handleCompleteDaySession}
                        onLogExercise={handleLogActiveExercise}
                    />
                </div>
            );
        }

        // 2. If it's a Program with a Weekly Schedule -> Show Dashboard
        if (activeSession.weeklySchedule) {
            return (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    margin: '-1.5rem', // Counteract main padding
                    backgroundColor: '#121212', // Explicit dark background
                    zIndex: 9998, // High z-index to cover everything
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid var(--bg-input)',
                        position: 'sticky', top: 0,
                        backgroundColor: '#121212',
                        zIndex: 10
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <button onClick={handleCloseSession} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>{activeSession.title}</h2>
                                <span style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>Weekly Schedule</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px', paddingBottom: '80px' }}>
                        <div style={{ marginBottom: '20px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            Select a day to view exercises and start your workout.
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {activeSession.weeklySchedule.map((day, index) => {
                                const isExpanded = selectedDayIndex === index;
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            backgroundColor: 'var(--bg-card)',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            border: isExpanded ? '1px solid var(--color-primary)' : '1px solid var(--bg-input)',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div
                                            onClick={() => setSelectedDayIndex(isExpanded ? null : index)}
                                            style={{
                                                padding: '16px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                backgroundColor: isExpanded ? 'rgba(37, 99, 235, 0.1)' : 'transparent'
                                            }}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ color: isExpanded ? 'var(--color-primary)' : 'white', fontWeight: 'bold', fontSize: '1rem' }}>{day.day}</span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{day.focus}</span>
                                            </div>
                                            <div style={{ transform: isExpanded ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.2s', color: 'var(--text-muted)' }}>
                                                <Play size={16} fill="currentColor" />
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div style={{ borderTop: '1px solid var(--bg-input)', animation: 'fadeIn 0.3s' }}>
                                                <div style={{ padding: '16px' }}>
                                                    {day.exercises.length > 0 ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                            {day.exercises.map((ex, idx) => (
                                                                <div key={idx} style={{
                                                                    display: 'flex', justifyContent: 'space-between',
                                                                    fontSize: '0.9rem', color: 'var(--text-muted)',
                                                                    padding: '8px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '6px'
                                                                }}>
                                                                    <span style={{ color: 'white' }}>{ex.name}</span>
                                                                    <span style={{ color: 'var(--color-primary)' }}>{ex.sets} x {ex.reps}</span>
                                                                </div>
                                                            ))}

                                                            <button
                                                                onClick={() => handleStartDayWorkout(day)}
                                                                style={{
                                                                    marginTop: '15px',
                                                                    width: '100%',
                                                                    padding: '12px',
                                                                    backgroundColor: 'var(--color-primary)',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '8px',
                                                                    fontWeight: 'bold',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                <Play size={16} fill="currentColor" /> Start Workout
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>Rest Day</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        // 3. Fallback: Normal Routine (No Schedule) -> Direct Start
        return (
            <div style={{ position: 'absolute', inset: 0, margin: '-1.5rem', zIndex: 9999, background: 'black' }}>
                <WorkoutSession
                    routine={activeSession}
                    onClose={handleCloseSession}
                    onComplete={handleCompleteSession}
                    onLogExercise={handleLogActiveExercise}
                />
            </div>
        );
    }

    return (
        <div className="gym-page" style={{ position: 'relative' }}>
            {/* Header / Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-input)', padding: '4px', borderRadius: 'var(--radius-full)' }}>
                    <button
                        onClick={() => setActiveTab('log')}
                        style={getTabStyle(activeTab === 'log')}
                    >
                        <Dumbbell size={16} /> Workout
                    </button>
                    <button
                        onClick={() => setActiveTab('guide')}
                        style={getTabStyle(activeTab === 'guide')}
                    >
                        <Video size={16} /> Guide
                    </button>
                    <button
                        onClick={() => setActiveTab('routines')}
                        style={getTabStyle(activeTab === 'routines')}
                    >
                        <BookOpen size={16} /> Routines
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        style={getTabStyle(activeTab === 'history')}
                    >
                        <History size={16} /> History
                    </button>
                    <button
                        onClick={() => setActiveTab('progress')}
                        style={getTabStyle(activeTab === 'progress')}
                    >
                        <TrendingUp size={16} /> Progress
                    </button>
                </div>

                {activeTab === 'log' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            backgroundColor: 'var(--color-accent)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-full)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}
                    >
                        <Plus size={18} /> Add
                    </button>
                )}
            </div>

            {/* LOG TAB */}
            {activeTab === 'log' && (
                <div className="exercise-list">
                    {todaysExercises.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                            <Dumbbell size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                            <p>No exercises logged today.</p>
                            <button onClick={() => setIsModalOpen(true)} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Start a workout</button>
                            {routines.length > 0 && <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>or load a Routine</p>}
                        </div>
                    ) : (
                        <>
                            {todaysExercises.map(ex => (
                                <Card key={ex.id} className="exercise-item">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ margin: 0, color: 'var(--text-highlight)' }}>{ex.name}</h3>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', display: 'flex', gap: '12px' }}>
                                                <span><strong>{ex.sets}</strong> sets</span>
                                                <span><strong>{ex.reps}</strong> reps</span>
                                                <span><strong>{ex.weight}</strong> lbs</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Find video if available */}
                                    {(() => {
                                        const flatExercises = Object.values(EXERCISE_DATA).flat();
                                        const match = flatExercises.find(e =>
                                            e.name.toLowerCase() === ex.name.toLowerCase().trim() ||
                                            e.name.toLowerCase().includes(ex.name.toLowerCase().trim()) ||
                                            ex.name.toLowerCase().includes(e.name.toLowerCase())
                                        );
                                        if (match && match.video) {
                                            return (
                                                <button
                                                    onClick={() => setViewVideo(match)}
                                                    style={{
                                                        color: 'var(--color-primary)',
                                                        background: 'rgba(59, 130, 246, 0.1)',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        padding: '8px',
                                                        cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}
                                                    title="Watch Tutorial"
                                                >
                                                    <Play size={16} fill="currentColor" />
                                                </button>
                                            );
                                        } else {
                                            // Fallback: Link to YouTube Search
                                            return (
                                                <a
                                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        color: 'var(--text-muted)',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        padding: '8px',
                                                        cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        textDecoration: 'none'
                                                    }}
                                                    title="Search on YouTube"
                                                >
                                                    <Search size={16} />
                                                </a>
                                            );
                                        }
                                    })()}
                                    <button onClick={() => handleDelete(ex.id)} style={{ color: 'var(--text-muted)', opacity: 0.6, cursor: 'pointer', background: 'none', border: 'none' }}>
                                        <Trash2 size={18} />
                                    </button>

                                </Card>
                            ))}

                            <button
                                onClick={handleSaveRoutine}
                                style={{
                                    width: '100%',
                                    marginTop: '20px',
                                    padding: '12px',
                                    backgroundColor: 'rgba(var(--secondary-hue), 90%, 50%, 0.15)',
                                    color: 'var(--color-secondary)',
                                    border: '1px solid var(--color-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: 'bold'
                                }}
                            >
                                <Save size={18} /> Save as Routine
                            </button>
                        </>
                    )}
                </div>
            )
            }

            {/* GUIDE TAB */}
            {
                activeTab === 'guide' && (
                    <GymExercises onAddToWorkout={handleAddToWorkoutFromGuide} />
                )
            }

            {/* ROUTINES TAB */}
            {
                activeTab === 'routines' && (
                    <div className="routines-list">
                        {routines.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                                <BookOpen size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                                <p>No saved routines.</p>
                                <p style={{ fontSize: '0.9rem' }}>Build a workout in the 'Workout' tab and click 'Save as Routine'.</p>
                            </div>
                        ) : (
                            routines.map(routine => (
                                <Card key={routine.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ margin: 0, color: 'var(--text-highlight)' }}>{routine.name}</h3>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                                                {routine.exercises.length} exercises
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => handleDeleteRoutine(routine.id)}
                                                style={{ padding: '8px', color: 'var(--text-muted)' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleLoadRoutine(routine)}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: 'var(--color-primary)',
                                                    color: 'white',
                                                    borderRadius: 'var(--radius-sm)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                <Play size={16} /> Start
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )
            }

            {/* HISTORY TAB */}
            {
                activeTab === 'history' && (
                    <div className="history-list">
                        {Object.keys(historyGroups).sort((a, b) => new Date(b) - new Date(a)).map(date => (
                            <div key={date} style={{ marginBottom: 'var(--space-md)' }}>
                                <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', borderBottom: '1px solid var(--bg-input)', paddingBottom: '4px' }}>
                                    {date === todayStr ? 'Today' : date}
                                </h4>
                                {historyGroups[date].map(ex => (
                                    <div key={ex.id} style={{
                                        backgroundColor: 'var(--bg-card)',
                                        padding: '10px',
                                        borderRadius: 'var(--radius-sm)',
                                        marginBottom: '8px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 'bold' }}>{ex.name}</span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{ex.sets} x {ex.reps} @ {ex.weight}</span>
                                            </div>
                                            {/* Video Button for History */}
                                            {(() => {
                                                const flatExercises = Object.values(EXERCISE_DATA).flat();
                                                const match = flatExercises.find(e =>
                                                    e.name.toLowerCase() === ex.name.toLowerCase().trim() ||
                                                    e.name.toLowerCase().includes(ex.name.toLowerCase().trim()) ||
                                                    ex.name.toLowerCase().includes(e.name.toLowerCase())
                                                );
                                                if (match && match.video) {
                                                    return (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setViewVideo(match); }}
                                                            style={{
                                                                background: 'none', border: 'none', color: 'var(--color-primary)',
                                                                cursor: 'pointer', padding: '4px', opacity: 0.8
                                                            }}
                                                        >
                                                            <Play size={14} fill="currentColor" />
                                                        </button>
                                                    );
                                                } else {
                                                    return (
                                                        <a
                                                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                background: 'none', border: 'none', color: 'var(--text-muted)',
                                                                cursor: 'pointer', padding: '4px', opacity: 0.6,
                                                                display: 'flex', alignItems: 'center'
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                            title="Search on YouTube"
                                                        >
                                                            <Search size={14} />
                                                        </a>
                                                    );
                                                }
                                            })()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                        {Object.keys(historyGroups).length === 0 && (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No history yet.</div>
                        )}
                    </div>
                )
            }

            {/* ADD EXERCISE MODAL */}
            {
                isModalOpen && (
                    <div style={styles.overlay}>
                        <div style={styles.modal}>
                            <div style={styles.modalHeader}>
                                <h3 style={{ margin: 0 }}>Log Exercise</h3>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleAddExercise}>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={styles.label}>Exercise Name</label>
                                    <input
                                        list="exercise-suggestions"
                                        autoFocus
                                        style={styles.input}
                                        placeholder="e.g. Bench Press"
                                        value={newExercise.name}
                                        onChange={e => setNewExercise({ ...newExercise, name: e.target.value })}
                                    />
                                    <datalist id="exercise-suggestions">
                                        {Object.values(EXERCISE_DATA).flat().map(ex => (
                                            <option key={ex.id} value={ex.name} />
                                        ))}
                                    </datalist>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={styles.label}>Sets</label>
                                        <input type="number" style={styles.input} placeholder="3"
                                            value={newExercise.sets} onChange={e => setNewExercise({ ...newExercise, sets: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={styles.label}>Reps</label>
                                        <input type="number" style={styles.input} placeholder="10"
                                            value={newExercise.reps} onChange={e => setNewExercise({ ...newExercise, reps: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={styles.label}>Lbs</label>
                                        <input type="number" style={styles.input} placeholder="135"
                                            value={newExercise.weight} onChange={e => setNewExercise({ ...newExercise, weight: e.target.value })} />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    style={{
                                        ...styles.saveBtn,
                                        opacity: (!newExercise.name) ? 0.6 : 1,
                                        cursor: (!newExercise.name) ? 'not-allowed' : 'pointer'
                                    }}
                                    disabled={!newExercise.name}
                                >
                                    Log Set
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
            {/* VIDEO MODAL */}
            {
                viewVideo && (
                    <div style={styles.overlay} onClick={() => setViewVideo(null)}>
                        <div style={{ ...styles.modal, maxWidth: '500px', padding: '0' }} onClick={e => e.stopPropagation()}>
                            <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>{viewVideo.name}</h3>
                                <button onClick={() => setViewVideo(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', background: 'black' }}>
                                <iframe
                                    src={`${viewVideo.video.replace('youtube.com', 'youtube-nocookie.com')}?modestbranding=1&rel=0&autoplay=1`}
                                    title={viewVideo.name}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div style={{ padding: '15px', textAlign: 'center' }}>
                                <a
                                    href={viewVideo.video.replace('embed/', 'watch?v=')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--color-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
                                >
                                    Open in YouTube
                                </a>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

const getTabStyle = (isActive) => ({
    padding: '8px 16px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
    color: isActive ? 'white' : 'var(--text-muted)',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
});

const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
    },
    modal: {
        backgroundColor: 'var(--bg-card)',
        padding: '20px',
        borderRadius: 'var(--radius-md)',
        width: '100%',
        maxWidth: '350px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '6px',
        color: 'var(--text-muted)',
        fontSize: '0.8rem'
    },
    input: {
        width: '100%',
        padding: '10px',
        backgroundColor: 'var(--bg-input)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 'var(--radius-sm)',
        color: 'white',
        fontSize: '1rem',
        outline: 'none'
    },
    saveBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        borderRadius: 'var(--radius-md)',
        fontWeight: 'bold',
        border: 'none',
        marginTop: '10px'
    }
};

const ProgressView = ({ exercises }) => {
    const [selectedExercise, setSelectedExercise] = useState('');

    // Get unique exercise names
    const exerciseNames = React.useMemo(() => {
        const names = [...new Set(exercises.map(ex => ex.name))];
        return names.sort();
    }, [exercises]);

    // Select first exercise by default if available
    React.useEffect(() => {
        if (!selectedExercise && exerciseNames.length > 0) {
            setSelectedExercise(exerciseNames[0]);
        }
    }, [exerciseNames, selectedExercise]);

    // Calculate Data Points (Date vs Max Weight)
    const chartData = React.useMemo(() => {
        if (!selectedExercise) return [];

        const relevant = exercises.filter(ex => ex.name === selectedExercise);

        // Group by date and find max weight per date
        const byDate = relevant.reduce((acc, ex) => {
            const date = new Date(ex.date).toLocaleDateString();
            const weight = parseFloat(ex.weight) || 0;
            if (!acc[date] || weight > acc[date]) {
                acc[date] = weight;
            }
            return acc;
        }, {});

        // Convert to array and sort by date
        return Object.entries(byDate)
            .map(([date, weight]) => ({ date, weight, timestamp: new Date(date).getTime() }))
            .sort((a, b) => a.timestamp - b.timestamp);
    }, [selectedExercise, exercises]);

    // Calculate PR
    const personalRecord = React.useMemo(() => {
        if (chartData.length === 0) return 0;
        return Math.max(...chartData.map(d => d.weight));
    }, [chartData]);

    return (
        <div style={{ paddingBottom: '80px' }}>
            {/* Exercise Selector */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>Select Exercise</label>
                <div style={{ position: 'relative' }}>
                    <select
                        value={selectedExercise}
                        onChange={(e) => setSelectedExercise(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: 'var(--bg-card)',
                            color: 'white',
                            border: '1px solid var(--bg-input)',
                            borderRadius: 'var(--radius-md)',
                            appearance: 'none',
                            fontSize: '1rem'
                        }}
                    >
                        {exerciseNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>▼</div>
                </div>
            </div>

            {selectedExercise && chartData.length > 0 ? (
                <>
                    {/* PR Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                        padding: '20px',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                    }}>
                        <div>
                            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 'bold' }}>PERSONAL RECORD</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{personalRecord} <span style={{ fontSize: '1rem', opacity: 0.8 }}>lbs</span></div>
                        </div>
                        <TrendingUp size={40} color="white" style={{ opacity: 0.8 }} />
                    </div>

                    {/* Chart */}
                    <Card>
                        <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-highlight)' }}>Progress Chart</h3>
                        <div style={{ height: '250px', width: '100%' }}>
                            <SimpleLineChart data={chartData} />
                        </div>
                    </Card>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    {exerciseNames.length === 0 ? "No exercises logged yet." : "Select an exercise to see progress."}
                </div>
            )}
        </div>
    );
};

const SimpleLineChart = ({ data }) => {
    if (!data || data.length < 2) return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Need at least 2 entries to chart</div>;

    const maxW = Math.max(...data.map(d => d.weight));
    const minW = Math.min(...data.map(d => d.weight)) * 0.9;

    // Normalize logic
    const getY = (w) => {
        const range = maxW - minW || 1;
        // 20px padding top/bottom
        return 230 - ((w - minW) / range) * 200;
    };

    // Unused points variable removed

    // SVG Viewbox 0 0 300 250
    const svgPoints = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 280 + 10; // 10px padding sides
        const y = getY(d.weight);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 300 250" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {/* Grid Lines */}
            <line x1="0" y1="30" x2="300" y2="30" stroke="rgba(255,255,255,0.1)" strokeDasharray="4" />
            <line x1="0" y1="130" x2="300" y2="130" stroke="rgba(255,255,255,0.1)" strokeDasharray="4" />
            <line x1="0" y1="230" x2="300" y2="230" stroke="rgba(255,255,255,0.1)" strokeDasharray="4" />

            {/* Path */}
            <polyline
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="3"
                points={svgPoints}
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Dots */}
            {data.map((d, i) => {
                const x = (i / (data.length - 1)) * 280 + 10;
                const y = getY(d.weight);
                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r="4" fill="var(--bg-card)" stroke="var(--color-primary)" strokeWidth="2" />
                        {/* Optional Label for Max/Min points or just all */}
                        <text x={x} y={y - 12} fill="var(--text-muted)" fontSize="10" textAnchor="middle">{d.weight}</text>
                    </g>
                );
            })}
        </svg>
    );
};

export default GymTracker;
