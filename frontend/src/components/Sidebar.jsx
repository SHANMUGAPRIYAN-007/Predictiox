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
        <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="logo text-neon">
                <Zap size={24} />
                <span>PREDICTIO<span style={{ color: 'var(--theme-accent)' }}>X</span></span>
            </div>

            <nav className="nav-menu" style={{ flex: 1 }}>
                <NavLink
                    to="/"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    end
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/analytics"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Activity size={20} />
                    <span>Analytics</span>
                </NavLink>

                <div className="nav-item">
                    <Settings size={20} />
                    <span>Settings</span>
                </div>
            </nav>

            {/* User Profile & Logout Section */}
            <div style={{
                borderTop: '1px solid var(--glass-border)',
                paddingTop: '20px',
                marginTop: 'auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', padding: '0 10px' }}>
                    <div style={{
                        width: '36px', height: '36px',
                        borderRadius: '50%',
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--primary-neon)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <User size={18} color="var(--primary-neon)" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            {user?.name || 'User'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                            {user?.role || 'Viewer'}
                        </div>
                    </div>
                </div>

                <div
                    className="nav-item"
                    onClick={handleLogout}
                    style={{ color: 'var(--alert-critical)', marginTop: '0' }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
