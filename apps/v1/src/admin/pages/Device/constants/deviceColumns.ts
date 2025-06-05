import { Device } from '../types/device.types';
import type { Column } from '@plug/ui';

export const columns: Column<Device>[] = [
    { key: 'name' , label: '장비 이름'},
    { key: 'code', label: '장비 코드'},
    { key: 'categoryName', label: '카테고리 이름'},
    { key: 'creator', label: '등록자'},
    { key: 'update', label: '등록일'},
    { key: 'management', label: '관리'},
]