import { z } from 'zod';

export const assetFormSchema = z.object({
    categoryId: z.string().min(1, {
        message: '에셋 카테고리를 선택해주세요.'
    }),
    name: z.string().min(1, {
        message: '에셋 이름을 입력해주세요.'
    }),
    code: z.string().min(1, {
        message: '에셋 코드를 입력해주세요.'
    }),
});

export type AssetFormData = z.infer<typeof assetFormSchema>;