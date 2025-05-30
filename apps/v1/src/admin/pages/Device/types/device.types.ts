export interface Device{
    id: number,
    name: string;
    code: string;
    categoryName: string; 
    creator: string; 
    update: string;
    management: React.ReactNode;
}