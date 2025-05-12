import { RouteObject } from 'react-router-dom';
import {ADMIN_ROUTE_PATH} from "@plug/v1/router/admin/AdminRoutes";
import DashboardPage from "../../admin/pages/DashboardPage";
import User from "../../admin/pages/User";

export const AdminRouter: RouteObject[] = [
    {
        path: '/admin',
        children: [
            { path: ADMIN_ROUTE_PATH.DASHBOARD, element: <DashboardPage/> },
            { path: ADMIN_ROUTE_PATH.USERS, element: <User/> },

        ],
    },
];
