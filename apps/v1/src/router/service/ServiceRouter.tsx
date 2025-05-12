import { RouteObject } from 'react-router-dom';
import {SERVICE_ROUTE_PATH} from "@plug/v1/router/service/ServiceRoutes";
import Home from "@plug/v1/service/pages/Home";

export const ServiceRouter: RouteObject[] = [
    {
        path: '/service',
        children: [
            { path: SERVICE_ROUTE_PATH.HOME, element: <Home/>}
        ],
    },
]