import { USERS } from './mock/users';

export const resolveUserRole = (username, requestedRole = 'VIEWER') => {
    // 1. If no users exist yet, return 'ADMIN' for the first initialization
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

    // 3. For new users (Self-Registration), respect the requested role from the UI
    //    Lowercase the input to handle 'admin' vs 'ADMIN' etc.
    const roleMap = {
        'admin': 'ADMIN',
        'technician': 'TECHNICIAN',
        'viewer': 'VIEWER'
    };

    return roleMap[requestedRole.toLowerCase()] || 'VIEWER';
};
