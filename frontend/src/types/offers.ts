export enum OfferBillingCycle {
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY',
}

export enum OfferType {
    FREE = 'FREE',
    NOOB = 'NOOB',
    MECHANIC = 'MECHANIC',
    PRO = 'PRO',
    CUSTOM = 'CUSTOM',
}

export interface Offer {
    id: string;
    name: string;
    description: string;
    price: number;
    memoryLimit: number;
    cpuLimit: number;
    storageLimit: number;
    type: OfferType;
    billingCycle: OfferBillingCycle;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;

    // Extended
    mostPopular: boolean;
}
