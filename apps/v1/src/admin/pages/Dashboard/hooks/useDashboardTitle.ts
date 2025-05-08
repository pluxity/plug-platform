import { DASHBOARD_TITLES } from '../mocks/DashboardTitle.mock';

export interface DashboardTitle{
    path: string;
    title: string;
}

export const DashboardTitle = () => {
    return DASHBOARD_TITLES.find(
        (title) => title.path
    )?.title;
};