import type { Meta, StoryObj } from "@storybook/react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "./Popover"

const meta: Meta<typeof Popover> = {
  title: "ATOM/Popover",
  component: Popover,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Popover>

export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <button className="bg-primary text-white px-4 py-2 rounded-md shadow-sm">
          클릭해서 팝오버 열기
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <h3 className="text-sm font-semibold mb-2">안녕하세요 👋</h3>
        <p className="text-sm text-muted-foreground">
          이 영역은 팝오버 콘텐츠입니다. 버튼을 클릭해서 열고 닫을 수 있어요.
        </p>
      </PopoverContent>
    </Popover>
  ),
}

export const WithAnchor: Story = {
  render: () => (
    <Popover>
      <PopoverAnchor>
        <span className="text-xs text-muted-foreground">📌 앵커 요소입니다</span>
      </PopoverAnchor>
      <PopoverTrigger asChild>
        <button className="bg-blue-500 text-white px-3 py-1.5 rounded shadow-sm">
          팝오버 열기
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-56">
        <p className="text-sm">위쪽에서 나타나는 팝오버입니다.</p>
      </PopoverContent>
    </Popover>
  ),
}
