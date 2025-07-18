import React, { useState, useCallback } from 'react';
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
import { useCreateRole } from '@plug/common-services/services';
import { RoleCreateModalProps } from '@/backoffice/domains/users/types/role';

export const RoleCreateModal: React.FC<RoleCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
    // 역할 정보 
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // 역할 생성
    const { execute: createRole, isLoading: isRoleCreating } = useCreateRole();

    // 역할 정보 변경 핸들러
    const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);
    
    const handleDescriptionChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    }, []);

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await createRole({ 
                name, 
                description 
            });
            toast.success('역할 등록 완료');
            onSuccess?.();
            resetForm();
        } catch (error) {
            toast.error((error as Error).message || '역할 등록에 실패했습니다.');
        }
    }, [name, description, createRole]);

    const resetForm = useCallback(() => {
        setName('');
        setDescription('');
        onClose();
    }, [onClose]);

    return (
        <Dialog open={isOpen} onOpenChange={resetForm}>
            <DialogContent title="역할 등록" className="max-w-xl" dimmed disableBackground>
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
                    <Button type="button" onClick={resetForm} disabled={isRoleCreating} variant="outline">
                        취소
                    </Button>
                    <Button type="submit" disabled={isRoleCreating || !name || !description}>
                        {isRoleCreating ? '처리 중...' : '등록'}
                    </Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RoleCreateModal;