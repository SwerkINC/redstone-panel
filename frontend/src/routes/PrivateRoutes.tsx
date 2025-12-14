import { Route } from 'react-router-dom';

/**
 * Private routes
 */
export default function PrivateRoutes() {
    return [<Route key="private" path="/" element={<div>Private</div>} />];
}
