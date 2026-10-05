import type { CheckboxProps } from "@/shared/model/uiTypes"

export function Checkbox({ id, checked, onChange, className, disabled }: CheckboxProps) {
  return (
    <label>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className={className}
        disabled={disabled}
      />
    </label>
  )
}
