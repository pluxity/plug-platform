import React, { useMemo, useEffect, useCallback } from 'react';
import { Button, Input, Dialog, DialogContent, DialogFooter,ModalForm, ModalFormContainer, ModalFormField, ModalFormItem, SelectItem, Select, SelectTrigger, SelectValue, SelectContent} from '@plug/ui';
import { DeviceEditModalProps } from '@/backoffice/domains/device/types/device';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deviceFormSchema, type DeviceFormData } from '@/backoffice/domains/device/schemas/deviceSchemas';
import { useDeviceCategoriesSWR, useDeviceCompanyTypesSWR, useDeviceDetailSWR, useDeviceTypesSWR, useUpdateDevice } from '@plug/common-services';
import { toast } from 'sonner';

export const DeviceEditModal: React.FC<DeviceEditModalProps> = ({ isOpen, onClose, onSuccess, deviceId }) => {
    const { data: categoryList } = useDeviceCategoriesSWR();
    const { data: companyTypeList } = useDeviceCompanyTypesSWR();
    const { data: deviceTypeList } = useDeviceTypesSWR();
    const { data, mutate } = useDeviceDetailSWR(deviceId);
    const { execute: updateDevice, isLoading: isDeviceUpdating } = useUpdateDevice(deviceId);
    
    const modalForm = useForm<DeviceFormData>({
        resolver: zodResolver(deviceFormSchema),
        defaultValues: {
            categoryId: '',
            id: '',
            name: '',
            companyType: '',
            deviceType: '',
        },
        mode: 'onChange',
    });
    const categoryOptions = useMemo(() => {
        return categoryList?.map((category) => ({
            label: category.name,
            value: category.id.toString(),
        })) || [];
    }, [categoryList]);

    const companyTypeOptions = useMemo(() => {
        return companyTypeList?.map((companyType) => ({
            label: companyType.label,
            value: companyType.key,
        })) || [];
    }, [companyTypeList]);

    const deviceTypeOptions = useMemo(() => {
        return deviceTypeList?.map((deviceType) => ({
            label: deviceType.label,
            value: deviceType.key,
        })) || [];
    }, [deviceTypeList]);

    useEffect(() => {
        if(isOpen && data && !modalForm.formState.isDirty){
            modalForm.reset({
                categoryId: data.deviceCategory?.id.toString() ?? '',
                id: data.id,
                name: data.name,
                companyType: data.companyType,
                deviceType: data.deviceType,
            });
        }
    }, [data, isOpen, modalForm]);

    const resetForm = useCallback(() => {
        modalForm.reset({
            categoryId: data?.deviceCategory?.id.toString() || '',
            id: data?.id || '',
            name: data?.name || '',
            companyType: data?.companyType || '',
            deviceType: data?.deviceType || '',
        });
        onClose();
        mutate();
    }, [modalForm, onClose, mutate]);

   const handleSubmit = useCallback(async (data: DeviceFormData) => {
        try{
            await updateDevice({
                categoryId: Number(data.categoryId),
                name: data.name,
                companyType: data.companyType,
                deviceType: data.deviceType,
            })
            toast.success('디바이스 수정 완료');
            onSuccess?.();
            resetForm();
        }catch(error){
            console.error('디바이스 수정 실패:', error);
            toast.error((error as Error).message || '디바이스 수정에 실패했습니다.');
        }
   }, [updateDevice, onSuccess, resetForm]);

    return (
        <Dialog open={isOpen} onOpenChange={resetForm}>
            <DialogContent title="디바이스 수정" className="max-w-xl" dimmed disableBackground>
                <ModalForm {...modalForm}>
                    <form onSubmit={modalForm.handleSubmit(handleSubmit)}>
                        <ModalFormContainer>
                         <ModalFormField 
                                control={modalForm.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <ModalFormItem label="디바이스 카테고리" message={modalForm.formState.errors.categoryId?.message}>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="디바이스 카테고리를 선택해주세요." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categoryOptions.map((category) => (
                                                    <SelectItem key={category.value} value={category.value}>
                                                        {category.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </ModalFormItem>
                                )}
                            >
                            </ModalFormField>
                            <ModalFormField 
                                control={modalForm.control}
                                name="name"
                                render={({ field }) => (
                                    <ModalFormItem label="디바이스 이름" message={modalForm.formState.errors.name?.message}>
                                        <Input {...field} />
                                    </ModalFormItem>
                                )}
                            />
                            <ModalFormField
                                control={modalForm.control}
                                name="companyType"
                                render={({ field }) => (
                                    <ModalFormItem label="디바이스 회사 타입" message={modalForm.formState.errors.companyType?.message}>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="디바이스 회사를 선택해주세요." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companyTypeOptions.map((companyType) => (
                                                    <SelectItem key={companyType.value} value={companyType.value}>
                                                        {companyType.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </ModalFormItem>
                                )}
                            />
                            <ModalFormField
                                control={modalForm.control}
                                name="deviceType"
                                render={({ field }) => (
                                    <ModalFormItem label="디바이스 타입" message={modalForm.formState.errors.deviceType?.message}>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="디바이스 타입을 선택해주세요." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {deviceTypeOptions.map((deviceType) => (
                                                    <SelectItem key={deviceType.value} value={deviceType.value}>
                                                        {deviceType.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </ModalFormItem>
                                )}
                            />
                        </ModalFormContainer>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={resetForm} disabled={isDeviceUpdating}>
                                취소
                            </Button>
                            <Button type="submit" disabled={isDeviceUpdating || !modalForm.formState.isValid}>
                                {isDeviceUpdating ? '처리 중...' : '수정'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    )
}