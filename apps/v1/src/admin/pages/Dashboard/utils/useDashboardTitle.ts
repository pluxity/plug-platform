import { useLocation } from "react-router-dom";
import {DASHBOARD_TITLES} from "@plug/v1/admin/pages/Dashboard/constants/DashboardTitle";

export interface DashboardTitle{
    path: string;
    title: string;
}

export const DashboardTitle = () => {
    const location = useLocation();
    return DASHBOARD_TITLES.find(
        (item) => location.pathname.toLowerCase().includes(item.path.toLowerCase())
    )?.title;
};