import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  Button,
  Input,
  ModalForm,
  ModalFormItem,
} from '@plug/ui';
import { toast } from '@plug/ui'
import { useRoleDetailSWR, useUpdateRole } from '@plug/common-services';
import { RoleEditModalProps } from '@/backoffice/domains/users/types/role';

export const RoleEditModal: React.FC<RoleEditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  roleId,
}) => {
    // 역할 정보 
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // 역할 상세 목록 조회
    const { data, mutate } = useRoleDetailSWR(isOpen && roleId ? roleId : undefined);

    const { execute: updateRole, isLoading: isRoleUpdating } = useUpdateRole(roleId);

    useEffect(() => {
        if (isOpen && data) {
            setName(data.name ?? '');
            setDescription(data.description ?? '');
        }
    }, [isOpen, data]);

    // 역할 정보 변경 핸들러
    const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);
    
    const handleDescriptionChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    }, []);

    const resetForm = useCallback(() => {
        setName('');
        setDescription('');
        onClose();
        mutate();
    }, [onClose, mutate]);

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await updateRole({ 
                name, 
                description 
            });
            toast.success('역할 수정 완료');
            onSuccess?.();
            resetForm();
        } catch (error) {
            toast.error((error as Error).message || '역할 수정에 실패했습니다.');
        }
    }, [name, description, updateRole, onSuccess, resetForm]);

    return (
        <Dialog open={isOpen} onOpenChange={resetForm}>
            <DialogContent title="역할 수정" className="max-w-xl" dimmed disableBackground>
                <form onSubmit={handleSubmit}>
                <ModalForm>
                    <ModalFormItem label="역할 이름">
                        <Input value={name} onChange={handleNameChange} placeholder="역할을 입력해주세요." required />
                    </ModalFormItem>
                    <ModalFormItem label="역할 설명">
                        <Input value={description} onChange={handleDescriptionChange} placeholder="역할을 설명해주세요." required />
                    </ModalFormItem>
                </ModalForm>
                <DialogFooter>
                    <Button type="button" onClick={resetForm} disabled={isRoleUpdating} variant="outline">
                        취소
                    </Button>
                    <Button type="submit" disabled={isRoleUpdating || !name || !description}>
                        {isRoleUpdating ? '처리 중...' : '수정'}
                    </Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
export default RoleEditModal;