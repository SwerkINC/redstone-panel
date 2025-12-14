import { Route } from 'react-router-dom';

/**
 * Public routes
 */
export default function PublicRoutes() {
    return [<Route key="public" path="/" element={<div>Public</div>} />];
}
