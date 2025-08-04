import { z } from 'zod';

// 공통 필드들을 포함한 기본 스키마
const baseUserSchema = z.object({
    roleIds: z.array(z.number()).min(1, {
        message: '최소 1개 이상의 역할을 선택해주세요.'
    }),
    name: z.string().min(1, {
        message: '이름을 입력해주세요.'
    }).max(10, {
        message: '이름은 10글자 이하이어야 합니다.'
    }),
    phoneNumber: z.string().regex(/^01[016789]-?\d{3,4}-?\d{4}$/, {
        message: '올바른 휴대폰 번호 형식을 입력해주세요.'
    }),
    department: z.string().min(1, {
        message: '부서명을 입력해주세요.'
    })
});

export const userCreateFormSchema = baseUserSchema.extend({
    username: z.string().min(1, {
        message: '아이디를 입력해주세요.'
    }).max(20, {
        message: '아이디는 20글자 이하이어야 합니다.'
    }),
    password: z.string().min(6, {
        message: '비밀번호는 최소 6글자 이상이어야 합니다.'
    }).max(20, {
        message: '비밀번호는 20글자 이하이어야 합니다.'
    })
});

export const userEditFormSchema = baseUserSchema;

export type UserCreateFormData = z.infer<typeof userCreateFormSchema>;
export type UserEditFormData = z.infer<typeof userEditFormSchema>;