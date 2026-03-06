/**
 * User Role and Status Types
 */
export type UserRole = 'SUPER_ADMIN' | 'EDITOR' | 'MODERATOR';
export type UserStatus = 'ACTIVE' | 'DISABLED';

/**
 * Admin User Interface
 */
export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

/**
 * Authentication Response Interface
 */
export interface AuthResponse {
    token: string;
    user: AdminUser;
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
