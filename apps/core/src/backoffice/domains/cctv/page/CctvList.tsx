import React, { useState } from 'react';
import { PageContainer } from '@/backoffice/common/view/layouts';
import { Card, CardContent, DataTable, Button, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@plug/ui';
import { CctvData } from '../types/cctv';
import { useCctvSWR, deleteCctv } from '@plug/common-services';
import { CctvMapper } from '../mapper/cctvMapper';
import { toast } from 'sonner';
import { CctvCreateModal } from '../components/CctvCreateModal';
import { CctvEditModal } from '../components/CctvEditModal';

const CctvList: React.FC = () => {
    const [ createModalOpen, setCreateModalOpen ] = useState(false);
    const [ editModalOpen, setEditModalOpen ] = useState(false);
    const [ selectedCctvId, setSelectedCctvId ] = useState<string | null>(null);
    const [ deleteCctvData, setDeleteCctvData ] = useState<CctvData | null>(null);

    const { data , mutate } = useCctvSWR();

    const cctvData = data ? data.map(CctvMapper) : [];

    const handleCreate = () => {
        setCreateModalOpen(true)
    }
    const handleCreateSuccess = () => {
        setCreateModalOpen(false);
        mutate();
    }
    const handleEdit = (cctvId: string) => {
        setSelectedCctvId(cctvId);
        setEditModalOpen(true);
    }
    const handleEditSuccess = () => {
        setEditModalOpen(false);
        mutate();
    }
    const handleDelete = (cctv: CctvData) => {
        setDeleteCctvData(cctv);
    }
    const handleDeleteConfirm = async () => {
        if(!deleteCctvData) return;
        try{
            await deleteCctv(deleteCctvData.id);
            toast.success('삭제가 완료되었습니다.');
            mutate();   
        }catch(error){
            console.error('CCTV 삭제 실패:', error);
            toast.error('삭제에 실패했습니다.');
        }finally{
            setDeleteCctvData(null);
        }
    }

    const handleDeleteCancel = () => {
        setDeleteCctvData(null);
    }

    const columns = [
        {
            accessorKey: 'name',
            header: 'CCTV 이름',
        },
        {
            accessorKey: 'url',
            header: 'CCTV URL',
        },
        {
            id: 'actions',
            header: '관리',
            cell: ({row}: {row: {original: CctvData}}) => (
                <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(row.original.id)}>수정</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(row.original)}>삭제</Button>
                </div>
            ), 
        }
    ]
    
    return (
        <PageContainer title="CCTV 관리">
            <Card>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={cctvData}
                        pageSize={12}
                        filterPlaceholder="CCTV 이름으로 검색하세요."
                        filterColumnKey="name"
                        buttons={<Button onClick={handleCreate}>등록</Button>}
                    />
                </CardContent>
            </Card>

            <CctvCreateModal 
                isOpen={createModalOpen} 
                onClose={() => setCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {editModalOpen && selectedCctvId !== null && (
                <CctvEditModal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onSuccess={handleEditSuccess}
                    cctvId={selectedCctvId}
                />
            )}

            <AlertDialog open={!!deleteCctvData}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteCctvData && `${deleteCctvData.name} 에셋을 삭제하시겠습니까?`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleDeleteCancel}>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>삭제</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PageContainer>
    );
};

export default CctvList;    