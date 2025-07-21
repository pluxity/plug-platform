import React, { useState } from 'react'
import { Card, CardContent, DataTable, Button, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@plug/ui'
import { PageContainer } from '@/backoffice/common/view/layouts'
import { RoleData } from '@/backoffice/domains/users/types/role';
import { RoleMapper } from '@/backoffice/domains/users/mapper/roleMapper';
import { useRolesSWR, deleteRole } from '@plug/common-services/services'
import { RoleCreateModal } from '@/backoffice/domains/users/components/RoleCreateModal'
import { RoleEditModal } from '@/backoffice/domains/users/components/RoleEditModal'
import { toast } from '@plug/ui'

const Role: React.FC = () => {
  // 역할 상태 관리
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number>();
  const [deleteRoleData, setDeleteRoleData] = useState<RoleData>();

  // 역할 목록 조회 
  const { data, mutate } = useRolesSWR();

  // 역할 목록 매핑
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

  // 역할 컬럼 정의
  const columns = [
    {
      header: '이름',
      accessorKey: 'name',
    },
    {
      header: '설명',
      accessorKey: 'description',
    },
    {
      id: 'actions',
      header: '관리',
      cell: ({row}: {row: { original: RoleData }}) => (
        <div className="flex space-x-2">
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
    <PageContainer title="역할 관리"> 
      <Card>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={roleData} 
            buttons={<Button onClick={handleCreate}>등록</Button>}
          />
        </CardContent>
      </Card>


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