export enum ServerType {
    FORGE = 'FORGE',
    PAPER = 'PAPER',
    VANILLA = 'VANILLA',
    FABRIC = 'FABRIC',
}

export enum ServerConnectionStatus {
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED',
}

/** Server connection */
export interface ServerConnection {
    id: string;
    serverId: string;
    username: string;
    status: ServerConnectionStatus;
    createdAt: string;
    updatedAt: string;
}

/** Server */
export interface Server {
    id: string;
    name: string;
    description: string | null;
    ip: string;
    port: number;
    type: ServerType;
    domain: string | null;
    version: string;
    dataPath: string;
    memoryLimit: number;
    cpuLimit: number;
    storageLimit: number;
    isRunning: boolean;
    connections: ServerConnection[];
    createdAt: string;
    updatedAt: string;
}
