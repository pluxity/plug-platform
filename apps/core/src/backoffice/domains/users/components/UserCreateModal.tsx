import React, { useCallback, useMemo } from 'react';
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
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateUser, useRolesSWR } from '@plug/common-services/services';
import { UserCreateModalProps } from '@/backoffice/domains/users/types/user';

const FORM_INITIAL_STATE = {
    roleIds: [],
    username: '',
    password: '',
    name: '',
    phoneNumber: '',
    department: '',
}

export const UserCreateModal: React.FC<UserCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
    // 사용자 생성
    const { execute: createUser, isLoading: isUserCreating } = useCreateUser();
    const { data: roleData } = useRolesSWR();

    // 역할 옵션 
    const roleOptions = useMemo(() => {
        return roleData?.map(role => ({
            label: role.name,
            value: role.id.toString(),
        })) || [];
    }, [roleData]);

    const userFormSchema = z.object({
        roleIds: z.array(z.number()).min(1, {
            message: '최소 1개 이상의 역할을 선택해주세요.'
        }),
        username: z.string().min(1, {
            message: '아이디를 입력해주세요.'
        }).max(20, {
            message: '아이디는 20글자 이하이어야 합니다.'
        }),
        password: z.string().min(6, {
            message: '비밀번호는 최소 6글자 이상이어야 합니다.'
        }).max(20, {
            message: '비밀번호는 20글자 이하이어야 합니다.'
        }),
        name: z.string().min(1, {
            message: '이름을 입력해주세요.'
        }).max(10, {
            message: '이름은 10글자 이하이어야 합니다.'
        }),
        phoneNumber: z.string().regex(/^01[016789]-?\d{3,4}-?\d{4}$/, {
            message: '올바른 휴대폰 번호 형식을 입력해주세요.'
        }),
        department: z.string().min(1, {
            message: '부서명을 입력해주세요.'
        })
    });

    const modalForm = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: FORM_INITIAL_STATE,
        mode: 'onChange',
    });
        
    // 폼 초기화
    const resetForm = useCallback(() => {
        modalForm.reset(FORM_INITIAL_STATE);
        onClose();
    }, [modalForm, onClose]);

    const handleSubmit = useCallback(async (data: z.infer<typeof userFormSchema>) => {
        try {
            await createUser({ 
                roleIds: data.roleIds,
                username: data.username,
                password: data.password,
                name: data.name,
                phoneNumber: data.phoneNumber,
                department: data.department,
            });
            toast.success('사용자 등록 완료');
            onSuccess?.();
            resetForm();
        } catch (error) {
            toast.error((error as Error).message || '사용자 등록에 실패했습니다.');
        }
    }, [createUser, onSuccess, resetForm]);

    return (
        <Dialog open={isOpen} onOpenChange={resetForm}>
            <DialogContent title="사용자 등록" className="max-w-xl" dimmed disableBackground>
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
                                name="username"
                                render={({ field }) => (
                                    <ModalFormItem label="아이디" message={modalForm.formState.errors.username?.message}>
                                        <Input {...field} placeholder="아이디를 입력해주세요." />
                                    </ModalFormItem>
                                )}
                            />
                            <ModalFormField
                                control={modalForm.control}
                                name="password"
                                render={({ field }) => (
                                    <ModalFormItem label="비밀번호" message={modalForm.formState.errors.password?.message}>
                                        <Input {...field} type="password" placeholder="비밀번호를 입력해주세요." />
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
                            <Button type="button" onClick={resetForm} disabled={isUserCreating} variant="outline">
                                취소
                            </Button>
                            <Button type="submit" disabled={isUserCreating || !modalForm.formState.isValid}>
                                {isUserCreating ? '처리 중...' : '등록'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    );
};

export default UserCreateModal;