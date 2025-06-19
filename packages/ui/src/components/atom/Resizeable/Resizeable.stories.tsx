import type { Meta, StoryObj } from "@storybook/react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./Resizable"

const meta: Meta = {
  title: "ATOM/Resizable",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="w-full h-[300px] border rounded-md overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} className="bg-blue-100 p-4">
          <p className="text-sm">Left Panel</p>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} className="bg-green-100 p-4">
          <p className="text-sm">Right Panel</p>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="w-full h-[300px] border rounded-md overflow-hidden">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={50} className="bg-pink-100 p-4">
          <p className="text-sm">Top Panel</p>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} className="bg-yellow-100 p-4">
          <p className="text-sm">Bottom Panel</p>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
}

export const Both: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w-md rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={50} className='bg-purple-100'>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25} className='bg-teal-100'>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75} className='bg-sky-100'>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}