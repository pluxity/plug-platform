import { RouteObject } from 'react-router-dom';
import { ADMIN_ROUTE } from "@plug/v1/router/admin/AdminRoutes";
import Dashboard from "../../admin/pages/Dashboard/Dashboard";
import UserList from "../../admin/pages/User/UserList";
import PoiList from "../../admin/pages/Poi/PoiList";
import PoiIcon from "../../admin/pages/Poi/PoiIcon";
import Viewer from "../../admin/pages/Viewer/Viewer";
import Poi from "../../admin/pages/Viewer/Poi";
import Text3d from '../../admin/pages/Viewer/Text3d';
import Topology from '../../admin/pages/Viewer/Topology';

export const AdminRouter: RouteObject[] = [
    {
        path: '/admin',
        element: <Dashboard />,
        children: [
            { path: ADMIN_ROUTE.DASHBOARD, element: <Dashboard /> },
            { path: ADMIN_ROUTE.USERLIST, element: <UserList /> },
            { path: ADMIN_ROUTE.POILIST, element: <PoiList /> },
            { path: ADMIN_ROUTE.POIICON, element: <PoiIcon /> }
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
