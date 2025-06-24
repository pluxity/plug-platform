import type { Meta, StoryObj } from "@storybook/react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./Resizable";
import { useState, useEffect } from "react";
import {
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
  Maximize2,
  Minimize2,
  MoveHorizontal,
  MoveVertical,
  SplitSquareVertical,
} from "lucide-react";
import React from "react";

const meta: Meta = {
  title: "ATOM/Resizable",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "패널 그룹의 방향",
      defaultValue: "horizontal",
    },
    autoSaveId: {
      control: "text",
      description: "패널 크기를 자동 저장하기 위한 고유 ID",
    },
    unstyled: {
      control: "boolean",
      description: "기본 스타일 적용 여부 (false일 경우 기본 스타일 적용)",
      defaultValue: false,
    },
    defaultSizes: {
      control: "object",
      description: "패널들의 기본 크기 비율 (배열)",
      defaultValue: [25, 50, 25],
    },
    withHandle: {
      control: "boolean",
      description: "시각적 핸들 표시 여부",
      defaultValue: true,
    },
    collapsible: {
      control: "boolean",
      description: "패널 접기 가능 여부",
      defaultValue: false,
    },
    panelColors: {
      control: "object",
      description: "각 패널별 배경색",
      defaultValue: ["bg-blue-100", "bg-green-100", "bg-purple-100"],
    },
    handleColors: {
      control: "object",
      description: "각 핸들별 배경색",
      defaultValue: ["bg-gray-200", "bg-gray-200"],
    },
    containerHeight: {
      control: { type: "number", min: 100, max: 800, step: 50 },
      description: "컨테이너 높이 (px)",
      defaultValue: 400,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
export const AllOptions: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [sizes, setSizes] = useState(args.defaultSizes);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [collapsed, setCollapsed] = useState<{[key: number]: boolean}>({});

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setSizes(args.defaultSizes);
    }, [args.defaultSizes]);

    const handleLayout = (newSizes: number[]) => {
      setSizes(newSizes);
      if (args.onLayout) {
        args.onLayout(newSizes);
      }
    };

    const handleCollapse = (index: number, isCollapsed: boolean) => {
      setCollapsed(prev => ({...prev, [index]: isCollapsed}));
    };

    const effectiveSizes = sizes.map((size, index) => 
      collapsed[index] ? (args.collapsible ? args.collapsedSize || 0 : size) : size
    );

    return (
      <div className="space-y-8">
        <div className={`border rounded-md overflow-hidden`} style={{ height: `${args.containerHeight}px` }}>
          <ResizablePanelGroup
            direction={args.direction}
            onLayout={handleLayout}
            className={args.unstyled ? undefined : ""}
            autoSaveId={args.autoSaveId}
            id={args.id}
            style={args.style}
          >
            {sizes.map((size, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ResizableHandle
                    withHandle={args.withHandle}
                    className={args.handleColors[index - 1]}
                    id={`handle-${index}`}
                    disabled={false}
                  />
                )}
                <ResizablePanel
                  defaultSize={size}
                  minSize={5}
                  maxSize={90}
                  id={`panel-${index}`}
                  collapsible={args.collapsible}
                  collapsedSize={args.collapsedSize || 0}
                  className={`${args.panelColors[index]} p-4 flex flex-col`}
                  style={args.style}
                  order={index}
                  onCollapse={(isCollapsed) => handleCollapse(index, isCollapsed)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">패널 {index + 1}</h3>
                    {args.collapsible && (
                      <button 
                        onClick={() => handleCollapse(index, !collapsed[index])}
                        className="p-1 rounded hover:bg-gray-200"
                      >
                        {collapsed[index] ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="text-sm mb-4">크기: {Math.round(effectiveSizes[index])}%</div>
                  <div className="flex-grow flex items-center justify-center">
                    {args.direction === "horizontal" ? <MoveHorizontal size={24} /> : <MoveVertical size={24} />}
                  </div>
                </ResizablePanel>
              </React.Fragment>
            ))}
          </ResizablePanelGroup>
        </div>

        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium mb-2">현재 설정</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">방향:</span> {args.direction}
            </div>
            <div>
              <span className="font-medium">핸들 표시:</span> {args.withHandle ? "예" : "아니오"}
            </div>
            <div>
              <span className="font-medium">접기 가능:</span> {args.collapsible ? "예" : "아니오"}
            </div>
            <div>
              <span className="font-medium">기본 스타일:</span> {args.unstyled ? "사용 안 함" : "사용"}
            </div>
            <div className="col-span-2">
              <span className="font-medium">패널 크기:</span>{" "}
              {effectiveSizes.map((size, i) => `패널${i+1}(${Math.round(size)}%)`).join(" / ")}
            </div>
            <div className="col-span-2">
              <span className="font-medium">접힌 패널:</span>{" "}
              {Object.entries(collapsed).filter(([, v]) => v).length > 0 
                ? Object.entries(collapsed)
                    .filter(([, v]) => v)
                    .map(([k]) => `패널${parseInt(k)+1}`)
                    .join(", ")
                : "없음"}
            </div>
          </div>
        </div>
      </div>
    );
  },
  args: {
    direction: "horizontal",
    defaultSizes: [25, 50, 25],
    withHandle: true,
    collapsible: false,
    collapsedSize: 0,
    panelColors: ["bg-blue-100", "bg-green-100", "bg-purple-100"],
    handleColors: ["bg-gray-200", "bg-gray-200"],
    containerHeight: 400,
    unstyled: false,
  },
};

export const LayoutExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="border rounded-md overflow-hidden" style={{ height: "300px" }}>
        <h3 className="p-2 bg-gray-100 text-sm font-medium">3단 수직 레이아웃</h3>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={30} className="bg-blue-100 p-4">
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2">
                <PanelTop className="size-5" />
                <span>상단 패널 (30%)</span>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} className="bg-green-100 p-4">
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2">
                <SplitSquareVertical className="size-5" />
                <span>중앙 패널 (40%)</span>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30} className="bg-purple-100 p-4">
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2">
                <PanelBottom className="size-5" />
                <span>하단 패널 (30%)</span>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* 2단 가로 레이아웃 */}
      <div className="border rounded-md overflow-hidden" style={{ height: "300px" }}>
        <h3 className="p-2 bg-gray-100 text-sm font-medium">2단 수평 레이아웃</h3>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={30} minSize={20} className="bg-amber-100 p-4">
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2">
                <PanelLeft className="size-5" />
                <span>왼쪽 패널 (30%)</span>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70} className="bg-teal-100 p-4">
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2">
                <PanelRight className="size-5" />
                <span>오른쪽 패널 (70%)</span>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* 복합 레이아웃 */}
      <div className="border rounded-md overflow-hidden" style={{ height: "400px" }}>
        <h3 className="p-2 bg-gray-100 text-sm font-medium">복합 레이아웃 (수평 + 수직)</h3>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={30} className="bg-blue-100 p-4">
            <div className="flex flex-col h-full">
              <h4 className="font-medium mb-2">사이드바</h4>
              <div className="flex-grow flex items-center justify-center">
                <PanelLeft className="size-6" />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={60} className="bg-green-100 p-4">
                <div className="flex flex-col h-full">
                  <h4 className="font-medium mb-2">메인 콘텐츠</h4>
                  <div className="flex-grow flex items-center justify-center">
                    <SplitSquareVertical className="size-6" />
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={40} className="bg-purple-100 p-4">
                <div className="flex flex-col h-full">
                  <h4 className="font-medium mb-2">상세 정보</h4>
                  <div className="flex-grow flex items-center justify-center">
                    <PanelBottom className="size-6" />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  ),
};

// 접기 가능한 패널 예제
export const CollapsiblePanels: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [leftCollapsed, setLeftCollapsed] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [rightCollapsed, setRightCollapsed] = useState(false);
    
    return (
      <div className="space-y-6">
        <div className="border rounded-md overflow-hidden" style={{ height: "300px" }}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel 
              defaultSize={25} 
              collapsible={true}
              collapsedSize={0}
              onCollapse={setLeftCollapsed}
              className={`bg-blue-100 p-4 transition-all duration-300 ${leftCollapsed ? 'p-0' : ''}`}
            >
              {!leftCollapsed ? (
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">좌측 패널</h3>
                    <button 
                      onClick={() => setLeftCollapsed(true)}
                      className="p-1 rounded hover:bg-blue-200"
                    >
                      <PanelLeft size={16} />
                    </button>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm">이 패널은 접을 수 있습니다.</p>
                    <p className="text-sm mt-2">좌측 버튼을 클릭하여 패널을 접어보세요.</p>
                  </div>
                </div>
              ) : null}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel 
              defaultSize={50} 
              className="bg-green-100 p-4"
            >
              <div className="flex flex-col h-full">
                <h3 className="font-medium mb-4">중앙 패널</h3>
                <div className="flex-grow flex flex-col justify-center">
                  <div className="flex space-x-2 justify-center mb-4">
                    {leftCollapsed && (
                      <button 
                        onClick={() => setLeftCollapsed(false)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm flex items-center gap-1"
                      >
                        <PanelRight size={14} />
                        <span>좌측 패널 열기</span>
                      </button>
                    )}
                    {rightCollapsed && (
                      <button 
                        onClick={() => setRightCollapsed(false)}
                        className="px-3 py-1 bg-purple-500 text-white rounded text-sm flex items-center gap-1"
                      >
                        <PanelLeft size={14} />
                        <span>우측 패널 열기</span>
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-center">
                    {leftCollapsed && rightCollapsed
                      ? "양쪽 패널이 모두 접혀 있습니다."
                      : leftCollapsed
                      ? "좌측 패널이 접혀 있습니다."
                      : rightCollapsed
                      ? "우측 패널이 접혀 있습니다."
                      : "양쪽 패널을 모두 펼쳐서 볼 수 있습니다."
                    }
                  </p>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel 
              defaultSize={25} 
              collapsible={true}
              collapsedSize={0}
              onCollapse={setRightCollapsed}
              className={`bg-purple-100 p-4 transition-all duration-300 ${rightCollapsed ? 'p-0' : ''}`}
            >
              {!rightCollapsed ? (
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">우측 패널</h3>
                    <button 
                      onClick={() => setRightCollapsed(true)}
                      className="p-1 rounded hover:bg-purple-200"
                    >
                      <PanelRight size={16} />
                    </button>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm">이 패널도 접을 수 있습니다.</p>
                    <p className="text-sm mt-2">우측 버튼을 클릭하여 패널을 접어보세요.</p>
                  </div>
                </div>
              ) : null}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">패널 상태</h3>
          <div className="space-y-2 text-sm">
            <div>좌측 패널: {leftCollapsed ? "접힘" : "펼침"}</div>
            <div>우측 패널: {rightCollapsed ? "접힘" : "펼침"}</div>
          </div>
        </div>
      </div>
    );
  },
};

// 크기 제한이 있는 패널
export const SizeConstraints: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="border rounded-md overflow-hidden" style={{ height: "300px" }}>
        <h3 className="p-2 bg-gray-100 text-sm font-medium">크기 제한이 있는 패널 (minSize, maxSize)</h3>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel 
            defaultSize={30} 
            minSize={20} 
            maxSize={40}
            className="bg-blue-100 p-4"
          >
            <div className="flex flex-col h-full">
              <h3 className="font-medium mb-2">좌측 패널</h3>
              <p className="text-xs text-gray-600 mb-4">minSize: 20%, maxSize: 40%</p>
              <div className="flex-grow flex items-center justify-center">
                <MoveHorizontal className="size-5" />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel 
            defaultSize={40} 
            minSize={30} 
            className="bg-green-100 p-4"
          >
            <div className="flex flex-col h-full">
              <h3 className="font-medium mb-2">중앙 패널</h3>
              <p className="text-xs text-gray-600 mb-4">minSize: 30%, maxSize: 제한 없음</p>
              <div className="flex-grow flex items-center justify-center">
                <MoveHorizontal className="size-5" />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel 
            defaultSize={30} 
            maxSize={35}
            className="bg-purple-100 p-4"
          >
            <div className="flex flex-col h-full">
              <h3 className="font-medium mb-2">우측 패널</h3>
              <p className="text-xs text-gray-600 mb-4">minSize: 제한 없음, maxSize: 35%</p>
              <div className="flex-grow flex items-center justify-center">
                <MoveHorizontal className="size-5" />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <p className="text-sm text-gray-600">
        각 패널에 minSize와 maxSize 제약이 설정되어 있어 패널의 크기를 조절할 때 특정 범위 내에서만 조절이 가능합니다.
      </p>
    </div>
  ),
};

// 실제 응용 예제 - 코드 에디터 레이아웃
export const CodeEditorLayout: Story = {
  render: () => (
    <div className="border rounded-md overflow-hidden" style={{ height: "500px" }}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-gray-100 p-0">
          <div className="flex flex-col h-full border-r">
            <div className="p-2 border-b bg-gray-200">
              <h3 className="text-sm font-medium">탐색기</h3>
            </div>
            <div className="p-2 overflow-auto flex-grow">
              <ul className="text-xs space-y-1">
                {["src", "components", "hooks", "utils", "pages", "assets"].map((folder) => (
                  <li key={folder} className="flex items-center gap-1 p-1 hover:bg-gray-200 rounded cursor-pointer">
                    <span>📁</span> {folder}
                  </li>
                ))}
                {["package.json", "tsconfig.json", "README.md"].map((file) => (
                  <li key={file} className="flex items-center gap-1 p-1 hover:bg-gray-200 rounded cursor-pointer ml-2">
                    <span>📄</span> {file}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={55} className="bg-white">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70} className="bg-white">
              <div className="flex flex-col h-full">
                <div className="p-2 border-b bg-gray-100 flex">
                  <div className="text-xs px-3 py-1 bg-white rounded-t border-t border-l border-r">index.tsx</div>
                  <div className="text-xs px-3 py-1 text-gray-500 hover:bg-gray-200 cursor-pointer">App.tsx</div>
                </div>
                <div className="p-4 font-mono text-xs flex-grow overflow-auto">
                  <pre className="text-gray-800">
{`import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);`}
                  </pre>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} className="bg-gray-900 text-gray-300">
              <div className="flex flex-col h-full">
                <div className="p-2 border-b border-gray-700 bg-gray-800">
                  <h3 className="text-xs font-medium">터미널</h3>
                </div>
                <div className="p-2 font-mono text-xs overflow-auto flex-grow">
                  <p className="mb-1">$ npm start</p>
                  <p className="mb-1">project@0.1.0 start</p>
                  <p className="mb-1">react-scripts start</p>
                  <p className="mb-1">Starting development server...</p>
                  <p className="mb-1">Compiled successfully!</p>
                  <p>Local: http://localhost:3000</p>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel 
          defaultSize={25} 
          collapsible={true} 
          collapsedSize={4}
          className="bg-gray-50"
        >
          <div className="flex flex-col h-full border-l">
            <div className="p-2 border-b bg-gray-200">
              <h3 className="text-sm font-medium">미리보기</h3>
            </div>
            <div className="flex-grow flex items-center justify-center p-4 overflow-auto">
              <div className="border rounded shadow-sm p-4 bg-white w-full max-w-xs mx-auto">
                <h1 className="text-lg font-bold mb-2">Hello, World!</h1>
                <p className="text-sm text-gray-600">This is a preview of your application.</p>
                <button className="mt-3 px-3 py-1 bg-blue-500 text-white text-sm rounded">클릭</button>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

// 여러 개의 중첩된 패널
export const NestedPanels: Story = {
  render: () => (
    <div className="border rounded-md overflow-hidden" style={{ height: "400px" }}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={33} className="bg-blue-50">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50} className="bg-blue-100 p-4">
              <div className="h-full flex items-center justify-center">
                <span className="font-medium">패널 1-1</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50} className="bg-blue-200 p-4">
                  <div className="h-full flex items-center justify-center">
                    <span className="font-medium">패널 1-2-1</span>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} className="bg-blue-300 p-4">
                  <div className="h-full flex items-center justify-center">
                    <span className="font-medium">패널 1-2-2</span>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={33} className="bg-green-100 p-4">
          <div className="h-full flex items-center justify-center">
            <span className="font-medium">패널 2</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={34} className="bg-purple-50">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60} className="bg-purple-100 p-4">
              <div className="h-full flex items-center justify-center">
                <span className="font-medium">패널 3-1</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} className="bg-purple-200 p-4">
              <div className="h-full flex items-center justify-center">
                <span className="font-medium">패널 3-2</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

// 이벤트 로깅 예제
export const EventLogging: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [logs, setLogs] = useState<string[]>([]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [sizes, setSizes] = useState<number[]>([33, 33, 34]);
    
    const addLog = (message: string) => {
      setLogs(prev => [message, ...prev].slice(0, 10));
    };
    
    const handleLayout = (newSizes: number[]) => {
      setSizes(newSizes);
      addLog(`Layout changed: [${newSizes.map(s => Math.round(s)).join(', ')}]`);
    };
    
    const handlePanelResize = (index: number, newSize: number) => {
      addLog(`Panel ${index + 1} resized to ${Math.round(newSize)}%`);
    };
    
    return (
      <div className="space-y-4">
        <div className="border rounded-md overflow-hidden" style={{ height: "300px" }}>
          <ResizablePanelGroup 
            direction="horizontal"
            onLayout={handleLayout}
          >
            <ResizablePanel 
              defaultSize={33} 
              className="bg-blue-100 p-4"
              onResize={(size) => handlePanelResize(0, size)}
            >
              <div className="h-full flex items-center justify-center">
                <span className="font-medium">패널 1</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel 
              defaultSize={33} 
              className="bg-green-100 p-4"
              onResize={(size) => handlePanelResize(1, size)}
            >
              <div className="h-full flex items-center justify-center">
                <span className="font-medium">패널 2</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel 
              defaultSize={34} 
              className="bg-purple-100 p-4"
              onResize={(size) => handlePanelResize(2, size)}
            >
              <div className="h-full flex items-center justify-center">
                <span className="font-medium">패널 3</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">현재 크기</h3>
          <div className="flex gap-2 mb-4">
            {sizes.map((size, index) => (
              <div key={index} className="bg-gray-200 p-2 rounded text-xs">
                패널 {index + 1}: {Math.round(size)}%
              </div>
            ))}
          </div>
          
          <h3 className="font-medium mb-2">이벤트 로그</h3>
          <div className="border rounded bg-white p-2 max-h-32 overflow-y-auto">
            {logs.length > 0 ? (
              <ul className="text-xs space-y-1">
                {logs.map((log, index) => (
                  <li key={index} className="text-gray-600">{log}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-500">패널을 조절하여 이벤트를 확인하세요.</p>
            )}
          </div>
        </div>
      </div>
    );
  },
};