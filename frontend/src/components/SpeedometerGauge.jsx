import React, { useState, useEffect } from 'react';

const SpeedometerGauge = ({ value, maxValue = 3500, label = "RPM", size = 120 }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTimestamp = null;
        const startValue = displayValue;
        const endValue = value;
        const duration = 1000; // 1 second animation

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Ease out cubic for a smoother feel
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            const currentValue = startValue + (endValue - startValue) * easedProgress;
            setDisplayValue(currentValue);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [value]);

    // Calculate percentage and angle based on displayValue
    const percentage = Math.min((displayValue / maxValue) * 100, 100);
    const angle = (percentage / 100) * 180 - 90; // -90 to 90 degrees

    // Calculate color based on percentage
    const getColor = () => {
        if (percentage < 50) return '#00ff9d'; // Green
        if (percentage < 75) return '#ffae00'; // Amber
        return '#ff2a2a'; // Red
    };

    const color = getColor();
    const padding = 15;
    const radius = (size - padding * 2) / 2;
    const centerX = size / 2;
    const centerY = size / 2;
    const circumference = Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div style={{
            position: 'relative',
            width: size,
            height: size / 2 + 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            {/* SVG Gauge */}
            <svg
                width={size}
                height={size / 2 + 10}
                viewBox={`0 0 ${size} ${size / 2 + 10}`}
                style={{ overflow: 'hidden' }}
            >
                {/* Background arc */}
                <path
                    d={`M ${padding} ${centerY} A ${radius} ${radius} 0 0 1 ${size - padding} ${centerY}`}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="6"
                    strokeLinecap="round"
                />

                {/* Progress arc */}
                <path
                    d={`M ${padding} ${centerY} A ${radius} ${radius} 0 0 1 ${size - padding} ${centerY}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                        transition: 'stroke-dashoffset 0.1s linear', // Closely follow displayValue
                        filter: `drop-shadow(0 0 4px ${color})`
                    }}
                />

                {/* Needle */}
                <line
                    x1={centerX}
                    y1={centerY}
                    x2={centerX + Math.cos((angle * Math.PI) / 180) * (radius - 8)}
                    y2={centerY + Math.sin((angle * Math.PI) / 180) * (radius - 8)}
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{
                        transition: 'all 0.1s linear' // Closely follow displayValue
                    }}
                />

                {/* Center dot */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r="4"
                    fill={color}
                />
            </svg>

            {/* Value display */}
            <div style={{
                position: 'absolute',
                bottom: '0px',
                textAlign: 'center',
                width: '100%'
            }}>
                <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: color,
                    fontFamily: 'monospace',
                    textShadow: `0 0 8px ${color}`
                }}>
                    {Math.round(displayValue)}
                </div>
                <div style={{
                    fontSize: '0.6rem',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginTop: '1px'
                }}>
                    {label}
                </div>
            </div>
        </div>
    );
};

export default SpeedometerGauge;
