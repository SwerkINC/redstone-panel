import axios, { type QueryParams } from '@/api/axios'
import Cookies from 'js-cookie'

import type { Server } from './types'

class ServersApi {
	async getServers(queryParams?: QueryParams): Promise<Server[]> {
		const response = await axios.get('/servers', {
			params: queryParams,
			headers: {
				'Content-Type': 'application/json',

				Authorization: `Bearer ${Cookies.get('accessToken')}`,
			},
		})
		return response.data
	}

	async getServer(id: string): Promise<Server> {
		const response = await axios.get(`/servers/${id}`, {
			headers: {
				'Content-Type': 'application/json',

				Authorization: `Bearer ${Cookies.get('accessToken')}`,
			},
		})
		return response.data
	}
}

export const serversApi = new ServersApi()
