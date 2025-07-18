import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/backoffice/common/view/layouts'
import { CategoryComponent, CategoryItem } from '@/backoffice/common/view/components/category'
import { findNodeById, isDescendant } from '@/backoffice/common/services/hooks/useCategory'
import { 
  useAssetCategoryTree,
  useCreateAssetCategory,
  updateAssetCategory,
  deleteAssetCategory,
  useFileUploadWithInfo
} from '@plug/common-services'
import type { AssetCategoryResponse, FileResponse } from '@plug/common-services'
import { toast } from '@plug/ui'

const convertToCategoryItems = (apiData: AssetCategoryResponse[]): CategoryItem[] => {
  return apiData.map(item => ({
    id: item.id.toString(),
    name: item.name,
    code: item.code,
    depth: item.depth,
    parentId: item.parentId?.toString(),
    thumbnailUrl: item.thumbnail?.url,
    thumbnailFileId: item.thumbnail?.id,
    children: item.children && item.children.length > 0 
      ? convertToCategoryItems(item.children) 
      : undefined
  }))
}

const AssetCategory: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const { categories: apiCategories, maxDepth, error, isLoading: treeLoading, mutate } = useAssetCategoryTree()
  const createAssetCategory = useCreateAssetCategory()
  const fileUpload = useFileUploadWithInfo()

  useEffect(() => {
    if (apiCategories.length > 0) {
      const convertedCategories = convertToCategoryItems(apiCategories)
      setCategories(convertedCategories)
    } else {
      setCategories([])
    }
  }, [apiCategories])

  const handleCategoryAdd = async (name: string, parentId?: string, thumbnailFileId?: number, code?: string): Promise<string> => {
    try {
      const parentIdNumber = parentId ? parseInt(parentId) : undefined
      const result = await createAssetCategory.execute({
        name,
        code: code || name.toLowerCase().replace(/\s+/g, '-'),
        parentId: parentIdNumber,
        thumbnailFileId
      })

      if (result?.response?.status !== 201) {
        throw new Error('카테고리 생성에 실패했습니다.')
      }
      
      await mutate();
      return result.response.headers.get('Location') || '';
      
    } catch (error) {
      console.error('카테고리 추가 실패:', error)
      throw error
    }
  }

  // 카테고리 수정
  const handleCategoryUpdate = async (id: string, name: string, thumbnailFileId?: number, code?: string): Promise<void> => {
    try {
      const categoryId = parseInt(id)
      await updateAssetCategory(categoryId, {
        name,
        code: code || name.toLowerCase().replace(/\s+/g, '-'), 
        thumbnailFileId
      })
      await mutate()
    } catch (error) {
      console.error('카테고리 수정 실패:', error)
      throw error
    }
  }

  const handleCategoryDelete = async (id: string): Promise<void> => {
    try {
      const categoryId = parseInt(id)
      
      await deleteAssetCategory(categoryId)
      await mutate()
    } catch (error: unknown) {
      const errorObj = error as { status?: number; message?: string }
      if (errorObj?.status === 400 || errorObj?.message?.includes('하위') || errorObj?.message?.includes('children')) {
        toast.error('하위 카테고리가 있는 카테고리는 삭제할 수 없습니다', {
          description: '하위 카테고리를 먼저 삭제해주세요.'
        })
      } else if (errorObj?.status === 409) {
        toast.error('카테고리를 삭제할 수 없습니다', {
          description: '다른 데이터에서 사용 중인 카테고리입니다.'
        })
      } else {
        toast.error('카테고리 삭제에 실패했습니다', {
          description: errorObj?.message || '알 수 없는 오류가 발생했습니다.'
        })
      }
      
      throw error
    }
  }

  const handleCategoryMove = async (
    draggedId: string, 
    targetId: string, 
    position: 'before' | 'after' | 'inside'
  ): Promise<void> => {
    try {
      const draggedCategory = findNodeById(categories, draggedId)
      const targetCategory = findNodeById(categories, targetId)
      
      if (!draggedCategory) {
        throw new Error('이동할 카테고리를 찾을 수 없습니다.')
      }
      
      let newParentId: number | undefined
      
      if (position === 'inside') {
        newParentId = targetCategory ? parseInt(targetId) : undefined
      } else {
        newParentId = targetCategory?.parentId ? parseInt(targetCategory.parentId) : undefined
      }
      
      if (newParentId && targetCategory && isDescendant(draggedCategory, targetId)) {
        toast.error('카테고리를 이동할 수 없습니다', {
          description: '자기 자신이나 하위 카테고리로는 이동할 수 없습니다.'
        })
        return
      }
      
      const categoryId = parseInt(draggedId)
      
      await updateAssetCategory(categoryId, {
        name: draggedCategory.name,
        code: draggedCategory.code || draggedCategory.name.toLowerCase().replace(/\s+/g, '-'),
        parentId: newParentId,
        thumbnailFileId: draggedCategory.thumbnailFileId
      })

      await mutate()
      
    } catch (error) {
      const errorObj = error as { status?: number; message?: string }
      if (errorObj?.status === 400) {
        toast.error('카테고리 이동에 실패했습니다', {
          description: errorObj?.message || '잘못된 요청입니다.'
        })
      } else if (errorObj?.status === 404) {
        toast.error('이동할 카테고리를 찾을 수 없습니다')
      } else {
        toast.error('카테고리 이동에 실패했습니다', {
          description: errorObj?.message || '알 수 없는 오류가 발생했습니다.'
        })
      }
      
      throw error
    }
  }

  const handleThumbnailUpload = async (file: File): Promise<number> => {
    try {
      const fileInfo: FileResponse = await fileUpload.execute(file);

      if (!fileInfo?.id) {
        toast.error('파일 업로드 실패', {
          description: '파일 정보를 가져올 수 없습니다.'
        })
        throw new Error('파일 업로드 후 파일 정보를 가져올 수 없습니다.')
      }

      return fileInfo.id
    } catch (error) {
      console.error('썸네일 업로드 실패:', error)
      toast.error('썸네일 업로드 실패', {
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      })
      throw error
    }
  }

  const isLoading = treeLoading
  const hasError = !!error

  return (
    <PageContainer title="Asset Category">
      <div className="space-y-6">
        {/* 카테고리 관리 컴포넌트 */}
        {!isLoading && !hasError && (
          <CategoryComponent
            items={categories}
            maxDepth={maxDepth}
            title="자산 카테고리 관리"
            emptyMessage="등록된 자산 카테고리가 없습니다."
            onAdd={handleCategoryAdd}
            onUpdate={handleCategoryUpdate}
            onDelete={handleCategoryDelete}
            onMove={handleCategoryMove}
            onThumbnailUpload={handleThumbnailUpload}
            enableDragDrop={true}
            disabled={createAssetCategory.isLoading}
            thumbnailSize="large"
          />
        )}
      </div>
    </PageContainer>
  )
}

export default AssetCategory
