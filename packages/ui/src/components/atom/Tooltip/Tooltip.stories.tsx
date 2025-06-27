import type { Meta, StoryObj } from "@storybook/react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./Tooltip";

const meta = {
  title: "ATOM/Tooltip",
  component: TooltipContent,
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: {
        type: "select",
        options: ["top", "bottom", "left", "right"],
      },
      description: "툴팁이 표시될 방향",
      defaultValue: "top",
    },
    color: {
      control: {
        type: "select",
        options: ["primary", "destructive", "muted"],
      },
      description: "툴팁의 색상 테마",
      defaultValue: "primary",
    },
    bgColor: {
      control: "color",
      if: { arg: "color", eq: "custom" },
      description: "커스텀 배경색 (color가 'custom'일 때만 사용)",
    },
    textColor: {
      control: "color",
      if: { arg: "color", eq: "custom" },
      description: "커스텀 텍스트 색상 (color가 'custom'일 때만 사용)",
    },
    borderColor: {
      control: "color",
      if: { arg: "color", eq: "custom" },
      description: "커스텀 테두리 색상 (color가 'custom'일 때만 사용)",
    },
    sideOffset: {
      control: {
        type: "number",
        min: 0,
        max: 20,
        step: 1,
      },
      description: "툴팁과 트리거 요소 사이의 간격(px)",
      defaultValue: 4,
    },
    align: {
      control: {
        type: "select",
        options: ["start", "center", "end"],
      },
      description: "툴팁의 수평 정렬 방식",
      defaultValue: "center",
    },
    alignOffset: {
      control: {
        type: "number",
        min: -100,
        max: 100,
        step: 1,
      },
      description: "툴팁의 정렬 오프셋",
      defaultValue: 0,
    },
    avoidCollisions: {
      control: "boolean",
      description: "뷰포트 충돌 방지 기능 활성화 여부",
      defaultValue: true,
    }
  }
} satisfies Meta<typeof TooltipContent>;

export default meta;

type TooltipStory = StoryObj<typeof meta>;

export const Default: TooltipStory = {
  args: {
    side: "top",
    color: "primary",
    sideOffset: 4,
    align: "center",
    alignOffset: 0,
    avoidCollisions: true,
  },
  render: (args) => (
    <div className="flex justify-center items-center h-40">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="px-4 py-2 border rounded cursor-pointer">호버해보세요</div>
        </TooltipTrigger>
        <TooltipContent 
          side={args.side} 
          color={args.color}
          bgColor={args.bgColor}
          textColor={args.textColor}
          borderColor={args.borderColor}
          sideOffset={args.sideOffset}
          align={args.align}
          alignOffset={args.alignOffset}
          avoidCollisions={args.avoidCollisions}
        >
          툴팁 내용입니다
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const ColorVariants: TooltipStory = {
  render: () => (
    <div className="flex flex-col justify-center items-center gap-8 py-8">
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer">Primary</div>
          </TooltipTrigger>
          <TooltipContent color="primary">기본 툴팁</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer">Destructive</div>
          </TooltipTrigger>
          <TooltipContent color="destructive">주의 툴팁</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer">Muted</div>
          </TooltipTrigger>
          <TooltipContent color="muted">흐린 툴팁</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer">Custom Blue</div>
          </TooltipTrigger>
          <TooltipContent color="custom" bgColor="#e0f2fe" textColor="#0369a1" borderColor="#7dd3fc">
            파란색 커스텀 툴팁
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer">Custom Green</div>
          </TooltipTrigger>
          <TooltipContent color="custom" bgColor="#dcfce7" textColor="#166534" borderColor="#86efac">
            초록색 커스텀 툴팁
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer">Custom Purple</div>
          </TooltipTrigger>
          <TooltipContent color="custom" bgColor="#f3e8ff" textColor="#7e22ce" borderColor="#d8b4fe">
            보라색 커스텀 툴팁
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

export const SideVariants: TooltipStory = {
  render: () => (
    <div className="flex flex-col justify-center items-center gap-12 py-12">
      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer">상단 툴팁</div>
          </TooltipTrigger>
          <TooltipContent side="top">상단에 표시되는 툴팁</TooltipContent>
        </Tooltip>
      </div>
      
      <div className="flex justify-between w-80">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer">왼쪽 툴팁</div>
          </TooltipTrigger>
          <TooltipContent side="left">왼쪽에 표시되는 툴팁</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer">오른쪽 툴팁</div>
          </TooltipTrigger>
          <TooltipContent side="right">오른쪽에 표시되는 툴팁</TooltipContent>
        </Tooltip>
      </div>
      
      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer">하단 툴팁</div>
          </TooltipTrigger>
          <TooltipContent side="bottom">하단에 표시되는 툴팁</TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

export const AlignmentVariants: TooltipStory = {
  render: () => (
    <div className="flex flex-col justify-center items-center gap-8 py-8">
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer w-36 text-center">시작 정렬</div>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            시작점 기준으로 정렬된 툴팁
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer w-36 text-center">중앙 정렬</div>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            중앙 정렬된 툴팁
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer w-36 text-center">끝 정렬</div>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end">
            끝점 기준으로 정렬된 툴팁
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

export const OffsetExamples: TooltipStory = {
  render: () => (
    <div className="flex flex-col justify-center items-center gap-8 py-8">
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer">기본 간격</div>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={5}>
            기본 간격 (5px)
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer">큰 간격</div>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={15}>
            큰 간격 (15px)
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer">정렬 오프셋 왼쪽</div>
          </TooltipTrigger>
          <TooltipContent side="bottom" alignOffset={-20}>
            왼쪽으로 20px 이동된 툴팁
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-4 py-2 border rounded cursor-pointer">정렬 오프셋 오른쪽</div>
          </TooltipTrigger>
          <TooltipContent side="bottom" alignOffset={20}>
            오른쪽으로 20px 이동된 툴팁
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

export const CustomStyleExamples: TooltipStory = {
  render: () => (
    <div className="flex justify-center items-center gap-4 py-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="px-4 py-2 border rounded cursor-pointer">빨간색 테마</div>
        </TooltipTrigger>
        <TooltipContent 
          color="custom" 
          bgColor="#fee2e2" 
          textColor="#b91c1c" 
          borderColor="#fca5a5"
          side="top"
        >
          빨간색 커스텀 툴팁
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="px-4 py-2 border rounded cursor-pointer">검은색 테마</div>
        </TooltipTrigger>
        <TooltipContent 
          color="custom" 
          bgColor="#1f2937" 
          textColor="#f9fafb" 
          borderColor="#4b5563"
          side="right"
        >
          검은색 커스텀 툴팁
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="px-4 py-2 border rounded cursor-pointer">그라데이션</div>
        </TooltipTrigger>
        <TooltipContent 
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          side="bottom"
        >
          그라데이션 스타일 툴팁
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const RealWorldExamples: TooltipStory = {
  render: () => (
    <div className="flex flex-col justify-center items-center gap-8 py-8">
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="p-2 border rounded cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            추가 정보를 보려면 클릭하세요
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="p-2 border rounded cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" color="primary">
            파일 다운로드
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="p-2 border rounded cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20v-6m0 0V4m0 10h6m-6 0H6"/>
              </svg>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" color="destructive">
            새 항목 추가
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center p-4 border rounded-md w-96">
        <span className="flex-1">비밀번호 요구사항</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5} color="muted">
            <div className="text-xs">
              <p>비밀번호는 다음 조건을 만족해야 합니다:</p>
              <ul className="list-disc pl-4 mt-1">
                <li>최소 8자 이상</li>
                <li>대문자 1개 이상</li>
                <li>특수문자 1개 이상</li>
                <li>숫자 1개 이상</li>
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};