import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EXERCISE_DATA } from './GymExercises';

const WorkoutSession = ({ routine, onClose, onComplete, onLogExercise }) => {
    // Load saved index if available
    const [currentIndex, setCurrentIndex] = useState(() => {
        const savedIndex = localStorage.getItem('active_session_index');
        return savedIndex ? parseInt(savedIndex) : 0;
    });

    // Peristence
    useEffect(() => {
        localStorage.setItem('active_session_index', currentIndex);
    }, [currentIndex]);

    const [currentSet, setCurrentSet] = useState({ weight: '', reps: '' });
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isTimerRunning] = useState(true);
    const [notification, setNotification] = useState(null); // { message }

    const currentExercise = (routine && routine.exercises) ? routine.exercises[currentIndex] : null;

    // Find exercise details (image/video) from static data
    const exerciseDetails = currentExercise ? (Object.values(EXERCISE_DATA).flat().find(e =>
        e.name.toLowerCase() === currentExercise.name.toLowerCase()
    ) || {}) : {};

    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    // Safety check moved after hooks to comply with Rules of Hooks
    if (!routine || !routine.exercises || routine.exercises.length === 0 || !currentExercise) return null;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleNext = () => {
        if (currentIndex < routine.exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setCurrentSet({ weight: '', reps: '' }); // Reset input
        } else {
            // cleanup index before completing
            localStorage.removeItem('active_session_index');
            onComplete();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const showNotification = (msg) => {
        setNotification({ message: msg });
        setTimeout(() => setNotification(null), 2000);
    };

    const handleLogSet = () => {
        if (!currentSet.weight || !currentSet.reps) return;

        onLogExercise({
            name: currentExercise.name,
            weight: currentSet.weight,
            reps: currentSet.reps,
            sets: 1 // Log one set at a time or aggregate
        });

        // Optional: show feedback or clear inputs
        // For this "Guide Me" flow, we might just want to move to next or let them log multiple sets?
        // Let's assume the user logs specific sets one by one, OR they just log the "done" status.
        // Given the request "Guide Me", let's make it simple: Log it and maybe don't force move, 
        // but typically a guide moves you through. Let's reset inputs to allow another set or user clicks Next.
        setCurrentSet({ weight: '', reps: '' });
        showNotification(`Logged set for ${currentExercise.name}!`);
    };

    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'var(--bg-main)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '30px',
                            zIndex: 2100,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            fontWeight: 'bold'
                        }}
                    >
                        <CheckCircle size={18} />
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Header */}
            <div style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--bg-input)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                        <X size={24} />
                    </button>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1rem', color: 'white' }}>{routine.title || "Active Workout"}</h2>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                            Exercise {currentIndex + 1} of {routine.exercises.length}
                        </span>
                    </div>
                </div>
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.9rem',
                    color: 'white'
                }}>
                    <Clock size={14} />
                    {formatTime(elapsedTime)}
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
                {/* Media Area */}
                <div style={{
                    width: '100%',
                    height: '220px',
                    backgroundColor: 'black',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {exerciseDetails.video ? (
                        <iframe
                            src={`${exerciseDetails.video.replace('youtube.com', 'youtube-nocookie.com')}?modestbranding=1&rel=0&controls=0`}
                            title={currentExercise.name}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    ) : (
                        <div style={{ color: 'var(--text-muted)' }}>No Video Available</div>
                    )}
                </div>

                {/* Exercise Info */}
                <div style={{ padding: '20px' }}>
                    <h1 style={{ fontSize: '1.8rem', margin: '0 0 10px 0', color: 'white' }}>{currentExercise.name}</h1>

                    {/* Target Stats */}
                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        marginBottom: '20px',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem'
                    }}>
                        <div>
                            <strong style={{ color: 'var(--color-primary)', display: 'block', fontSize: '1.2rem' }}>{currentExercise.sets}</strong>
                            Sets
                        </div>
                        <div>
                            <strong style={{ color: 'var(--color-primary)', display: 'block', fontSize: '1.2rem' }}>{currentExercise.reps}</strong>
                            Reps
                        </div>
                        <div>
                            <strong style={{ color: 'var(--color-primary)', display: 'block', fontSize: '1.2rem' }}>{currentExercise.weight}</strong>
                            Lbs
                        </div>
                    </div>

                    {/* Logging Section */}
                    <div style={{
                        backgroundColor: 'var(--bg-card)',
                        padding: '20px',
                        borderRadius: '16px',
                        border: '1px solid var(--bg-input)'
                    }}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: 'white' }}>Log Set</h3>
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Weight (lbs)</label>
                                <input
                                    type="number"
                                    value={currentSet.weight}
                                    onChange={(e) => setCurrentSet({ ...currentSet, weight: e.target.value })}
                                    placeholder={currentExercise.weight}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'var(--bg-input)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1.1rem'
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Reps</label>
                                <input
                                    type="number"
                                    value={currentSet.reps}
                                    onChange={(e) => setCurrentSet({ ...currentSet, reps: e.target.value })}
                                    placeholder={currentExercise.reps}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'var(--bg-input)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1.1rem'
                                    }}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleLogSet}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.1)',
                                color: 'var(--color-primary)',
                                border: '1px solid var(--color-primary)',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            + Log Set
                        </button>
                    </div>

                    {/* Instructions */}
                    {exerciseDetails.instructions && (
                        <div style={{ marginTop: '20px' }}>
                            <h4 style={{ color: 'white', marginBottom: '10px' }}>Instructions</h4>
                            <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                {exerciseDetails.instructions.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Navigation */}
            <div style={{
                padding: '20px',
                borderTop: '1px solid var(--bg-input)',
                backgroundColor: 'var(--bg-card)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    style={{
                        padding: '12px 20px',
                        background: 'transparent',
                        border: '1px solid var(--bg-input)',
                        borderRadius: '30px',
                        color: currentIndex === 0 ? 'var(--text-muted)' : 'white',
                        cursor: currentIndex === 0 ? 'default' : 'pointer'
                    }}
                >
                    <ChevronLeft />
                </button>

                <div style={{ display: 'flex', gap: '4px' }}>
                    {routine.exercises.map((_, idx) => (
                        <div
                            key={idx}
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: idx === currentIndex ? 'var(--color-primary)' : 'var(--bg-input)'
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    style={{
                        padding: '12px 24px',
                        background: 'var(--color-primary)',
                        border: 'none',
                        borderRadius: '30px',
                        color: 'white',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}
                >
                    {currentIndex === routine.exercises.length - 1 ? 'Finish' : 'Next'}
                    {currentIndex < routine.exercises.length - 1 && <ChevronRight size={18} />}
                </button>
            </div>
        </div>
    );
};

export default WorkoutSession;
