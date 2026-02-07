import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Activity, Settings, Zap, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="logo text-neon">
                <Zap size={24} />
                <span>PREDICTIO<span style={{ color: 'var(--theme-accent)' }}>X</span></span>
            </div>

            <nav className="nav-menu">
                <NavLink
                    to="/"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    end
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                {/* Technical staff access */}
                {(user?.role === 'admin' || user?.role === 'technician') && (
                    <NavLink
                        to="/analytics"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Activity size={20} />
                        <span>Analytics</span>
                    </NavLink>
                )}

                {/* Admin-only User Management */}
                {user?.role === 'admin' && (
                    <NavLink
                        to="/register"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <User size={20} />
                        <span>User Management</span>
                    </NavLink>
                )}

                {/* Technician access to Settings */}
                {user?.role === 'technician' && (
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Settings size={20} />
                        <span>Settings</span>
                    </NavLink>
                )}
            </nav>

            {/* User Profile & Logout Section */}
            <div className="sidebar-footer">
                <div className="user-profile-summary">
                    <div className="user-avatar">
                        <User size={18} color="var(--primary-neon)" />
                    </div>
                    <div className="user-info">
                        <div className="user-name">
                            {user?.name || 'User'}
                        </div>
                        <div className="user-role">
                            {user?.role || 'Viewer'}
                        </div>
                    </div>
                </div>

                <div
                    className="nav-item logout-item"
                    onClick={handleLogout}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
