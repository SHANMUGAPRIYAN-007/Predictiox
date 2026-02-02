import React from 'react';

const MachineStatus = ({ status }) => {

    let color = 'var(--success)';
    if (status === 'Warning') color = 'var(--alert-warning)';
    if (status === 'Critical') color = 'var(--alert-critical)';

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--bg-panel)',
            padding: '8px 16px',
            borderRadius: '20px',
            border: `1px solid ${color}`
        }}>
            <span style={{
                height: '10px',
                width: '100px', // Bar indicator
                background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
                borderRadius: '2px',
                display: 'block'
            }}></span>
            <span style={{
                color: color,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                minWidth: '80px',
                textAlign: 'right'
            }}>
                {status}
            </span>
        </div>
    );
};

export default MachineStatus;
