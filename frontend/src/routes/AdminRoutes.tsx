import { Admin } from '@/pages/Admin';

import { Route } from 'react-router-dom';

/**
 * Admin routes
 */
export default function AdminRoutes() {
    return [<Route key="admin" path="/admin" element={<Admin />} />];
}
