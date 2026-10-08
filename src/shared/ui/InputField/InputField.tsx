import type { InputFieldProps } from '../../model/uiTypes';
import { Input } from '../Input/Input';
import styles from './InputField.module.css';

export const InputField = ({
  id,
  label,
  className,
  ...rest
}: InputFieldProps) => {
  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <Input id={id} {...rest} />
    </div>
  );
};
