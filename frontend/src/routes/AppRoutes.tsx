import { Admin } from '@/pages/Admin';
import { Dashboard } from '@/pages/Dashboard';
import { Offers } from '@/pages/Offers';
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
                </>
            )}

            {/* Private routes */}
            {user && (
                <>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/servers" element={<Servers />} />
                    <Route path="/offers" element={<Offers />} />
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
