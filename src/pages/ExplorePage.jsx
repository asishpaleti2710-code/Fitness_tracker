import React, { useState } from 'react';
import { Search, Star, Bookmark, User, TrendingUp, Compass, Play } from 'lucide-react';
import Card from '../components/Card';
import ProgramDetailsModal from '../components/ProgramDetailsModal';
import PromoVideo from '../components/PromoVideo';

// Mock Data for Programs
const MOCK_PROGRAMS = {
    popular: [
        {
            id: 1,
            title: 'Total Body Power',
            author: 'Elite Fitness',
            downloads: '89k',
            rating: 4.3,
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            tag: 'Full Body',
            // Detailed weekly schedule as requested
            weeklySchedule: [
                {
                    day: 'Monday',
                    focus: 'Chest & Triceps',
                    exercises: [
                        { name: 'Barbell Bench Press', sets: 4, reps: '8-10', weight: '135 lbs' },
                        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weight: '50 lbs' },
                        { name: 'Cable Flys', sets: 3, reps: '12-15', weight: '25 lbs' },
                        { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', weight: '40 lbs' },
                        { name: 'Skull Crushers', sets: 3, reps: '10-12', weight: '60 lbs' }
                    ]
                },
                {
                    day: 'Tuesday',
                    focus: 'Back & Biceps',
                    exercises: [
                        { name: 'Deadlift', sets: 4, reps: '5-8', weight: '225 lbs' },
                        { name: 'Pull-Ups', sets: 3, reps: 'AMRAP', weight: 'Bodyweight' },
                        { name: 'Bent Over Rows', sets: 3, reps: '8-10', weight: '135 lbs' },
                        { name: 'Barbell Curls', sets: 3, reps: '10-12', weight: '65 lbs' },
                        { name: 'Hammer Curls', sets: 3, reps: '12-15', weight: '30 lbs' }
                    ]
                },
                {
                    day: 'Wednesday',
                    focus: 'Active Recovery / Cardio',
                    exercises: [
                        { name: 'Light Jogging', sets: 1, reps: '30 mins', weight: '-' },
                        { name: 'Stretching Routine', sets: 1, reps: '15 mins', weight: '-' }
                    ]
                },
                {
                    day: 'Thursday',
                    focus: 'Legs & Abs',
                    exercises: [
                        { name: 'Barbell Squat', sets: 4, reps: '8-10', weight: '185 lbs' },
                        { name: 'Leg Press', sets: 3, reps: '10-12', weight: '300 lbs' },
                        { name: 'Romanian Deadlift', sets: 3, reps: '10-12', weight: '135 lbs' },
                        { name: 'Calf Raises', sets: 4, reps: '15-20', weight: '100 lbs' },
                        { name: 'Plank', sets: 3, reps: '60 sec', weight: '-' }
                    ]
                },
                {
                    day: 'Friday',
                    focus: 'Shoulders & Arms',
                    exercises: [
                        { name: 'Overhead Press', sets: 4, reps: '8-10', weight: '95 lbs' },
                        { name: 'Lateral Raises', sets: 3, reps: '12-15', weight: '20 lbs' },
                        { name: 'Face Pulls', sets: 3, reps: '15-20', weight: '40 lbs' },
                        { name: 'Super Set: Bicep Curls', sets: 3, reps: '12', weight: '30 lbs' },
                        { name: 'Super Set: Tricep Ext', sets: 3, reps: '12', weight: '40 lbs' }
                    ]
                },
                {
                    day: 'Saturday',
                    focus: 'Full Body Circuit',
                    exercises: [
                        { name: 'Kettlebell Swings', sets: 3, reps: '20', weight: '35 lbs' },
                        { name: 'Box Jumps', sets: 3, reps: '15', weight: '-' },
                        { name: 'Push-Ups', sets: 3, reps: '20', weight: '-' },
                        { name: 'Burpees', sets: 3, reps: '10', weight: '-' }
                    ]
                },
                {
                    day: 'Sunday',
                    focus: 'Rest Day',
                    exercises: []
                }
            ],
            exercises: [ // Fallback / Simple List if needed elsewhere
                { name: 'Barbell Squat', sets: 3, reps: 10, weight: 135 },
                { name: 'Barbell Bench Press', sets: 3, reps: 10, weight: 135 },
                { name: 'Lat Pulldown', sets: 3, reps: 12, weight: 120 },
                { name: 'Dumbbell Bicep Curl', sets: 3, reps: 12, weight: 25 },
                { name: 'Tricep Pushdown', sets: 3, reps: 12, weight: 40 }
            ]
        },
        {
            id: 2,
            title: 'Hypertrophy Split: 4-Day',
            author: 'IronCore Systems',
            downloads: '94k',
            rating: 4.4,
            image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            tag: 'Build Muscle',
            exercises: [
                { name: 'Barbell Bench Press', sets: 4, reps: 8, weight: 155 },
                { name: 'Incline Barbell Bench Press', sets: 3, reps: 10, weight: 135 },
                { name: 'Dumbbell Chest Fly', sets: 3, reps: 12, weight: 35 },
                { name: 'Overhead Press', sets: 4, reps: 8, weight: 95 },
                { name: 'Lateral Raises', sets: 3, reps: 15, weight: 20 }
            ]
        },
        {
            id: 3,
            title: 'Lower Body Blast',
            author: 'Leg Day Lab',
            downloads: '61k',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            tag: 'Legs Focus',
            exercises: [
                { name: 'Barbell Squat', sets: 4, reps: 6, weight: 225 },
                { name: 'Romanian Deadlift (RDL)', sets: 3, reps: 10, weight: 185 },
                { name: 'Leg Press', sets: 3, reps: 12, weight: 300 },
                { name: 'Standing Calf Raise', sets: 4, reps: 15, weight: 100 },
                { name: 'Walking Lunges', sets: 3, reps: 20, weight: 40 }
            ]
        },
    ],
    recommended: [
        {
            id: 4,
            title: 'Push Pull Legs: Advanced',
            author: 'Pro Athlete Logic',
            downloads: '29k',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            tag: 'PPL',
            exercises: [
                { name: 'Barbell Deadlift', sets: 3, reps: 5, weight: 275 },
                { name: 'Pull Up', sets: 3, reps: 8, weight: 0 },
                { name: 'Seated Cable Row', sets: 3, reps: 10, weight: 140 },
                { name: 'Face Pull', sets: 3, reps: 15, weight: 50 },
                { name: 'Dumbbell Hammer Curl', sets: 3, reps: 12, weight: 30 }
            ]
        },
        {
            id: 5,
            title: '12-Week Lean Shred',
            author: 'MetaShred',
            downloads: '31k',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            tag: 'Fat Loss',
            exercises: [
                { name: 'Running', sets: 1, reps: 30, weight: 0 }, // Placeholder for cardio
                { name: 'Plank', sets: 3, reps: 60, weight: 0 },
                { name: 'Russian Twist', sets: 3, reps: 20, weight: 0 },
                { name: 'Walking Lunges', sets: 3, reps: 20, weight: 0 },
                { name: 'Burpees', sets: 3, reps: 15, weight: 0 }
            ]
        },
    ],
    trending: [
        {
            id: 6,
            title: 'Home Bodyweight Basics',
            author: 'Calisthenics Daily',
            downloads: '755',
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            tag: 'Home',
            exercises: [
                { name: 'Push Up', sets: 3, reps: 20, weight: 0 },
                { name: 'Bodyweight Squat', sets: 3, reps: 25, weight: 0 },
                { name: 'Crunches', sets: 3, reps: 30, weight: 0 }
            ]
        },
        {
            id: 7,
            title: 'Bench Press Specialist',
            author: 'PowerLifting Pro',
            downloads: '227',
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1517963879466-e9b5ce382504?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            tag: 'Strength',
            exercises: [
                { name: 'Barbell Bench Press', sets: 5, reps: 5, weight: 185 },
                { name: 'Incline Barbell Bench Press', sets: 4, reps: 8, weight: 155 },
                { name: 'Tricep Pushdown', sets: 3, reps: 12, weight: 50 }
            ]
        },
    ]
};

const ExplorePage = ({ onNavigate, showToast }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [showPromo, setShowPromo] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);

    // Categories list for filtering
    const categories = ['All', 'Full Body', 'Build Muscle', 'Legs Focus', 'PPL', 'Fat Loss', 'Strength', 'Home'];

    // Combine all mock programs and remove duplicates by ID
    const allPrograms = [
        ...MOCK_PROGRAMS.popular,
        ...MOCK_PROGRAMS.recommended,
        ...MOCK_PROGRAMS.trending
    ];
    const uniquePrograms = Array.from(new Map(allPrograms.map(p => [p.id, p])).values());

    // Filter logic
    const filteredPrograms = uniquePrograms.filter(program => {
        const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            program.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || program.tag.toLowerCase() === activeCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    const handleStartProgram = (program) => {
        // Load routines from localStorage
        const savedRoutines = localStorage.getItem('gym_routines');
        let routines = [];
        try {
            if (savedRoutines) {
                routines = JSON.parse(savedRoutines);
            }
        } catch (e) {
            console.error("Failed to parse routines", e);
        }

        // Format the new routine
        const routineToAdd = {
            id: Date.now(),
            name: program.title,
            exercises: program.exercises || []
        };

        // Prevent duplicates
        if (!routines.some(r => r.name === routineToAdd.name)) {
            routines.push(routineToAdd);
            localStorage.setItem('gym_routines', JSON.stringify(routines));
        }

        // Close details
        setSelectedProgram(null);

        // Toast feedback
        if (showToast) {
            showToast(`"${program.title}" added to Gym Tracker!`, 'success');
        } else {
            alert(`"${program.title}" downloaded!`);
        }

        // Redirect to Gym tab
        if (onNavigate) {
            onNavigate('gym');
        }
    };

    return (
        <div className="explore-page" style={{ paddingBottom: '80px' }}>
            {/* Header section */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)' }}>Training Guides</h2>
                <p style={{ color: 'var(--text-muted)' }}>Explore pro plans and install templates to fast-track your training.</p>
            </div>

            {/* Featured Video Header Banner */}
            <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                marginBottom: 'var(--space-lg)',
                height: '180px',
                display: 'flex',
                alignItems: 'center',
                padding: '24px',
                background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1000&auto=format&fit=crop&q=80") no-repeat center/cover',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
            }}>
                <div style={{ zIndex: 2, maxWidth: '65%' }}>
                    <span style={{
                        backgroundColor: 'var(--color-accent)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Cinematic
                    </span>
                    <h3 style={{ margin: '8px 0', fontSize: '1.4rem', fontWeight: '800', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                        Unlock Your Saiyan Aura
                    </h3>
                    <p style={{ color: '#E2E8F0', fontSize: '0.85rem', textShadow: '0 1px 2px rgba(0,0,0,0.8)', margin: 0 }}>
                        Watch our guided workout guide to unleash your maximum potential power.
                    </p>
                </div>
                <button
                    onClick={() => setShowPromo(true)}
                    style={{
                        position: 'absolute',
                        right: '24px',
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                        border: 'none',
                        color: 'white',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px var(--color-primary-light)',
                        transition: 'transform 0.2s',
                        zIndex: 3
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Play size={24} fill="white" style={{ marginLeft: '4px' }} />
                </button>
            </div>

            {/* Search Input */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                marginBottom: 'var(--space-md)',
                gap: '12px'
            }}>
                <Search size={20} color="var(--text-muted)" />
                <input
                    type="text"
                    placeholder="Search programs or trainers..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        width: '100%',
                        outline: 'none',
                        fontSize: '0.95rem'
                    }}
                />
            </div>

            {/* Category selection - Horizontally scrollable row */}
            <div style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '12px',
                marginBottom: 'var(--space-lg)',
                scrollbarWidth: 'none', // For Firefox
                msOverflowStyle: 'none' // For IE/Edge
            }}>
                {categories.map(category => {
                    const isSelected = activeCategory === category;
                    return (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--bg-card)',
                                color: isSelected ? 'white' : 'var(--text-muted)',
                                fontWeight: 'bold',
                                fontSize: '0.85rem',
                                whiteSpace: 'nowrap',
                                border: isSelected ? 'none' : '1px solid var(--border-color)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {category}
                        </button>
                    );
                })}
            </div>

            {/* Program Catalog Grid */}
            {filteredPrograms.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    No routines found matching your selection. Try adjusting your search query!
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 'var(--space-lg)'
                }}>
                    {filteredPrograms.map(program => (
                        <div
                            key={program.id}
                            onClick={() => setSelectedProgram(program)}
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-card)',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.borderColor = 'var(--color-primary-light)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                                <img
                                    src={program.image}
                                    alt={program.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <span style={{
                                    position: 'absolute',
                                    top: '12px',
                                    left: '12px',
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    color: 'var(--color-secondary-light)',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--color-secondary)'
                                }}>
                                    {program.tag}
                                </span>
                            </div>
                            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>
                                    {program.title}
                                </h4>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
                                    by {program.author}
                                </span>
                                <div style={{
                                    marginTop: 'auto',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)',
                                    borderTop: '1px solid var(--bg-input)',
                                    paddingTop: '12px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-warning)' }}>
                                        <Star size={14} fill="currentColor" />
                                        <span style={{ fontWeight: 'bold' }}>{program.rating}</span>
                                    </div>
                                    <div>{program.downloads} Down</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Video Promo Overlay */}
            {showPromo && <PromoVideo onClose={() => setShowPromo(false)} />}

            {/* Details Modal */}
            <ProgramDetailsModal
                isOpen={!!selectedProgram}
                program={selectedProgram}
                onClose={() => setSelectedProgram(null)}
                onStart={handleStartProgram}
            />
        </div>
    );
};


export default ExplorePage;
