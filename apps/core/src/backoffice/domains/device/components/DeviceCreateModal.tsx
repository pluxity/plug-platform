import React, { useMemo, useCallback } from 'react';
import { DeviceCreateModalProps } from '@/backoffice/domains/device/types/device';
import { Input, Button, Dialog, DialogContent, DialogFooter, ModalForm, ModalFormContainer, ModalFormField, ModalFormItem, Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@plug/ui';
import { deviceFormSchema, type DeviceFormData } from '@/backoffice/domains/device/schemas/deviceSchemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateDevice, useDeviceCategoriesSWR, useDeviceCompanyTypesSWR, useDeviceTypesSWR } from '@plug/common-services';
import { toast } from 'sonner';

export const DeviceCreateModal: React.FC<DeviceCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {

    const { execute: createDevice, isLoading: isDeviceCreating } = useCreateDevice();

    const { data: categoryList } = useDeviceCategoriesSWR();
    const { data: companyTypeList } = useDeviceCompanyTypesSWR();
    const { data: deviceTypeList } = useDeviceTypesSWR();
    
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

    const resetForm = useCallback(() => {
        modalForm.reset({
            categoryId: '',
            id: '',
            name: '',
            companyType: '',
            deviceType: '',
        });
        onClose();
    }, [modalForm, onClose]);

    const handleSubmit = useCallback(async (data: DeviceFormData) => {
        try {
            await createDevice({
                categoryId: Number(data.categoryId),
                id: data.id,
                name: data.name,
                companyType: data.companyType,
                deviceType: data.deviceType,
            });
            toast.success('디바이스 등록 완료');
            onSuccess?.();
            resetForm();
        } catch (error) {
            console.error('디바이스 등록 실패:', error);
            toast.error((error as Error).message || '디바이스 등록에 실패했습니다.');
        }
    }, [createDevice, onSuccess, resetForm]);

    return (
        <Dialog open={isOpen} onOpenChange={resetForm}>
            <DialogContent title="디바이스 등록" className="max-w-xl" dimmed disableBackground>
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
                                name="id"
                                render={({ field }) => (
                                    <ModalFormItem label="디바이스 아이디" message={modalForm.formState.errors.id?.message}>
                                        <Input {...field} />
                                    </ModalFormItem>
                                )}
                            />
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
                            <Button type="button" variant="outline" onClick={resetForm} disabled={isDeviceCreating}>
                                취소
                            </Button>
                            <Button type="submit" disabled={isDeviceCreating || !modalForm.formState.isValid}>
                                {isDeviceCreating ? '처리 중...' : '등록'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    )
}