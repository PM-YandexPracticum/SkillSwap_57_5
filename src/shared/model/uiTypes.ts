export type ComboboxOptions = {
  value: string
  label: string
}

export type ComboboxProps = {
  value: string
  options: ComboboxOptions[]
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  ariaLabel?: string
  className?: string
  disabled?: boolean
  visibleItemsCount?: number
  showClearButton?: boolean
}
