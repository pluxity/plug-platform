import { toast } from 'sonner';

import React, { useState } from 'react'

import { useRolesSWR, deleteRole } from '@plug/common-services/services'
import {
  DataTable,
  Button,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@plug/ui";

import { PageContainer } from '@/backoffice/common/view/layouts'
import { RoleCreateModal } from '@/backoffice/domains/users/components/RoleCreateModal';
import { RoleEditModal } from '@/backoffice/domains/users/components/RoleEditModal';
import { RoleMapper } from '@/backoffice/domains/users/mapper/roleMapper';
import { RoleData } from '@/backoffice/domains/users/types/role';

const Role: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number>();
  const [deleteRoleData, setDeleteRoleData] = useState<RoleData>();

  const { data, mutate } = useRolesSWR();

  const roleData = data ? data.map(RoleMapper) : [];

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setCreateModalOpen(false);
    mutate();
  };

  const handleEdit = (roleId: number) => {
    setSelectedRoleId(roleId);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    mutate();
  };

  const handleDelete = (role: RoleData) => {
    setDeleteRoleData(role);
  };

  const handleDeleteConfirm = async () => {
    if(!deleteRoleData) return;
    try {
      await deleteRole(deleteRoleData.id);
      toast.success('역할 삭제 완료');
      mutate();
    } catch (error) {
      toast.error((error as Error).message || '역할 삭제에 실패했습니다.');
    } finally {
      setDeleteRoleData(undefined);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteRoleData(undefined);
  };

  const columns = [
    {
      header: '이름',
      accessorKey: 'name',
      cell: ({ row }: { row: { original: RoleData } }) => (
        <div className="font-semibold text-primary-foreground">{row.original.name}</div>
      ),
    },
    {
      header: '설명',
      accessorKey: 'description',
    },
    {
      header: '권한',
      accessorKey: 'permissionGroupIds',
    },
    {
      id: 'actions',
      header: '관리',
      cell: ({row}: {row: { original: RoleData }}) => (
        <div className="flex space-x-2">
          <Button
            color="primary"
            size="sm"
            onClick={() => handleEdit(Number(row.original.id))}
          >
            수정
          </Button>
          <Button
            variant="secondary"
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
    <PageContainer title="역할 관리"> 
      <DataTable
        columns={columns}
        data={roleData}
        buttons={<Button onClick={handleCreate}>등록</Button>}
        pageDescription="역할에 따른 권한 관리가 가능합니다."
      />

      <RoleCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {editModalOpen && selectedRoleId != null && (
        <RoleEditModal  
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          roleId={selectedRoleId}
        />
      )}

      <AlertDialog open={!!deleteRoleData} >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteRoleData && `${deleteRoleData.name} 역할을 삭제하시겠습니까?`}
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

export default Role;