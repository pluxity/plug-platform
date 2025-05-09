import { RouteObject } from 'react-router-dom';
import { ADMIN_ROUTE } from "@plug/v1/router/admin/AdminRoutes";
import DashboardPage from "../../admin/pages/DashboardPage";
import User from "../../admin/pages/User";
import {ProtectedRoute} from "@plug/v1/router/ProtectedRoute";
import {ROLE} from "@plug/v1/auth/model/roles";

export const AdminRouter: RouteObject[] = [
    {
        path: '/admin',
        element: <ProtectedRoute requiredRoles={[ROLE.ADMIN, ROLE.MASTER]} />,
        children: [
            { path: ADMIN_ROUTE.DASHBOARD, element: <DashboardPage/> },
            { path: ADMIN_ROUTE.USERS, element: <User/> },

        ],
    },
];
