import Landing from '@/pages/landing'
import Login from '@/pages/login'
import Offers from '@/pages/offers'
import Register from '@/pages/register'

import { Route, Routes } from 'react-router-dom'

export const PublicRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<Landing />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/offers" element={<Offers />} />
		</Routes>
	)
}
