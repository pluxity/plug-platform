import { useState, useCallback } from 'react';
import { CategoryItem, CategoryOperations } from '../types/category';

// 삭제 결과 타입 정의
export type DeleteResult =
  | { success: true }
  | { success: false; error: 'NOT_FOUND' | 'HAS_CHILDREN' | 'USER_CANCELLED' };

export const useCategory = (operations: CategoryOperations) => {
  const [isAddingRoot, setIsAddingRoot] = useState(false);
  const [rootAddValue, setRootAddValue] = useState('');
  const [rootAddCode, setRootAddCode] = useState('');
  const [rootThumbnailFileId, setRootThumbnailFileId] = useState<number | undefined>();

  const handleCategoryAdd = useCallback(async (name: string, parentId?: string, thumbnailFileId?: number, code?: string) => {
    if (operations.onAdd) {
      return operations.onAdd(name, parentId, thumbnailFileId, code);
    }
    return '';
  }, [operations]);

  const handleCategoryUpdate = useCallback(async (id: string, name: string, thumbnailFileId?: number, code?: string) => {
    if (operations.onUpdate) {
      await operations.onUpdate(id, name, thumbnailFileId, code);
    }
  }, [operations]);

  const handleCategoryDelete = useCallback(async (
    id: string,
    items: CategoryItem[],
    onConfirm?: (categoryName: string) => Promise<boolean>,
  ): Promise<DeleteResult> => {
    const nodeToDelete = findNodeById(items, id);
    if (!nodeToDelete) {
      return { success: false, error: 'NOT_FOUND' };
    }
    const hasChildren = nodeToDelete.children && nodeToDelete.children.length > 0;
    if (hasChildren) {
      return { success: false, error: 'HAS_CHILDREN' };
    }
    // 확인 콜백이 제공된 경우 사용, 아니면 기본적으로 진행
    if (onConfirm) {
      const confirmed = await onConfirm(nodeToDelete.name);
      if (!confirmed) {
        return { success: false, error: 'USER_CANCELLED' };
      }
    }
    if (operations.onDelete) {
      await operations.onDelete(id);
    }
    return { success: true };
  }, [operations]);

  const handleRootAdd = useCallback(() => {
    if (rootAddValue.trim()) {
      handleCategoryAdd(rootAddValue.trim(), undefined, rootThumbnailFileId, rootAddCode.trim() || undefined);
      setRootAddValue('');
      setRootAddCode('');
      setRootThumbnailFileId(undefined);
      setIsAddingRoot(false);
    }
  }, [rootAddValue, rootAddCode, rootThumbnailFileId, handleCategoryAdd]);

  return {
    // State
    isAddingRoot,
    rootAddValue,
    rootAddCode,
    rootThumbnailFileId,
    // Setters
    setIsAddingRoot,
    setRootAddValue,
    setRootAddCode,
    setRootThumbnailFileId,
    // Handlers
    handleCategoryAdd,
    handleCategoryUpdate,
    handleCategoryDelete,
    handleRootAdd,
  };
};

// 유틸리티 함수들
export const findNodeById = (nodes: CategoryItem[], id: string): CategoryItem | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const recalculateDepths = (items: CategoryItem[]): CategoryItem[] => {
  const calculateDepthRecursively = (nodes: CategoryItem[], currentDepth: number): CategoryItem[] => nodes.map((node) => ({
    ...node,
    depth: currentDepth,
    children: node.children ? calculateDepthRecursively(node.children, currentDepth + 1) : undefined,
  }));
  return calculateDepthRecursively(items, 1);
};

export const getChildrenCount = (node: CategoryItem): number => {
  if (!node.children || node.children.length === 0) return 0;
  return node.children.length;
};

export const getTotalChildrenCount = (node: CategoryItem): number => {
  if (!node.children || node.children.length === 0) return 0;
  return node.children.reduce((count, child) => count + 1 + getTotalChildrenCount(child), 0);
};

export const getMaxDepthOfTree = (node: CategoryItem): number => {
  if (!node.children || node.children.length === 0) {
    return node.depth;
  }
  return Math.max(...node.children.map((child) => getMaxDepthOfTree(child)));
};

export const isDescendant = (parent: CategoryItem, childId: string): boolean => {
  if (parent.id === childId) return true;
  if (parent.children) {
    return parent.children.some((child) => isDescendant(child, childId));
  }
  return false;
};
