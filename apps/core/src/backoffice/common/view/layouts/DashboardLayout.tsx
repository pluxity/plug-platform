import { AsideMenuItemProps } from '@/backoffice/common/services/types/layout'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@plug/ui'
import { AssetIcon, CCTVIcon, DeviceIcon, FacilityIcon, UserIcon } from "@/backoffice/assets/MenuIcons";

const AsideMenuItems: AsideMenuItemProps[] = [
  { id: 'Facility', label: '시설물', to: '/admin/facility', icon: <FacilityIcon/>, depth: 1, showToggle: true},

  { id: 'Asset', label: '에셋', to: '/admin/asset-category', icon: <AssetIcon/>, depth: 1, showToggle: true},
  { id: 'AssetCategory', label: '에셋 분류', to: '/admin/asset-category', depth: 2, showToggle: false, parentId: 'Asset'},
  { id: 'AssetList', label: '에셋 목록', to: '/admin/asset-list', depth: 2, showToggle: false, parentId: 'Asset'},

  { id: 'Device', label: '장치', to: '/admin/device-category', icon:<DeviceIcon/>, depth: 1, showToggle: true},
  { id: 'DeviceCategory', label: '장치 분류', to: '/admin/device-category', depth: 2, showToggle: false, parentId: 'Device'},
  { id: 'DeviceList', label: '장치 목록', to: '/admin/device-list', depth: 2, showToggle: false, parentId: 'Device'},

  { id: 'Cctv', label: 'CCTV', to: '/admin/cctv-list', icon:<CCTVIcon/>, depth: 1, showToggle: true},
  { id: 'CctvList', label: 'cctv 목록', to: '/admin/cctv-list', depth: 2, showToggle: false, parentId: 'Cctv'},

  { id: 'Users', label: '사용자', to: '/admin/user', icon: <UserIcon/>, depth: 1, showToggle: true},
  { id: 'User', label: '사용자', to: '/admin/user', depth: 2, showToggle: false, parentId: 'Users'},
  { id: 'Role', label: '역할', to: '/admin/role', depth: 2, showToggle: false, parentId: 'Users'},
  { id: 'Permission', label: '권한', to: '/admin/permission', depth: 2, showToggle: false, parentId: 'Users'},

]

const DashboardLayout: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleClick = (id: string) => {
    const clickedItem = AsideMenuItems.find(item => item.id === id);

    if (clickedItem?.depth === 1) {
      const hasChildren = AsideMenuItems.some(item => item.parentId === id);
      if (hasChildren) {
        setExpandedItems(prev =>
          prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
      }
    }

    setActiveItem(id);
  };

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar
        items={AsideMenuItems}
        activeItemId={activeItem}
        expandedItems={expandedItems}
        onItemClick={handleClick}
      />

      <main className="flex-1 p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout
