import React, { useState } from 'react';
import Card from '../components/Card';
import { Save, User, Mail, Calendar, Ruler, Weight, Lock, Trash2, Camera as CameraIcon } from 'lucide-react';
import { BADGES, BadgeService } from '../utils/badgeService';
import { AuthService } from '../utils/authService';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const ProfilePage = ({ user, onUpdateProfile, onLogout, showToast }) => {
    const [formData, setFormData] = useState(user);
    const [unlocked] = useState(() => BadgeService.getUnlockedBadges());

    // Password Change State
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = async () => {
        // Sync with "Backend"
        const result = await AuthService.updateUser(formData);
        if (result.success) {
            onUpdateProfile(result.user);
            if (showToast) {
                showToast('Profile updated successfully!', 'success');
            } else {
                alert('Profile saved!');
            }
        } else {
            alert(result.message || 'Failed to update profile.');
        }
    };

    const handleAvatarChange = async () => {
        try {
            const image = await Camera.getPhoto({
                quality: 60,
                allowEditing: false,
                resultType: CameraResultType.Base64,
                source: CameraSource.Prompt // Ask: Camera or Photos
            });

            if (image.base64String) {
                const newAvatar = `data:image/${image.format};base64,${image.base64String}`;
                handleChange('avatar', newAvatar);
            }
        } catch (error) {
            // Alert user to see WHY it failed (Permissions? Cancelled?)
            alert("Camera Error: " + error.message);
            console.error("Camera error:", error);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match.");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        const result = await AuthService.changePassword(user.email, passwordData.oldPassword, passwordData.newPassword);
        if (result.success) {
            if (showToast) showToast('Password changed successfully!', 'success');
            else alert('Password changed successfully!');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordSection(false);
        } else {
            alert(result.message);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.")) {
            // Double confirm
            if (window.confirm("Really delete? This is the last warning.")) {
                const result = await AuthService.deleteAccount(user.email);
                if (result.success) {
                    onLogout(); // Log user out
                } else {
                    alert(result.message);
                }
            }
        }
    };

    return (
        <div className="profile-page" style={{ paddingBottom: '80px' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)', position: 'relative' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                        src={formData.avatar}
                        alt="Avatar"
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            border: '3px solid var(--color-primary)',
                            marginBottom: 'var(--space-sm)',
                            objectFit: 'cover',
                            backgroundColor: 'white',
                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' // Blue glow
                        }}
                    />
                    <button
                        onClick={handleAvatarChange}
                        style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '0',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--color-primary)',
                            borderRadius: '50%',
                            padding: '6px',
                            cursor: 'pointer',
                            color: 'var(--color-primary)'
                        }}
                        title="Change Avatar"
                    >
                        <CameraIcon size={14} />
                    </button>
                    <div style={{
                        position: 'absolute',
                        bottom: '-15px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        padding: '2px 10px',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                        border: '1px solid var(--color-primary-light)'
                    }}>
                        PRO MEMBER
                    </div>
                </div>
                <h2 style={{ margin: 0 }}>{formData.name}</h2>
                <p style={{ color: 'var(--text-muted)' }}>{formData.email || 'No email set'}</p>
            </div>

            {/* Achievements Section */}
            <Card title="Achievements" className="mb-4">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '10px' }}>
                    {BADGES.map(badge => {
                        const isUnlocked = unlocked.includes(badge.id);
                        const Icon = badge.icon;
                        return (
                            <div key={badge.id} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                opacity: isUnlocked ? 1 : 0.3,
                                filter: isUnlocked ? 'none' : 'grayscale(100%)',
                                transition: 'all 0.3s'
                            }}>
                                <div style={{
                                    padding: '12px',
                                    borderRadius: '50%',
                                    backgroundColor: isUnlocked ? `rgba(255,255,255,0.1)` : 'var(--bg-input)',
                                    marginBottom: '6px',
                                    boxShadow: isUnlocked ? `0 0 10px ${badge.color}` : 'none',
                                    border: `2px solid ${isUnlocked ? badge.color : 'transparent'}`
                                }}>
                                    <Icon size={24} color={isUnlocked ? badge.color : 'var(--text-muted)'} />
                                </div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{badge.title}</div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Card title="Personal Details">
                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}><Mail size={16} /> Email</label>
                        <input
                            style={styles.input}
                            value={formData.email}
                            disabled // Email usually shouldn't be changed easily for ID reasons in this simple app
                            title="Email cannot be changed"
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}><Calendar size={16} /> Age</label>
                        <input
                            style={styles.input}
                            type="number"
                            value={formData.age}
                            onChange={(e) => handleChange('age', e.target.value)}
                            placeholder="25"
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}><Ruler size={16} /> Height (cm)</label>
                        <input
                            style={styles.input}
                            type="number"
                            value={formData.height}
                            onChange={(e) => handleChange('height', e.target.value)}
                            placeholder="175"
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}><Weight size={16} /> Weight (kg)</label>
                        <input
                            style={styles.input}
                            type="number"
                            value={formData.weight}
                            onChange={(e) => handleChange('weight', e.target.value)}
                            placeholder="70"
                        />
                    </div>
                </div>

                <div style={{ marginTop: 'var(--space-md)' }}>
                    <label style={styles.label}>Bio</label>
                    <textarea
                        style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                        value={formData.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        placeholder="Tell us about your fitness goals..."
                    />
                </div>

                <button
                    onClick={handleSave}
                    style={{
                        marginTop: 'var(--space-lg)',
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}
                >
                    <Save size={18} /> Save Changes
                </button>
            </Card>

            {/* Security Section */}
            <div style={{ marginTop: 'var(--space-lg)' }}>
                <Card title="Security">
                    <button
                        onClick={() => setShowPasswordSection(!showPasswordSection)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-main)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Lock size={16} /> Change Password
                        </span>
                        <span>{showPasswordSection ? '▲' : '▼'}</span>
                    </button>

                    {showPasswordSection && (
                        <form onSubmit={handleChangePassword} style={{ marginTop: 'var(--space-md)', padding: '10px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={styles.label}>Current Password</label>
                                <input
                                    type="password"
                                    style={styles.input}
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={styles.label}>New Password</label>
                                <input
                                    type="password"
                                    style={styles.input}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={styles.label}>Confirm New Password</label>
                                <input
                                    type="password"
                                    style={styles.input}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Update Password
                            </button>
                        </form>
                    )}
                </Card>
            </div>

            {/* Danger Zone */}
            <div style={{ marginTop: 'var(--space-lg)' }}>
                <Card title="Danger Zone" className="danger-zone">
                    <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                        onClick={handleDeleteAccount}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: 'transparent',
                            color: 'var(--color-danger)',
                            border: '1px solid var(--color-danger)',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        <Trash2 size={18} /> Delete Account
                    </button>
                </Card>
            </div>
        </div>
    );
};

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-md)'
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--text-muted)',
        marginBottom: '6px',
        fontSize: '0.9rem'
    },
    input: {
        padding: '10px',
        backgroundColor: 'var(--bg-input)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 'var(--radius-sm)',
        color: 'white',
        fontSize: '1rem',
        width: '100%',
        boxSizing: 'border-box' // Ensure padding doesn't overflow width
    }
};

export default ProfilePage;
