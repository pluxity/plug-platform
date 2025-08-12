import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AssetListSideBar } from '@/backoffice/common/view/components/AssetListSidebar'

const IndoorLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  const handleAssetClick = (assetId: number) => {
    // 에셋 클릭 시 처리 로직 (필요에 따라 구현)
    console.log('Asset clicked:', assetId)
  }

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="flex h-full overflow-hidden">
      <AssetListSideBar 
        onAssetClick={handleAssetClick} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default IndoorLayout
