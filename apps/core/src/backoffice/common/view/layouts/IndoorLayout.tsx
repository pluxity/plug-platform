import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@plug/ui'
import { AsideMenuItemProps } from '@/backoffice/common/services/types/layout'

const IndoorSidebarItems: AsideMenuItemProps[] = [
  { id: 'AssetCategory', label: 'Asset Category', to: '/admin/assetCategory', depth: 1, showToggle: false},
  // 필요시 다른 실내지도 관련 메뉴들을 추가할 수 있습니다
]

const IndoorLayout: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>('AssetCategory');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleClick = (id: string) => {setActiveItem(id);};

  const handleToggle = (id: string) => setExpandedItems((prev) => (prev.includes(id) ? [] : [id]));

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar
        items={IndoorSidebarItems}
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

export default IndoorLayout
