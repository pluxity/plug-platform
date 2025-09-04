import { useRolesSWR } from '@plug/common-services/services';

import React, { useState } from 'react'
import { toast } from 'sonner';

import { useUsersSWR, deleteUser, initUserPassword } from '@plug/common-services/services'
import { Card, CardContent, DataTable, Button, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@plug/ui'

import { PageContainer } from '@/backoffice/common/view/layouts'
import { UserMapper } from '@/backoffice/domains/users/mapper/userMapper'
import { UserData } from '@/backoffice/domains/users/types/user'

import { UserCreateModal } from '../components/UserCreateModal'
import { UserEditModal } from '../components/UserEditModal'
const User: React.FC = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [passwordInitModalOpen, setPasswordInitModalOpen] = useState(false);
    const [passwordInitUserId, setPasswordInitUserId] = useState<number>();
    const [deleteUserData, setDeleteUserData] = useState<UserData>();
    const [selectedUserId, setSelectedUserId] = useState<number>();

    const { data, mutate } = useUsersSWR();
    const userData = data ? data.map(UserMapper) : [];
    const { data: roleData } = useRolesSWR();

    const handleCreate = () => {
        setCreateModalOpen(true);
    }

    const handleCreateSuccess = () => {
        setCreateModalOpen(false);
        mutate();
    }
    
    const handleEdit = (userId: number) => {
        setSelectedUserId(userId);
        setEditModalOpen(true);
    }

    const handleEditSuccess = () => {
        setEditModalOpen(false);
        mutate();
    }

    const handleDelete = (user: UserData) => {
        setDeleteUserData(user);
    }

    const handleDeleteCancel = () => {
        setDeleteUserData(undefined);
    }

    const handleDeleteConfirm = async () => {
        if(!deleteUserData) return;
        try {
            await deleteUser(deleteUserData.id);
            toast.success('사용자 삭제 완료');
            mutate();
        } catch (error) {
            toast.error((error as Error).message || '사용자 삭제에 실패했습니다.');
        } finally {
            setDeleteUserData(undefined);
        }
    }

    const handlePasswordInit = (userId: number) => {
        setPasswordInitUserId(userId);
        setPasswordInitModalOpen(true);
    }

    const handlePasswordInitCancel = () => {
        setPasswordInitUserId(undefined);
        setPasswordInitModalOpen(false);
    }

    const handlePasswordInitConfirm = async () => {
        if(!passwordInitUserId) return;
        try {
            await initUserPassword(passwordInitUserId);
            toast.success('비밀번호 초기화 완료');
            mutate();
        } catch (error) {
            toast.error((error as Error).message || '비밀번호 초기화에 실패했습니다.');
        } finally {
            setPasswordInitUserId(undefined);
        }
    }

    const columns = [
        {
            header: '아이디',
            accessorKey: 'username',
        },
        {
            header: '이름',
            accessorKey: 'name',
        },
        {
            header: '전화번호',
            accessorKey: 'phoneNumber',
        },
        {
            header: '부서',
            accessorKey: 'department',
        },
        {
            header: '역할',
            accessorKey: 'roles',
            cell: ({ row }: { row: { original: UserData }}) => {
                if (!roleData) return null;
                const roleNames = row.original.roleIds
                .map(id => roleData.find(role => role.id === id)?.name)
                .filter(Boolean)
                .sort()
                .join(', ');
                return roleNames;
            }
        },
        {
            id: 'actions',
            header: '관리',
            cell: ({row}: {row: { original: UserData }}) => (
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePasswordInit(row.original.id)}
                >
                  비밀번호 초기화
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEdit(row.original.id)}
                >
                  수정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(row.original)}
                > 
                  삭제
                </Button>
              </div>
            ),
        },
    ]
   
    return (
        <PageContainer title="사용자 관리">
            <Card>
                <CardContent>
                    <DataTable 
                        columns={columns} 
                        data={userData} 
                        pageSize={12}
                        buttons={<Button onClick={handleCreate}>등록</Button>} 
                    />
                </CardContent>
            </Card>

            <UserCreateModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {editModalOpen && selectedUserId != null && (
                <UserEditModal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onSuccess={handleEditSuccess}
                    userId={selectedUserId}
                />
            )}
            
            <AlertDialog open={!!passwordInitModalOpen && passwordInitUserId != null} >
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>비밀번호를 초기화하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                        초기 비밀번호: qwer1234
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handlePasswordInitCancel}>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePasswordInitConfirm}>초기화</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!deleteUserData} >
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {deleteUserData && `${deleteUserData.name} 사용자를 삭제하시겠습니까?`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleDeleteCancel}>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>삭제</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PageContainer>
    )
}

export default User;