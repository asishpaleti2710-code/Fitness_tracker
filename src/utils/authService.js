/**
 * Authentication Service
 * Simulates a backend by storing users in Capacitor Preferences (Native Mobile Storage).
 */
import { Preferences } from '@capacitor/preferences';

const USERS_KEY = 'fitness_app_users';

// Helper to hash passwords using Web Crypto API with Fallback
const hashPassword = async (password) => {
    try {
        if (window.crypto && window.crypto.subtle) {
            const msgBuffer = new TextEncoder().encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } else {
            console.warn("Crypto API not available (Non-Secure Context). Using Base64 fallback.");
            return btoa(password); // Fallback: NOT SECURE, but allows dev/testing
        }
    } catch (e) {
        console.error("Hashing failed, using fallback:", e);
        return btoa(password);
    }
};

export const AuthService = {
    /**
     * Get all registered users (Internal helper)
     */
    getUsers: async () => {
        try {
            const { value } = await Preferences.get({ key: USERS_KEY });
            if (!value) return [];
            return JSON.parse(value);
        } catch (e) {
            console.error("Failed to parse users from storage:", e);
            return [];
        }
    },

    /**
     * Internal helper to save users
     */
    saveUsers: async (users) => {
        try {
            await Preferences.set({
                key: USERS_KEY,
                value: JSON.stringify(users)
            });
        } catch (e) {
            console.error("Failed to save users:", e);
            throw new Error("Storage failure");
        }
    },

    /**
     * Register a new user
     * @param {Object} userData - { name, email, password }
     * @returns {Promise<Object>} result - { success, user, message }
     */
    register: async (userData) => {
        try {
            const users = await AuthService.getUsers();

            // Check if user exists (by email or name)
            const exists = users.find(u =>
                (u.email && u.email.toLowerCase() === userData.email.toLowerCase()) ||
                (u.name && u.name.toLowerCase() === userData.name.toLowerCase())
            );

            if (exists) {
                return { success: false, message: 'User with this email or name already exists.' };
            }

            const hashedPassword = await hashPassword(userData.password);

            // Create User Object
            const newUser = {
                id: Date.now().toString(),
                name: userData.name,
                email: userData.email,
                password: hashedPassword, // Store Hashed Password
                avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=random`,
                // Default profile fields
                age: '',
                height: '',
                weight: '',
                bio: ''
            };

            const updatedUsers = [...users, newUser];
            await AuthService.saveUsers(updatedUsers);

            return { success: true, user: newUser };
        } catch (error) {
            console.error("Registration error:", error);
            // Return specific error message if available, else generic
            return {
                success: false,
                message: error.message || 'An error occurred during registration.'
            };
        }
    },

    /**
     * Authenticate a user
     * @param {string} emailOrName 
     * @param {string} password 
     * @returns {Promise<Object>} result - { success, user, message }
     */
    login: async (emailOrName, password) => {
        try {
            const users = await AuthService.getUsers();
            const user = users.find(u =>
                (u.email && u.email.toLowerCase() === emailOrName.toLowerCase()) ||
                (u.name && u.name.toLowerCase() === emailOrName.toLowerCase())
            );

            if (!user) {
                return { success: false, message: 'User not found.' };
            }

            // Try hashing the input password
            const hashedPassword = await hashPassword(password);

            // Check match (Secure Hash)
            if (user.password === hashedPassword) {
                return { success: true, user: user };
            }

            // Fallback check (In case stored password was Base64 from fallback mode)
            // This ensures users registered in one mode can login in another if needed (partially)
            if (user.password === btoa(password)) {
                return { success: true, user: user };
            }

            return { success: false, message: 'Invalid password.' };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: 'An error occurred during login.' };
        }
    },

    /**
     * Update user data
     * @param {Object} updatedUser 
     * @returns {Promise<Object>} result - { success, user }
     */
    updateUser: async (updatedUser) => {
        try {
            const users = await AuthService.getUsers();
            // Match by ID if available, else email
            const index = users.findIndex(u => (updatedUser.id && u.id === updatedUser.id) || u.email === updatedUser.email);

            if (index === -1) {
                return { success: false, message: 'User not found.' };
            }

            // Merge updates
            users[index] = { ...users[index], ...updatedUser };
            await AuthService.saveUsers(users);

            return { success: true, user: users[index] };
        } catch (e) {
            console.error("Update error:", e);
            return { success: false, message: "Failed to update profile." };
        }
    },

    /**
     * Change Password
     * @param {string} email 
     * @param {string} oldPassword 
     * @param {string} newPassword 
     * @returns {Promise<Object>}
     */
    changePassword: async (email, oldPassword, newPassword) => {
        try {
            const users = await AuthService.getUsers();
            const index = users.findIndex(u => u.email === email);

            if (index === -1) {
                return { success: false, message: 'User not found.' };
            }

            const user = users[index];
            const hashedOld = await hashPassword(oldPassword);

            // Verify old password (check both hash and fallback for robustness)
            if (user.password !== hashedOld && user.password !== btoa(oldPassword)) {
                return { success: false, message: 'Current password is incorrect.' };
            }

            const hashedNew = await hashPassword(newPassword);
            users[index] = { ...user, password: hashedNew };
            await AuthService.saveUsers(users);

            return { success: true, message: 'Password updated successfully.' };
        } catch {
            return { success: false, message: "Failed to change password." };
        }
    },

    /**
     * Delete Account
     * @param {string} email 
     * @returns {Promise<Object>}
     */
    deleteAccount: async (email) => {
        try {
            let users = await AuthService.getUsers();
            const initialLength = users.length;
            users = users.filter(u => u.email !== email);

            if (users.length === initialLength) {
                return { success: false, message: 'User not found.' };
            }

            await AuthService.saveUsers(users);
            return { success: true, message: 'Account deleted.' };
        } catch {
            return { success: false, message: "Failed to delete account." };
        }
    },

    /**
     * Check if email exists
     * @param {string} email
     * @returns {Promise<boolean>}
     */
    checkEmailExists: async (email) => {
        const users = await AuthService.getUsers();
        return users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    },

    /**
     * Reset Password (Direct override)
     * @param {string} email
     * @param {string} newPassword
     * @returns {Promise<Object>}
     */
    resetPassword: async (email, newPassword) => {
        try {
            const users = await AuthService.getUsers();
            const index = users.findIndex(u => u.email && u.email.toLowerCase() === email.toLowerCase());

            if (index === -1) {
                return { success: false, message: 'User not found.' };
            }

            const hashedNew = await hashPassword(newPassword);
            users[index] = { ...users[index], password: hashedNew };
            await AuthService.saveUsers(users);

            return { success: true, message: 'Password reset successfully.' };
        } catch {
            return { success: false, message: "Reset failed." };
        }
    },

    /**
     * Simple validation helper (Sync is fine)
     */
    validate: (data, isRegistering = false) => {
        const errors = {};

        if (!data.name || data.name.length < 2) {
            errors.name = "Name must be at least 2 characters.";
        }

        if (data.password && data.password.length < 6) {
            errors.password = "Password must be at least 6 characters.";
        }

        if (isRegistering) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!data.email || !emailRegex.test(data.email)) {
                errors.email = "Please enter a valid email address.";
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
};
