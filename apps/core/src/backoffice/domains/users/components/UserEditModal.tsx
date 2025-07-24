import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import { useUpdateUser, useUserDetailSWR, useRolesSWR } from '@plug/common-services/services';
import { UserEditModalProps } from '@/backoffice/domains/users/types/user';

export const UserEditModal: React.FC<UserEditModalProps> = ({ isOpen, onClose, onSuccess, userId }) => {
    // 사용자 정보 
    const { data, mutate } = useUserDetailSWR(isOpen && userId ? userId : undefined);
    const { execute: updateUser, isLoading: isUserUpdating } = useUpdateUser(userId);
    const { data: roleData } = useRolesSWR();

    // 역할 정보 
    const [form, setForm] = useState({
        roleIds: [] as number[],
        name: '',
        phoneNumber: '',
        department: '',
    });

    // 역할 옵션 
    const roleOptions = useMemo(() => {
        return roleData?.map(function(role){
            return {
                label: role.name,
                value: role.id.toString(),
            }
        }) || [];
    }, [roleData]);

    // 사용자 정보 조회
    useEffect(() => {
        if (isOpen && data) {
            setForm({
                roleIds: Array.from(data.roles).map(function(role){
                    return role.id;
                }),
                name: data.name,
                phoneNumber: data.phoneNumber,
                department: data.department,
            });
        }
    }, [isOpen, data]);

    // 이벤트 핸들러
    const handleRoleChange = useCallback((selectedRoles: string[]) => {
        setForm(prevForm => ({ ...prevForm, roleIds: selectedRoles.map(Number) }));
    }, []);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prevForm => ({ ...prevForm, [event.target.name]: event.target.value }));
    }, []);

    // 폼 초기화
    const resetForm = useCallback(() => {
        setForm({
            roleIds: Array.from(data?.roles ?? []).map(function(role){
                return role.id;
            }),
            name: data?.name ?? '',
            phoneNumber: data?.phoneNumber ?? '',
            department: data?.department ?? '',
        });
        onClose();
        mutate();
    }, [onClose, data, mutate]);

    // 사용자 수정
    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await updateUser({ 
                roleIds: form.roleIds,
                name: form.name,
                phoneNumber: form.phoneNumber,
                department: form.department,
            });
            toast.success('사용자 수정 완료');
            onSuccess?.();
            mutate();
            resetForm();
        } catch (error) {
            toast.error((error as Error).message || '사용자 수정에 실패했습니다.');
        }
    }, [form, updateUser, onSuccess, resetForm, mutate]);

    return (
        <Dialog open={isOpen} onOpenChange={resetForm}>
            <DialogContent title="사용자 수정" className="max-w-xl" dimmed disableBackground>
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
                    <Button type="button" onClick={resetForm} disabled={isUserUpdating} variant="outline">
                        취소
                    </Button>
                    <Button type="submit" disabled={isUserUpdating || !form.name || !form.phoneNumber || !form.department || !form.roleIds}>
                        {isUserUpdating ? '처리 중...' : '수정'}
                    </Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UserEditModal;