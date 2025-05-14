export interface Icon {
    select: React.ReactNode;
    id: number;
    name: string;
    icon: React.ReactNode;
    code: string;
    update: string;
    management: React.ReactNode;
    file?: {
        url: string;
        originalFileName: string;
        contentType: string;
    }
}

