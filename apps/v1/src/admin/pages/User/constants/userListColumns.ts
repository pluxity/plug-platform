import { User } from '../types/UserList.types';
import type { Column } from '@plug/ui';

export const columns: Column<User>[] = [
    { key: 'id', label: '아이디' },
    { key: 'username', label: '이름' },
    { key: 'phoneNumber', label: '연락처'},
    { key: 'department', label: '부서'},
    { key: 'contact', label: '접속 여부' },
    { key: 'management', label: '관리' },
];