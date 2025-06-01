import { useEffect, useCallback, memo, ReactElement } from 'react';
import { Button } from "@plug/ui";

type EditMode = 'translate' | 'rotate' | 'scale' | 'none';

interface FeatureEditToolbarProps {
  onTranslateMode: () => void;
  onRotateMode: () => void;
  onScaleMode: () => void;
  onExitEdit: () => void;
  currentMode: EditMode;
}

interface ToolbarButton {
  readonly mode: Exclude<EditMode, 'none'>;
  readonly label: string;
  readonly title: string;
  readonly icon: ReactElement;
  readonly onClick: () => void;
}

const MoveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 5H13V9H17V7L20 10L17 13V11H13V15H15L12 18L9 15H11V11H7V13L4 10L7 7V9H11V5H9L12 2Z" 
          fill="currentColor"/>
  </svg>
);

const RotateIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6V9L16 5L12 1V4C7.58 4 4 7.58 4 12C4 13.57 4.46 15.03 5.24 16.26L6.7 14.8C6.25 13.97 6 13 6 12C6 8.69 8.69 6 12 6ZM18.76 7.74L17.3 9.2C17.75 10.03 18 11 18 12C18 15.31 15.31 18 12 18V15L8 19L12 23V20C16.42 20 20 16.42 20 12C20 10.43 19.54 8.97 18.76 7.74Z" 
          fill="currentColor"/>
  </svg>
);

const ScaleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 3V21H3V19H20V3H22ZM20 5H15V7H18.59L13 12.59L10.41 10L4 16.41L5.41 17.82L10.41 12.82L13 15.41L20 8.41V12H22V5H20Z" 
          fill="currentColor"/>
  </svg>
);

const FeatureEditToolbar = memo<FeatureEditToolbarProps>(({
  onTranslateMode,
  onRotateMode,
  onScaleMode,
  onExitEdit,
  currentMode
}) => {
  
  // ESC 키 핸들링을 위한 이벤트 리스너
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && currentMode !== 'none') {
      onExitEdit();
    }
  }, [currentMode, onExitEdit]);

  // 키보드 이벤트 등록/해제
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // 툴바 버튼 설정을 배열로 정의 (데이터 기반 렌더링)
  const toolbarButtons: ToolbarButton[] = [
    {
      mode: 'translate',
      label: '이동',
      title: '이동 모드 (T키)',
      icon: <MoveIcon />,
      onClick: onTranslateMode
    },
    {
      mode: 'rotate', 
      label: '회전',
      title: '회전 모드 (R키)',
      icon: <RotateIcon />,
      onClick: onRotateMode
    },
    {
      mode: 'scale',
      label: '크기',
      title: '크기조절 모드 (S키)',
      icon: <ScaleIcon />,
      onClick: onScaleMode
    }
  ];

  // 버튼 스타일을 동적으로 계산
  const getButtonClassName = useCallback((mode: EditMode) => {
    const baseClasses = 'w-10 h-10 transition-all duration-200';
    const activeClasses = 'ring-2 ring-blue-500 ring-offset-1';
    const inactiveClasses = 'bg-white hover:bg-gray-50';
    
    return currentMode === mode 
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  }, [currentMode]);
  // 현재 모드에 따른 상태 메시지
  const getModeMessage = () => {
    switch (currentMode) {
      case 'translate':
        return '이동 모드 활성화 중 - 객체를 드래그하여 위치를 변경하세요';
      case 'rotate':
        return '회전 모드 활성화 중 - 객체를 드래그하여 회전시키세요';
      case 'scale':
        return '크기조절 모드 활성화 중 - 객체를 드래그하여 크기를 조절하세요';
      default:
        return null;
    }
  };

  const isEditingActive = currentMode !== 'none';
  return (
        <>
            <div className="absolute top-16 right-4 z-10">
                {/* 툴바 버튼들 */}
                <div className={`flex flex-row gap-2 p-2 transition-all duration-300 
                                bg-transparent`}>
                    {toolbarButtons.map(({ mode, title, icon, onClick }) => (
                    <Button
                        key={mode}
                        variant={currentMode === mode ? 'default' : 'outline'}
                        color={currentMode === mode ? 'primary' : 'default'}
                        size="icon"
                        onClick={onClick}
                        className={getButtonClassName(mode)}
                        title={title}
                        aria-label={title}
                        aria-pressed={currentMode === mode}
                    >
                        {icon}
                    </Button>
                    ))}        
                </div>
            </div>
            
            {/* 편집 모드 상태 표시 */}
            {isEditingActive && (
                <div className="absolute top-32 right-4 mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm animate-pulse">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                        <span className="text-sm font-medium text-blue-800">
                        편집 모드 활성화
                        </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                        {getModeMessage()}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                        ESC 키를 눌러 편집 모드를 종료하세요
                    </p>
                </div>
            )}
      </>
  );
});

FeatureEditToolbar.displayName = 'FeatureEditToolbar';

export default FeatureEditToolbar;