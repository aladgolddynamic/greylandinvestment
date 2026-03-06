'use client';

import AdminLayout from '@/components/Admin/AdminLayout';
import ProtectedRoute from '@/components/Admin/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <AdminLayout>
                {children}
            </AdminLayout>
        </ProtectedRoute>
    );
}
