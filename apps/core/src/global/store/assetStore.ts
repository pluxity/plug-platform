import { create } from 'zustand'
import { useEffect } from 'react'
import {
  useAssetsSWR,
  useAssetCategoriesSWR
} from '@plug/common-services'
import type { 
  AssetResponse, 
  AssetCategoryResponse
} from '@plug/common-services'

// Asset Store Data Interface
interface AssetStoreData {
  // Asset data
  assets: AssetResponse[]
  assetsFetched: boolean
  isLoadingAssets: boolean
  assetError: string | null

  // Asset Category data
  categories: AssetCategoryResponse[]
  categoriesFetched: boolean
  isLoadingCategories: boolean
  categoryError: string | null
  maxDepth: number

  // Current selected category for navigation
  selectedCategoryId: number | null
  currentCategoryPath: AssetCategoryResponse[]

  // Assets filtered by current category
  filteredAssets: AssetResponse[]
}

// Asset Store Actions Interface
interface AssetStoreActions {
  // Actions for assets
  setAssets: (assets: AssetResponse[]) => void
  setAssetsLoading: (loading: boolean) => void
  setAssetError: (error: string | null) => void
  setAssetsFetched: (fetched: boolean) => void

  // Actions for categories
  setCategories: (categories: AssetCategoryResponse[]) => void
  setCategoriesLoading: (loading: boolean) => void
  setCategoryError: (error: string | null) => void
  setCategoriesFetched: (fetched: boolean) => void
  setMaxDepth: (depth: number) => void

  // Navigation actions
  setSelectedCategoryId: (categoryId: number | null) => void
  navigateToCategory: (categoryId: number | null) => void
  goToParentCategory: () => void
  goToRootCategory: () => void

  // Utility functions
  getAllAssets: () => AssetResponse[]
  getAssetById: (id: number) => AssetResponse | undefined
  getAssetsByCategory: (categoryId: number) => AssetResponse[]
  getCategoryById: (id: number) => AssetCategoryResponse | undefined
  getCategoryChildren: (categoryId: number) => AssetCategoryResponse[]
  hasChildCategories: (categoryId: number) => boolean
  isLeafCategory: (categoryId: number) => boolean
  getRootCategories: () => AssetCategoryResponse[]
  getCategoryPath: (categoryId: number) => AssetCategoryResponse[]

  // Data loading functions
  loadAssets: () => Promise<void>
  loadCategories: () => Promise<void>
  refreshData: () => Promise<void>
}

// Combined Asset Store State
type AssetState = AssetStoreData & AssetStoreActions

export const useAssetStore = create<AssetState>()(
  (set, get) => ({
    // Initial state
    assets: [],
    assetsFetched: false,
    isLoadingAssets: false,
    assetError: null,

    categories: [],
    categoriesFetched: false,
    isLoadingCategories: false,
    categoryError: null,
    maxDepth: 0,

    selectedCategoryId: null,
    currentCategoryPath: [],
    filteredAssets: [],

    // Asset actions
    setAssets: (assets: AssetResponse[]) => {
      const { selectedCategoryId } = get()
      const filteredAssets = selectedCategoryId 
        ? assets.filter(asset => asset.categoryId === selectedCategoryId)
        : assets
      
      set({ assets, filteredAssets })
    },
    setAssetsLoading: (isLoadingAssets: boolean) => set({ isLoadingAssets }),
    setAssetError: (assetError: string | null) => set({ assetError }),
    setAssetsFetched: (assetsFetched: boolean) => set({ assetsFetched }),

    // Category actions
    setCategories: (categories: AssetCategoryResponse[]) => set({ categories }),
    setCategoriesLoading: (isLoadingCategories: boolean) => set({ isLoadingCategories }),
    setCategoryError: (categoryError: string | null) => set({ categoryError }),
    setCategoriesFetched: (categoriesFetched: boolean) => set({ categoriesFetched }),
    setMaxDepth: (maxDepth: number) => set({ maxDepth }),

    // Navigation actions
    setSelectedCategoryId: (selectedCategoryId: number | null) => {
      const { assets } = get()
      const filteredAssets = selectedCategoryId 
        ? assets.filter(asset => asset.categoryId === selectedCategoryId)
        : assets
      
      set({ selectedCategoryId, filteredAssets })
    },

    navigateToCategory: (categoryId: number | null) => {
      const { categories, assets } = get()
      
      if (categoryId === null) {
        set({ 
          selectedCategoryId: null,
          currentCategoryPath: [],
          filteredAssets: assets
        })
        return
      }

      const category = categories.find(cat => cat.id === categoryId)
      if (!category) return

      const path = get().getCategoryPath(categoryId)
      const filteredAssets = assets.filter(asset => asset.categoryId === categoryId)
      
      set({ 
        selectedCategoryId: categoryId,
        currentCategoryPath: path,
        filteredAssets
      })
    },

    goToParentCategory: () => {
      const { currentCategoryPath } = get()
      if (currentCategoryPath.length <= 1) {
        get().goToRootCategory()
      } else {
        const parentCategory = currentCategoryPath[currentCategoryPath.length - 2]
        get().navigateToCategory(parentCategory.id)
      }
    },

    goToRootCategory: () => {
      get().navigateToCategory(null)
    },

    getAllAssets: () => get().assets,
    getAssetById: (id: number) => {
      const { assets } = get()
      return assets.find(asset => asset.id === id)
    },

    getAssetsByCategory: (categoryId: number) => {
      const { assets } = get()
      return assets.filter(asset => asset.categoryId === categoryId)
    },

    getCategoryById: (id: number) => {
      const { categories } = get()
      return categories.find(category => category.id === id)
    },

    getCategoryChildren: (categoryId: number) => {
      const { categories } = get()
      return categories.filter(category => category.parentId === categoryId)
    },

    hasChildCategories: (categoryId: number) => {
      return get().getCategoryChildren(categoryId).length > 0
    },

    isLeafCategory: (categoryId: number) => {
      return !get().hasChildCategories(categoryId)
    },

    getRootCategories: () => {
      const { categories } = get()
      return categories.filter(category => !category.parentId)
    },

    getCategoryPath: (categoryId: number) => {
      const { categories } = get()
      const path: AssetCategoryResponse[] = []
      let currentId: number | undefined = categoryId

      while (currentId) {
        const category = categories.find(cat => cat.id === currentId)
        if (!category) break
        
        path.unshift(category)
        currentId = category.parentId
      }

      return path
    },

    // Data loading functions
    loadAssets: async () => {
      const { assetsFetched, isLoadingAssets } = get()
      
      if (assetsFetched || isLoadingAssets) {
        return
      }

      set({ isLoadingAssets: true, assetError: null })
      
      try {
        // Note: This should be replaced with actual API call
        // Using SWR hook data would require a different approach
        // For now, this is a placeholder structure
        console.warn('loadAssets: This should be implemented with actual API call')
        
        set({ 
          assetsFetched: true,
          isLoadingAssets: false 
        })
      } catch (error) {
        set({ 
          assetError: error instanceof Error ? error.message : 'Failed to load assets',
          isLoadingAssets: false 
        })
      }
    },

    loadCategories: async () => {
      const { categoriesFetched, isLoadingCategories } = get()
      
      if (categoriesFetched || isLoadingCategories) {
        return
      }

      set({ isLoadingCategories: true, categoryError: null })
      
      try {
        // Note: This should be replaced with actual API call
        // Using SWR hook data would require a different approach
        console.warn('loadCategories: This should be implemented with actual API call')
        
        set({ 
          categoriesFetched: true,
          isLoadingCategories: false 
        })
      } catch (error) {
        set({ 
          categoryError: error instanceof Error ? error.message : 'Failed to load categories',
          isLoadingCategories: false 
        })
      }
    },

    refreshData: async () => {
      set({ 
        assetsFetched: false, 
        categoriesFetched: false 
      })
      
      await Promise.all([
        get().loadAssets(),
        get().loadCategories()
      ])
    }
  })
)

// Hook for using asset store with automatic data loading
export const useAssets = () => {
  const store = useAssetStore()
  const { setAssets, setAssetsFetched, setAssetError, setAssetsLoading } = store
  const { data: assetsData, error: assetsError, isLoading: assetsLoading } = useAssetsSWR()
  
  // Sync SWR data with store
  useEffect(() => {
    if (assetsData) {
      setAssets(assetsData)
      setAssetsFetched(true)
    }
  }, [assetsData, setAssets, setAssetsFetched])

  useEffect(() => {
    if (assetsError) {
      setAssetError(assetsError.message || 'Failed to load assets')
    }
  }, [assetsError, setAssetError])

  useEffect(() => {
    setAssetsLoading(assetsLoading)
  }, [assetsLoading, setAssetsLoading])
  
  return {
    assets: store.assets,
    filteredAssets: store.filteredAssets,
    isLoading: assetsLoading,
    error: assetsError,
    mutate: () => store.refreshData()
  }
}

// Hook for using asset categories with automatic data loading
export const useAssetCategories = () => {
  const store = useAssetStore()
  const { setCategories, setMaxDepth, setCategoriesFetched, setCategoryError, setCategoriesLoading } = store
  const { data: categoriesData, error: categoriesError, isLoading: categoriesLoading } = useAssetCategoriesSWR()
  
  // Sync SWR data with store
  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData.list)
      setMaxDepth(categoriesData.maxDepth)
      setCategoriesFetched(true)
    }
  }, [categoriesData, setCategories, setMaxDepth, setCategoriesFetched])

  useEffect(() => {
    if (categoriesError) {
      setCategoryError(categoriesError.message || 'Failed to load categories')
    }
  }, [categoriesError, setCategoryError])

  useEffect(() => {
    setCategoriesLoading(categoriesLoading)
  }, [categoriesLoading, setCategoriesLoading])
  
  return {
    categories: store.categories,
    maxDepth: store.maxDepth,
    isLoading: categoriesLoading,
    error: categoriesError,
    mutate: () => store.refreshData()
  }
}

// Hook for category navigation
export const useAssetCategoryNavigation = () => {
  const {
    selectedCategoryId,
    currentCategoryPath,
    navigateToCategory,
    goToParentCategory,
    goToRootCategory,
    getCategoryChildren,
    hasChildCategories,
    isLeafCategory,
    getRootCategories
  } = useAssetStore()

  return {
    selectedCategoryId,
    currentCategoryPath,
    navigateToCategory,
    goToParentCategory,
    goToRootCategory,
    getCategoryChildren,
    hasChildCategories,
    isLeafCategory,
    getRootCategories
  }
}

// Hook for getting current category's children or assets
export const useCurrentCategoryContent = () => {
  const store = useAssetStore()
  const { selectedCategoryId } = store

  // Get children categories if current category has children
  const childCategories = selectedCategoryId 
    ? store.getCategoryChildren(selectedCategoryId)
    : store.getRootCategories()

  // Get assets if current category is a leaf category
  const hasChildren = selectedCategoryId 
    ? store.hasChildCategories(selectedCategoryId)
    : childCategories.length > 0

  const currentAssets = !hasChildren ? store.filteredAssets : []

  return {
    selectedCategoryId,
    childCategories,
    currentAssets,
    hasChildCategories: hasChildren,
    isRootLevel: selectedCategoryId === null,
    currentCategoryPath: store.currentCategoryPath
  }
}
