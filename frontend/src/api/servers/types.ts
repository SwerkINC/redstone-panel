import { type UserSubscription } from '@/api/auth'

// ENUMS
export enum ServerType {
	VANILLA = 'VANILLA',
	FORGE = 'FORGE',
	PAPER = 'PAPER',
	FABRIC = 'FABRIC',
	SPIGOT = 'SPIGOT',
	BUKKIT = 'BUKKIT',
}

export enum ServerStatus {
	CREATING = 'CREATING',
	RUNNING = 'RUNNING',
	STOPPED = 'STOPPED',
	STOPPING = 'STOPPING',
	STARTING = 'STARTING',
	ERROR = 'ERROR',
	DELETED = 'DELETED',
}

// ENTITIES

export interface Server {
	id: number
	userId: number
	subscriptionId: number
	serverId: string
	serverName: string
	serverType: ServerType
	status: ServerStatus
	podName?: string
	ipAddress?: string
	port: number
	kubernetesNamespace: string
	serverProperties?: Record<string, string>
	subscription: UserSubscription
	createdAt: Date
	updatedAt: Date
	lastStarted?: Date
	lastStopped?: Date
}
