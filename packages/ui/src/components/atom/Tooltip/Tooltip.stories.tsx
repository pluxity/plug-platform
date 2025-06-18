import type { Meta, StoryObj } from "@storybook/react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./Tooltip";

const meta: Meta = {
  title: "ATOM/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="flex justify-center items-center h-40">
      <Tooltip>
        <TooltipTrigger asChild>
          <div>호버해보세요</div>
        </TooltipTrigger>
        <TooltipContent side="top">툴팁 내용입니다</TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const Side: StoryObj = {
  render: () => (
    <div className="flex justify-center items-center h-40">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='text-title'>호버해보세요</div>
        </TooltipTrigger>
        <TooltipContent side="left" color='destructive'>왼쪽에 뜨는 툴팁</TooltipContent>
        <TooltipContent side="right" color="custom" bgColor="#c5dfff" textColor="#000" borderColor="#5d8ec9">오른쪽에 뜨는 툴팁</TooltipContent>
        <TooltipContent side="bottom" color="custom" bgColor="#c5dfff" textColor="#333">아래쪽에 뜨는 툴팁</TooltipContent>
      </Tooltip>
    </div>
  )
}