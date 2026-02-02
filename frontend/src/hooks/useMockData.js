import { useState, useEffect } from 'react';

const INITIAL_DATA = {
    temperature: 65, // Celsius
    vibration: 2.0,  // mm/s
    rpm: 3000,
    power: 80,       // Amps or kW
};

const INITIAL_TASKS = [
    { id: 1, task: 'Lubrication Check', due: '2h', status: 'Pending', priority: 'Medium' },
    { id: 2, task: 'Firmware Update', due: '6h', status: 'Pending', priority: 'Low' },
    { id: 3, task: 'Bearing Inspection', due: '24h', status: 'Scheduled', priority: 'High' },
];

export const useMockData = () => {
    const [data, setData] = useState(INITIAL_DATA);
    const [alerts, setAlerts] = useState([]);
    const [status, setStatus] = useState('Healthy'); // Healthy, Warning, Critical
    const [history, setHistory] = useState({
        temperature: [],
        vibration: [],
        rpm: [],
        power: []
    });

    // New Features State
    const [rul, setRul] = useState(98.5); // Remaining Useful Life %
    const [powerEff, setPowerEff] = useState(95); // Efficiency %
    const [ecoMode, setEcoMode] = useState(false);
    const [maintenanceTasks, setMaintenanceTasks] = useState(INITIAL_TASKS);

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => {
                // Simulate random fluctuations
                const fluctuation = ecoMode ? 0.3 : 0.8; // More stable in Eco Mode
                const newTemp = +(prev.temperature + (Math.random() * fluctuation * 2 - fluctuation)).toFixed(1);
                const newVib = +(prev.vibration + (Math.random() * 0.4 - 0.2)).toFixed(2);
                const newRpm = Math.floor(prev.rpm + (Math.random() * 20 - 10));

                // Power calculation influenced by Eco Mode
                let basePowerVar = Math.random() * 2 - 1;
                if (ecoMode) basePowerVar = Math.random() * 1 - 0.5; // Less variance
                let newPower = +(prev.power + basePowerVar).toFixed(1);
                if (ecoMode && newPower > 65) newPower -= 0.5; // Gradually lower power in Eco Mode

                // Anomaly Simulation (Randomly spike every ~20s) - Reduced in Eco Mode
                const isAnomaly = Math.random() < (ecoMode ? 0.01 : 0.05);
                const tempValue = isAnomaly ? newTemp + 5 : newTemp;
                const vibValue = isAnomaly ? newVib + 2 : newVib;

                // RUL Degradation simulation
                // Degrades faster if critical or high stress
                let degradation = 0.001;
                if (tempValue > 80 || vibValue > 4) degradation = 0.05;
                if (ecoMode) degradation = 0.0005; // Slower degradation in Eco

                setRul(prevRul => Math.max(0, +(prevRul - degradation).toFixed(4)));

                // Threshold checks
                const newAlerts = [];
                let newStatus = 'Healthy';

                // Only create anomaly alerts when actual anomaly is detected
                if (isAnomaly) {
                    if (tempValue > 85) {
                        newAlerts.push({
                            id: Date.now() + 't',
                            type: 'critical',
                            msg: 'Anomaly Detected: Sudden Temperature Spike',
                            timestamp: new Date().toLocaleTimeString(),
                            isAnomaly: true
                        });
                        newStatus = 'Critical';
                    }
                    if (vibValue > 4.5) {
                        newAlerts.push({
                            id: Date.now() + 'v',
                            type: 'critical',
                            msg: 'Anomaly Detected: Abnormal Vibration Pattern',
                            timestamp: new Date().toLocaleTimeString(),
                            isAnomaly: true
                        });
                        newStatus = 'Critical';
                    }
                } else {
                    // Regular threshold warnings (no voice alert)
                    if (tempValue > 85) {
                        newAlerts.push({
                            id: Date.now() + 't',
                            type: 'critical',
                            msg: 'Overheating Risk detected',
                            timestamp: new Date().toLocaleTimeString(),
                            isAnomaly: false
                        });
                        newStatus = 'Critical';
                    } else if (tempValue > 75) {
                        newAlerts.push({
                            id: Date.now() + 't',
                            type: 'warning',
                            msg: 'Temp rising above normal',
                            timestamp: new Date().toLocaleTimeString(),
                            isAnomaly: false
                        });
                        if (newStatus !== 'Critical') newStatus = 'Warning';
                    }

                    if (vibValue > 4.5) {
                        newAlerts.push({
                            id: Date.now() + 'v',
                            type: 'critical',
                            msg: 'Abnormal Vibration (Unbalance)',
                            timestamp: new Date().toLocaleTimeString(),
                            isAnomaly: false
                        });
                        newStatus = 'Critical';
                    }
                }

                // Limit alerts history
                if (newAlerts.length > 0) {
                    setAlerts(prevAlerts => {
                        const combined = [...newAlerts, ...prevAlerts];
                        return combined.slice(0, 5); // Keep last 5
                    });
                }

                setStatus(newStatus);

                // Update history for charts (Keep last 20 points)
                setHistory(prevHist => {
                    const now = new Date().toLocaleTimeString();
                    return {
                        temperature: [...prevHist.temperature, { time: now, value: tempValue }].slice(-20),
                        vibration: [...prevHist.vibration, { time: now, value: vibValue }].slice(-20),
                        rpm: [...prevHist.rpm, { time: now, value: newRpm }].slice(-20),
                        power: [...prevHist.power, { time: now, value: newPower }].slice(-20),
                    };
                });

                // Power Efficiency Sim
                setPowerEff(prev => {
                    let target = 95;
                    if (ecoMode) target = 98;
                    if (newStatus !== 'Healthy') target = 80;
                    return +(prev + (target - prev) * 0.05).toFixed(1);
                });

                return {
                    temperature: tempValue,
                    vibration: vibValue,
                    rpm: newRpm,
                    power: newPower,
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [ecoMode]);

    const optimizeTasks = () => {
        setMaintenanceTasks(prev => [
            { id: 4, task: 'Predictive Bearing Replacement', due: 'NOW', status: 'AI Optimized', priority: 'Critical' },
            ...prev.filter(t => t.id !== 3)
        ]);
    };

    const toggleEcoMode = () => setEcoMode(!ecoMode);

    return {
        data, alerts, status, history,
        rul, powerEff, ecoMode, maintenanceTasks,
        optimizeTasks, toggleEcoMode
    };
};
