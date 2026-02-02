import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, User, Lock, UserCog, Eye, EyeOff, Sun, Moon } from 'lucide-react';

const Register = ({ theme, toggleTheme }) => {
    const { register, user: currentUser, userCount } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: userCount === 0 ? 'admin' : (currentUser?.role === 'admin' ? 'technician' : 'viewer')
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        const result = register(formData.username, formData.password, formData.role, currentUser);
        if (result.success) {
            // If admin created a tech, don't navigate away, just clear form or show success
            if (currentUser?.role === 'admin') {
                alert(`Successfully registered ${formData.role}: ${formData.username}`);
                setFormData({ username: '', password: '', confirmPassword: '', role: 'viewer' });
            } else {
                navigate('/login');
            }
        } else {
            setError(result.error);
        }
    };

    return (
        <div style={{
            height: '100vh', width: '100vw', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-dark)',
            position: 'relative'
        }}>
            {/* Theme Toggle - Top Right */}
            <div
                onClick={toggleTheme}
                style={{
                    position: 'absolute', top: '20px', right: '20px',
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 10, transition: 'all 0.3s'
                }}
            >
                {theme === 'dark' ? <Sun size={20} color="var(--primary-neon)" /> : <Moon size={20} color="var(--primary-neon)" />}
            </div>

            {/* Background Animations */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(112, 0, 255, 0.05), transparent 70%)',
                animation: 'pulse-bg 4s ease-in-out infinite alternate',
                pointerEvents: 'none'
            }}></div>

            <div className="glass-panel" style={{
                width: '100%', maxWidth: '450px', padding: '40px',
                position: 'relative', border: '1px solid var(--glass-border)',
                boxShadow: '0 0 40px rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)'
            }}>
                {/* Branding/Header */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '25px' }}>
                    <div style={{
                        background: 'rgba(0, 243, 255, 0.1)',
                        padding: '12px', borderRadius: '50%', marginBottom: '10px',
                        border: '1px solid var(--primary-neon)',
                        boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)'
                    }}>
                        <Zap size={30} color="var(--primary-neon)" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '5px' }}>
                        PREDICTIO<span style={{ color: 'var(--theme-accent)' }}>X</span> REGISTRATION
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join the Industrial Network</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {/* Username */}
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                            <User size={18} />
                        </div>
                        <input
                            name="username" type="text" placeholder="Username"
                            value={formData.username} onChange={handleChange} required
                            style={{
                                width: '100%', padding: '12px 12px 12px 40px',
                                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                                borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-neon)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                        />
                    </div>

                    {/* Role Selection */}
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                            <UserCog size={18} />
                        </div>
                        <select
                            name="role" value={formData.role} onChange={handleChange}
                            style={{
                                width: '100%', padding: '12px 12px 12px 40px',
                                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                                borderRadius: '8px', color: 'var(--text-primary)', outline: 'none',
                                cursor: (currentUser?.role === 'admin' || userCount === 0) ? 'pointer' : 'not-allowed'
                            }}
                            disabled={currentUser?.role !== 'admin' && userCount > 0}
                        >
                            <option value="admin">Administrator (Full System Access)</option>
                            <option value="technician">Technician (Maintenance & Settings)</option>
                            <option value="viewer">Viewer (Read-Only Terminal)</option>
                        </select>
                    </div>

                    {userCount === 0 ? (
                        <div style={{
                            padding: '10px', background: 'rgba(0, 243, 255, 0.1)',
                            borderRadius: '8px', border: '1px solid var(--primary-neon)',
                            textAlign: 'center', marginBottom: '10px'
                        }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--primary-neon)', fontWeight: 'bold' }}>
                                ⚡ FIRST INITIALIZATION DETECTED
                            </p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                You are the first user. You will be established as the System Administrator.
                            </p>
                        </div>
                    ) : currentUser?.role !== 'admin' && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--alert-critical)', marginTop: '-10px', textAlign: 'center' }}>
                            * Public registration restricted to Viewer role.
                            <br />Admin credentials required for technical roles.
                        </p>
                    )}

                    {/* Password */}
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                            <Lock size={18} />
                        </div>
                        <input
                            name="password" type={showPassword ? "text" : "password"} placeholder="Password"
                            value={formData.password} onChange={handleChange} required
                            style={{
                                width: '100%', padding: '12px 40px 12px 40px',
                                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                                borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-neon)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                        />
                        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                            onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                            <Lock size={18} />
                        </div>
                        <input
                            name="confirmPassword" type="password" placeholder="Confirm Password"
                            value={formData.confirmPassword} onChange={handleChange} required
                            style={{
                                width: '100%', padding: '12px 12px 12px 40px',
                                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                                borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-neon)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                        />
                    </div>

                    {error && (
                        <div style={{
                            color: 'var(--alert-critical)', fontSize: '0.85rem', textAlign: 'center',
                            background: 'rgba(255, 42, 42, 0.1)', padding: '8px', borderRadius: '4px'
                        }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" style={{
                        marginTop: '10px', padding: '14px',
                        background: 'var(--primary-neon)', color: '#000',
                        border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem',
                        cursor: 'pointer', boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)',
                        textTransform: 'uppercase', transition: 'all 0.3s'
                    }}
                        onMouseOver={(e) => e.target.style.boxShadow = '0 0 25px rgba(0, 243, 255, 0.4)'}
                        onMouseOut={(e) => e.target.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.2)'}
                    >
                        Create Account
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Already initialized? </span>
                    <NavLink to="/login" style={{ color: 'var(--primary-neon)', textDecoration: 'none', fontWeight: 'bold' }}>
                        Access Terminal
                    </NavLink>
                </div>
            </div>

            {/* Reuse animation style from Login for consistency */}
            <style>{`
                @keyframes pulse-bg {
                    0% { opacity: 0.5; transform: scale(1); }
                    100% { opacity: 0.8; transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
};

export default Register;
