import { api } from '@plug/api-hooks';

import { create } from 'zustand';

import { PermissionResourceType } from '@plug/common-services/types';

import { PermissionResourceData } from '@/backoffice/domains/users/types/permisson';
interface TreeNode {
    id: number | string;
    name: string;
    depth: number;
    children?: TreeNode[];
}
interface PermissionStore {
    resourceTypes: PermissionResourceType[]
    resourceData: Record<string, PermissionResourceData[]>
    isLoading: boolean
    error: string | null
    fetchPermissionResources: () => Promise<void>
}

const isCategoryType = (key: string): boolean => {
    return key.endsWith('_CATEGORY');
};

// 계층 구조에서 maxDepth에 해당하는 leaf 노드만 추출하는 함수 
const getNodesByDepth = (maxDepth: number, items: TreeNode[]): PermissionResourceData[] => {
    const leafNodes: PermissionResourceData[] = [];
    
    const traverse = (item: TreeNode) => {
        if (item.depth === maxDepth) {
            leafNodes.push({
                id: item.id.toString(),
                name: item.name
            });
        } else {
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
            const resourceTypesResponse = await api.get<PermissionResourceType[]>(
                'permissions/resource-types', 
                { requireAuth: true }
            );
            const types = resourceTypesResponse.data;

            const data: Record<string, PermissionResourceData[]> = {};
            
            for (const resourceType of types) {
                try {
                    const endpoint = resourceType.endpoint;
                    
                    if (endpoint) {    
                        const response = await api.get<TreeNode[]>(`${endpoint}`, { requireAuth: true });
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const list: TreeNode[] = (response as any)?.data ?? (response as unknown as TreeNode[]);

                        if (isCategoryType(resourceType.key)) {
                            data[resourceType.key] = list.length ? getNodesByDepth(1, list) : [];
                        } else if (resourceType.key === 'FACILITY') {
                            // Facility 타입: 배열로 내려오는 시설 목록에서 id, name만 추출
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const facilityList = (list as any[]);
                            data[resourceType.key] = facilityList.map((item) => ({
                                id: String(item.id),
                                name: String(item.name ?? item.facility?.name ?? '')
                            }));

                        } else {
                            // 일반 타입 처리
                            // 일반 타입 처리 (배열 가정)
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const arr = (list as any[]);
                            data[resourceType.key] = Array.isArray(arr) 
                                ? arr.map((item) => ({
                                    id: String(item.id),
                                    name: String(item.name ?? '')
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
