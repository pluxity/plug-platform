import { Input, Button } from '@plug/ui';
import { PoiIconRegistModal } from '../../components/modals/PoiIconRegist';
import { useState } from 'react';

export default function PoiList() {
    const [isPoiIconRegistOpen, setIsPoiIconRegistOpen] = useState(false);

    const handleOpenPoiIconRegist = () => {setIsPoiIconRegistOpen(true);};
    const handleClosePoiIconRegist = () => {setIsPoiIconRegistOpen(false);};

    return (
        <>
            <div className='flex items-center flex-wrap gap-1'>    
                <div>
                    <Input.Text className='w-60' placeholder='아이콘명을 입력하세요.'/>
                    <Button color='primary' className='ml-1'>검색</Button>
                </div>
                <div className='ml-auto flex gap-1'>
                    <Button color='primary' onClick={(handleOpenPoiIconRegist)}>등록</Button>
                    <Button color='destructive'>삭제</Button>
                </div>
            </div>
            <div className='mt-4'>
                DataTable 영역
            </div>
            
            {/* 등록 모달 */}
            <PoiIconRegistModal
                isOpen={isPoiIconRegistOpen}
                onClose={handleClosePoiIconRegist}
            />
        </>
    );
}