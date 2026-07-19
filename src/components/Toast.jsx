import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // Auto close after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const styles = {
        container: {
            position: 'fixed',
            bottom: '80px', // Above bottom nav
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(20, 20, 30, 0.95)', // Dark Tech Background
            color: type === 'success' ? '#00ff00' : '#ff4d4d', // Neon Text
            padding: '12px 24px',
            border: `1px solid ${type === 'success' ? '#00ff00' : '#ff4d4d'}`,
            borderLeft: `6px solid ${type === 'success' ? '#00ff00' : '#ff4d4d'}`, // Tech accent bar
            borderRadius: '4px', // Squarer "Tech" corners
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: `0 0 15px ${type === 'success' ? 'rgba(0,255,0,0.3)' : 'rgba(255,0,0,0.3)'}`,
            zIndex: 1000,
            animation: 'fadeInUp 0.3s ease-out',
            minWidth: '200px',
            backdropFilter: 'blur(5px)'
        },
        icon: {
            display: 'flex',
            alignItems: 'center',
            filter: `drop-shadow(0 0 5px ${type === 'success' ? '#00ff00' : '#ff4d4d'})`
        },
        message: {
            fontWeight: 'bold',
            fontSize: '0.9rem',
            fontFamily: "'Courier New', Courier, monospace", // Tech font
            textTransform: 'uppercase',
            letterSpacing: '1px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.icon}>
                {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
                    SYSTEM // ALERT
                </span>
                <span style={styles.message}>{message}</span>
            </div>
        </div>
    );
};

export default Toast;
