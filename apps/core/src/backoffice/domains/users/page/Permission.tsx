import { usePermissionStore } from '@/backoffice/domains/users/stores/permissionStore';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { usePermissions } from '@plug/common-services/services';
import { deletePermission } from '@plug/common-services/services';
import { Card, CardContent, DataTable, Button, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@plug/ui';

import { PageContainer } from '@/backoffice/common/view/layouts';
import { PermissionEditModal } from '@/backoffice/domains/users/components/PermissionEditModal';
import { PermissionCreateModal } from '@/backoffice/domains/users/components/PermisstionCreateModal';
import { PermissionMapper } from '@/backoffice/domains/users/mapper/permissionMapper';
import { PermissionData } from '@/backoffice/domains/users/types/permisson';
const Permission: React.FC = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deletePermissionData, setDeletePermissionData] = useState<PermissionData>();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedPermissionId, setSelectedPermissionId] = useState<number>();

    const { data, execute } = usePermissions();

    const { fetchPermissionResources, resourceTypes, resourceData } = usePermissionStore();

    useEffect(() => {
        execute();
        fetchPermissionResources();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const permissionData = data ? data.map(permission => 
        PermissionMapper(permission, resourceTypes, resourceData)
    ) : [];

    const handleCreate = () => {
        setCreateModalOpen(true);
    }

    const handleCreateSuccess = () => {
        setCreateModalOpen(false);
        execute(); 
    }

    const handleEdit = (permissionId: number) => {
        setEditModalOpen(true);
        setSelectedPermissionId(permissionId);
    }

    const handleEditSuccess = () => {
        setEditModalOpen(false);
        execute(); 
    }

    const handleDelete = (permission: PermissionData) => {
        setDeletePermissionData(permission);
    }

    const handleDeleteConfirm = async () => {
        if(!deletePermissionData) return;
        try{
            await deletePermission(deletePermissionData.id);
            toast.success('권한 삭제 완료');
            execute(); 
        } catch (error) {
            toast.error((error as Error).message || '권한 삭제에 실패했습니다.');
        } finally {
            setDeletePermissionData(undefined);
        }
    }

    const handleDeleteCancel = () => {
        setDeletePermissionData(undefined);
    }

    const columns = [
        {
            header: '권한 명',
            accessorKey: 'name',
        },
        {
            header: '권한 목록',
            accessorKey: 'permissions',
        },
        {
            id: 'actions',
            header: '관리',
            cell: ({row}: {row: { original: PermissionData }}) => (
                <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(row.original.id)}>수정</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(row.original)}>삭제</Button>
                </div>
            )
        } 
    ]

    return (
        <PageContainer title="권한 관리">
            <Card>
                <CardContent>
                    <DataTable 
                        columns={columns} 
                        data={permissionData} 
                        buttons={<Button onClick={handleCreate}>등록</Button>}
                    />
                </CardContent>
            </Card>

            <PermissionCreateModal 
                isOpen={createModalOpen}    
                onClose={() => setCreateModalOpen(false)}   
                onSuccess={handleCreateSuccess} 
            />

            {editModalOpen && selectedPermissionId != null && (            
                <PermissionEditModal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onSuccess={handleEditSuccess}
                    permissionId={selectedPermissionId}
                />
            )}

            <AlertDialog open={!!deletePermissionData} >
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {deletePermissionData && `${deletePermissionData.name} 권한을 삭제하시겠습니까?`}
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

export default Permission;