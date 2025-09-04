import React, { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner'; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  Button,
  Input,
  ModalForm,
  ModalFormField,
  ModalFormContainer,
  ModalFormItem,
  MultiSelect,
} from '@plug/ui';
import { useRoleDetailSWR, useUpdateRole, usePermissionsSWR } from '@plug/common-services';

import { roleFormSchema, type RoleFormData } from '@/backoffice/domains/users/schemas/roleSchemas';
import { RoleEditModalProps } from '@/backoffice/domains/users/types/role';

export const RoleEditModal: React.FC<RoleEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  roleId,
}) => {
    const { data, mutate } = useRoleDetailSWR(isOpen && roleId ? roleId : undefined);
    const { execute: updateRole, isLoading: isRoleUpdating } = useUpdateRole(roleId);
    const { data: permissionData } = usePermissionsSWR();
    const permissionOptions = useMemo(() => {
        return permissionData?.map(permission => ({
            label: permission.name,
            value: permission.id.toString(),
        })) || [];
    }, [permissionData]);

    const modalForm = useForm<RoleFormData>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
            name: '',
            description: '',
            permissionGroupIds: [],
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (isOpen && data) {
            modalForm.reset({
                permissionGroupIds: Array.from(data.permissions).map((permission) => permission.id),
                name: data.name,
                description: data.description,
            });
        }
    }, [isOpen, data, modalForm]);

    const resetForm = useCallback(() => {
        if (data) {
            modalForm.reset({
                permissionGroupIds: Array.from(data.permissions).map((permission) => permission.id),
                name: data.name,
                description: data.description,
            });
        }
        onClose();
        mutate();
    }, [data, modalForm, onClose, mutate]);

    const handleSubmit = useCallback(async (data: RoleFormData) => {
        try {
            await updateRole({ 
                permissionGroupIds: data.permissionGroupIds,
                name: data.name, 
                description: data.description 
            });
            toast.success('역할 수정 완료');
            onSuccess?.();
            resetForm();
        } catch (error) {
            toast.error((error as Error).message || '역할 수정에 실패했습니다.');
        }
    }, [updateRole, onSuccess, resetForm]);

    return (
        <Dialog open={isOpen} onOpenChange={resetForm}>
            <DialogContent title="역할 수정" className="max-w-xl" dimmed disableBackground>
                <ModalForm {...modalForm}>
                    <form onSubmit={modalForm.handleSubmit(handleSubmit)}>
                        <ModalFormContainer>
                            <ModalFormField
                                control={modalForm.control}
                                name="permissionGroupIds"
                                render={({ field }) => (
                                    <ModalFormItem label="권한" message={modalForm.formState.errors.permissionGroupIds?.message}>
                                        <MultiSelect
                                            value={field.value.map(String)}
                                            onChange={(value) => field.onChange(value.map(Number))}
                                            options={permissionOptions}
                                            placeholder="권한(들)을 선택해주세요."
                                        />
                                    </ModalFormItem>
                                )}
                            />
                            <ModalFormField
                                control={modalForm.control}
                                name="name"
                                render={({ field }) => (
                                    <ModalFormItem label="역할 이름" message={modalForm.formState.errors.name?.message}>
                                        <Input {...field} placeholder="역할을 입력해주세요." required />
                                    </ModalFormItem>
                                )}
                            />
                            <ModalFormField
                                control={modalForm.control}
                                name="description"
                                render={({ field }) => (
                                    <ModalFormItem label="역할 설명" message={modalForm.formState.errors.description?.message}>
                                        <Input {...field} placeholder="역할을 설명해주세요." required />
                                    </ModalFormItem>
                                )}
                            />
                        </ModalFormContainer>
                        <DialogFooter>
                            <Button type="button" onClick={resetForm} disabled={isRoleUpdating} variant="outline">
                                취소
                            </Button>
                            <Button type="submit" disabled={isRoleUpdating || !modalForm.formState.isValid}>
                                {isRoleUpdating ? '처리 중...' : '수정'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    );
};
export default RoleEditModal;