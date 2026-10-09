export type CheckboxProps = {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  disabled?: boolean
  label: string
}
