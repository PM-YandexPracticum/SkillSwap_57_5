export interface InputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
}

export interface TextareaProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  ariaLabel?: string;
}

export type SearchInputProps = Omit<InputProps, 'type' | 'required'>;

export type AboutFieldProps = Omit<TextareaProps, 'required'>;