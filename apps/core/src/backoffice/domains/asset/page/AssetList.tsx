import React, { useState } from 'react';
import { Card, CardContent, DataTable, Button, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@plug/ui';
import { PageContainer } from '@/backoffice/common/view/layouts';
import { useAssetsSWR, deleteAsset } from '@plug/common-services/services';
import { AssetData } from '@/backoffice/domains/asset/types/asset';
import { AssetMapper } from '@/backoffice/domains/asset/mapper/assetMapper';
import { useAssetCategoryTree, AssetCategoryResponse } from '@plug/common-services'; 
import { toast } from '@plug/ui';

const AssetList: React.FC = () => { 
  // 모달 상태 관리
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [deleteAssetData, setDeleteAssetData] = useState<AssetData | null>(null);
  const [category, setCategory] = useState("all");
  
  // 에셋 목록 조회
  const { data, mutate } = useAssetsSWR();
  const { categories } = useAssetCategoryTree();

  // 에셋 목록 매핑
  const assetData = data ? data.map(AssetMapper) : [];
  
  // 에셋 카테고리 필터링
  const filteredAssetData = category === "all" ? assetData : assetData.filter(asset => asset.categoryId?.toString() === category);

  // 이벤트 핸들러 함수
  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setCreateModalOpen(false);
    mutate();
  };

  const handleEdit = (assetId: number) => {
    setSelectedAssetId(assetId);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    mutate();
  };

  const handleDelete = (asset: AssetData) => {
    setDeleteAssetData(asset);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteAssetData) return;
    try {
      await deleteAsset(Number(deleteAssetData.id));
      toast.success('삭제가 완료되었습니다.');
      mutate();
    } catch (error){
      console.error('에셋 삭제 실패:', error);
      toast.error('삭제에 실패했습니다.');
    } finally{
      setDeleteAssetData(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteAssetData(null);
  };

  // 에셋 카테고리 옵션
  const categoryOptions = [
      { label: '전체', value: 'all' },
    ...categories.map((category: AssetCategoryResponse) => ({
      label: category.name,
      value: category.id.toString(),
    })),
  ];

  const selects = [
    {
      key: "category",
      placeholder: "에셋 카테고리",
      options: categoryOptions,
      value: category,
      onChange: setCategory,
    },
  ];

  // 에셋 컬럼 정의
  const columns = [
    {
      accessorKey: 'categoryName',
      header: '에셋 카테고리',
    },
    {
      accessorKey: 'code',
      header: '에셋 코드',
    },
    {
      accessorKey: 'name',
      header: '에셋 이름',
    },
    {
      accessorKey: 'file',
      header: '3D 파일',
    },
    {
      accessorKey: 'thumbnailFile',
      header: '썸네일 파일',
    },
    {
      id: 'actions',
      header: '관리',
      cell: ({ row }: { row: { original: AssetData } }) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(Number(row.original.id))}
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
  ];

  return (
    <PageContainer title="에셋 관리">
      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredAssetData}
            filterColumnKey="name"
            pageSize={12}
            filterPlaceholder="에셋 이름으로 검색하세요."
            showFilter={true}
            selects={selects}
            buttons={<Button onClick={handleCreate}>등록</Button>}
          />
        </CardContent>
      </Card>

      <AssetCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {editModalOpen && selectedAssetId !== null && (
        <AssetEditModal
          isOpen={true}
          onClose={() => setEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          assetId={selectedAssetId}
        />
      )}

      <AlertDialog open={!!deleteAssetData} >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteAssetData && `${deleteAssetData.name} 에셋을 삭제하시겠습니까?`}
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

export default AssetList;
