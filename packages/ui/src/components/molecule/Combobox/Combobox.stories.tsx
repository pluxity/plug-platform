import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { Combobox, ComboboxOption } from "./Combobox"

const meta: Meta<typeof Combobox> = {
  title: 'Molecule/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Combobox>

const frameworks: ComboboxOption[] = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = React.useState("")
    return (
      <Combobox
        {...args}
        options={frameworks}
        value={value}
        onChange={setValue}
        placeholder="Select framework..."
      />
    )
  },
}
