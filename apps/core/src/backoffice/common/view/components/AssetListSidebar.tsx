import { toast } from 'sonner';

// SWR 기반 훅 사용 (데이터 + 네비게이션). 3D 영역 리렌더 최소화를 위해 zustand 전역 데이터 의존 제거.
import { poiUnassignedText } from '@/global/utils/displayUtils';

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import type { AssetResponse, AssetCategoryResponse } from '@plug/common-services';
import { createFeature } from '@plug/common-services';
import { Poi } from '@plug/engine';
import { Button } from '@plug/ui';

import { useAssetDataWithNavigation } from '@/global/store/assetSWRHooks';
interface AssetListSideBarProps {
  onAssetClick?: (assetId: number) => void;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface AssetCategoryItemProps {
  category: AssetCategoryResponse;
  onClick: (categoryId: number) => void;
}

interface AssetItemProps {
  asset: AssetResponse;
  onClick: (assetId: number) => void;
}

function AssetCategoryItem({ category, onClick }: AssetCategoryItemProps) {
  const thumbnailChar = category.name.charAt(0).toUpperCase();
  
  return (
    <div
  onClick={() => onClick(category.id)}
      className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg border border-gray-200 transition-colors"
    >
      {/* 작은 썸네일 (2줄 그리드에 맞게) */}
      <div className="w-full h-16 rounded-lg overflow-hidden mb-2 bg-gray-100">
        {category.thumbnail?.url ? (
          <img
            src={category.thumbnail.url}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold text-lg">
            {thumbnailChar}
          </div>
        )}
      </div>
      
      {/* 카테고리 정보 */}
      <div>
        <h4 className="font-medium text-xs text-gray-900 truncate mb-1">
          {category.name}
        </h4>
        <p className="text-xs text-gray-500 truncate mb-1">
          {category.code}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {category.children && category.children.length > 0 ? (
              <span>{category.children.length}개</span>
            ) : (
              <span>{category.assetIds?.length || 0}개</span>
            )}
          </div>
          
          {/* 화살표 아이콘 */}
          <div className="text-gray-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

function AssetItem({ asset, onClick }: AssetItemProps) {
  const thumbnailChar = asset.name.charAt(0).toUpperCase();
  
  const handleClick = () => {
    onClick(asset.id);
  };
  
  return (
    <div
      onClick={handleClick}
      className="cursor-pointer hover:bg-blue-50 hover:shadow-md p-2 rounded-lg border border-gray-200 transition-all duration-200 active:scale-95 group"
      title={`${asset.name} - 클릭하여 3D 지도에 배치`}
    >
      {/* 작은 썸네일 (2줄 그리드에 맞게) */}
      <div className="w-full h-16 rounded-lg overflow-hidden mb-2 bg-gray-100 relative">
        {asset.thumbnailFile?.url ? (
          <img
            src={asset.thumbnailFile.url}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-500 text-white font-bold text-lg">
            {thumbnailChar}
          </div>
        )}
        
        {/* 3D 모델 아이콘 오버레이 */}
        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      </div>
      
      {/* 에셋 정보 */}
      <div>
        <h4 className="font-medium text-xs text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
          {asset.name}
        </h4>
        <p className="text-xs text-gray-500 truncate mb-1">
          {asset.code}
        </p>
        <div className="flex items-center justify-between">
          {asset.categoryName && (
            <div className="text-xs text-blue-600 bg-blue-50 px-1 py-0.5 rounded inline-block flex-shrink-0">
              {asset.categoryName}
            </div>
          )}
          
          {/* 배치 가능 표시 */}
          <div className="text-xs text-green-600 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
            배치 가능
          </div>
        </div>
      </div>
    </div>
  );
};

function AssetCategoryBreadcrumb({
  currentCategoryPath,
  navigateToCategory,
  goToRootCategory,
}: {
  currentCategoryPath: AssetCategoryResponse[];
  navigateToCategory: (id: number | null) => void;
  goToRootCategory: () => void;
}) {
  return (
    <div className="px-2">
      <div className="flex items-center space-x-1 text-xs">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToRootCategory}
          className="text-blue-600 hover:text-blue-800 p-1 h-auto cursor-pointer"
        >
          전체
        </Button>
        {currentCategoryPath.map((category: AssetCategoryResponse) => (
          <React.Fragment key={category.id}>
            <span className="text-gray-400">/</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateToCategory(category.id)}
              className="text-blue-600 hover:text-blue-800 p-1 h-auto text-xs cursor-pointer"
            >
              {category.name}
            </Button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function AssetCategoryEmptyState({ selectedCategoryId, isRootLevel }: { selectedCategoryId?: number | null; isRootLevel?: boolean }) {
  if (isRootLevel) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-gray-500 px-4">
        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-xs text-center">등록된 에셋 카테고리가 없습니다.</p>
      </div>
  );
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-32 text-gray-500 px-4">
      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p className="text-xs text-center">이 카테고리에는 배치 가능한 3D 에셋이 없습니다.</p>
      <p className="text-xs text-center text-gray-400 mt-1">
        3D 모델 파일(.glb, .gltf)이 있는 에셋만 배치 가능합니다.
      </p>
      {selectedCategoryId && (
        <p className="text-xs text-center text-gray-400 mt-1">
          (카테고리 ID: {selectedCategoryId})
        </p>
      )}
    </div>
  );
};

export function AssetListSideBar({
  className = '',
  isCollapsed = false,
  // onToggleCollapse
}: AssetListSideBarProps) {
  // facilityId 가져오기
  const { id: facilityId } = useParams<{ id: string }>();
  // Asset Store hooks
  const {
    isLoading,
    error,
    selectedCategoryId,
    navigateToCategory,
    childCategories,
    hasChildCategories,
    isRootLevel,
    currentAssets,
  assets,
  currentCategoryPath,
  goToRootCategory,
  } = useAssetDataWithNavigation();

  // 루트 카테고리로 초기화 
  useEffect(() => {
    navigateToCategory(null);
  }, [navigateToCategory]);

  // 기존 store.getAssetsByCategory 대체: 훅에서 필터된 currentAssets 제공

  const handleCategoryClick = (categoryId: number) => {
    navigateToCategory(categoryId);
  };

  const handleAssetClick = (assetId: number) => {
  const asset = assets.find(a => a.id === assetId);
    if (asset && asset.file?.url) {
      const poiOption = {
        id: crypto.randomUUID(),
        iconUrl: '',
        modelUrl: asset.file.url,
        htmlString: poiUnassignedText('장비 할당 필요'),
        property: {
          assetId,
          assetCode: asset.code,
          assetName: asset.name,
          categoryId: asset.categoryId,
          categoryName: asset.categoryName,
        },
      };
      Poi.Create(poiOption, handleCreateFeature);
    } else {
      const errorMessage = !asset
        ? 'Asset을 찾을 수 없습니다.'
        : '3D 모델 파일이 없습니다.';
      console.warn('Asset not found or no 3D model file:', assetId, asset);
      toast.error(errorMessage);
    }
  };
 

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateFeature = async (feature: any) => {
    if (!facilityId) {
      toast.error('시설이 선택되지 않았습니다.');
      return;
    }
    try {
      await createFeature({
        id: feature.id,
        assetId: feature.property.assetId,
        facilityId: parseInt(facilityId, 10),
        floorId: feature.floorId,
        position: feature.position,
        rotation: feature.rotation,
        scale: feature.scale,
      });
      toast.success('Feature 생성 완료');
    } catch (error) {
      console.error('Failed to create feature:', error);
      toast.error('Feature 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 text-sm">로딩 중...</div>
        </div>
  );
    }

  if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-sm text-center">
            오류가 발생했습니다<br />
      {error instanceof Error ? error.message : '알 수 없는 오류'}
          </div>
        </div>
  );
    }

    return (
      <div className="space-y-3">

        <div className="flex items-center gap-2">
          {/* 브레드크럼 네비게이션 */}
          <div className="flex-1">
            <AssetCategoryBreadcrumb
              currentCategoryPath={currentCategoryPath}
              navigateToCategory={navigateToCategory}
              goToRootCategory={goToRootCategory}
            />
          </div>

          {/* 현재 상태 표시 */}
          {!isRootLevel && (
            <span className="text-xs text-gray-500 text-center ml-auto mr-4">
                {hasChildCategories
                  ? `하위 카테고리 ${childCategories.length}개`
                  : `에셋 ${currentAssets.length}개`}
            </span>
          )}
        </div>


        {/* 컨텐츠 영역 */}
        <div className="px-2">
          {/* 2줄 그리드로 카드 배치 */}
          <div className="grid grid-cols-2 gap-3">
            {/* 하위 카테고리들 표시 */}
            {hasChildCategories && childCategories.map((category) => (
              <AssetCategoryItem
                key={category.id}
                category={category}
                onClick={handleCategoryClick}
              />
            ))}

            {/* 에셋들 표시 */}
            {!hasChildCategories && currentAssets.map((asset) => (
              <AssetItem
                key={asset.id}
                asset={asset}
                onClick={handleAssetClick}
              />
            ))}
          </div>
        </div>

        {/* 빈 상태 */}
        {!hasChildCategories && currentAssets.length === 0 && selectedCategoryId && (
          <AssetCategoryEmptyState selectedCategoryId={selectedCategoryId} />
        )}

        {/* 루트 레벨에서 카테고리가 없는 경우 */}
        {isRootLevel && childCategories.length === 0 && (
          <AssetCategoryEmptyState isRootLevel />
        )}
      </div>
    );
  }

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-80'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${className}`}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-900">Asset Category</h2>
        )}
        
        {/* 접기/펼치기 버튼 */}
        {/* {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-1 hover:bg-gray-100 cursor-pointer"
            title={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </Button>
        )} */}
      </div>
      
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto py-4">
          {renderContent()}
        </div>
      )}
      
      {/* 접힌 상태일 때 간단한 아이콘만 표시 */}
      {/* {isCollapsed && (
        <div className="flex-1 flex flex-col items-center py-4">
          <div className="text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AssetListSideBar;
