export interface MultiSelectProps {
  id: string
  label: string
  options: { value: string; label: string }[]
  selectedValues: string[]
  onChange: (selectedValues: string[]) => void
  placeholder?: string
  className?: string
}
