import { createBrowserRouter } from 'react-router-dom';
import {AdminRouter} from "@plug/v1/router/admin/AdminRouter";
import {ServiceRouter} from "@plug/v1/router/service/ServiceRouter";
import { AppRouter } from './auth/AppRouter';

export const router = createBrowserRouter([
    ...AdminRouter,
    ...ServiceRouter,
    ...AppRouter
]);
