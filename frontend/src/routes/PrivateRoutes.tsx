import { Servers } from '@/pages/Servers';

import { Route } from 'react-router-dom';

/**
 * Private routes
 */
export default function PrivateRoutes() {
    return [
        <Route key="servers" path="/servers" element={<Servers />} />,
        <Route key="private" path="/" element={<div>Private</div>} />,
    ];
}
