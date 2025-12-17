import { useUserStore } from '@/store';

/**
 * Settings page
 */
export function Settings() {
    const { user } = useUserStore();

    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 p-8 dark:bg-gray-900">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
            <p className="text-gray-600 dark:text-gray-400">
                Page de paramètres en cours de développement.
            </p>
        </div>
    );
}
