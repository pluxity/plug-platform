import { Modal, Form, FormItem, Button, Input } from '@plug/ui';
import { useCallback, useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { useLineCreate, useLineDetailSWR, useLineUpdate } from '@plug/common-services';

export interface LineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    mode: 'create' | 'edit';
    selectedLineId?: number;
}

export const LineModal = ({ isOpen, onClose, onSuccess, mode, selectedLineId }: LineModalProps) => {
    // 호선 초기 이름 값
    const [name, setName] = useState<string>('');
    const [color, setColor] = useState<string>(''); 
   
    // 호선 생성 훅
    const { execute: createLine, isLoading: isCreating, error: createError } = useLineCreate();

    // 호선 상세 조회 훅
    const { data: detailLineData } = useLineDetailSWR(mode === 'edit' && selectedLineId ? Number(selectedLineId) : 0);

    // 호선 수정 훅
    const { execute: updateLine, isLoading: isLineUpdating, error: lineUpdateError } = useLineUpdate(Number(selectedLineId));

    useEffect(() => {
        if (mode === 'edit' && detailLineData && isOpen) {
            setName(detailLineData.name);
            setColor(detailLineData.color);
        }
    }, [detailLineData, mode, isOpen]);

    // 제출 핸들러
    const handleFinish = useCallback(async (values: Record<string, string>) => {
        // 수정 모달 제출
        if (mode === 'edit' && detailLineData) {
            try {
                const line = await updateLine({
                    name: values.name || name,
                    color: color
                });

                if (line) {
                    alert('호선이 성공적으로 수정되었습니다.');
                    resetForm();
                    if (onSuccess) onSuccess();
                }
            } catch (error) {
                console.error('호선 수정 실패:', error);
            }
        } else {
            // 등록 모달 제출
            try {
                const line = await createLine({
                    name: values.name || name,
                    color: color
                });

                if (line) {
                    alert('호선이 성공적으로 등록되었습니다.');
                    if (onSuccess) onSuccess();
                    resetForm(); 
                }
            } catch (error) {
                console.error('호선 등록 실패:', error);
            }
        }
    }, [createLine, updateLine, name, color, mode, detailLineData, onSuccess]);

    // 폼 초기화
    const resetForm = () => {
        setName('');
        setColor('');
        onClose();
    };

    // 에러 처리
    const error = createError || lineUpdateError;
    const isProcessing = isCreating || isLineUpdating;

    return (
        <Modal
            title={mode === 'create' ? '호선 등록' : '호선 수정'}
            isOpen={isOpen}
            onClose={isProcessing ? undefined : resetForm}
            closeOnOverlayClick={false}
            overlayClassName="bg-black/50"
        >
            <Form
                key={mode + (detailLineData?.id ?? '')}
                initialValues={
                    mode === 'edit' && detailLineData
                        ? {
                            name: detailLineData.name,
                            color: detailLineData.color
                        }
                        : {
                            name: '',
                            color: ''
                        }
                    }
                    onSubmit={handleFinish}
                >
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                        {error.message}
                    </div>
                )}
                <FormItem name="name" label="호선" required>
                    <Input.Text
                        placeholder="호선 이름을 입력하세요"
                        value={name}
                        onChange={value => setName(value)}
                    />
                </FormItem>

                <FormItem name="color" label="색상" required>
                    <ChromePicker
                        color={color || (mode === 'edit' && detailLineData ? detailLineData.color : '')}
                        onChangeComplete={(colorResult) => setColor(colorResult.hex)}
                    />
                </FormItem>

                <div className="mt-6 flex justify-center gap-2">
                    <Button type="button" onClick={resetForm} disabled={isProcessing}>
                        취소
                    </Button>
                    <Button
                        type="submit"
                        color="primary"
                        disabled={!name && !color}
                        isLoading={isProcessing}
                        >
                        {mode === 'create' ? '등록' : '수정'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};
