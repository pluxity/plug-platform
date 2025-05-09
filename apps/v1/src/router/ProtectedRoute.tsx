import { Navigate, Outlet } from 'react-router-dom';
import {useSessionWatcher} from "@plug/v1/auth/controller/useSessionWatcher";
import {useProfileStore} from "@plug/v1/auth/controller/useProfileStore";
import {hasPermission, Role} from "@plug/v1/auth/model/roles";

interface ProtectedRouteProps {
    requiredRoles?: Role[];
}

export const ProtectedRoute = ({ requiredRoles }: ProtectedRouteProps) => {
    useSessionWatcher();

    const { user } = useProfileStore();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // if (!user.roles || user.roles.length === 0) {
    //     useProfileStore.getState().clearUser();
    //     return <Navigate to="/" replace />;
    // }

    if (
        requiredRoles &&
        !requiredRoles.some((requiredRole) =>
            user.roles.includes(requiredRole) && hasPermission(requiredRole)
        )
    ) {
        return <Navigate to="/service" replace />;
    }

    return <Outlet />;
};
