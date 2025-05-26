import { RouteObject } from 'react-router-dom';
import { ADMIN_ROUTE } from "@plug/v1/router/admin/AdminRoutes";
import Dashboard from "../../admin/pages/Dashboard/Dashboard";
import UserPage from "../../admin/pages/User/Management";
import AssetPage from "../../admin/pages/Asset/Management";
import LinePage from "../../admin/pages/Line/Management"
import Viewer from "../../admin/pages/Viewer/ViewerPage";
import Poi from "../../admin/pages/Viewer/Poi";
import Text3d from '../../admin/pages/Viewer/Text3d';
import Topology from '../../admin/pages/Viewer/Topology';

export const AdminRouter: RouteObject[] = [
    {
        path: '/admin',
        element: <Dashboard />,
        children: [
            { path: ADMIN_ROUTE.DASHBOARD, element: <Dashboard /> },
            { path: ADMIN_ROUTE.ASSET, element: <AssetPage /> },
            { path: ADMIN_ROUTE.LINE, element: <LinePage /> },
            { path: ADMIN_ROUTE.USER, element: <UserPage /> },
        ],
    },
    {
        path: '/admin/viewer',
        element: <Viewer />,
        children: [
            { path: ADMIN_ROUTE.POI, element: <Poi /> },
            { path: ADMIN_ROUTE.TEXT3D, element: <Text3d /> },
            { path: ADMIN_ROUTE.TOPOLOGY, element: <Topology /> },
        ],
    },
];
