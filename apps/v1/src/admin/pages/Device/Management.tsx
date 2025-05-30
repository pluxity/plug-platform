import { Button, DataTable, Skeleton } from '@plug/ui';
import { columns } from './constants/deviceColumns';
import { DeviceModal } from './components/DeviceModal';
import { useModal } from '../../components/hook/useModal';
import { useDevicesSWR, deleteDevice } from '@plug/common-services';
import { useDevice } from './utils/useDevice';
import { StateInfoWrapper } from '../../components/boundary/StateInfoWrapper';
import { useState } from 'react';
import { Device } from './types/device.types';

export default function DevicePage() {
    const { isOpen, mode, openModal, closeModal } = useModal();
    const { data, error, isLoading, mutate } = useDevicesSWR();

    const [ selectedDevices, setSelectedDevices ] = useState<Set<Device>>(new Set());
    const [ selectedDeviceId, setSelectedDeviceId ] = useState<number>();

    const handleDelete = async (deviceId: number) => {
        deleteDevice(deviceId).then(() => mutate());
    }

    const handleEdit = (deviceId: number) => {
        setSelectedDeviceId(deviceId);
        openModal('edit');
    }

    const deviceData = useDevice(data || [] , handleDelete, handleEdit);
    
    const handleDeleteSelected = () => {
        if(selectedDevices.size === 0) {
            return alert('삭제할 항목을 선택해주세요.')
        }
        Promise.all(
            Array.from(selectedDevices).map(device => handleDelete(device.id))
        )
        .then(() => {
            alert(`${selectedDevices.size} 개의 항목이 삭제 되었습니다.`);
            setSelectedDevices(new Set());
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
                                item.code.toLowerCase().includes(lowerSearch) ||
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