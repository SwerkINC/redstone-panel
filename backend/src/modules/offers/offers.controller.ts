import prisma from '@/config/prisma';

import { reqValidate } from '@/utils';

import { getAllOffersSchema } from './offers.schema';

export class OffersController {
    constructor() {}

    public getAllOffers = reqValidate(
        {
            query: getAllOffersSchema,
        },
        async (req, reply) => {
            const { page, limit, sort, order } = req.query;
            const offers = await prisma.offer.findMany({
                orderBy: {
                    [sort || 'price']: order || 'desc',
                },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    memoryLimit: true,
                    cpuLimit: true,
                    storageLimit: true,
                    type: true,
                    billingCycle: true,
                },
                where: {
                    deletedAt: null,
                },
            });

            const mostPopularOffers = await prisma.offer.findFirst({
                orderBy: {
                    servers: {
                        _count: 'desc',
                    },
                },
                select: {
                    id: true,
                },
            });

            return reply.success(
                offers.map((offer) => ({
                    ...offer,
                    mostPopular: mostPopularOffers?.id === offer.id,
                }))
            );
        }
    );
}

export const offersController = new OffersController();
