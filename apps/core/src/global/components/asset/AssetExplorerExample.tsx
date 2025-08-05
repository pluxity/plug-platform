import React from 'react'
import { AssetExplorer } from '@/global/components/asset'

export const AssetExplorerExample: React.FC = () => {
  const handleAssetSelect = (assetId: number) => {
    console.log('선택된 에셋 ID:', assetId)
    // 여기서 에셋 선택 시 로직을 구현할 수 있습니다
    // 예: 3D 뷰어에서 해당 에셋 렌더링, 상세 정보 표시 등
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          에셋 탐색기
        </h1>
        <p className="text-gray-600">
          카테고리를 탐색하여 원하는 에셋을 찾아보세요.
        </p>
      </div>

      <AssetExplorer
        onAssetSelect={handleAssetSelect}
        className="bg-white rounded-lg shadow-sm border p-6"
      />
    </div>
  )
}
