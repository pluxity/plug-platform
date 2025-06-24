import type { Meta, StoryObj } from "@storybook/react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
} from "./Menubar";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  Copy,
  Download,
  Edit,
  FileText,
  Folder,
  LayoutGrid,
  List,
  LogOut,
  PanelLeft,
  Plus,
  Save,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  HelpCircle,
  Moon,
  Key, Image, User, Maximize2, Sun, Settings, Lock,Trash, X
} from "lucide-react";

type MenubarProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  dir?: "ltr" | "rtl";
  loop?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  position?: "default" | "sticky";
  disabled?: boolean;
  autoFocus?: boolean;
  autoSelect?: boolean;
  keyboardHandlers?: boolean;
  rootClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  showIcons?: boolean;
  showShortcuts?: boolean;
  theme?: "light" | "dark" | "system";
  customMenus?: Array<{
    label: string;
    items: Array<any>;
  }>;
};

const meta: Meta<MenubarProps> = {
  title: "ATOM/Menubar",
  component: Menubar,
  tags: ["autodocs"],
  argTypes: {
    // 기본 제어 옵션
    defaultValue: {
      control: "text",
      description: "초기 선택된 메뉴의 값",
    },
    value: {
      control: "text",
      description: "현재 선택된 메뉴의 값 (제어 컴포넌트로 사용 시)",
    },
    dir: {
      control: "radio",
      options: ["ltr", "rtl"],
      description: "텍스트 방향",
      defaultValue: "ltr",
    },
    loop: {
      control: "boolean",
      description: "메뉴 항목 간 순환 이동 활성화 여부",
      defaultValue: true,
    },

    // 스타일 옵션
    variant: {
      control: "select",
      options: ["default", "outline", "ghost"],
      description: "메뉴바 스타일 변형",
      defaultValue: "default",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "메뉴바 크기",
      defaultValue: "default",
    },
    position: {
      control: "select",
      options: ["default", "sticky"],
      description: "메뉴바 위치 스타일",
      defaultValue: "default",
    },

    // 상호작용 옵션
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
      defaultValue: false,
    },
    autoFocus: {
      control: "boolean",
      description: "메뉴 열릴 때 자동 포커스 여부",
      defaultValue: true,
    },
    autoSelect: {
      control: "boolean",
      description: "포커스 시 자동 선택 여부",
      defaultValue: true,
    },
    keyboardHandlers: {
      control: "boolean",
      description: "키보드 조작 활성화 여부",
      defaultValue: true,
    },

    // 커스텀 스타일 옵션
    rootClassName: {
      control: "text",
      description: "루트 요소에 적용할 커스텀 CSS 클래스",
    },
    contentClassName: {
      control: "text",
      description: "콘텐츠 요소에 적용할 커스텀 CSS 클래스",
    },
    itemClassName: {
      control: "text",
      description: "메뉴 항목에 적용할 커스텀 CSS 클래스",
    },
    
    // 표시 옵션
    showIcons: {
      control: "boolean",
      description: "아이콘 표시 여부",
      defaultValue: true,
    },
    showShortcuts: {
      control: "boolean",
      description: "단축키 표시 여부",
      defaultValue: true,
    },
    theme: {
      control: "select",
      options: ["light", "dark", "system"],
      description: "메뉴바 테마",
      defaultValue: "light",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 모든 옵션을 제어할 수 있는 기본 예제
export const AllOptions: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeMenu, setActiveMenu] = useState(args.defaultValue || "");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [viewMode, setViewMode] = useState("grid");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [theme, setTheme] = useState(args.theme || "light");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [fontSize, setFontSize] = useState("medium");

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (args.value) {
        setActiveMenu(args.value);
      }
    }, [args.value]);

    const handleValueChange = (value: string) => {
      setActiveMenu(value);
      if (args.onValueChange) {
        args.onValueChange(value);
      }
    };

    // 메뉴바 스타일 클래스 계산
    const getMenubarClass = () => {
      let classes = "border rounded-md";
      
      switch (args.variant) {
        case "outline":
          classes += " bg-transparent border-gray-200";
          break;
        case "ghost":
          classes += " bg-transparent border-transparent";
          break;
        default:
          classes += " bg-white border-gray-200";
          break;
      }
      
      switch (args.size) {
        case "sm":
          classes += " p-0.5";
          break;
        case "lg":
          classes += " p-1.5";
          break;
        default:
          classes += " p-1";
          break;
      }
      
      if (args.position === "sticky") {
        classes += " sticky top-0";
      }
      
      if (args.disabled) {
        classes += " opacity-50 pointer-events-none";
      }
      
      if (theme === "dark") {
        classes += " bg-gray-800 border-gray-700 text-white";
      }
      
      return classes;
    };

    // 메뉴 항목 스타일 클래스 계산
    const getMenuItemClass = () => {
      let classes = "flex items-center";
      
      switch (args.size) {
        case "sm":
          classes += " text-xs";
          break;
        case "lg":
          classes += " text-base";
          break;
        default:
          classes += " text-sm";
          break;
      }
      
      if (theme === "dark") {
        classes += " text-gray-200 hover:bg-gray-700";
      }
      
      return classes;
    };

    // 아이콘 크기 계산
    const getIconSize = () => {
      switch (args.size) {
        case "sm":
          return 14;
        case "lg":
          return 18;
        default:
          return 16;
      }
    };

    return (
      <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"} p-4 rounded-lg`}>
        <div className="mb-4">
          <h3 className="font-medium mb-2">현재 설정</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div>
              <span className="font-medium">테마:</span> {theme}
            </div>
            <div>
              <span className="font-medium">보기 모드:</span> {viewMode}
            </div>
            <div>
              <span className="font-medium">글꼴 크기:</span> {fontSize}
            </div>
            <div>
              <span className="font-medium">변형:</span> {args.variant}
            </div>
            <div>
              <span className="font-medium">크기:</span> {args.size}
            </div>
            <div>
              <span className="font-medium">아이콘 표시:</span> {args.showIcons ? "예" : "아니오"}
            </div>
            <div>
              <span className="font-medium">단축키 표시:</span> {args.showShortcuts ? "예" : "아니오"}
            </div>
          </div>
        </div>
        
        <Menubar
          value={activeMenu}
          onValueChange={handleValueChange}
          dir={args.dir}
          loop={args.loop}
          className={`${getMenubarClass()} ${args.rootClassName || ""}`}
        >
          {/* 파일 메뉴 */}
          <MenubarMenu value="file">
            <MenubarTrigger
              className={`${args.size === "sm" ? "px-2 py-1" : args.size === "lg" ? "px-4 py-2" : "px-3 py-1.5"}`}
            >
              파일
            </MenubarTrigger>
            <MenubarContent className={args.contentClassName}>
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("새로 만들기")}>
                {args.showIcons && <Plus className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                새로 만들기
                {args.showShortcuts && <MenubarShortcut>⌘N</MenubarShortcut>}
              </MenubarItem>
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("열기")}>
                {args.showIcons && <Folder className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                열기
                {args.showShortcuts && <MenubarShortcut>⌘O</MenubarShortcut>}
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("저장")}>
                {args.showIcons && <Save className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                저장
                {args.showShortcuts && <MenubarShortcut>⌘S</MenubarShortcut>}
              </MenubarItem>
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("다른 이름으로 저장")}>
                {args.showIcons && <FileText className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                다른 이름으로 저장
                {args.showShortcuts && <MenubarShortcut>⇧⌘S</MenubarShortcut>}
              </MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger className={getMenuItemClass()}>
                  {args.showIcons && <Download className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                  내보내기
                  <ChevronRight className="ml-auto h-4 w-4" />
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem className={getMenuItemClass()}>PDF로 내보내기</MenubarItem>
                  <MenubarItem className={getMenuItemClass()}>DOCX로 내보내기</MenubarItem>
                  <MenubarItem className={getMenuItemClass()}>HTML로 내보내기</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("종료")}>
                {args.showIcons && <LogOut className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                종료
                {args.showShortcuts && <MenubarShortcut>⌘Q</MenubarShortcut>}
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          {/* 편집 메뉴 */}
          <MenubarMenu value="edit">
            <MenubarTrigger
              className={`${args.size === "sm" ? "px-2 py-1" : args.size === "lg" ? "px-4 py-2" : "px-3 py-1.5"}`}
            >
              편집
            </MenubarTrigger>
            <MenubarContent className={args.contentClassName}>
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("실행 취소")}>
                {args.showIcons && <Undo className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                실행 취소
                {args.showShortcuts && <MenubarShortcut>⌘Z</MenubarShortcut>}
              </MenubarItem>
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("다시 실행")}>
                {args.showIcons && <Redo className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                다시 실행
                {args.showShortcuts && <MenubarShortcut>⇧⌘Z</MenubarShortcut>}
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("잘라내기")}>
                {args.showIcons && <Copy className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                잘라내기
                {args.showShortcuts && <MenubarShortcut>⌘X</MenubarShortcut>}
              </MenubarItem>
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("복사")}>
                {args.showIcons && <Copy className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                복사
                {args.showShortcuts && <MenubarShortcut>⌘C</MenubarShortcut>}
              </MenubarItem>
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("붙여넣기")}>
                {args.showIcons && <Copy className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                붙여넣기
                {args.showShortcuts && <MenubarShortcut>⌘V</MenubarShortcut>}
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("모두 선택")}>
                {args.showIcons && <Edit className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                모두 선택
                {args.showShortcuts && <MenubarShortcut>⌘A</MenubarShortcut>}
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu value="view">
            <MenubarTrigger
              className={`${args.size === "sm" ? "px-2 py-1" : args.size === "lg" ? "px-4 py-2" : "px-3 py-1.5"}`}
            >
              보기
            </MenubarTrigger>
            <MenubarContent className={args.contentClassName}>
              <MenubarCheckboxItem
                className={getMenuItemClass()}
                checked={theme === "dark"}
                onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {args.showIcons && <Moon className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                다크 모드
              </MenubarCheckboxItem>
              
              <MenubarSeparator />
              
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("확대")}>
                {args.showIcons && <Plus className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                확대
                {args.showShortcuts && <MenubarShortcut>⌘+</MenubarShortcut>}
              </MenubarItem>
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("축소")}>
                {args.showIcons && <Minus className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                축소
                {args.showShortcuts && <MenubarShortcut>⌘-</MenubarShortcut>}
              </MenubarItem>
              
              <MenubarSeparator />
              
              <MenubarRadioGroup value={viewMode} onValueChange={setViewMode}>
                <MenubarLabel className="px-2 text-xs text-gray-500">보기 모드</MenubarLabel>
                <MenubarRadioItem className={getMenuItemClass()} value="grid">
                  {args.showIcons && <LayoutGrid className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                  그리드
                </MenubarRadioItem>
                <MenubarRadioItem className={getMenuItemClass()} value="list">
                  {args.showIcons && <List className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                  목록
                </MenubarRadioItem>
              </MenubarRadioGroup>
              
              <MenubarSeparator />
              
              <MenubarSub>
                <MenubarSubTrigger className={getMenuItemClass()}>
                  {args.showIcons && <PanelLeft className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                  패널
                  <ChevronRight className="ml-auto h-4 w-4" />
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarCheckboxItem className={getMenuItemClass()}>
                    왼쪽 패널
                  </MenubarCheckboxItem>
                  <MenubarCheckboxItem className={getMenuItemClass()}>
                    오른쪽 패널
                  </MenubarCheckboxItem>
                  <MenubarCheckboxItem className={getMenuItemClass()}>
                    하단 패널
                  </MenubarCheckboxItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>

          {/* 형식 메뉴 */}
          <MenubarMenu value="format">
            <MenubarTrigger
              className={`${args.size === "sm" ? "px-2 py-1" : args.size === "lg" ? "px-4 py-2" : "px-3 py-1.5"}`}
            >
              형식
            </MenubarTrigger>
            <MenubarContent className={args.contentClassName}>
              <MenubarSub>
                <MenubarSubTrigger className={getMenuItemClass()}>
                  {args.showIcons && <Palette className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                  서식
                  <ChevronRight className="ml-auto h-4 w-4" />
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarCheckboxItem className={getMenuItemClass()}>
                    {args.showIcons && <Bold className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                    굵게
                    {args.showShortcuts && <MenubarShortcut>⌘B</MenubarShortcut>}
                  </MenubarCheckboxItem>
                  <MenubarCheckboxItem className={getMenuItemClass()}>
                    {args.showIcons && <Italic className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                    기울임꼴
                    {args.showShortcuts && <MenubarShortcut>⌘I</MenubarShortcut>}
                  </MenubarCheckboxItem>
                  <MenubarCheckboxItem className={getMenuItemClass()}>
                    {args.showIcons && <Underline className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                    밑줄
                    {args.showShortcuts && <MenubarShortcut>⌘U</MenubarShortcut>}
                  </MenubarCheckboxItem>
                </MenubarSubContent>
              </MenubarSub>
              
              <MenubarSeparator />
              
              <MenubarRadioGroup value={fontSize} onValueChange={setFontSize}>
                <MenubarLabel className="px-2 text-xs text-gray-500">글꼴 크기</MenubarLabel>
                <MenubarRadioItem className={getMenuItemClass()} value="small">
                  작게
                </MenubarRadioItem>
                <MenubarRadioItem className={getMenuItemClass()} value="medium">
                  중간
                </MenubarRadioItem>
                <MenubarRadioItem className={getMenuItemClass()} value="large">
                  크게
                </MenubarRadioItem>
              </MenubarRadioGroup>
              
              <MenubarSeparator />
              
              <MenubarSub>
                <MenubarSubTrigger className={getMenuItemClass()}>
                  정렬
                  <ChevronRight className="ml-auto h-4 w-4" />
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem className={getMenuItemClass()}>
                    {args.showIcons && <AlignLeft className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                    왼쪽 정렬
                  </MenubarItem>
                  <MenubarItem className={getMenuItemClass()}>
                    {args.showIcons && <AlignCenter className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                    가운데 정렬
                  </MenubarItem>
                  <MenubarItem className={getMenuItemClass()}>
                    {args.showIcons && <AlignRight className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                    오른쪽 정렬
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>

          {/* 도움말 메뉴 */}
          <MenubarMenu value="help">
            <MenubarTrigger
              className={`${args.size === "sm" ? "px-2 py-1" : args.size === "lg" ? "px-4 py-2" : "px-3 py-1.5"}`}
            >
              도움말
            </MenubarTrigger>
            <MenubarContent className={args.contentClassName}>
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("문서")}>
                {args.showIcons && <FileText className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                문서
              </MenubarItem>
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("키보드 단축키")}>
                {args.showIcons && <Key className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                키보드 단축키
                {args.showShortcuts && <MenubarShortcut>⌘K</MenubarShortcut>}
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem className={getMenuItemClass()} onSelect={() => console.log("정보")}>
                {args.showIcons && <HelpCircle className={`mr-2 h-${getIconSize()} w-${getIconSize()}`} />}
                정보
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    );
  },
  args: {
    variant: "default",
    size: "default",
    position: "default",
    disabled: false,
    dir: "ltr",
    loop: true,
    autoFocus: true,
    autoSelect: true,
    keyboardHandlers: true,
    showIcons: true,
    showShortcuts: true,
    theme: "light",
  },
};

// 다양한 변형 예제
export const StyleVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">기본 (Default)</h3>
        <Menubar className="border border-gray-200 bg-white rounded-md">
          <MenubarMenu value="file">
            <MenubarTrigger className="px-3 py-1.5">파일</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>새로 만들기</MenubarItem>
              <MenubarItem>열기</MenubarItem>
              <MenubarItem>저장</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="edit">
            <MenubarTrigger className="px-3 py-1.5">편집</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>실행 취소</MenubarItem>
              <MenubarItem>다시 실행</MenubarItem>
              <MenubarItem>복사</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="view">
            <MenubarTrigger className="px-3 py-1.5">보기</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>확대</MenubarItem>
              <MenubarItem>축소</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">아웃라인 (Outline)</h3>
        <Menubar className="border border-gray-200 bg-transparent rounded-md">
          <MenubarMenu value="file">
            <MenubarTrigger className="px-3 py-1.5">파일</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>새로 만들기</MenubarItem>
              <MenubarItem>열기</MenubarItem>
              <MenubarItem>저장</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="edit">
            <MenubarTrigger className="px-3 py-1.5">편집</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>실행 취소</MenubarItem>
              <MenubarItem>다시 실행</MenubarItem>
              <MenubarItem>복사</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="view">
            <MenubarTrigger className="px-3 py-1.5">보기</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>확대</MenubarItem>
              <MenubarItem>축소</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">고스트 (Ghost)</h3>
        <Menubar className="border-transparent bg-transparent rounded-md">
          <MenubarMenu value="file">
            <MenubarTrigger className="px-3 py-1.5 hover:bg-gray-100 rounded-md">파일</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>새로 만들기</MenubarItem>
              <MenubarItem>열기</MenubarItem>
              <MenubarItem>저장</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="edit">
            <MenubarTrigger className="px-3 py-1.5 hover:bg-gray-100 rounded-md">편집</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>실행 취소</MenubarItem>
              <MenubarItem>다시 실행</MenubarItem>
              <MenubarItem>복사</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="view">
            <MenubarTrigger className="px-3 py-1.5 hover:bg-gray-100 rounded-md">보기</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>확대</MenubarItem>
              <MenubarItem>축소</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">다크 테마</h3>
        <Menubar className="border border-gray-700 bg-gray-800 rounded-md text-white">
          <MenubarMenu value="file">
            <MenubarTrigger className="px-3 py-1.5 hover:bg-gray-700">파일</MenubarTrigger>
            <MenubarContent className="bg-gray-800 border-gray-700 text-white">
              <MenubarItem className="hover:bg-gray-700 focus:bg-gray-700">새로 만들기</MenubarItem>
              <MenubarItem className="hover:bg-gray-700 focus:bg-gray-700">열기</MenubarItem>
              <MenubarItem className="hover:bg-gray-700 focus:bg-gray-700">저장</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="edit">
            <MenubarTrigger className="px-3 py-1.5 hover:bg-gray-700">편집</MenubarTrigger>
            <MenubarContent className="bg-gray-800 border-gray-700 text-white">
              <MenubarItem className="hover:bg-gray-700 focus:bg-gray-700">실행 취소</MenubarItem>
              <MenubarItem className="hover:bg-gray-700 focus:bg-gray-700">다시 실행</MenubarItem>
              <MenubarItem className="hover:bg-gray-700 focus:bg-gray-700">복사</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="view">
            <MenubarTrigger className="px-3 py-1.5 hover:bg-gray-700">보기</MenubarTrigger>
            <MenubarContent className="bg-gray-800 border-gray-700 text-white">
              <MenubarItem className="hover:bg-gray-700 focus:bg-gray-700">확대</MenubarItem>
              <MenubarItem className="hover:bg-gray-700 focus:bg-gray-700">축소</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  ),
};

// 크기 변형 예제
export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">작은 크기 (Small)</h3>
        <Menubar className="border border-gray-200 bg-white rounded-md p-0.5">
          <MenubarMenu value="file">
            <MenubarTrigger className="px-2 py-1 text-xs">파일</MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="text-xs">새로 만들기</MenubarItem>
              <MenubarItem className="text-xs">열기</MenubarItem>
              <MenubarItem className="text-xs">저장</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="edit">
            <MenubarTrigger className="px-2 py-1 text-xs">편집</MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="text-xs">실행 취소</MenubarItem>
              <MenubarItem className="text-xs">다시 실행</MenubarItem>
              <MenubarItem className="text-xs">복사</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="view">
            <MenubarTrigger className="px-2 py-1 text-xs">보기</MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="text-xs">확대</MenubarItem>
              <MenubarItem className="text-xs">축소</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">기본 크기 (Default)</h3>
        <Menubar className="border border-gray-200 bg-white rounded-md p-1">
          <MenubarMenu value="file">
            <MenubarTrigger className="px-3 py-1.5 text-sm">파일</MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="text-sm">새로 만들기</MenubarItem>
              <MenubarItem className="text-sm">열기</MenubarItem>
              <MenubarItem className="text-sm">저장</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="edit">
            <MenubarTrigger className="px-3 py-1.5 text-sm">편집</MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="text-sm">실행 취소</MenubarItem>
              <MenubarItem className="text-sm">다시 실행</MenubarItem>
              <MenubarItem className="text-sm">복사</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="view">
            <MenubarTrigger className="px-3 py-1.5 text-sm">보기</MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="text-sm">확대</MenubarItem>
              <MenubarItem className="text-sm">축소</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">큰 크기 (Large)</h3>
        <Menubar className="border border-gray-200 bg-white rounded-md p-1.5">
          <MenubarMenu value="file">
            <MenubarTrigger className="px-4 py-2 text-base">파일</MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="text-base">새로 만들기</MenubarItem>
              <MenubarItem className="text-base">열기</MenubarItem>
              <MenubarItem className="text-base">저장</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="edit">
            <MenubarTrigger className="px-4 py-2 text-base">편집</MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="text-base">실행 취소</MenubarItem>
              <MenubarItem className="text-base">다시 실행</MenubarItem>
              <MenubarItem className="text-base">복사</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="view">
            <MenubarTrigger className="px-4 py-2 text-base">보기</MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="text-base">확대</MenubarItem>
              <MenubarItem className="text-base">축소</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  ),
};

// 메뉴 항목 타입 예제
export const MenuItemTypes: Story = {
  render: () => (
    <Menubar className="border border-gray-200 bg-white rounded-md">
      <MenubarMenu value="items">
        <MenubarTrigger className="px-3 py-1.5">메뉴 항목 타입</MenubarTrigger>
        <MenubarContent className="w-56">
          {/* 일반 항목 */}
          <MenubarItem className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            일반 항목
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>

          <MenubarSeparator />

          {/* 체크박스 항목 */}
          <MenubarCheckboxItem className="flex items-center">
            자동 저장
          </MenubarCheckboxItem>
          <MenubarCheckboxItem className="flex items-center" checked>
            오프라인 모드
          </MenubarCheckboxItem>

          <MenubarSeparator />

          {/* 라디오 그룹 */}
          <MenubarRadioGroup value="grid">
            <MenubarLabel className="px-2 text-xs text-gray-500">보기 모드</MenubarLabel>
            <MenubarRadioItem className="flex items-center" value="grid">
              <LayoutGrid className="mr-2 h-4 w-4" />
              그리드
            </MenubarRadioItem>
            <MenubarRadioItem className="flex items-center" value="list">
              <List className="mr-2 h-4 w-4" />
              목록
            </MenubarRadioItem>
          </MenubarRadioGroup>

          <MenubarSeparator />

          {/* 비활성화된 항목 */}
          <MenubarItem className="flex items-center text-gray-400 pointer-events-none">
            <Lock className="mr-2 h-4 w-4" />
            비활성화된 항목
          </MenubarItem>

          <MenubarSeparator />

          <MenubarSub>
            <MenubarSubTrigger className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              추가 옵션
              <ChevronRight className="ml-auto h-4 w-4" />
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>서브메뉴 항목 1</MenubarItem>
              <MenubarItem>서브메뉴 항목 2</MenubarItem>
              <MenubarItem>서브메뉴 항목 3</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

// 실제 사용 사례 예제
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-10">
      {/* 워드 프로세서 메뉴바 */}
      <div className="space-y-2">
        <h3 className="text-base font-medium">워드 프로세서 메뉴바</h3>
        <div className="flex flex-col border border-gray-200 rounded-md overflow-hidden">
          <Menubar className="border-b border-gray-200 bg-white">
            <MenubarMenu value="file">
              <MenubarTrigger className="px-3 py-1.5">파일</MenubarTrigger>
              <MenubarContent>
                <MenubarItem className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  새 문서
                  <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <Folder className="mr-2 h-4 w-4" />
                  열기
                  <MenubarShortcut>⌘O</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  저장
                  <MenubarShortcut>⌘S</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  다른 이름으로 저장
                  <MenubarShortcut>⇧⌘S</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem className="flex items-center">
                  <Trash className="mr-2 h-4 w-4" />
                  삭제
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu value="edit">
              <MenubarTrigger className="px-3 py-1.5">편집</MenubarTrigger>
              <MenubarContent>
                <MenubarItem className="flex items-center">
                  <Undo className="mr-2 h-4 w-4" />
                  실행 취소
                  <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <Redo className="mr-2 h-4 w-4" />
                  다시 실행
                  <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem className="flex items-center">
                  <Copy className="mr-2 h-4 w-4" />
                  잘라내기
                  <MenubarShortcut>⌘X</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <Copy className="mr-2 h-4 w-4" />
                  복사
                  <MenubarShortcut>⌘C</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <Copy className="mr-2 h-4 w-4" />
                  붙여넣기
                  <MenubarShortcut>⌘V</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu value="view">
              <MenubarTrigger className="px-3 py-1.5">보기</MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem className="flex items-center">
                  도구 모음
                </MenubarCheckboxItem>
                <MenubarCheckboxItem className="flex items-center" checked>
                  상태 표시줄
                </MenubarCheckboxItem>
                <MenubarSeparator />
                <MenubarItem className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  확대
                  <MenubarShortcut>⌘+</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <Minus className="mr-2 h-4 w-4" />
                  축소
                  <MenubarShortcut>⌘-</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu value="insert">
              <MenubarTrigger className="px-3 py-1.5">삽입</MenubarTrigger>
              <MenubarContent>
                <MenubarItem className="flex items-center">
                  <Image className="mr-2 h-4 w-4" />
                  이미지
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <Table className="mr-2 h-4 w-4" />
                  표
                </MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    더 보기
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>도형</MenubarItem>
                    <MenubarItem>차트</MenubarItem>
                    <MenubarItem>머리글/바닥글</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu value="format">
              <MenubarTrigger className="px-3 py-1.5">서식</MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem className="flex items-center">
                  <Bold className="mr-2 h-4 w-4" />
                  굵게
                  <MenubarShortcut>⌘B</MenubarShortcut>
                </MenubarCheckboxItem>
                <MenubarCheckboxItem className="flex items-center">
                  <Italic className="mr-2 h-4 w-4" />
                  기울임꼴
                  <MenubarShortcut>⌘I</MenubarShortcut>
                </MenubarCheckboxItem>
                <MenubarCheckboxItem className="flex items-center">
                  <Underline className="mr-2 h-4 w-4" />
                  밑줄
                  <MenubarShortcut>⌘U</MenubarShortcut>
                </MenubarCheckboxItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger className="flex items-center">
                    <AlignLeft className="mr-2 h-4 w-4" />
                    정렬
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem className="flex items-center">
                      <AlignLeft className="mr-2 h-4 w-4" />
                      왼쪽
                    </MenubarItem>
                    <MenubarItem className="flex items-center">
                      <AlignCenter className="mr-2 h-4 w-4" />
                      가운데
                    </MenubarItem>
                    <MenubarItem className="flex items-center">
                      <AlignRight className="mr-2 h-4 w-4" />
                      오른쪽
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <div className="p-4 bg-gray-50 h-40 flex items-center justify-center text-gray-500">
            문서 내용 영역
          </div>
        </div>
      </div>

      {/* 미디어 플레이어 메뉴바 */}
      <div className="space-y-2">
        <h3 className="text-base font-medium">미디어 플레이어 메뉴바</h3>
        <div className="flex flex-col border border-gray-200 rounded-md overflow-hidden">
          <Menubar className="border-b border-gray-200 bg-white">
            <MenubarMenu value="file">
              <MenubarTrigger className="px-3 py-1.5">파일</MenubarTrigger>
              <MenubarContent>
                <MenubarItem className="flex items-center">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  파일 열기
                  <MenubarShortcut>⌘O</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  폴더 열기
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem className="flex items-center">
                  <X className="mr-2 h-4 w-4" />
                  종료
                  <MenubarShortcut>⌘Q</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu value="playback">
              <MenubarTrigger className="px-3 py-1.5">재생</MenubarTrigger>
              <MenubarContent>
                <MenubarItem className="flex items-center">
                  <Play className="mr-2 h-4 w-4" />
                  재생/일시정지
                  <MenubarShortcut>Space</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <SkipBack className="mr-2 h-4 w-4" />
                  이전 트랙
                  <MenubarShortcut>⌘←</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <SkipForward className="mr-2 h-4 w-4" />
                  다음 트랙
                  <MenubarShortcut>⌘→</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem className="flex items-center">
                  <Repeat className="mr-2 h-4 w-4" />
                  반복
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <Shuffle className="mr-2 h-4 w-4" />
                  셔플
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu value="view">
              <MenubarTrigger className="px-3 py-1.5">보기</MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem className="flex items-center" checked>
                  재생 목록
                </MenubarCheckboxItem>
                <MenubarCheckboxItem className="flex items-center">
                  시각화
                </MenubarCheckboxItem>
                <MenubarSeparator />
                <MenubarItem className="flex items-center">
                  <Maximize2 className="mr-2 h-4 w-4" />
                  전체 화면
                  <MenubarShortcut>F11</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu value="audio">
              <MenubarTrigger className="px-3 py-1.5">오디오</MenubarTrigger>
              <MenubarContent>
                <MenubarSub>
                  <MenubarSubTrigger className="flex items-center">
                    <Volume2 className="mr-2 h-4 w-4" />
                    볼륨
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem className="flex items-center">
                      <Volume1 className="mr-2 h-4 w-4" />
                      낮게
                    </MenubarItem>
                    <MenubarItem className="flex items-center">
                      <Volume2 className="mr-2 h-4 w-4" />
                      중간
                    </MenubarItem>
                    <MenubarItem className="flex items-center">
                      <VolumeX className="mr-2 h-4 w-4" />
                      음소거
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarRadioGroup value="equalizer-off">
                  <MenubarLabel className="px-2 text-xs text-gray-500">이퀄라이저</MenubarLabel>
                  <MenubarRadioItem className="flex items-center" value="equalizer-off">
                    끄기
                  </MenubarRadioItem>
                  <MenubarRadioItem className="flex items-center" value="equalizer-rock">
                    락
                  </MenubarRadioItem>
                  <MenubarRadioItem className="flex items-center" value="equalizer-jazz">
                    재즈
                  </MenubarRadioItem>
                  <MenubarRadioItem className="flex items-center" value="equalizer-pop">
                    팝
                  </MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <div className="p-4 bg-gray-800 h-40 flex items-center justify-center text-white">
            미디어 플레이어 영역
          </div>
        </div>
      </div>

      {/* 이미지 편집기 메뉴바 */}
      <div className="space-y-2">
        <h3 className="text-base font-medium">이미지 편집기 메뉴바</h3>
        <div className="flex flex-col border border-gray-200 rounded-md overflow-hidden">
          <Menubar className="border-b border-gray-200 bg-white">
            <MenubarMenu value="file">
              <MenubarTrigger className="px-3 py-1.5">파일</MenubarTrigger>
              <MenubarContent>
                <MenubarItem className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  새 이미지
                  <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <Image className="mr-2 h-4 w-4" />
                  열기
                  <MenubarShortcut>⌘O</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  저장
                  <MenubarShortcut>⌘S</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  내보내기
                  <MenubarShortcut>⇧⌘E</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu value="edit">
              <MenubarTrigger className="px-3 py-1.5">편집</MenubarTrigger>
              <MenubarContent>
                <MenubarItem className="flex items-center">
                  <Undo className="mr-2 h-4 w-4" />
                  실행 취소
                  <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <Redo className="mr-2 h-4 w-4" />
                  다시 실행
                  <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem className="flex items-center">
                  <Crop className="mr-2 h-4 w-4" />
                  자르기
                  <MenubarShortcut>⌘K</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <RotateCw className="mr-2 h-4 w-4" />
                  회전
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <FlipHorizontal className="mr-2 h-4 w-4" />
                  대칭
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu value="filter">
              <MenubarTrigger className="px-3 py-1.5">필터</MenubarTrigger>
              <MenubarContent>
                <MenubarRadioGroup value="filter-none">
                  <MenubarRadioItem className="flex items-center" value="filter-none">
                    없음
                  </MenubarRadioItem>
                  <MenubarRadioItem className="flex items-center" value="filter-grayscale">
                    흑백
                  </MenubarRadioItem>
                  <MenubarRadioItem className="flex items-center" value="filter-sepia">
                    세피아
                  </MenubarRadioItem>
                  <MenubarRadioItem className="flex items-center" value="filter-vintage">
                    빈티지
                  </MenubarRadioItem>
                </MenubarRadioGroup>
                <MenubarSeparator />
                <MenubarItem className="flex items-center">
                  <Sliders className="mr-2 h-4 w-4" />
                  조정
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu value="tools">
              <MenubarTrigger className="px-3 py-1.5">도구</MenubarTrigger>
              <MenubarContent>
                <MenubarItem className="flex items-center">
                  <Pen className="mr-2 h-4 w-4" />
                  브러시
                  <MenubarShortcut>B</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <Eraser className="mr-2 h-4 w-4" />
                  지우개
                  <MenubarShortcut>E</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <Type className="mr-2 h-4 w-4" />
                  텍스트
                  <MenubarShortcut>T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="flex items-center">
                  <PaintBucket className="mr-2 h-4 w-4" />
                  채우기
                  <MenubarShortcut>G</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <div className="p-4 bg-gray-50 h-40 flex items-center justify-center text-gray-500">
            이미지 편집 영역
          </div>
        </div>
      </div>
    </div>
  ),
};

// 상호작용 예제
export const Interactive: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedTheme, setSelectedTheme] = useState("light");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isBold, setIsBold] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isItalic, setIsItalic] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [alignment, setAlignment] = useState("left");

    const themeClass = selectedTheme === "dark"
      ? "bg-gray-900 text-white"
      : selectedTheme === "blue"
        ? "bg-blue-50 text-blue-900"
        : "bg-white text-gray-900";

    const menubarClass = selectedTheme === "dark"
      ? "bg-gray-800 border-gray-700 text-white"
      : selectedTheme === "blue"
        ? "bg-blue-100 border-blue-200 text-blue-900"
        : "bg-white border-gray-200";

    const contentClass = selectedTheme === "dark"
      ? "bg-gray-800 border-gray-700 text-white"
      : selectedTheme === "blue"
        ? "bg-blue-100 border-blue-200 text-blue-900"
        : "bg-white border-gray-200";

    const textStyles = [
      isBold ? "font-bold" : "",
      isItalic ? "italic" : "",
      alignment === "left" ? "text-left" : alignment === "center" ? "text-center" : "text-right"
    ].join(" ");

    return (
      <div className={`p-4 rounded-lg ${themeClass} transition-colors duration-300`}>
        <Menubar className={`border rounded-md mb-4 ${menubarClass} transition-colors duration-300`}>
          <MenubarMenu value="file">
            <MenubarTrigger className="px-3 py-1.5">파일</MenubarTrigger>
            <MenubarContent className={contentClass}>
              <MenubarItem className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                새 문서
              </MenubarItem>
              <MenubarItem className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                저장
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="edit">
            <MenubarTrigger className="px-3 py-1.5">편집</MenubarTrigger>
            <MenubarContent className={contentClass}>
              <MenubarCheckboxItem
                className="flex items-center"
                checked={isBold}
                onCheckedChange={setIsBold}
              >
                <Bold className="mr-2 h-4 w-4" />
                굵게
              </MenubarCheckboxItem>
              <MenubarCheckboxItem
                className="flex items-center"
                checked={isItalic}
                onCheckedChange={setIsItalic}
              >
                <Italic className="mr-2 h-4 w-4" />
                기울임꼴
              </MenubarCheckboxItem>
              <MenubarSeparator />
              <MenubarRadioGroup value={alignment} onValueChange={setAlignment}>
                <MenubarRadioItem className="flex items-center" value="left">
                  <AlignLeft className="mr-2 h-4 w-4" />
                  왼쪽 정렬
                </MenubarRadioItem>
                <MenubarRadioItem className="flex items-center" value="center">
                  <AlignCenter className="mr-2 h-4 w-4" />
                  가운데 정렬
                </MenubarRadioItem>
                <MenubarRadioItem className="flex items-center" value="right">
                  <AlignRight className="mr-2 h-4 w-4" />
                  오른쪽 정렬
                </MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="view">
            <MenubarTrigger className="px-3 py-1.5">보기</MenubarTrigger>
            <MenubarContent className={contentClass}>
              <MenubarRadioGroup value={selectedTheme} onValueChange={setSelectedTheme}>
                <MenubarRadioItem className="flex items-center" value="light">
                  <Sun className="mr-2 h-4 w-4" />
                  라이트 테마
                </MenubarRadioItem>
                <MenubarRadioItem className="flex items-center" value="dark">
                  <Moon className="mr-2 h-4 w-4" />
                  다크 테마
                </MenubarRadioItem>
                <MenubarRadioItem className="flex items-center" value="blue">
                  <Palette className="mr-2 h-4 w-4" />
                  블루 테마
                </MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <div className={`p-6 border rounded-md ${themeClass} transition-colors duration-300`}>
          <p className={`text-lg ${textStyles}`}>
            이 텍스트는 메뉴에서 선택한 스타일을 반영합니다. 메뉴에서 다양한 옵션을 선택해보세요.
          </p>
        </div>
      </div>
    );
  },
};

function Minus({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function Table({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 3h18v18H3z" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  );
}

function PlusCircle({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}

function FolderOpen({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9L10.5 6H20a2 2 0 0 1 2 2v2.5" />
    </svg>
  );
}

function FolderPlus({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z" />
      <path d="M12 10v6" />
      <path d="M9 13h6" />
    </svg>
  );
}

function Play({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function SkipBack({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="19 20 9 12 19 4 19 20" />
      <line x1="5" x2="5" y1="19" y2="5" />
    </svg>
  );
}

function SkipForward({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" x2="19" y1="5" y2="19" />
    </svg>
  );
}

function Repeat({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function Shuffle({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M2 18h1.4c1.3 0 2.5-.5 3.3-1.4l7.3-7.7c.8-.8 2-1.4 3.3-1.4H22" />
      <path d="m19 7 3 3-3 3" />
      <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
      <path d="M22 18h-4.7c-1.3 0-2.5-.5-3.3-1.4l-7.3-7.7c-.8-.8-2-1.4-3.3-1.4H2" />
      <path d="m19 15 3 3-3 3" />
    </svg>
  );
}

function Volume1({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function Volume2({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function VolumeX({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" x2="16" y1="9" y2="15" />
      <line x1="16" x2="22" y1="9" y2="15" />
    </svg>
  );
}

function Crop({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 2v14a2 2 0 0 0 2 2h14" />
      <path d="M18 22V8a2 2 0 0 0-2-2H2" />
    </svg>
  );
}

function RotateCw({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

function FlipHorizontal({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
      <path d="M12 20v2" />
      <path d="M12 14v2" />
      <path d="M12 8v2" />
      <path d="M12 2v2" />
    </svg>
  );
}

function Sliders({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="2" x2="6" y1="14" y2="14" />
      <line x1="10" x2="14" y1="8" y2="8" />
      <line x1="18" x2="22" y1="16" y2="16" />
    </svg>
  );
}

function Pen({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function Eraser({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
      <path d="M22 21H7" />
      <path d="m5 11 9 9" />
    </svg>
  );
}

function Type({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" x2="15" y1="20" y2="20" />
      <line x1="12" x2="12" y1="4" y2="20" />
    </svg>
  );
}

function PaintBucket({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M19 11h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z" />
      <path d="M4 4h16v4H4z" />
      <path d="M4 8v12a1 1 0 0 0 1 1h9V8z" />
    </svg>
  );
}
