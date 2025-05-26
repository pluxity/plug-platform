import {Button, DataTable, Skeleton} from '@plug/ui';
import { columns } from './constants/userColumns';
import { UserModal } from './components/UserModal';
import { useModal } from '../../components/hook/useModal';
import { useUsersSWR, deleteUser } from "@plug/common-services";
import { useUser } from './utils/useUser';
import { StateInfoWrapper } from "@plug/v1/admin/components/boundary/StateInfoWrapper";
import { useState } from 'react';
import { User } from './types/user.types';

export default function UserPage() {
    const { isOpen, mode, openModal, closeModal } = useModal();
    const { data, error, isLoading, mutate } = useUsersSWR();
    const [selectState, setSelectState] = useState<Set<User>>(new Set());

    const handleDelete = async (userId: number) => {
        deleteUser(userId).then(() => {mutate();})
    };
    
    const userData = useUser(data || [], openModal, handleDelete);

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
            <div className='flex'>    
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
                        showSearch={true}
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
            <UserModal 
                isOpen={isOpen}
                onClose={closeModal}
                mode={mode}
                onSuccess={mutate}
            />
        </>
    );
}