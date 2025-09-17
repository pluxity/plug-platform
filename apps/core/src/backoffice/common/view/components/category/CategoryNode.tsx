import React, { useState } from 'react'

import {
  Button,
  Input,
  Badge,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@plug/ui'

import { CategoryItem, DragState } from '@/backoffice/common/services/types/category'
import { getChildrenCount } from '@/backoffice/common/services/hooks/useCategory'

import { ThumbnailUploader } from './ThumbnailUploader'
import {
  Check,
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

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
  enableThumbnail?: boolean
  thumbnailSize?: 'small' | 'medium' | 'large'
  enableCodes?: boolean
  classname?: string
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
                                                            enableThumbnail = false,
                                                            thumbnailSize = 'small',
                                                            enableCodes = true, classname,
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
    large: 'w-16 h-16'
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
      setDragOver(item.depth <= maxDepth ? 'inside' : 'none')
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
  const canAddChildren = item.depth <= maxDepth

  return (
    <div className="relative">
      {enableDragDrop && dragOver === "top" && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />
      )}
      {enableDragDrop && dragOver === "bottom" && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />
      )}

      <div
        className={[
          "group relative flex items-center gap-3 rounded-lg bg-secondary-400/70",
          "transition-colors duration-200 hover:bg-secondary-400",
          isDragging ? "opacity-60 ring-2 ring-secondary-300" : "",
          dragOver === "inside"
            ? "bg-blue-50/40 ring-2 ring-secondary-300"
            : "",
          classname,
        ].join(" ")}
        style={{
          padding: "12px",
          paddingLeft: "24x",
          paddingRight: "20px",
        }}
        draggable={enableDragDrop && !disabled}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {enableDragDrop && !disabled && (
          <div className="flex-shrink-0 cursor-move text-gray-400 hover:text-gray-600">
            ⋮⋮
          </div>
        )}

        <div className="flex w-6 flex-shrink-0 justify-center">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onClick={handleToggleExpand}
              disabled={disabled}
              title={isExpanded ? "접기" : "펼치기"}
            >
              <div
                className="transform transition-transform duration-200"
                style={{
                  transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-6 w-6" />
                ) : (
                  <ChevronRight className="h-6 w-6" />
                )}
              </div>
            </Button>
          ) : (
            <div className="h-6 w-6" />
          )}
        </div>

        <div className="min-w-0 flex flex-1 items-center gap-3">
          {isEditing ? (
            <div className="flex flex-1 justify-between items-end">
              <div className="flex items-center gap-5">
                {enableThumbnail && (
                  <ThumbnailUploader
                    currentThumbnailUrl={item.thumbnailUrl}
                    onThumbnailChange={setEditThumbnailFileId}
                    onUpload={onThumbnailUpload}
                    disabled={disabled}
                    size={thumbnailSize}
                  />
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1 items-center">
                    <div className="text-xs font-medium text-gray-700 w-28">
                      카테고리 이름
                    </div>
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, "edit")}
                      className="h-9 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                      placeholder="카테고리 이름"
                      autoFocus
                      disabled={disabled}
                    />
                  </div>

                  {enableCodes && (
                    <div className="flex gap-1 items-center">
                      <div className="text-xs font-medium text-gray-700 w-28">
                        카테고리 아이디
                      </div>
                      <Input
                        value={editCode}
                        onChange={(e) => setEditCode(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "edit")}
                        className="h-8 text-xs placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                        placeholder="카테고리 코드"
                        disabled={disabled}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={handleEditSubmit}
                  disabled={disabled}
                  title="확인"
                >
                  <Check />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleEditCancel}
                  disabled={disabled}
                  title="취소"
                >
                  <X />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="min-w-0 flex flex-1 items-center gap-3">
                {enableThumbnail && item.thumbnailUrl && (
                  <div className="group/thumbnail relative flex-shrink-0">
                    <img
                      src={item.thumbnailUrl}
                      alt={`${item.name} thumbnail`}
                      className={`${sizeClasses[thumbnailSize]} rounded-md object-cover `}
                    />
                    <div className="pointer-events-none absolute left-full top-0 z-50 ml-3 opacity-0 transition-opacity duration-200 group-hover/thumbnail:opacity-100">
                      <div className="w-44 rounded-lg border border-gray-200 bg-white p-2 shadow-xl">
                        <img
                          src={item.thumbnailUrl}
                          alt={`${item.name} 썸네일 미리보기`}
                          className="h-40 w-40 rounded-md object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="min-w-0 flex flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-gray-900">
                    {item.name}
                  </span>
                  {enableCodes && item.code && (
                    <span className="truncate text-xs text-gray-500">
                      {item.code}
                    </span>
                  )}
                </div>
              </div>

              {getChildrenCount(item) > 0 && (
                <Badge variant="secondary" className="bg-white mr-5">
                  {getChildrenCount(item)}개 하위 카테고리
                </Badge>
              )}
            </>
          )}
        </div>

        {!isEditing && !disabled && (
          <div className="flex flex-shrink-0 items-center gap-2">
            {canAddChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-blue-600 bg-primary-300 hover:bg-primary-400 hover:text-blue-700"
                onClick={() => setIsAdding(true)}
                disabled={item.depth >= maxDepth}
                title="하위 카테고리 추가"
              >
                <Plus />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 text-gray-600 bg-secondary-400 hover:bg-secondary-500 hover:text-gray-700"
              onClick={() => setIsEditing(true)}
              title="카테고리 수정"
            >
              <Pencil />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={[
                    "h-8 w-8 p-0",
                    item.children && item.children.length > 0
                      ? "cursor-not-allowed text-gray-400"
                      : "text-red-600 bg-destructive-200 hover:bg-destructive-400 hover:text-red-700",
                  ].join(" ")}
                  disabled={!!(item.children && item.children.length > 0)}
                  title={
                    item.children && item.children.length > 0
                      ? `하위 카테고리 ${item.children!.length}개가 있어 삭제할 수 없습니다`
                      : "카테고리 삭제"
                  }
                >
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>"{item.name}"</strong> 카테고리를 삭제하시겠습니까?
                    <br />이 작업은 되돌릴 수 없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(item.id)}>
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
          className="flex gap-2.5"
          style={{ marginLeft: `${item.depth * 24 + 12}px` }}
        >
          <CornerDownRight className="mt-3 text-secondary-700" />
          <div className="mt-2 rounded-lg bg-secondary-200 p-4 flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-3">
              <Input
                value={addValue}
                onChange={(e) => setAddValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "add")}
                placeholder="새 카테고리 이름"
                className="h-9 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                autoFocus
                disabled={disabled}
              />
              {enableCodes && (
                <Input
                  value={addCode}
                  onChange={(e) => setAddCode(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "add")}
                  placeholder="새 카테고리 코드"
                  className="h-8 text-xs placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                  disabled={disabled}
                />
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              {enableThumbnail && (
                <ThumbnailUploader
                  onThumbnailChange={setAddThumbnailFileId}
                  onUpload={onThumbnailUpload}
                  disabled={disabled}
                  size={thumbnailSize}
                />
              )}
              <div className="flex-1" />
              <Button
                onClick={handleAddSubmit}
                disabled={disabled}
              >
                수정
              </Button>
              <Button
                variant="secondary"
                onClick={handleAddCancel}
                disabled={disabled}
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}

      {hasChildren && (
        <div className={isExpanded ? "mx-1.5" : "hidden"}>
          <div>
            <div className="rounded-b-lg bg-secondary-100/70 overflow-hidden">
              <div className="p-2 pr-0">
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
                    enableCodes={enableCodes}
                    enableThumbnail={enableThumbnail}
                    classname="!bg-secondary-100/70 border-none"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
