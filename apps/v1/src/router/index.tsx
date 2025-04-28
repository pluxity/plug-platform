import { createBrowserRouter } from 'react-router-dom';
import {adminRouter} from "@plug/v1/admin/adminRouter";
import {serviceRouter} from "@plug/v1/service/serviceRouter";

export const router = createBrowserRouter([
    ...adminRouter,
    ...serviceRouter,
]);
