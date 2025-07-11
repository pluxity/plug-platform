import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Button, Input, Card, CardContent, Badge } from '@plug/ui'

export interface CategoryItem {
  id: string
  name: string
  children?: CategoryItem[]
  depth: number
  parentId?: string
}

export interface CategoryComponentProps {
  items?: CategoryItem[]
  maxDepth?: number
  onCategoryAdd?: (name: string, parentId?: string) => Promise<string> | string // 서버에서 발행한 ID 반환
  onCategoryUpdate?: (id: string, name: string) => Promise<void> | void
  onCategoryDelete?: (id: string) => Promise<void> | void
  onCategoryMove?: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => Promise<void> | void
  onCategoryIdUpdate?: (tempId: string, newId: string) => void // 임시 ID를 서버 ID로 업데이트
  className?: string
  disabled?: boolean
  enableDragDrop?: boolean
}

interface CategoryNodeProps {
  item: CategoryItem
  maxDepth: number
  onAdd: (name: string, parentId?: string) => void
  onUpdate: (id: string, name: string) => void
  onDelete: (id: string) => void
  onMove?: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void
  disabled?: boolean
  enableDragDrop?: boolean
}

// 유틸리티 함수들
const findNodeById = (nodes: CategoryItem[], id: string): CategoryItem | null => {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

const getMaxDepthOfTree = (node: CategoryItem): number => {
  if (!node.children || node.children.length === 0) {
    return node.depth
  }
  return Math.max(...node.children.map(child => getMaxDepthOfTree(child)))
}

// 자식 노드 개수를 계산하는 함수 (직접 자식만)
const getChildrenCount = (node: CategoryItem): number => {
  if (!node.children || node.children.length === 0) return 0
  return node.children.length
}

// 전체 하위 노드 개수를 계산하는 함수 (재귀적)
const getTotalChildrenCount = (node: CategoryItem): number => {
  if (!node.children || node.children.length === 0) return 0
  let total = node.children.length
  node.children.forEach(child => {
    total += getTotalChildrenCount(child)
  })
  return total
}

// UUID v4 생성 함수
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// depth를 재계산하는 함수
const recalculateDepths = (items: CategoryItem[]): CategoryItem[] => {
  const calculateDepthRecursively = (nodes: CategoryItem[], currentDepth: number): CategoryItem[] => {
    return nodes.map(node => ({
      ...node,
      depth: currentDepth,
      children: node.children ? calculateDepthRecursively(node.children, currentDepth + 1) : undefined
    }))
  }
  
  return calculateDepthRecursively(items, 0)
}

const CategoryNode: React.FC<CategoryNodeProps> = ({
  item,
  maxDepth,
  onAdd,
  onUpdate,
  onDelete,
  onMove,
  disabled = false,
  enableDragDrop = true
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editValue, setEditValue] = useState(item.name)
  const [addValue, setAddValue] = useState('')
  const [dragOver, setDragOver] = useState<'none' | 'top' | 'bottom' | 'inside'>('none')
  const [isDragging, setIsDragging] = useState(false)

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleEditSubmit = () => {
    if (editValue.trim()) {
      onUpdate(item.id, editValue.trim())
      setIsEditing(false)
    }
  }

  const handleEditCancel = () => {
    setEditValue(item.name)
    setIsEditing(false)
  }

  const handleAddSubmit = () => {
    if (addValue.trim()) {
      onAdd(addValue.trim(), item.id)
      setAddValue('')
      setIsAdding(false)
    }
  }

  const handleAddCancel = () => {
    setAddValue('')
    setIsAdding(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: 'edit' | 'add') => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (action === 'edit') {
        handleEditSubmit()
      } else {
        handleAddSubmit()
      }
    }
    if (e.key === 'Escape') {
      if (action === 'edit') {
        handleEditCancel()
      } else {
        handleAddCancel()
      }
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (!enableDragDrop) return
    setIsDragging(true)
    e.dataTransfer.setData('text/plain', item.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (!enableDragDrop || !onMove) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const height = rect.height
    
    if (y < height * 0.25) {
      setDragOver('top')
    } else if (y > height * 0.75) {
      setDragOver('bottom')
    } else {
      setDragOver(item.depth < maxDepth ? 'inside' : 'none')
    }
  }

  const handleDragLeave = () => {
    setDragOver('none')
  }

  const handleDrop = (e: React.DragEvent) => {
    if (!enableDragDrop || !onMove) return
    e.preventDefault()
    
    const draggedId = e.dataTransfer.getData('text/plain')
    if (draggedId === item.id) return
    
    if (dragOver === 'top') {
      onMove(draggedId, item.id, 'before')
    } else if (dragOver === 'bottom') {
      onMove(draggedId, item.id, 'after')
    } else if (dragOver === 'inside') {
      onMove(draggedId, item.id, 'inside')
    }
    
    setDragOver('none')
  }

  const hasChildren = item.children && item.children.length > 0
  const canAddChildren = item.depth < maxDepth

  return (
    <div className="relative">
      {/* Drag indicators */}
      {enableDragDrop && dragOver === 'top' && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />
      )}
      {enableDragDrop && dragOver === 'bottom' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />
      )}
      
      {/* Category Item */}
      <div 
        className={`flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md group relative transition-colors ${
          isDragging ? 'opacity-50' : ''
        } ${
          dragOver === 'inside' ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
        }`}
        style={{ paddingLeft: `${item.depth * 20 + 8}px` }}
        draggable={enableDragDrop && !disabled}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag Handle */}
        {enableDragDrop && !disabled && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-move text-gray-400 hover:text-gray-600">
            ⋮⋮
          </div>
        )}
        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-5 h-5 p-0 text-gray-500 hover:text-gray-700"
            onClick={handleToggleExpand}
            disabled={disabled}
          >
            <span className="text-xs">
              {isExpanded ? '▼' : '▶'}
            </span>
          </Button>
        ) : (
          <div className="w-5 h-5" />
        )}

        {/* Category Name */}
        <div className="flex-1 flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-1 flex-1">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'edit')}
                className="h-7 text-sm"
                autoFocus
                disabled={disabled}
              />
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 text-green-600 hover:text-green-700"
                onClick={handleEditSubmit}
                disabled={disabled}
                title="확인"
              >
                ✓
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 text-red-600 hover:text-red-700"
                onClick={handleEditCancel}
                disabled={disabled}
                title="취소"
              >
                ✕
              </Button>
            </div>
          ) : (
            <>
              <span className="text-sm font-medium text-gray-900">
                {item.name}
              </span>
              {getChildrenCount(item) > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getChildrenCount(item)}개 하위
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        {!isEditing && !disabled && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            {canAddChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 text-blue-600 hover:text-blue-700"
                onClick={() => setIsAdding(true)}
                title="하위 카테고리 추가"
              >
                +
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 text-gray-600 hover:text-gray-700"
              onClick={() => setIsEditing(true)}
              title="카테고리 수정"
            >
              ✎
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 text-red-600 hover:text-red-700"
              onClick={() => {
                console.log('삭제 버튼 클릭:', { id: item.id, name: item.name, depth: item.depth })
                onDelete(item.id)
              }}
              title="카테고리 삭제"
            >
              🗑
            </Button>
          </div>
        )}
      </div>

      {/* Add New Child Form */}
      {isAdding && (
        <div 
          className="flex items-center gap-1 p-2 bg-blue-50 rounded-md ml-2"
          style={{ paddingLeft: `${(item.depth + 1) * 20 + 8}px` }}
        >
          <div className="w-5 h-5" />
          <Input
            value={addValue}
            onChange={(e) => setAddValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'add')}
            placeholder="새 카테고리 이름"
            className="h-7 text-sm flex-1"
            autoFocus
            disabled={disabled}
          />
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 text-green-600 hover:text-green-700"
            onClick={handleAddSubmit}
            disabled={disabled}
            title="확인"
          >
            ✓
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 text-red-600 hover:text-red-700"
            onClick={handleAddCancel}
            disabled={disabled}
            title="취소"
          >
            ✕
          </Button>
        </div>
      )}

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {item.children!.map((child) => (
            <CategoryNode
              key={child.id}
              item={child}
              maxDepth={maxDepth}
              onAdd={onAdd}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onMove={onMove}
              disabled={disabled}
              enableDragDrop={enableDragDrop}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const CategoryComponent: React.FC<CategoryComponentProps> = ({
  items = [],
  maxDepth = 3,
  onCategoryAdd,
  onCategoryUpdate,
  onCategoryDelete,
  onCategoryMove,
  onCategoryIdUpdate,
  className,
  disabled = false,
  enableDragDrop = true
}) => {
  const [isAddingRoot, setIsAddingRoot] = useState(false)
  const [rootAddValue, setRootAddValue] = useState('')
  
  // depth가 재계산된 items 생성
  const itemsWithCorrectDepths = recalculateDepths(items)

  const handleCategoryAdd = useCallback(async (name: string, parentId?: string) => {
    try {
      // 임시 UUID 생성
      const tempId = generateUUID()
      
      if (onCategoryAdd) {
        // 서버에서 실제 ID를 받아옴
        const serverId = await onCategoryAdd(name, parentId)
        
        // 임시 ID를 서버 ID로 업데이트
        if (onCategoryIdUpdate && serverId && serverId !== tempId) {
          onCategoryIdUpdate(tempId, serverId)
        }
        
        return serverId || tempId
      }
      
      return tempId
    } catch (error) {
      console.error('카테고리 추가 실패:', error)
      throw error
    }
  }, [onCategoryAdd, onCategoryIdUpdate])

  const handleCategoryUpdate = useCallback(async (id: string, name: string) => {
    try {
      if (onCategoryUpdate) {
        await onCategoryUpdate(id, name)
      }
    } catch (error) {
      console.error('카테고리 수정 실패:', error)
      // 에러 처리 로직 추가 가능
    }
  }, [onCategoryUpdate])

  const handleCategoryDelete = useCallback(async (id: string) => {
    try {
      // 삭제할 노드 찾기 (재계산된 depth 기준으로)
      const nodeToDelete = findNodeById(itemsWithCorrectDepths, id)
      if (!nodeToDelete) {
        console.error('삭제할 카테고리를 찾을 수 없습니다. ID:', id)
        alert('삭제할 카테고리를 찾을 수 없습니다.')
        return
      }

      // 디버깅을 위한 로그
      console.log('삭제하려는 카테고리:', { id, name: nodeToDelete.name, depth: nodeToDelete.depth })

      // 하위 카테고리가 있는지 확인
      const hasChildren = nodeToDelete.children && nodeToDelete.children.length > 0
      const childrenCount = hasChildren ? nodeToDelete.children!.length : 0

      // 확인 메시지 생성 - 카테고리 ID도 포함해서 명확하게 표시
      let confirmMessage = `"${nodeToDelete.name}" (ID: ${nodeToDelete.id}) 카테고리를 삭제하시겠습니까?`
      if (hasChildren) {
        const childrenNames = nodeToDelete.children!.map(child => child.name).join(', ')
        confirmMessage += `\n\n⚠️ 주의: 이 카테고리에는 ${childrenCount}개의 하위 카테고리가 있습니다.\n하위 카테고리: ${childrenNames}\n모든 하위 카테고리도 함께 삭제됩니다.`
      }

      // 사용자 확인
      if (!confirm(confirmMessage)) {
        return
      }

      if (onCategoryDelete) {
        await onCategoryDelete(id)
      }
    } catch (error) {
      console.error('카테고리 삭제 실패:', error)
      alert('카테고리 삭제 중 오류가 발생했습니다.')
    }
  }, [onCategoryDelete, itemsWithCorrectDepths])

  const handleCategoryMove = useCallback(async (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
    try {
      // 이동 전 depth 검증 (재계산된 depth 기준으로)
      const draggedNode = findNodeById(itemsWithCorrectDepths, draggedId)
      const targetNode = findNodeById(itemsWithCorrectDepths, targetId)
      
      if (!draggedNode || !targetNode) {
        console.error('이동할 카테고리 또는 대상 카테고리를 찾을 수 없습니다.')
        return
      }

      // 자기 자신이나 자기 하위 노드로 이동하는 것 방지
      const isDescendant = (parent: CategoryItem, childId: string): boolean => {
        if (parent.id === childId) return true
        if (parent.children) {
          return parent.children.some(child => isDescendant(child, childId))
        }
        return false
      }

      if (isDescendant(draggedNode, targetId)) {
        alert('자기 자신이나 하위 카테고리로는 이동할 수 없습니다.')
        return
      }

      if (position === 'inside') {
        // inside로 이동할 때의 새로운 depth 계산
        const draggedMaxDepth = getMaxDepthOfTree(draggedNode)
        const draggedDepthSpan = draggedMaxDepth - draggedNode.depth
        const newBaseDepth = targetNode.depth + 1
        const newMaxDepth = newBaseDepth + draggedDepthSpan
        
        if (newMaxDepth > maxDepth) {
          const currentStructure = draggedNode.children && draggedNode.children.length > 0 
            ? `\n\n현재 "${draggedNode.name}" 카테고리는 ${draggedDepthSpan + 1}단계의 하위 구조를 가지고 있습니다.`
            : ''
          
          alert(`이동 불가: 최대 깊이 ${maxDepth}를 초과합니다.\n\n"${targetNode.name}" 카테고리 밑으로 이동하면:\n- "${draggedNode.name}"이 Depth ${newBaseDepth}가 됩니다.\n- 최하위 카테고리가 Depth ${newMaxDepth}가 됩니다.${currentStructure}`)
          return
        }
      } else {
        // before/after로 이동할 때의 새로운 depth 계산
        const draggedMaxDepth = getMaxDepthOfTree(draggedNode)
        const draggedDepthSpan = draggedMaxDepth - draggedNode.depth
        const newBaseDepth = targetNode.depth
        const newMaxDepth = newBaseDepth + draggedDepthSpan
        
        if (newMaxDepth > maxDepth) {
          alert(`이동 불가: 최대 깊이 ${maxDepth}를 초과합니다.\n\n같은 레벨(Depth ${newBaseDepth})로 이동하면 최하위 카테고리가 Depth ${newMaxDepth}가 됩니다.`)
          return
        }
      }
      
      if (onCategoryMove) {
        await onCategoryMove(draggedId, targetId, position)
      }
    } catch (error) {
      console.error('카테고리 이동 실패:', error)
      alert('카테고리 이동 중 오류가 발생했습니다.')
    }
  }, [onCategoryMove, itemsWithCorrectDepths, maxDepth])

  const handleRootAddSubmit = () => {
    if (rootAddValue.trim()) {
      handleCategoryAdd(rootAddValue.trim())
      setRootAddValue('')
      setIsAddingRoot(false)
    }
  }

  const handleRootAddCancel = () => {
    setRootAddValue('')
    setIsAddingRoot(false)
  }

  const handleRootKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleRootAddSubmit()
    }
    if (e.key === 'Escape') {
      handleRootAddCancel()
    }
  }

  // 카테고리 상태 변경 감지 및 로깅
  useEffect(() => {
    if (items && items.length > 0) {
      const getAllIds = (nodes: CategoryItem[]): string[] => {
        let allIds: string[] = []
        nodes.forEach(node => {
          allIds.push(node.id)
          if (node.children) {
            allIds = allIds.concat(getAllIds(node.children))
          }
        })
        return allIds
      }
      
      const currentIds = getAllIds(items)
      const totalCount = itemsWithCorrectDepths.reduce((count, item) => {
        return count + getTotalChildrenCount(item) + 1
      }, 0)
      
      console.log('=== 카테고리 상태 변경 감지 ===')
      console.log('현재 카테고리 ID들:', currentIds)
      console.log('전체 카테고리 개수:', totalCount)
      console.log('루트 카테고리 개수:', itemsWithCorrectDepths.length)
      
      // 새로 추가된 카테고리 찾기 (이전 상태와 비교)
      const prevIds = prevItemsRef.current ? getAllIds(prevItemsRef.current) : []
      const newIds = currentIds.filter(id => !prevIds.includes(id))
      if (newIds.length > 0) {
        console.log('새로 추가된 카테고리 ID들:', newIds)
        newIds.forEach(id => {
          const newNode = findNodeById(items, id)
          if (newNode) {
            console.log(`새 카테고리 [${id}]: ${newNode.name}`)
          }
        })
      }
      
      // 이전 상태 저장
      prevItemsRef.current = items
    }
  }, [items, itemsWithCorrectDepths])

  // 이전 상태 저장용 ref
  const prevItemsRef = useRef<CategoryItem[]>([])

  return (
    <Card className={className}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">카테고리 관리</h3>
            <Badge variant="outline" className="text-xs">
              최대 {maxDepth}단계
            </Badge>
          </div>
          {!disabled && (
            <Button
              variant="default"
              onClick={() => setIsAddingRoot(true)}
              className="gap-1 w-auto"
            >
              <span>+</span>
              루트 카테고리 추가
            </Button>
          )}
        </div>

        {/* Add Root Category Form */}
        {isAddingRoot && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md mb-4">
            <Input
              value={rootAddValue}
              onChange={(e) => setRootAddValue(e.target.value)}
              onKeyDown={handleRootKeyDown}
              placeholder="루트 카테고리 이름"
              className="h-8 text-sm flex-1"
              autoFocus
              disabled={disabled}
            />
            <Button
              variant="ghost"
              size="sm"
              className="w-7 h-7 p-0 text-green-600 hover:text-green-700"
              onClick={handleRootAddSubmit}
              disabled={disabled}
              title="확인"
            >
              ✓
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-7 h-7 p-0 text-red-600 hover:text-red-700"
              onClick={handleRootAddCancel}
              disabled={disabled}
              title="취소"
            >
              ✕
            </Button>
          </div>
        )}

        {/* Category Tree */}
        <div className="space-y-1">
          {itemsWithCorrectDepths.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📁</div>
              <p className="text-sm">등록된 카테고리가 없습니다.</p>
              <p className="text-xs text-gray-400 mt-1">
                루트 카테고리를 추가하여 시작하세요.
              </p>
            </div>
          ) : (
            itemsWithCorrectDepths.map((item) => (
              <CategoryNode
                key={item.id}
                item={item}
                maxDepth={maxDepth}
                onAdd={handleCategoryAdd}
                onUpdate={handleCategoryUpdate}
                onDelete={handleCategoryDelete}
                onMove={handleCategoryMove}
                disabled={disabled}
                enableDragDrop={enableDragDrop}
              />
            ))
          )}
        </div>

        {/* Footer Info */}
        {itemsWithCorrectDepths.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 flex justify-end">
            총 {itemsWithCorrectDepths.reduce((count, item) => {
              return count + getTotalChildrenCount(item) + 1
            }, 0)}개의 카테고리가 등록되어 있습니다.
          </div>
        )}
        </CardContent>
    </Card>

  )
}

export default CategoryComponent
