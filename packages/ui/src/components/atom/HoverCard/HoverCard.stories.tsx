import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './HoverCard';

const meta: Meta<typeof HoverCard> = {
  title: 'ATOM/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer underline text-blue-500">호버하세요</span>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">제목</h4>
          <p className="text-sm">호버 카드에 표시될 내용입니다. 다양한 정보를 담을 수 있습니다.</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const WithCustomContent: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md">프로필 카드</button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">홍길동</h4>
            <p className="text-xs text-gray-500">개발자</p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-gray-500">
                다양한 프로젝트에 참여한 경험이 있는 프론트엔드 개발자입니다.
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const WithDelay: Story = {
  args: {
    openDelay: 300,
    closeDelay: 200,
  },
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer underline text-blue-500">지연 효과 적용</span>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">지연 효과가 적용된 호버 카드</h4>
          <p className="text-sm">열리고 닫힐 때 지연 시간이 적용된 호버 카드입니다.</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const CustomPosition: Story = {
  render: () => (
    <div className="h-40 flex items-center justify-center">
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className="cursor-pointer underline text-blue-500">위치 조정</span>
        </HoverCardTrigger>
        <HoverCardContent align="start" sideOffset={10}>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">위치가 조정된 호버 카드</h4>
            <p className="text-sm">align과 sideOffset 속성을 사용하여 위치를 조정할 수 있습니다.</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};