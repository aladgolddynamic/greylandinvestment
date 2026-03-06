import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DashboardUser, CreateUserPayload, UserRole, UserStatus } from '@/types/user';

/**
 * UserService — handles user management operations using Prisma.
 */
class UserService {
    private mapToDashboardUser(user: User): DashboardUser {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role as UserRole,
            status: user.status as UserStatus,
            profileImage: user.profileImage || undefined,
            lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
            dateCreated: user.dateCreated.toISOString()
        };
    }

    async getUsers(): Promise<DashboardUser[]> {
        const users = await prisma.user.findMany({
            orderBy: { dateCreated: 'desc' }
        });
        return users.map(this.mapToDashboardUser);
    }

    async createUser(payload: CreateUserPayload): Promise<DashboardUser> {
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        const user = await prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                username: payload.username,
                role: payload.role,
                password: hashedPassword,
                profileImage: payload.profileImage,
                status: 'ACTIVE'
            }
        });
        return this.mapToDashboardUser(user);
    }

    async verifyCredentials(identifier: string, password: string): Promise<DashboardUser> {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier.toLowerCase() },
                    { username: identifier }
                ]
            }
        });

        if (user && user.status === 'ACTIVE') {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                // Update last login
                const updated = await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLogin: new Date() }
                });
                return this.mapToDashboardUser(updated);
            }
        }

        throw new Error('Invalid email or password.');
    }

    async updateUser(id: string, data: Partial<Omit<DashboardUser, 'id' | 'dateCreated'>>): Promise<DashboardUser> {
        const updateData: any = { ...data };
        if (data.lastLogin) updateData.lastLogin = new Date(data.lastLogin);

        const user = await prisma.user.update({
            where: { id },
            data: updateData
        });
        return this.mapToDashboardUser(user);
    }

    async deleteUser(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id }
        });
    }

    async changeUserRole(id: string, role: UserRole): Promise<DashboardUser> {
        return this.updateUser(id, { role });
    }

    async toggleUserStatus(id: string): Promise<DashboardUser> {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) throw new Error('User not found.');
        return this.updateUser(id, { status: user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' });
    }

    async changePassword(id: string, newPassword: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });
    }

    async resetPassword(id: string): Promise<void> {
        // Keeping for legacy compatibility
    }
}

export const userService = new UserService();
