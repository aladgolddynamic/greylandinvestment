import {
    verifyCredentialsAction,
    updateUserAction,
    changePasswordAction
} from '@/lib/actions/userActions';
import { AdminUser, AuthResponse } from '@/types/user';


/**
 * AuthService provides an abstraction layer for authentication operations.
 * Currently uses mock data integrated with UserService.
 */
class AuthService {
    /**
     * Authenticate user with email and password
     */
    async login(identifier: string, password: string): Promise<AuthResponse> {
        // Use verifyCredentialsAction (Server Action) to verify credentials
        const user = await verifyCredentialsAction(identifier, password);

        if (user) {
            return {
                token: 'mock-jwt-token-greyland-' + Math.random().toString(36).substr(2),
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role as any
                }
            };
        }

        throw new Error('Invalid email or password. Please check your credentials.');
    }

    /**
     * Persist token to localStorage
     */
    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('admin_token', token);
        }
    }

    /**
     * Retrieve token from localStorage
     */
    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('admin_token');
        }
        return null;
    }

    /**
     * Remove token from localStorage (Logout)
     */
    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
        }
    }

    /**
     * Persist user data to localStorage
     */
    setUser(user: AdminUser): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('admin_user', JSON.stringify(user));
        }
    }

    /**
     * Retrieve user data from localStorage
     */
    getUser(): AdminUser | null {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('admin_user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    }

    /**
     * Update user profile (Sync with UserService)
     */
    async updateProfile(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
        await updateUserAction(id, data as any);
        const currentUser = this.getUser();
        if (currentUser && currentUser.id === id) {
            const updatedUser = { ...currentUser, ...data };
            this.setUser(updatedUser);
            return updatedUser;
        }
        throw new Error('User not found.');
    }

    /**
     * Update user password (Sync with UserService)
     */
    async updatePassword(oldPass: string, newPass: string): Promise<void> {
        const currentUser = this.getUser();
        if (!currentUser) throw new Error('Not authenticated.');

        // Verify old password first using server action
        try {
            await verifyCredentialsAction(currentUser.email, oldPass);
            // If verification succeeds, update to new password
            await changePasswordAction(currentUser.id, newPass);
        } catch (err: any) {
            throw new Error('Verification failed. Invalid existing credentials.');
        }
    }
}

export const authService = new AuthService();
