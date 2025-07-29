import React, { useCallback } from 'react';
import { PermissionCreateModalProps } from '@/backoffice/domains/users/types/permisson';
import { Dialog, DialogContent, DialogFooter, Button, ModalForm, ModalFormContainer, ModalFormField, ModalFormItem, Input } from '@plug/ui';
import { useCreatePermission, useResourceTypesSWR } from '@plug/common-services/services';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';  
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@plug/ui';

export const PermissionCreateModal: React.FC<PermissionCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
    // 권한 생성
    const { execute: createPermission, isLoading: isPermissionCreating } = useCreatePermission();
    // 권한 설정 가능 리소스 타입 목록 조회 
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
    })

    const resetForm = useCallback(() => {
        modalForm.reset({
            resourceName: '',
            resourceId: '',
        });
        onClose();
    }, [modalForm, onClose]);

    const handleSubmit = useCallback(async (data: z.infer<typeof permissionFormSchema>) => {
        try {
            await createPermission({
                resourceName: data.resourceName,
                resourceId: data.resourceId,
            });
            toast.success('권한 등록 완료');
            onSuccess?.();
            resetForm();
        } catch (error) {
            toast.error((error as Error).message || '권한 등록에 실패했습니다.');
        }
    }, [createPermission, onSuccess, resetForm]);


    return (
        <Dialog open={isOpen} onOpenChange={resetForm}>
            <DialogContent title="권한 등록" className="max-w-xl" dimmed disableBackground>
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
                            <Button type="button" variant="outline" onClick={resetForm} disabled={isPermissionCreating} >취소</Button>
                            <Button type="submit" disabled={isPermissionCreating || !modalForm.formState.isValid} >
                                {isPermissionCreating ? '처리 중...' : '등록'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    )
};