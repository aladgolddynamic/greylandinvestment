'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

/**
 * ProtectedRoute — client-side guard that mirrors the server middleware.
 * Redirects unauthenticated users to /admin/login.
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [isAuthenticated, isLoading, router, pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-orange/20 border-t-primary-orange rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black text-primary-dark uppercase tracking-widest opacity-40">Verifying Session...</span>
                </div>
            </div>
        );
    }

    if (isAuthenticated || pathname === '/admin/login') {
        return <>{children}</>;
    }

    return null;
}
