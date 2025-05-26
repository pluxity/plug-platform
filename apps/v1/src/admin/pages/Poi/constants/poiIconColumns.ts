import { PoiIcon } from '../types/PoiIcon.types';
import type { Column } from '@plug/ui';

export const columns: Column<PoiIcon>[] = [
    { key: 'id', label: '아이디' },
    { key: 'name', label: '이름' },
    { key: 'file', label: '3D 모델' },
    { key: 'thumbnailFile', label: '썸네일' },
    { key: 'code', label: '등록자' },
    { key: 'update', label: '등록일' },
    { key: 'management', label: '관리' },
];