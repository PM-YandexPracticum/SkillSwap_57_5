import type { CheckboxProps } from './types'

export function Checkbox({ id, checked, onChange, className, disabled, label }: CheckboxProps) {
  return (
    <>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className={className}
        disabled={disabled}
      />

      <label htmlFor={id}>{label}</label>
    </>
  )
}
