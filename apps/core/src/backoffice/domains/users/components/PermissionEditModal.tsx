import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { usePermissionDetail, useUpdatePermission } from '@plug/common-services';
import { Dialog, DialogContent, DialogFooter, ModalForm, ModalFormContainer, ModalFormField, ModalFormItem, Input, Button, Checkbox, Label } from '@plug/ui';

import { usePermissionCheckbox } from '@/backoffice/domains/users/hooks/usePermissionCheckbox';
import { usePermissionStore } from '@/backoffice/domains/users/stores/permissionStore';
import { PermissionEditModalProps } from '@/backoffice/domains/users/types/permisson';
import { permissionFormSchema, type PermissionFormData } from '@/backoffice/domains/users/schemas/permissionSchemas';
export const PermissionEditModal = ({ isOpen, onClose, onSuccess, permissionId }: PermissionEditModalProps) => {
    const { data: detailData, execute: detailPermission } = usePermissionDetail(permissionId);
    const { execute: updatePermission, isLoading: isPermissionUpdating } = useUpdatePermission(permissionId);
    const { resourceTypes, resourceData, isLoading: isResourceDataLoading, error: resourceError } = usePermissionStore();
    const { isResourceSelected, handleCheckboxChange, isCCTVAllSelected, handleCCTVAllToggle } = usePermissionCheckbox();

    const modalForm = useForm<PermissionFormData>({
        resolver: zodResolver(permissionFormSchema),
        defaultValues: {
            name: '',
            description: '',
            permissions: []
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (isOpen && permissionId) {
            detailPermission();
        }
    }, [isOpen, permissionId]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (detailData) {  
            modalForm.reset({
                name: detailData.name,
                description: detailData.description,
                permissions: detailData.permissions.map(permission => ({
                    resourceType: permission.resourceType,
                    resourceIds: permission.resourceIds
                }))
            });
        }
    }, [detailData, modalForm]);

    const resetForm = useCallback(() => {
        modalForm.reset({
            name: '',
            description: '',
            permissions: []
        });
        onClose();
    }, [modalForm, onClose]);

    const handleSubmit = useCallback(async (data: PermissionFormData) => {
        try {
            await updatePermission({
                name: data.name,
                description: data.description,
                permissions: data.permissions,
            });
            toast.success('권한 수정 완료');
            onSuccess?.();
            resetForm();
        } catch (error) {
            toast.error((error as Error).message || '권한 수정에 실패했습니다.');
        }
    }, [updatePermission, onSuccess, resetForm]);

    return (
        <Dialog open={isOpen} onOpenChange={resetForm} >
            <DialogContent title="권한 수정" className="max-w-5xl" dimmed disableBackground>
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
                                                                {resourceType.key === 'CCTV' ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <Checkbox 
                                                                            variant="square" 
                                                                            id="cctv-all"
                                                                            checked={isCCTVAllSelected(field.value || [])}
                                                                            onCheckedChange={(checked) => 
                                                                                handleCCTVAllToggle(
                                                                                    field.value || [], 
                                                                                    field.onChange, 
                                                                                    !!checked
                                                                                )
                                                                            }
                                                                        />
                                                                        <Label htmlFor="cctv-all">CCTV</Label>
                                                                    </div>
                                                                ) : (
                                                                    resources.length > 0 ? (
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
                                                                    )
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
                            <Button type="button" variant="outline" onClick={resetForm} disabled={isPermissionUpdating} >취소</Button>
                            <Button type="submit" disabled={isPermissionUpdating || !modalForm.formState.isValid} >
                                {isPermissionUpdating ? '처리 중...' : '수정'}
                            </Button>
                        </DialogFooter>
                    </form>
                </ModalForm>
            </DialogContent>
        </Dialog>
    )
}