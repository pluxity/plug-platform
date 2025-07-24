export interface ModalFormProps {
  children?: React.ReactNode
  className?: string
}

export interface ModalFormItemProps {
  label: string
  children: React.ReactNode
  className?: string
  name?: string
  message?: string
  description?: string
}
