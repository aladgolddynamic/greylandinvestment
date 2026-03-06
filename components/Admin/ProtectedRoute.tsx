'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

/**
 * ProtectedRoute component secures admin routes.
 * It checks for authentication and redirects to login if not authenticated.
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Only redirect if not loading and not authenticated
        // and we're not already on the login page
        if (!isLoading && !isAuthenticated && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [isAuthenticated, isLoading, router, pathname]);

    // Show loading state while checking authentication
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

    // Only render children if authenticated or on the login page
    if (isAuthenticated || pathname === '/admin/login') {
        return <>{children}</>;
    }

    // Default return null while redirecting
    return null;
}
