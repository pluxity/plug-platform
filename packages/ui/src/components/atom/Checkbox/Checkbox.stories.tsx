import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox} from "./Checkbox";
import { Label } from "../Label/Label";

const meta: Meta<typeof Checkbox> = {
    title: 'ATOM/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],    
    argTypes: {
        checked: { control: 'boolean' },
        disabled: { control: 'boolean' },
    }
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
    render: (args) => (
        <Checkbox {...args}/>
    )
}

export const SquareChecked: Story = {
  render: () => (
    <Checkbox checked variant="square" />
  )
}

export const RoundChecked: Story = {
  render: () => (
    <Checkbox checked variant="round" />
  )
}


export const SquareDisabled: Story = {
  render: () => (
    <div className="flex gap-2">
        <Checkbox variant="square" disabled />
        <Checkbox variant="square" checked disabled />
    </div>
  )
}


export const RoundDisabled: Story = {
  render: () => (
    <div className="flex gap-2">
        <Checkbox variant="round" disabled />
        <Checkbox variant="round" checked disabled />
    </div>
  )
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="agree1" />
        <Label htmlFor="agree1">동의합니다</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="agree2" checked />
        <Label htmlFor="agree2">체크된 상태</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="agree3" variant="round" />
        <Label htmlFor="agree3">원형 체크박스</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="agree4" variant="round" checked />
        <Label htmlFor="agree4">원형 체크박스(체크)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="agree5" disabled />
        <Label htmlFor="agree5">비활성</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="agree6" checked disabled />
        <Label htmlFor="agree6" >비활성+체크</Label>
      </div>
    </div>
  )
}

export const CustomStyling: Story = {
  render: () => (
      <div className="flex items-center gap-4">
        <Checkbox 
          id="custom1" 
          className="w-6 h-6 border-2 border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-600" 
        />
        <Label htmlFor="custom1">커스텀 테마</Label>
      </div>
  )
}

