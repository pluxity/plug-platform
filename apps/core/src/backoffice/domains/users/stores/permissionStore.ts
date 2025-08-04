import { create } from 'zustand';
import { PermissionResourceType } from '@plug/common-services/types';
import { api } from '@plug/api-hooks';

interface ResourceItem {
    id: string;
    name: string;
}
interface PermissionStore {
    resourceTypes: PermissionResourceType[]
    resourceData: Record<string, ResourceItem[]>
    isLoading: boolean
    error: string | null
    fetchPermissionResources: () => Promise<void>
}

// _CATEGORY로 끝나는 타입인지 확인하는 함수
const isCategoryType = (key: string): boolean => {
    return key.endsWith('_CATEGORY');
};

// 계층 구조에서 maxDepth에 해당하는 leaf 노드만 추출하는 함수 
const getNodesByDepth = (maxDepth: number, items: any[]): ResourceItem[] => {
    const leafNodes: ResourceItem[] = [];
    
    const traverse = (item: any) => {
        if (item.depth === maxDepth) {
            leafNodes.push({
                id: item.id.toString(),
                name: item.name
            });
        } else {
            // maxDepth에 도달할 때까지 자식 노드를 재귀적으로 탐색
            item.children?.forEach(traverse);
        }
    };
    
    items.forEach(traverse);
    return leafNodes;
};

export const usePermissionStore = create<PermissionStore>((set) => ({
    resourceTypes: [],
    resourceData: {},
    isLoading: false,
    error: null,
 
    fetchPermissionResources: async () => {
        set({ isLoading: true, error: null });
        try {
            // 1단계: resourceTypes 가져오기 
            const resourceTypesResponse = await api.get<PermissionResourceType[]>(
                'permissions/resource-types', 
                { requireAuth: true }
            );
            const types = resourceTypesResponse.data;

            // 2단계: 각 resourceType별 데이터 가져오기
            const data: Record<string, ResourceItem[]> = {};
            
            for (const resourceType of types) {
                try {
                    const endpoint = resourceType.endpoint;
                    
                    if (endpoint) {    
                        const response = await api.get<ResourceItem[]>(`${endpoint}`);
                        const responseData = (response as any)?.data || response;

                        if (isCategoryType(resourceType.key)) {
                            // 카테고리 타입인 경우
                            data[resourceType.key] = responseData?.list ? getNodesByDepth(responseData.maxDepth, responseData.list) : [];

                        } else if (resourceType.key === 'FACILITY') {
                            // Facility 타입인 경우 : 모든 시설 데이터를 하나의 배열로 합침
                            const facilityAllArrays = (data: Record<string, ResourceItem[]>) => {
                                return Object.values(data).reduce((acc, curr) => {
                                    return Array.isArray(curr) ? [...acc, ...curr] : acc;
                                }, []);
                            };

                            const facilityList = facilityAllArrays(responseData);
                            data[resourceType.key] = facilityList.map((item: ResourceItem) => ({
                                id: item.id.toString(),
                                name: item.name
                            }));

                        } else {
                            // 일반 타입 처리
                            data[resourceType.key] = Array.isArray(responseData) 
                                ? responseData.map((item: ResourceItem) => ({
                                    id: item.id.toString(),
                                    name: item.name
                                })) : [];
                        }
                    } else {
                        data[resourceType.key] = [];
                    }
                } catch (err) {
                    console.error(`Failed to fetch data for ${resourceType.key}:`, err);
                    data[resourceType.key] = [];
                }
            }
            
            set({ resourceTypes: types, resourceData: data });
        } catch (err) {
            set({ error: (err as Error).message });
        } finally {
            set({ isLoading: false });
        }
    }
}));
