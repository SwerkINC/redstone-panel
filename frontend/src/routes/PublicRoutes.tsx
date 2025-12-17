import Login from '@/pages/Login';

import { Route } from 'react-router-dom';

/**
 * Public routes
 */
export default function PublicRoutes() {
    return [
        <Route key="login" path="/login" element={<Login />} />,
        <Route key="public" path="/" element={<Login />} />,
    ];
}
