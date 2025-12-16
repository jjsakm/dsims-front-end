import * as React from "react";
import { useNavigate, useParams } from "react-router";
import useNotifications from "@/hooks/useNotifications/useNotifications";
import {
  getDocClassificationData,
  updateDocClassificationData,
  docClassificationvalidator,
} from "@/services/docClassificationService";
import DocClassificationForm from "./DocClassificationForm";
import PageContainer from "@/components/PageContainer";
import { createDocClassificationData } from "@/services/docClassificationService";
import type {
  DocClassification,
  DocClassificationFormState,
} from "@/types/docClassification";
import { Alert, Box, CircularProgress } from "@mui/material";
import type { FormFieldValue } from "@/types/common";
import URL from "@/constants/url";

const INITIAL_FORM_VALUES: Partial<DocClassificationFormState["values"]> = {
  useYn: "N",
};

export default function DocClassificationFormPage() {
  const navigate = useNavigate();
  const notifications = useNotifications();
  const { docClassificationId } = useParams();

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const [formState, setFormState] = React.useState<DocClassificationFormState>(
    () => ({
      values: INITIAL_FORM_VALUES,
      errors: {},
    })
  );
  const formValues = formState.values;
  const formErrors = formState.errors;

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const viewData = await getDocClassificationData(
        Number(docClassificationId)
      );

      setFormState((prev) => ({ ...prev, values: viewData }));
    } catch (viewDataError) {
      setError(viewDataError as Error);
    }
    setIsLoading(false);
  }, [docClassificationId]);

  React.useEffect(() => {
    if (!docClassificationId) {
      setIsLoading(false);
      return;
    }

    loadData();
  }, [docClassificationId, loadData]);

  const setFormValues = React.useCallback(
    (newFormValues: Partial<DocClassificationFormState["values"]>) => {
      setFormState((previousState) => ({
        ...previousState,
        values: newFormValues,
      }));
    },
    []
  );

  const setFormErrors = React.useCallback(
    (newFormErrors: Partial<DocClassificationFormState["errors"]>) => {
      setFormState((previousState) => ({
        ...previousState,
        errors: newFormErrors,
      }));
    },
    []
  );

  const handleFormFieldChange = React.useCallback(
    (
      name: keyof DocClassificationFormState["values"],
      value: FormFieldValue
    ) => {
      const validateField = async (
        values: Partial<DocClassificationFormState["values"]>
      ) => {
        const { issues } = docClassificationvalidator(values);
        setFormErrors({
          ...formErrors,
          [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
        });
      };

      const newFormValues = { ...formValues, [name]: value };

      setFormValues(newFormValues);
      validateField(newFormValues);
    },
    [formValues, formErrors, setFormErrors, setFormValues]
  );

  const createData = React.useCallback(
    async (formValues: Partial<DocClassificationFormState["values"]>) => {
      try {
        await createDocClassificationData(
          formValues as Omit<DocClassification, "id">
        );
        notifications.show("생성 완료.", {
          severity: "success",
          autoHideDuration: 3000,
        });

        navigate(URL.DOC_CLASSIFICATION_LIST);
      } catch (createError) {
        notifications.show(
          `데이터 생성 실패. 사유: ${(createError as Error).message}`,
          {
            severity: "error",
            autoHideDuration: 3000,
          }
        );
        throw createError;
      }
    },
    [notifications, navigate]
  );

  const updatedData = React.useCallback(
    async (
      docClassificationId: number,
      formValues: Partial<DocClassificationFormState["values"]>
    ) => {
      try {
        const updatedData = await updateDocClassificationData(
          docClassificationId,
          formValues as Partial<Omit<DocClassification, "id">>
        );
        setFormState((prev) => ({ ...prev, values: updatedData }));

        notifications.show("수정 완료.", {
          severity: "success",
          autoHideDuration: 3000,
        });
      } catch (editError) {
        notifications.show(
          `데이터 수정 실패. 사유: ${(editError as Error).message}`,
          {
            severity: "error",
            autoHideDuration: 3000,
          }
        );
        throw editError;
      }
    },
    [notifications]
  );

  const handleSubmit = React.useCallback(async () => {
    const { issues } = docClassificationvalidator(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(
          issues.map((issue) => [issue.path?.[0], issue.message])
        )
      );
      return;
    }
    setFormErrors({});

    const isEditMode = Boolean(docClassificationId);
    if (isEditMode) {
      await updatedData(Number(docClassificationId), formValues);
    } else {
      await createData(formValues);
    }
  }, [formValues, setFormErrors, docClassificationId, createData, updatedData]);

  if (isLoading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          m: 1,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  const pageTitle = docClassificationId ? "수정" : "등록";

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: "문서고 관리", path: "/docClassification/list" },
        { title: "문서분류 관리", path: "/docClassification/list" },
        { title: pageTitle },
      ]}
    >
      <DocClassificationForm
        isEditMode={!!docClassificationId}
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
