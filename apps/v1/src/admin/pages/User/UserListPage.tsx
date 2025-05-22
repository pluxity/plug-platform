import {Select, Input, Button, DataTable, Skeleton} from '@plug/ui';
import { columns } from './constants/userListColumns';
import { UserListModal } from './components/UserListModal';
import { useModal } from '../../components/hook/useModal';
import { useUsersSWR, deleteUser } from "@plug/common-services";
import { useUserList } from './utils/useUserList';
import { StateInfoWrapper } from "@plug/v1/admin/components/boundary/StateInfoWrapper";
import { useState } from 'react';
import { User } from './types/UserList.types';

export default function UserListPage() {
    const { isOpen, mode, openModal, closeModal } = useModal();
    const { data, error, isLoading, mutate } = useUsersSWR();
    const [selectState, setSelectState] = useState<Set<User>>(new Set());

    const handleDelete = async (userId: number) => {
        deleteUser(userId).then(() => {mutate();})
    };
    
    const userData = useUserList(data || [], openModal, handleDelete);

    const handleDeleteSelected = () => {
        if(selectState.size === 0){
            return alert('삭제할 항목을 선택해주세요.');
        }
        Promise.all(
            Array.from(selectState).map(user => handleDelete(Number(user.id)))
        )
        .then(() => {
            alert(`${selectState.size} 개의 항목이 삭제 되었습니다.`);
            setSelectState(new Set());
        });
    };
    
    return (
        <>
            <div className='flex items-center flex-wrap gap-1'>    
                <Select className='w-40'>
                    <Select.Trigger placeholder='도면분류선택' />
                    <Select.Content>
                        <Select.Item value='1호선'>1호선</Select.Item>
                        <Select.Item value='2호선'>2호선</Select.Item>
                        <Select.Item value='3호선'>3호선</Select.Item>
                        <Select.Item value='4호선'>4호선</Select.Item>
                    </Select.Content>
                </Select>
                <Select className='w-40'>
                    <Select.Trigger placeholder='도면 이름' />
                    <Select.Content>
                        <Select.Item value='name'>도면 이름</Select.Item>
                        <Select.Item value='code'>도면 코드</Select.Item>
                    </Select.Content>
                </Select>
                <div className='flex items-center'>
                    <Input.Text className='w-60' placeholder='검색어를 입력하세요.'/>
                    <Button color='primary' className='ml-1'>검색</Button>
                </div>
                <div className='ml-auto flex gap-1'>
                    <Button color='primary' onClick={() => openModal('create')}>등록</Button>
                    <Button color='destructive' onClick={handleDeleteSelected}>삭제</Button>
                </div>
            </div>
            <div className='mt-4'>
                {error && <StateInfoWrapper preset="defaultError" />}
                {isLoading && <Skeleton className="w-full h-100"/>}
                {!isLoading && !error && userData && (
                    <DataTable
                        data={userData || []}
                        columns={columns}
                        pageSize={10}
                        selectable={true}
                        selectedRows={selectState}
                        onSelectChange={setSelectState}
                        filterFunction={(item, search) => {
                            const lowerSearch = search.toLowerCase();
                            return (
                                String(item.id).toLowerCase().includes(lowerSearch) ||
                                item.username.toLowerCase().includes(lowerSearch) ||
                                item.code.toLowerCase().includes(lowerSearch)
                            );
                        }}
                    />
                )}
            </div>
            <UserListModal 
                isOpen={isOpen}
                onClose={closeModal}
                mode={mode}
                onSuccess={mutate}
            />
        </>
    );
}