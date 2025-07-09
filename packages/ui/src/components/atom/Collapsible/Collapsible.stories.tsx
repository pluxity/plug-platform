import type { Meta, StoryObj } from "@storybook/react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./Collapsible";
import { Button } from '../Button/Button';
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

const meta: Meta<typeof Collapsible> = {
    title: 'ATOM/Collapsible',
    component: Collapsible,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
      disabled:{
        control: 'boolean',
        description: 'disabled',
      },
    }
}

export default meta
type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);
        
        return (
            <Collapsible
              {...args}
              open={isOpen}
              onOpenChange={setIsOpen}
              className="flex w-[350px] flex-col gap-2"
            >
                <div className="flex items-center justify-between gap-4 px-4">
                <h4 className="text-sm font-semibold">
                    Collapsible Title
                </h4>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                    <ChevronsUpDown />
                    <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
                </div>
                <div className="rounded-md border px-4 py-2 font-mono text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </div>
                <CollapsibleContent className="flex flex-col gap-2">
                <div className="rounded-md border px-4 py-2 font-mono text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </div>
                <div className="rounded-md border px-4 py-2 font-mono text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </div>
                </CollapsibleContent>
            </Collapsible>
        );
    }
}

export const Disabled: Story = {
  render: function Render() {
    return(
        <Collapsible open={false} onOpenChange={() => {}} className="pointer-events-none opacity-60 w-[350px] flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4 px-4">
            <h4 className="text-sm font-semibold">Disabled Collapsible</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8" disabled>
                <ChevronsUpDown />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            내용이 비활성화되어 있습니다.
          </div>
        </Collapsible>
    )
  }
}

export const LongContent: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex w-[350px] flex-col gap-2"
      >
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="text-sm font-semibold">긴 내용 Collapsible</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ChevronsUpDown />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="flex flex-col gap-2 max-h-32 overflow-y-auto">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-md border px-4 py-2 font-mono text-sm">
              긴 내용 {i + 1}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }
}

