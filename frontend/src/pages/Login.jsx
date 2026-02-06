import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Lock, User, Eye, EyeOff, Sun, Moon } from 'lucide-react';

const Login = ({ theme, toggleTheme }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const success = login(username, password);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid credentials');
        }
    };

    // Explicitly reset form fields on component mount (after logout)
    useEffect(() => {
        setUsername('');
        setPassword('');
        setError('');
    }, []);

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-dark)', // Use CSS var which changes with theme
            position: 'relative'
        }}>
            {/* Theme Toggle - Top Right */}
            <div
                onClick={toggleTheme}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '40px', height: '40px',
                    borderRadius: '50%',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: 'all 0.3s'
                }}
            >
                {theme === 'dark' ? <Sun size={20} color="var(--primary-neon)" /> : <Moon size={20} color="var(--primary-neon)" />}
            </div>

            {/* Background Animations */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 243, 255, 0.05), transparent 70%)',
                animation: 'pulse-bg 4s ease-in-out infinite alternate',
                pointerEvents: 'none'
            }}></div>

            <div className="glass-panel" style={{
                width: '100%', maxWidth: '400px', padding: '40px',
                position: 'relative',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(20px)'
            }}>
                {/* Logo Area */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
                    <div style={{
                        background: 'rgba(0, 243, 255, 0.1)',
                        padding: '15px', borderRadius: '50%', marginBottom: '15px',
                        border: '1px solid var(--primary-neon)',
                        boxShadow: '0 0 20px rgba(0, 243, 255, 0.2)',
                        animation: 'spin-slow 20s linear infinite'
                    }}>
                        <Zap size={40} color="var(--primary-neon)" />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>
                        PREDICTIO<span style={{ color: 'var(--theme-accent)' }}>X</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px', letterSpacing: '1px' }}>
                        INDUSTRIAL MONITORING
                    </p>
                </div>

                <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Username */}
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                            <User size={18} />
                        </div>
                        <input
                            type="text" placeholder="Username"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                            autoComplete="off"
                            style={{
                                width: '100%', padding: '12px 12px 12px 40px',
                                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                                borderRadius: '8px', color: 'var(--text-primary)', outline: 'none',
                                transition: 'all 0.3s'
                            }}
                            onFocus={(e) => { e.target.style.borderColor = 'var(--primary-neon)'; e.target.style.boxShadow = '0 0 10px rgba(0, 243, 255, 0.1)'; }}
                            onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"} placeholder="Password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            style={{
                                width: '100%', padding: '12px 40px 12px 40px',
                                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                                borderRadius: '8px', color: 'var(--text-primary)', outline: 'none',
                                transition: 'all 0.3s'
                            }}
                            onFocus={(e) => { e.target.style.borderColor = 'var(--primary-neon)'; e.target.style.boxShadow = '0 0 10px rgba(0, 243, 255, 0.1)'; }}
                            onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; }}
                        />
                        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                            onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            color: 'var(--alert-critical)', fontSize: '0.85rem', textAlign: 'center',
                            background: 'rgba(255, 42, 42, 0.1)', padding: '10px', borderRadius: '4px',
                            border: '1px solid var(--alert-critical)'
                        }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" style={{
                        marginTop: '10px', padding: '14px',
                        background: 'var(--primary-neon)', color: '#000',
                        border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem',
                        cursor: 'pointer', boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        textTransform: 'uppercase', letterSpacing: '1px'
                    }}
                        onMouseOver={(e) => e.target.style.boxShadow = '0 0 25px rgba(0, 243, 255, 0.4)'}
                        onMouseOut={(e) => e.target.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.2)'}
                    >
                        Initialize Login
                    </button>
                </form>

                <div style={{ marginTop: '25px', textAlign: 'center', opacity: 0.7 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '10px', background: 'rgba(0, 243, 255, 0.05)', borderRadius: '4px', border: '1px dashed var(--glass-border)' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--primary-neon)' }}>Terminal Access Hint:</span><br />
                        Default Admin: <span style={{ color: 'var(--text-primary)' }}>admin / admin123</span>
                    </div>
                </div>

                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>New System Node? </span>
                    <NavLink to="/register" style={{ color: 'var(--primary-neon)', textDecoration: 'none', fontWeight: 'bold' }}>
                        Initialize Registration
                    </NavLink>
                </div>
            </div>

            {/* Inline Animation Styles */}
            <style>{`
                @keyframes pulse-bg {
                    0% { opacity: 0.5; transform: scale(1); }
                    100% { opacity: 0.8; transform: scale(1.05); }
                }
                @keyframes spin-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Login;
