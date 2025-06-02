import { createBrowserRouter } from 'react-router-dom';
import {ServiceRouter} from "./service/ServiceRouter";
import {AppRouter} from "./auth/AppRouter";
import {AdminRouter} from "./admin/AdminRouter";

export const router = createBrowserRouter([
    ...AdminRouter,
    ...ServiceRouter,
    ...AppRouter
]);
