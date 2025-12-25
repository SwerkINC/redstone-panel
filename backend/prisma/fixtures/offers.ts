import { Offer, OfferBillingCycle, OfferType } from '@/config/prisma/client';

export const offers: Pick<
    Offer,
    | 'name'
    | 'description'
    | 'price'
    | 'memoryLimit'
    | 'cpuLimit'
    | 'storageLimit'
    | 'type'
    | 'billingCycle'
>[] = [
    {
        name: 'Free',
        description: 'Free offer',
        price: 0,
        memoryLimit: 1024,
        cpuLimit: 1,
        storageLimit: 1024,
        type: OfferType.FREE,
        billingCycle: OfferBillingCycle.MONTHLY,
    },
    {
        name: 'Noob',
        description: 'Noob offer',
        price: 10,
        memoryLimit: 2048,
        cpuLimit: 2,
        storageLimit: 2048,
        type: OfferType.NOOB,
        billingCycle: OfferBillingCycle.MONTHLY,
    },
];
