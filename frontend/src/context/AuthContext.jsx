import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize Mock DB if empty
        if (!localStorage.getItem('predictiox_db_users')) {
            const defaultUsers = [
                { username: 'tech', password: 'tech123', role: 'technician', name: 'Max Tech' },
                { username: 'view', password: 'view123', role: 'viewer', name: 'Alex Viewer' }
            ];
            localStorage.setItem('predictiox_db_users', JSON.stringify(defaultUsers));
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
            const userData = { username: found.username, role: found.role, name: found.name };
            setUser(userData);
            localStorage.setItem('predictiox_user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const register = (username, password, role) => {
        const users = JSON.parse(localStorage.getItem('predictiox_db_users') || '[]');

        if (users.find(u => u.username === username)) {
            return false;
        }

        const newUser = {
            username,
            password,
            role,
            name: username.charAt(0).toUpperCase() + username.slice(1)
        };

        users.push(newUser);
        localStorage.setItem('predictiox_db_users', JSON.stringify(users));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('predictiox_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
