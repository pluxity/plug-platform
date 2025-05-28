import { Modal, Form, FormItem, Button, Input } from '@plug/ui';
import { useCreateUser, useUserDetailSWR, useUpdateUser } from '@plug/common-services';
import { useCallback, useState, useEffect } from 'react';

export interface UserListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    mode: 'create' | 'edit';
    selectedUserId?: number; 
}

export const UserListModal = ({ isOpen, onClose, onSuccess, mode, selectedUserId }: UserListModalProps) => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [department, setDepartment] = useState('');

    // 사용자 생성 훅
    const { execute: createUser, isLoading: isCreating, error: createError } = useCreateUser();

    // 사용자 상세 조회 훅 
    const { data: detailUserData } = useUserDetailSWR(mode === 'edit' && selectedUserId ? Number(selectedUserId) : 0);

    // 사용자 수정 훅
    const { execute: updateUser, isLoading: isUserUpdating, error: userUpdateError } = useUpdateUser(Number(selectedUserId));
    
    useEffect(() => {
        if(mode === 'edit' && detailUserData && isOpen) {
            setName(detailUserData.name);
        }
    }, [mode, detailUserData, isOpen])

    // 제출 핸들러
    const handleFinish = useCallback(async (values: Record<string, string>) => {
        if(mode === 'edit' && detailUserData){
            try{
                const user = await updateUser({
                    username: values.username || detailUserData.username,
                    name: values.name || detailUserData.name,
                    phoneNumber: values.phoneNumber || detailUserData.phoneNumber,
                    department: values.department || detailUserData.department,
                });

                if(user){
                    alert('사용자가 성공적으로 수정되었습니다.');
                    resetForm();
                    if(onSuccess) onSuccess();
                }
            } catch (error) {
                console.error('사용자 수정 실패:', error);
            }
        } else {
            try {
                const user = await createUser({
                    username: values.username,
                    password: values.password,
                    name: values.name,
                    phoneNumber: values.phoneNumber,
                    department: values.department,
                });
    
                if (user) {
                    alert('사용자가 성공적으로 등록되었습니다.');
                    resetForm();
                    if (onSuccess) onSuccess();
                }
            } catch (error) {
                console.error('사용자 등록 실패:', error);
            }
        }
    }, [ detailUserData, updateUser, createUser, onSuccess ]);


    // 폼 초기화 
    const resetForm = () => {
        setId('');
        setName('');
        setPhoneNumber('');
        setDepartment('');
        onClose();
    };
    
    // 에러 메시지 표시 
    const error = createError || userUpdateError;
    const isProcessing = isCreating || isUserUpdating;

    return (
        <Modal
            title={mode === 'create' ? '사용자 등록' : '사용자 수정'}
            isOpen={isOpen}
            onClose={isCreating ? undefined : resetForm}
            closeOnOverlayClick={false}
            overlayClassName="bg-black/50"
        >
            <div className="p-4">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                        {error.message}
                    </div>
                )}

                <Form 
                    key={mode + (detailUserData?.id ?? '')}
                    initialValues={
                        mode === 'edit' && detailUserData ? {
                            username: detailUserData.username,
                            name: detailUserData.name,
                            phoneNumber: detailUserData.phoneNumber,
                            department: detailUserData.department,
                        } : {
                            username: '',
                            name: '',
                            phoneNumber: '',
                            department: '',
                        }
                    }
                    onSubmit={handleFinish}
                >
                    {/* <FormItem name="role" label='권한' required>
                        <Select>
                            <Select.Trigger placeholder='권한을 선택하세요.' />
                            <Select.Content>
                                <Select.Item value='관리자 계정'>관리자 계정</Select.Item>
                                <Select.Item value='사용자 계정'>사용자 계정</Select.Item>
                            </Select.Content>
                        </Select>
                    </FormItem> */}

                    <FormItem name="username" label='아이디' required>
                        <Input.Text 
                            placeholder="아이디를 입력하세요."
                            value={id}
                            onChange={value => setId(value)}
                        />
                    </FormItem>
                    
                    <FormItem name="name" label='이름' required>
                        <Input.Text 
                            placeholder="이름을 입력하세요." 
                            value={name}
                            onChange={value => setName(value)}
                        />
                    </FormItem>

                    <FormItem name="phoneNumber" label='연락처' required>
                        <Input
                            type="tel"
                            placeholder="000-0000-0000 형식으로 입력하세요." 
                            value={phoneNumber}
                            onChange={value => setPhoneNumber(value)}
                        />
                    </FormItem>

                    <FormItem name="department" label='부서' required>
                        <Input.Text 
                            placeholder="부서를 입력하세요." 
                            value={department}
                            onChange={value => {setDepartment(value);}} 
                        
                        />
                    </FormItem>
                    
                    <div className="mt-6 flex justify-center gap-2">
                        <Button type="button" onClick={resetForm} disabled={isProcessing}>취소</Button>
                        <Button 
                            type="submit" 
                            color="primary" 
                            isLoading={isCreating || isUserUpdating }
                        >
                            {mode === 'create' ? '등록' : '수정'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
} 