import {Modal, Form, FormItem, Button, Input, Select} from '@plug/ui';
import {useCallback, useState, useEffect} from 'react';
import {useCategoriesSWR, useCreateDevice, useUpdateDevice, useDeviceDetailSWR} from '@plug/common-services';
import {useToastStore} from '@plug/v1/admin/components/hook/useToastStore';

export interface DeviceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    mode: 'create' | 'edit';
    selectedDeviceId?: number;
}

export const DeviceModal = ({
                                mode,
                                isOpen,
                                onClose,
                                onSuccess,
                                selectedDeviceId
                            }: DeviceModalProps) => {
    // 디바이스 상태 관리 
    const [name, setName] = useState<string>('');
    const [code, setCode] = useState<string>('');

    const {addToast} = useToastStore();

    // 디바이스 생성 훅 
    const {execute: createDevice, isLoading: isCreating, error: createError} = useCreateDevice();

    // 디바이스 생성 - 카테고리 목록 조회 
    const {data: categoryDevice} = useCategoriesSWR();

    // 디바이스 상세 조회 훅 
    const {data: detailDeviceData} = useDeviceDetailSWR(mode === 'edit' && selectedDeviceId ? Number(selectedDeviceId) : 0);

    // 디바이스 수정 훅 
    const {execute: updateDevice, isLoading: isUpdating, error: updateError} = useUpdateDevice(Number(selectedDeviceId));

    useEffect(() => {
        if (mode === 'edit' && detailDeviceData && isOpen) {
            setName(detailDeviceData.name);
            setCode(detailDeviceData.code);
        }
    }, [mode, detailDeviceData, isOpen]);

    const handleFinish = useCallback(async (values: Record<string, string>) => {
        if (mode === 'edit' && detailDeviceData) {
            try {
                const device = await updateDevice({
                    name: values.name || name,
                    code: values.code || code,
                    deviceCategoryId: Number(values.categoryId)
                })

                if (device) {
                    addToast({
                        title: '수정 성공',
                        description: '디바이스가 성공적으로 수정되었습니다.',
                        variant: 'normal'
                    });
                    if (onSuccess) onSuccess();
                    resetForm();
                }
            } catch (error) {
                addToast({
                    title: '수정 실패',
                    description: '디바이스 수정에 실패했습니다.',
                    variant: 'critical'
                });
                console.error('디바이스 수정 실패:', error)
            }
        } else {
            try {
                const device = await createDevice({
                    name: values.name,
                    code: values.code,
                    deviceCategoryId: Number(values.categoryId)
                });

                if (device) {
                    addToast({
                        title: '등록 완료',
                        description: '디바이스가 성공적으로 등록되었습니다.',
                        variant: 'normal'
                    });
                    if (onSuccess) onSuccess();
                    resetForm();
                }
            } catch (error) {
                addToast({
                    title: '등록 실패',
                    description: '디바이스 등록에 실패했습니다.',
                    variant: 'critical'
                });
                console.error('디바이스 등록 실패:', error);
            }
        }
    }, [createDevice, updateDevice, detailDeviceData, onSuccess, name, code, mode, addToast]);

    // 폼 초기화
    const resetForm = () => {
        setName('');
        setCode('');
        onClose();
    };

    // 에러 처리
    const error = createError || updateError;
    const isProcessing = isCreating || isUpdating;

    return (
        <Modal
            title={mode === 'create' ? '디바이스 등록' : '디바이스 수정'}
            isOpen={isOpen}
            onClose={isProcessing ? undefined : resetForm}
            closeOnOverlayClick={false}
            overlayClassName="bg-black/50"
        >
            <Form
                key={mode + (detailDeviceData?.id ?? '')}
                initialValues={
                    mode === 'edit' && detailDeviceData
                        ? {
                            name: detailDeviceData?.name,
                            code: detailDeviceData?.code,
                            categoryId: String(detailDeviceData?.categoryId)
                        }
                        : {
                            name: '',
                            code: '',
                            categoryId: '',
                        }
                }
                onSubmit={handleFinish}
            >
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                        {error.message}
                    </div>
                )}
                <FormItem name='categoryId' label='카테고리' required>
                    <Select>
                        <Select.Trigger placeholder='카테고리를 선택하세요.'/>
                        <Select.Content>
                            {categoryDevice?.map(role => (
                                <Select.Item
                                    key={role.id}
                                    value={String(role.id)}
                                >
                                    {role.name}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select>
                </FormItem>
                <FormItem name="name" label="디바이스 이름" required>
                    <Input.Text
                        placeholder="디바이스 이름을 입력하세요"
                        value={name}
                        onChange={value => setName(value)}
                    />
                </FormItem>
                <FormItem name="code" label="디바이스 코드" required>
                    <Input.Text
                        placeholder="디바이스 코드를 입력하세요"
                        value={code}
                        onChange={value => setCode(value)}
                    />
                </FormItem>

                <div className="mt-6 flex justify-center gap-2">
                    <Button type="button" onClick={resetForm}>
                        취소
                    </Button>
                    <Button
                        type="submit"
                        color="primary"
                        isLoading={isProcessing}
                    >
                        {mode === 'create' ? '등록' : '수정'}
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}