import { useGetServersQuery } from '@/api/servers'
import { Input } from '@/components'

import { useState } from 'react'

import Card from './card'

export default function Servers() {
	const [searchParams, setSearchParams] = useState<string>('')
	const [limit, setLimit] = useState<number>(10)
	const [page, setPage] = useState<number>(1)

	const {
		data: servers,
		isLoading,
		error,
	} = useGetServersQuery({
		limit,
		page,
		search: searchParams,
	})

	return (
		<div className="flex flex-col gap-4">
			<h1>Servers</h1>
			<Input
				placeholder="Search"
				value={searchParams}
				onChange={e => setSearchParams(e.target.value)}
			/>
			<Input
				placeholder="Limit"
				value={limit}
				onChange={e => setLimit(Number(e.target.value))}
				type="number"
			/>
			<Input
				placeholder="Page"
				value={page}
				onChange={e => setPage(Number(e.target.value))}
				type="number"
			/>
			{servers?.map(server => (
				<Card key={server.id} {...server} />
			))}
			{isLoading && <div>Loading...</div>}
			{error && <div>Error: {error.message}</div>}
		</div>
	)
}
