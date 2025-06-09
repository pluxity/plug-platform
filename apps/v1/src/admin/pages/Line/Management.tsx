import {Button, DataTable, Skeleton} from '@plug/ui';
import {columns} from './constants/lineColumns';
import {LineModal} from './components/LineModal';
import {useModal} from '../../components/hook/useModal';
import {useLinesSWR, deleteLine} from '@plug/common-services';
import {useLine} from './utils/useLine';
import {StateInfoWrapper} from "@plug/v1/admin/components/boundary/StateInfoWrapper";
import {useState} from 'react';
import {Line} from './types/line.types';
import {useToastStore} from "../../components/hook/useToastStore";

export default function LinePage() {
    const {isOpen, mode, openModal, closeModal} = useModal();
    const {data, error, isLoading, mutate} = useLinesSWR();
    const {addToast} = useToastStore();

    const [selectedLines, setSelectedLines] = useState<Set<Line>>(new Set());
    const [selectedLineId, setSelectedLineId] = useState<number>();

    const handleDelete = async (lineId: number, shouldMutate = true) => {
        try {
            await deleteLine(lineId);
            if(shouldMutate) await mutate();
            addToast({
                variant: "normal",
                title: "삭제 완료",
                description: "선택한 항목이 삭제되었습니다."
            });
        } catch (err) {
            addToast({
                variant: "critical",
                title: "삭제 실패",
                description: err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다."
            });
        }
    };

    const handleEdit = async (lineId: number) => {
        await setSelectedLineId(lineId);
        openModal('edit');
    };

    const lineData = useLine(data || [], handleDelete, handleEdit);

    const handleDeleteSelected = async () => {
        const isConfirmed = window.confirm("선택한 항목을 삭제하시겠습니까?");
        if (!isConfirmed) return;
        
        if (selectedLines.size === 0) {
            return addToast({
                variant: "warning",
                title: '선택 필요',
                description: "삭제할 항목을 선택해주세요."
            });
        }

        try {
            await Promise.all(
                Array.from(selectedLines).map(line => handleDelete(line.id), false)
            );
            await mutate();
            addToast({
                variant: "normal",
                title: '일괄 삭제 완료',
                description: `${selectedLines.size}개의 항목이 삭제되었습니다.`
            });
            setSelectedLines(new Set());
        } catch (err) {
            addToast({
                variant: "critical",
                title: '삭제 실패',
                description: err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다."
            });
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
                {!isLoading && !error && lineData && (
                    <DataTable
                        data={lineData || []}
                        columns={columns}
                        pageSize={7}
                        selectable={true}
                        selectedRows={selectedLines}
                        onSelectChange={setSelectedLines}
                        showSearch
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