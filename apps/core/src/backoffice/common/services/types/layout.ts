export interface AsideMenuItemProps {
    id: string;
    label: string;
    icon?: string;
    to?: string;
    depth: 1 | 2;
    parentId?: string;
    showToggle?: boolean;
}

export interface PageContainerProps {
    title: string
    children: React.ReactNode
}