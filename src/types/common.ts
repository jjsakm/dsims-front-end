export type FormFieldValue =
  | string
  | string[]
  | number
  | boolean
  | File
  | null
  | object;

export interface SelectItem {
  label: string;
  value: string | number;
}
