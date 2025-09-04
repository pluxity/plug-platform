import { UserData } from '../types/user';

import { UserProfile } from '@plug/common-services/types';
export const UserMapper = (user: UserProfile): UserData => ({
    id: user.id,
    username: user.username,
    name: user.name,
    code: user.code,
    phoneNumber: user.phoneNumber,
    department: user.department,
    roleIds: Array.from(user.roles).map((role) => role.id),
});
