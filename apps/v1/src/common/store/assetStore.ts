import { create } from 'zustand';
import { api } from '@plug/api-hooks';
import type { AssetResponse } from '@plug/common-services/types';

type AssetStoreState = {
  assets: AssetResponse[];
  selectedAsset: AssetResponse | null;
  isLoading: boolean;
  error: Error | null;
}

type AssetStoreActions = {
  // 조회 작업들
  fetchAssets: () => Promise<void>;
  fetchAssetById: (id: number) => Promise<void>;
  refreshAssets: () => Promise<void>;
  
  // 상태 관리
  setSelectedAsset: (asset: AssetResponse | null) => void;
  clearSelectedAsset: () => void;
  reset: () => void;
}

type AssetStore = AssetStoreState & AssetStoreActions;

export const useAssetStore = create<AssetStore>((set, get) => ({
  // 초기 상태
  assets: [],
  selectedAsset: null,
  isLoading: false,
  error: null,

  // Asset 목록 조회
  fetchAssets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<AssetResponse[]>('assets');
      set({ 
        assets: response.data || [], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching assets:', error);
      set({ 
        error: error as Error, 
        isLoading: false, 
        assets: [] 
      });
    }
  },

  // Asset 상세 조회
  fetchAssetById: async (id: number) => {
    // 캐시된 데이터 먼저 확인
    const existingAsset = get().assets.find(asset => asset.id === id);
    if (existingAsset) {
      set({ selectedAsset: existingAsset, error: null });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await api.get<AssetResponse>(`assets/${id}`);
      set({ 
        selectedAsset: response.data,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching asset:', error);
      set({ 
        error: error as Error, 
        isLoading: false, 
        selectedAsset: null 
      });
    }  },

  // Asset 목록 강제 갱신 (캐시 무시)
  refreshAssets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<AssetResponse[]>('assets');
      set({ 
        assets: response.data || [], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error refreshing assets:', error);
      set({ 
        error: error as Error, 
        isLoading: false, 
        assets: [] 
      });
    }
  },

  // 선택된 Asset 설정
  setSelectedAsset: (asset: AssetResponse | null) => {
    set({ selectedAsset: asset });
  },

  // 선택된 Asset 클리어
  clearSelectedAsset: () => {
    set({ selectedAsset: null });
  },

  // 전체 상태 초기화
  reset: () => {
    set({
      assets: [],
      selectedAsset: null,
      isLoading: false,
      error: null
    });
  }
}));
