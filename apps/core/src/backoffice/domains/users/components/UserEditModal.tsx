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
import { useUpdateUser, useUserDetailSWR, useRolesSWR } from '@plug/common-services';

import { userEditFormSchema, type UserEditFormData } from '@/backoffice/domains/users/schemas/userSchemas';
import { UserEditModalProps } from '@/backoffice/domains/users/types/user';

export const UserEditModal: React.FC<UserEditModalProps> = ({ isOpen, onClose, onSuccess, userId }) => {
    const { data, mutate } = useUserDetailSWR(isOpen && userId ? userId : undefined);
    const { execute: updateUser, isLoading: isUserUpdating } = useUpdateUser(userId);
    const { data: roleData } = useRolesSWR();
    const roleOptions = useMemo(() => {
        return roleData?.map(role => ({
            label: role.name,
            value: role.id.toString(),
        })) || [];
    }, [roleData]);

    const modalForm = useForm<UserEditFormData>({
        resolver: zodResolver(userEditFormSchema),
        defaultValues: {
            roleIds: [],
            name: '',
            phoneNumber: '',
            department: '',
        },
        mode: 'onChange',
        reValidateMode: 'onChange'
    });

    useEffect(() => {
        if (isOpen && data) {
            modalForm.reset({
                roleIds: Array.from(data.roles).map(role => role.id),
                name: data.name,
                phoneNumber: data.phoneNumber,
                department: data.department,
            });
        }
    }, [isOpen, data, modalForm]);

    const resetForm = useCallback(() => {
        if (data) {
            modalForm.reset({
                roleIds: Array.from(data.roles).map(role => role.id),
                name: data.name,
                phoneNumber: data.phoneNumber,
                department: data.department,
            });
        }
        onClose();
    }, [data, modalForm, onClose]);

    const handleSubmit = useCallback(async (data: UserEditFormData) => {
        try {
            await updateUser({ 
                roleIds: data.roleIds,
                name: data.name,
                phoneNumber: data.phoneNumber,
                department: data.department,
            });
            toast.success('사용자 수정 완료');
            onSuccess?.();
            mutate(); 
            resetForm();
        } catch (error) {
            toast.error((error as Error).message || '사용자 수정에 실패했습니다.');
        }
    }, [updateUser, onSuccess, mutate, resetForm]);

    return (
        <Dialog open={isOpen} onOpenChange={resetForm}>
            <DialogContent title="사용자 수정" className="max-w-xl" dimmed disableBackground>
                <ModalForm {...modalForm}>
                    <form onSubmit={modalForm.handleSubmit(handleSubmit)}>
                        <ModalFormContainer>
                            <ModalFormField 
                                control={modalForm.control}
                                name="roleIds"
                                render={({ field }) => (
                                    <ModalFormItem 
                                        label="역할"
                                        message={modalForm.formState.errors.roleIds?.message}
                                    >
                                        <MultiSelect
                                            value={field.value.map(String)}
                                            onChange={(value) => field.onChange(value.map(Number))}
                                            options={roleOptions}
                                            placeholder="역할(들)을 선택해주세요."
                                        />
                                    </ModalFormItem>
                                )}
                            />
                            <ModalFormField
                                control={modalForm.control}
                                name="name"
                                render={({ field }) => (
                                    <ModalFormItem label="이름" message={modalForm.formState.errors.name?.message}>
                                        <Input {...field} placeholder="이름을 입력해주세요." />
                                    </ModalFormItem>
                                )}
                            />
                            <ModalFormField
                                control={modalForm.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <ModalFormItem label="전화번호" message={modalForm.formState.errors.phoneNumber?.message} description="010-0000-0000 형식으로 입력해주세요.">
                                        <Input {...field} placeholder="전화번호를 입력해주세요." />
                                    </ModalFormItem>
                                )}
                            />
                            <ModalFormField
                                control={modalForm.control}
                                name="department"
                                render={({ field }) => (
                                    <ModalFormItem label="부서" message={modalForm.formState.errors.department?.message}>
                                        <Input {...field} placeholder="부서를 입력해주세요." />
                                    </ModalFormItem>
                                )}
                            />
                        </ModalFormContainer>
                        <DialogFooter>
                            <Button type="button" onClick={resetForm} disabled={isUserUpdating} variant="outline">
                                취소
                            </Button>
                            <Button type="submit" disabled={isUserUpdating || !modalForm.formState.isValid}>
                                {isUserUpdating ? '처리 중...' : '수정'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    );
};

export default UserEditModal;