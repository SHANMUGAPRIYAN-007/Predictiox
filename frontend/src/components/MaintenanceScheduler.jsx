import React, { useState } from 'react';
import { Calendar, CheckCircle, RefreshCw, Wand2, Clock } from 'lucide-react';

const MaintenanceScheduler = ({ tasks, onOptimize }) => {
    const [optimizing, setOptimizing] = useState(false);

    const handleOptimize = () => {
        setOptimizing(true);
        setTimeout(() => {
            onOptimize();
            setOptimizing(false);
        }, 1500);
    };

    return (
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Smart Maintenance
                </h3>
                <button
                    onClick={handleOptimize}
                    disabled={optimizing}
                    style={{
                        background: 'linear-gradient(45deg, var(--secondary-neon), #a855f7)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        color: 'var(--text-primary)',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        opacity: optimizing ? 0.7 : 1,
                        transition: 'all 0.3s'
                    }}
                >
                    {optimizing ? <RefreshCw size={14} className="spin" /> : <Wand2 size={14} />}
                    {optimizing ? 'AI OPTIMIZING...' : 'AI OPTIMIZE'}
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {tasks.map(task => (
                    <div key={task.id} style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '10px',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        borderLeft: `3px solid ${task.priority === 'Critical' ? 'var(--alert-critical)' : task.priority === 'High' ? 'var(--alert-warning)' : 'var(--success)'}`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{task.task}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                                {task.due}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: task.status === 'AI Optimized' ? 'var(--primary-neon)' : '#555' }}></div>
                            {task.status}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default MaintenanceScheduler;
