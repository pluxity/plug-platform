// Category 관련 컴포넌트들과 타입들을 내보내는 메인 인덱스 파일

// 컴포넌트들
export { CategoryComponent } from './CategoryComponent'
export { CategoryNode } from './CategoryNode'
export { ThumbnailUploader } from './ThumbnailUploader'

// 기본 export
export { CategoryComponent as default } from './CategoryComponent'

// 타입들
export type { CategoryComponentProps } from './CategoryComponent'
export type { CategoryNodeProps } from './CategoryNode'
export type { ThumbnailUploaderProps } from './ThumbnailUploader'

// 공통 타입들도 re-export
export type { 
  CategoryItem, 
  CategoryOperations, 
  CategoryConfig, 
  BaseCategoryItem,
  DragPosition,
  DragState 
} from '@/backoffice/common/services/types/category'

// Hook도 re-export
export { 
  useCategory,
  findNodeById,
  recalculateDepths,
  getChildrenCount,
  getTotalChildrenCount,
  getMaxDepthOfTree
} from '@/backoffice/common/services/hooks/useCategory'
