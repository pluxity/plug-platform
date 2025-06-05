import {Button, DataTable, Skeleton} from '@plug/ui';
import {columns} from './constants/deviceColumns';
import {DeviceModal} from './components/DeviceModal';
import {useModal} from '../../components/hook/useModal';
import {useDevicesSWR, deleteDevice} from '@plug/common-services';
import {useDevice} from './utils/useDevice';
import {StateInfoWrapper} from '../../components/boundary/StateInfoWrapper';
import {useState} from 'react';
import {Device} from './types/device.types';
import {useToastStore} from '../../components/hook/useToastStore';

export default function DevicePage() {
    const {isOpen, mode, openModal, closeModal} = useModal();
    const {data, error, isLoading, mutate} = useDevicesSWR();
    const {addToast} = useToastStore();

    const [ selectedDevices, setSelectedDevices ] = useState<Set<Device>>(new Set());
    const [ selectedDeviceId, setSelectedDeviceId ] = useState<string>();

    const handleDelete = async (deviceId: string) => {
        deleteDevice(deviceId).then(() => mutate());
    }

    const handleEdit = (deviceId: string) => {
        setSelectedDeviceId(deviceId);
        openModal('edit');
    }

    const deviceData = useDevice(data || [], handleDelete, handleEdit);

    const handleDeleteSelected = async () => {
        if (selectedDevices.size === 0) {
            addToast({
                description: '삭제할 항목을 선택해주세요.',
                variant: 'warning'
            });
            return;
        }

        if (!window.confirm(`선택한 ${selectedDevices.size}개의 항목을 삭제하시겠습니까?`)) return;

        try {
            await Promise.all(
                Array.from(selectedDevices).map(device => handleDelete(device.id))
            );

            addToast({
                title: '삭제 완료',
                description: `${selectedDevices.size}개의 항목이 삭제되었습니다.`,
                variant: 'normal'
            });
            setSelectedDevices(new Set());
        } catch (error) {
            addToast({
                title: '삭제 실패',
                description: error instanceof Error ? error.message : '일부 항목 삭제 중 오류가 발생했습니다.',
                variant: 'critical'
            });
        }
    }

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
                {!isLoading && !error && deviceData &&
                    <DataTable
                        data={deviceData || []}
                        columns={columns}
                        pageSize={7}
                        selectable={true}
                        showSearch={true}
                        selectedRows={selectedDevices}
                        onSelectChange={setSelectedDevices}
                        filterFunction={(item, search) => {
                            const lowerSearch = search.toLowerCase();
                            return (
                                item.name.toLowerCase().includes(lowerSearch) ||
                                item.id.toLowerCase().includes(lowerSearch) ||
                                item.creator.toLowerCase().includes(lowerSearch) 
                            );
                        }}
                    />
                }
            </div>
            <DeviceModal
                isOpen={isOpen}
                onClose={closeModal}
                mode={mode}
                onSuccess={mutate}
                selectedDeviceId={selectedDeviceId}
            />
        </>
    )
}