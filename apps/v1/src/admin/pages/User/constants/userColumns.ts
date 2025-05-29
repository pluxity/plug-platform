import { User } from '../types/user.types';
import type { Column } from '@plug/ui';

export const columns: Column<User>[] = [
    { key: 'id', label: '아이디' },
    { key: 'username', label: '이름' },
    { key: 'code', label: '권한' },
    { key: 'management', label: '관리' },
];