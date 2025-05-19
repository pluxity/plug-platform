import { Modal, Form, Button, Select, Input, FormItem } from '@plug/ui';
import { CreateFormValues } from '../types/UserModal.types';
import {useCreateUser, useRolesSWR} from "@plug/common-services";

export interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
}

export const CreateUserModal = ({ isOpen, onClose, mode }: CreateUserModalProps) =>{
    const { data: roleList } = useRolesSWR();
    const { execute: createUser, error } = useCreateUser();

    const handleFinish = async (values: CreateFormValues) => {
        const result = await createUser(values);

        if (result) {
            alert('사용자 등록 완료');
            onClose();
        } else {
            alert(error?.message ?? '등록 실패');
        }
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
                <FormItem name="role" label='권한 선택'>
                    <Select className="w-full" type="multiple">
                        <Select.Trigger placeholder="권한을 선택해주세요" />
                        <Select.Content>
                            {error && (
                                <div className="px-2 py-1 text-sm text-red-500">권한 목록을 가져오지 못했습니다.</div>
                            )}
                            {!error && !roleList && (
                                <div className="px-2 py-1 text-sm text-gray-400">로딩중...</div>
                            )}
                            {!error && roleList && roleList.length === 0 && (
                                <div className="px-2 py-1 text-sm text-gray-400">권한 목록이 없습니다.</div>
                            )}
                            {!error && roleList && roleList.length > 0 &&
                                roleList.map((role) => (
                                    <Select.Item key={role.id} value={String(role.name)}>
                                        {role.name}
                                    </Select.Item>
                                ))}
                        </Select.Content>
                    </Select>

                </FormItem>
                <FormItem name="username" label='아이디' required>
                    <Input.Text placeholder="사용자의 아이디를 입력해주세요."/>
                </FormItem>
                <FormItem name="password" label='비밀번호' required>
                    <Input.Text type="password" placeholder="사용자의 비밀번호를 입력해주세요."/>
                </FormItem>
                <FormItem name="name" label='이름' required>
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
