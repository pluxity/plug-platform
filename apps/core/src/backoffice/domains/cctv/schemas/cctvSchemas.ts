import { z } from 'zod';

export const baseCctvFormSchema = z.object({
    name: z.string().min(1, {
        message: 'CCTV 이름을 입력해주세요.'
    }),
    url: z.string().min(1, {
        message: 'CCTV URL을 입력해주세요.'
    }),
});

export const cctvCreateFormSchema = baseCctvFormSchema.extend({
    id: z.string().min(1, {
        message: 'CCTV ID를 입력해주세요.'
    }),
});

export type CctvCreateFormData = z.infer<typeof cctvCreateFormSchema>;
export type CctvEditFormData = z.infer<typeof baseCctvFormSchema>;