import React from 'react'
import { useForm, type ControllerRenderProps } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../../atom/Button/Button'
import { Input } from '../../atom/Input/Input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../molecule/Form/Form'

// Form schema 정의
const loginFormSchema = z.object({
  username: z.string()
    .min(1, '아이디를 입력해주세요.')
    .min(3, '아이디는 최소 3글자 이상이어야 합니다.')
    .max(20, '아이디는 20글자를 초과할 수 없습니다.')
    .regex(/^[a-zA-Z0-9_]+$/, '아이디는 영문, 숫자, 언더스코어만 사용할 수 있습니다.'),
  password: z.string()
    .min(1, '비밀번호를 입력해주세요.')
    .min(6, '비밀번호는 최소 6글자 이상이어야 합니다.')
    .max(50, '비밀번호는 50글자를 초과할 수 없습니다.'),
})

export type LoginFormData = z.infer<typeof loginFormSchema>

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void | Promise<void>
  isLoading?: boolean
  error?: string | null
  className?: string
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  className = '',
}) => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange', // 입력할 때마다 실시간 검사
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const handleSubmit = async (data: LoginFormData) => {
    await onSubmit(data)
  }

  return (
    <div className={`max-w-md w-full space-y-8 ${className}`}>
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          로그인
        </h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }: { field: ControllerRenderProps<LoginFormData, 'username'> }) => (
                <FormItem>
                  <FormLabel>아이디</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="username"
                      placeholder="아이디를 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }: { field: ControllerRenderProps<LoginFormData, 'password'> }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder="비밀번호를 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
