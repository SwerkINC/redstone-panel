import { type QueryParams } from '@/api/axios'
import { type UseQueryOptions, useQuery } from '@tanstack/react-query'

import { type Server, serversApi } from './'

export const useGetServersQuery = (
	queryParams?: QueryParams,
	options?: UseQueryOptions<Server[], Error>,
) => {
	return useQuery<Server[], Error>({
		queryKey: ['servers'],
		queryFn: async () => {
			return await serversApi.getServers(queryParams)
		},
		...options,
	})
}

export const useGetServerQuery = (
	id: string,
	options?: UseQueryOptions<Server, Error>,
) => {
	return useQuery<Server, Error>({
		queryKey: ['server', id],
		queryFn: async () => {
			return await serversApi.getServer(id)
		},
		enabled: !!id,
		...options,
	})
}
