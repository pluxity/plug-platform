import { Dialog, Form, Button, Select, Input, FormItem } from '@plug/ui';
import { CreateFormValues } from '../types/UserDialog.types';

export interface CreateUserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
}

export const CreateUserDialog = ({ isOpen, onClose, mode }: CreateUserDialogProps) =>{
    const handleFinish = (values: CreateFormValues) => {
        alert(`Submitted values: ${JSON.stringify(values, null, 2)}`);
    };

    return(
        <Dialog
          isOpen={isOpen}
          onClose={onClose}
          closeOnOverlayClick={false}
          overlayClassName="bg-black/50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-100">
            <h2 className="text-lg font-semibold mb-4">
                {mode === 'create' ? '사용자 등록' : '사용자 수정'}
            </h2>
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
                <FormItem name="id" label='아이디'>
                    <Input.Text placeholder="Enter your id"/>
                </FormItem>
                <FormItem name="password" label='비밀번호'>
                    <Input.Text type="password" placeholder="Enter your password"/>
                </FormItem>
                <FormItem name="username" label='이름'>
                    <Input.Text type="text" placeholder="Enter your username"/>
                </FormItem>
                <div className="mt-6 flex justify-center gap-2">
                    <Button onClick={onClose}>취소</Button>
                    <Button type="submit" color="primary">
                        {mode === 'create' ? '등록' : '수정'}
                    </Button>
                </div>
            </Form>
          </div>
        </Dialog>
    )
} 
