/**
 * User Role and Status Types
 */
export type UserRole = 'SUPER_ADMIN' | 'EDITOR' | 'MODERATOR';
export type UserStatus = 'ACTIVE' | 'DISABLED';

/**
 * Admin User Interface — derived from Supabase User metadata
 */
export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

/**
 * Dashboard User Interface
 * Safe for client-side consumption.
 */
export interface DashboardUser {
    id: string;
    name: string;
    email: string;
    username: string;
    role: UserRole;
    status: UserStatus;
    profileImage?: string;
    lastLogin: string | null;
    dateCreated: string;
}

/**
 * CreateUserPayload — data required to create a new user
 */
export interface CreateUserPayload {
    name: string;
    email: string;
    username: string;
    role: UserRole;
    password: string;
    profileImage?: string;
}
