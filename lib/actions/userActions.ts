'use server';

import { userService } from '@/services/userService';
import { CreateUserPayload, DashboardUser } from '@/types/user';
import { revalidatePath } from 'next/cache';

export async function getUsersAction() {
    return await userService.getUsers();
}

export async function createUserAction(payload: CreateUserPayload) {
    const user = await userService.createUser(payload);
    revalidatePath('/admin/dashboard/users');
    return user;
}

export async function verifyCredentialsAction(identifier: string, password: string) {
    return await userService.verifyCredentials(identifier, password);
}

export async function updateUserAction(id: string, data: any) {
    const user = await userService.updateUser(id, data);
    revalidatePath('/admin/dashboard/users');
    return user;
}

export async function deleteUserAction(id: string) {
    await userService.deleteUser(id);
    revalidatePath('/admin/dashboard/users');
}

export async function toggleUserStatusAction(id: string) {
    const user = await userService.toggleUserStatus(id);
    revalidatePath('/admin/dashboard/users');
    return user;
}

export async function changePasswordAction(id: string, newPassword: string) {
    await userService.changePassword(id, newPassword);
}
