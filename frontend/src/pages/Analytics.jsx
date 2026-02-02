import React, { useState, useEffect } from 'react';
import { Activity, Thermometer, Zap, Fan, Cpu, Server, Bell } from 'lucide-react';
import LiveChart from '../components/LiveChart';
import DigitalTwinCanvas from '../components/DigitalTwinCanvas';
import SpeedometerGauge from '../components/SpeedometerGauge';
import AlertPanel from '../components/AlertPanel';
import './Analytics.css';

// --- KPI CARD COMPONENT ---
const StatCard = ({ icon, label, value, unit, color = "var(--text-white)" }) => (
  <div className="analytics-stat-card">
    <div className="stat-icon-bg">
      {React.cloneElement(icon, { size: 80 })}
    </div>
    <div className="stat-header">
      <span className="stat-label">{label}</span>
      <div className="stat-icon-main">
        {React.cloneElement(icon, { size: 24 })}
      </div>
    </div>
    <div className="stat-body">
      <span className={`stat-value ${color === 'text-red-500' ? 'text-critical' : 'text-neon'}`}>{value}</span>
      <span className="stat-unit">{unit}</span>
    </div>
  </div>
);

// --- SPEEDOMETER CARD COMPONENT ---
const SpeedometerCard = ({ label, value, maxValue }) => (
  <div className="analytics-stat-card speedometer-card">
    <div className="stat-header">
      <span className="stat-label">{label}</span>
    </div>
    <div className="speedometer-body">
      <SpeedometerGauge value={value} maxValue={maxValue} label="RPM" size={140} />
    </div>
  </div>
);

// --- MAIN PAGE ---
export default function Analytics() {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState({ temp: 0, rpm: 0 });
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  // Mock alerts for consistency
  const [alerts] = useState([
    { id: 1, type: 'critical', msg: 'Core Temperature Exceeded Threshold (85°C)', timestamp: '2 mins ago' },
    { id: 2, type: 'warning', msg: 'Abnormal Vibration Detected in Sector 4', timestamp: '15 mins ago' }
  ]);

  // SIMULATE LIVE DATA
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      // Add some random noise to make the chart look real
      const newTemp = 65 + Math.random() * 5 + (Math.sin(now.getTime() / 1000) * 10);
      const newRpm = 1200 + Math.floor(Math.random() * 50);

      const newData = { time: timeStr, temp: newTemp, rpm: newRpm };

      setCurrent(newData);
      setHistory(prev => [...prev.slice(-20), newData]); // Keep last 20 points
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const machineStatus = current.temp > 80 ? 'Critical' : 'Active';

  return (
    <div className="analytics-page">

      {/* HEADER */}
      <header className="analytics-header">
        <div>
          <h1 className="analytics-title">
            <Server className="text-neon" size={32} />
            NEXUS_CORE <span className="version-tag">v2.0</span>
          </h1>
          <p className="analytics-subtitle">
            Target: <span className="text-neon">HYDRAULIC_PRESS_A1</span> | Connection: <span className="text-success">STABLE</span>
          </p>
        </div>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="live-badge">
            <span className="pulse-dot"></span>
            LIVE_FEED
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
                  border: '2px solid #0f1014'
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
              }}>
                <AlertPanel alerts={alerts} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* LAYOUT CONTAINER */}
      <div className="analytics-layout" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* SECTION 1: 3D DIGITAL TWIN (First/Top) */}
        <div className="twin-section glass-panel" style={{ height: '400px', width: '100%', position: 'relative' }}>
          <DigitalTwinCanvas rpm={current.rpm} status={machineStatus} />
        </div>

        {/* SECTION 2: 2x2 GRID (All other things) */}
        <div className="analytics-grid-2x2" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          minHeight: '400px'
        }}>
          {/* Quadrant 1: Speedometer (RPM) */}
          <div className="grid-quadrant">
            <SpeedometerCard
              label="Rotation Speed"
              value={current.rpm}
              maxValue={3500}
            />
          </div>

          {/* Quadrant 2: Power & Efficiency */}
          <div className="grid-quadrant glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <Zap size={32} color="var(--primary-neon)" />
              <div>
                <div className="stat-label">Power Consumption</div>
                <div className="stat-value" style={{ fontSize: '2rem' }}>
                  {(current.rpm / 40 + 10).toFixed(1)} <span className="stat-unit">A</span>
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
              <div className="stat-label">Efficiency Metric</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>92%</span>
                <span style={{ color: 'var(--success)', fontSize: '0.8rem' }}>● Optimal</span>
              </div>
            </div>
          </div>

          {/* Quadrant 3: Live Chart */}
          <div className="grid-quadrant">
            <div className="glass-panel" style={{ height: '100%', overflow: 'hidden' }}>
              <LiveChart
                title="Performance Trend"
                data={history}
                dataKey="temp"
                color="var(--theme-accent)"
              />
            </div>
          </div>

          {/* Quadrant 4: Environmental Stats (Temp/Vib) */}
          <div className="grid-quadrant glass-panel" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--glass-border)' }}>
              <Thermometer size={32} color="var(--theme-accent)" style={{ marginBottom: '10px' }} />
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>{current.temp.toFixed(1)}°C</div>
              <div className="stat-label">Temperature</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={32} color="var(--theme-accent)" style={{ marginBottom: '10px' }} />
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>{(Math.random() * 1.5 + 1.5).toFixed(2)} mm/s</div>
              <div className="stat-label">Vibration</div>
            </div>
          </div>

        </div>
      </div>
    </div >
  );
}