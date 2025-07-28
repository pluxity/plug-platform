import type { Meta, StoryObj } from '@storybook/react'
import { LoginForm, type LoginFormData } from './LoginForm'

// 간단한 로그 함수
const logAction = (name: string) => (data: LoginFormData) => {
  console.log(`${name}:`, data)
}

const meta: Meta<typeof LoginForm> = {
  title: 'Organism/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '사용자 로그인을 위한 폼 컴포넌트입니다. 아이디와 비밀번호 입력 필드, 유효성 검사, 로딩 상태 및 에러 메시지 표시 기능을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: {
      description: '폼 제출 시 호출되는 함수',
    },
    isLoading: {
      description: '로딩 상태 여부',
      control: 'boolean',
    },
    error: {
      description: '에러 메시지',
      control: 'text',
    },
    className: {
      description: '추가 CSS 클래스',
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// 기본 스토리
export const Default: Story = {
  args: {
    onSubmit: logAction('onSubmit'),
    isLoading: false,
    error: null,
    className: '',
  },
}

// 로딩 상태
export const Loading: Story = {
  args: {
    onSubmit: logAction('onSubmit'),
    isLoading: true,
    error: null,
    className: '',
  },
}

// 에러 상태
export const WithError: Story = {
  args: {
    onSubmit: logAction('onSubmit'),
    isLoading: false,
    error: '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.',
    className: '',
  },
}

// 커스텀 클래스 적용
export const WithCustomClass: Story = {
  args: {
    onSubmit: logAction('onSubmit'),
    isLoading: false,
    error: null,
    className: 'bg-blue-50 p-8 rounded-lg',
  },
}

// 상호작용 스토리 - 실제 폼 제출 동작 시뮬레이션
export const Interactive: Story = {
  args: {
    onSubmit: async (data: LoginFormData) => {
      console.log('로그인 데이터:', data)
      
      // 실제 API 호출을 시뮬레이션
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          alert(`로그인 시도: ${data.username}`)
          resolve()
        }, 1000)
      })
    },
    isLoading: false,
    error: null,
    className: '',
  },
  parameters: {
    docs: {
      description: {
        story: '실제 폼 제출 동작을 시뮬레이션하는 인터랙티브 스토리입니다. 폼을 제출하면 콘솔에서 데이터를 확인할 수 있습니다.',
      },
    },
  },
}

// 에러 후 복구 시나리오
export const ErrorRecovery: Story = {
  args: {
    onSubmit: logAction('onSubmit'),
    isLoading: false,
    error: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
    className: '',
  },
  parameters: {
    docs: {
      description: {
        story: '에러가 발생한 후의 상태를 보여주는 스토리입니다. 사용자는 에러 메시지를 확인하고 다시 시도할 수 있습니다.',
      },
    },
  },
}

// 유효성 검사 테스트
export const ValidationDemo: Story = {
  args: {
    onSubmit: async (data: LoginFormData) => {
      console.log('유효성 검사 통과된 데이터:', data)
      alert(`로그인 성공!\n아이디: ${data.username}\n비밀번호: ${'*'.repeat(data.password.length)}`)
    },
    isLoading: false,
    error: null,
    className: '',
  },
  parameters: {
    docs: {
      description: {
        story: `
유효성 검사를 테스트해보세요:

**아이디 규칙:**
- 최소 3글자, 최대 20글자
- 영문, 숫자, 언더스코어(_)만 사용 가능

**비밀번호 규칙:**
- 최소 6글자, 최대 50글자

**테스트 방법:**
1. 빈 값으로 제출 (버튼 클릭)
2. 짧은 값 입력 후 제출 (예: "ab", "123")
3. 잘못된 형식 입력 (예: "user@test")
4. 올바른 값 입력 후 제출

※ React Hook Form은 기본적으로 제출(submit) 시에만 유효성 검사를 하고, 그 이후에는 실시간으로 검사합니다.
        `,
      },
    },
  },
}
