import { Button, DataTable, Skeleton } from '@plug/ui';
import { columns } from './constants/lineColumns';
import { LineModal } from './components/LineModal';
import { useModal } from '../../components/hook/useModal';
import { useLinesSWR, deleteLine } from '@plug/common-services';
import { useLine } from './utils/useLine';
import { StateInfoWrapper } from "@plug/v1/admin/components/boundary/StateInfoWrapper";
import { useState } from 'react';
import { Line } from './types/line.types';

export default function LinePage() {
    const { isOpen, mode, openModal, closeModal } = useModal();
    const { data, error, isLoading, mutate } = useLinesSWR();

    const [ selectedLines, setSelectedLines ] = useState<Set<Line>>(new Set());
    const [ selectedLineId, setSelectedLineId ] = useState<number>();
    
    const handleDelete = async (lineId: number) => {
        deleteLine(lineId).then(() => mutate());
    };

    const handleEdit = (lineId: number) => {
        setSelectedLineId(lineId);
        openModal('edit');
    };   

    const lineData = useLine(data || [], handleDelete, handleEdit);
    
    const handleDeleteSelected = () => {
        if(selectedLines.size === 0){
            return alert('삭제할 항목을 선택해주세요.');
        }
        Promise.all(
            Array.from(selectedLines).map(line => handleDelete(line.id))
        )
        .then(() => {
            alert(`${selectedLines.size} 개의 항목이 삭제 되었습니다.`);
            setSelectedLines(new Set());
        });
    };
    return (
        <>
            <div className='flex'>    
                <div className='ml-auto flex gap-1'>
                    <Button color='primary'
                            className='bg-primary-150 text-primary-700 font-semibold hover:bg-primary-200'
                            onClick={() => (openModal('create'))}>등록</Button>
                    <Button color='destructive'
                            className='bg-destructive-150 text-destructive-700 font-semibold hover:bg-destructive-200'
                            onClick={handleDeleteSelected}>삭제</Button>
                </div>
            </div>
            <div className='mt-4'>
                {error && <StateInfoWrapper preset="defaultError" />}
                {isLoading && <Skeleton className="w-full h-100"/>}
                {!isLoading && !error && lineData && (
                    <DataTable
                        data={lineData || []}
                        columns={columns}
                        pageSize={7}
                        selectable={true}
                        selectedRows={selectedLines}
                        onSelectChange={setSelectedLines}
                        filterFunction={(item, search) => {
                            const lowerSearch = search.toLowerCase();
                            return (
                                item.name.toLowerCase().includes(lowerSearch)
                            );
                        }}
                    />
                )} 
            </div>
            <LineModal 
                isOpen={isOpen}
                onClose={closeModal}
                mode={mode}
                onSuccess={mutate}
                selectedLineId={selectedLineId}
            />
        </>
    );
}