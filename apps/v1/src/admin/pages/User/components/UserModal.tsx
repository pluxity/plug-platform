import { Modal, Form, FormItem, Button, Input } from '@plug/ui';
import { useCreateUser } from '@plug/common-services';
import { useCallback, useState } from 'react';

export interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    mode: 'create' | 'edit';
}

export const UserModal = ({ isOpen, onClose, onSuccess, mode }: UserModalProps) => {
    const [password, setPassword] = useState('');

    const handleChangePassword = (value: string) => {setPassword(value);}

    // 사용자 생성 훅
    const { execute: createUser, isLoading: isCreating, error: createError } = useCreateUser()

    // 제출 핸들러
    const handleFinish = useCallback(async (values: Record<string, string>) => {
        try {
            const result = await createUser({
                username: values.username,
                name: values.name,
                password: values.password,
                code: values.code
            });

            if (result) {
                alert('사용자가 성공적으로 등록되었습니다.');
                onClose();
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.error('사용자 등록 실패:', error);
        }
    }, [createUser, onClose, onSuccess]);

    return (
        <Modal
            title={mode === 'create' ? '사용자 등록' : '사용자 수정'}
            isOpen={isOpen}
            onClose={isCreating ? undefined : onClose}
            closeOnOverlayClick={false}
            overlayClassName="bg-black/50"
        >
            <div className="p-4">
                {createError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                        {createError.message}
                    </div>
                )}

                <Form onSubmit={handleFinish}>
                    <FormItem name="username" label='아이디' required>
                        <Input.Text placeholder="아이디를 입력하세요" />
                    </FormItem>
                    
                    <FormItem name="name" label='이름' required>
                        <Input.Text placeholder="이름을 입력하세요" />
                    </FormItem>
                    
                    <FormItem name="password" label='비밀번호' required>
                        {mode === 'create' ?
                            <Input.Password placeholder="비밀번호를 입력하세요" /> :
                            <div className="flex items-center gap-1">
                                <Input.Password 
                                    placeholder="비밀번호를 입력하세요" 
                                    onChange={handleChangePassword}
                                />
                                <Button
                                    type="submit"
                                    color="primary"
                                    className="w-30"
                                    disabled={!password}
                                >
                                    변경
                                </Button>
                            </div>
                        }
                    </FormItem>

                    <FormItem name="code" label='코드' required>
                        <Input.Text placeholder="코드를 입력하세요" />
                    </FormItem>
                    
                    <div className="mt-6 flex justify-center gap-2">
                        <Button type="button" onClick={onClose} disabled={isCreating}>취소</Button>
                        <Button 
                            type="submit" 
                            color="primary" 
                            disabled={isCreating}
                            isLoading={isCreating}
                        >
                            {mode === 'create' ? '등록' : '수정'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
} 