import { Modal, Form, FormItem, Button, Input } from '@plug/ui';
import { useUpdateUserPassword } from '@plug/common-services';
import { useCallback, useState } from 'react';

export interface UserPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    selectedUserId?: number; 
}

export const UserPasswordModal = ({ isOpen, onClose, onSuccess, selectedUserId }: UserPasswordModalProps) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // 사용자 비밀번호 수정 훅
    const { execute: updatePassword, isLoading: isPasswordUpdating, error: passwordUpdateError } = useUpdateUserPassword(Number(selectedUserId));
    
    // 비밀번호 수정 제출 핸들러
    const handlePasswordFinish = useCallback(async (values: Record<string, string>) => {    
        try {
            const password = await updatePassword({
                currentPassword: values.currentPassword || currentPassword,
                newPassword: values.newPassword || newPassword
            });
    
            if(password) {
                alert('비밀번호가 성공적으로 수정되었습니다.');
                if(onSuccess) onSuccess();
                resetForm();
            }
        } catch(error) {
            console.error('사용자 비밀번호 수정 실패:', error);
        }
    }, [updatePassword, onSuccess, currentPassword, newPassword]);

    // 폼 초기화 
    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        onClose();
    };

    return (
        <Modal
            title='비밀번호 수정'
            isOpen={isOpen}
            onClose={isPasswordUpdating ? undefined : resetForm}
            closeOnOverlayClick={false}
            overlayClassName="bg-black/50"
        >
            <div className="p-4">
                {passwordUpdateError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                        {passwordUpdateError.message}
                    </div>
                )}

                <Form 
                    onSubmit={handlePasswordFinish}
                >
                    <FormItem name="currentPassword" label='현재 비밀번호' required>
                        <Input.Password 
                            placeholder="현재 비밀번호를 입력하세요." 
                            value={currentPassword}
                            onChange={value => setCurrentPassword(value)}
                        />
                    </FormItem> 

                    <FormItem name="newPassword" label='새 비밀번호' required>
                        <Input.Password 
                            placeholder="새 비밀번호를 입력하세요." 
                            value={newPassword}
                            onChange={value => setNewPassword(value)}
                        />
                    </FormItem>
                    
                    <div className="mt-6 flex justify-center gap-2">
                        <Button type="button" onClick={resetForm} disabled={isPasswordUpdating}>취소</Button>
                        <Button 
                            type="submit" 
                            color="primary" 
                            isLoading={isPasswordUpdating}
                        >
                            변경
                        </Button>
                    </div> 
                </Form>
            </div>
        </Modal>
    );
} 