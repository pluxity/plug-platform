import type { Meta, StoryObj } from "@storybook/react"
import {
  DialogStylePopover,
  DialogStylePopoverTrigger,
  DialogStylePopoverContent,
  DialogStylePopoverAnchor,
} from "./DialogPopover"

const meta: Meta<typeof DialogStylePopover> = {
  title: "ATOM/DialogStylePopover",
  component: DialogStylePopover,
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: 'boolean',
      description: '팝오버의 열림/닫힘 상태를 제어합니다',
    },
    defaultOpen: {
      control: 'boolean',
      description: '팝오버의 초기 열림 상태를 설정합니다',
    },
    onOpenChange: {
      description: '팝오버 상태가 변경될 때 호출되는 콜백 함수',
    },
  },
}

export default meta
type Story = StoryObj<typeof DialogStylePopover>

export const Basic: Story = {
  render: (args) => (
    <DialogStylePopover {...args}>
      <DialogStylePopoverTrigger asChild>
        <button className="bg-primary text-white px-4 py-2 rounded-md shadow-sm">
          클릭해서 다이얼로그 스타일 팝오버 열기
        </button>
      </DialogStylePopoverTrigger>
      <DialogStylePopoverContent
        title="알림"
        className="w-96"
      >
        <p className="text-sm text-muted-foreground mb-4">
          다이얼로그와 같은 스타일의 팝오버입니다. 버튼을 클릭해서 열고 닫을 수 있습니다.
        </p>
      </DialogStylePopoverContent>
    </DialogStylePopover>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <DialogStylePopover>
      <DialogStylePopoverTrigger asChild>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm">
          푸터가 있는 팝오버 열기
        </button>
      </DialogStylePopoverTrigger>
      <DialogStylePopoverContent
        title="비밀번호 변경"
        footer={
          <>
            <button 
              className="w-24 h-9 min-w-12 px-2.5 bg-blue-50 rounded-sm outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-center items-center"
            >
              <div className="justify-start text-blue-600 text-sm font-normal ">취소</div>
            </button>
            <button 
              className="w-24 h-9 min-w-12 px-2.5 bg-blue-600 rounded-sm inline-flex justify-center items-center"
            >
              <div className="justify-start text-white text-sm font-normal ">저장</div>
            </button>
          </>
        }
      >
        <div className="w-80 inline-flex flex-col justify-start items-start">
          <div className="self-stretch h-14 border-t border-b border-neutral-300 inline-flex justify-start items-center">
            <div className="w-36 self-stretch p-2.5 border-r border-neutral-300 flex justify-start items-center gap-2.5">
              <div className="justify-start text-zinc-700 text-sm font-medium ">현재 비밀번호</div>
            </div>
            <div className="flex-1 self-stretch p-2.5 flex justify-start items-center gap-2.5">
              <div className="w-48 h-9 min-w-12 px-2.5 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-400 flex justify-start items-center">
                <input 
                  type="password" 
                  placeholder="현재 비밀번호 입력" 
                  className="w-full outline-none text-sm font-medium " 
                />
              </div>
            </div>
          </div>
          <div className="self-stretch h-14 border-t border-b border-neutral-300 inline-flex justify-start items-center">
            <div className="w-36 self-stretch p-2.5 border-r border-neutral-300 flex justify-start items-center gap-2.5">
              <div className="justify-start text-zinc-700 text-sm font-medium ">변경 비밀번호</div>
            </div>
            <div className="flex-1 self-stretch p-2.5 flex justify-start items-center gap-2.5">
              <div className="w-48 h-9 min-w-12 px-2.5 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-400 flex justify-start items-center">
                <input 
                  type="password" 
                  placeholder="새 비밀번호 입력" 
                  className="w-full outline-none text-sm font-medium " 
                />
              </div>
            </div>
          </div>
          <div className="self-stretch h-14 border-t border-b border-neutral-300 inline-flex justify-start items-center">
            <div className="w-36 self-stretch p-2.5 border-r border-neutral-300 flex justify-start items-center gap-2.5">
              <div className="justify-start text-zinc-700 text-sm font-medium ">변경 비밀번호 재입력</div>
            </div>
            <div className="flex-1 self-stretch p-2.5 flex justify-start items-center gap-2.5">
              <div className="w-48 h-9 min-w-12 px-2.5 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-400 flex justify-start items-center">
                <input 
                  type="password" 
                  placeholder="새 비밀번호 재입력" 
                  className="w-full outline-none text-sm font-medium " 
                />
              </div>
            </div>
          </div>
        </div>
      </DialogStylePopoverContent>
    </DialogStylePopover>
  ),
}

export const WithAnchor: Story = {
  render: () => (
    <DialogStylePopover>
      <DialogStylePopoverAnchor>
        <span className="text-xs text-muted-foreground">📌 앵커 요소입니다</span>
      </DialogStylePopoverAnchor>
      <DialogStylePopoverTrigger asChild>
        <button className="bg-blue-500 text-white px-3 py-1.5 rounded shadow-sm">
          앵커와 함께 사용하기
        </button>
      </DialogStylePopoverTrigger>
      <DialogStylePopoverContent 
        side="top" 
        title="앵커로 위치 지정"
        className="w-80"
      >
        <p className="text-sm">앵커를 기준으로 위쪽에 나타나는 다이얼로그 스타일 팝오버입니다.</p>
      </DialogStylePopoverContent>
    </DialogStylePopover>
  ),
}

export const CustomTitle: Story = {
  render: () => (
    <DialogStylePopover>
      <DialogStylePopoverTrigger asChild>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-md shadow-sm">
          커스텀 제목 팝오버
        </button>
      </DialogStylePopoverTrigger>
      <DialogStylePopoverContent
        title={
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFC107" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-zinc-700 text-lg font-bold">중요 알림</span>
          </div>
        }
      >
        <p className="text-sm">
          이 팝오버는 커스텀 제목을 사용하는 예시입니다. 
          제목 부분에 아이콘이나 다른 컴포넌트를 추가할 수 있습니다.
        </p>
      </DialogStylePopoverContent>
    </DialogStylePopover>
  ),
}