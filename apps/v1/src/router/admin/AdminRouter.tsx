import { RouteObject } from 'react-router-dom';
import { ADMIN_ROUTE } from "@plug/v1/router/admin/AdminRoutes";
import DashboardPage from "../../admin/pages/DashboardPage";
import User from "../../admin/pages/User";

export const AdminRouter: RouteObject[] = [
    {
        path: '/admin',
        children: [
            { path: ADMIN_ROUTE.DASHBOARD, element: <DashboardPage/> },
            { path: ADMIN_ROUTE.USERS, element: <User/> },

        ],
    },
];
