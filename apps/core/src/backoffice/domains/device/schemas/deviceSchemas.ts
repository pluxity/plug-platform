import { z } from 'zod';

const baseDeviceSchema = z.object({
    categoryId: z.string().min(1, {
        message: '디바이스 카테고리를 선택해주세요.'
    }),
    name: z.string().min(1, {
        message: '디바이스 이름을 입력해주세요.'
    }),
    companyType: z.string().min(1, {
        message: '디바이스 회사 타입을 입력해주세요.'
    }),
    deviceType: z.string().min(1, {
        message: '디바이스 타입을 입력해주세요.'
    }),
});

export const deviceCreateFormSchema = baseDeviceSchema.extend({
    id: z.string().min(1, {
        message: '디바이스 아이디를 입력해주세요.'
    }),
});

export const deviceEditFormSchema = baseDeviceSchema;

export type DeviceCreateFormData = z.infer<typeof deviceCreateFormSchema>;
export type DeviceEditFormData = z.infer<typeof deviceEditFormSchema>;