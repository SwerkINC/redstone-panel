import { Admin } from '@/pages/Admin';
import { Dashboard } from '@/pages/Dashboard';
import { Servers } from '@/pages/Servers';
import { Settings } from '@/pages/Settings';

import { useUserStore } from '@/store';

import { Navigate, Route, Routes } from 'react-router-dom';

/**
 * App routes
 */
export default function AppRoutes() {
    const { user } = useUserStore();
    const isAdmin = user?.groups.find((group) => group.name === 'Admin');

    return (
        <Routes>
            {/* Admin routes */}
            {user && isAdmin && (
                <>
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/servers" element={<Servers />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/" element={<Dashboard />} />
                </>
            )}

            {/* Private routes */}
            {user && !isAdmin && (
                <>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/servers" element={<Servers />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/" element={<Dashboard />} />
                </>
            )}

            {/* Catch all - redirect to appropriate page */}
            <Route
                path="*"
                element={
                    user ? (
                        isAdmin ? (
                            <Navigate to="/admin" replace />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
        </Routes>
    );
}
