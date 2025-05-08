import { Select, Input, Button, DataTable } from '@plug/ui';
import { columns, userData } from './mocks/UserList.mock';
import { CreateUserDialog } from './components/CreateUserDialog';
import { useState } from 'react';

export default function UserList() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const handleOpenCreateDialog = () => {setIsCreateDialogOpen(true);};
    const handleCloseCreateDialog = () => {setIsCreateDialogOpen(false);};

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
                <div>
                    <Input.Text className='w-60' placeholder='검색어를 입력하세요.'/>
                    <Button color='primary' className='ml-1'>검색</Button>
                </div>
                <div className='ml-auto flex gap-1'>
                    <Button color='primary' onClick={(handleOpenCreateDialog)}>등록</Button>
                    <Button color='destructive'>삭제</Button>
                </div>
            </div>
            <div className='mt-4'>
                <DataTable
                    data={userData}
                    columns={columns}
                    pageSize={10}
                    filterFunction={(item, search) => {
                        const lowerSearch = search.toLowerCase();
                        return (
                            item.id.toLowerCase().includes(lowerSearch) ||
                            item.username.toLowerCase().includes(lowerSearch) ||
                            item.code.toLowerCase().includes(lowerSearch)
                        );
                    }}
                />
            </div>
            <CreateUserDialog 
                isOpen={isCreateDialogOpen}
                onClose={handleCloseCreateDialog}
                mode={'create'}
            />
        </>
    );
}