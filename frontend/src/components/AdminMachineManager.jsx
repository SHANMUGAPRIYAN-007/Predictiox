import React, { useState, useEffect } from 'react';
import { USERS } from '../services/mock/users';
import { MACHINES } from '../services/mock/machines';
import { MACHINE_ASSIGNMENTS } from '../services/mock/machineAssignments';
import { User, Settings, Check, Plus, Trash2, Save, Undo } from 'lucide-react';
import { useAssignments } from '../context/AssignmentContext';

const AdminMachineManager = () => {
    const [selectedTech, setSelectedTech] = useState(null);
    const { assignments, updateAssignments } = useAssignments();
    const [pendingAssignments, setPendingAssignments] = useState([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false); // Success indicator state

    // Filter only technicians
    const technicians = USERS.filter(u => u.role === 'TECHNICIAN');

    // Sync pending assignments when tech is selected
    useEffect(() => {
        if (selectedTech) {
            setPendingAssignments([...(assignments[selectedTech.username] || [])]);
            setHasUnsavedChanges(false);
        } else {
            setPendingAssignments([]);
        }
    }, [selectedTech, assignments]);

    const handleAssign = (machineName) => {
        if (!selectedTech) return;

        if (!pendingAssignments.includes(machineName)) {
            const updated = [...pendingAssignments, machineName];
            setPendingAssignments(updated);
            setHasUnsavedChanges(true);
        }
    };

    const handleUnassign = (machineName) => {
        if (!selectedTech) return;

        const updated = pendingAssignments.filter(m => m !== machineName);
        setPendingAssignments(updated);
        setHasUnsavedChanges(true);
    };

    const handleSaveChanges = () => {
        if (!selectedTech) return;
        const username = selectedTech.username;

        // Update via context (which also updates MACHINE_ASSIGNMENTS locally)
        updateAssignments(username, [...pendingAssignments]);

        setHasUnsavedChanges(false);

        // Show success indicator briefly
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const handleDiscardChanges = () => {
        if (!selectedTech) return;
        setPendingAssignments([...(assignments[selectedTech.username] || [])]);
        setHasUnsavedChanges(false);
    };

    return (
        <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={20} color="var(--primary-neon)" />
                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>User Management</h2>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Technicians List */}
                <div style={{ flex: '1', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                        REGISTERED TECHNICIANS
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                        {technicians.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No technicians found.</div>
                        ) : (
                            technicians.map(tech => (
                                <div
                                    key={tech.username}
                                    onClick={() => !hasUnsavedChanges && setSelectedTech(tech)}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        marginBottom: '8px',
                                        cursor: hasUnsavedChanges ? 'not-allowed' : 'pointer',
                                        background: selectedTech?.username === tech.username ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                                        border: selectedTech?.username === tech.username ? '1px solid var(--primary-neon)' : '1px solid transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        transition: 'all 0.2s',
                                        opacity: hasUnsavedChanges && selectedTech?.username !== tech.username ? 0.5 : 1
                                    }}
                                >
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={16} color="var(--text-primary)" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{tech.username}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            {(assignments[tech.username] || []).length} Machines Assigned
                                        </div>
                                    </div>
                                    {selectedTech?.username === tech.username && <Check size={16} color="var(--primary-neon)" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Assignment Panel */}
                <div style={{ flex: '2', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.1)' }}>
                    {selectedTech ? (
                        <>
                            <div style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>ASSIGN MACHINES TO: <span style={{ color: 'var(--primary-neon)' }}>{selectedTech.username.toUpperCase()}</span></span>

                                {showSuccess && (
                                    <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Check size={14} /> Saved!
                                    </div>
                                )}

                                {hasUnsavedChanges && (
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button
                                            onClick={handleDiscardChanges}
                                            style={{ background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem' }}
                                        >
                                            <Undo size={12} /> Discard
                                        </button>
                                        <button
                                            onClick={handleSaveChanges}
                                            style={{ background: 'var(--success)', border: 'none', color: '#000', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 'bold' }}
                                        >
                                            <Save size={12} /> Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                                <div style={{ marginBottom: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Available Machines {hasUnsavedChanges && '(Changes Pending Save)'}</span>
                                    {hasUnsavedChanges && (
                                        <div
                                            onClick={handleSaveChanges}
                                            title="Click to confirm and assign selected machines to this technician."
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 'bold' }}
                                        >
                                            <Check size={14} /> Confirm Assignment
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                                    {MACHINES.map(machine => {
                                        const isAssigned = pendingAssignments.includes(machine.name);
                                        return (
                                            <div
                                                key={machine.id}
                                                onClick={() => isAssigned ? handleUnassign(machine.name) : handleAssign(machine.name)}
                                                style={{
                                                    padding: '12px',
                                                    borderRadius: '6px',
                                                    background: isAssigned ? 'rgba(0, 243, 255, 0.15)' : 'var(--bg-panel)',
                                                    border: isAssigned ? '1px solid var(--primary-neon)' : '1px solid var(--glass-border)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    fontSize: '0.85rem',
                                                    opacity: isAssigned ? 1 : 0.7,
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <span>{machine.name}</span>
                                                {isAssigned ? <Check size={14} color="var(--primary-neon)" /> : <Plus size={14} style={{ opacity: 0.5 }} />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', opacity: 0.6 }}>
                            <Settings size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                            <p>Select a technician to manage assignments</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminMachineManager;
