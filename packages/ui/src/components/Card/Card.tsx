import { forwardRef, useState } from 'react';
import { cn } from '../../utils/classname';
import { Button } from '../Button/Button';
import CloseIcon from '../../assets/icons/close.svg';
import { 
  CardProps, 
  CardHeaderProps, 
  CardTitleProps, 
  CardDescriptionProps, 
  CardContentProps, 
  CardFooterProps 
} from './Card.types';

// Card Root 컴포넌트
const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  ({ className, closable = false, onClose, ...props }, ref) => {    
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    };

    if (!isVisible) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-gray-200 bg-white shadow-sm relative",
          className
        )}
        {...props}
      >
        {closable && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 p-0"
            onClick={handleClose}
            aria-label="닫기"
          >
            <CloseIcon />
          </Button>
        )}
        {props.children}
      </div>
    );
  }
);
CardRoot.displayName = "Card.Root";

// Card Header 컴포넌트
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "Card.Header";

// Card Title 컴포넌트
const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          "text-lg font-semibold leading-none tracking-tight text-gray-900",
          className
        )}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "Card.Title";

// Card Description 컴포넌트
const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-gray-500", className)}
        {...props}
      />
    );
  }
);
CardDescription.displayName = "Card.Description";

// Card Content 컴포넌트
const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6 pt-0", className)}
        {...props}
      />
    );
  }
);
CardContent.displayName = "Card.Content";

// Card Footer 컴포넌트
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "Card.Footer";

// 합성 패턴을 위한 Card 객체 생성
const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter
});

export { Card }; 