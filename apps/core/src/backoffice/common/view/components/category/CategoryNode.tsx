import React, { useState } from 'react'
import { Button, Input, Badge, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@plug/ui'
import { CategoryItem, DragState } from '@/backoffice/common/services/types/category'
import { ThumbnailUploader } from './ThumbnailUploader'
import { getChildrenCount } from '@/backoffice/common/services/hooks/useCategory'

export interface CategoryNodeProps {
  item: CategoryItem
  maxDepth: number
  onAdd: (name: string, parentId?: string, thumbnailFileId?: number, code?: string) => void
  onUpdate: (id: string, name: string, thumbnailFileId?: number, code?: string) => void
  onDelete: (id: string) => void
  onMove?: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void
  onThumbnailUpload?: (file: File) => Promise<number>
  disabled?: boolean
  enableDragDrop?: boolean
  thumbnailSize?: 'small' | 'medium' | 'large'
  showCodes?: boolean
}

export const CategoryNode: React.FC<CategoryNodeProps> = ({
  item,
  maxDepth,
  onAdd,
  onUpdate,
  onDelete,
  onMove,
  onThumbnailUpload,
  disabled = false,
  enableDragDrop = true,
  thumbnailSize = 'small',
  showCodes = true
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editValue, setEditValue] = useState(item.name)
  const [editCode, setEditCode] = useState(item.code || '')
  const [addValue, setAddValue] = useState('')
  const [addCode, setAddCode] = useState('')
  const [dragOver, setDragOver] = useState<DragState>('none')
  const [isDragging, setIsDragging] = useState(false)
  const [editThumbnailFileId, setEditThumbnailFileId] = useState<number | undefined>(item.thumbnailFileId)
  const [addThumbnailFileId, setAddThumbnailFileId] = useState<number | undefined>()

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  }

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleEditSubmit = () => {
    if (editValue.trim()) {
      onUpdate(item.id, editValue.trim(), editThumbnailFileId, editCode.trim() || undefined)
      setIsEditing(false)
    }
  }

  const handleEditCancel = () => {
    setEditValue(item.name)
    setEditCode(item.code || '')
    setEditThumbnailFileId(item.thumbnailFileId)
    setIsEditing(false)
  }

  const handleAddSubmit = () => {
    if (addValue.trim()) {
      onAdd(addValue.trim(), item.id, addThumbnailFileId, addCode.trim() || undefined)
      setAddValue('')
      setAddCode('')
      setAddThumbnailFileId(undefined)
      setIsAdding(false)
    }
  }

  const handleAddCancel = () => {
    setAddValue('')
    setAddCode('')
    setAddThumbnailFileId(undefined)
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
        {enableDragDrop && !disabled && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-move text-gray-400 hover:text-gray-600">
            ⋮⋮
          </div>
        )}
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

        <div className="flex-1 flex items-center gap-2">
          {isEditing ? (
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex flex-col gap-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'edit')}
                  className="h-7 text-sm"
                  placeholder="카테고리 이름"
                  autoFocus
                  disabled={disabled}
                />
                {showCodes && (
                  <Input
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'edit')}
                    className="h-6 text-xs"
                    placeholder="카테고리 코드"
                    disabled={disabled}
                  />
                )}
              </div>
              <div className="flex items-center gap-1">
                <ThumbnailUploader
                  currentThumbnailUrl={item.thumbnailUrl}
                  onThumbnailChange={setEditThumbnailFileId}
                  onUpload={onThumbnailUpload}
                  disabled={disabled}
                  size={thumbnailSize}
                />
                <div className="flex-1" />
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
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                {item.thumbnailUrl && (
                  <div className="relative group/thumbnail">
                    <img
                      src={item.thumbnailUrl}
                      alt={`${item.name} thumbnail`}
                      className={`${sizeClasses[thumbnailSize]} object-cover rounded border`}
                    />
                    <div className="absolute left-full top-0 ml-2 opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                      <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-2 w-44">
                        <img
                          src={item.thumbnailUrl}
                          alt={`${item.name} 썸네일 미리보기`}
                          className="w-40 h-40 object-cover rounded"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {item.name}
                  </span>
                  {showCodes && item.code && (
                    <span className="text-xs text-gray-500">
                      {item.code}
                    </span>
                  )}
                </div>
              </div>
              {getChildrenCount(item) > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getChildrenCount(item)}개의 하위 카테고리
                </Badge>
              )}
            </>
          )}
        </div>

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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-6 h-6 p-0 ${
                    hasChildren
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-red-600 hover:text-red-700'
                  }`}
                  disabled={hasChildren}
                  title={
                    hasChildren
                      ? `하위 카테고리 ${item.children!.length}개가 있어 삭제할 수 없습니다`
                      : '카테고리 삭제'
                  }
                >
                  🗑
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>"{item.name}"</strong> 카테고리를 삭제하시겠습니까?
                    <br />
                    이 작업은 되돌릴 수 없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {isAdding && (
        <div 
          className="flex flex-col gap-2 p-3 bg-blue-50 rounded-md ml-2"
          style={{ paddingLeft: `${(item.depth + 1) * 20 + 8}px` }}
        >
          <div className="flex flex-col gap-1">
            <Input
              value={addValue}
              onChange={(e) => setAddValue(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'add')}
              placeholder="새 카테고리 이름"
              className="h-7 text-sm"
              autoFocus
              disabled={disabled}
            />
            {showCodes && (
              <Input
                value={addCode}
                onChange={(e) => setAddCode(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'add')}
                placeholder="새 카테고리 코드"
                className="h-6 text-xs"
                disabled={disabled}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThumbnailUploader
              onThumbnailChange={setAddThumbnailFileId}
              onUpload={onThumbnailUpload}
              disabled={disabled}
              size={thumbnailSize}
            />
            <div className="flex-1" />
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
        </div>
      )}

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
              onThumbnailUpload={onThumbnailUpload}
              disabled={disabled}
              enableDragDrop={enableDragDrop}
              thumbnailSize={thumbnailSize}
              showCodes={showCodes}
            />
          ))}
        </div>
      )}
    </div>
  )
}
