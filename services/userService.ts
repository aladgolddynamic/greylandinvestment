import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { DashboardUser, CreateUserPayload, UserRole, UserStatus } from '@/types/user';

/**
 * UserService — handles user management operations using Prisma.
 */
class UserService {
    private mapToDashboardUser(user: any): DashboardUser {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role as UserRole,
            status: user.status as UserStatus,
            profileImage: user.profileImage || undefined,
            lastLogin: user.lastLogin ? new Date(user.lastLogin).toISOString() : null,
            dateCreated: new Date(user.dateCreated).toISOString()
        };
    }

    async getUsers(): Promise<DashboardUser[]> {
        const { data, error } = await supabaseAdmin
            .from('User')
            .select('*')
            .order('dateCreated', { ascending: false });
        if (error) throw error;
        return (data || []).map(this.mapToDashboardUser);
    }

    async createUser(payload: CreateUserPayload): Promise<DashboardUser> {
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        const { data, error } = await supabaseAdmin
            .from('User')
            .insert([
                {
                    id: randomUUID(),
                    name: payload.name,
                    email: payload.email,
                    username: payload.username,
                    role: payload.role,
                    password: hashedPassword,
                    profileImage: payload.profileImage,
                    status: 'ACTIVE',
                    dateCreated: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ])
            .select()
            .single();
        if (error) throw error;
        return this.mapToDashboardUser(data);
    }

    async verifyCredentials(identifier: string, password: string): Promise<DashboardUser> {
        const { data: users, error } = await supabaseAdmin
            .from('User')
            .select('*')
            .or(`email.eq.${identifier.toLowerCase()},username.eq.${identifier}`)
            .limit(1);
        if (error) throw error;
        const user = users && users[0];
        if (user && user.status === 'ACTIVE') {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                // Update last login
                const { data: updated, error: updateError } = await supabaseAdmin
                    .from('User')
                    .update({ lastLogin: new Date().toISOString() })
                    .eq('id', user.id)
                    .select()
                    .single();
                if (updateError) throw updateError;
                return this.mapToDashboardUser(updated);
            }
        }
        throw new Error('Invalid email or password.');
    }

    async updateUser(id: string, data: Partial<Omit<DashboardUser, 'id' | 'dateCreated'>>): Promise<DashboardUser> {
        const updateData: any = { ...data };
        if (data.lastLogin) updateData.lastLogin = new Date(data.lastLogin).toISOString();
        const { data: updated, error } = await supabaseAdmin
            .from('User')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return this.mapToDashboardUser(updated);
    }

    async deleteUser(id: string): Promise<void> {
        const { error } = await supabaseAdmin
            .from('User')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }

    async changeUserRole(id: string, role: UserRole): Promise<DashboardUser> {
        return this.updateUser(id, { role });
    }

    async toggleUserStatus(id: string): Promise<DashboardUser> {
        const { data: user, error } = await supabaseAdmin
            .from('User')
            .select('status')
            .eq('id', id)
            .single();
        if (error || !user) throw new Error('User not found.');
        return this.updateUser(id, { status: user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' });
    }

    async changePassword(id: string, newPassword: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const { error } = await supabaseAdmin
            .from('User')
            .update({ password: hashedPassword })
            .eq('id', id);
        if (error) throw error;
    }

    async resetPassword(id: string): Promise<void> {
        // Keeping for legacy compatibility
    }
}

export const userService = new UserService();
