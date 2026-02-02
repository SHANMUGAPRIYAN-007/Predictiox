import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import AlertPanel from '../components/AlertPanel';
import DigitalTwinCanvas from '../components/DigitalTwinCanvas';
import LiveChart from '../components/LiveChart';
import MachineStatus from '../components/MachineStatus';
import RULGauge from '../components/RULGauge';
import PowerOptimizer from '../components/PowerOptimizer';
import MaintenanceScheduler from '../components/MaintenanceScheduler';
import SpeedometerGauge from '../components/SpeedometerGauge';
import { useMockData } from '../hooks/useMockData';
import { User, Bell, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- SPEEDOMETER CARD COMPONENT ---
const SpeedometerCard = ({ label, value, maxValue, status }) => (
    <div className={`glass-panel stat-card ${status === 'Critical' ? 'pulse-red' : ''}`} style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="stat-label">{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
            <SpeedometerGauge value={value} maxValue={maxValue} label="RPM" size={120} />
        </div>
    </div>
);

const Dashboard = ({ theme, toggleTheme }) => {
    const { user } = useAuth();
    const isViewer = user?.role === 'viewer';

    const {
        data, alerts, status, history,
        rul, powerEff, ecoMode, maintenanceTasks,
        optimizeTasks, toggleEcoMode
    } = useMockData();

    // System Alerts Dropdown Logic
    const [isAlertsOpen, setIsAlertsOpen] = useState(false);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isAlertsOpen && !event.target.closest('.notification-btn-container')) {
                setIsAlertsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isAlertsOpen]);

    return (
        <>
            {/* Header */}
            <header className="dashboard-header">
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>INDUSTRIAL IOT DASHBOARD</h1>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        UNIT: TURBINE-X500 | LOCATION: SECTOR 4
                    </span>
                </div>

                <div className="flex-center" style={{ gap: '20px' }}>
                    <MachineStatus status={status} />

                    {/* Theme Toggle Button */}
                    <div
                        className="glass-panel flex-center notification-btn"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
                        onClick={toggleTheme}
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? (
                            <Sun size={20} color="var(--primary-neon)" />
                        ) : (
                            <Moon size={20} color="var(--primary-neon)" />
                        )}
                    </div>

                    <div className="notification-btn-container" style={{ position: 'relative' }}>
                        <div
                            className="glass-panel flex-center notification-btn"
                            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                border: isAlertsOpen ? '1px solid var(--primary-neon)' : '1px solid var(--glass-border)',
                                background: isAlertsOpen ? 'rgba(0, 243, 255, 0.1)' : 'var(--glass-bg)'
                            }}
                        >
                            <Bell size={20} color={isAlertsOpen ? 'var(--primary-neon)' : 'var(--text-secondary)'} />
                            {alerts.length > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    width: '12px',
                                    height: '12px',
                                    background: 'var(--alert-critical)',
                                    borderRadius: '50%',
                                    border: '2px solid var(--bg-dark)'
                                }}></span>
                            )}
                        </div>

                        {/* Alerts Dropdown */}
                        {isAlertsOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '50px',
                                right: '0',
                                zIndex: 1000,
                                animation: 'dropdownSlide In 0.2s ease-out'
                            }}>
                                <AlertPanel alerts={alerts} />
                            </div>
                        )}
                    </div>
                    <div className="glass-panel flex-center" style={{ width: '40px', height: '40px', borderRadius: '50%' }}>
                        <User size={20} color="var(--primary-neon)" />
                    </div>
                </div>
            </header>

            {/* Dashboard Grid Logic: Since we are inside main-content which is grid, 
               we need to ensure this fragment renders children that fit the grid 
               OR wrap them in a fragment?
               
               In App.jsx, .main-content was grid-template-columns: 2fr 1fr.
               So we should probably return a Fragment and let the direct children be col-left and col-right?
               Yes, React Fragments don't add DOM nodes, so col-left and col-right will be direct children of main.
            */}

            <div className="col-left">
                <DigitalTwinCanvas />

                {/* RUL + Power Optimizer Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <RULGauge percentage={rul} />
                    <PowerOptimizer
                        efficiency={powerEff}
                        isEcoMode={ecoMode}
                        onToggleEco={toggleEcoMode}
                        powerUsage={data.power}
                        readOnly={isViewer}
                    />
                </div>

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <LiveChart
                        title="Temperature Trend"
                        data={history.temperature}
                        dataKey="value"
                        color={status === 'Critical' && data.temperature > 500 ? 'var(--alert-critical)' : 'var(--theme-accent)'}
                    />
                    <LiveChart
                        title="Vibration Analysis"
                        data={history.vibration}
                        dataKey="value"
                        color={status === 'Critical' && data.vibration > 40 ? 'var(--alert-critical)' : 'var(--theme-accent)'}
                    />
                </div>
            </div>

            {/* Right Column: Key Metrics & Alerts */}
            <div className="col-right">
                <div className="stats-grid">
                    <StatCard
                        label="Temperature"
                        value={data.temperature}
                        unit="°C"
                        icon="temp"
                        status={status === 'Critical' && data.temperature > 85 ? 'Critical' : 'Healthy'}
                    />
                    <StatCard
                        label="Vibration"
                        value={data.vibration}
                        unit="mm/s"
                        icon="vib"
                        status={status === 'Critical' && data.vibration > 4.5 ? 'Critical' : 'Healthy'}
                    />
                    <SpeedometerCard
                        label="Rotation Speed"
                        value={data.rpm}
                        maxValue={3500}
                        status="Healthy"
                    />
                    <StatCard
                        label="Power Load"
                        value={data.power}
                        unit="A"
                        icon="power"
                        status="Healthy"
                    />
                </div>

                {/* Maintenance Scheduler - RESTRICTED FOR VIEWERS */}
                {!isViewer ? (
                    <MaintenanceScheduler tasks={maintenanceTasks} onOptimize={optimizeTasks} />
                ) : (
                    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center', opacity: 0.7 }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔒</div>
                        <h3 style={{ color: 'var(--text-secondary)' }}>RESTRICTED ACCESS</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                            Detailed maintenance schedules are available to Technicians only.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Dashboard;
