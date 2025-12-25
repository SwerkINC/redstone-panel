import { Layout } from '@/components';

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
        <Layout title="Paramètres">
            <p className="text-gray-600 dark:text-gray-400">
                Page de paramètres en cours de développement.
            </p>
        </Layout>
    );
}
