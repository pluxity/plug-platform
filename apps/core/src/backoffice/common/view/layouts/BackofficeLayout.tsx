import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@plug/ui'
import { BackofficeHeader } from '../components'
import { useState } from 'react'

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  to?: string;
  depth: 1 | 2;
  parentId?: string;
  showToggle?: boolean;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', to: '/admin', depth: 1, showToggle: true},
  { id: 'Asset', label: 'Asset', to: '/admin/asset', depth: 1, showToggle: true},
  { id: 'Device', label: 'Device', to: '/admin/device', depth: 1, showToggle: true},
  { id: 'users', label: 'Users', to: '/admin/users', depth: 1, showToggle: true},
]

const BackofficeLayout: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleClick = (id: string) => {setActiveItem(id);};

  const handleToggle = (id: string) => setExpandedItems((prev) => (prev.includes(id) ? [] : [id]));

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <BackofficeHeader />
  
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          items={menuItems}
          activeItemId={activeItem}
          expandedItemIds={expandedItems}
          onItemClick={handleClick}
          onToggleExpand={handleToggle}
        />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default BackofficeLayout
