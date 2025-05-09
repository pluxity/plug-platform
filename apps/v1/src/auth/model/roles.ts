export const ROLE = {
    ADMIN: 'ADMIN',
    MASTER: 'MASTER',
    USER: 'USER',
} as const;

export type Role = typeof ROLE[keyof typeof ROLE];

export function hasPermission(role: Role) {
    return [ROLE.ADMIN, ROLE.MASTER, ROLE.USER].includes(role);
}