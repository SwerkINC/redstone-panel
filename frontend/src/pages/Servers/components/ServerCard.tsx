import type { Server } from '@/types';

import { Card } from '@/components';

/**
 * Server card component props
 */
interface ServerCardProps {
    server: Server;
}

/**
 * Server card component
 */
export default function ServerCard({ server }: ServerCardProps) {
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
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Id:</span>
                    <span className="text-gray-900 dark:text-white">{server.id}</span>
                </div>
            </div>
        </Card>
    );
}
