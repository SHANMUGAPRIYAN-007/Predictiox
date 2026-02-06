import React from 'react';
import { Zap, Leaf, TrendingDown } from 'lucide-react';

const PowerOptimizer = ({ efficiency, isEcoMode, onToggleEco, powerUsage, readOnly }) => {
    return (
        <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Energy Monitor
                </h3>
                <div
                    onClick={!readOnly ? onToggleEco : undefined}
                    style={{
                        cursor: readOnly ? 'default' : 'pointer',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        background: isEcoMode ? 'var(--success)' : 'rgba(255,255,255,0.1)',
                        color: isEcoMode ? '#000' : 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', gap: '5px',
                        opacity: readOnly ? 0.6 : 1,
                        transition: 'all 0.3s'
                    }}
                >
                    <Leaf size={12} fill={isEcoMode ? "currentColor" : "none"} />
                    {isEcoMode ? 'ECO ACTIVE' : 'ECO MODE OFF'}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Metric Efficiency</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: efficiency > 90 ? 'var(--success)' : 'var(--alert-warning)' }}>
                        {efficiency}%
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current Draw</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {powerUsage} <span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>A</span>
                    </div>
                </div>
            </div>

            {/* Suggestion Box */}
            <div style={{
                marginTop: '15px',
                background: 'rgba(0, 243, 255, 0.05)',
                border: '1px dashed rgba(0, 243, 255, 0.3)',
                padding: '10px',
                borderRadius: '6px',
                display: 'flex', alignItems: 'center', gap: '10px'
            }}>
                <TrendingDown size={16} color="var(--primary-neon)" />
                <div style={{ fontSize: '0.8rem' }}>
                    {isEcoMode
                        ? 'Power consumption reduced by ~12%.'
                        : 'Suggested: Switch to Eco Mode during idle cycles.'}
                </div>
            </div>
        </div>
    );
};

export default PowerOptimizer;
