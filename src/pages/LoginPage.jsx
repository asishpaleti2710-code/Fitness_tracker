import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { User, ArrowRight, Lock, Mail, AlertCircle, X, Check, Save } from 'lucide-react';
import { AuthService } from '../utils/authService';
import { Preferences } from '@capacitor/preferences';

const LoginPage = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false); // Default to Login
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    // Forgot Password State
    const [showForgot, setShowForgot] = useState(false);
    const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: Code, 3: New Pass
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotCode, setForgotCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [forgotError, setForgotError] = useState('');

    // Load "Remembered" user
    useEffect(() => {
        const loadRemembered = async () => {
            try {
                // Try LocalStorage directly for web compatibility
                const value = localStorage.getItem('remember_me_user');
                if (value) {
                    // Remove quotes if they exist (Capacitor sometimes adds them)
                    const cleanValue = value.replace(/^"|"$/g, '');
                    console.log("Loaded remember_me_user:", cleanValue);
                    setFormData(prev => ({ ...prev, name: cleanValue }));
                    setRememberMe(true);
                } else {
                    // Fallback to Preferences if needed
                    const { value: prefValue } = await Preferences.get({ key: 'remember_me_user' });
                    if (prefValue) {
                        setFormData(prev => ({ ...prev, name: prefValue }));
                        setRememberMe(true);
                    }
                }
            } catch (e) {
                console.error("Failed to load remembered user", e);
            }
        };
        loadRemembered();
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear specific error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
        if (submitError) setSubmitError('');
    };

    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setErrors({});
        setSubmitError('');
        setFormData({ name: '', email: '', password: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Client-side Validation
        const validation = AuthService.validate(formData, isRegistering);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        // 2. Authentication
        try {
            if (isRegistering) {
                const result = await AuthService.register(formData);
                if (result.success) {
                    onLogin(result.user);
                } else {
                    setSubmitError(result.message);
                }
            } else {
                // Login (allow email or name)
                const identifier = formData.email || formData.name;
                const result = await AuthService.login(identifier, formData.password);
                if (result.success) {
                    // Handle Remember Me
                    if (rememberMe) {
                        await Preferences.set({ key: 'remember_me_user', value: identifier });
                        // Also set localStorage for immediate web availability
                        localStorage.setItem('remember_me_user', identifier);
                    } else {
                        await Preferences.remove({ key: 'remember_me_user' });
                        localStorage.removeItem('remember_me_user');
                    }
                    onLogin(result.user);
                } else {
                    setSubmitError(result.message);
                }
            }
        } catch {
            setSubmitError('An unexpected error occurred. Please try again.');
        }
    };

    // Forgot Password Handlers
    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setForgotError('');

        if (forgotStep === 1) {
            // Verify Email
            if (!forgotEmail) {
                setForgotError("Please enter your email.");
                return;
            }
            const exists = await AuthService.checkEmailExists(forgotEmail);
            if (exists) {
                setForgotStep(2);
                // In a real app, send actual email here
            } else {
                setForgotError("No account found with this email.");
            }
        } else if (forgotStep === 2) {
            // Verify Code (Mock)
            if (forgotCode === '1234') {
                setForgotStep(3);
            } else {
                setForgotError("Invalid verification code. (Hint: use 1234)");
            }
        } else if (forgotStep === 3) {
            // Reset Password
            if (newPassword.length < 6) {
                setForgotError("Password must be at least 6 characters.");
                return;
            }
            const result = await AuthService.resetPassword(forgotEmail, newPassword);
            if (result.success) {
                alert("Password reset successfully! Please login.");
                setShowForgot(false);
                setForgotStep(1);
                setForgotEmail('');
                setForgotCode('');
                setNewPassword('');
            } else {
                setForgotError(result.message);
            }
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-md)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Image Layer */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url(/app_logo.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(10px) brightness(0.3)',
                zIndex: -1
            }} />

            <Card className="login-card">
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                    {/* Front Logo */}
                    <img
                        src="/app_logo.jpg"
                        alt="FitTrack Logo"
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '20px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            marginBottom: 'var(--space-md)'
                        }}
                    />
                    <h1 style={{ color: 'var(--color-primary)', fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>Fitness Tracker</h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isRegistering ? "Create your account" : "Welcome back"}
                    </p>
                </div>

                {submitError && (
                    <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--color-danger)',
                        color: 'var(--color-danger)',
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: 'var(--space-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem'
                    }}>
                        <AlertCircle size={16} /> {submitError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Name/Identifier Field */}
                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', color: 'var(--text-main)' }}>
                            {isRegistering ? "Name" : "Name or Email"}
                        </label>
                        <div style={{ ...styles.inputGroup, borderColor: errors.name ? 'var(--color-danger)' : 'transparent' }}>
                            <User size={20} color="var(--text-muted)" style={{ marginRight: 'var(--space-sm)' }} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder={isRegistering ? "Enter your name" : "Your name or email"}
                                style={styles.input}
                            />
                        </div>
                        {errors.name && <span style={styles.errorText}>{errors.name}</span>}
                    </div>

                    {/* Email Field - Only for Registration */}
                    {isRegistering && (
                        <div style={{ marginBottom: 'var(--space-lg)' }}>
                            <label style={{ display: 'block', marginBottom: 'var(--space-xs)', color: 'var(--text-main)' }}>Email</label>
                            <div style={{ ...styles.inputGroup, borderColor: errors.email ? 'var(--color-danger)' : 'transparent' }}>
                                <Mail size={20} color="var(--text-muted)" style={{ marginRight: 'var(--space-sm)' }} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    placeholder="Enter your email"
                                    style={styles.input}
                                />
                            </div>
                            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                        </div>
                    )}

                    <div style={{ marginBottom: 'var(--space-md)' }}>
                        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', color: 'var(--text-main)' }}>Password</label>
                        <div style={{ ...styles.inputGroup, borderColor: errors.password ? 'var(--color-danger)' : 'transparent' }}>
                            <Lock size={20} color="var(--text-muted)" style={{ marginRight: 'var(--space-sm)' }} />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                placeholder="Enter your password"
                                style={styles.input}
                            />
                        </div>
                        {errors.password && <span style={styles.errorText}>{errors.password}</span>}
                    </div>

                    {!isRegistering && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    style={{ accentColor: 'var(--color-primary)' }}
                                />
                                Remember Me
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowForgot(true)}
                                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: 'var(--space-md)',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--space-sm)',
                            cursor: 'pointer',
                            marginTop: isRegistering ? 'var(--space-xl)' : '0'
                        }}
                    >
                        {isRegistering ? 'Sign Up' : 'Login'} <ArrowRight size={20} />
                    </button>

                    <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
                        <span
                            style={{
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                            onClick={toggleMode}
                        >
                            {isRegistering ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                        </span>
                    </div>
                </form>
            </Card>

            {/* Forgot Password Modal */}
            {showForgot && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>Reset Password</h3>
                            <button onClick={() => setShowForgot(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {forgotError && (
                            <div style={{ color: 'var(--color-danger)', fontSize: '0.9rem', marginBottom: '15px' }}>
                                {forgotError}
                            </div>
                        )}

                        <form onSubmit={handleForgotSubmit}>
                            {forgotStep === 1 && (
                                <>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>Enter your email address to receive a verification code.</p>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        style={styles.modalInput}
                                        autoFocus
                                    />
                                    <button type="submit" style={styles.modalBtn}>
                                        Send Code <ArrowRight size={18} />
                                    </button>
                                </>
                            )}

                            {forgotStep === 2 && (
                                <>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>The code is <strong>1234</strong> (for testing).</p>
                                    <input
                                        type="text"
                                        placeholder="Enter Code"
                                        value={forgotCode}
                                        onChange={(e) => setForgotCode(e.target.value)}
                                        style={styles.modalInput}
                                        autoFocus
                                    />
                                    <button type="submit" style={styles.modalBtn}>
                                        Verify Code <Check size={18} />
                                    </button>
                                </>
                            )}

                            {forgotStep === 3 && (
                                <>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>Enter your new password.</p>
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        style={styles.modalInput}
                                        autoFocus
                                    />
                                    <button type="submit" style={styles.modalBtn}>
                                        Reset Password <Save size={18} />
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--bg-input)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-sm) var(--space-md)',
        border: '1px solid transparent',
        transition: 'border-color 0.2s'
    },
    input: {
        background: 'transparent',
        border: 'none',
        color: 'white',
        fontSize: '1rem',
        outline: 'none',
        width: '100%'
    },
    errorText: {
        color: 'var(--color-danger)',
        fontSize: '0.8rem',
        marginTop: '4px',
        display: 'block'
    },
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    },
    modal: {
        backgroundColor: 'var(--bg-card)',
        padding: '25px',
        borderRadius: 'var(--radius-md)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid var(--bg-input)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    },
    modalInput: {
        width: '100%',
        padding: '12px',
        backgroundColor: 'var(--bg-input)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 'var(--radius-sm)',
        color: 'white',
        fontSize: '1rem',
        marginBottom: '20px',
        outline: 'none'
    },
    modalBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        borderRadius: 'var(--radius-md)',
        fontWeight: 'bold',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer'
    }
};

export default LoginPage;
