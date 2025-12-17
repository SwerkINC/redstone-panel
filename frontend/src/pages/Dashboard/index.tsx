import { useUserStore } from '@/store';

/**
 * Dashboard page
 */
export function Dashboard() {
    const { user } = useUserStore();

    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 p-8 dark:bg-gray-900">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
                Bienvenue, {user.name || user.email} !
            </p>
        </div>
    );
}
