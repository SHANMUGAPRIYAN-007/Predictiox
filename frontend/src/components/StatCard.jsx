import React from 'react';
import { Activity, Thermometer, Gauge, Zap } from 'lucide-react';

const StatCard = ({ label, value, unit, icon, status }) => {

    // Choose icon component based on prop
    const getIconComponent = () => {
        if (icon === 'temp') return Thermometer;
        if (icon === 'vib') return Activity;
        if (icon === 'rpm') return Gauge;
        if (icon === 'power') return Zap;
        return Activity;
    };

    const IconComponent = getIconComponent();
    const iconColor = status === 'Critical' ? 'var(--alert-critical)' : 'var(--primary-neon)';
    const statusClass = status === 'Critical' ? 'pulse-red' : '';
    const borderStyle = status === 'Critical' ? { borderColor: 'var(--alert-critical)' } : {};

    return (
        <div className={`glass-panel stat-card ${statusClass}`} style={{ ...borderStyle, position: 'relative', overflow: 'hidden' }}>
            {/* Large background icon */}
            <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                opacity: 0.15,
                color: iconColor,
                transition: 'opacity 0.3s'
            }}>
                <IconComponent size={80} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', position: 'relative', zIndex: 10 }}>
                <div>
                    <div className="stat-label">{label}</div>
                    <div className="flex-center" style={{ justifyContent: 'flex-start', marginTop: '10px' }}>
                        <span className="stat-value" style={{ color: status === 'Critical' ? 'var(--alert-critical)' : 'var(--theme-accent)' }}>{value}</span>
                        <span className="stat-unit">{unit}</span>
                    </div>
                </div>
                <div style={{ marginTop: '5px', color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconComponent size={24} />
                </div>
            </div>
            {status === 'Critical' && (
                <div style={{ color: 'var(--alert-critical)', fontSize: '0.7rem', marginTop: '10px', fontWeight: 'bold', position: 'relative', zIndex: 10 }}>
                    CRITICAL LIMIT
                </div>
            )}
        </div>
    );
};

export default StatCard;
