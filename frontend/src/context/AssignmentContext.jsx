import React, { createContext, useContext, useState } from 'react';
import { MACHINE_ASSIGNMENTS } from '../services/mock/machineAssignments';

const AssignmentContext = createContext();

export const useAssignments = () => {
    const context = useContext(AssignmentContext);
    if (!context) {
        throw new Error('useAssignments must be used within AssignmentProvider');
    }
    return context;
};

export const AssignmentProvider = ({ children }) => {
    const [assignments, setAssignments] = useState(MACHINE_ASSIGNMENTS);

    const updateAssignments = (username, machineList) => {
        const updated = { ...assignments, [username]: machineList };
        setAssignments(updated);
        // Also update the in-memory object for consistency
        MACHINE_ASSIGNMENTS[username] = machineList;
    };

    return (
        <AssignmentContext.Provider value={{ assignments, updateAssignments }}>
            {children}
        </AssignmentContext.Provider>
    );
};
