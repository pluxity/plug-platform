import { Input, Button, DataTable, Skeleton } from '@plug/ui';
import { PoiIconRegistModal } from '../../components/modals/PoiIconRegist'; 
import { useModal } from '../../components/hook/useModal';
import { useSWRApi } from '@plug/api-hooks';
import { AssetResponse } from '@plug/common-services';
import { mapAssetsToPoiIcons } from './utils/usePoiIcon';
import { columns } from './constants/poiIconColumns';

export default function PoiIcon() {
    const { isOpen, mode, openModal, closeModal } = useModal();

    const { data, error, isLoading } = useSWRApi<AssetResponse[]>('/assets');
    const poiIconData = data ? mapAssetsToPoiIcons(data, openModal) : [];
    
    return (
        <>
            <div className='flex items-center flex-wrap gap-1'>    
                <div className='flex items-center'>
                    <Input.Text className='w-60' placeholder='아이콘명을 입력하세요.'/>
                    <Button color='primary' className='ml-1'>검색</Button>
                </div>
                <div className='ml-auto flex gap-1'>
                    <Button color='primary' onClick={() => (openModal('create'))}>등록</Button>
                    <Button color='destructive'>삭제</Button>
                </div>
            </div>
            <div className='mt-4'>
                {isLoading ? (
                    <Skeleton className="w-full h-100"/>
                ) : error ? (
                    <p className='text-center py-4 text-destructive-500'>데이터를 불러오는 중 오류가 발생했습니다.</p>
                ) : (
                    <DataTable
                        data={poiIconData}
                        columns={columns}
                        pageSize={10}
                        selectable={true}
                        filterFunction={(item, search) => {
                            const lowerSearch = search.toLowerCase();
                            return (
                                item.name.toLowerCase().includes(lowerSearch)
                            );
                        }}
                    />
                )}
            </div>
            
            {/* 등록 모달 */}
            <PoiIconRegistModal
                isOpen={isOpen}
                onClose={closeModal}
                mode={mode}
            />
        </>
    );
}