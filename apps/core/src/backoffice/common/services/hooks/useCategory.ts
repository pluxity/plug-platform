import { useState, useCallback } from 'react'
import { CategoryItem, CategoryOperations } from '../types/category'

export const useCategory = (operations: CategoryOperations) => {
  const [isAddingRoot, setIsAddingRoot] = useState(false)
  const [rootAddValue, setRootAddValue] = useState('')
  const [rootAddCode, setRootAddCode] = useState('')
  const [rootThumbnailFileId, setRootThumbnailFileId] = useState<number | undefined>()

  const handleCategoryAdd = useCallback(async (name: string, parentId?: string, thumbnailFileId?: number, code?: string) => {
    if (operations.onAdd) {
      return await operations.onAdd(name, parentId, thumbnailFileId, code);
    }
    
    return ''
  }, [operations])

  const handleCategoryUpdate = useCallback(async (id: string, name: string, thumbnailFileId?: number, code?: string) => {
    if (operations.onUpdate) {
      await operations.onUpdate(id, name, thumbnailFileId, code)
    }
  }, [operations])

  const handleCategoryDelete = useCallback(async (id: string, items: CategoryItem[]) => {
    const nodeToDelete = findNodeById(items, id)
    if (!nodeToDelete) {
      alert('삭제할 카테고리를 찾을 수 없습니다.')
      return
    }

    const hasChildren = nodeToDelete.children && nodeToDelete.children.length > 0
    if (hasChildren) {
      return
    }

    const confirmMessage = `"${nodeToDelete.name}" 카테고리를 삭제하시겠습니까?`
    
    if (!confirm(confirmMessage)) {
      return
    }
    
    if (operations.onDelete) {
      await operations.onDelete(id)
    }
  }, [operations])

  const handleRootAdd = useCallback(() => {
    if (rootAddValue.trim()) {
      handleCategoryAdd(rootAddValue.trim(), undefined, rootThumbnailFileId, rootAddCode.trim() || undefined)
      setRootAddValue('')
      setRootAddCode('')
      setRootThumbnailFileId(undefined)
      setIsAddingRoot(false)
    }
  }, [rootAddValue, rootAddCode, rootThumbnailFileId, handleCategoryAdd])

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
    handleRootAdd
  }
}

// 유틸리티 함수들
export const findNodeById = (nodes: CategoryItem[], id: string): CategoryItem | null => {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

export const recalculateDepths = (items: CategoryItem[]): CategoryItem[] => {
  const calculateDepthRecursively = (nodes: CategoryItem[], currentDepth: number): CategoryItem[] => {
    return nodes.map(node => ({
      ...node,
      depth: currentDepth,
      children: node.children ? calculateDepthRecursively(node.children, currentDepth + 1) : undefined
    }))
  }
  
  return calculateDepthRecursively(items, 0)
}

export const getChildrenCount = (node: CategoryItem): number => {
  if (!node.children || node.children.length === 0) return 0
  return node.children.length
}

export const getTotalChildrenCount = (node: CategoryItem): number => {
  if (!node.children || node.children.length === 0) return 0
  let total = node.children.length
  node.children.forEach(child => {
    total += getTotalChildrenCount(child)
  })
  return total
}

export const getMaxDepthOfTree = (node: CategoryItem): number => {
  if (!node.children || node.children.length === 0) {
    return node.depth
  }
  return Math.max(...node.children.map(child => getMaxDepthOfTree(child)))
}
