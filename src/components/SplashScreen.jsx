import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Utensils, Footprints, Activity } from 'lucide-react';
import introVideo from '../assets/intro.mp4';

const SplashScreen = ({ onComplete }) => {
    // Video end handler is now the primary way to complete
    const handleVideoEnd = () => {
        onComplete();
    };

    // Fallback timer just in case video fails or logic hangs
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 8000); // 8s fallback
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'black',
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden'
        }}>
            {/* Background Video */}
            <video
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                    opacity: 0.8 // Slightly darken for better overlay visibility
                }}
            >
                <source src={introVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Dark Overlay Gradient for Readability */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
                zIndex: 1
            }} />

            {/* Content Overlay */}
            <div style={{
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Icons Row */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    {[Dumbbell, Utensils, Footprints, Activity].map((Icon, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.5 + (i * 0.2),
                                type: "spring",
                                stiffness: 200,
                                damping: 10
                            }}
                            style={{
                                padding: '15px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}
                        >
                            <Icon size={32} color={['#60A5FA', '#22D3EE', '#818CF8', '#A78BFA'][i]} />
                        </motion.div>
                    ))}
                </div>

                {/* Text Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                >
                    <h1 style={{
                        color: 'white',
                        fontSize: '3.5rem',
                        fontWeight: '900', // Extra Bold
                        textAlign: 'center',
                        textShadow: '0 4px 20px rgba(0,0,0,0.8)', // Stronger shadow
                        letterSpacing: '2px',
                        fontFamily: 'Inter, sans-serif',
                        textTransform: 'uppercase'
                    }}>
                        Fitness Tracker
                    </h1>
                </motion.div>
            </div>

            {/* Skip Button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                onClick={onComplete}
                style={{
                    position: 'absolute',
                    bottom: '40px',
                    padding: '10px 24px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    zIndex: 20,
                    fontWeight: '500',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem'
                }}
            >
                Skip Intro
            </motion.button>
        </div>
    );
};

export default SplashScreen;
