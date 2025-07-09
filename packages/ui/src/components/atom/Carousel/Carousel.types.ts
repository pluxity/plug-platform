import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { Button } from "../Button/Button";

export type CarouselApi = UseEmblaCarouselType[1];
export type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
export type CarouselOptions = UseCarouselParameters[0];
export type CarouselPlugin = UseCarouselParameters[1];

export interface CarouselProps {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: "horizontal" | "vertical";
    setApi?: (api: CarouselApi) => void;
}

export interface CarouselContextProps extends CarouselProps {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0];
    api: ReturnType<typeof useEmblaCarousel>[1];
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
    current: number;
    count: number;
    handleSelect: (idx: number) => void;
}

export interface CarouselContentProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
    className?: string;
}

export interface CarouselItemProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
    className?: string;
}

export interface CarouselPreviousProps extends React.ComponentProps<typeof Button> {
    className?: string;
    variant?: React.ComponentProps<typeof Button>["variant"];
    size?: React.ComponentProps<typeof Button>["size"];
}

export interface CarouselNextProps extends React.ComponentProps<typeof Button> {
    className?: string;
    variant?: React.ComponentProps<typeof Button>["variant"];
    size?: React.ComponentProps<typeof Button>["size"];
}

export interface CarouselIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    buttonClassName?: string;
    activeButtonClassName?: string;
    inactiveButtonClassName?: string;
}
