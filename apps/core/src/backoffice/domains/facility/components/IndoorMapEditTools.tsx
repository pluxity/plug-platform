import { Move, RotateCcw, Scale, Square, Trash } from 'lucide-react'

import { Poi } from '@plug/engine'

import React, { useState, useEffect, useCallback } from 'react'

import { Button } from '@plug/ui'
interface IndoorMapEditToolsProps {
  className?: string
  onDeleteMode?: (type: boolean) => void
}

type EditMode = 'translate' | 'rotate' | 'scale' | null

export const IndoorMapEditTools: React.FC<IndoorMapEditToolsProps> = ({ 
  className = '',
  onDeleteMode
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editMode, setEditMode] = useState<EditMode>(null)
  const [isDeleteMode, setIsDeleteMode] = useState(false)

  const handleFinishEdit = useCallback(() => {
    try {
      if (isDeleteMode) {
        setIsDeleteMode(false)
        onDeleteMode?.(false)
        return
      }
      if (isEditing) {
        Poi.FinishEdit()
        setIsEditing(false)
        setEditMode(null)
      }
    } catch (error) {
      console.error('편집 종료 중 오류:', error)
    }
  }, [isDeleteMode, isEditing, onDeleteMode])

  const handleStartEdit = useCallback((mode: 'translate' | 'rotate' | 'scale') => {
    try {
      if (isEditing) {
        Poi.FinishEdit()
      }
      if (isDeleteMode) {
        setIsDeleteMode(false)
        onDeleteMode?.(false)
      }
      Poi.StartEdit(mode)
      setIsEditing(true)
      setEditMode(mode)
    } catch (error) {
      console.error('편집 시작 중 오류:', error)
    }
  }, [isEditing, isDeleteMode, onDeleteMode])

  const handleDeleteMode = useCallback(() => {
    try {
      if (isDeleteMode) {
        setIsDeleteMode(false)
        onDeleteMode?.(false)
        return
      }
      if (isEditing) {
        Poi.FinishEdit()
        setIsEditing(false)
        setEditMode(null)
      }
      setIsDeleteMode(true)
      onDeleteMode?.(true)
    } catch (error) {
      console.error('삭제 모드 중 오류:', error)
    }
  }, [isDeleteMode, isEditing, onDeleteMode])

  // ESC 키로 편집 종료
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && (isEditing || isDeleteMode)) {
        handleFinishEdit()
      }
    }

    // 편집 중일 때만 키보드 이벤트 리스너 추가
    if (isEditing || isDeleteMode) {
      document.addEventListener('keydown', handleKeyDown)
    }

    // 클린업 함수
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEditing, isDeleteMode, handleFinishEdit]) 

  const isActiveMode = (mode: 'translate' | 'rotate' | 'scale') => {
    return isEditing && editMode === mode
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => isActiveMode('translate') ? handleFinishEdit() : handleStartEdit('translate')}
        className={`
          h-11 w-11 p-0 transition-all duration-200 ease-out group relative overflow-hidden hover:bg-transparent bg-secondary-600/60
          ${isActiveMode('translate') 
            ? 'liquid-glass bg-primary-700 bg-secondary-800/70 text-primary-foreground  scale-110' 
            : 'liquid-glass group-hover:bg-gradient-to-br group-hover:from-primary-500/60 group-hover:to-primary-600/70'
          }
        `}
        title={isActiveMode('translate') ? '위치 편집 종료' : '위치 편집 시작'}
      >
        <div className={`
          w-full h-full flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 rounded-md  
          ${isActiveMode('translate') 
            ? 'bg-transparent' 
            : 'bg-transparent group-hover:bg-gradient-to-br group-hover:from-primary-500/60 group-hover:to-primary-600/70 text-secondary-100'
          }
        `}>
          <Move size={18} className={`transition-transform duration-200 ${isActiveMode('translate') ? 'scale-110 drop-shadow-sm text-secondary-100' : 'group-hover:scale-110'}`} />
        </div>
        {isActiveMode('translate') && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/70 to-primary-500/30 rounded-xl animate-pulse" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => isActiveMode('rotate') ? handleFinishEdit() : handleStartEdit('rotate')}
        className={`
          h-11 w-11 p-0 transition-all duration-200 ease-out group relative overflow-hidden hover:bg-transparent bg-secondary-600/60
          ${isActiveMode('rotate') 
            ? 'liquid-glass bg-primary-700 text-primary-foreground bg-primary-300/50 scale-110' 
            : 'liquid-glass group-hover:bg-gradient-to-br group-hover:from-primary-500/60 group-hover:to-primary-600/70'
          }
        `}
        title={isActiveMode('rotate') ? '회전 편집 종료' : '회전 편집 시작'}
      >
        <div className={`
          w-full h-full flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 rounded-md 
          ${isActiveMode('rotate') 
            ? 'bg-transparent' 
            : 'bg-transparent group-hover:bg-gradient-to-br group-hover:from-primary-500/60 group-hover:to-primary-600/70 text-secondary-100'
          }
        `}>
          <RotateCcw size={18} className={`transition-transform duration-200 ${isActiveMode('rotate') ? 'scale-110 animate-spin drop-shadow-sm text-secondary-100' : 'group-hover:scale-110 group-hover:rotate-12'}`} />
        </div>
        {isActiveMode('rotate') && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/70 to-primary-500/30 rounded-xl animate-pulse" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => isActiveMode('scale') ? handleFinishEdit() : handleStartEdit('scale')}
        className={`
          h-11 w-11 p-0 transition-all duration-200 ease-out group relative overflow-hidden hover:bg-transparent bg-secondary-600/60
          ${isActiveMode('scale') 
            ? 'liquid-glass bg-primary-700 text-primary-foreground bg-primary-300/50 scale-110' 
            : 'liquid-glass group-hover:bg-gradient-to-br group-hover:from-primary-500/60 group-hover:to-primary-600/70'
          }
        `}
        title={isActiveMode('scale') ? '크기 편집 종료' : '크기 편집 시작'}
      >
        <div className={`
          w-full h-full flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 rounded-md 
          ${isActiveMode('scale') 
            ? 'bg-transparent' 
            : 'bg-transparent group-hover:bg-gradient-to-br group-hover:from-primary-500/60 group-hover:to-primary-600/70 text-secondary-100'
          }
        `}>
          <Scale size={18} className={`transition-transform duration-200 ${isActiveMode('scale') ? 'scale-110 drop-shadow-sm text-secondary-100' : 'group-hover:scale-110'}`} />
        </div>
        {isActiveMode('scale') && (
           <div className="absolute inset-0 bg-gradient-to-br from-primary-600/70 to-primary-500/30 rounded-xl animate-pulse" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDeleteMode}
        className={`
          h-11 w-11 p-0 transition-all duration-200 ease-out group relative overflow-hidden hover:bg-transparent bg-secondary-600/60
          ${isDeleteMode 
            ? 'liquid-glass bg-primary-700 text-primary-foreground bg-primary-300/50 scale-110' 
            : 'liquid-glass group-hover:bg-gradient-to-br group-hover:from-primary-500/60 group-hover:to-primary-600/70'
          }
        `}
        title={isDeleteMode ? '삭제 모드 종료' : '삭제 모드 시작'}
      >
        <div className={`
          w-full h-full flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 rounded-md 
          ${isDeleteMode 
            ? 'bg-transparent' 
            : 'bg-transparent group-hover:bg-gradient-to-br group-hover:from-primary-500/60 group-hover:to-primary-600/70 text-secondary-100'
          }
        `}>
          <Trash size={18} className={`transition-transform duration-200 ${isDeleteMode ? 'scale-110 drop-shadow-sm text-secondary-100' : 'group-hover:scale-110'}`} />
        </div>
        {isDeleteMode && (
           <div className="absolute inset-0 bg-gradient-to-br from-primary-600/70 to-primary-500/30 rounded-xl animate-pulse" />
        )}
      </Button>

      {(isEditing || isDeleteMode) && (
        <div className="w-px bg-gradient-to-b from-transparent via-border to-transparent mx-1 self-stretch" />
      )}
      
      {(isEditing || isDeleteMode) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFinishEdit}
          className="
            h-11 w-11 p-0 transition-all duration-200 ease-out group relative overflow-hidden hover:bg-transparent hover:text-secondary-100
            liquid-glass bg-danger-600 text-danger-foreground hover:bg-danger-700 ring-2 ring-danger-300/60
          "
          title="편집 종료 (ESC)"
        >
          <Square size={18} className="transition-transform duration-200 group-hover:scale-110 drop-shadow-sm" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl animate-pulse" />
        </Button>
      )}
    </div>
  )
}