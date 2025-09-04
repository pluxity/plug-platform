import React, { useCallback } from 'react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { cctvCreateFormSchema, type CctvCreateFormData } from '../schemas/cctvSchemas';
import { CctvCreateModalProps } from '../types/cctv';
import { useForm } from 'react-hook-form';
import { useCreateCctv } from '@plug/common-services';
import { ModalForm, ModalFormContainer, ModalFormField, ModalFormItem, Dialog, DialogContent, DialogFooter, Input, Button } from '@plug/ui';

export const CctvCreateModal: React.FC<CctvCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
    
    const { execute: cctvCreate, isLoading: isCctvCreating } = useCreateCctv();

    const modalForm = useForm<CctvCreateFormData>({
        resolver: zodResolver(cctvCreateFormSchema),
        defaultValues: {
            id: '',
            name: '',
            url: '',
        },
        mode: 'onChange',
    });

    const resetForm = useCallback(() => {
        modalForm.reset({
            id: '',
            name: '',
            url: '',
        });
        onClose();
    }, [modalForm, onClose]);

    const handleSubmit = useCallback(async (data: CctvCreateFormData) => {
        try {
            await cctvCreate({
                id: data.id,
                name: data.name,
                url: data.url,
            });
        } catch (error) {
            console.error('CCTV 생성 실패', error);
            toast.error('CCTV 생성에 실패했습니다.');
            return;
        }
        
        toast.success('CCTV 생성 완료');
        onSuccess?.();
        resetForm();
    }, [cctvCreate, resetForm, onSuccess]);

    return (
        <Dialog open={isOpen} onOpenChange={resetForm}>
            <DialogContent title="CCTV 생성" className="max-w-xl" dimmed disableBackground>
                <ModalForm {...modalForm}>
                    <form onSubmit={modalForm.handleSubmit(handleSubmit)}>
                        <ModalFormContainer>
                            <ModalFormField
                                control={modalForm.control}
                                name="id"
                                render={({ field }) => (
                                    <ModalFormItem label="CCTV 아이디" message={modalForm.formState.errors.id?.message}>
                                        <Input {...field} placeholder="CCTV 아이디를 입력해주세요." />
                                    </ModalFormItem>
                                )}
                            />
                            <ModalFormField
                                control={modalForm.control}
                                name="name"
                                render={({ field }) => (
                                    <ModalFormItem label="CCTV 이름" message={modalForm.formState.errors.name?.message}>
                                        <Input {...field} placeholder="CCTV 이름을 입력해주세요." />
                                    </ModalFormItem>
                                )}
                            />
                            <ModalFormField
                                control={modalForm.control}
                                name="url"
                                render={({ field }) => (
                                    <ModalFormItem label="CCTV URL" message={modalForm.formState.errors.url?.message}>
                                        <Input {...field} placeholder="CCTV URL을 입력해주세요." />
                                    </ModalFormItem>
                                )}
                            />
                        </ModalFormContainer>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={resetForm} disabled={isCctvCreating}>
                                취소
                            </Button>
                            <Button type="submit" disabled={isCctvCreating || !modalForm.formState.isValid}>
                                {isCctvCreating ? '처리 중...' : '등록'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    );
};