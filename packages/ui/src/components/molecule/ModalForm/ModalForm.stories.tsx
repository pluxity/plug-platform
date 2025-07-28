import type { Meta, StoryObj } from "@storybook/react";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ModalForm, ModalFormItem, ModalFormField, ModalFormContainer } from "./ModalForm";
import { Input } from "../../atom/Input/Input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../atom/Select/Select';
import { MultiSelect } from "../../atom/Select/MultiSelect";
import { Button } from '../../atom/Button/Button';

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
  skills: z.array(z.string()).min(1, {
    message: '최소 1개 이상의 기술을 선택해주세요.'
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
        skills: [],
        phone: '',
        department: ''
      },
      mode: 'onChange',
    });

    const onSubmit = (values: z.infer<typeof userFormSchema>) => {
      console.log(values);
    };

    return (
      <ModalForm {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl">
          <ModalFormContainer>
            <ModalFormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <ModalFormItem label="아이디" description="아이디 상세 설명이 들어갑니다." message={form.formState.errors.username?.message}>
                    <Input 
                      {...field}
                      placeholder="아이디를 입력하세요"  
                    />

                </ModalFormItem>
              )}
            />
            
            <ModalFormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <ModalFormItem label="사용자명" message={form.formState.errors.name?.message}>
                  <Input 
                    {...field}
                    placeholder="사용자명을 입력하세요" 
                  />
                </ModalFormItem>
              )}
            />
            
            <ModalFormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <ModalFormItem label="비밀번호" message={form.formState.errors.password?.message}>
                  <Input 
                    {...field}
                    placeholder="비밀번호를 입력하세요" 
                    type="password" 
                  />
                </ModalFormItem>
              )}
            />
            
            <ModalFormField
              control={form.control}
              name="userGroup"
              render={({ field }) => (
                <ModalFormItem label="사용자 그룹" message={form.formState.errors.userGroup?.message}>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger aria-label="사용자 그룹">
                      <SelectValue placeholder="그룹 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">관리자</SelectItem>
                      <SelectItem value="user">일반</SelectItem>
                    </SelectContent>
                  </Select>
                </ModalFormItem>
              )}
            />
            
            <ModalFormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <ModalFormItem 
                  label="보유 기술" 
                  description="보유하고 있는 기술을 여러 개 선택하세요"
                  message={form.formState.errors.skills?.message}
                >
                  <MultiSelect
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="기술을 선택하세요"
                    options={[
                      { value: "react", label: "React" },
                      { value: "vue", label: "Vue.js" },
                      { value: "angular", label: "Angular" },
                      { value: "typescript", label: "TypeScript" },
                      { value: "javascript", label: "JavaScript" },
                      { value: "nodejs", label: "Node.js" },
                      { value: "python", label: "Python" },
                      { value: "java", label: "Java" },
                      { value: "csharp", label: "C#" },
                      { value: "docker", label: "Docker" },
                    ]}
                  />
                </ModalFormItem>
              )}
            />
            
            <ModalFormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <ModalFormItem label="연락처" message={form.formState.errors.phone?.message}>
                  <Input 
                    {...field}
                    placeholder="전화번호를 입력하세요" 
                  />
                </ModalFormItem>
              )}
            />
            
            <ModalFormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <ModalFormItem label="부서명" message={form.formState.errors.department?.message}>
                  <Input 
                    {...field}
                    placeholder="부서명을 입력하세요"
                  />
                </ModalFormItem>
              )}
            />
          </ModalFormContainer>
            
          <div className="mt-6 flex justify-center">
            <Button type="submit">
                등록
            </Button>
          </div>
        </form>
      </ModalForm>
    );
  }
};