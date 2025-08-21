import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@plug/ui'
import { AsideMenuItemProps } from '@/backoffice/common/services/types/layout'

const AsideMenuItems: AsideMenuItemProps[] = [
  { id: 'Facility', label: '시설물', to: '/admin/facility', depth: 1, showToggle: true},

  { id: 'Asset', label: '에셋', depth: 1, showToggle: true},
  { id: 'AssetCategory', label: '에셋 분류', to: '/admin/asset-category', depth: 2, showToggle: false, parentId: 'Asset'},
  { id: 'AssetList', label: '에셋 목록', to: '/admin/asset-list', depth: 2, showToggle: false, parentId: 'Asset'},

  { id: 'Device', label: '장치', depth: 1, showToggle: true},
  { id: 'DeviceCategory', label: '장치 분류', to: '/admin/device-category', depth: 2, showToggle: false, parentId: 'Device'},
  { id: 'DeviceList', label: '장치 목록', to: '/admin/device-list', depth: 2, showToggle: false, parentId: 'Device'},

  { id: 'Users', label: '사용자', depth: 1, showToggle: true},
  { id: 'Permission', label: '권한', to: '/admin/permission', depth: 2, showToggle: false, parentId: 'Users'},
  { id: 'Role', label: '역할', to: '/admin/role', depth: 2, showToggle: false, parentId: 'Users'},
  { id: 'User', label: '사용자', to: '/admin/user', depth: 2, showToggle: false, parentId: 'Users'},

]

const DashboardLayout: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleClick = (id: string) => {setActiveItem(id);};

  const handleToggle = (id: string) => setExpandedItems((prev) => (prev.includes(id) ? [] : [id]));

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar
        items={AsideMenuItems}
        activeItemId={activeItem}
        expandedItemIds={expandedItems}
        onItemClick={handleClick}
        onToggleExpand={handleToggle}
      />

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
