import type { RadioProps } from '@/shared/model/uiTypes'

export function Radio({ id, checked, onChange, name, value, className, disabled }: RadioProps) {
  return (
    <label>
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
      Radio
    </label>
  )
}
