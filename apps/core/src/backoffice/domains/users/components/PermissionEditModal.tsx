import { useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, ModalForm, ModalFormContainer, ModalFormField, ModalFormItem, Input, Button, SelectContent, SelectItem, Select, SelectTrigger, SelectValue } from '@plug/ui';
import { PermissionEditModalProps } from '@/backoffice/domains/users/types/permisson';
import { usePermissionDetail, useUpdatePermission, useResourceTypesSWR } from '@plug/common-services';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

export const PermissionEditModal : React.FC<PermissionEditModalProps> = ({ isOpen, onClose, onSuccess, permissionId }) => {
    // 권한 상세 목록 조회
    const { data, execute: detailPermission } = usePermissionDetail(permissionId);
    const { execute: updatePermission, isLoading: isPermissionUpdating } = useUpdatePermission(permissionId);
    const { data: resourceTypes } = useResourceTypesSWR();

    const permissionFormSchema = z.object({
        resourceName: z.string().min(1, {
            message: '권한 명을 선택해주세요.'
        }),
        resourceId: z.string().min(1, {
            message: '권한 ID를 입력해주세요.'
        }),
    })

    const modalForm = useForm<z.infer<typeof permissionFormSchema>>({
        resolver: zodResolver(permissionFormSchema),
        defaultValues: {
            resourceName: '',
            resourceId: '',
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (isOpen && permissionId) {
            detailPermission();
        }
    }, [isOpen, permissionId]);

    useEffect(() => {
        if (data) {
            modalForm.reset({
                resourceName: data.resourceName,
                resourceId: data.resourceId,
            });
        }
    }, [data, modalForm]);

    const resetForm = useCallback(() => {
        modalForm.reset({
            resourceName: '',
            resourceId: '',
        });
        onClose();
    }, [modalForm, onClose]);

    const handleSubmit = useCallback(async (data: z.infer<typeof permissionFormSchema>) => {
        try {
            await updatePermission({
                resourceName: data.resourceName,
                resourceId: data.resourceId,
            });
            toast.success('권한 수정 완료');
            onSuccess?.();
            resetForm();
        } catch (error) {
            toast.error((error as Error).message || '권한 수정에 실패했습니다.');
        }
    }, [updatePermission, onSuccess, resetForm]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent title="권한 수정" className="max-w-xl" dimmed disableBackground>
                <ModalForm {...modalForm}>
                    <form onSubmit={modalForm.handleSubmit(handleSubmit)}>
                        <ModalFormContainer>
                            <ModalFormField
                                control={modalForm.control}
                                name="resourceName"
                                render={({ field }) => (
                                    <ModalFormItem label="권한 명" message={modalForm.formState.errors.resourceName?.message}>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="권한 명을 선택해주세요" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {resourceTypes?.map(type => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </ModalFormItem>
                                )}
                            />
                            <ModalFormField
                                control={modalForm.control}
                                name="resourceId"
                                render={({ field }) => (
                                    <ModalFormItem label="권한 ID" message={modalForm.formState.errors.resourceId?.message}>
                                        <Input {...field} placeholder="권한 ID를 입력해주세요." required />
                                    </ModalFormItem>
                                )}
                            />
                        </ModalFormContainer>
                        <DialogFooter> 
                            <Button type="button" variant="outline" onClick={resetForm} disabled={isPermissionUpdating} >취소</Button>
                            <Button type="submit" disabled={isPermissionUpdating || !modalForm.formState.isValid} >
                                {isPermissionUpdating ? '처리 중...' : '수정'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    )
}