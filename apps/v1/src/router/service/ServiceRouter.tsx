import { RouteObject } from 'react-router-dom';
import {SERVICE_ROUTE} from "@plug/v1/router/service/ServiceRoutes";
import Home from "@plug/v1/service/pages/Home";

export const ServiceRouter: RouteObject[] = [
    {
        path: '/',
        children: [
            { path: SERVICE_ROUTE.HOME, element: <Home/>}
        ],
    },
]