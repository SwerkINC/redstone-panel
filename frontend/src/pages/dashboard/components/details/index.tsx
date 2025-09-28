import { useGetServerQuery } from '@/api/servers'

import { useParams } from 'react-router-dom'

export default function Details() {
	const { id } = useParams()

	const { data: server, isLoading, error } = useGetServerQuery(id || '')

	return (
		<div>
			<h1>Details</h1>
			{isLoading && <div>Loading...</div>}
			{error && <div>Error: {error.message}</div>}
			{server && server.serverName}
		</div>
	)
}
