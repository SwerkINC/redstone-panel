import type { Server } from '@/types';

import { useQuery } from '@tanstack/react-query';

import { Card } from '@/components';

import { serversService } from '@/services';

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
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
                <div className="text-center">
                    <div className="mb-4 text-lg text-gray-600 dark:text-gray-400">
                        Chargement des serveurs...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
                <div className="text-center">
                    <div className="mb-4 text-lg text-red-600 dark:text-red-400">
                        Erreur lors du chargement des serveurs
                    </div>
                </div>
            </div>
        );
    }

    if (data?.length === 0) {
        return (
            <div className="flex min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
                <div className="mx-auto w-full max-w-7xl">
                    <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                        Serveurs Minecraft
                    </h1>
                    <Card>
                        <div className="text-center text-gray-600 dark:text-gray-400">
                            Aucun serveur en cours d'exécution avec des connexions actives
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
            <div className="mx-auto w-full max-w-7xl">
                <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                    Serveurs Minecraft Connectés
                </h1>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {data?.map((server) => (
                        <ServerCard key={server.id} server={server} />
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Server card component
 */
interface ServerCardProps {
    server: Server;
}

function ServerCard({ server }: ServerCardProps) {
    const header = (
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{server.name}</h2>
            <span className="flex items-center gap-2">
                <span
                    className={`size-3 rounded-full ${
                        server.isRunning ? 'bg-green-500' : 'bg-red-500'
                    }`}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {server.isRunning ? 'En ligne' : 'Hors ligne'}
                </span>
            </span>
        </div>
    );

    const footer =
        server.connections.length > 0 ? (
            <div className="w-full">
                <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Joueurs connectés:
                </h3>
                <div className="flex flex-wrap gap-2">
                    {server.connections.map((connection) => (
                        <span
                            key={connection.id}
                            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                            {connection.username}
                        </span>
                    ))}
                </div>
            </div>
        ) : undefined;

    return (
        <Card
            variant="shadow"
            hoverable
            className="dark:bg-gray-800"
            header={header}
            footer={footer}
        >
            {server.description && (
                <p className="mb-4 text-gray-600 dark:text-gray-400">{server.description}</p>
            )}
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Adresse:</span>
                    <span className="font-mono text-gray-900 dark:text-white">
                        {server.ip}:{server.port}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Version:</span>
                    <span className="text-gray-900 dark:text-white">{server.version}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Joueurs connectés:</span>
                </div>
            </div>
        </Card>
    );
}
