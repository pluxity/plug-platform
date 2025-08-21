import React from 'react'

export type GroupSearchItemKeyGetter<T> = (item: T, groupIndex: number, itemIndex: number) => React.Key

export interface GroupSearchGroup<T> {
  heading: string
  items: T[]
}

export interface GroupSearchFormProps<T> {
  value: string
  onValueChange: (value: string) => void
  groups: GroupSearchGroup<T>[]
  renderItem: (item: T, context: { group: GroupSearchGroup<T>; groupIndex: number; itemIndex: number }) => React.ReactNode
  onSelect?: (item: T, context: { group: GroupSearchGroup<T>; groupIndex: number; itemIndex: number }) => void
  getItemKey?: GroupSearchItemKeyGetter<T>
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  dropdownClassName?: string
  showCount?: boolean
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface GroupSearchFormRef {
  open: () => void
  close: () => void
  clear: () => void
  focus: () => void
  blur: () => void
}
