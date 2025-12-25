import { Sidebar } from '@/components';

import { useCurrentUser } from '@/hooks';

import Login from '@/pages/Login';

import AppRoutes from './routes/AppRoutes';

import { useThemeStore, useUserStore } from '@/store';

import { useEffect } from 'react';

function App() {
    const { user, setUser } = useUserStore();
    const { data: currentUser, isLoading } = useCurrentUser();

    const { initTheme } = useThemeStore();

    // Initialize theme on mount
    useEffect(() => {
        initTheme();
    }, [initTheme]);

    // Auto login
    useEffect(() => {
        if (currentUser && currentUser.data) {
            setUser(currentUser.data);
        }
    }, [currentUser, setUser]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="size-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <AppRoutes />
            </main>
        </div>
    );
}

export default App;
