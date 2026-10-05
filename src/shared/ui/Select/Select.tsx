import type { SelectProps } from '@/shared/model/uiTypes'

export function Select({
  id,
  children,
  value,
  onChange,
  className,
  disabled,
  required,
  ariaLabel,
}: SelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={className}
      disabled={disabled}
      required={required}
      aria-label={ariaLabel}
    >
      {children}
    </select>
  )
}
