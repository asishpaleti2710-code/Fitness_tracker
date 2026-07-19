import React, { useState, useEffect } from 'react';
import './App.css';
import { LayoutDashboard, Dumbbell, Utensils, Footprints, LogOut, User as UserIcon, Sun, Moon, Settings, Flame, Plus, Compass } from 'lucide-react';
import Toast from './components/Toast';
import QuickActionsModal from './components/QuickActionsModal';

import Dashboard from './pages/Dashboard';
import GymTracker from './pages/GymTracker';
import FoodTracker from './pages/FoodTracker';
import StepTracker from './pages/StepTracker';
import StreakPage from './pages/StreakPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ExplorePage from './pages/ExplorePage';

import { AuthService } from './utils/authService';
import { Preferences } from '@capacitor/preferences';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Chatbot from './components/Chatbot';

const SESSION_KEY = 'fitness_user_profile';

function AppContent() {
  const { theme, toggleTheme } = useTheme();

  // --- State Initialization with Capacitor Preferences ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [splashVisible, setSplashVisible] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { value } = await Preferences.get({ key: SESSION_KEY });
        if (value) {
          setUser(JSON.parse(value));
        }
      } catch (e) {
        console.error("Failed to load session", e);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  // Remove the old useEffect that used localStorage
  /*
  useEffect(() => {
    if (user) {
      localStorage.setItem('fitness_user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('fitness_user_profile');
    }
  }, [user]);
  */

  const handleLogin = async (userData) => {
    setUser(userData);
    await Preferences.set({ key: SESSION_KEY, value: JSON.stringify(userData) });
  };

  const handleUpdateProfile = async (updatedData) => {
    setUser(updatedData);
    // Persist to "DB" is done in ProfilePage via AuthService
    // We update session here
    await Preferences.set({ key: SESSION_KEY, value: JSON.stringify(updatedData) });
  };

  const handleLogout = async () => {
    setUser(null);
    setActiveTab('dashboard');
    await Preferences.remove({ key: SESSION_KEY });
  };

  const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false });

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const closeToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const renderContent = () => {
    // We wrap the content in a key-ed div to trigger animation on tab change
    return (
      <div key={activeTab} className="page-transition">
        {(() => {
          switch (activeTab) {
            case 'dashboard': return <Dashboard user={user} />;
            case 'gym': return <GymTracker />;
            case 'food': return <FoodTracker />;
            case 'steps': return <StepTracker />;
            case 'streak': return <StreakPage />;
            case 'profile': return <ProfilePage user={user} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} showToast={showToast} />;
            case 'settings': return <SettingsPage showToast={showToast} />;
            case 'explore': return <ExplorePage onNavigate={setActiveTab} showToast={showToast} />;
            default: return <Dashboard user={user} />;
          }
        })()}
      </div>
    );
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)', color: 'white' }}>Loading...</div>;
  }

  // Define splash finish handler
  const handleSplashComplete = () => {
    // Only show login if no user, otherwise dashboard
    // But we want the splash to finish its exit animation
    setSplashVisible(false);
  };

  // NOTE: We need a state specifically for "splash is visible" 
  // We can initialize it to true.

  return (
    <>
      <AnimatePresence>
        {splashVisible && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      {!splashVisible && !user && (
        <LoginPage onLogin={handleLogin} />
      )}

      {!splashVisible && user && (
        <div className="app-container">
          {/* Toast Notification */}
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={closeToast}
          />

          {/* Quick Actions Modal */}
          <QuickActionsModal
            isOpen={showQuickActions}
            onClose={() => setShowQuickActions(false)}
            onNavigate={(tab) => {
              if (tab === 'weight') {
                // If weight, we might want to just show the tracker or scroll to it
                // For now, let's go to dashboard as it has weight tracker, 
                // but maybe we can trigger a weight add modal later.
                setActiveTab('dashboard');
              } else {
                setActiveTab(tab);
              }
            }}
          />

          {/* Hide bottom nav on profile page for cleaner look? Or keep it? Keeping it for easy switch back */}
          <nav className="bottom-nav">
            <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>
              <LayoutDashboard size={24} />
            </button>
            <button onClick={() => setActiveTab('gym')} className={activeTab === 'gym' ? 'active' : ''}>
              <Dumbbell size={24} />
            </button>

            {/* Quick Add Button */}
            <div style={{ position: 'relative', top: '-24px' }}>
              <button
                onClick={() => setShowQuickActions(true)}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px var(--color-primary-light)', // Updated shadow to match theme
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Plus size={32} />
              </button>
            </div>

            <button onClick={() => setActiveTab('food')} className={activeTab === 'food' ? 'active' : ''}>
              <Utensils size={24} />
            </button>
            <button onClick={() => setActiveTab('explore')} className={activeTab === 'explore' ? 'active' : ''}>
              <Compass size={24} />
            </button>
            <button onClick={() => setActiveTab('streak')} className={activeTab === 'streak' ? 'active' : ''}>
              <Flame size={24} />
            </button>
          </nav>
          <main className="main-content">
            <header style={{ marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                onClick={() => setActiveTab('profile')}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="saiyan-aura" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                ) : (
                  <div style={{ padding: '8px', backgroundColor: 'var(--bg-input)', borderRadius: '50%' }}><UserIcon size={24} /></div>
                )}
                <div>
                  <h1 style={{ margin: 0, fontSize: '1.2rem', lineHeight: 1 }}>Fitness Tracker</h1>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hi, {user.name}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setActiveTab('settings')}
                  style={{
                    color: activeTab === 'settings' ? 'var(--color-primary)' : 'var(--text-muted)',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Settings size={20} />
                </button>
                <button
                  onClick={toggleTheme}
                  style={{
                    color: 'var(--text-muted)',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <button onClick={handleLogout} style={{ color: 'var(--text-muted)' }}>
                  <LogOut size={20} />
                </button>
              </div>
            </header>
            {renderContent()}
          </main>

          {/* AI Chatbot Overlay - Always visible when logged in */}
          <Chatbot userName={user.name} />

        </div>
      )}
    </>
  );
}

// --- Global Error Handler (Debug Mode) ---
window.onerror = function (message, source, lineno) {
  if (message === "ResizeObserver loop completed with undelivered notifications.") return;
  alert(`Global Error: ${message}\nLine: ${lineno}\nSource: ${source}`);
};

window.onunhandledrejection = function (event) {
  alert(`Unhandled Promise Rejection: ${event.reason}`);
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    alert(`Component Error: ${error.toString()}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white' }}>
          <h2>Something went wrong.</h2>
          <pre style={{ color: 'red', whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
