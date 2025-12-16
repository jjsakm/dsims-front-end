import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";

type MuiSelectProps = {
  id: string;
  label?: string;
  checked?: boolean;
  error?: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
};

export default function MuiCheckbox(props: MuiSelectProps) {
  const { id, label, checked, error, onChange } = props;

  const handleCheckboxFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange(event, event.target.checked);
  };

  return (
    <FormControl error={!!error}>
      <FormControlLabel
        name={id}
        control={
          <Checkbox
            size="large"
            checked={checked ?? false}
            onChange={handleCheckboxFieldChange}
          />
        }
        label={label}
      />
      <FormHelperText error={!!error}>{error ?? " "}</FormHelperText>
    </FormControl>
  );
}
