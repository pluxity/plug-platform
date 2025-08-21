import { z } from 'zod';

export const deviceFormSchema = z.object({
    categoryId: z.string().min(1, {
        message: '디바이스 카테고리를 선택해주세요.'
    }),
    id: z.string().min(1, {
        message: '디바이스 아이디를 입력해주세요.'
    }),
    name: z.string().min(1, {
        message: '디바이스 이름을 입력해주세요.'
    }),
});

export type DeviceFormData = z.infer<typeof deviceFormSchema>;