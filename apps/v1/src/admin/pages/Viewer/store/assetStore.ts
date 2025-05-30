import { create } from 'zustand';
import { api } from '@plug/api-hooks';
import type { Asset } from '../types/asset'; // Asset 타입을 가져옵니다.

interface AssetStoreState {
  assets: Asset[];
  selectedAsset: Asset | null;
  isLoading: boolean;
  error: Error | null;
  fetchAssets: () => Promise<void>;
  fetchAssetById: (id: number) => void;
  clearSelectedAsset: () => void;
}

export const useAssetStore = create<AssetStoreState>((set, get) => ({
  assets: [],
  selectedAsset: null,
  isLoading: false,
  error: null,
  fetchAssets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Asset[]>('assets'); // API 엔드포인트는 실제 환경에 맞게 조정해주세요.
      set({ assets: response.data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching assets:', error);
      set({ error: error as Error, isLoading: false, assets: [] });
    }
  },
  fetchAssetById: (id: number) => {
    const existingAsset = get().assets.find(asset => asset.id === id);
    if (existingAsset) {
      set({ selectedAsset: existingAsset, isLoading: false, error: null });
      return;
    }

    set({ selectedAsset: null, error: null });
  },
  
  clearSelectedAsset: () => {
    set({ selectedAsset: null });
  }
}));
