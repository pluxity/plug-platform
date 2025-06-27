import type { Meta, StoryObj } from "@storybook/react"
import React from "react"

import { 
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    CarouselIndicator,
} from "./Carousel"

import { Card, CardContent } from "../Card/Card";


const meta: Meta<typeof Carousel> = {
    title: 'ATOM/Carousel',
    component: Carousel,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],   
    argTypes: {
        orientation: {
            options: ['horizontal', 'vertical'],
            control: { type: 'radio' },
        },
        opts: {
            table: {disable: true},
        },
        plugins: {          
            table: { disable: true }
        }
    } 
}

export default meta
type Story = StoryObj<typeof Carousel>

export const Default: Story = {
  render: ({ orientation, ...args }) => (
    <Carousel {...args} orientation={orientation} className="w-full max-w-xs">
      <CarouselContent
        className={
          orientation === 'vertical'
            ? '-mt-1 h-[200px] flex-col'
            : ''
        }
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={index}
            className={orientation === 'vertical' ? 'pt-1 md:basis-1/2' : ''}
          >
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const Sizes: Story = {
    render: () => (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-full max-w-sm"
            >
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                    <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-3xl font-semibold">{index + 1}</span>
                        </CardContent>
                    </Card>
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}

export const Spacing: Story = {
    render: () => (
        <Carousel className="w-full max-w-sm">
            <CarouselContent className="-ml-1">
            {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                    <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-2xl font-semibold">{index + 1}</span>
                    </CardContent>
                    </Card>
                </div>
                </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
      </Carousel>
    )
}

export const Orientation: Story = {
    render: () => (
        <Carousel
            opts={{
                align: "start",
            }}
            orientation="vertical"
            className="w-full max-w-xs"
            >
            <CarouselContent className="-mt-1 h-[200px]">
                {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="pt-1 md:basis-1/2">
                    <div className="p-1">
                    <Card>
                        <CardContent className="flex items-center justify-center p-6">
                        <span className="text-3xl font-semibold">{index + 1}</span>
                        </CardContent>
                    </Card>
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}


export const Loop: Story = {
    render: () => (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            orientation="vertical"
            className="w-full max-w-xs"
            >
            <CarouselContent className="-mt-1 h-[200px]">
                {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="pt-1 md:basis-1/2">
                    <div className="p-1">
                    <Card>
                        <CardContent className="flex items-center justify-center p-6">
                        <span className="text-3xl font-semibold">{index + 1}</span>
                        </CardContent>
                    </Card>
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}

export const Api: Story = {
    render: () => {
      const [api, setApi] = React.useState<CarouselApi>();
      const [current, setCurrent] = React.useState(0);
      const [count, setCount] = React.useState(0);
  
      React.useEffect(() => {
        if (!api) return;
  
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);
  
        api.on("select", () => {
          setCurrent(api.selectedScrollSnap() + 1);
        });
      }, [api]);
  
      return (
        <div className="flex flex-col items-center gap-4">
          <Carousel setApi={setApi} className="w-full max-w-xs">
          <CarouselContent className="-mt-1 h-[200px]">
                {Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem key={index} className="pt-1 md:basis-1/2">
                    <div className="p-1">
                    <Card>
                        <CardContent className="flex items-center justify-center p-6">
                        <span className="text-3xl font-semibold">{index + 1}</span>
                        </CardContent>
                    </Card>
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="text-sm text-gray-500">
            {current} / {count}
          </div>
        </div>
      );
    }
  };

export const Indicator: Story = {
  render: (args) => (
    <Carousel {...args} className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselIndicator buttonClassName="border-red-500" activeButtonClassName="bg-red-500" inactiveButtonClassName="bg-red-200"/>
    </Carousel>
  )
}










