import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

export interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
    name: TName;
    className?: string;
}

export interface FormItemContextValue {
    id: string
}

export interface FormLabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
    className?: string;
}

export interface FormControlProps extends React.ComponentProps<typeof Slot> {
    children?: React.ReactNode;
}

export interface FormDescriptionProps extends React.ComponentProps<"p"> {
    className?: string;
    children?: React.ReactNode;
}

export interface FormMessageProps extends React.ComponentProps<"p"> {
    className?: string;
    children?: React.ReactNode;
}

export interface FormItemProps extends React.ComponentProps<"div"> {
    className?: string; 
    children?: React.ReactNode;
}
    