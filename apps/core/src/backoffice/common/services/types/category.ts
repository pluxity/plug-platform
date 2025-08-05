export interface BaseCategoryItem {
  id: string
  name: string
  code?: string
  depth: number
  parentId?: string
  thumbnailUrl?: string
  thumbnailFileId?: number
}

export interface CategoryItem extends BaseCategoryItem {
  children?: CategoryItem[]
}

export interface CategoryOperations {
  onAdd?: (name: string, parentId?: string, thumbnailFileId?: number, code?: string) => Promise<string> | string
  onUpdate?: (id: string, name: string, thumbnailFileId?: number, code?: string) => Promise<void> | void
  onDelete?: (id: string) => Promise<void> | void
  onMove?: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => Promise<void> | void
  onIdUpdate?: (tempId: string, newId: string) => void
  onThumbnailUpload?: (file: File) => Promise<number>
}

export interface CategoryConfig {
  maxDepth?: number
  enableDragDrop?: boolean
  thumbnailSize?: 'small' | 'medium' | 'large'
  disabled?: boolean
  showCodes?: boolean
  allowRootAdd?: boolean
  enableThumbnailUpload?: boolean
}

export type DragPosition = 'before' | 'after' | 'inside'
export type DragState = 'none' | 'top' | 'bottom' | 'inside'