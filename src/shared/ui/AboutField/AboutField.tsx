import clsx from 'clsx'
import { useRef } from 'react';
import type { AboutFieldProps } from './types';
import { Textarea } from '../Textarea';
import styles from './AboutField.module.css';

export const AboutField = ({
  id,
  value,
  onChange,
  placeholder,
  className,
  disabled,
  maxLength,
  ariaLabel,
}: AboutFieldProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const handleEditClick = () => {
    rootRef.current?.querySelector('textarea')?.focus();
  };

  return (
    <div
      ref={rootRef}
      className={clsx(styles.root, className)}
    >
      <Textarea
        id={id}
        className={styles.field}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        ariaLabel={ariaLabel}
      />
      <button
        type="button"
        className={styles.edit}
        onClick={handleEditClick}
        disabled={disabled}
        aria-label="Редактировать"
      >
      </button>
    </div>
  );
};