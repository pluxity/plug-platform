import { Asset } from '../types/asset.types'
import type { Column } from '@plug/ui';

export const columns: Column<Asset>[] = [
    { key: 'name', label: '이름' },
    { key: 'file', label: '3D 모델' },
    { key: 'thumbnailFile', label: '썸네일' },
    { key: 'creator', label: '등록자' },
    { key: 'update', label: '등록일' },
    { key: 'management', label: '관리' },
];