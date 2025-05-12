import { Input, Button, DataTable } from '@plug/ui';
import { columns ,createIconData } from './mocks/PoiIcon.mock';
import { PoiIconRegistModal } from '../../components/modals/PoiIconRegist'; 
import { useModal } from '../../components/hook/useModal';

export default function PoiList() {
    const { isOpen, mode, openModal, closeModal } = useModal();
    const IconData = createIconData(openModal);

    return (
        <>
            <div className='flex items-center flex-wrap gap-1'>    
                <div>
                    <Input.Text className='w-60' placeholder='아이콘명을 입력하세요.'/>
                    <Button color='primary' className='ml-1'>검색</Button>
                </div>
                <div className='ml-auto flex gap-1'>
                    <Button color='primary' onClick={() => (openModal('create'))}>등록</Button>
                    <Button color='destructive'>삭제</Button>
                </div>
            </div>
            <div className='mt-4'>
                <DataTable
                    data={IconData}
                    columns={columns}
                    pageSize={10}
                    filterFunction={(item, search) => {
                        const lowerSearch = search.toLowerCase();
                        return (
                            item.name.toLowerCase().includes(lowerSearch)
                        );
                    }}
                />
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