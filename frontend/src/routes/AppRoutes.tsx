import { useUserStore } from '@/store';

import { Routes } from 'react-router-dom';

import AdminRoutes from './AdminRoutes';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';

/**
 * App routes
 */
export default function AppRoutes() {
    const { user } = useUserStore();
    return (
        <Routes>
            {user
                ? user.groups.find((group) => group.name === 'Admin')
                    ? AdminRoutes()
                    : PrivateRoutes()
                : PublicRoutes()}
        </Routes>
    );
}
