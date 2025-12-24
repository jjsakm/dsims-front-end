// DatePickerKr.tsx
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

type Props = {
  // 비즈니스/RHF에서 사용하는 값: 'YYYYMMDD' 또는 ''
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  // 필요하면 여기서 직접 추가 (size, variant 등)
};

export function DatePickerKr({ value, onChange, label, disabled }: Props) {
  const dayjsValue = value ? dayjs(value, "YYYYMMDD") : null;

  return (
    <DatePicker
      label={label}
      format="YYYY-MM-DD"
      disabled={disabled}
      value={dayjsValue}
      onChange={(date) => onChange(date ? dayjs(date).format("YYYYMMDD") : "")}
    />
  );
}
