import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface MapLoadingState {
  isLoading: boolean
  loadingMessage: string
  fromMode: string
  toMode: string
  
  startTransition: (from: string, to: string, message?: string) => void
  endTransition: () => void
  setLoadingMessage: (message: string) => void
}

export const useMapLoadingStore = create<MapLoadingState>()(
  devtools(
    (set) => ({
      isLoading: false,
      loadingMessage: '로딩 중...',
      fromMode: '',
      toMode: '',
      
      startTransition: (from: string, to: string, message?: string) => 
        set({ 
          isLoading: true, 
          fromMode: from, 
          toMode: to,
          loadingMessage: message || `${from}에서 ${to}로 전환 중...`
        }),
        
      endTransition: () => 
        set({ 
          isLoading: false, 
          fromMode: '', 
          toMode: '',
          loadingMessage: '로딩 중...'
        }),
        
      setLoadingMessage: (message: string) => 
        set({ loadingMessage: message })
    }),
    { name: 'map-loading-store' }
  )
)
