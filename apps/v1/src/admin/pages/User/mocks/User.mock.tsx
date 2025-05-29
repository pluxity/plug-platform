import { User } from '../types/user.types';
import { Button } from '@plug/ui';
import type { Column } from '@plug/ui';

export const columns: Column<User>[] = [
    { key: 'id', label: '아이디' },
    { key: 'username', label: '이름' },
    { key: 'code', label: '권한' },
    { key: 'management', label: '관리' },
];

export const createUserData = (openModal: (mode: 'create' | 'edit') => void): User[] => [
    { 
        id: 'ADMIN', 
        username: '관리자', 
        code: 'ADMIN', 
        management: 
        <div className='flex flex-wrap gap-1'>
            <Button color='primary' onClick={() => openModal('edit')}>수정</Button>
            <Button color='destructive'>삭제</Button>
        </div>, 
    },
    { 
        id: 'pluxity', 
        username: '플럭시티', 
        code: 'USER', 
        management: 
        <div className='flex flex-wrap gap-1'>
            <Button color='primary' onClick={() => openModal('edit')}>수정</Button>
            <Button color='destructive'>삭제</Button>
        </div>, 
    },
    { 
        id: 'dot', 
        username: '닷', 
        code: 'USER', 
        management: 
        <div className='flex flex-wrap gap-1'>
            <Button color='primary' onClick={() => openModal('edit')}>수정</Button>
            <Button color='destructive'>삭제</Button>
        </div>, 
    },
];