'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}
