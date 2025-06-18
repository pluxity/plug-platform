import type { Meta, StoryObj } from "@storybook/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./Accordion"

const meta: Meta<typeof Accordion> = {
    title: 'atom/Accordion',
    component: Accordion,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
      type: {
        control: 'select',
        options: ['single', 'multiple'],
        description: '단일/다중 확장 여부',
      },
      collapsible: {
        control: 'boolean',
        description: '모든 항목을 닫을 수 있는지 여부',
      }
    }
  }

export default meta
type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  render: (args) => (
    <Accordion {...args} className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>첫 번째 섹션</AccordionTrigger>
        <AccordionContent>
          첫 번째 섹션의 내용입니다. 여기에 자세한 설명이나 추가 정보를 넣을 수 있습니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>두 번째 섹션</AccordionTrigger>
        <AccordionContent>
          두 번째 섹션의 내용입니다. 여기에 자세한 설명이나 추가 정보를 넣을 수 있습니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>세 번째 섹션</AccordionTrigger>
        <AccordionContent>
          세 번째 섹션의 내용입니다. 여기에 자세한 설명이나 추가 정보를 넣을 수 있습니다.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>첫 번째 섹션</AccordionTrigger>
        <AccordionContent>
          첫 번째 섹션의 내용입니다. 여러 섹션을 동시에 열 수 있습니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>두 번째 섹션</AccordionTrigger>
        <AccordionContent>
          두 번째 섹션의 내용입니다. 여러 섹션을 동시에 열 수 있습니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>세 번째 섹션</AccordionTrigger>
        <AccordionContent>
          세 번째 섹션의 내용입니다. 여러 섹션을 동시에 열 수 있습니다.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
} 