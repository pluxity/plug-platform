import { DASHBOARD_TITLES } from '../mocks/DashboardTitle.mock';
import { useLocation } from "react-router-dom";

export interface DashboardTitle{
    path: string;
    title: string;
}

export const DashboardTitle = () => {
    const location = useLocation();
    return DASHBOARD_TITLES.find(
        (item) => item.path.toLowerCase() === location.pathname.toLowerCase()
    )?.title;
};