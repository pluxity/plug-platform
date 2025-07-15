import { useTheme } from "next-themes";
import { Toaster, ToasterProps } from "sonner";
import { ToastProps } from "./Toast.types";

function Toast ({ ...props }: ToastProps) {
  const { theme = "system" } = useTheme();

  return (
    <Toaster
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      {...props}
    />
  )
};

export { Toast };
