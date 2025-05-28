import { Select, Modal, Form, FormItem, Button } from '@plug/ui';
import { useRolesSWR, useAssignUserRoles} from '@plug/common-services';
import { useCallback } from 'react';

export interface UserRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    selectedUserId?: number; 
}

export const UserRoleModal = ({ isOpen, onClose, onSuccess, selectedUserId}: UserRoleModalProps) => {
    // 역할 목록 조회
    const { data: detailRoleData } = useRolesSWR();

    // 사용자 역할 할당
    const { execute: assignRoles, isLoading: isAssignRolesUpload, error: assignRolesError } = useAssignUserRoles(Number(selectedUserId));

    // 제출 핸들러 
    const handleFinish = useCallback(async (values: Record<string, string>) => {
        try {
            const role = await assignRoles({ roleIds: [Number(values.role)] });

            if(role){
                alert('권한이 성공적으로 등록되었습니다.');
                if(onSuccess) onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('권한 등록 실패:', error);
        }
    }, [ onSuccess, assignRoles ]);
    

    return (
        <Modal
            title="사용자 권한 관리"
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick={false}
            overlayClassName="bg-black/50"
        >
            <Form onSubmit={handleFinish}>
                <div className="h-40">
                    {assignRolesError && (
                        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                            {assignRolesError.message}
                        </div>
                    )}
                    <FormItem name="role" label='권한' required>
                        <Select>
                            <Select.Trigger placeholder='권한을 선택하세요.'/>
                            <Select.Content>
                                {detailRoleData?.map(role => (
                                    <Select.Item key={role.id} value={String(role.id)}>
                                        {role.description}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select>
                    </FormItem>
                </div>
                <div className="mt-6 flex justify-center gap-2">
                    <Button type="button" onClick={onClose}>취소</Button>
                    <Button type="submit" isLoading={isAssignRolesUpload} color="primary">등록</Button>
                </div>
            </Form>
            
        </Modal>
    );
}; 