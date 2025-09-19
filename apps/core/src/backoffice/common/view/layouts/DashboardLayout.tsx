import { AsideMenuItemProps } from '@/backoffice/common/services/types/layout'
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from '@plug/ui'
import { AssetIcon, CCTVIcon, DeviceIcon, FacilityIcon, UserIcon } from "@/backoffice/assets/MenuIcons";
import { useSidebarStore } from "../../services/store/useSidebarStore";

const AsideMenuItems: AsideMenuItemProps[] = [
  { id: 'Facility', label: '시설물', to: '/admin/facility', icon: <FacilityIcon/>, depth: 1, showToggle: true},

  { id: 'Asset', label: '에셋', icon: <AssetIcon/>, depth: 1, showToggle: true},
  { id: 'AssetCategory', label: '에셋 분류', to: '/admin/asset-category', depth: 2, showToggle: false, parentId: 'Asset'},
  { id: 'AssetList', label: '에셋 목록', to: '/admin/asset-list', depth: 2, showToggle: false, parentId: 'Asset'},

  { id: 'Device', label: '장치', icon:<DeviceIcon/>, depth: 1, showToggle: true},
  { id: 'DeviceCategory', label: '장치 분류', to: '/admin/device-category', depth: 2, showToggle: false, parentId: 'Device'},
  { id: 'DeviceList', label: '장치 목록', to: '/admin/device-list', depth: 2, showToggle: false, parentId: 'Device'},

  { id: 'Cctv', label: 'CCTV', icon:<CCTVIcon/>, depth: 1, showToggle: true},
  { id: 'CctvList', label: 'cctv 목록', to: '/admin/cctv-list', depth: 2, showToggle: false, parentId: 'Cctv'},

  { id: 'Users', label: '사용자', icon: <UserIcon/>, depth: 1, showToggle: true},
  { id: 'User', label: '사용자', to: '/admin/user', depth: 2, showToggle: false, parentId: 'Users'},
  { id: 'Role', label: '역할', to: '/admin/role', depth: 2, showToggle: false, parentId: 'Users'},
  { id: 'Permission', label: '권한', to: '/admin/permission', depth: 2, showToggle: false, parentId: 'Users'},

]

function findActiveMenu(pathname: string, items: AsideMenuItemProps[]) {
  return items.find((it) => it.to === pathname);
}

function getAncestorIds(
  item: AsideMenuItemProps | undefined,
  items: AsideMenuItemProps[]
): string[] {
  const chain: string[] = [];
  let cur = item;
  const byId = new Map(items.map((i) => [i.id, i]));
  while (cur?.parentId) {
    chain.push(cur.parentId);
    cur = byId.get(cur.parentId);
  }
  return chain;
}

const DashboardLayout: React.FC = () => {
  const location = useLocation();

  const { activeItem, expandedItems, setActiveItem, toggleExpandedItem, setExpandedItems } = useSidebarStore();

  useEffect(() => {
    const activeMenu = findActiveMenu(location.pathname, AsideMenuItems);
    setActiveItem(activeMenu?.id ?? null);

    if (activeMenu) {
      const ancestors = getAncestorIds(activeMenu, AsideMenuItems);
      if (ancestors.length) {
        setExpandedItems((prev) => {
          const set = new Set(prev);
          ancestors.forEach((id) => set.add(id));
          return Array.from(set);
        });
      }
    } else {
      setExpandedItems(() => []);
    }
  }, [location.pathname, setActiveItem, setExpandedItems]);

  const handleToggle = (id: string) => toggleExpandedItem(id);

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar
        items={AsideMenuItems}
        activeItemId={activeItem}
        expandedItemIds={expandedItems}
        onToggleExpand={handleToggle}
      />
      <main className="flex-1 p-10 overflow-auto flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout
