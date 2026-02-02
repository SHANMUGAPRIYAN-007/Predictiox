import React from 'react';
import { Box } from 'lucide-react';

const DigitalTwinCanvas = () => {
    return (
        <div className="glass-panel digital-twin-stage">
            {/* 3D Grid Animation is handled by .grid-overlay in CSS */}
            <div className="grid-overlay"></div>

            <div style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-neon)'
            }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    border: '2px solid var(--primary-neon)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(0, 243, 255, 0.3)',
                    background: 'rgba(0,0,0,0.4)'
                }}>
                    <Box size={64} className="pulse-red" style={{ color: 'var(--text-primary)', animation: 'none' }} />
                </div>
                <h2 style={{ marginTop: '20px', letterSpacing: '2px', fontSize: '1.2rem' }}>DIGITAL TWIN V1.0</h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                    Interactive 3D Model Placeholder
                </span>
            </div>

            {/* HUD Elements */}
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 2 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>MODEL ID</div>
                <div style={{ fontFamily: 'var(--font-mono)' }}>DT-X500-PRO</div>
            </div>
            <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 2, textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>CONNECTIVITY</div>
                <div style={{ color: 'var(--success)', fontSize: '0.8rem' }}>● LIVE MQTT</div>
            </div>
        </div>
    );
};

export default DigitalTwinCanvas;
