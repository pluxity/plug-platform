import type { Meta, StoryObj } from "@storybook/react";
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "./Command";

const meta: Meta<typeof Command> = {
    title: 'ATOM/Command',
    component: Command,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],    
    argTypes: {
      className: {
        control: 'text',
        description: 'className',
      },
      value: {
        control: 'text',
        description: 'value',
      },
      onValueChange: {
        control: 'text',
        description: 'onValueChange',
      },
      defaultValue: {
        control: 'text',
        description: 'defaultValue',
      },  
      label: {
        control: 'text',
        description: 'label',
      },
      asChild: {
        control: 'boolean',
        description: 'asChild',
      },
    },
  }

export default meta
type Story = StoryObj<typeof Command>

export const Default: Story = {
  render: (args) => (
    <Command {...args}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>Profile</CommandItem>
          <CommandItem>Billing</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
