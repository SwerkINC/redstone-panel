import type { CreateServerSchemaType } from '@/schemas';
import type { ApiResponse, Server } from '@/types';

import api from './api';

/** Servers service */
export const serversService = {
    /**
     * Create a new server
     * @returns {Promise<ApiResponse<void>>} - Server created
     */
    async createServer(data: CreateServerSchemaType): Promise<ApiResponse<void>> {
        const response = await api.post('/servers/create', data);
        return response.data;
    },
    /**
     * Get all servers with their connections and running status
     * @returns {Promise<ApiResponse<Server[]>>} - Servers list
     */
    async getAllServers(): Promise<ApiResponse<Server[]>> {
        const response = await api.get('/servers');
        return response.data;
    },
};
