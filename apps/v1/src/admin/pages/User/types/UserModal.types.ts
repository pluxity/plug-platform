export type FormListValues = Record<string, string | number | boolean> & {
    username: string;
    password: string;
    name: string;
    code: string;
    role?: string[];
}