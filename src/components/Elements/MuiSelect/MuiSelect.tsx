import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
} from "@mui/material";

type MuiSelectProps = {
  id: string;
  label?: string;
  placeholder?: string;
  items?: { value: string; label: string }[];
  value?: string;
  error?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function MuiSelect(props: MuiSelectProps) {
  const { id, label, placeholder, items, value, error, onChange } = props;
  return (
    <FormControl error={!!error} fullWidth>
      <InputLabel id={id + "-label"}>{label}</InputLabel>
      <Select
        fullWidth
        id={id}
        labelId={id + "-label"}
        name={id}
        label={label}
        value={value ?? ""}
        onChange={onChange as SelectProps["onChange"]}
        displayEmpty
        renderValue={(selected) =>
          selected === ""
            ? placeholder ?? ""
            : items?.find((i) => i.value === selected)?.label ?? ""
        }
      >
        {/* placeholder 용 빈 값 아이템 */}
        <MenuItem value="">
          <em>{placeholder ?? "선택하세요"}</em>
        </MenuItem>

        {items?.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{error ?? " "}</FormHelperText>
    </FormControl>
  );
}
