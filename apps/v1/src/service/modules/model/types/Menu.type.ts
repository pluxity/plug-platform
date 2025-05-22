export type MenuType = '장비목록' | '감시그룹' | '반경검색' | '가상순찰' | 'SOP' | '유지보수';

export interface MenuItem {
    id: MenuType;
    label: string;
    icon?: React.ReactNode;
}

export const MENU_LIST: MenuItem[] = [
    { id: "장비목록", label: '장비목록'},
    { id: "감시그룹", label: '감시그룹'},
    { id: "반경검색", label: '반경검색'},
    { id: "가상순찰", label: '가상순찰'},
    { id: "SOP", label: 'SOP'},
    { id: "유지보수", label: '유지보수'}
]