import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { CollapsibleProps, CollapsibleTriggerProps, CollapsibleContentProps } from "./Collapsible.types";

function Collapsible({
  ...props
}: CollapsibleProps) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

Collapsible.displayName = "Collapsible";  

function CollapsibleTrigger({
  ...props
}: CollapsibleTriggerProps) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

CollapsibleTrigger.displayName = "CollapsibleTrigger";

function CollapsibleContent({
  ...props
}: CollapsibleContentProps) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  )
}

CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
