import * as React from "react";
import type { FormFieldValue } from "@/types/common";

// 필드별 에러 타입
type FormErrors<TValues> = Partial<Record<keyof TValues, string>>;

// validator 가 반환하는 issue 형태 (zod 스타일 가정)
type ValidatorIssue = {
  path?: (string | number)[];
  message: string;
};

type ValidatorResult = {
  issues?: ValidatorIssue[];
};

type ValidatorFn<TValues> = (values: Partial<TValues>) => ValidatorResult;

// 훅에서 관리하는 공통 formState 타입
export interface GenericFormState<TValues> {
  values: Partial<TValues>;
  errors: FormErrors<TValues>;
}

/**
 * 어떤 값 타입이든(TValues) + 원하는 validator 를 넣어서
 * 공통 폼 상태 + 필드 변경 + 단일 필드 검증까지 제공하는 훅
 */
export function useFormStateHandlers<TValues>(
  initialValues: Partial<TValues> = {},
  validator?: ValidatorFn<TValues>
) {
  const [formState, setFormState] = React.useState<GenericFormState<TValues>>({
    values: initialValues,
    errors: {},
  });

  const setFormValues = React.useCallback((newValues: Partial<TValues>) => {
    setFormState((prev) => ({
      ...prev,
      values: newValues,
    }));
  }, []);

  const setFormErrors = React.useCallback((newErrors: FormErrors<TValues>) => {
    setFormState((prev) => ({
      ...prev,
      errors: newErrors,
    }));
  }, []);

  // 공통 onFieldChange: name, value 받아서 값 변경 + 해당 필드만 검증
  const handleFormFieldChange = React.useCallback(
    (name: keyof TValues, value: FormFieldValue) => {
      setFormState((prev) => {
        const newValues: Partial<TValues> = {
          ...prev.values,
          [name]: value,
        };

        let newErrors = prev.errors;

        if (validator) {
          const { issues } = validator(newValues);

          const fieldError = issues?.find(
            (issue) => issue.path?.[0] === name
          )?.message;

          newErrors = {
            ...prev.errors,
            [name]: fieldError,
          };
        }

        return {
          values: newValues,
          errors: newErrors,
        };
      });
    },
    [validator]
  );

  return {
    formState,
    setFormState,
    setFormValues,
    setFormErrors,
    handleFormFieldChange, // ← 이걸 자식에게 onFieldChange 로 넘기면 됨
  };
}
