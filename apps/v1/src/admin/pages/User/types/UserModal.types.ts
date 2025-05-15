export interface CreateFormValues {
    [key: string]: string | number | boolean | string[] | undefined;
    username: string;
    password: string;
    name: string;
    code: string;
    role?: string[];
}