import React from 'react';
import { AlertTriangle, AlertOctagon } from 'lucide-react';

const AlertPanel = ({ alerts }) => {
    return (
        <div className="glass-panel alert-dropdown" style={{
            padding: '20px',
            width: '320px',
            maxHeight: '400px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)' }}>System Alerts</h3>
                <span style={{
                    background: alerts.length > 0 ? 'var(--alert-critical)' : 'rgba(255,255,255,0.1)',
                    padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold'
                }}>
                    {alerts.length} Active
                </span>
            </div>

            {alerts.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '20px 0' }}>
                    No Active Alerts
                </div>
            ) : (
                <div className="alert-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {alerts.map(alert => (
                        <div key={alert.id} className={`alert-item ${alert.type === 'warning' ? 'warning' : ''}`} style={{
                            display: 'flex',
                            gap: '12px',
                            padding: '10px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ marginTop: '2px' }}>
                                {alert.type === 'critical' ? (
                                    <AlertOctagon size={16} color="var(--alert-critical)" />
                                ) : (
                                    <AlertTriangle size={16} color="var(--alert-warning)" />
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="alert-msg" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>{alert.msg}</div>
                                <div className="alert-time" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{alert.timestamp}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AlertPanel;
