import { createClient } from '@/lib/supabase/client';

/**
 * AuthService — thin wrapper around Supabase Auth for any
 * imperative auth operations needed outside of context (e.g., settings page).
 */
class AuthService {
    private get supabase() {
        return createClient();
    }

    /**
     * Update the currently signed-in user's email
     */
    async updateEmail(newEmail: string): Promise<void> {
        const { error } = await this.supabase.auth.updateUser({ email: newEmail });
        if (error) throw new Error(error.message);
    }

    /**
     * Update the currently signed-in user's password
     * Supabase handles re-auth internally; the user must already be logged in.
     */
    async updatePassword(newPassword: string): Promise<void> {
        const { error } = await this.supabase.auth.updateUser({ password: newPassword });
        if (error) throw new Error(error.message);
    }

    /**
     * Re-authenticate (verify) current credentials before sensitive changes.
     * Uses signInWithPassword against the current email.
     */
    async verifyCurrentPassword(email: string, password: string): Promise<void> {
        const { error } = await this.supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error('Invalid existing credentials. Please try again.');
    }

    /**
     * Sign out the current user
     */
    async signOut(): Promise<void> {
        await this.supabase.auth.signOut();
    }
}

export const authService = new AuthService();
