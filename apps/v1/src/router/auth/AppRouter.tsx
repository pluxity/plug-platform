import { RouteObject } from 'react-router-dom';
import LoginPage from "@plug/v1/auth/view/LoginPage";

export const AppRouter: RouteObject[] = [
    {
        path: '/', element: <LoginPage/>
    }
]