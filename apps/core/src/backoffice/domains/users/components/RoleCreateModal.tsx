import React, { useCallback } from 'react';
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
} from '@plug/ui';
import { toast } from 'sonner'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateRole } from '@plug/common-services/services';
import { RoleCreateModalProps } from '@/backoffice/domains/users/types/role';

export const RoleCreateModal: React.FC<RoleCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
    // 역할 생성
    const { execute: createRole, isLoading: isRoleCreating } = useCreateRole();

    const roleFormSchema = z.object({
        name: z.string().min(1, {
            message: '역할 이름을 입력해주세요.'
        }),
        description: z.string().min(1, {
            message: '역할 설명을 입력해주세요.'
        }),
    });

    const modalForm = useForm<z.infer<typeof roleFormSchema>>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
            name: '',
            description: '',
        },
        mode: 'onChange',
    });

    const resetForm = useCallback(() => {
        modalForm.reset({
            name: '',
            description: '',
        });
        onClose();
    }, [modalForm, onClose]);

    const handleSubmit = useCallback(async (data: z.infer<typeof roleFormSchema>) => {
        try {
            await createRole({ 
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