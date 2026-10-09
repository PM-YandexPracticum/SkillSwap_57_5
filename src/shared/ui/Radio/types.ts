export type RadioProps = {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  name: string
  value: string
  className?: string
  disabled?: boolean
  label: string
}
