import type { Meta, StoryObj } from "@storybook/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs"
import { Flame, Cloud, Code } from "lucide-react";

const meta: Meta = {
  title: "ATOM/Tabs",
  component: Tabs,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Tabs>

export const DefaultTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">
          <Flame className="mr-1" />
          Tab 1
        </TabsTrigger>
        <TabsTrigger value="tab2">
          <Cloud className="mr-1" />
          Tab 2
        </TabsTrigger>
        <TabsTrigger value="tab3">
          <Code className="mr-1" />
          Tab 3
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="p-4 text-sm">Tab 1</div>
      </TabsContent>
      <TabsContent value="tab2">
        <div className="p-4 text-sm">Tab 2</div>
      </TabsContent>
      <TabsContent value="tab3">
        <div className="p-4 text-sm">Tab 3</div>
      </TabsContent>
    </Tabs>
  ),
}

export const UnderlineTabsPerfectMatch: StoryObj = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList unstyled className="flex gap-6 bg-transparent">
        <TabsTrigger
          unstyled
          value="tab1"
          className="relative pb-2 text-sm font-medium text-gray-400 data-[state=active]:text-black data-[state=active]:border-b-[4px] data-[state=active]:border-blue-500"
        >
          Menu TEXT
        </TabsTrigger>
        <TabsTrigger
          unstyled
          value="tab2"
          className="relative pb-2 text-sm font-medium text-gray-400 data-[state=active]:text-black data-[state=active]:border-b-[4px] data-[state=active]:border-blue-500"
        >
          Menu TEXT
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tab1" className="pt-4 text-sm">
        탭 1의 내용입니다.
      </TabsContent>
      <TabsContent value="tab2" className="pt-4 text-sm">
        탭 2의 내용입니다.
      </TabsContent>
    </Tabs>
  ),
}
