import { RouteObject } from 'react-router-dom';
import {ADMIN_ROUTE_PATH} from "@plug/v1/router/adminRoutes";
import DashboardPage from "./pages/DashboardPage";
import User from "./pages/User";

export const adminRouter: RouteObject[] = [
    {
        path: '/admin',
        children: [
            { path: ADMIN_ROUTE_PATH.DASHBOARD, element: <DashboardPage/> },
            { path: ADMIN_ROUTE_PATH.USERS, element: <User/> },

        ],
    },
];
