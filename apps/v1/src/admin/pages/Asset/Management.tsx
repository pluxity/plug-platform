import { Button, DataTable, Skeleton } from '@plug/ui';
import { columns } from './constants/assetColumns';
import { AssetRegistModal } from './components/AssetRegist'; 
import { useModal } from '../../components/hook/useModal';
import { useAssetsSWR, deleteAsset } from '@plug/common-services';
import { useAsset } from './utils/useAsset';
import { StateInfoWrapper } from "@plug/v1/admin/components/boundary/StateInfoWrapper";
import { useState } from 'react';
import { Asset } from './types/asset.types';

export default function AssetPage() {
    const { isOpen, mode, openModal, closeModal } = useModal();
    const { data, error, isLoading, mutate } = useAssetsSWR();
    const [ selectedAssets, setSelectedAssets ] = useState<Set<Asset>>(new Set());
    const [ selectedAssetId, setSelectedAssetId ] = useState<number>();
    
    const handleDelete = async (assetId: number) => {
        deleteAsset(assetId).then(() => mutate());
    };

    const handleEdit = (assetId: number) => {
        setSelectedAssetId(assetId);
        openModal('edit');
    };   

    const AssetData = useAsset(data || [], handleDelete, handleEdit);

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
            console.error('삭제 중 오류가 발생했습니다.', error);
        }
    };
    return (
        <>
            <div className='mt-4 relative h-[90%]'>
                <div className='ml-auto flex gap-1 w-48 absolute z-10 right-0'>
                    <Button color='primary'
                            className='bg-primary-150 text-primary-700 font-semibold hover:bg-primary-200'
                            onClick={() => (openModal('create'))}>등록</Button>
                    <Button color='destructive'
                            className='bg-destructive-150 text-destructive-700 font-semibold hover:bg-destructive-200'
                            onClick={handleDeleteSelected}>삭제</Button>
                </div>
                {error && <StateInfoWrapper preset="defaultError" />}
                {isLoading && <Skeleton className="w-full h-100"/>}
                {!isLoading && !error && AssetData && (
                    <DataTable
                        data={AssetData || []}
                        columns={columns}
                        pageSize={7}
                        selectable={true}
                        selectedRows={selectedAssets}
                        onSelectChange={setSelectedAssets}
                        showSearch={true}
                        filterFunction={(item, search) => {
                            const lowerSearch = search.toLowerCase();
                            return (
                                item.name.toLowerCase().includes(lowerSearch)
                            );
                        }}
                    />
                )} 
            </div>
            <AssetRegistModal
                isOpen={isOpen}
                onClose={closeModal}
                mode={mode}
                onSuccess={mutate}
                selectedAssetId={selectedAssetId}
            />
        </>
    );
}