import clsx from 'clsx'
import type { SearchInputProps } from '../../model/uiTypes';
import { Input } from '../Input';
import styles from './SearchInput.module.css';

export const SearchInput = ({
  id,
  value,
  onChange,
  placeholder,
  className,
  disabled,
  ariaLabel,
}: SearchInputProps) => (
  <div className={clsx(styles.root, className)}>
    <span className={styles.icon}>
    </span>
    <Input
      id={id}
      className={styles.field}
      value={value}
      onChange={onChange}
      type="search"
      placeholder={placeholder}
      disabled={disabled}
      ariaLabel={ariaLabel}
    />
  </div>
);