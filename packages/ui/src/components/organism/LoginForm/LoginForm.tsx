import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../../atom/Button/Button'
import { Input } from '../../atom/Input/Input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../molecule/Form/Form'

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
    mode: 'onSubmit',
    defaultValues: {
      username: '',
      password: '',
    },
  })

  return (
    <div className={`max-w-md w-full space-y-8 ${className} bg-white px-11 py-6 rounded-lg`}>
      <div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          로그인
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block font-medium text-gray-700 mb-2">
                    아이디
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="username"
                      placeholder="아이디를 입력해주세요"
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block font-medium text-gray-600 mb-2">
                    비밀번호
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder="비밀번호를 입력해주세요"
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  로그인 중...
                </>
              ) : (
                '로그인 하기'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
