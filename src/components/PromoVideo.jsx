import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, RotateCcw } from 'lucide-react';

const scenes = [
    {
        id: 1,
        image: '/assets/promo/scene2.png', // Explore Page
        title: "Stop Guessing.",
        subtitle: "Professional programs at your fingertips.",
        duration: 4000
    },
    {
        id: 2,
        image: '/assets/promo/scene1.png', // Active Guide
        title: "Start Training.",
        subtitle: "Immersive video guides for every rep.",
        duration: 4000
    },
    {
        id: 3,
        image: '/assets/promo/scene3.png', // Progress
        title: "See Results.",
        subtitle: "Track every gain. Smash every PR.",
        duration: 5000
    }
];

const PromoVideo = ({ onClose }) => {
    const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        if (isPlaying) {
            const sceneDuration = scenes[currentSceneIdx].duration;
            const step = 50; // update every 50ms

            interval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev + (step / sceneDuration) * 100;
                    if (newProgress >= 100) {
                        // Next scene
                        if (currentSceneIdx < scenes.length - 1) {
                            setCurrentSceneIdx(prevIdx => prevIdx + 1);
                            return 0;
                        } else {
                            // End of video
                            setIsPlaying(false);
                            return 100;
                        }
                    }
                    return newProgress;
                });
            }, step);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentSceneIdx]);

    const handleReplay = () => {
        setCurrentSceneIdx(0);
        setProgress(0);
        setIsPlaying(true);
    };

    const currentScene = scenes[currentSceneIdx];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'black',
                zIndex: 3000,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
            }}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 3010,
                    background: 'rgba(0,0,0,0.5)',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '10px',
                    color: 'white',
                    cursor: 'pointer'
                }}
            >
                <X size={24} />
            </button>

            {/* Scene Image with Ken Burns Effect */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentScene.id}
                    src={currentScene.image}
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.6
                    }}
                />
            </AnimatePresence>

            {/* Cinematic Text Overlay */}
            <div style={{
                position: 'absolute',
                zIndex: 3005,
                textAlign: 'center',
                width: '80%',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)'
            }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentScene.id}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 style={{
                            fontSize: '3rem',
                            fontWeight: '900',
                            color: 'white',
                            marginBottom: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            {currentScene.title}
                        </h1>
                        <p style={{
                            fontSize: '1.2rem',
                            color: 'var(--color-primary)',
                            fontWeight: 'bold'
                        }}>
                            {currentScene.subtitle}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '20px',
                right: '20px',
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '2px',
                zIndex: 3010,
                display: 'flex',
                gap: '8px'
            }}>
                {scenes.map((scene, idx) => (
                    <div key={scene.id} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', height: '100%', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: idx < currentSceneIdx ? '100%' : (idx === currentSceneIdx ? `${progress}%` : '0%'),
                            backgroundColor: 'var(--color-primary)',
                            transition: 'width 50ms linear'
                        }} />
                    </div>
                ))}
            </div>

            {/* End Screen / Replay */}
            {!isPlaying && currentSceneIdx === scenes.length - 1 && (
                <div style={{
                    position: 'absolute',
                    zIndex: 3020,
                    textAlign: 'center'
                }}>
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={handleReplay}
                        style={{
                            backgroundColor: 'white',
                            color: 'black',
                            border: 'none',
                            padding: '15px 30px',
                            borderRadius: '30px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)'
                        }}
                    >
                        <RotateCcw size={20} /> Watch Again
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
};

export default PromoVideo;
