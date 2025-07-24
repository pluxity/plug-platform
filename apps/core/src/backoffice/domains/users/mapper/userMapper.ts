import { UserResponse } from '@plug/common-services/types';
import { UserData } from '../types/user';

export const UserMapper = (user: UserResponse): UserData => ({
    id: user.id,
    name: user.name,
    code: user.code,
    phoneNumber: user.phoneNumber,
    department: user.department,
    roleIds: Array.from(user.roles).map((role) => role.id),
});
