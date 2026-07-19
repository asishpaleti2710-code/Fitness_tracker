import React from 'react';
import { Search, ScanLine, Mic, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import ScouterModal from './ScouterModal';

const QuickActionItem = ({ icon: Icon, label, hue, onClick }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '20px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: `1px solid hsl(${hue}, 80%, 40%)`, // Added border for DBZ feel
            cursor: 'pointer',
            width: '100%',
            aspectRatio: '1.5/1',
            boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 0 10px hsl(${hue}, 80%, 20%)` // Glow effect
        }}
    >
        <div style={{
            padding: '12px',
            borderRadius: '50%',
            backgroundColor: `hsla(${hue}, 80%, 50%, 0.2)`,
            color: `hsl(${hue}, 90%, 60%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid hsl(${hue}, 80%, 60%)`
        }}>
            <Icon size={24} />
        </div>
        <span style={{
            color: 'var(--text-main)',
            fontWeight: '600',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        }}>{label}</span>
    </button>
);

const QuickActionsModal = ({ isOpen, onClose, onNavigate }) => {
    const [isScouterOpen, setIsScouterOpen] = React.useState(false);
    const [scouterMode, setScouterMode] = React.useState('barcode'); // 'barcode' | 'meal'

    if (!isOpen && !isScouterOpen) return null;

    return (
        <>
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
                                backgroundColor: 'var(--bg-main)',
                                borderTop: '2px solid var(--color-primary)', // DBZ Border
                                borderTopLeftRadius: '24px',
                                borderTopRightRadius: '24px',
                                padding: '24px',
                                zIndex: 1001,
                                maxHeight: '90vh',
                                overflowY: 'auto'
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '4px',
                                backgroundColor: 'var(--color-primary)',
                                borderRadius: '2px',
                                margin: '0 auto 24px',
                                opacity: 0.8
                            }} />

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '16px',
                                marginBottom: '24px'
                            }}>
                                <QuickActionItem
                                    icon={Search}
                                    label="Log Food"
                                    hue="25" // Goku Orange
                                    onClick={() => { onNavigate('food'); onClose(); }}
                                />
                                <QuickActionItem
                                    icon={ScanLine}
                                    label="Barcode Scan"
                                    hue="220" // Vegeta Blue
                                    onClick={() => {
                                        onClose(); // Close sheet
                                        setScouterMode('barcode');
                                        setIsScouterOpen(true); // Open Scouter
                                    }}
                                />
                                <QuickActionItem
                                    icon={Mic}
                                    label="Voice Log"
                                    hue="50" // Super Saiyan Gold
                                    onClick={() => { /* Placeholder */ }}
                                />
                                <QuickActionItem
                                    icon={Camera}
                                    label="Meal Scan"
                                    hue="120" // Piccolo Green
                                    onClick={() => {
                                        onClose();
                                        setScouterMode('meal');
                                        setIsScouterOpen(true); // Also open scouter for meal scan
                                    }}
                                />
                            </div>

                            {/* List Items */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: 'var(--bg-card)',
                                borderRadius: '16px',
                                overflow: 'hidden'
                            }}>
                                {/* Reusing these for quick access to other trackers */}
                                <button
                                    onClick={() => { onNavigate('water'); onClose(); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '16px',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid var(--border-color)',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{ color: '#3B82F6' }}>💧</span>
                                    <span style={{ color: 'var(--text-main)', flex: 1 }}>Water</span>
                                </button>

                                <button
                                    onClick={() => { onNavigate('weight'); onClose(); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '16px',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid var(--border-color)',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{ color: '#22C55E' }}>⚖️</span>
                                    <span style={{ color: 'var(--text-main)', flex: 1 }}>Weight</span>
                                </button>

                                <button
                                    onClick={() => { onNavigate('gym'); onClose(); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '16px',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{ color: '#F97316' }}>🔥</span>
                                    <span style={{ color: 'var(--text-main)', flex: 1 }}>Exercise</span>
                                </button>
                            </div>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <ScouterModal isOpen={isScouterOpen} mode={scouterMode} onClose={() => setIsScouterOpen(false)} />
        </>
    );
};

export default QuickActionsModal;
