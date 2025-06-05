import {Button, DataTable, Skeleton} from '@plug/ui';
import {columns} from './constants/assetColumns';
import {AssetRegistModal} from './components/AssetModal';
import {useModal} from '../../components/hook/useModal';
import {useAssetsSWR, deleteAsset} from '@plug/common-services';
import {useAsset} from './utils/useAsset';
import {StateInfoWrapper} from "@plug/v1/admin/components/boundary/StateInfoWrapper";
import {useState} from 'react';
import {Asset} from './types/asset.types';
import {useToastStore} from "@plug/v1/admin/components/hook/useToastStore";

export default function AssetPage() {
    const {isOpen, mode, openModal, closeModal} = useModal();
    const {data, error, isLoading, mutate} = useAssetsSWR();

    const [selectedAssets, setSelectedAssets] = useState<Set<Asset>>(new Set());
    const [selectedAssetId, setSelectedAssetId] = useState<number>();

    const addToast = useToastStore((state) => state.addToast);

    const handleDelete = async (assetId: number) => {
        const isConfirmed = window.confirm("선택한 항목을 삭제하시겠습니까?");
        if (!isConfirmed) return;

        try {
            await deleteAsset(assetId);
            await mutate();
            addToast({
                variant: 'normal',
                title: '삭제 완료',
                description: '선택한 항목이 삭제되었습니다.'
            });
        } catch (error) {
            addToast({
                variant: 'critical',
                title: '삭제 실패',
                description: error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.',
            });
        }
    };

    const handleEdit = (assetId: number) => {
        setSelectedAssetId(assetId);
        openModal('edit');
    };

    const AssetData = useAsset(data || [], handleDelete, handleEdit);

    const handleDeleteSelected = async () => {
        const isConfirmed = window.confirm('선택한 항목을 삭제하시겠습니까?');
        if (!isConfirmed) return;

        if (selectedAssets.size === 0) {
            addToast({
                variant: 'warning',
                title: '선택 필요',
                description: '삭제할 항목을 선택해주세요.'
            });
            return;
        }

        try {
            await Promise.all(
                Array.from(selectedAssets).map(asset => handleDelete(Number(asset.id)))
            );

            addToast({
                variant: 'normal',
                title: '일괄 삭제 완료',
                description: `${selectedAssets.size}개의 항목이 삭제되었습니다.`
            });
            setSelectedAssets(new Set());

        } catch (error) {
            addToast({
                variant: 'critical',
                title: '삭제 실패',
                description: error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.',
            });
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
                {error && <StateInfoWrapper preset="defaultError"/>}
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