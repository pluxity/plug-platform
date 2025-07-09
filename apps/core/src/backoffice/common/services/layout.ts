{/* 사이드바 메뉴 아이템 타입 */}
export interface AsideMenuItemProps{
    id: string;
    label: string;
    icon?: string;
    to?: string;
    depth: 1 | 2;
    parentId?: string;
    showToggle?: boolean;
}

{/* 페이지 컨테이너 타입 */}
export interface PageContainerProps {
    title: string
    children: React.ReactNode
}