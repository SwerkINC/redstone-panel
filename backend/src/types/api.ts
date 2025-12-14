import { FastifyRequest, RouteGenericInterface } from 'fastify';

import { Prisma, PrismaClient } from '@/config/prisma/client';

export interface Basic {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export type UserWithGroups = Prisma.UserGetPayload<{ include: { groups: true } }>;

export interface AuthenticatedRequest<
    T extends RouteGenericInterface = RouteGenericInterface,
> extends FastifyRequest<T> {
    user: UserWithGroups;
}

export interface ApiResponse<T = unknown> {
    message: string;
    data: T;
    pagination?: PaginationMeta;
    status: number;
    timestamp: string;
    error?: string;
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    nextPage: number;
    previousPage: number;
    perPage: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}

export interface ErrorResponse {
    message: string;
    stack?: string;
    code?: string;
}

export type Transaction = Omit<
    PrismaClient,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
