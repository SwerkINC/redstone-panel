import { useUser } from '@/store/authStore'

import { Navigate } from 'react-router-dom'
import { useState } from 'react'
import { Servers } from './components'

export default function MainDashboard() {
	const [selectedTab, setSelectedTab] = useState<'servers' | 'settings'>('servers')

	const user = useUser()

	if (!user) {
		return <Navigate to="/login" replace />
	}

	return (
		<div className="flex flex-col h-screen gap-4">
			<h1 className="uppercase">
				Bienvenue, <span className="font-bold">{user?.username}</span>.
			</h1>
			<hr />
			<div className="flex flex-row gap-4">
				<button onClick={() => setSelectedTab('servers')} className="bg-blue-500 text-white px-4 py-2 rounded-md">
					Servers
				</button>
			</div>
			{selectedTab === 'servers' && (
				<Servers />
			)}
		</div>
	)
}
