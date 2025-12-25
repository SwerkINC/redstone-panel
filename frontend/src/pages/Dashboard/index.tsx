import { Layout } from '@/components';

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
        <Layout title="Dashboard">
            <p className="text-gray-600 dark:text-gray-400">
                Bienvenue, {user.name || user.email} !
            </p>
        </Layout>
    );
}
