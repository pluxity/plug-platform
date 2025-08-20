import React from 'react'

export type GroupSearchItemKeyGetter<T> = (item: T, groupIndex: number, itemIndex: number) => React.Key

export interface GroupSearchGroup<T> {
  heading: string
  items: T[]
}

export interface GroupSearchFormProps<T> {
  // Controlled input value and change handler
  value: string
  onValueChange: (value: string) => void

  // Grouped results provided by the parent (already filtered)
  groups: GroupSearchGroup<T>[]

  // Render and select
  renderItem: (item: T, context: { group: GroupSearchGroup<T>; groupIndex: number; itemIndex: number }) => React.ReactNode
  onSelect?: (item: T, context: { group: GroupSearchGroup<T>; groupIndex: number; itemIndex: number }) => void

  // Keys
  getItemKey?: GroupSearchItemKeyGetter<T>

  // UI
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  dropdownClassName?: string
  showCount?: boolean

  // Open state (controlled or uncontrolled)
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
