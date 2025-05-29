import { RouteObject } from 'react-router-dom';
import { ADMIN_ROUTE } from "@plug/v1/router/admin/AdminRoutes";
import Dashboard from "../../admin/pages/Dashboard/Dashboard";
import UserPage from "../../admin/pages/User/Management";
import AssetPage from "../../admin/pages/Asset/Management";
import LinePage from "../../admin/pages/Line/Management"
import Viewer from "../../admin/pages/Viewer/ViewerPage";
import AdminLayout from "../../admin/pages/AdminLayout";

export const AdminRouter: RouteObject[] = [
    {
        path: ADMIN_ROUTE.LAYOUT,
        element: <AdminLayout />,
        children: [
            { 
                path: ADMIN_ROUTE.DASHBOARD,
                element: <Dashboard />,
                children: [
                    { path: ADMIN_ROUTE.DASHBOARD, element: <Dashboard /> },
                    { path: ADMIN_ROUTE.ASSET, element: <AssetPage /> },
                    { path: ADMIN_ROUTE.LINE, element: <LinePage /> },
                    { path: ADMIN_ROUTE.USER, element: <UserPage /> },
                ]
            },
            { path: ADMIN_ROUTE.VIEWER, element: <Viewer /> }, 
        ],
    }
];
