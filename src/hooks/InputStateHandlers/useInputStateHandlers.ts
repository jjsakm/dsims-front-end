import * as React from "react";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { FormFieldValue } from "@/types/common";
import type { Dayjs } from "dayjs";

export function useInputStateHandlers<TValues>(
  onFieldChange: (name: keyof TValues, value: FormFieldValue) => void
) {
  const handleTextFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      onFieldChange(name as keyof TValues, value);
    },
    [onFieldChange]
  );

  const handleSelectFieldChange = React.useCallback(
    (event: SelectChangeEvent) => {
      const { name, value } = event.target;
      onFieldChange(name as keyof TValues, value);
    },
    [onFieldChange]
  );

  const handleRadioFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      onFieldChange(name as keyof TValues, value);
    },
    [onFieldChange]
  );

  const handleCheckboxFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      const { name } = event.target;
      onFieldChange(name as keyof TValues, checked);
    },
    [onFieldChange]
  );

  const handleDateFieldChange = React.useCallback(
    (name: keyof TValues) =>
      (value: Dayjs | null) => {
        const normalizedValue =
          value && value.isValid() ? value.toISOString() : null;

        onFieldChange(name, normalizedValue as FormFieldValue);
      },
    [onFieldChange]
  );

  return {
    handleTextFieldChange,
    handleSelectFieldChange,
    handleRadioFieldChange,
    handleCheckboxFieldChange,
    handleDateFieldChange,
  };
}

export function useSearchStateHandlers<TValues>(
  initialValues: Partial<TValues> = {}
) {
  const [values, setValues] = React.useState<Partial<TValues>>(initialValues);

  const handleSearchFieldChange = React.useCallback(
    (name: keyof TValues, value: FormFieldValue) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handlers = useInputStateHandlers<TValues>(handleSearchFieldChange);

  return {
    values, // 현재 값 (예: searchValues)
    setValues, // 필요 시 직접 세팅도 가능
    handleSearchFieldChange, // name, value 형태로 직접 쓸 수도 있고
    ...handlers, // TextField / Select / Radio / Checkbox용 onChange 묶음
  };
}
