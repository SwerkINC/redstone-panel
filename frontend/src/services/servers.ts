import type { ApiResponse, Server } from '@/types';

import api from './api';

/** Servers service */
export const serversService = {
    /**
     * Get all servers with their connections and running status
     * @returns {Promise<ApiResponse<Server[]>>} - Servers list
     */
    async getAllServers(): Promise<ApiResponse<Server[]>> {
        const response = await api.get('/servers');
        return response.data;
    },
};
