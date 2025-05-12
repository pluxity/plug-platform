import { Icon } from '../types/PoiIcon.types';
import { Checkbox, Button } from '@plug/ui';
import type { Column } from '@plug/ui';

export const columns: Column<Icon>[] = [
    { key: 'select', label: '선택' },
    { key: 'id', label: '아이디' },
    { key: 'name', label: '이름' },
    { key: 'icon', label: '아이콘' },
    { key: 'code', label: '등록자' },
    { key: 'update', label: '등록일' },
    { key: 'management', label: '관리' },
];

export const createIconData = (openModal: (mode: 'create' | 'edit') => void): Icon[] => [
    { 
        select: <Checkbox />, 
        id: '1', 
        name: '자동심장충격기', 
        icon: <img src="" alt="" />,
        code: 'null', 
        update: '2022-07-04 10:20:40',
        management: 
        <div className='flex flex-wrap gap-1'>
            <Button color='primary' onClick={() => openModal('edit')}>수정</Button>
            <Button color='destructive'>삭제</Button>
        </div>, 
    },
    { 
        select: <Checkbox />, 
        id: '2', 
        name: '키오스크', 
        icon: <img src="" alt="" />,
        code: 'null', 
        update: '2022-07-04 10:20:50',
        management: 
        <div className='flex flex-wrap gap-1'>
            <Button color='primary' onClick={() => openModal('edit')}>수정</Button>
            <Button color='destructive'>삭제</Button>
        </div>, 
    },
    { 
        select: <Checkbox />, 
        id: '3', 
        name: '비콘', 
        icon: <img src="" alt="" />,
        code: 'ADMIN', 
        update: '2022-07-04 10:20:40',
        management: 
        <div className='flex flex-wrap gap-1'>
            <Button color='primary' onClick={() => openModal('edit')}>수정</Button>
            <Button color='destructive'>삭제</Button>
        </div>, 
    },
];