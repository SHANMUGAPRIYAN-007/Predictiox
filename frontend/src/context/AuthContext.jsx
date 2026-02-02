import React, { createContext, useState, useContext, useEffect } from 'react';

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
            const userData = {
                username: found.username,
                role: found.role,
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

        // Logical Fix: If NO users exist, allow the first registrant to be an Admin
        const isFirstUser = users.length === 0;

        // Business Logic: Only Admin can create Technicians or other Admins (unless it's the first user)
        if (!isFirstUser && (role === 'technician' || role === 'admin') && (!invitedBy || invitedBy.role !== 'admin')) {
            return { success: false, error: 'Unauthorized: Only Admins can register technical staff' };
        }

        // Safe-guard: If it's the first user, FORCE them to be an admin to avoid locking the system
        const effectiveRole = isFirstUser ? 'admin' : role;

        const newUser = {
            username,
            password,
            role: effectiveRole,
            name: username.charAt(0).toUpperCase() + username.slice(1),
            createdAt: new Date().toISOString()
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
