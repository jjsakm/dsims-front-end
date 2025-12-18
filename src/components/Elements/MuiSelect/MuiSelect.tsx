import {FormControl, FormHelperText, InputLabel, MenuItem, Select, type SelectProps,} from "@mui/material";
import type {Ref} from "react";
import Typography from "@mui/material/Typography";

type MuiSelectProps = {
  inputRef?: Ref<HTMLSelectElement | null>;
  id: string;
  label?: string;
  placeholder?: string;
  items?: { value: string; label: string }[];
  defaultValue?: string;
  value?: string;
  error?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function MuiSelect(props: MuiSelectProps) {
  const {
    inputRef,
    id,
    label,
    placeholder,
    items,
    defaultValue,
    value,
    error,
    onChange,
  } = props;
  return (
    <FormControl error={!!error} fullWidth>
      <InputLabel id={id + "-label"}>{label}</InputLabel>
      <Select
        fullWidth
        inputRef={inputRef}
        id={id}
        labelId={id + "-label"}
        name={id}
        label={label}
        defaultValue={defaultValue}
        value={value ?? ""}
        onChange={onChange as SelectProps["onChange"]}
        displayEmpty
        renderValue={(selected) =>
          selected === ""
            ? placeholder ?? ""
            : items?.find((i) => i.value === selected)?.label ?? ""
        }
        sx={{
          '& .MuiSelect-select': {
            display: 'block !important',
          }
        }}
      >
        {/* placeholder 용 빈 값 아이템 */}
        <MenuItem value="">
          <Typography noWrap>{placeholder ?? "선택하세요"}</Typography>
        </MenuItem>

        {items?.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            <Typography noWrap>
              {item.label}
            </Typography>
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{error ?? " "}</FormHelperText>
    </FormControl>
  );
}
