import { useMemo, useState, useCallback } from 'react';
// NOTE: Adjusted relative import paths to reference shared service hooks correctly inside monorepo.
import { useAssetsSWR, useAssetCategoryTree } from '@plug/common-services/services';
import type { AssetResponse, AssetCategoryResponse } from '@plug/common-services';

// Lightweight navigation state separated from data fetching (SWR handles data)
export function useAssetDataWithNavigation() {
  // Fetching (SWR) – cached & revalidated independently
  const { data: assets, isLoading: assetsLoading, error: assetsError, mutate: mutateAssets } = useAssetsSWR();
  const { categories, maxDepth, isLoading: categoriesLoading, error: categoriesError, mutate: mutateCategories } = useAssetCategoryTree();

  // Local UI navigation state (kept minimal to avoid widespread re-renders)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const categoryMap = useMemo(() => {
    const map = new Map<number, AssetCategoryResponse>();
    categories.forEach((c: AssetCategoryResponse) => map.set(c.id, c));
    return map;
  }, [categories]);

  const getCategoryPath = useCallback((categoryId: number): AssetCategoryResponse[] => {
    const path: AssetCategoryResponse[] = [];
    let current: AssetCategoryResponse | undefined = categoryMap.get(categoryId);
    while (current) {
      path.unshift(current);
      if (!current.parentId) break;
      current = categoryMap.get(current.parentId);
    }
    return path;
  }, [categoryMap]);

  const currentCategoryPath = useMemo(() => {
    if (selectedCategoryId == null) return [];
    return getCategoryPath(selectedCategoryId);
  }, [selectedCategoryId, getCategoryPath]);

  const rootCategories = useMemo(() => categories.filter((c: AssetCategoryResponse) => !c.parentId), [categories]);
  const childCategories = useMemo(() => {
    if (selectedCategoryId == null) return rootCategories;
    return categories.filter((c: AssetCategoryResponse) => c.parentId === selectedCategoryId);
  }, [categories, rootCategories, selectedCategoryId]);

  const hasChildCategories = childCategories.length > 0 && (selectedCategoryId == null || childCategories.some((c: AssetCategoryResponse) => c.parentId === selectedCategoryId));

  const currentAssets: AssetResponse[] = useMemo(() => {
    if (hasChildCategories) return [];
    if (selectedCategoryId == null) return [];
  return (assets ?? []).filter((a: AssetResponse) => a.categoryId === selectedCategoryId);
  }, [assets, hasChildCategories, selectedCategoryId]);

  const navigateToCategory = useCallback((categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  }, []);

  const goToRootCategory = useCallback(() => setSelectedCategoryId(null), []);
  const goToParentCategory = useCallback(() => {
    if (currentCategoryPath.length <= 1) return goToRootCategory();
    const parent = currentCategoryPath[currentCategoryPath.length - 2];
    setSelectedCategoryId(parent.id);
  }, [currentCategoryPath, goToRootCategory]);

  const isLoading = assetsLoading || categoriesLoading;
  const error = assetsError || categoriesError;

  const refresh = async () => {
    await Promise.all([mutateAssets(), mutateCategories()]);
  };

  return {
    // data
    assets: assets ?? [],
    categories,
    maxDepth,
    // navigation
    selectedCategoryId,
    currentCategoryPath,
    childCategories,
    hasChildCategories,
    isRootLevel: selectedCategoryId == null,
    currentAssets,
    // state
    isLoading,
    error,
    // actions
    navigateToCategory,
    goToParentCategory,
    goToRootCategory,
    refresh,
  };
}

// Narrow hooks (optional) for components to pick only what they need (reduces re-render scope)
export function useAssetNavigation() {
  const { selectedCategoryId, navigateToCategory, goToParentCategory, goToRootCategory, currentCategoryPath } = useAssetDataWithNavigation();
  return { selectedCategoryId, navigateToCategory, goToParentCategory, goToRootCategory, currentCategoryPath };
}
