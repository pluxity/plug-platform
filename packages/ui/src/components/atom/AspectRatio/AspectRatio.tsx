import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { AspectRatioProps } from "./AspectRatio.types";

function AspectRatio({
  ...props
}: AspectRatioProps) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

AspectRatio.displayName = "AspectRatio";

export { AspectRatio }
