import React, { useState } from 'react';
import Card from '../components/Card';
import { Plus, Coffee, Sun, Moon, Utensils, X, History, ClipboardList, ScanBarcode, Search, Loader2, ChevronRight, Apple, Carrot, Beef, Nut, Trash2, Zap } from 'lucide-react';
import { COMMON_FOODS } from '../utils/commonFoods';
import ScouterModal from '../components/ScouterModal';

// --- Sub-components ---

const MacroSummary = ({ protein, carbs, fat }) => {
    const total = protein + carbs + fat;
    if (total === 0) return null;

    const pPp = total > 0 ? (protein / total) * 100 : 0;
    const pCp = total > 0 ? (carbs / total) * 100 : 0;
    const pFp = total > 0 ? (fat / total) * 100 : 0;

    return (
        <div style={{ display: 'flex', gap: '10px', marginTop: 'var(--space-sm)', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Protein</div>
                <div style={{ fontWeight: 'bold', color: '#4ade80' }}>{Math.round(protein)}g</div>
                <div style={{ height: '4px', width: '40px', backgroundColor: 'var(--bg-input)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pPp}%`, backgroundColor: '#4ade80' }} />
                </div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Carbs</div>
                <div style={{ fontWeight: 'bold', color: '#60a5fa' }}>{Math.round(carbs)}g</div>
                <div style={{ height: '4px', width: '40px', backgroundColor: 'var(--bg-input)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pCp}%`, backgroundColor: '#60a5fa' }} />
                </div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fat</div>
                <div style={{ fontWeight: 'bold', color: '#facc15' }}>{Math.round(fat)}g</div>
                <div style={{ height: '4px', width: '40px', backgroundColor: 'var(--bg-input)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pFp}%`, backgroundColor: '#facc15' }} />
                </div>
            </div>
        </div>
    );
};

const MealSection = ({ title, icon: Icon, items, onAdd, onDelete }) => (
    <Card className="meal-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon size={20} color="var(--color-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>
            </div>
            <button
                onClick={onAdd}
                style={{
                    padding: '4px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-card-hover)',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Plus size={18} />
            </button>
        </div>
        <div>
            {items.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No food logged</div>
            ) : (
                items.map((item, idx) => (
                    <div key={item.id || idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--bg-input)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>{item.name}</span>
                            <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {item.amount && item.unit && <span>{item.amount} {item.unit}</span>}
                                {item.protein > 0 && <span style={{ color: '#4ade80' }}>P: {item.protein}g</span>}
                                {item.carbs > 0 && <span style={{ color: '#60a5fa' }}>C: {item.carbs}g</span>}
                                {item.fat > 0 && <span style={{ color: '#facc15' }}>F: {item.fat}g</span>}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>{item.cals} kcal</span>
                            <button
                                onClick={() => onDelete(item.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-danger)',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    opacity: 0.7
                                }}
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    </Card>
);

const Chip = ({ label, icon: Icon, onClick, active }) => (
    <button
        onClick={onClick}
        style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            backgroundColor: active ? 'var(--color-primary)' : 'var(--bg-input)',
            color: active ? 'white' : 'var(--text-main)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s'
        }}
    >
        {Icon && <Icon size={16} />}
        {label}
    </button>
);

const SearchResults = ({ results, onSelect }) => {
    if (!results || results.length === 0) return null;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        }}>
            {results.map((product, idx) => {
                const isLocal = product.isLocal;
                const cals = product.nutriments?.['energy-kcal_serving'] || product.nutriments?.['energy-kcal_100g'] || product.nutriments?.['energy-kcal'] || 0;
                // Try to get ingredients text
                const ingredients = product.ingredients_text || product.ingredients_text_en || product.ingredients_text_with_allergens || (isLocal ? 'General Food Item' : 'Ingredients not listed');

                return (
                    <Card
                        key={idx}
                        className="search-result-card"
                        style={{
                            cursor: 'pointer',
                            transition: 'transform 0.1s',
                            borderLeft: isLocal ? '3px solid var(--color-primary)' : 'none', // Highlight local
                            backgroundColor: isLocal ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-card)'
                        }}
                        onClick={() => onSelect(product)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: isLocal ? 'var(--color-primary)' : 'var(--color-highlight)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {isLocal && <Zap size={14} fill="currentColor" />}
                                    {product.product_name || 'Unknown Item'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                    {product.brands ? `${product.brands} • ` : ''} {Math.round(cals)} kcal
                                </div>
                                {/* Ingredients Preview (Truncated) */}
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {ingredients}
                                </div>
                            </div>
                            <div style={{
                                backgroundColor: 'var(--bg-input)',
                                padding: '8px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Plus size={20} color="var(--color-primary)" />
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

// --- Main Page Component ---

const FoodTracker = () => {
    const [activeTab, setActiveTab] = useState('log'); // 'log' | 'search' | 'history'
    const [isScouterOpen, setIsScouterOpen] = useState(false);

    // Data State
    const [allMeals, setAllMeals] = useState(() => {
        const saved = localStorage.getItem('food_meals');
        if (!saved) return [];
        try {
            const parsed = JSON.parse(saved);
            // Quick migration check
            if (parsed.breakfast) return Object.values(parsed).flat().map(m => ({ ...m, id: Date.now() + Math.random() }));
            return Array.isArray(parsed) ? parsed : [];
        } catch { return []; }
    });

    React.useEffect(() => {
        localStorage.setItem('food_meals', JSON.stringify(allMeals));
    }, [allMeals]);

    React.useEffect(() => {
        const handleSyncMeals = () => {
            const saved = localStorage.getItem('food_meals');
            if (saved) {
                try {
                    setAllMeals(JSON.parse(saved));
                } catch {
                    // Ignore parsing errors
                }
            }
        };
        window.addEventListener('food-logged', handleSyncMeals);
        return () => window.removeEventListener('food-logged', handleSyncMeals);
    }, []);

    // Modal State (for Adding Details)
    const [modal, setModal] = useState({ isOpen: false, product: null });
    const [form, setForm] = useState({
        name: '', cals: '', amount: '', unit: 'g',
        protein: '', carbs: '', fat: '', type: 'breakfast', ingredients: ''
    });

    // Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Helpers
    const parseNutrient = (val) => { const num = parseFloat(val); return isNaN(num) ? 0 : Math.round(num); };

    // --- Actions ---

    // Optimized search with popularity sort + Local Suggestions
    // Debounced Search Effect
    React.useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm && searchTerm.length >= 2) {
                // 1. Local Search (Instant)
                const termLower = searchTerm.toLowerCase();
                const localMatches = COMMON_FOODS.filter(food =>
                    food.name.toLowerCase().includes(termLower)
                );
                // Mark as local for UI distinction
                const formattedLocal = localMatches.map(item => ({
                    ...item,
                    product_name: item.name,
                    isLocal: true, // Flag to identify local items
                    nutriments: {
                        'energy-kcal': item.cals,
                        'proteins': item.protein,
                        'carbohydrates': item.carbs,
                        'fat': item.fat
                    },
                    serving_quantity: item.amount,
                    serving_quantity_unit: item.unit
                }));

                // Set local results immediately
                // We will merge network results later or keep them separate?
                // For now, let's set them as initial results to show instantly.
                setSearchResults(formattedLocal);

                // 2. Network Search (Async)
                searchFood(searchTerm, formattedLocal);
            } else if (searchTerm.length === 0) {
                setSearchResults([]);
            }
        }, 300); // Reduce delay for faster typing feedback

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const searchFood = async (term, existingLocalResults = []) => {
        setIsSearching(true);
        // Ensure search tab is active if triggered from elsewhere
        // if (activeTab !== 'search') setActiveTab('search'); // This can cause loops if not careful

        try {
            const response = await fetch(`https://us.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(term)}&search_simple=1&action=process&json=1&page_size=20&sort_by=unique_scans_n&tagtype_0=languages&tag_contains_0=contains&tag_0=en`);
            const data = await response.json();

            if (data.products) {
                // Merge: Local first, then Network
                // Filter out network results that might duplicate local names perfectly? (Optional)
                setSearchResults([...existingLocalResults, ...data.products]);
            } else {
                setSearchResults(existingLocalResults);
            }
        } catch (error) {
            console.error(error);
            // On error, keep local results
            setSearchResults(existingLocalResults);
        } finally {
            setIsSearching(false);
        }
    };

    const handleQuickSearch = (category) => {
        setSearchTerm(category);
        // Effect will trigger search
    };

    const handleSelectProduct = (product) => {
        const cals = product.nutriments?.['energy-kcal_serving'] || product.nutriments?.['energy-kcal_100g'] || product.nutriments?.['energy-kcal'] || 0;
        const p = product.nutriments?.['proteins_serving'] || product.nutriments?.['proteins_100g'] || product.nutriments?.['proteins'] || 0;
        const c = product.nutriments?.['carbohydrates_serving'] || product.nutriments?.['carbohydrates_100g'] || product.nutriments?.['carbohydrates'] || 0;
        const f = product.nutriments?.['fat_serving'] || product.nutriments?.['fat_100g'] || product.nutriments?.['fat'] || 0;
        const ingredients = product.ingredients_text || product.ingredients_text_en || product.ingredients_text_with_allergens || 'Not listed';

        // Auto-fill Algo
        let amount = '', unit = 'g';
        if (product.serving_quantity) amount = product.serving_quantity.toString();
        if (product.serving_quantity_unit) unit = product.serving_quantity_unit;
        else if (product.serving_size) {
            const match = product.serving_size.match(/^([\d.]+)\s*([a-zA-Z]+)$/);
            if (match) { amount = match[1]; unit = match[2]; }
        }
        const unitMap = { 'gram': 'g', 'grams': 'g', 'liter': 'l', 'liters': 'l' };
        if (unitMap[unit.toLowerCase()]) unit = unitMap[unit.toLowerCase()];

        setForm({
            name: product.product_name || searchTerm,
            cals: Math.round(cals).toString(),
            protein: Math.round(p).toString(),
            carbs: Math.round(c).toString(),
            fat: Math.round(f).toString(),
            amount: amount,
            unit: unit,
            type: 'breakfast', // Default, user can change
            ingredients: ingredients
        });
        setModal({ isOpen: true, product });
    };

    const handleScan = () => {
        setIsScouterOpen(true);
    };

    const handleSaveMeal = (e) => {
        e.preventDefault();
        const entry = {
            id: Date.now(),
            ...form,
            cals: parseInt(form.cals),
            protein: parseNutrient(form.protein),
            carbs: parseNutrient(form.carbs),
            fat: parseNutrient(form.fat),
            date: new Date().toISOString()
        };
        setAllMeals(prev => [entry, ...prev]);
        setModal({ isOpen: false, product: null });
        setActiveTab('log'); // Go back to log after adding
    };

    // New Delete Function
    const handleDeleteMeal = (id) => {
        if (window.confirm("Are you sure you want to remove this item?")) {
            setAllMeals(prev => prev.filter(m => m.id !== id));
        }
    };

    // Stats
    const todayStr = new Date().toDateString();
    const todayMeals = allMeals.filter(m => new Date(m.date).toDateString() === todayStr);
    const totalCals = todayMeals.reduce((a, b) => a + (b.cals || 0), 0);
    const totalP = todayMeals.reduce((a, b) => a + (b.protein || 0), 0);
    const totalC = todayMeals.reduce((a, b) => a + (b.carbs || 0), 0);
    const totalF = todayMeals.reduce((a, b) => a + (b.fat || 0), 0);
    const getMeals = (type) => todayMeals.filter(m => m.type === type);

    // History
    const historyGroups = allMeals.reduce((g, m) => {
        const d = new Date(m.date).toDateString();
        g[d] = (g[d] || 0) + m.cals;
        return g;
    }, {});


    return (
        <div className="food-page" style={{ paddingBottom: '80px' }}>

            {/* Top Navigation Chips */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: 'var(--space-md)' }}>
                {['log', 'search', 'history'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px',
                            textAlign: 'center',
                            backgroundColor: activeTab === tab ? 'var(--color-primary)' : 'var(--bg-card)',
                            color: activeTab === tab ? 'white' : 'var(--text-muted)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* --- DAILY LOG TAB --- */}
            {activeTab === 'log' && (
                <>
                    <Card style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-primary)', lineHeight: 1 }}>{totalCals}</div>
                        <div style={{ color: 'var(--text-muted)' }}>kcal consumed today</div>
                        <MacroSummary protein={totalP} carbs={totalC} fat={totalF} />
                    </Card>

                    <MealSection title="Breakfast" icon={Coffee} items={getMeals('breakfast')} onAdd={() => { setActiveTab('search'); }} onDelete={handleDeleteMeal} />
                    <MealSection title="Lunch" icon={Sun} items={getMeals('lunch')} onAdd={() => { setActiveTab('search'); }} onDelete={handleDeleteMeal} />
                    <MealSection title="Dinner" icon={Moon} items={getMeals('dinner')} onAdd={() => { setActiveTab('search'); }} onDelete={handleDeleteMeal} />
                    <MealSection title="Snacks" icon={Utensils} items={getMeals('snacks')} onAdd={() => { setActiveTab('search'); }} onDelete={handleDeleteMeal} />
                </>
            )}

            {/* --- FOOD SEARCH TAB --- */}
            {activeTab === 'search' && (
                <div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <input
                                autoFocus
                                style={styles.input}
                                placeholder="Search all foods..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && searchFood()}
                            />
                            <button
                                onClick={() => searchFood()}
                                style={{
                                    position: 'absolute', right: '5px', top: '5px', bottom: '5px',
                                    background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer'
                                }}
                            >
                                {isSearching ? <Loader2 className="spin" /> : <Search />}
                            </button>
                        </div>
                        <button onClick={handleScan} style={styles.iconBtn} title="Scan Barcode">
                            <ScanBarcode size={24} />
                        </button>
                    </div>

                    {/* Quick Filters */}
                    {searchResults.length === 0 && !isSearching && (
                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Quick Categories</h4>
                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                                <Chip label="Fruits" icon={Apple} onClick={() => handleQuickSearch('Fruits')} />
                                <Chip label="Vegetables" icon={Carrot} onClick={() => handleQuickSearch('Vegetables')} />
                                <Chip label="Protein" icon={Beef} onClick={() => handleQuickSearch('Protein Source')} />
                                <Chip label="Nuts" icon={Nut} onClick={() => handleQuickSearch('Nuts')} />
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    <SearchResults results={searchResults} onSelect={handleSelectProduct} />

                    {isSearching && <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Searching...</div>}
                </div>
            )}

            {/* --- HISTORY TAB --- */}
            {activeTab === 'history' && (
                <div className="history-list">
                    {Object.keys(historyGroups).map(date => (
                        <Card key={date} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{date === todayStr ? 'Today' : date}</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{historyGroups[date]} kcal</span>
                        </Card>
                    ))}
                    {Object.keys(historyGroups).length === 0 && <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No history yet.</div>}
                </div>
            )}


            {/* --- MEAL DETAILS MODAL (ADD) --- */}
            {modal.isOpen && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <h3 style={{ margin: 0 }}>Add Food</h3>
                            <button onClick={() => setModal({ isOpen: false, product: null })} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><X /></button>
                        </div>

                        <form onSubmit={handleSaveMeal}>
                            <h4 style={{ margin: '0 0 15px', color: 'var(--color-highlight)' }}>{form.name}</h4>

                            {/* Ingredients Dropdown/Text */}
                            {form.ingredients && form.ingredients !== 'Not listed' && (
                                <div style={{
                                    marginBottom: '15px',
                                    padding: '10px',
                                    backgroundColor: 'var(--bg-input)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)',
                                    maxHeight: '100px',
                                    overflowY: 'auto'
                                }}>
                                    <strong>Ingredients:</strong> {form.ingredients}
                                </div>
                            )}

                            <label style={styles.label}>Meal Type</label>
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '15px', flexWrap: 'wrap' }}>
                                {['breakfast', 'lunch', 'dinner', 'snacks'].map(t => (
                                    <Chip
                                        key={t}
                                        label={t}
                                        active={form.type === t}
                                        onClick={(e) => { e.preventDefault(); setForm({ ...form, type: t }); }}
                                    />
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Amount</label>
                                    <input type="number" style={styles.input} value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="100" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Unit</label>
                                    <input style={styles.input} value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="g" />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                                <div><label style={styles.label}>Calories</label><input type="number" style={styles.input} value={form.cals} onChange={e => setForm({ ...form, cals: e.target.value })} /></div>
                                <div><label style={styles.label}>Protein (g)</label><input type="number" style={styles.input} value={form.protein} onChange={e => setForm({ ...form, protein: e.target.value })} /></div>
                                <div><label style={styles.label}>Carbs (g)</label><input type="number" style={styles.input} value={form.carbs} onChange={e => setForm({ ...form, carbs: e.target.value })} /></div>
                                <div><label style={styles.label}>Fat (g)</label><input type="number" style={styles.input} value={form.fat} onChange={e => setForm({ ...form, fat: e.target.value })} /></div>
                            </div>

                            <button type="submit" style={styles.saveBtn}>Add to Log</button>
                        </form>
                    </div>
                </div>
            )}

            <ScouterModal isOpen={isScouterOpen} mode="barcode" onClose={() => setIsScouterOpen(false)} />

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
    modal: { backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 30px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    label: { display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold' },
    input: { width: '100%', padding: '12px', backgroundColor: 'var(--bg-input)', border: '1px solid rgba(var(--color-text), 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' },
    saveBtn: { width: '100%', padding: '14px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 'bold', border: 'none', marginTop: '10px', fontSize: '1rem', cursor: 'pointer' },
    iconBtn: { padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: 'none', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default FoodTracker;
