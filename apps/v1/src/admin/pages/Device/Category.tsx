import { Button, DataTable, Skeleton } from '@plug/ui';
import { columns } from './constants/categoryColumns';
import { CategoryModal } from './components/CategoryModal';
import { useModal } from '../../components/hook/useModal';
import { useCategoriesSWR, deleteCategory } from '@plug/common-services';
import { useCategory } from './utils/useCategory';
import { StateInfoWrapper } from '../../components/boundary/StateInfoWrapper';
import { useState } from 'react';
import { Category } from './types/category.types';

export default function DeviceCategory() {
    const { isOpen, mode, openModal, closeModal } = useModal();
    const { data, error, isLoading, mutate } = useCategoriesSWR();

    const [ selectedCategories, setSelectedCategories ] = useState<Set<Category>>(new Set());
    const [ selectedCategoryId, setSelectedCategoryId ] = useState<number>();

    const handleDelete = async (categoryId: number) => {
        deleteCategory(categoryId).then(() => mutate());
    };

    const handleEdit = (categoryId: number) => {
        setSelectedCategoryId(categoryId);
        openModal('edit');
    };   

    const categoryData = useCategory(data || [] , handleDelete, handleEdit);

    const handleDeleteSelected = () => {
        if(selectedCategories.size === 0){
            return alert('삭제할 항목을 선택해주세요.');
        }
        Promise.all(
            Array.from(selectedCategories).map(category => handleDelete(category.id))
        )
        .then(() => {
            alert(`${selectedCategories.size} 개의 항목이 삭제 되었습니다.`);
            setSelectedCategories(new Set());
        })
    }

    return(
        <>
            <div className='flex'>    
                <div className='ml-auto flex gap-1'>
                    <Button color='primary' onClick={() => (openModal('create'))}>등록</Button>
                    <Button color='destructive' onClick={handleDeleteSelected}>삭제</Button>
                </div>
            </div>
            <div className='mt-4'>
                {error && <StateInfoWrapper preset="defaultError" />}
                {isLoading && <Skeleton className="w-full h-100"/>}
                {!isLoading && !error && categoryData && (
                    <DataTable
                        data={categoryData || []}
                        columns={columns}
                        pageSize={7}
                        selectable={true}
                        selectedRows={selectedCategories}
                        onSelectChange={setSelectedCategories}
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
            <CategoryModal 
                isOpen={isOpen}
                onClose={closeModal}
                mode={mode}
                onSuccess={mutate}
                selectedCategoryId={selectedCategoryId}
            />
        </>
    );
}