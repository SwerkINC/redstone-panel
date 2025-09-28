import { type Offer } from '@/api/offers'

// ENUMS
export enum SubscriptionStatus {
	ACTIVE = 'ACTIVE',
	EXPIRED = 'EXPIRED',
	SUSPENDED = 'SUSPENDED',
	CANCELLED = 'CANCELLED',
}

// ENTITIES

export interface User {
	id: string
	email: string
	username: string
	subscriptions: UserSubscription[]
	createdAt?: string
	updatedAt?: string
}

export interface UserSubscription {
	id: number
	userId: number
	offerId: number
	status: SubscriptionStatus
	offer: Offer
	subscribedAt: string
	expiresAt?: string
	createdAt: string
	updatedAt: string
}

// INTERFACES

export interface LoginForm {
	email: string
	password: string
}

export interface RegisterForm {
	email: string
	password: string
	username: string
}

export interface Tokens {
	accessToken: string
	refreshToken: string
}

export interface AuthResponse {
	user: User
	tokens: Tokens
	message?: string
}
