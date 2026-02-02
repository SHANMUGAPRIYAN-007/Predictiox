import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Database, Cpu, Save, RefreshCw } from 'lucide-react';

const Settings = () => {
    const [config, setConfig] = useState({
        refreshInterval: 5000,
        alertThreshold: 85,
        ecoMode: true,
        notificationEmail: 'tech-alerts@predictiox.com',
        autoDiagnostics: true
    });

    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            alert('System configuration updated successfully!');
        }, 1500);
    };

    return (
        <div className="page-container" style={{ padding: '30px', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ marginBottom: '30px' }}>
                <h1 className="text-neon" style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '2rem' }}>
                    <SettingsIcon size={32} />
                    SYSTEM TERMINAL SETTINGS
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>
                    Configure critical system thresholds and industrial node parameters.
                </p>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px' }}>
                {/* Data Acquisition Settings */}
                <div className="glass-panel" style={{ padding: '25px' }}>
                    <h3 className="text-neon" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Database size={20} />
                        Data Acquisition
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Sensor Polling Interval (ms)
                            </label>
                            <input
                                type="number"
                                value={config.refreshInterval}
                                onChange={(e) => setConfig({ ...config, refreshInterval: parseInt(e.target.value) })}
                                className="settings-input"
                                style={{
                                    width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)',
                                    padding: '12px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Anomaly Detection Sensitivity (%)
                            </label>
                            <input
                                type="range" min="0" max="100"
                                value={config.alertThreshold}
                                onChange={(e) => setConfig({ ...config, alertThreshold: parseInt(e.target.value) })}
                                style={{ width: '100%', accentColor: 'var(--primary-neon)' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.8rem' }}>
                                <span>Low Persistence</span>
                                <span className="text-neon">{config.alertThreshold}%</span>
                                <span>High Precision</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alert & Security */}
                <div className="glass-panel" style={{ padding: '25px' }}>
                    <h3 className="text-neon" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Shield size={20} />
                        Security & Alerts
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Emergency Notification Channel
                            </label>
                            <input
                                type="email"
                                value={config.notificationEmail}
                                onChange={(e) => setConfig({ ...config, notificationEmail: e.target.value })}
                                style={{
                                    width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)',
                                    padding: '12px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1rem' }}>Automatic Diagnostics</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Initiate RUL checks on detection</p>
                            </div>
                            <div
                                onClick={() => setConfig({ ...config, autoDiagnostics: !config.autoDiagnostics })}
                                style={{
                                    width: '50px', height: '26px', borderRadius: '13px',
                                    background: config.autoDiagnostics ? 'var(--primary-neon)' : 'rgba(255,255,255,0.1)',
                                    position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
                                }}
                            >
                                <div style={{
                                    width: '20px', height: '20px', borderRadius: '50%',
                                    background: config.autoDiagnostics ? '#000' : '#fff',
                                    position: 'absolute', top: '3px',
                                    left: config.autoDiagnostics ? '27px' : '3px',
                                    transition: 'all 0.3s'
                                }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Industrial Components */}
                <div className="glass-panel" style={{ padding: '25px', gridColumn: '1 / -1' }}>
                    <h3 className="text-neon" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Cpu size={20} />
                        Active Component Configuration
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '15px' }}>Component Name</th>
                                    <th style={{ padding: '15px' }}>Serial ID</th>
                                    <th style={{ padding: '15px' }}>Current State</th>
                                    <th style={{ padding: '15px' }}>Optimum Efficiency</th>
                                    <th style={{ padding: '15px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'Digital Twin Processor', id: 'DTP-900', state: 'Active', eff: '98.5%' },
                                    { name: 'Vibration Transducer', id: 'VTX-442', state: 'Active', eff: '94.2%' },
                                    { name: 'Predictive CPU Core', id: 'PRE-CPU-04', state: 'Optimizing', eff: '89.1%' }
                                ].map((comp, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px' }}>{comp.name}</td>
                                        <td style={{ padding: '15px', color: 'var(--text-secondary)' }}>{comp.id}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem',
                                                background: 'rgba(0, 243, 255, 0.1)', color: 'var(--primary-neon)',
                                                border: '1px solid var(--primary-neon)'
                                            }}>
                                                {comp.state}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>{comp.eff}</td>
                                        <td style={{ padding: '15px' }}>
                                            <button style={{
                                                background: 'transparent', border: '1px solid var(--glass-border)',
                                                color: 'var(--text-secondary)', padding: '5px 10px', borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}>
                                                Recalibrate
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <button
                    className="glass-button"
                    style={{ padding: '12px 25px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <RefreshCw size={18} />
                    Reset Factory Defaults
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        background: 'var(--primary-neon)', color: '#000', border: 'none',
                        padding: '12px 40px', borderRadius: '8px', fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                        boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)',
                        transition: 'all 0.3s'
                    }}
                >
                    {saving ? <RefreshCw size={18} className="spin" /> : <Save size={18} />}
                    {saving ? 'UPDATING...' : 'APPLY CONFIGURATION'}
                </button>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .settings-input:focus {
                    border-color: var(--primary-neon) !important;
                    box-shadow: 0 0 10px rgba(0, 243, 255, 0.1);
                }
            `}</style>
        </div>
    );
};

export default Settings;
