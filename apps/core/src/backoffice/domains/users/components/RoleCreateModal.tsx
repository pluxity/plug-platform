import React, { useCallback, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  Button,
  Input,
  ModalForm,
  ModalFormItem,
  ModalFormContainer,
  ModalFormField,
  MultiSelect,
} from '@plug/ui';
import { toast } from 'sonner'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleFormSchema, type RoleFormData } from '@/backoffice/domains/users/schemas/roleSchemas';
import { useCreateRole, usePermissions } from '@plug/common-services/services';
import { RoleCreateModalProps } from '@/backoffice/domains/users/types/role';

export const RoleCreateModal: React.FC<RoleCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
    // 역할 생성
    const { execute: createRole, isLoading: isRoleCreating } = useCreateRole();
    const { data: permissionData, execute: getPermissions } = usePermissions();

    // 권한 옵션
    const permissionOptions = useMemo(() => {
        return permissionData?.map(permission => ({
            label: permission.name,
            value: permission.id.toString(),
        })) || [];
    }, [permissionData]);

    useEffect(() => {
        getPermissions();
    }, []);

    const modalForm = useForm<RoleFormData>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
            name: '',
            description: '',
            permissionGroupIds: [],
        },
        mode: 'onChange',
    });

    const resetForm = useCallback(() => {
        modalForm.reset({
            name: '',
            description: '',
            permissionGroupIds: [],
        });
        onClose();
    }, [modalForm, onClose]);

    const handleSubmit = useCallback(async (data: RoleFormData) => {
        try {
            await createRole({ 
                permissionGroupIds: data.permissionGroupIds,
                name: data.name, 
                description: data.description 
            });
            toast.success('역할 등록 완료');
            onSuccess?.();
            resetForm();
        } catch (error) {
            toast.error((error as Error).message || '역할 등록에 실패했습니다.');
        }
    }, [createRole, onSuccess, resetForm]);

    return (
        <Dialog open={isOpen} onOpenChange={resetForm}>
            <DialogContent title="역할 등록" className="max-w-xl" dimmed disableBackground>
                <ModalForm {...modalForm}>
                    <form onSubmit={modalForm.handleSubmit(handleSubmit)}>
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
                        <ModalFormContainer>
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
                            <Button type="button" onClick={resetForm} disabled={isRoleCreating} variant="outline">
                                취소
                            </Button>
                            <Button type="submit" disabled={isRoleCreating || !modalForm.formState.isValid }>
                                {isRoleCreating ? '처리 중...' : '등록'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    );
};

export default RoleCreateModal;