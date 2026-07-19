/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import Card from './Card';
import { Eye, X, ChevronRight, Search, Activity, BookOpen } from 'lucide-react';

// Import images
import benchPressImg from '../assets/bench_press.png';
import squatImg from '../assets/squat.png';
import latPulldownImg from '../assets/lat_pulldown.png';
import overheadPressImg from '../assets/overhead_press.png';
import bicepCurlImg from '../assets/bicep_curl.png';
import tricepPushdownImg from '../assets/tricep_pushdown.png';
import walkingLungesImg from '../assets/walking_lunges.png';
import deadliftImg from '../assets/deadlift.png';
import plankImg from '../assets/plank.png';
import seatedCableRowImg from '../assets/seated_cable_row.png';
import legPressImg from '../assets/leg_press.png';
import lateralRaisesImg from '../assets/lateral_raises.png';
import calfRaiseImg from '../assets/calf_raise.png';
import chestFlyImg from '../assets/chest_fly.png';
import skullcrushersImg from '../assets/skullcrushers.png';
import inclineBenchBase from '../assets/incline_bench_press.png';
import pullUpBase from '../assets/pull_up.png';
import rdlBase from '../assets/romanian_deadlift.png';
import frontSquatBase from '../assets/front_squat.png';
import facePullBase from '../assets/face_pull.png';
import hammerCurlBase from '../assets/hammer_curl.png';
import russianTwistBase from '../assets/russian_twist.png';
import pushUpImg from '../assets/push_up.png';
import bentOverRowImg from '../assets/bent_over_row.png';
import bulgarianSplitSquatImg from '../assets/bulgarian_split_squat.png';
import tricepDipsImg from '../assets/tricep_dips.png';
import hangingLegRaiseImg from '../assets/hanging_leg_raise.png';

export const EXERCISE_DATA = {
    "Chest": [
        {
            id: 'push_up',
            name: 'Push Ups',
            image: pushUpImg,
            target: 'Pectoralis Major, Core',
            secondary: 'Triceps, Anterior Deltoids',
            difficulty: 'Beginner',
            video: 'https://www.youtube.com/embed/IODxDxX7oi4',
            instructions: [
                "Start in a high plank position, hands shoulder-width apart.",
                "Keep your body in a straight line from head to heels.",
                "Lower your chest until it nearly touches the floor.",
                "Push yourself back up to the starting position.",
                "Keep your core tight and don't let your hips sag."
            ]
        },
        {
            id: 'bench_press',
            name: 'Barbell Bench Press',
            image: benchPressImg,
            target: 'Pectoralis Major (Chest)',
            secondary: 'Triceps, Anterior Deltoids',
            difficulty: 'Intermediate',
            video: 'https://www.youtube.com/embed/vcBig73ojpE',
            instructions: [
                "Lie on a flat bench with your eyes under the bar.",
                "Grip the bar slightly wider than shoulder-width.",
                "Unrack the bar and lower it to your mid-chest.",
                "Press the bar back up until your arms are fully extended.",
                "Keep your feet flat on the floor and back arched slightly."
            ]
        },
        {
            id: 'chest_fly',
            name: 'Dumbbell Chest Fly',
            image: chestFlyImg,
            target: 'Pectoralis Major (Outer Chest)',
            secondary: 'Anterior Deltoids',
            difficulty: 'Intermediate',
            video: 'https://www.youtube.com/embed/eozdVDA78K0',
            instructions: [
                "Lie on bench with dumbbells above your chest, palms facing each other.",
                "Lower the weights in a wide arc until you feel a stretch.",
                "Keep a slight bend in your elbows.",
                "Bring the weights back together at the top like hugging a tree.",
                "Squeeze your chest muscles at the peak."
            ]
        },
        {
            id: 'incline_bench',
            name: 'Incline Barbell Bench Press',
            image: inclineBenchBase,
            target: 'Upper Pectoralis Major',
            secondary: 'Anterior Deltoids, Triceps',
            difficulty: 'Intermediate',
            video: 'https://www.youtube.com/embed/kydayEMT-LQ',
            instructions: [
                "Set bench to 30-45 degree incline.",
                "Lie back and grip bar slightly wider than shoulder-width.",
                "Unrack and lower bar to upper chest (below collarbone).",
                "Press bar up to full extension.",
                "Keep elbows tucked at around 45 degrees."
            ]
        }
    ],
    "Back": [
        {
            id: 'bent_over_row',
            name: 'Bent Over Barbell Row',
            image: bentOverRowImg,
            target: 'Latissimus Dorsi, Rhomboids',
            secondary: 'Biceps, Posterior Deltoids',
            difficulty: 'Intermediate',
            video: 'https://www.youtube.com/embed/vT2GjY_Umpw',
            instructions: [
                "Stand feet shoulder-width, holding bar with overhand grip.",
                "Hinge at hips until torso is nearly parallel to floor.",
                "Keep back straight and knees slightly bent.",
                "Pull bar towards your lower chest/upper abs.",
                "Squeeze shoulder blades together at top, then lower slowly."
            ]
        },
        {
            id: 'lat_pulldown',
            name: 'Lat Pulldown',
            image: latPulldownImg,
            target: 'Latissimus Dorsi (Lats)',
            secondary: 'Biceps, Rear Deltoids',
            difficulty: 'Beginner',
            video: 'https://www.youtube.com/embed/CAwf7n6Luuc',
            instructions: [
                "Sit down and adjust the thigh pad to secure your legs.",
                "Grip the bar with a wide, overhand grip.",
                "Pull the bar down towards your upper chest while leaning back slightly.",
                "Squeeze your shoulder blades together at the bottom.",
                "Slowly return the bar to the starting position."
            ]
        },
        {
            id: 'deadlift',
            name: 'Barbell Deadlift',
            image: deadliftImg,
            target: 'Posterior Chain (Back, Glutes, Hamstrings)',
            secondary: 'Core, Forearms, Traps',
            difficulty: 'Advanced',
            video: 'https://www.youtube.com/embed/op9kVnSso6Q',
            instructions: [
                "Stand with feet hip-width apart, barbell over mid-foot.",
                "Hinge at hips to grip the bar (shoulder-width).",
                "Keep your back straight and chest up.",
                "Drive through your heels to stand up straight.",
                "Lower the bar by pushing your hips back first."
            ]
        },
        {
            id: 'seated_cable_row',
            name: 'Seated Cable Row',
            image: seatedCableRowImg,
            target: 'Rhomboids, Lats, Rear Deltoids',
            secondary: 'Biceps, Forearms',
            difficulty: 'Beginner',
            video: 'https://www.youtube.com/embed/GZbfZ033f74',
            instructions: [
                "Sit on the machine with feet secured, knees slightly bent.",
                "Grab the handle and sit back with straight spine.",
                "Pull the handle towards your lower abdomen.",
                "Squeeze your shoulder blades together.",
                "Extend arms forward with control, getting a full stretch."
            ]
        },
        {
            id: 'pull_up',
            name: 'Pull Up',
            image: pullUpBase,
            target: 'Latissimus Dorsi',
            secondary: 'Biceps, Rear Deltoids, Core',
            difficulty: 'Intermediate',
            video: 'https://www.youtube.com/embed/_J_J54S-3dI',
            instructions: [
                "Grab the bar with palms facing away (overhand grip).",
                "Hang with arms fully extended.",
                "Pull yourself up until chin is over the bar.",
                "Drive elbows down and back.",
                "Lower yourself down with control to full hang."
            ]
        }
    ],
    "Legs": [
        {
            id: 'bulgarian_split_squat',
            name: 'Bulgarian Split Squat',
            image: bulgarianSplitSquatImg,
            target: 'Quadriceps, Glutes',
            secondary: 'Hamstrings, Core',
            difficulty: 'Intermediate',
            video: 'https://www.youtube.com/embed/2C-uNgKwPLE',
            instructions: [
                "Stand a few feet in front of a bench.",
                "Place one foot back on the bench, laces down.",
                "Lower your hips until your back knee almost touches floor.",
                "Keep front knee aligned with ankle.",
                "Drive through front heel to return to start."
            ]
        },
        {
            id: 'squat',
            name: 'Barbell Squat',
            image: squatImg,
            target: 'Quadriceps, Glutes',
            secondary: 'Hamstrings, Lower Back, Core',
            difficulty: 'Intermediate',
            video: 'https://www.youtube.com/embed/1xMaFs0L3ao',
            instructions: [
                "Place the barbell across your upper back (traps).",
                "Stand with feet shoulder-width apart, toes slightly out.",
                "Lower your hips back and down as if sitting in a chair.",
                "Keep your chest up and back straight.",
                "Drive through your heels to return to the starting position."
            ]
        },
        {
            id: 'walking_lunges',
            name: 'Walking Lunges',
            image: walkingLungesImg,
            target: 'Quadriceps, Glutes, Hamstrings',
            secondary: 'Calves, Core',
            difficulty: 'Intermediate',
            video: 'https://www.youtube.com/embed/Pbmj6xPo-Hw',
            instructions: [
                "Stand tall with feet hip-width apart.",
                "Step forward with one leg and lower your hips.",
                "Both knees should bend at a 90-degree angle.",
                "Push off the front foot to bring your back foot forward into the next step.",
                "Keep your torso upright throughout the movement."
            ]
        },
        {
            id: 'leg_press',
            name: 'Leg Press',
            image: legPressImg,
            target: 'Quadriceps, Glutes',
            secondary: 'Hamstrings, Calves',
            difficulty: 'Beginner',
            video: 'https://www.youtube.com/embed/videoseries?list=PLo1PYZySKXcIqg8ZP5AQPhjC6IdZiTYAy',
            instructions: [
                "Sit on the machine with back flat against the pad.",
                "Place feet shoulder-width apart on the platform.",
                "Lower the weight until knees are at a 90-degree angle.",
                "Push the platform back up through your heels.",
                "Do not lock your knees at the top."
            ]
        },
        {
            id: 'calf_raise',
            name: 'Standing Calf Raise',
            image: calfRaiseImg,
            target: 'Gastrocnemius, Soleus (Calves)',
            secondary: 'Ankle Stabilizers',
            difficulty: 'Beginner',
            video: 'https://www.youtube.com/embed/97NbelB5yvQ',
            instructions: [
                "Stand on the edge of a step or machine platform.",
                "Lower your heels until you feel a stretch in your calves.",
                "Push up onto your toes as high as possible.",
                "Pause at the top and squeeze.",
                "Lower slowly back to the starting position."
            ]
        },
        {
            id: 'romanian_deadlift',
            name: 'Romanian Deadlift (RDL)',
            image: rdlBase,
            target: 'Hamstrings, Glutes',
            secondary: 'Lower Back, Core',
            difficulty: 'Intermediate',
            video: 'https://www.youtube.com/embed/uhghy9pFIPY',
            instructions: [
                "Stand with feet hip-width, holding bar in front of thighs.",
                "Hinge at hips, pushing butt back while keeping legs slightly bent but rigid.",
                "Lower bar along shins until you feel a deep stretch in hamstrings.",
                "Keep back flat and core tight throughout.",
                "Drive hips forward to return to standing."
            ]
        },
        {
            id: 'front_squat',
            name: 'Front Squat',
            image: frontSquatBase,
            target: 'Quadriceps, Upper Back',
            secondary: 'Glutes, Core',
            difficulty: 'Advanced',
            video: 'https://www.youtube.com/embed/npVgCT7NznU',
            instructions: [
                "Rest bar on front deltoids, elbows high.",
                "Stand with feet shoulder-width apart.",
                "Squat down keeping torso as upright as possible.",
                "Go as deep as mobility allows (thighs below parallel).",
                "Drive back up, keeping elbows high to prevent dumping forward."
            ]
        }
    ],
    "Shoulders": [
        {
            id: 'overhead_press',
            name: 'Overhead Press',
            image: overheadPressImg,
            target: 'Deltoids (Shoulders)',
            secondary: 'Triceps, Upper Chest',
            difficulty: 'Intermediate',
            video: 'https://www.youtube.com/embed/M2rwvNhTOu0',
            instructions: [
                "Stand with the bar on your front shoulders, hands just outside shoulders.",
                "Press the bar vertically over your head.",
                "Lock your elbows at the top and shrug your shoulders.",
                "Lower the bar back to your shoulders with control.",
                "Tighten your core and glutes to avoid arching your back."
            ]
        },
        {
            id: 'lateral_raises',
            name: 'Lateral Raises',
            image: lateralRaisesImg,
            target: 'Lateral Deltoids (Middle Shoulder)',
            secondary: 'Traps',
            difficulty: 'Beginner',
            video: 'https://www.youtube.com/embed/3VcKaXpzqRo',
            instructions: [
                "Stand with a dumbbell in each hand by your sides.",
                "Keep a slight bend in your elbows.",
                "Raise the weights out to the sides until shoulder height.",
                "Think about leading with your elbows.",
                "Lower the weights slowly and repeat."
            ]
        },
        {
            id: 'face_pull',
            name: 'Face Pull',
            image: facePullBase,
            target: 'Rear Deltoids, Rotator Cuff',
            secondary: 'Traps',
            difficulty: 'Beginner',
            video: 'https://www.youtube.com/embed/KC8mlDOYJ2I',
            instructions: [
                "Set cable pulley to face height.",
                "Grab rope with neutral grip (thumbs back).",
                "Pull rope towards your face, separating hands.",
                "External rotation: drive wrists back like a double bicep pose.",
                "Squeeze rear delts and slowly return."
            ]
        }
    ],
    "Arms": [
        {
            id: 'tricep_dips',
            name: 'Tricep Dips',
            image: tricepDipsImg,
            target: 'Triceps Brachii',
            secondary: 'Chest, Front Deltoids',
            difficulty: 'Intermediate',
            video: 'https://www.youtube.com/embed/2z8JmcrW-As',
            instructions: [
                "Grip parallel bars and lift yourself to arm's length.",
                "Lower your body by bending elbows until upper arms are parallel to floor.",
                "Keep elbows tucked close to your body.",
                "Push yourself back up to the starting position.",
                "Keep your torso upright to focus on triceps."
            ]
        },
        {
            id: 'bicep_curl',
            name: 'Dumbbell Bicep Curl',
            image: bicepCurlImg,
            target: 'Biceps Brachii',
            secondary: 'Forearms',
            difficulty: 'Beginner',
            video: 'https://www.youtube.com/embed/l6ApagwH0TY',
            instructions: [
                "Stand holding a dumbbell in each hand, palms facing forward.",
                "Keep your elbows close to your torso.",
                "Curl the weights up towards your shoulders.",
                "Squeeze your biceps at the top.",
                "Lower the weights slowly and repeat."
            ]
        },
        {
            id: 'tricep_pushdown',
            name: 'Tricep Pushdown',
            image: tricepPushdownImg,
            target: 'Triceps Brachii',
            secondary: 'Anconeus',
            difficulty: 'Beginner',
            video: 'https://www.youtube.com/embed/2-LAMCPzODU',
            instructions: [
                "Attach a straight bar or rope to a high pulley.",
                "Stand with feet shoulder-width apart, leaning slightly forward.",
                "Keep your elbows pinned to your sides.",
                "Push the attachment down until your arms are fully extended.",
                "Squeeze your triceps at the bottom and slowly return up."
            ]
        },
        {
            id: 'skullcrushers',
            name: 'Skullcrushers',
            image: skullcrushersImg,
            target: 'Triceps Brachii',
            secondary: 'Forearms',
            difficulty: 'Intermediate',
            video: 'https://www.youtube.com/embed/d_KZxkY_0cM',
            instructions: [
                "Lie on a bench holding an EZ bar or dumbbells.",
                "Extend arms straight up.",
                "Bend at the elbows to lower the weight to your forehead.",
                "Keep your upper arms stationary and elbows performing hinge motion.",
                "Extend arms back to start position."
            ]
        },
        {
            id: 'hammer_curl',
            name: 'Dumbbell Hammer Curl',
            image: hammerCurlBase,
            target: 'Brachialis, Brachioradialis',
            secondary: 'Biceps',
            difficulty: 'Beginner',
            video: 'https://www.youtube.com/embed/zC3nLlEvin4',
            instructions: [
                "Stand holding dumbbells with palms facing your body.",
                "Keep elbows pinned to sides.",
                "Curl weights up while maintaining neutral grip (thumbs up).",
                "Squeeze at the top.",
                "Lower slowly under control."
            ]
        }
    ],
    "Core": [
        {
            id: 'hanging_leg_raise',
            name: 'Hanging Leg Raise',
            image: hangingLegRaiseImg,
            target: 'Lower Abs, Hip Flexors',
            secondary: 'Grip Strength',
            difficulty: 'Intermediate',
            video: 'https://www.youtube.com/embed/Pr1ieGZ5atk',
            instructions: [
                "Hang from a pull-up bar with overhand grip.",
                "Engage core and lift legs until parallel to floor.",
                "Avoid swinging or using momentum.",
                "Lower legs slowly with control.",
                "For harder version, lift toes to touch the bar."
            ]
        },
        {
            id: 'plank',
            name: 'Plank',
            image: plankImg,
            target: 'Abs, Obliques (Core)',
            secondary: 'Shoulders, Glutes',
            difficulty: 'Beginner',
            video: 'https://www.youtube.com/embed/ASdvN_XEl_c',
            instructions: [
                "Place forearms on the floor, elbows under shoulders.",
                "Extend legs back, balancing on toes.",
                "Keep your body in a straight line from head to heels.",
                "Tighten your core and glutes to avoid sagging.",
                "Hold for the desired time (e.g., 30-60 seconds)."
            ]
        },
        {
            id: 'russian_twist',
            name: 'Russian Twist',
            image: russianTwistBase,
            target: 'Obliques, Core',
            secondary: 'Hip Flexors',
            difficulty: 'Intermediate',
            video: 'https://www.youtube.com/embed/nhFynCkYtD4',
            instructions: [
                "Sit on floor, lean back 45 degrees, lift feet off ground.",
                "Clasp hands or hold a weight in front of chest.",
                "Twist torso to the right, touching floor/weight to side.",
                "Twist to the left side.",
                "Keep core tight and movement controlled, not flailing."
            ]
        }
    ]
};

// Helper to get difficulty color
const getDifficultyColor = (diff) => {
    switch (diff) {
        case 'Beginner': return 'var(--color-success, #4ade80)';
        case 'Intermediate': return 'var(--color-warning, #facc15)';
        case 'Advanced': return 'var(--color-destructive, #f87171)';
        default: return 'white';
    }
};

const GymExercises = ({ onAddToWorkout }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('gym_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    const toggleFavorite = (e, exerciseId) => {
        e.stopPropagation();
        setFavorites(prev => {
            const newFavs = prev.includes(exerciseId)
                ? prev.filter(id => id !== exerciseId)
                : [...prev, exerciseId];
            localStorage.setItem('gym_favorites', JSON.stringify(newFavs));
            return newFavs;
        });
    };

    const categories = ['All', 'Favorites', ...Object.keys(EXERCISE_DATA).filter(k => EXERCISE_DATA[k].length > 0)];

    const getFilteredExercises = () => {
        let allExercises = [];
        // Flatten logic
        Object.values(EXERCISE_DATA).forEach(list => allExercises.push(...list));

        // Filter by Category
        if (selectedCategory === 'Favorites') {
            allExercises = allExercises.filter(ex => favorites.includes(ex.id));
        } else if (selectedCategory !== 'All') {
            allExercises = EXERCISE_DATA[selectedCategory] || [];
        }

        // Filter by Search
        if (searchTerm) {
            allExercises = allExercises.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return allExercises;
    };

    return (
        <div className="gym-exercises">
            {/* Search & Filter */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-input)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '12px'
                }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            marginLeft: '8px',
                            flex: 1,
                            outline: 'none'
                        }}
                        placeholder="Search exercises..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '4px' }} className="no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : 'var(--bg-card)',
                                color: selectedCategory === cat ? 'white' : 'var(--text-muted)',
                                border: '1px solid var(--bg-input)',
                                whiteSpace: 'nowrap',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            {cat === 'Favorites' && (
                                <span style={{ color: selectedCategory === 'Favorites' ? 'white' : '#f43f5e' }}>♥</span>
                            )}
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '80px' }}>
                {getFilteredExercises().map(ex => {
                    const isFav = favorites.includes(ex.id);
                    return (
                        <Card key={ex.id} onClick={() => setSelectedExercise(ex)} style={{ cursor: 'pointer', transition: 'transform 0.1s', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {/* Thumbnail */}
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: '1px solid var(--bg-input)',
                                        flexShrink: 0
                                    }}>
                                        <img src={ex.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '500', paddingRight: '20px' }}>{ex.name}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                color: getDifficultyColor(ex.difficulty),
                                                border: `1px solid ${getDifficultyColor(ex.difficulty)}`
                                            }}>
                                                {ex.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        onClick={(e) => toggleFavorite(e, ex.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '1.2rem',
                                            color: isFav ? '#f43f5e' : 'var(--text-muted)',
                                            padding: '4px'
                                        }}
                                    >
                                        {isFav ? '♥' : '♡'}
                                    </button>
                                    <ChevronRight size={18} color="var(--text-muted)" />
                                </div>
                            </div>
                        </Card>
                    );
                })}
                {getFilteredExercises().length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px', opacity: 0.5 }}>🏋️‍♂️</div>
                        <p>No exercises found.</p>
                        {selectedCategory === 'Favorites' && <p style={{ fontSize: '0.85rem' }}>Tap the heart icon explicitly to save favorites.</p>}
                    </div>
                )}
            </div>

            {/* Exercise Details Modal */}
            {selectedExercise && (
                <div style={styles.overlay} onClick={() => setSelectedExercise(null)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.header}>
                            <h3 style={{ margin: 0, paddingRight: '20px', flex: 1 }}>{selectedExercise.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {onAddToWorkout && (
                                    <button
                                        onClick={() => onAddToWorkout(selectedExercise.name)}
                                        style={{
                                            backgroundColor: 'var(--color-primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '20px',
                                            padding: '6px 12px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            marginRight: '10px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        + Add to Log
                                    </button>
                                )}
                                <button
                                    onClick={(e) => toggleFavorite(e, selectedExercise.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1.5rem',
                                        color: favorites.includes(selectedExercise.id) ? '#f43f5e' : 'var(--text-muted)',
                                        marginRight: '15px'
                                    }}
                                >
                                    {favorites.includes(selectedExercise.id) ? '♥' : '♡'}
                                </button>
                                <button onClick={() => setSelectedExercise(null)} style={styles.closeBtn}>
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        {/* Scrollable Content */}
                        <div style={{ overflowY: 'auto', maxHeight: '80vh' }}>
                            <div style={styles.imageWrapper}>
                                <img src={selectedExercise.image} alt={selectedExercise.name} style={{ width: '100%', display: 'block' }} />
                                {/* Overlay badge on image */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    right: '10px',
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    color: getDifficultyColor(selectedExercise.difficulty),
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    border: `1px solid ${getDifficultyColor(selectedExercise.difficulty)}`
                                }}>
                                    {selectedExercise.difficulty}
                                </div>
                            </div>

                            <div style={{ padding: '20px' }}>
                                {/* Video Tutorial */}
                                {selectedExercise.video && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-primary)' }}>
                                            <BookOpen size={18} />
                                            <strong style={{ textTransform: 'uppercase', fontSize: '0.9rem' }}>Video Tutorial</strong>
                                        </div>
                                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', border: '1px solid #333' }}>
                                            <iframe
                                                src={`${selectedExercise.video.replace('youtube.com', 'youtube-nocookie.com')}?modestbranding=1&rel=0&origin=http://localhost:5173`}
                                                title={selectedExercise.name}
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                        <div style={{ marginTop: '8px', textAlign: 'center' }}>
                                            <a
                                                href={selectedExercise.video.replace('embed/', 'watch?v=')}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: 'var(--text-muted)',
                                                    fontSize: '0.8rem',
                                                    textDecoration: 'underline',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                Video not loading? Watch on YouTube <Eye size={14} />
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Muscles */}
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-primary)' }}>
                                        <Activity size={18} />
                                        <strong style={{ textTransform: 'uppercase', fontSize: '0.9rem' }}>Target Muscles</strong>
                                    </div>
                                    <p style={{ margin: 0, color: 'white', marginBottom: '8px' }}>{selectedExercise.target}</p>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <strong>Secondary: </strong> {selectedExercise.secondary}
                                    </div>
                                </div>

                                {/* Instructions */}
                                {selectedExercise.instructions && (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--color-primary)' }}>
                                            <BookOpen size={18} />
                                            <strong style={{ textTransform: 'uppercase', fontSize: '0.9rem' }}>How To Perform</strong>
                                        </div>
                                        <ol style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-main)', lineHeight: '1.6' }}>
                                            {selectedExercise.instructions.map((step, idx) => (
                                                <li key={idx} style={{ marginBottom: '8px' }}>{step}</li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(5px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    },
    modal: {
        backgroundColor: '#111',
        width: '100%',
        maxWidth: '450px',
        maxHeight: '90vh',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        border: '1px solid #333',
        display: 'flex',
        flexDirection: 'column'
    },
    header: {
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #333',
        background: '#1a1a1a',
        zIndex: 10
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        padding: '4px'
    },
    imageWrapper: {
        width: '100%',
        backgroundColor: '#000',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #222',
        position: 'relative'
    }
};

export default GymExercises;
