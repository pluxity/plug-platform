import { create } from 'zustand';
import { PermissionResourceType } from '@plug/common-services/types';
import { PermissionResourceData } from '@/backoffice/domains/users/types/permisson';
import { api } from '@plug/api-hooks';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNodesByDepth = (maxDepth: number, items: any[]): PermissionResourceData[] => {
    const leafNodes: PermissionResourceData[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const traverse = (item: any) => {
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
                        const response = await api.get<unknown>(`${endpoint}`);
                        const responseData: any = (response as any)?.data ?? response; // eslint-disable-line @typescript-eslint/no-explicit-any

                        if (isCategoryType(resourceType.key)) {
                            data[resourceType.key] = responseData?.list ? getNodesByDepth(1, responseData.list) : [];

                        } else if (resourceType.key === 'FACILITY') {
                            const facilityAllArrays = (data: Record<string, PermissionResourceData[]>) => {
                                return Object.values(data).reduce((acc, curr) => {
                                    return Array.isArray(curr) ? [...acc, ...curr] : acc;
                                }, []);
                            };

                            const facilityList = facilityAllArrays(responseData);
                            data[resourceType.key] = facilityList.map((item: PermissionResourceData) => ({
                                id: item.id.toString(),
                                name: item.name
                            }));

                        } else {
                            data[resourceType.key] = Array.isArray(responseData) 
                                ? responseData.map((item: PermissionResourceData) => ({
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
