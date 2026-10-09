import type { RadioProps } from './types'

export function Radio({
  id,
  checked,
  onChange,
  name,
  value,
  className,
  disabled,
  label,
}: RadioProps) {
  return (
    <>
      <input
        id={id}
        type="radio"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        name={name}
        value={value}
        className={className}
        disabled={disabled}
      />

      <label htmlFor={id}>{label}</label>
    </>
  )
}
