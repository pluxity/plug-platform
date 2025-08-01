import { z } from 'zod';

export const permissionFormSchema = z.object({
    name: z.string().min(1, {
        message: '권한 명을 입력해주세요.'
    }),
    description: z.string().min(1, {
        message: '권한 설명을 입력해주세요.'
    }),
    permissions: z.array(z.object({
        resourceType: z.string().min(1, {
            message: '리소스 타입을 선택해주세요.'
        }),
        resourceIds: z.array(z.string()).min(1, {
            message: '리소스 ID를 선택해주세요.'
        })
    })).min(1, {
        message: '최소 하나의 권한을 선택해주세요.'
    })
});

export type PermissionFormData = z.infer<typeof permissionFormSchema>; 