import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { poiUnassignedText } from '@/global/utils/displayUtils';
import { useNavigate, useParams } from "react-router-dom";
import type { AssetResponse, AssetCategoryResponse } from '@plug/common-services';
import { createFeature } from '@plug/common-services';
import { Poi } from '@plug/engine';
import { Badge, Button, Separator } from "@plug/ui";
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
      className="cursor-pointer hover:bg-secondary-700 hover:shadow-md  bg-[#696969] transition-colors rounded-sm shadow-xs"
    >
      <div className="w-full overflow-hidden h-28  relative">
        {category.thumbnail?.url ? (
          <>
            <img
              src={category.thumbnail.url}
              alt={category.name}
              className="w-full h-full object-cover rounded-t-sm bg-white/70"
            />
            {/*<Badge className="absolute bottom-0 right-0 rounded-none rounded-tl-lg bg-secondary-800 text-white">{category.code}</Badge>*/}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-500 text-white font-bold text-lg">
            {thumbnailChar}
          </div>
        )}
      </div>

      <div className="flex w-full justify-between p-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-white text-sm truncate mb-1">
            {category.name}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-secondary-700 bg-secondary-300 px-2 py-0.5 rounded-full inline-block flex-shrink-0">
            {category.children && category.children.length > 0 ? (
              <span>{category.children.length}개</span>
            ) : (
              <span>{category.assetIds?.length || 0}개</span>
            )}
          </div>

          {/*<div className="text-secondary-600 p-1 rounded-full inline-block bg-secondary-300">*/}
          {/*  <svg*/}
          {/*    className="w-3 h-3"*/}
          {/*    fill="none"*/}
          {/*    stroke="currentColor"*/}
          {/*    viewBox="0 0 24 24"*/}
          {/*  >*/}
          {/*    <path*/}
          {/*      strokeLinecap="round"*/}
          {/*      strokeLinejoin="round"*/}
          {/*      strokeWidth={2}*/}
          {/*      d="M9 5l7 7-7 7"*/}
          {/*    />*/}
          {/*  </svg>*/}
          {/*</div>*/}
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
      className="cursor-pointer hover:bg-secondary-700 hover:shadow-md bg-[#696969] rounded-lg transition-all duration-200 active:scale-95 group"
      title={`${asset.name} - 클릭하여 3D 지도에 배치`}
    >
      <div className="w-full h-28 rounded-t-lg overflow-hidden bg-white/70 relative">
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
        
        <div className="absolute top-2 right-2 bg-white text-secondary-700 rounded-full p-1 ">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <Badge className="absolute bottom-0 right-0 rounded-none rounded-tl-lg bg-[#696969] text-secondary-400">배치 가능</Badge>
      </div>
      
      <div className="flex px-3 py-2 items-center justify-between">
        <h4 className="font-medium text-base text-white truncate">
          {asset.name}
        </h4>
        <div className="flex items-center justify-between">
          {asset.categoryName && (
            <div className="text-xs text-secondary-700 bg-secondary-400 px-2 py-1 rounded-full inline-block flex-shrink-0">
              {asset.categoryName}
            </div>
          )}

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
      <div className="flex items-center space-x-1 text-xs">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToRootCategory}
          className="text-secondary-900 hover:bg-white hover:text-secondary-700 p-0 h-auto cursor-pointer text-base font-medium min-w-10"
        >
          전체
        </Button>
        {currentCategoryPath.map((category: AssetCategoryResponse) => (
          <React.Fragment key={category.id}>
            <span className="text-secondary-900 text-base">/</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateToCategory(category.id)}
              className="text-secondary-900 hover:bg-white hover:text-secondary-800 p-0 h-auto text-base cursor-pointer font-medium min-w-10"
            >
              {category.name}
            </Button>
          </React.Fragment>
        ))}
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
  const navigate = useNavigate()
  const { id: facilityId } = useParams<{ id: string }>();
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

  useEffect(() => {
    navigateToCategory(null);
  }, [navigateToCategory]);

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
            오류가 발생했습니다
            <br />
            {error.message}
          </div>
        </div>
  );
    }

    return (
      <div className="space-y-3 px-5 py-4 h-full">

        <div className="flex items-center gap-2">
            <AssetCategoryBreadcrumb
              currentCategoryPath={currentCategoryPath}
              navigateToCategory={navigateToCategory}
              goToRootCategory={goToRootCategory}
            />

          {!isRootLevel && (
            <Badge
              className="ml-auto bg-white text-secondary-900"
              variant="secondary"
            >
                {hasChildCategories
                  ? `하위 카테고리 ${childCategories.length}개`
                  : `에셋 ${currentAssets.length}개`}
            </Badge>
          )}
        </div>

        <Separator className="my-4" orientation="horizontal" />

          <div className="grid grid-cols-2 gap-5">
            {hasChildCategories && childCategories.map((category) => (
              <AssetCategoryItem
                key={category.id}
                category={category}
                onClick={handleCategoryClick}
              />
            ))}

            {!hasChildCategories && currentAssets.map((asset) => (
              <AssetItem
                key={asset.id}
                asset={asset}
                onClick={handleAssetClick}
              />
            ))}
          </div>

        {!hasChildCategories && currentAssets.length === 0 && selectedCategoryId && (
          <AssetCategoryEmptyState selectedCategoryId={selectedCategoryId} />
        )}

        {isRootLevel && childCategories.length === 0 && (
          <AssetCategoryEmptyState isRootLevel />
        )}
      </div>
    );
  }

  const handleGoBack = () => {
    navigate('/admin/facility')
  }

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-80'} bg-secondary-200 border-r  flex flex-col transition-all duration-300 ${className}`}>
      <div className="px-4 py-3 flex items-center justify-between bg-secondary-800 border-b shadow-xs">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="w-[3px] h-6 rounded-full bg-primary-600 inline-block mr-3"/>
            <label className="block text-white text-lg font-bold">
              Asset 분류
            </label>
          </div>
        )}
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="text-secondary-200 !w-16 min-w-16 hover:text-secondary-1000"
          >
            목록으로
          </Button>
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
        <div className="flex-1 overflow-y-auto">
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
}

export default AssetListSideBar;
