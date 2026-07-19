import React from 'react';
import { X, Play, Clock, BarChart2, Star, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProgramDetailsModal = ({ isOpen, onClose, program, onStart }) => {
    if (!isOpen || !program) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            zIndex: 1000,
                            backdropFilter: 'blur(5px)'
                        }}
                    />

                    {/* Modal/Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            top: '15vh',
                            backgroundColor: 'var(--bg-main)',
                            borderTop: '2px solid var(--color-primary)',
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                            zIndex: 1001,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: '85vh' // Ensure it doesn't go off screen
                        }}
                    >
                        {/* Header Image Area */}
                        <div style={{ position: 'relative', height: '250px', flexShrink: 0 }}>
                            <img
                                src={program.image}
                                alt={program.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), var(--bg-main))'
                            }} />

                            <button
                                onClick={onClose}
                                style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    background: 'rgba(0,0,0,0.5)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    cursor: 'pointer',
                                    zIndex: 10 // Ensure clickable
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{
                            padding: '24px',
                            overflowY: 'auto',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative', // Context for potential pseudo-elements
                            marginTop: '-40px', // Pull content up slightly over image fade
                            zIndex: 5
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                <div>
                                    <div style={{
                                        color: 'var(--color-primary)',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        marginBottom: '4px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {program.tag}
                                    </div>
                                    <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'white', lineHeight: 1.2 }}>{program.title}</h2>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>
                                        by {program.author}
                                    </div>
                                </div>
                                <div style={{
                                    background: 'var(--bg-card)',
                                    padding: '8px 12px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    border: '1px solid var(--bg-input)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-warning)', fontWeight: 'bold' }}>
                                        <Star size={16} fill="currentColor" />
                                        {program.rating}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rating</div>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '15px',
                                margin: '20px 0',
                                padding: '20px 0',
                                borderTop: '1px solid var(--bg-input)',
                                borderBottom: '1px solid var(--bg-input)'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <Clock size={20} color="var(--color-primary)" style={{ marginBottom: '5px' }} />
                                    <div style={{ fontWeight: 'bold', color: 'white' }}>4 Weeks</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Duration</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <BarChart2 size={20} color="var(--color-primary)" style={{ marginBottom: '5px' }} />
                                    <div style={{ fontWeight: 'bold', color: 'white' }}>Intermediate</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Level</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <Download size={20} color="var(--color-primary)" style={{ marginBottom: '5px' }} />
                                    <div style={{ fontWeight: 'bold', color: 'white' }}>{program.downloads}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Downloads</div>
                                </div>
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '10px' }}>About this program</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                    Transform your physique with this comprehensive training program designed by {program.author}.
                                    Focusing on {program.tag} principles, this routine will push your limits and help you achieve your fitness goals.
                                    Perfect for those looking to take their training to the next level.
                                </p>
                            </div>

                            {/* Exercises / Preview (Simple List) */}
                            {program.exercises && (
                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '15px' }}>Exercises Preview</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {program.exercises.slice(0, 5).map((ex, idx) => (
                                            <div key={idx} style={{
                                                backgroundColor: 'var(--bg-card)',
                                                padding: '12px',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                border: '1px solid var(--bg-input)'
                                            }}>
                                                <span style={{ color: 'white', fontSize: '0.9rem' }}>{ex.name}</span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{ex.sets} x {ex.reps}</span>
                                            </div>
                                        ))}
                                        {program.exercises.length > 5 && (
                                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                                + {program.exercises.length - 5} more exercises
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Button */}
                            <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
                                <button
                                    onClick={() => onStart(program)}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: '30px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, var(--color-primary) 0%, #2563EB 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                                    }}
                                >
                                    <Play size={20} fill="currentColor" />
                                    Start Program
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProgramDetailsModal;
