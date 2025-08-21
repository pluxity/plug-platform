import React, { useCallback } from 'react';
import { PermissionCreateModalProps } from '@/backoffice/domains/users/types/permisson';
import { Dialog, DialogContent, DialogFooter, Button, ModalForm, ModalFormContainer, ModalFormField, ModalFormItem, Input, Checkbox, Label } from '@plug/ui';
import { useCreatePermission } from '@plug/common-services/services';
import { usePermissionStore } from '@/backoffice/domains/users/stores/permissionStore';
import { usePermissionCheckbox } from '@/backoffice/domains/users/hooks/usePermissionCheckbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { permissionFormSchema, type PermissionFormData } from '@/backoffice/domains/users/schemas/permissionSchemas';  
import { toast } from 'sonner';

export const PermissionCreateModal: React.FC<PermissionCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { execute: createPermission, isLoading: isPermissionCreating } = useCreatePermission();
    const { resourceTypes, resourceData, isLoading: isResourceDataLoading, error: resourceError } = usePermissionStore();
    const { isResourceSelected, handleCheckboxChange } = usePermissionCheckbox();

    const modalForm = useForm<PermissionFormData>({
        resolver: zodResolver(permissionFormSchema),
        defaultValues: {
            name: '',
            description: '',
            permissions: [],
        },
        mode: 'onChange',
    })

    const resetForm = useCallback(() => {
        modalForm.reset({
            name: '',   
            description: '',
            permissions: [],
        });
        onClose();
    }, [modalForm, onClose]);

    
    const handleSubmit = useCallback(async (data: PermissionFormData) => {
        try {
            await createPermission({
                name: data.name,
                description: data.description,
                permissions: data.permissions,
            });
            toast.success('권한 등록 완료');
            onSuccess?.();
            resetForm();
        } catch (error) {
            toast.error((error as Error).message || '권한 등록에 실패했습니다.');
        }
    }, [createPermission, onSuccess, resetForm]);

    return (
        <Dialog open={isOpen} onOpenChange={resetForm}>
            <DialogContent title="권한 등록" className="max-w-5xl" dimmed disableBackground>
                <ModalForm {...modalForm}>
                    <form onSubmit={modalForm.handleSubmit(handleSubmit)}>
                        <ModalFormContainer>
                            <ModalFormField
                                control={modalForm.control}
                                name="name"
                                render={({ field }) => (
                                    <ModalFormItem label="권한 명" message={modalForm.formState.errors.name?.message}>
                                        <Input {...field} placeholder="권한 명을 입력해주세요." required />
                                    </ModalFormItem>
                                )}  
                            />
                            <ModalFormField
                                control={modalForm.control}
                                name="description"
                                render={({ field }) => (
                                    <ModalFormItem label="권한 설명" message={modalForm.formState.errors.description?.message}>
                                        <Input {...field} placeholder="권한 설명을 입력해주세요." required />
                                    </ModalFormItem>
                                )}
                            />
                            <ModalFormField
                                control={modalForm.control}
                                name="permissions"
                                render={({ field }) => (
                                    <ModalFormItem label="권한 목록" message={modalForm.formState.errors.permissions?.message}>
                                        <div className="flex flex-col gap-6 max-h-100 min-h-80 overflow-y-auto">
                                            {isResourceDataLoading ? (
                                                <div className="text-center py-4">데이터를 불러오는 중...</div>
                                            ) : resourceError ? (
                                                <div className="text-center py-4 text-red-500">
                                                    오류: {resourceError}
                                                </div>
                                            ) : (
                                                resourceTypes?.map((resourceType) => {
                                                    const resources = resourceData[resourceType.key] || [];
                                                    return (
                                                        <div key={resourceType.key} className="flex flex-col gap-2">
                                                            <div className="font-semibold">{resourceType.name}</div>
                                                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                                {resources.length > 0 ? (
                                                                    resources.map((resource) => {
                                                                        const checkboxId = `${resourceType.key}-${resource.id}`;
                                                                        return (
                                                                            <div key={resource.id} className="flex items-center gap-2">
                                                                                <Checkbox 
                                                                                    variant="square" 
                                                                                    id={checkboxId}
                                                                                    checked={isResourceSelected(field.value || [], resourceType.key, resource.id)}
                                                                                    onCheckedChange={(checked) => 
                                                                                        handleCheckboxChange(
                                                                                            field.value || [], 
                                                                                            field.onChange, 
                                                                                            resourceType.key, 
                                                                                            resource.id, 
                                                                                            !!checked
                                                                                        )
                                                                                    }
                                                                                />
                                                                                <Label htmlFor={checkboxId}>{resource.name}</Label>
                                                                            </div>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <div className="text-gray-500 text-sm">사용 가능한 리소스가 없습니다.</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </ModalFormItem>
                                )}
                            />
                        </ModalFormContainer>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={resetForm} disabled={isPermissionCreating} >취소</Button>
                            <Button type="submit" disabled={isPermissionCreating || !modalForm.formState.isValid} >
                                {isPermissionCreating ? '처리 중...' : '등록'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    )
};