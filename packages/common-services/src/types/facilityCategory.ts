
export interface FacilityCategory {
  id: number;
  name: string;
  parentId: number | null;
  children: FacilityCategory[];
  createdAt: string;
  updatedAt: string;
  depth: number;
}

export interface FacilityCategoryResponse {
  maxDepth: number;
  list: FacilityCategory[];
}

export interface FacilityCategoryRequest {
  name: string;
  parentId?: number;
}
