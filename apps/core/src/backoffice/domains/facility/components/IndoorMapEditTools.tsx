import React, { useState, useEffect } from 'react'
import { Button } from '@plug/ui'
import { Move, RotateCcw, Scale, Square, Trash } from 'lucide-react'
import { Poi } from '@plug/engine/src'

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

  const handleFinishEdit = () => {
    try {
      if (isDeleteMode) {
        // 삭제 모드 종료
        setIsDeleteMode(false)
      } else if (isEditing) {
        // 일반 편집 모드 종료
        Poi.FinishEdit()
        setIsEditing(false)
        setEditMode(null)
      }
    } catch (error) {
      console.error('편집 종료 중 오류:', error)
    }
  }

  const handleStartEdit = (mode: 'translate' | 'rotate' | 'scale') => {
    try {
      // 현재 편집 중이면 먼저 종료
      if (isEditing) {
        Poi.FinishEdit()
      }
      
      // 삭제 모드가 활성화되어 있다면 종료
      if (isDeleteMode) {
        setIsDeleteMode(false) 
        onDeleteMode?.(false)
      }
      
      // 새로운 편집 시작
      Poi.StartEdit(mode)
      setIsEditing(true)
      setEditMode(mode)
    } catch (error) {
      console.error('편집 시작 중 오류:', error)
    }
  }

  const handleStartDeleteMode = () => {
    try {
      // 현재 편집 중이면 먼저 종료
      if (isEditing) {
        Poi.FinishEdit()
        setIsEditing(false)
        setEditMode(null)
      }
      
      // 삭제 모드 시작
      setIsDeleteMode(true)   
      onDeleteMode?.(true)
    } catch (error) {
      console.error('삭제 모드 시작 중 오류:', error)
    }
  }

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
  }, [isEditing, isDeleteMode]) // 변경될 때마다 effect 재실행

  const isActiveMode = (mode: 'translate' | 'rotate' | 'scale') => {
    return isEditing && editMode === mode
  }

  return (
    <div className={`flex gap-2 bg-transparent ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => isActiveMode('translate') ? handleFinishEdit() : handleStartEdit('translate')}
        className={`
          h-11 w-11 p-0 rounded-xl transition-all duration-200 ease-out group relative overflow-hidden
          ${isActiveMode('translate') 
            ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/40 scale-110 ring-2 ring-blue-300/50' 
            : 'bg-gradient-to-br from-cyan-100 to-blue-100 hover:from-cyan-200 hover:to-blue-200 text-cyan-700 hover:text-blue-700 hover:scale-105 shadow-md hover:shadow-lg'
          }
        `}
        title={isActiveMode('translate') ? '위치 편집 종료' : '위치 편집 시작'}
      >
        <Move size={18} className={`transition-transform duration-200 ${isActiveMode('translate') ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-110'}`} />
        {isActiveMode('translate') && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl animate-pulse" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => isActiveMode('rotate') ? handleFinishEdit() : handleStartEdit('rotate')}
        className={`
          h-11 w-11 p-0 rounded-xl transition-all duration-200 ease-out group relative overflow-hidden
          ${isActiveMode('rotate') 
            ? 'bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/40 scale-110 ring-2 ring-emerald-300/50' 
            : 'bg-gradient-to-br from-emerald-100 to-green-100 hover:from-emerald-200 hover:to-green-200 text-emerald-700 hover:text-green-700 hover:scale-105 shadow-md hover:shadow-lg'
          }
        `}
        title={isActiveMode('rotate') ? '회전 편집 종료' : '회전 편집 시작'}
      >
        <RotateCcw size={18} className={`transition-transform duration-200 ${isActiveMode('rotate') ? 'scale-110 animate-spin drop-shadow-sm' : 'group-hover:scale-110 group-hover:rotate-12'}`} />
        {isActiveMode('rotate') && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl animate-pulse" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => isActiveMode('scale') ? handleFinishEdit() : handleStartEdit('scale')}
        className={`
          h-11 w-11 p-0 rounded-xl transition-all duration-200 ease-out group relative overflow-hidden
          ${isActiveMode('scale') 
            ? 'bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 text-white shadow-xl shadow-purple-500/40 scale-110 ring-2 ring-purple-300/50' 
            : 'bg-gradient-to-br from-violet-100 to-purple-100 hover:from-violet-200 hover:to-purple-200 text-violet-700 hover:text-purple-700 hover:scale-105 shadow-md hover:shadow-lg'
          }
        `}
        title={isActiveMode('scale') ? '크기 편집 종료' : '크기 편집 시작'}
      >
        <Scale size={18} className={`transition-transform duration-200 ${isActiveMode('scale') ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-110'}`} />
        {isDeleteMode && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl animate-pulse" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => isDeleteMode ? handleFinishEdit() : handleStartDeleteMode()}
        className={`
          h-11 w-11 p-0 rounded-xl transition-all duration-200 ease-out group relative overflow-hidden
          ${isDeleteMode 
            ? 'bg-gradient-to-br from-red-400 via-pink-500 to-red-600 text-white shadow-xl shadow-red-500/40 scale-110 ring-2 ring-red-300/50' 
            : 'bg-gradient-to-br from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 text-red-700 hover:text-pink-700 hover:scale-105 shadow-md hover:shadow-lg'
          }
        `}
        title={isDeleteMode ? '삭제 모드 종료' : '삭제 모드 시작'}
      >
        <Trash size={18} className={`transition-transform duration-200 ${isDeleteMode ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-110'}`} />
        {isDeleteMode && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl animate-pulse" />
        )}
      </Button>
      
      {(isEditing || isDeleteMode) && (
        <div className="w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-1 self-stretch" />
      )}
      
      {(isEditing || isDeleteMode) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFinishEdit}
          className="
            h-11 w-11 p-0 rounded-xl transition-all duration-200 ease-out group relative overflow-hidden
            bg-gradient-to-br from-rose-400 via-red-500 to-pink-600 text-white shadow-xl shadow-red-500/40 hover:from-rose-500 hover:via-red-600 hover:to-pink-700 hover:scale-105 ring-2 ring-red-300/50
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