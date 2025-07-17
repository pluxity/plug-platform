import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast";
import { toast } from "./toast-functions";
import { 
  useState, 
  useEffect, 
  useRef 
} from "react";
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertCircleIcon, 
  InfoIcon, 
  BellIcon,
  StarIcon
} from "lucide-react";

type ToastProps = {
  className?: string;
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  closeButton?: boolean;
  duration?: number;
  visibleToasts?: number;
  richColors?: boolean;
  expand?: boolean;
  invert?: boolean;
  gap?: number;
  theme?: "light" | "dark" | "system";
  toastOptions?: {
    duration?: number;
    dismissible?: boolean;
    important?: boolean;
    style?: React.CSSProperties;
    className?: string;
    descriptionClassName?: string;
  };
};

const meta = {
  title: "ATOM/Toast",
  component: Toast,
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: [
        "top-left", 
        "top-center", 
        "top-right", 
        "bottom-left", 
        "bottom-center", 
        "bottom-right"
      ],
      description: "토스트 알림의 화면상 위치",
      defaultValue: "top-right",
    },
    closeButton: {
      control: "boolean",
      description: "닫기 버튼 표시 여부",
      defaultValue: true,
    },
    duration: {
      control: { type: "number", min: 1000, max: 20000, step: 500 },
      description: "토스트가 화면에 표시되는 시간(ms)",
      defaultValue: 4000,
    },
    visibleToasts: {
      control: { type: "number", min: 1, max: 10, step: 1 },
      description: "한 번에 표시할 최대 토스트 수",
      defaultValue: 3,
    },
    richColors: {
      control: "boolean",
      description: "더 풍부한 색상 사용 여부",
      defaultValue: false,
    },
    expand: {
      control: "boolean",
      description: "토스트 확장 표시 여부",
      defaultValue: false,
    },
    invert: {
      control: "boolean",
      description: "색상 반전 여부",
      defaultValue: false,
    },
    gap: {
      control: { type: "number", min: 0, max: 24, step: 1 },
      description: "토스트 간 간격(px)",
      defaultValue: 8,
    },
    theme: {
      control: "select",
      options: ["light", "dark", "system"],
      description: "토스트 테마",
      defaultValue: "light",
    },

    className: {
      control: "text",
      description: "커스텀 CSS 클래스",
    },
  },
} satisfies Meta<ToastProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const buttonStyles = {
  base: "px-4 py-2 rounded text-white font-medium text-sm transition duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-opacity-50 mr-2 mb-2",
  default: "bg-gray-800",
  success: "bg-green-600",
  error: "bg-red-600",
  warning: "bg-amber-500",
  info: "bg-blue-600",
  custom: "bg-purple-600",
};

export const Default: Story = {
   render: function Render(args) {
    const prevArgsRef = useRef(args);
    const [key, setKey] = useState(0);
    
    useEffect(() => {
      if (JSON.stringify(prevArgsRef.current) !== JSON.stringify(args)) {
        setKey(prev => prev + 1);
        prevArgsRef.current = args;
      }
    }, [args]);

    const showToast = (type = "default", title = "", description = "", options = {}) => {
      const toastOptions = {
        duration: args.duration,
        ...options,
      };

      switch (type) {
        case "success":
          toast.success(title, { description, ...toastOptions });
          break;
        case "error":
          toast.error(title, { description, ...toastOptions });
          break;
        case "warning":
          toast.warning(title, { description, ...toastOptions });
          break;
        case "info":
          toast.info(title, { description, ...toastOptions });
          break;
        case "action":
          toast(title, { 
            description,
            action: {
              label: "실행",
              onClick: () => console.log("Action clicked"),
            },
            ...toastOptions 
          });
          break;        
        default:
          toast(title, { description, ...toastOptions });
      }
    };

    return (
      <div className="p-4 space-y-4">
        <Toast 
          key={key}
          position={args.position}
          closeButton={args.closeButton}
          duration={args.duration}
          visibleToasts={args.visibleToasts}
          richColors={args.richColors}
          expand={args.expand}
          invert={args.invert}
          gap={args.gap}
          theme={args.theme}
          className={args.className}
        />
        
        <div className="flex flex-wrap">
          <button
            className={`${buttonStyles.base} ${buttonStyles.default}`}
            onClick={() => showToast("default", "기본 토스트 메시지입니다.")}
          >
            기본
          </button>
          <button
            className={`${buttonStyles.base} ${buttonStyles.success}`}
            onClick={() => showToast("success", "성공 메시지입니다.", "작업이 정상적으로 완료되었습니다.")}
          >
            성공
          </button>
          <button
            className={`${buttonStyles.base} ${buttonStyles.error}`}
            onClick={() => showToast("error", "오류 발생", "문제가 발생했습니다. 다시 시도해주세요.")}
          >
            에러
          </button>
          <button
            className={`${buttonStyles.base} ${buttonStyles.warning}`}
            onClick={() => showToast("warning", "주의 필요", "이 작업은 취소할 수 없습니다.")}
          >
            경고
          </button>
          <button
            className={`${buttonStyles.base} ${buttonStyles.info}`}
            onClick={() => showToast("info", "정보 안내", "새로운 기능이 추가되었습니다.")}
          >
            정보
          </button>
          <button
            className={`${buttonStyles.base} ${buttonStyles.default}`}
            onClick={() => showToast("action", "작업 알림", "이 작업을 수행하시겠습니까?")}
          >
            액션
          </button>
          <button
            className={`${buttonStyles.base} ${buttonStyles.custom}`}
            onClick={() => showToast("custom", "커스텀 토스트", "나만의 디자인으로 토스트를 만들 수 있습니다.")}
          >
            커스텀
          </button>
        </div>
      </div>
    );
  },
  args: {
    position: "top-right",
    closeButton: true,
    duration: 4000,
    visibleToasts: 3,
    richColors: false,
    expand: false,
    invert: false,
    gap: 8,
    theme: "light",
  },
};

export const Positions: Story = {
  render: function Render() {
    const [position, setPosition] = useState<string>("top-right");
    
    const positions = [
      "top-left",
      "top-center",
      "top-right",
      "bottom-left",
      "bottom-center", 
      "bottom-right"
    ];
    
    const showToast = () => {
      toast(`${position} 위치의 토스트`, {
        description: `현재 토스트는 ${position} 위치에 표시됩니다.`,
      });
    };
    
    return (
      <div className="p-4 space-y-4">
        <Toast position={position as ToastProps['position']} />
        
        <div className="flex flex-wrap gap-2 mb-4">
          {positions.map((pos) => (
            <button
              key={pos}
              className={`px-3 py-2 rounded text-sm ${
                position === pos 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setPosition(pos)}
            >
              {pos}
            </button>
          ))}
        </div>
        
        <button
          className={`${buttonStyles.base} ${buttonStyles.default}`}
          onClick={showToast}
        >
          토스트 표시
        </button>
        
        <div className="mt-4 text-sm text-gray-500">
          위치를 선택한 후 버튼을 클릭하면 해당 위치에 토스트가 표시됩니다.
        </div>
      </div>
    );
  },
};

export const ToastTypes: Story = {
  render: () => {
    return (
      <div className="p-4 space-y-4">
        <Toast richColors />
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <InfoIcon className="mr-2 h-5 w-5 text-blue-500" />
              기본 토스트
            </h3>
            <p className="text-sm text-gray-500 mb-4">일반적인 알림을 표시합니다.</p>
            <button
              className={`${buttonStyles.base} ${buttonStyles.default} w-full`}
              onClick={() => toast("기본 알림", { description: "일반 정보를 포함한 토스트입니다." })}
            >
              표시
            </button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <CheckCircleIcon className="mr-2 h-5 w-5 text-green-500" />
              성공 토스트
            </h3>
            <p className="text-sm text-gray-500 mb-4">작업 성공 시 사용합니다.</p>
            <button
              className={`${buttonStyles.base} ${buttonStyles.success} w-full`}
              onClick={() => toast.success("성공!", { description: "작업이 성공적으로 완료되었습니다." })}
            >
              표시
            </button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <XCircleIcon className="mr-2 h-5 w-5 text-red-500" />
              에러 토스트
            </h3>
            <p className="text-sm text-gray-500 mb-4">오류 발생 시 사용합니다.</p>
            <button
              className={`${buttonStyles.base} ${buttonStyles.error} w-full`}
              onClick={() => toast.error("오류 발생", { description: "작업 중 문제가 발생했습니다." })}
            >
              표시
            </button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <AlertCircleIcon className="mr-2 h-5 w-5 text-amber-500" />
              경고 토스트
            </h3>
            <p className="text-sm text-gray-500 mb-4">주의가 필요한 경우 사용합니다.</p>
            <button
              className={`${buttonStyles.base} ${buttonStyles.warning} w-full`}
              onClick={() => toast.warning("주의", { description: "이 작업은 주의가 필요합니다." })}
            >
              표시
            </button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <InfoIcon className="mr-2 h-5 w-5 text-blue-500" />
              정보 토스트
            </h3>
            <p className="text-sm text-gray-500 mb-4">정보 제공 시 사용합니다.</p>
            <button
              className={`${buttonStyles.base} ${buttonStyles.info} w-full`}
              onClick={() => toast.info("알림", { description: "새로운 기능이 추가되었습니다." })}
            >
              표시
            </button>
          </div>
        </div>
      </div>
    );
  },
};

export const StylingOptions: Story = {
  render: function Render() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
    const [richColors, setRichColors] = useState(false);
    const [expand, setExpand] = useState(false);
    const [invert, setInvert] = useState(false);
    
    const showToast = () => {
      toast("스타일 적용된 토스트", {
        description: "현재 설정된 스타일이 적용된 토스트입니다.",
      });
    };
    
    return (
      <div className="p-4 space-y-4">
        <Toast
          theme={theme}
          richColors={richColors}
          expand={expand}
          invert={invert}
        />
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">테마</label>
            <div className="flex space-x-2">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  className={`px-3 py-2 rounded text-sm ${
                    theme === t 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setTheme(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">기타 옵션</label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-2 rounded text-sm ${
                  richColors 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setRichColors(!richColors)}
              >
                풍부한 색상 {richColors ? 'ON' : 'OFF'}
              </button>
              
              <button
                className={`px-3 py-2 rounded text-sm ${
                  expand 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setExpand(!expand)}
              >
                확장 {expand ? 'ON' : 'OFF'}
              </button>
              
              <button
                className={`px-3 py-2 rounded text-sm ${
                  invert 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setInvert(!invert)}
              >
                색상 반전 {invert ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
        
        <button
          className={`${buttonStyles.base} ${buttonStyles.default}`}
          onClick={showToast}
        >
          토스트 표시
        </button>
        
        <div className="mt-4 text-sm text-gray-500">
          스타일 옵션을 변경한 후 버튼을 클릭하면 적용된 스타일로 토스트가 표시됩니다.
        </div>
      </div>
    );
  },
};

export const CustomToasts: Story = {
  render: () => {
    return (
      <div className="p-4 space-y-4">
        <Toast />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">기본 커스텀 토스트</h3>
            <p className="text-sm text-gray-500 mb-4">직접 디자인한 토스트를 표시합니다.</p>
            <button
              className={`${buttonStyles.base} ${buttonStyles.custom}`}
              onClick={() => toast.custom((id: string | number) => (
                <div
                  className={`animate-enter bg-white shadow-lg rounded-lg pointer-events-auto flex p-4 border-l-4 border-purple-500`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      커스텀 토스트
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      직접 디자인한 토스트 컴포넌트입니다.
                    </p>
                  </div>
                  <button
                    onClick={() => toast.dismiss(id)}
                    className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            >
              표시
            </button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">액션이 있는 토스트</h3>
            <p className="text-sm text-gray-500 mb-4">사용자 액션을 추가한 토스트입니다.</p>
            <button
              className={`${buttonStyles.base} ${buttonStyles.default}`}
              onClick={() => toast("이벤트가 생성되었습니다", {
                description: "2025년 6월 24일 오전 9시",
                action: {
                  label: "확인",
                  onClick: () => console.log("Action clicked"),
                },
              })}
            >
              표시
            </button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">카드 스타일 토스트</h3>
            <p className="text-sm text-gray-500 mb-4">카드 형태의 커스텀 토스트입니다.</p>
            <button
              className={`${buttonStyles.base} ${buttonStyles.custom}`}
              onClick={() => toast.custom((id: string | number) => (
                <div
                  className={`animate-enter max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col`}
                >
                  <div className="flex-1 p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <StarIcon className="h-10 w-10 text-yellow-500" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          새로운 리뷰가 추가되었습니다
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          사용자가 제품에 5점 평가를 남겼습니다.
                        </p>
                        <div className="mt-4 flex">
                          <button
                            onClick={() => {
                              console.log("View review");
                              toast.dismiss(id);
                            }}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            리뷰 보기
                          </button>
                          <button
                            onClick={() => toast.dismiss(id)}
                            className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            닫기
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            >
              표시
            </button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <BellIcon className="mr-2 h-5 w-5 text-blue-500" />
              알림 토스트
            </h3>
            <p className="text-sm text-gray-500 mb-4">알림 형태의 커스텀 토스트입니다.</p>
            <button
              className={`${buttonStyles.base} ${buttonStyles.info}`}
              onClick={() => toast.custom((id: string | number) => (
                <div
                  className={`animate-enter max-w-md w-full bg-blue-50 border-l-4 border-blue-500 shadow-md rounded-r-lg pointer-events-auto flex p-4`}
                >
                  <div className="flex-shrink-0">
                    <BellIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-blue-800">
                      새 알림
                    </p>
                    <p className="mt-1 text-sm text-blue-700">
                      새로운 메시지가 도착했습니다. 지금 확인해보세요.
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      onClick={() => toast.dismiss(id)}
                      className="bg-blue-50 rounded-md inline-flex text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            >
              표시
            </button>
          </div>
        </div>
      </div>
    );
  },
};

export const RealWorldExamples: Story = {
  render: () => {
    const simulateLogin = () => {
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1500)),
        {
          loading: '로그인 중...',
          success: '로그인이 완료되었습니다.',
          error: '로그인에 실패했습니다.',
        }
      );
    };
    
    const simulateFileUpload = () => {
      toast.promise(
        new Promise((resolve) => {
          const interval = setInterval(() => {
          }, 200);
          
          setTimeout(() => {
            clearInterval(interval);
            resolve(true);
          }, 3000);
        }),
        {
          loading: '파일 업로드 중...',
          success: '파일이 업로드되었습니다.',
          error: '파일 업로드에 실패했습니다.',
        }
      );
    };
    
    const simulateFormSubmit = () => {
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 2000)),
        {
          loading: '양식 제출 중...',
          success: () => {
            return (
              <div>
                <p>양식이 성공적으로 제출되었습니다.</p>
                <p className="text-xs text-gray-500 mt-1">참조 번호: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
              </div>
            );
          },
          error: '양식 제출에 실패했습니다. 다시 시도해주세요.',
        }
      );
    };
    
    const showNetworkError = () => {
      toast.error("네트워크 오류", {
        description: "서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.",
        duration: 5000,
      });
    };
    
    return (
      <div className="p-4 space-y-4">
        <Toast richColors />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">로그인 프로세스</h3>
            <p className="text-sm text-gray-500 mb-4">로그인 진행 상태를 토스트로 표시합니다.</p>
            <button
              className={`${buttonStyles.base} ${buttonStyles.default}`}
              onClick={simulateLogin}
            >
              로그인
            </button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">파일 업로드</h3>
            <p className="text-sm text-gray-500 mb-4">파일 업로드 진행 상태를 토스트로 표시합니다.</p>
            <button
              className={`${buttonStyles.base} ${buttonStyles.default}`}
              onClick={simulateFileUpload}
            >
              파일 업로드
            </button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">양식 제출</h3>
            <p className="text-sm text-gray-500 mb-4">양식 제출 상태를 토스트로 표시합니다.</p>
            <button
              className={`${buttonStyles.base} ${buttonStyles.success}`}
              onClick={simulateFormSubmit}
            >
              양식 제출
            </button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">네트워크 오류</h3>
            <p className="text-sm text-gray-500 mb-4">네트워크 오류를 토스트로 표시합니다.</p>
            <button
              className={`${buttonStyles.base} ${buttonStyles.error}`}
              onClick={showNetworkError}
            >
              오류 표시
            </button>
          </div>
        </div>
      </div>
    );
  },
};

// 여러 토스트 표시 예제
export const MultipleToasts: Story = {
  render: () => {
    const showMultipleToasts = (count: number) => {
      for (let i = 1; i <= count; i++) {
        setTimeout(() => {
          toast(`토스트 #${i}`, {
            description: `이것은 ${i}번째 토스트 메시지입니다.`,
          });
        }, i * 300);
      }
    };
    
    return (
      <div className="p-4 space-y-4">
        <Toast visibleToasts={5} />
        
        <div className="flex flex-wrap gap-2">
          <button
            className={`${buttonStyles.base} ${buttonStyles.default}`}
            onClick={() => showMultipleToasts(3)}
          >
            3개 표시
          </button>
          <button
            className={`${buttonStyles.base} ${buttonStyles.default}`}
            onClick={() => showMultipleToasts(5)}
          >
            5개 표시
          </button>
          <button
            className={`${buttonStyles.base} ${buttonStyles.default}`}
            onClick={() => showMultipleToasts(10)}
          >
            10개 표시
          </button>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          한 번에 여러 토스트를 표시하면 설정된 최대 표시 개수에 따라 토스트가 관리됩니다.
        </div>
      </div>
    );
  },
};

// @plug/ui의 Wrapper 함수들을 보여주는 스토리
export const WrappedFunctions: Story = {
  render: () => {
    return (
      <div className="p-6 space-y-6">
        <Toast />
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-4">@plug/ui Toast Wrapper Functions</h2>
            <p className="text-gray-600 mb-6">
              이제 다른 프로젝트에서 sonner를 별도로 설치할 필요 없이 @plug/ui만으로 toast 기능을 사용할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 기본 함수들 */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">기본 Toast 함수들</h3>
              <div className="space-y-2">
                <button
                  className={`${buttonStyles.base} ${buttonStyles.success} w-full`}
                  onClick={() => toast.success("성공!", { description: "작업이 성공적으로 완료되었습니다." })}
                >
                  toast.success()
                </button>
                <button
                  className={`${buttonStyles.base} ${buttonStyles.error} w-full`}
                  onClick={() => toast.error("오류!", { description: "작업 중 오류가 발생했습니다." })}
                >
                  toast.error()
                </button>
                <button
                  className={`${buttonStyles.base} ${buttonStyles.info} w-full`}
                  onClick={() => toast.info("정보", { description: "새로운 업데이트가 있습니다." })}
                >
                  toast.info()
                </button>
                <button
                  className={`${buttonStyles.base} ${buttonStyles.warning} w-full`}
                  onClick={() => toast.warning("주의", { description: "이 작업은 되돌릴 수 없습니다." })}
                >
                  toast.warning()
                </button>
                <button
                  className={`${buttonStyles.base} ${buttonStyles.default} w-full`}
                  onClick={() => toast("메시지", { description: "일반적인 알림 메시지입니다." })}
                >
                  toast()
                </button>
              </div>
            </div>
          </div>

          {/* 사용법 예제 */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">사용법 예제</h3>
            <div className="space-y-2 text-sm">
              <p><code className="bg-gray-200 px-2 py-1 rounded">import &#123; toast &#125; from '@plug/ui';</code></p>
              <p><code className="bg-gray-200 px-2 py-1 rounded">toast.success("성공!", &#123; description: "작업이 완료되었습니다." &#125;);</code></p>
              <p><code className="bg-gray-200 px-2 py-1 rounded">toast("기본 메시지", &#123; duration: 5000 &#125;);</code></p>
            </div>
          </div>
        </div>
      </div>
    );
  },
};