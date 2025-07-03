import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";
import { useState, useEffect } from "react";
import {
  Flame,
  Cloud,
  Code,
  Settings,
  User,
  Home,
  PanelLeft,
  Album,
  Library,
  Music,
  Video,
  Camera,
  Smartphone,
  Monitor,
  ChevronRight,
  Bell, Lock
} from "lucide-react";

type TabsProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  dir?: "ltr" | "rtl";
  activationMode?: "automatic" | "manual";
  unstyled?: boolean;
  className?: string;
  asChild?: boolean;
  loop?: boolean;
};

const meta = {
  title: "ATOM/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    defaultValue: {
      control: "text",
      description: "초기 선택된 탭의 값",
    },
    value: {
      control: "text",
      description: "현재 선택된 탭의 값 (제어 컴포넌트로 사용 시)",
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "탭의 방향",
      defaultValue: "horizontal",
    },
    dir: {
      control: "radio",
      options: ["ltr", "rtl"],
      description: "텍스트 방향",
      defaultValue: "ltr",
    },
    activationMode: {
      control: "radio",
      options: ["automatic", "manual"],
      description: "탭 활성화 모드",
      defaultValue: "automatic",
    },
    className: {
      control: "text",
      description: "커스텀 CSS 클래스",
    },
  },
} satisfies Meta<TabsProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllOptions: Story = {
  render: function Render(args) {
    const [activeTab, setActiveTab] = useState(args.defaultValue || "tab1");

    useEffect(() => {
      if (args.value) {
        setActiveTab(args.value);
      }
    }, [args.value]);

    const handleTabChange = (value: string) => {
      setActiveTab(value);
      if (args.onValueChange) {
        args.onValueChange(value);
      }
    };

    const tabContents = {
      tab1: {
        title: "홈",
        icon: <Home className="mr-2 h-4 w-4" />,
        content: "홈 탭의 내용입니다. 여기에는 대시보드나 주요 정보가 표시됩니다."
      },
      tab2: {
        title: "프로필",
        icon: <User className="mr-2 h-4 w-4" />,
        content: "프로필 탭의 내용입니다. 사용자 정보와 설정을 관리할 수 있습니다."
      },
      tab3: {
        title: "설정",
        icon: <Settings className="mr-2 h-4 w-4" />,
        content: "설정 탭의 내용입니다. 애플리케이션의 다양한 설정을 변경할 수 있습니다."
      },
      tab4: {
        title: "도움말",
        icon: <Code className="mr-2 h-4 w-4" />,
        content: "도움말 탭의 내용입니다. 사용 방법과 FAQ를 확인할 수 있습니다."
      }
    };
    
    return (
      <div className={args.orientation === "vertical" ? "flex gap-6" : ""}>
        <Tabs
          defaultValue={args.defaultValue}
          value={activeTab}
          onValueChange={handleTabChange}
          orientation={args.orientation}
          dir={args.dir}
          activationMode={args.activationMode}
          className={`${args.className || ""} ${args.orientation === "vertical" ? "w-72" : "w-full max-w-3xl"}`}
        >
          <TabsList 
            className={`${args.orientation === "vertical" ? "flex-col space-x-0 space-y-1" : ""}`}
          >
            {Object.entries(tabContents).map(([key, { title, icon }]) => (
              <TabsTrigger 
                key={key} 
                value={key}
              >
                {icon}
                {title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(tabContents).map(([key, { content }]) => (
            <TabsContent 
              key={key} 
              value={key}
            >
              <div className="p-4 border rounded-md bg-white">
                <p>{content}</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h3 className="text-lg font-medium mb-2">현재 설정</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>활성 탭: <span className="font-mono">{activeTab}</span></div>
            <div>방향: <span className="font-mono">{args.orientation || "horizontal"}</span></div>
            <div>텍스트 방향: <span className="font-mono">{args.dir || "ltr"}</span></div>
            <div>활성화 모드: <span className="font-mono">{args.activationMode || "automatic"}</span></div>
          </div>
        </div>
      </div>
    );
  },
  args: {
    defaultValue: "tab1",
    orientation: "horizontal",
    dir: "ltr",
    activationMode: "automatic",
  },
};

export const DefaultTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">
          <Flame className="mr-1" />
          Tab 1
        </TabsTrigger>
        <TabsTrigger value="tab2">
          <Cloud className="mr-1" />
          Tab 2
        </TabsTrigger>
        <TabsTrigger value="tab3">
          <Code className="mr-1" />
          Tab 3
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="p-4 text-sm border rounded-md mt-2">
          탭 1의 내용입니다. 첫 번째 탭에는 기본 정보가 표시됩니다.
        </div>
      </TabsContent>
      <TabsContent value="tab2">
        <div className="p-4 text-sm border rounded-md mt-2">
          탭 2의 내용입니다. 두 번째 탭에는 추가 정보가 표시됩니다.
        </div>
      </TabsContent>
      <TabsContent value="tab3">
        <div className="p-4 text-sm border rounded-md mt-2">
          탭 3의 내용입니다. 세 번째 탭에는 상세 정보가 표시됩니다.
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const UnderlineTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-full max-w-md">
      <TabsList unstyled className="flex gap-6 bg-transparent border-b">
        <TabsTrigger
          unstyled
          value="tab1"
          className="relative pb-2 text-sm font-medium text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
        >
          대시보드
        </TabsTrigger>
        <TabsTrigger
          unstyled
          value="tab2"
          className="relative pb-2 text-sm font-medium text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
        >
          프로젝트
        </TabsTrigger>
        <TabsTrigger
          unstyled
          value="tab3"
          className="relative pb-2 text-sm font-medium text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
        >
          설정
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tab1" className="pt-4 text-sm">
        <div className="p-4 border rounded-md bg-white">
          <h3 className="font-medium mb-2">대시보드</h3>
          <p>사용자 대시보드 내용입니다. 전체 통계와 주요 지표를 확인할 수 있습니다.</p>
        </div>
      </TabsContent>
      <TabsContent value="tab2" className="pt-4 text-sm">
        <div className="p-4 border rounded-md bg-white">
          <h3 className="font-medium mb-2">프로젝트</h3>
          <p>프로젝트 목록과 진행 상황을 확인할 수 있습니다.</p>
        </div>
      </TabsContent>
      <TabsContent value="tab3" className="pt-4 text-sm">
        <div className="p-4 border rounded-md bg-white">
          <h3 className="font-medium mb-2">설정</h3>
          <p>사용자 설정 및 계정 관리 옵션을 제공합니다.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const CardTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-full max-w-md">
      <TabsList className="grid h-full w-full grid-cols-3 bg-gray-100 rounded-xl p-1">
        <TabsTrigger value="tab1" className="rounded-lg py-2">
          계정
        </TabsTrigger>
        <TabsTrigger value="tab2" className="rounded-lg py-2">
          비밀번호
        </TabsTrigger>
        <TabsTrigger value="tab3" className="rounded-lg py-2">
          알림
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="p-6 border rounded-md mt-4 bg-white">
          <h3 className="text-lg font-medium mb-4">계정 설정</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">이름</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="이름을 입력하세요" />
            </div>
            <div>
              <label className="text-sm font-medium">이메일</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="이메일을 입력하세요" />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="tab2">
        <div className="p-6 border rounded-md mt-4 bg-white">
          <h3 className="text-lg font-medium mb-4">비밀번호 변경</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">현재 비밀번호</label>
              <input type="password" className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="현재 비밀번호" />
            </div>
            <div>
              <label className="text-sm font-medium">새 비밀번호</label>
              <input type="password" className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="새 비밀번호" />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="tab3">
        <div className="p-6 border rounded-md mt-4 bg-white">
          <h3 className="text-lg font-medium mb-4">알림 설정</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">이메일 알림</span>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">푸시 알림</span>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">SMS 알림</span>
              <input type="checkbox" className="h-4 w-4" />
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const VerticalTabs: Story = {
  render: () => (
    <div className="flex">
      <Tabs defaultValue="tab1" orientation="vertical" className="w-full max-w-4xl">
        <TabsList className="w-52 h-auto flex-col space-x-0 space-y-1 mr-6 bg-gray-50 p-2 rounded-md items-start">
          <TabsTrigger value="tab1" className="justify-start">
            <Home className="mr-2 h-4 w-4" />
            홈
          </TabsTrigger>
          <TabsTrigger value="tab2" className="justify-start">
            <User className="mr-2 h-4 w-4" />
            프로필
          </TabsTrigger>
          <TabsTrigger value="tab3" className="justify-start">
            <Settings className="mr-2 h-4 w-4" />
            설정
          </TabsTrigger>
          <TabsTrigger value="tab4" className="justify-start">
            <Code className="mr-2 h-4 w-4" />
            개발자
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="flex-grow p-0 m-0">
          <div className="p-6 border rounded-md bg-white h-64">
            <h3 className="text-lg font-medium mb-3">홈</h3>
            <p className="text-sm text-gray-500">홈 화면입니다. 주요 대시보드와 요약 정보를 확인할 수 있습니다.</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-sm text-blue-700">신규 사용자</h4>
                <p className="text-2xl font-bold text-blue-800 mt-1">1,234</p>
              </div>
              <div className="p-4 bg-green-50 rounded-md">
                <h4 className="font-medium text-sm text-green-700">총 방문</h4>
                <p className="text-2xl font-bold text-green-800 mt-1">5,678</p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tab2" className="flex-grow p-0 m-0">
          <div className="p-6 border rounded-md bg-white h-64">
            <h3 className="text-lg font-medium mb-3">프로필</h3>
            <p className="text-sm text-gray-500">사용자 프로필 정보를 관리합니다.</p>
            <div className="mt-4 flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h4 className="font-medium">사용자 이름</h4>
                <p className="text-sm text-gray-500">user@example.com</p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tab3" className="flex-grow p-0 m-0">
          <div className="p-6 border rounded-md bg-white h-64">
            <h3 className="text-lg font-medium mb-3">설정</h3>
            <p className="text-sm text-gray-500">시스템 설정을 변경할 수 있습니다.</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">다크 모드</span>
                <input type="checkbox" className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">자동 업데이트</span>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">데이터 동기화</span>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tab4" className="flex-grow p-0 m-0">
          <div className="p-6 border rounded-md bg-white h-64">
            <h3 className="text-lg font-medium mb-3">개발자</h3>
            <p className="text-sm text-gray-500">개발자 도구와 API 설정입니다.</p>
            <div className="mt-4 p-3 bg-gray-100 rounded-md font-mono text-xs">
              <code>
                {`// API 예제 코드
const data = await api.fetch('/endpoint');
console.log(data);`}
              </code>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const NestedTabs: Story = {
  render: () => (
    <Tabs defaultValue="music" className="w-full max-w-3xl">
      <TabsList className="mb-4">
        <TabsTrigger value="music">
          <Music className="mr-2 h-4 w-4" />
          음악
        </TabsTrigger>
        <TabsTrigger value="videos">
          <Video className="mr-2 h-4 w-4" />
          비디오
        </TabsTrigger>
        <TabsTrigger value="photos">
          <Camera className="mr-2 h-4 w-4" />
          사진
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="music" className="p-0">
        <Tabs defaultValue="albums" className="w-full">
          <TabsList className="w-full bg-gray-50 p-1 rounded-md">
            <TabsTrigger value="albums">
              <Album className="mr-2 h-4 w-4" />
              앨범
            </TabsTrigger>
            <TabsTrigger value="artists">
              <User className="mr-2 h-4 w-4" />
              아티스트
            </TabsTrigger>
            <TabsTrigger value="playlists">
              <Library className="mr-2 h-4 w-4" />
              재생목록
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="albums" className="mt-4">
            <div className="p-4 border rounded-md bg-white">
              <h3 className="font-medium mb-3">앨범</h3>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-md overflow-hidden">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-2">
                      <h4 className="font-medium text-sm">앨범 제목 {i}</h4>
                      <p className="text-xs text-gray-500">아티스트 {i}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="artists" className="mt-4">
            <div className="p-4 border rounded-md bg-white">
              <h3 className="font-medium mb-3">아티스트</h3>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
                    <h4 className="mt-2 text-sm font-medium">아티스트 {i}</h4>
                    <p className="text-xs text-gray-500">앨범 {i}개</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="playlists" className="mt-4">
            <div className="p-4 border rounded-md bg-white">
              <h3 className="font-medium mb-3">재생목록</h3>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-md flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                    <div>
                      <h4 className="font-medium text-sm">재생목록 {i}</h4>
                      <p className="text-xs text-gray-500">노래 {i * 5}곡</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </TabsContent>
      
      <TabsContent value="videos" className="p-0">
        <div className="p-4 border rounded-md bg-white">
          <h3 className="font-medium mb-3">비디오</h3>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-md overflow-hidden">
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-2">
                  <h4 className="font-medium text-sm">비디오 제목 {i}</h4>
                  <p className="text-xs text-gray-500">3:45 • 조회수 1.2만회</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="photos" className="p-0">
        <div className="p-4 border rounded-md bg-white">
          <h3 className="font-medium mb-3">사진</h3>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const CustomStyledTabs: Story = {
  render: function Render() {
    const [activeTab, setActiveTab] = useState("tab1");
    
    return (
      <div className="w-full max-w-3xl space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-3">그라데이션 스타일</h3>
          <Tabs 
            defaultValue="tab1" 
            className="w-full"
          >
            <TabsList className="flex p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <TabsTrigger 
                value="tab1"
                unstyled
                className="flex-1 py-2 px-4 text-sm font-medium text-white rounded data-[state=active]:bg-white data-[state=active]:text-blue-700"
              >
                첫 번째
              </TabsTrigger>
              <TabsTrigger 
                value="tab2"
                unstyled
                className="flex-1 py-2 px-4 text-sm font-medium text-white rounded data-[state=active]:bg-white data-[state=active]:text-blue-700"
              >
                두 번째
              </TabsTrigger>
              <TabsTrigger 
                value="tab3"
                unstyled
                className="flex-1 py-2 px-4 text-sm font-medium text-white rounded data-[state=active]:bg-white data-[state=active]:text-blue-700"
              >
                세 번째
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-md">
              <p>그라데이션 스타일이 적용된 첫 번째 탭 내용입니다.</p>
            </TabsContent>
            <TabsContent value="tab2" className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-md">
              <p>그라데이션 스타일이 적용된 두 번째 탭 내용입니다.</p>
            </TabsContent>
            <TabsContent value="tab3" className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-md">
              <p>그라데이션 스타일이 적용된 세 번째 탭 내용입니다.</p>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">아이콘 중심 탭</h3>
          <Tabs 
            defaultValue="tab1" 
            className="w-full"
          >
            <TabsList className="flex justify-center gap-6 bg-transparent">
              <TabsTrigger 
                value="tab1"
                unstyled
                className="flex flex-col items-center"
              >
                <div className={`p-3 rounded-full ${activeTab === "tab1" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                  <Smartphone className="h-6 w-6" />
                </div>
                <span className={`mt-2 text-xs font-medium ${activeTab === "tab1" ? "text-blue-600" : "text-gray-500"}`}>
                  모바일
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="tab2"
                unstyled
                className="flex flex-col items-center"
                onSelect={() => setActiveTab("tab2")}
              >
                <div className={`p-3 rounded-full ${activeTab === "tab2" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                  <Monitor className="h-6 w-6" />
                </div>
                <span className={`mt-2 text-xs font-medium ${activeTab === "tab2" ? "text-blue-600" : "text-gray-500"}`}>
                  데스크탑
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="tab3"
                unstyled
                className="flex flex-col items-center"
                onSelect={() => setActiveTab("tab3")}
              >
                <div className={`p-3 rounded-full ${activeTab === "tab3" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                  <PanelLeft className="h-6 w-6" />
                </div>
                <span className={`mt-2 text-xs font-medium ${activeTab === "tab3" ? "text-blue-600" : "text-gray-500"}`}>
                  태블릿
                </span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-6 p-4 border rounded-md">
              <h4 className="font-medium mb-2">모바일 뷰</h4>
              <p className="text-sm text-gray-500">모바일 디바이스에서의 UI 레이아웃 및 기능을 설정합니다.</p>
            </TabsContent>
            <TabsContent value="tab2" className="mt-6 p-4 border rounded-md">
              <h4 className="font-medium mb-2">데스크탑 뷰</h4>
              <p className="text-sm text-gray-500">데스크탑 환경에서의 UI 레이아웃 및 기능을 설정합니다.</p>
            </TabsContent>
            <TabsContent value="tab3" className="mt-6 p-4 border rounded-md">
              <h4 className="font-medium mb-2">태블릿 뷰</h4>
              <p className="text-sm text-gray-500">태블릿 디바이스에서의 UI 레이아웃 및 기능을 설정합니다.</p>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-3">사이드 인디케이터 탭</h3>
          <Tabs 
            defaultValue="tab1" 
            className="w-full"
          >
            <TabsList className="flex flex-col space-y-1 bg-transparent">
              {[
                { id: "tab1", label: "계정 정보", icon: <User className="h-4 w-4" /> },
                { id: "tab2", label: "알림 설정", icon: <Bell className="h-4 w-4" /> },
                { id: "tab3", label: "보안", icon: <Lock className="h-4 w-4" /> },
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id}
                  unstyled
                  className="flex items-center px-4 py-2 text-sm text-gray-700 border-l-2 border-transparent hover:bg-gray-50 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="tab1" className="ml-4 mt-4 p-4 border rounded-md">
              <h4 className="font-medium mb-2">계정 정보</h4>
              <p className="text-sm text-gray-500">계정 정보를 관리합니다.</p>
            </TabsContent>
            <TabsContent value="tab2" className="ml-4 mt-4 p-4 border rounded-md">
              <h4 className="font-medium mb-2">알림 설정</h4>
              <p className="text-sm text-gray-500">알림 및 메시지 설정을 관리합니다.</p>
            </TabsContent>
            <TabsContent value="tab3" className="ml-4 mt-4 p-4 border rounded-md">
              <h4 className="font-medium mb-2">보안</h4>
              <p className="text-sm text-gray-500">보안 및 개인정보 설정을 관리합니다.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  },
};

export const ControlledTabs: Story = {
  render: function Render() {
    const [activeTab, setActiveTab] = useState("tab1");
    const handleTabChange = (value: string) => {
      console.log(`탭 변경: ${value}`);
      setActiveTab(value);
    };

    return (
      <div className="space-y-4 w-full max-w-md">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">제어 컴포넌트 방식 탭</h3>
          <div className="flex gap-2">
            {["tab1", "tab2", "tab3"].map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1 text-sm rounded ${
                  activeTab === tab
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handleTabChange(tab)}
              >
                외부 버튼 {tab.slice(-1)}
              </button>
            ))}
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="tab1">
              탭 1
            </TabsTrigger>
            <TabsTrigger value="tab2">
              탭 2
            </TabsTrigger>
            <TabsTrigger value="tab3">
              탭 3
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="p-4 border rounded-md mt-2">
            <p>제어 컴포넌트로 구현된 탭 1의 내용입니다.</p>
            <p className="text-sm text-gray-500 mt-2">외부 버튼이나 탭을 클릭하여 탭을 변경할 수 있습니다.</p>
          </TabsContent>
          <TabsContent value="tab2" className="p-4 border rounded-md mt-2">
            <p>제어 컴포넌트로 구현된 탭 2의 내용입니다.</p>
            <p className="text-sm text-gray-500 mt-2">상태가 외부에서 관리되므로 더 복잡한 상호작용이 가능합니다.</p>
          </TabsContent>
          <TabsContent value="tab3" className="p-4 border rounded-md mt-2">
            <p>제어 컴포넌트로 구현된 탭 3의 내용입니다.</p>
            <p className="text-sm text-gray-500 mt-2">탭 변경 시 특별한 로직을 추가할 수 있습니다.</p>
          </TabsContent>
        </Tabs>

        <div className="p-3 bg-gray-100 rounded-md text-sm">
          <p>현재 활성 탭: <span className="font-mono">{activeTab}</span></p>
          <p className="text-xs text-gray-500 mt-1">탭이 변경되면 콘솔에 로그가 기록됩니다.</p>
        </div>
      </div>
    );
  },
};