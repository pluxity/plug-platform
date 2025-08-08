import React, {useState} from 'react';
import { PageContainer } from '@/backoffice/common/view/layouts';
import { Card, CardContent, DataTable, Button, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@plug/ui';
import { useDevicesSWR } from '@plug/common-services/services';
import { DeviceMapper } from '@/backoffice/domains/device/mapper/deviceMapper';
import { deleteDevice, useDeviceCategoryTree } from '@plug/common-services';
import { DeviceCategoryResponse } from '@plug/common-services/types';
import { DeviceCreateModal } from '@/backoffice/domains/device/components/DeviceCreateModal';
import { DeviceEditModal } from '@/backoffice/domains/device/components/DeviceEditModal';
import { DeviceData } from '@/backoffice/domains/device/types/device';
import { toast } from 'sonner';

const DeviceList: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [category, setCategory] = useState("all");
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [deleteDeviceData, setDeleteDeviceData] = useState<DeviceData | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // 디바이스 목록 조회
    const { data, mutate } = useDevicesSWR();
    const { categories } = useDeviceCategoryTree();

    // 디바이스 목록 매핑
    const deviceData = data ? data.map(DeviceMapper) : [];

    // 디바이스 카테고리 필터링
    const filteredDeviceData = category === "all" ? deviceData : deviceData.filter(device => device.categoryName === category);

    // 디바이스 카테고리 옵션 
    const categoryOptions = [
        { label: '전체', value: 'all' },
        ...categories.map((category: DeviceCategoryResponse) => ({
            label: category.name,
            value: category.name,
        })),
    ]

    // 이벤트 핸들러 함수
    const handleCreate = () => {
        setIsCreateModalOpen(true);
    }

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        mutate();
    }

    const handleEdit = (deviceId: string) => {
        setSelectedDeviceId(deviceId);
        setIsEditModalOpen(true);
    }

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        mutate();
    }

    const handleDelete = (device: DeviceData) => {
        setDeleteDeviceData(device);
    }

    const handleDeleteConfirm = async () => {
        if (!deleteDeviceData?.id) return;
        try{
            await deleteDevice(deleteDeviceData.id);
            toast.success('삭제가 완료되었습니다.');
            mutate();
        } catch(error){
            console.error('디바이스 삭제 실패:', error);
            toast.error('삭제에 실패했습니다.');
        } finally{
            setDeleteDeviceData(null);
        }
    }

    const handleDeleteCancel = () => {
        setDeleteDeviceData(null);
    }

    const selects = [
        {
            key: "category",
            placeholder: "디바이스 카테고리",
            options: categoryOptions,
            value: category,
            onChange: setCategory,
        }
    ]

    const columns = [
        {
            accessorKey: 'categoryName',
            header: '디바이스 카테고리',
        },    
        {
            accessorKey: 'name',
            header: '디바이스 이름',
        },  
        {
            accessorKey: 'thumbnailFile',
            header: '썸네일 파일',
            cell: ({ row }: { row: { original: DeviceData } }) => (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                    <img src={row.original.thumbnailFile} alt="썸네일 파일" className="w-full h-full object-cover" />
                </div>
            ),
        },
        {
            id: 'actions',
            header: '관리',
            cell: ({ row }: { row: { original: DeviceData } }) => (
                <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => row.original.id && handleEdit(row.original.id)}>수정</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(row.original)}>삭제</Button>
                </div>
            ),
        },
    ]

    return (
        <PageContainer title="디바이스 관리">
            <Card>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={filteredDeviceData}
                        pageSize={12}
                        showFilter={true}
                        filterPlaceholder="디바이스 이름으로 검색하세요."
                        filterColumnKey="name"
                        selects={selects}
                        buttons={<Button onClick={handleCreate}>등록</Button>}
                    />
                </CardContent>
            </Card>

            <DeviceCreateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {isEditModalOpen && selectedDeviceId !== null && (
                <DeviceEditModal
                    isOpen={true}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={handleEditSuccess}
                    deviceId={selectedDeviceId}
                />
            )}

            <AlertDialog open={!!deleteDeviceData} >
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {deleteDeviceData && `${deleteDeviceData.name} 디바이스를 삭제하시겠습니까?`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleDeleteCancel}>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>삭제</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PageContainer>
    )
}

export default DeviceList;