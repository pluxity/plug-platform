import type { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './Form';
import { Input } from '../../atom/Input/Input';
import { Button } from '../../atom/Button/Button';

const meta: Meta<typeof Form> = {
  title: 'MOLECULE/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

const formSchema = z.object({
  username: z.string().min(2, {
    message: '사용자 이름은 최소 2글자 이상이어야 합니다.',
  }),
  email: z.string().email({
    message: '유효한 이메일 주소를 입력해주세요.',
  }),
});

export const BasicForm: Story = {
  render: function Render() {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: '',
        email: '',
      },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
      console.log(values);
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사용자 이름</FormLabel>
                <FormControl>
                  <Input placeholder="사용자 이름을 입력하세요" {...field} />
                </FormControl>
                <FormDescription>
                  이 정보는 프로필에 표시됩니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input placeholder="이메일을 입력하세요" {...field} />
                </FormControl>
                <FormDescription>
                  연락을 위한 이메일 주소입니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">제출</Button>
        </form>
      </Form>
    );
  }
};

export const WithErrors: Story = {
  render: function Render() {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: '',
        email: 'invalid-email',
      },
    });

    form.setError('username', {
      type: 'manual',
      message: '사용자 이름은 최소 2글자 이상이어야 합니다.'
    });
    
    form.setError('email', {
      type: 'manual',
      message: '유효한 이메일 주소를 입력해주세요.'
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
      console.log(values);
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사용자 이름</FormLabel>
                <FormControl>
                  <Input placeholder="사용자 이름을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input placeholder="이메일을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">제출</Button>
        </form>
      </Form>
    );
  }
};