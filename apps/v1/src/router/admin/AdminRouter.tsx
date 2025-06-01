import { RouteObject } from 'react-router-dom';
import { ADMIN_ROUTE } from "@plug/v1/router/admin/AdminRoutes";
import Dashboard from "../../admin/pages/Dashboard/Dashboard";
import UserPage from "../../admin/pages/User/Management";
import AssetPage from "../../admin/pages/Asset/Management";
import LinePage from "../../admin/pages/Line/Management"
import DevicePage from '../../admin/pages/Device/Management';
import DeviceCategory from '../../admin/pages/Device/Category';
import Viewer from "../../admin/pages/Viewer/ViewerPage";
import AdminLayout from "../../admin/pages/AdminLayout";
import FacilitiesPage from "@plug/v1/admin/pages/facility/page/FacilitiesPage";
import FacilitiesDetailPage from "@plug/v1/admin/pages/facility/page/FacilitiesDetailPage";

export const AdminRouter: RouteObject[] = [
    {
        path: ADMIN_ROUTE.LAYOUT,
        element: <AdminLayout />,
        children: [
            { 
                path: ADMIN_ROUTE.DASHBOARD,
                element: <Dashboard />,
                children: [
                    { path: ADMIN_ROUTE.ASSET, element: <AssetPage /> },
                    { path: ADMIN_ROUTE.LINE, element: <LinePage /> },
                    { path: ADMIN_ROUTE.USER, element: <UserPage /> },
                    { path: ADMIN_ROUTE.FACILITIES, element: <FacilitiesPage/> },
                    { path: ADMIN_ROUTE.FACILITIES_DETAIL, element: <FacilitiesDetailPage/> },
                    { path: ADMIN_ROUTE.DEVICE, element: <DevicePage /> },
                    { path: ADMIN_ROUTE.DEVICE_CATEGORY, element: <DeviceCategory /> }
                ]
            },
            { path: ADMIN_ROUTE.VIEWER, element: <Viewer /> },
            { path: `${ADMIN_ROUTE.VIEWER}/:stationId`, element: <Viewer /> },
        ],
    }
];
