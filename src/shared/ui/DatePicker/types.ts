export interface DatePickerProps {
  id: string
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  disabled?: boolean
  hasError?: boolean
}
