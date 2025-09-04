import { ModalForm, ModalFormContainer, ModalFormField, ModalFormItem, Dialog, DialogContent, DialogFooter, Input, Button } from '@plug/ui';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useCctvDetailSWR, useUpdateCctv } from '@plug/common-services';

import { baseCctvFormSchema, type CctvEditFormData } from '../schemas/cctvSchemas';
import { CctvEditModalProps } from '../types/cctv';
export const CctvEditModal: React.FC<CctvEditModalProps> = ({ isOpen, onClose, onSuccess, cctvId }) => {

    const { data } = useCctvDetailSWR(cctvId);

    const { execute: cctvUpdate, isLoading: isCctvUpdating } = useUpdateCctv(cctvId);

    const modalForm = useForm<CctvEditFormData>({
        resolver: zodResolver(baseCctvFormSchema),
        defaultValues: {
            name: '',
            url: '',
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if(isOpen && data) {
            modalForm.reset({
                name: data.name,
                url: data.url,
            });
        }
    }, [isOpen, data, modalForm]);

    const resetForm = useCallback(() => {
        modalForm.reset({
            name: '',
            url: '',
        });
        onClose();
    }, [modalForm, onClose]);

    const handleSubmit = useCallback(async (data: CctvEditFormData) => {
        try {
            await cctvUpdate({
                name: data.name,
                url: data.url,
            });
        } catch (error) {
            console.error('CCTV 수정 실패', error);
            toast.error('CCTV 수정에 실패했습니다.');
            return;
        }
        
        toast.success('CCTV 수정 완료');
        onSuccess?.();
        resetForm();
    }, [cctvUpdate, resetForm, onSuccess]);

    return (
        <Dialog open={isOpen} onOpenChange={resetForm}>
            <DialogContent title="CCTV 수정" className="max-w-xl" dimmed disableBackground>
                <ModalForm {...modalForm}>
                    <form onSubmit={modalForm.handleSubmit(handleSubmit)}>
                        <ModalFormContainer>
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
                            <Button type="button" variant="outline" onClick={resetForm} disabled={isCctvUpdating}>
                                취소
                            </Button>
                            <Button type="submit" disabled={isCctvUpdating || !modalForm.formState.isValid}>
                                {isCctvUpdating ? '처리 중...' : '수정'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    );
};