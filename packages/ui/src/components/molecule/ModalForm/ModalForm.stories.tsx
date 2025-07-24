import type { Meta, StoryObj } from "@storybook/react";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ModalForm, ModalFormItem } from "./ModalForm";
import { Input } from "../../atom/Input/Input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../atom/Select/Select';
import { Button } from '../../atom/Button/Button';
import { Form } from '../Form/Form';

const meta: Meta<typeof ModalForm> = {
  title: "MOLECULE/ModalForm",
  component: ModalForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ModalForm>;

// Zod 스키마 정의
const userFormSchema = z.object({
  username: z.string().min(4, {
    message: '아이디는 최소 4글자 이상이어야 합니다.'
  }),
  name: z.string().min(2, {
    message: '이름은 최소 2글자 이상이어야 합니다.'
  }),
  password: z.string().min(8, {
    message: '비밀번호는 최소 8글자 이상이어야 합니다.'
  }),
  userGroup: z.string().min(1, {
    message: '사용자 그룹을 선택해주세요.'
  }),
  phone: z.string().regex(/^[0-9-]+$/, {
    message: '올바른 전화번호 형식을 입력해주세요.'
  }),
  department: z.string().min(1, {
    message: '부서명을 입력해주세요.'
  })
});

export const Default: Story = {
  render: function Render() {
    const form = useForm<z.infer<typeof userFormSchema>>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
        username: '',
        name: '',
        password: '',
        userGroup: '',
        phone: '',
        department: ''
      },
      mode: 'onChange',
    });

    const onSubmit = (values: z.infer<typeof userFormSchema>) => {
      console.log(values);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl">
          <ModalForm>
            <ModalFormItem 
              label="아이디" 
              name="username"
              message={form.formState.errors.username?.message}
              description="6~12자의 영문 소문자로 시작하는 영문, 숫자 조합으로 입력"
            >
              <Input 
                {...form.register("username")}
                placeholder="아이디를 입력하세요"  
              />
            </ModalFormItem>
            
            <ModalFormItem 
              label="사용자명" 
              name="name"
              message={form.formState.errors.name?.message}
            >
              <Input 
                {...form.register("name")}
                placeholder="사용자명을 입력하세요" 
              />
            </ModalFormItem>
            
            <ModalFormItem 
              label="비밀번호" 
              name="password"
              message={form.formState.errors.password?.message}
              description="8~15자의 영문, 숫자, 특수문자 조합으로 입력"
            >
              <Input 
                {...form.register("password")}
                placeholder="비밀번호를 입력하세요" 
                type="password" 
              />
            </ModalFormItem>
            
            <ModalFormItem 
              label="사용자 그룹" 
              name="userGroup"
              message={form.formState.errors.userGroup?.message}
            >
              <Select onValueChange={(value) => form.setValue('userGroup', value)}>
                <SelectTrigger aria-label="사용자 그룹">
                  <SelectValue placeholder="그룹 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">관리자</SelectItem>
                  <SelectItem value="user">일반</SelectItem>
                </SelectContent>
              </Select>
            </ModalFormItem>
            
            <ModalFormItem 
              label="연락처" 
              name="phone"
              message={form.formState.errors.phone?.message}
              description="010-1234-5678 형식으로 입력"
            >
              <Input 
                {...form.register("phone")}
                placeholder="전화번호를 입력하세요" 
              />
            </ModalFormItem>
            
            <ModalFormItem 
              label="부서명" 
              name="department"
              message={form.formState.errors.department?.message}
            >
              <Input 
                {...form.register("department")}
                placeholder="부서명을 입력하세요"
              />
            </ModalFormItem>
          </ModalForm>
          
          <div className="mt-6 flex justify-center">
            <Button type="submit">
                등록
            </Button>
          </div>
        </form>
      </Form>
    );
  }
};




