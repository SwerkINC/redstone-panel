import { useQuery } from '@tanstack/react-query';

import { ServerCard } from './components';
import { Error, Layout, Loader } from '@/components';

import { cn } from '@/lib';

import { serversService } from '@/services';

import { Link } from 'react-router-dom';

/**
 * Servers page
 */
export function Servers() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['servers'],
        queryFn: async () => {
            const response = await serversService.getAllServers();
            return response.data;
        },
        refetchInterval: 5000,
    });

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <Error code="500" message="Erreur lors du chargement des serveurs" />;
    }

    return (
        <Layout title="Vos serveurs">
            <div className="mx-auto w-full max-w-7xl">
                <div
                    className={cn(
                        data && data.length > 0
                            ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
                            : 'flex flex-col items-center justify-center'
                    )}
                >
                    {data && data.length > 0 ? (
                        data.map((server) => <ServerCard key={server.id} server={server} />)
                    ) : (
                        <div className="flex flex-row items-center justify-center gap-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                Aucun serveur en cours d'exécution avec des connexions actives
                            </p>
                            <Link to="/offers" className="text-blue-500 hover:text-blue-600">
                                Créer un serveur
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
