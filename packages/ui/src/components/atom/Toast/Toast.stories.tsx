import type { Meta, StoryObj } from "@storybook/react";
import Toast from "./Toast";
import { toast } from "sonner";

const meta: Meta<typeof Toast> = {
  title: "ATOM/Toast",
  component: Toast,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  render: () => (
    <div className="p-4 space-y-4">
      <Toast />
      <button className="px-4 py-2 rounded bg-black text-white"
        onClick={() => toast("기본 토스트 메시지입니다.")}>
        기본
      </button>
      <button className="px-4 py-2 rounded bg-green-600 text-white"
        onClick={() =>
          toast.success("성공 메시지입니다.", {
            description: "작업이 정상적으로 완료되었습니다.",
          })}>
        성공
      </button>
      <button className="px-4 py-2 rounded bg-red-600 text-white"
        onClick={() =>
          toast.error("오류 발생", {
            description: "문제가 발생했습니다. 다시 시도해주세요.",
          })}>
        에러
      </button>
    </div>
  ),
};

export const CustomStyle: Story = {
  render: () => (
    <div className="p-4 space-y-4">
      <Toast className="bg-black text-white" />
      <button
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show Toast
      </button>
    </div>
  )
}