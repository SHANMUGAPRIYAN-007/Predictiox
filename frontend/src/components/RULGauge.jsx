import React from 'react';
import { Hourglass } from 'lucide-react';

const RULGauge = ({ percentage }) => {
    // Determine color based on percentage, using neon green for optimal status
    const neonGreen = '#ccff00';
    const warningColor = '#ffae00';
    const criticalColor = '#ff2a2a';

    let color = neonGreen;
    if (percentage < 70) color = warningColor;
    if (percentage < 40) color = criticalColor;

    return (
        <div className="glass-panel" style={{
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '160px'
        }}>
            <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Background Ring - slightly darker/thicker for better contrast */}
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    border: '14px solid rgba(255,255,255,0.03)'
                }}></div>

                {/* Progress Ring (Conic Gradient) */}
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: `conic-gradient(${color} ${percentage}%, transparent 0)`,
                    mask: 'radial-gradient(closest-side, transparent 72%, black 75%)',
                    WebkitMask: 'radial-gradient(closest-side, transparent 72%, black 75%)',
                    transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    filter: `drop-shadow(0 0 5px ${color}44)`
                }}></div>

                {/* Inner Content - Larger and cleaner like the image */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                    <span style={{
                        fontSize: '1.6rem',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.02em'
                    }}>
                        {Math.floor(percentage)}%
                    </span>
                    <span style={{
                        fontSize: '0.6rem',
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        fontWeight: '600',
                        marginTop: '-2px'
                    }}>
                        Health
                    </span>
                </div>
            </div>

            <div style={{ flex: 1, marginLeft: '24px' }}>
                <h3 style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    AI PREDICTION
                </h3>
                <div style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    lineHeight: '1.2'
                }}>
                    Remaining Useful Life
                </div>
                <div style={{
                    fontSize: '0.75rem',
                    color: color,
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600'
                }}>
                    <Hourglass size={14} />
                    <span>{percentage > 50 ? 'Optimal Performance' : 'Immediate Action Required'}</span>
                </div>
            </div>
        </div>
    );
};

export default RULGauge;
