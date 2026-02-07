import React, { createContext, useState, useContext, useEffect } from 'react';
import { resolveUserRole } from '../services/roleResolver';
import { USERS } from '../services/mock/users';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        // Initialize Mock DB if empty
        const storedUsers = localStorage.getItem('predictiox_db_users');
        if (!storedUsers) {
            localStorage.setItem('predictiox_db_users', JSON.stringify([]));
            setUserCount(0);
        } else {
            setUserCount(JSON.parse(storedUsers).length);
        }

        // Check active session
        const storedUser = localStorage.getItem('predictiox_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (username, password) => {
        const users = JSON.parse(localStorage.getItem('predictiox_db_users') || '[]');
        const found = users.find(u => u.username === username && u.password === password);

        if (found) {
            // Re-resolve role on login to ensure latest permissions
            // Role resolution and resource visibility are enforced post-login, similar to IAM.
            const resolvedRole = resolveUserRole(username);

            const userData = {
                username: found.username,
                role: resolvedRole.toLowerCase(), // Use resolved role
                name: found.name,
                id: found.username
            };
            setUser(userData);
            localStorage.setItem('predictiox_user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const register = (username, password, role, invitedBy = null) => {
        const users = JSON.parse(localStorage.getItem('predictiox_db_users') || '[]');

        if (users.find(u => u.username === username)) {
            return { success: false, error: 'User already exists' };
        }

        // Use roleResolver to determine the role, passing the UI selection as a preference
        const resolvedRole = resolveUserRole(username, role);

        // Lowercase the role for consistency with existing app logic (which uses 'admin', 'technician')
        // roleResolver returns uppercase 'ADMIN' etc.
        const effectiveRole = resolvedRole.toLowerCase();

        // Update the mock USERS array in memory if the user is not present
        // This satisfies the requirement "Store the username in USERS if it does not already exist"
        const normalizedUsername = username.toLowerCase();

        // Determine if this user is the "First Admin" (Super Admin)
        // Definition: No users existed before this one (isFirstUser is true) OR 
        // if we want to support existing mock data 'admin', we should check if 'admin' exists. 
        // Since we are adding to USERS only if not present, and 'admin' is in the file.
        // We will assume 'admin' (from mock) is super admin, OR any new first user.
        // But USERS file has 'admin'. So isFirstUser is false.
        // We just need to flag `admin` as super admin in memory if not already?
        // Wait, the prompt implies "When a user signs up".
        // If 'admin' is already there, we don't sign up 'admin'.
        // If a new user signs up and is the FIRST one (empty DB), we make them admin.
        // We should flag THAT user as super admin.

        // Let's rely on the `effectiveRole` logic. If `effectiveRole` is 'admin' and `users.length === 0` (local storage empty), 
        // OR `USERS` length is 1 (after push)?
        // Actually, AuthContext uses `users` (localStorage) and `USERS` (mock).
        // If `users` (localStorage) is empty, `isFirstUser` is true.
        const isSuperAdmin = users.length === 0 && effectiveRole === 'admin';

        if (!USERS.find(u => u.username.toLowerCase() === normalizedUsername)) {
            USERS.push({
                username,
                role: resolvedRole, // Store the uppercase role from resolver
                isSuperAdmin: isSuperAdmin // Persist this flag in memory
            });
        }

        const newUser = {
            username,
            password,
            role: effectiveRole,
            name: username.charAt(0).toUpperCase() + username.slice(1),
            createdAt: new Date().toISOString(),
            isSuperAdmin: isSuperAdmin // Persist in localStorage too
        };

        users.push(newUser);
        localStorage.setItem('predictiox_db_users', JSON.stringify(users));
        setUserCount(users.length);
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('predictiox_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, userCount }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
