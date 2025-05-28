import { Input, Button, DataTable, Skeleton } from '@plug/ui';
import { columns } from './constants/poiIconColumns';
import { PoiIconRegistModal } from '../../components/modals/PoiIconRegist'; 
import { useModal } from '../../components/hook/useModal';
import { useAssetsSWR, deleteAsset } from '@plug/common-services';
import { usePoiIcon } from './utils/usePoiIcon';
import { StateInfoWrapper } from "@plug/v1/admin/components/boundary/StateInfoWrapper";
import { useState } from 'react';
import { PoiIcon } from './types/PoiIcon.types';

export default function PoiIconPage() {
    const { isOpen, mode, openModal, closeModal } = useModal();
    const { data, error, isLoading, mutate } = useAssetsSWR();
    const [ selectedAssets, setSelectedAssets ] = useState<Set<PoiIcon>>(new Set());
    const [ selectedAssetId, setSelectedAssetId ] = useState<number>();
    
    const handleDelete = async (assetId: number) => {
        deleteAsset(assetId).then(() => mutate());
    };

    const handleEdit = (assetId: number) => {
        setSelectedAssetId(assetId);
        openModal('edit');
    };   

    const poiIconData = usePoiIcon(data || [], handleDelete, handleEdit);

    const handleDeleteSelected = async () => {
        if(selectedAssets.size === 0){
            return alert('삭제할 항목을 선택해주세요.');
        }
        try{
            await Promise.all(
                Array.from(selectedAssets).map(asset => handleDelete(Number(asset.id)))
            )

            alert(`${selectedAssets.size} 개의 항목이 삭제 되었습니다.`);
            setSelectedAssets(new Set());

        } catch (error){
            console.log('삭제 중 오류가 발생했습니다.', error);
        }
    };
    return (
        <>
            <div className='flex items-center flex-wrap gap-1'>    
                <div className='flex items-center'>
                    <Input.Text className='w-60' placeholder='아이콘명을 입력하세요.'/>
                    <Button color='primary' className='ml-1'>검색</Button>
                </div>
                <div className='ml-auto flex gap-1'>
                    <Button color='primary' onClick={() => (openModal('create'))}>등록</Button>
                    <Button color='destructive' onClick={handleDeleteSelected}>삭제</Button>
                </div>
            </div>
            <div className='mt-4'>
                {error && <StateInfoWrapper preset="defaultError" />}
                {isLoading && <Skeleton className="w-full h-100"/>}
                {!isLoading && !error && poiIconData && (
                    <DataTable
                        data={poiIconData || []}
                        columns={columns}
                        pageSize={10}
                        selectable={true}
                        selectedRows={selectedAssets}
                        onSelectChange={setSelectedAssets}
                        filterFunction={(item, search) => {
                            const lowerSearch = search.toLowerCase();
                            return (
                                item.name.toLowerCase().includes(lowerSearch)
                            );
                        }}
                    />
                )} 
            </div>
            <PoiIconRegistModal
                isOpen={isOpen}
                onClose={closeModal}
                mode={mode}
                onSuccess={mutate}
                selectedAssetId={selectedAssetId}
            />
        </>
    );
}