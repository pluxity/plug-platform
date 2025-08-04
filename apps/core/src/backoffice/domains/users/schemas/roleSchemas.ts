import { z } from 'zod';

export const roleFormSchema = z.object({
    permissionGroupIds: z.array(z.number()).min(1, {
        message: '최소 1개 이상의 권한 그룹을 선택해주세요.'
    }),
    name: z.string().min(1, {
        message: '역할 이름을 입력해주세요.'
    }),
    description: z.string().min(1, {
        message: '역할 설명을 입력해주세요.'
    }),
});

export type RoleFormData = z.infer<typeof roleFormSchema>;