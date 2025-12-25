import type { ApiResponse, Offer } from '@/types';

import api from './api';

/** Offers service */
export const offersService = {
    /**
     * Get all offers
     * @returns {Promise<ApiResponse<Offer[]>>} - Offers list
     */
    async getAllOffers(): Promise<ApiResponse<Offer[]>> {
        const response = await api.get('/offers');
        return response.data;
    },
};
