import { Modal, Form, Button, Select, Input, FormItem } from '@plug/ui';
import { CreateFormValues } from '../types/UserModal.types';

export interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
}

export const CreateUserModal = ({ isOpen, onClose, mode }: CreateUserModalProps) =>{
    const handleFinish = (values: CreateFormValues) => {
        alert(`Submitted values: ${JSON.stringify(values, null, 2)}`);
    };

    return(
        <Modal
            title={mode === 'create' ? '사용자 등록' : '사용자 수정'}
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick={false}
            overlayClassName="bg-black/50"
        >
            <Form<CreateFormValues> onSubmit={handleFinish}>
                <FormItem name="role" label='권한'>
                    <Select className="w-full">
                        <Select.Trigger placeholder="권한"/>
                        <Select.Content>
                            <Select.Item value="user">USER</Select.Item>
                            <Select.Item value="admin">ADMIN</Select.Item>
                        </Select.Content>
                    </Select>
                </FormItem>
                <FormItem name="id" label='아이디' required>
                    <Input.Text placeholder="사용자의 아이디를 입력해주세요."/>
                </FormItem>
                <FormItem name="password" label='비밀번호' required>
                    <Input.Text type="password" placeholder="사용자의 비밀번호를 입력해주세요."/>
                </FormItem>
                <FormItem name="username" label='이름' required>
                    <Input.Text type="text" placeholder="사용자의 이름을 입력해주세요."/>
                </FormItem>
                <FormItem name="code" label='코드' required>
                    <Input.Text type="text" placeholder="사용자의 코드를 입력해주세요."/>
                </FormItem>
                <div className="mt-6 flex justify-center gap-2">
                    <Button onClick={onClose}>취소</Button>
                    <Button type="submit" color="primary">
                        {mode === 'create' ? '등록' : '수정'}
                    </Button>
                </div>
            </Form>
        </Modal>
    )
} 
