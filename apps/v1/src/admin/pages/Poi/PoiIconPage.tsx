import { Input, Button, DataTable, Skeleton } from '@plug/ui';
import { columns } from './constants/poiIconColumns';
import { PoiIconRegistModal } from '../../components/modals/PoiIconRegist'; 
import { useModal } from '../../components/hook/useModal';
import { useAssetsSWR } from '@plug/common-services';
import { usePoiIcon } from './utils/usePoiIcon';
import { StateInfoWrapper } from "@plug/v1/admin/components/boundary/StateInfoWrapper";

export default function PoiIcon() {
    const { isOpen, mode, openModal, closeModal } = useModal();
    const { data, error, isLoading } = useAssetsSWR();
    const poiIconData = usePoiIcon(data || [], openModal);
    
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
                {error && <StateInfoWrapper preset="defaultError" />}
                {isLoading && <Skeleton className="w-full h-100"/>}
                {!isLoading && !error && poiIconData && (
                    <DataTable
                        data={poiIconData || []}
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
            <PoiIconRegistModal
                isOpen={isOpen}
                onClose={closeModal}
                mode={mode}
            />
        </>
    );
}