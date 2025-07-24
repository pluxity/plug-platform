import React, { useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  Button,
  Input,
  ModalForm,
  ModalFormItem,
  MultiSelect,
} from '@plug/ui';
import { toast } from '@plug/ui'
import { useCreateUser, useRolesSWR } from '@plug/common-services/services';
import { UserCreateModalProps } from '@/backoffice/domains/users/types/user';

const FORM_INITIAL_STATE = {
    roleIds: [] as number[],
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

    // 역할 정보 
    const [form, setForm] = useState(FORM_INITIAL_STATE);

    // 역할 옵션 
    const roleOptions = useMemo(() => {
        return roleData?.map(role => ({
            label: role.name,
            value: role.id.toString(),
        })) || [];
    }, [roleData]);


    const handleRoleChange = useCallback((selectedRoles: string[]) => {
        setForm(prevForm => ({ ...prevForm, roleIds: selectedRoles.map(Number) }));
    }, []);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prevForm => ({ ...prevForm, [event.target.name]: event.target.value }));
    }, []);

    // 폼 초기화
    const resetForm = useCallback(() => {
        setForm(FORM_INITIAL_STATE);
        onClose();
    }, [onClose]);

    // 사용자 생성
    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await createUser({ 
                roleIds: form.roleIds,
                username: form.username,
                password: form.password,
                name: form.name,
                phoneNumber: form.phoneNumber,
                department: form.department,
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
                <form onSubmit={handleSubmit}>
                    <ModalForm>
                        <ModalFormItem label="역할">
                            <MultiSelect
                                options={roleOptions}
                                value={form.roleIds.map(String)}
                                onChange={handleRoleChange}
                                placeholder="역할(들)을 선택해주세요."
                            />
                        </ModalFormItem>
                        <ModalFormItem label="아이디">
                            <Input 
                                name="username"
                                value={form.username} 
                                onChange={handleChange} 
                                placeholder="아이디를 입력해주세요." 
                                required 
                            />
                        </ModalFormItem>
                        <ModalFormItem label="비밀번호">
                            <Input 
                                name="password"
                                type="password"
                                value={form.password} 
                                onChange={handleChange} 
                                placeholder="비밀번호를 입력해주세요." 
                                required 
                            />
                        </ModalFormItem>
                        <ModalFormItem label="이름">
                            <Input 
                                name="name"
                                value={form.name} 
                                onChange={handleChange} 
                                placeholder="이름을 입력해주세요." 
                                required 
                            />
                        </ModalFormItem>
                        <ModalFormItem label="전화번호">
                            <Input 
                                name="phoneNumber"
                                value={form.phoneNumber} 
                                onChange={handleChange} 
                                placeholder="전화번호를 입력해주세요." 
                                required 
                            />
                        </ModalFormItem>
                        <ModalFormItem label="부서">
                            <Input 
                                name="department"
                                value={form.department} 
                                onChange={handleChange} 
                                placeholder="부서를 입력해주세요." 
                                required 
                            />
                        </ModalFormItem>
                    </ModalForm>
                    <DialogFooter>
                        <Button type="button" onClick={resetForm} disabled={isUserCreating} variant="outline">
                            취소
                        </Button>
                        <Button type="submit" disabled={isUserCreating || !form.username || !form.password || !form.name || !form.phoneNumber || !form.department || !form.roleIds.length}>
                            {isUserCreating ? '처리 중...' : '등록'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UserCreateModal;