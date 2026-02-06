import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MACHINE_ASSIGNMENTS } from '../services/mock/machineAssignments';

const MyAssignedMachines = () => {
    const { user } = useAuth();
    const username = user?.name || '';
    const assignedMachines = MACHINE_ASSIGNMENTS[username] || [];

    return (
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px' }}>
                My Assigned Machines
            </h3>
            {assignedMachines.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {assignedMachines.map((machine, index) => (
                        <li key={index} style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '10px',
                            borderRadius: '8px',
                            marginBottom: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-neon)' }}></span>
                            {machine}
                        </li>
                    ))}
                </ul>
            ) : (
                <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    border: '1px dotted var(--glass-border)',
                    fontStyle: 'italic',
                    fontSize: '0.9rem'
                }}>
                    No machines have been assigned to you yet.
                </div>
            )}
        </div>
    );
};

export default MyAssignedMachines;
