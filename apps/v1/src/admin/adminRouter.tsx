import { RouteObject } from 'react-router-dom';
import {ADMIN_ROUTE_PATH} from "@plug/v1/router/adminRoutes";
import Dashboard from "./Dashboard";
import User from "./User";

export const adminRouter: RouteObject[] = [
    {
        path: '/admin',
        children: [
            { path: ADMIN_ROUTE_PATH.DASHBOARD, element: <Dashboard/> },
            { path: ADMIN_ROUTE_PATH.USERS, element: <User/> },

        ],
    },
];
