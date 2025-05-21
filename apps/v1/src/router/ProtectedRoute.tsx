import { Navigate, Outlet } from 'react-router-dom';
import { useProfileStore } from "@plug/v1/auth/controller/useProfileStore";
import {hasPermission, Role} from "@plug/v1/auth/model/roles";

interface ProtectedRouteProps {
    requiredRoles?: Role[];
}

export const ProtectedRoute = ({ requiredRoles }: ProtectedRouteProps) => {

    const { user } = useProfileStore();

    if (!user) {
        return <Navigate to="/" replace />;
    }

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
