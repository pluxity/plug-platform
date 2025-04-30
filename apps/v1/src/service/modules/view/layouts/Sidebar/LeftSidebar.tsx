import React, { useState } from 'react';
import {Button, Sheet} from "@plug/ui";
import {MENU_LIST, MenuType} from "@plug/v1/service/modules/model/types/menu";
import {PanelComponentMap} from "@plug/v1/service/modules/view/components/panel/PanelContentMap";
import {SheetContent, SheetHeader} from "../../../../../../../../packages/ui/src/components/Sheet/Sheet";


const LeftSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<MenuType | null>(null);
    const DynamicPanel = selectedMenu ? PanelComponentMap[selectedMenu] : null;

    const handleMenuClick = (menuId: MenuType) => {
        if (menuId === selectedMenu) {
            setIsOpen(false);
            setSelectedMenu(null);
        } else {
            setSelectedMenu(menuId);
            setIsOpen(true);
        }
    };

    return (
        <>
            <aside className="left-sidebar absolute top-1/4 h-96 left-0 w-20 bg-blue-500 opacity-80 text-white z-[60] p-4 flex flex-col items-center">
                <div className="font-semibold mb-4">메뉴</div>
                <ul className="flex flex-col gap-2">
                    {MENU_LIST.map((menu) => (
                        <li key={menu.id}>
                            <Button onClick={() => {handleMenuClick(menu.id)}}>{menu.label}</Button>
                        </li>
                    ))}
                </ul>
            </aside>

            <Sheet
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setSelectedMenu(null);
                }}
                position="left"
                styleOverrides="top-[10%] h-[657px] w-[320px] left-24"
            >
                <SheetHeader className="text-lg font-bold">
                    {MENU_LIST.find(menu => menu.id === selectedMenu)?.label ?? '메뉴'}
                </SheetHeader>

                <SheetContent className="overflow-y-auto">
                    {DynamicPanel && (
                        <React.Suspense fallback={<div>로딩 중...</div>}>
                            <DynamicPanel />
                        </React.Suspense>
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};

export default LeftSidebar;
