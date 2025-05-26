export type FloorType = 'B1층 대합실' | '1층 승강장' | 'B2층 대합실'

export interface FloorItem{
    id: FloorType;
    label: string;
}

export const FLOOR_LIST: FloorItem[] =[
    {id: "B2층 대합실", label: 'B2'},
    {id: 'B1층 대합실', label: 'B1F 대합실'},
    {id: '1층 승강장', label: '1F 승강장'}
]