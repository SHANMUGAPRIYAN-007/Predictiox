import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const LiveChart = ({ data, dataKey, color, title }) => {
    // Determine the main neon color, defaulting to the vibrant green from the image
    const neonColor = color || "#ccff00";
    const gradientId = `colorGradient_${title.replace(/\s+/g, '')}`;

    return (
        <div className="glass-panel" style={{
            padding: '24px',
            height: '320px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <h3 style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '20px',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {title}
            </h3>

            <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={neonColor} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={neonColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                            minTickGap={30}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                            domain={['auto', 'auto']}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                color: 'var(--text-secondary)'
                            }}
                            itemStyle={{ color: neonColor, fontWeight: 'bold' }}
                            labelStyle={{ display: 'none' }}
                        />

                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={neonColor}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#${gradientId})`}
                            dot={false}
                            activeDot={{
                                r: 6,
                                fill: neonColor,
                                stroke: '#000',
                                strokeWidth: 2,
                                filter: 'drop-shadow(0 0 8px ' + neonColor + ')'
                            }}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LiveChart;
