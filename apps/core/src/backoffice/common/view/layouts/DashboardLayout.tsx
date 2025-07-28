import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@plug/ui'
import { AsideMenuItemProps } from '@/backoffice/common/services/types/layout'

const AsideMenuItems: AsideMenuItemProps[] = [
  { id: 'Asset', label: 'Asset', depth: 1, showToggle: true},
  { id: 'AssetList', label: 'AssetList', to: '/admin/assetList', depth: 2, showToggle: false, parentId: 'Asset'},
  { id: 'AssetCategory', label: 'AssetCategory', to: '/admin/assetCategory', depth: 2, showToggle: false, parentId: 'Asset'},
  { id: 'Device', label: 'Device', to: '/admin/device', depth: 1, showToggle: true},
  { id: 'Users', label: 'Users', depth: 1, showToggle: true},
  { id: 'Role', label: 'Role', to: '/admin/role', depth: 2, showToggle: false, parentId: 'Users'},
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
