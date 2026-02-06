import { USERS } from './mock/users';

export const resolveUserRole = (username) => {
    // 1. If no users exist in the system (mock USERS is the source of truth for "pre-approved" users here 
    //    or "system initialization" check, but keeping strictly to requested logic:
    //    "If no users exist yet, return 'ADMIN'". 
    //    We check USERS length.
    if (!USERS || USERS.length === 0) {
        return 'ADMIN';
    }

    // 2. If user exists, return the stored role.
    const normalizedUsername = username.toLowerCase();
    const user = USERS.find(u => u.username.toLowerCase() === normalizedUsername);

    if (user) {
        // SILENT SYSTEM RULE: "Ensure the first ADMIN role assigned cannot be changed or downgraded."
        // If the user is flagged as a Super Admin, always return ADMIN, regardless of the stored role property.
        if (user.isSuperAdmin) {
            return 'ADMIN';
        }
        return user.role; // Returns ADMIN, TECHNICIAN, etc.
    }

    // Default fallback if user not found (e.g. self-registration of a Viewer)
    // The prompt implies "Store username in USERS if not exists", but we can't write to this file.
    // We will assume 'VIEWER' as safe default for unknown users if the flow continues, 
    // OR return null to let the caller decide (but prompt says "Assign role using resolveUserRole").
    // We'll return 'VIEWER' to be safe, or 'TECHNICIAN' if we want to be generous? 
    // "Ignore role selection from UI" -> implies we decide. 
    // Let's default to VIEWER.
    return 'VIEWER';
};
