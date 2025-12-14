import { useUserStore } from '@/store';

/**
 * Admin page
 */
export function Admin() {
    const { user } = useUserStore();

    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
            <h1>Admin {user.email}</h1>
        </div>
    );
}
