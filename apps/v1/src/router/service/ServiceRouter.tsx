import { RouteObject } from 'react-router-dom';
import {SERVICE_ROUTE} from "@plug/v1/router/service/ServiceRoutes";
import ViewerPage from "@plug/v1/service/modules/view/pages/ViewerPage";
// import {ProtectedRoute} from "@plug/v1/router/ProtectedRoute";

export const ServiceRouter: RouteObject[] = [
    {
        path: '/service',
        // element: <ProtectedRoute />,
        children: [
            { path: SERVICE_ROUTE.VIEWER, element: <ViewerPage/>}
        ],
    },
]