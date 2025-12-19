import * as React from "react";
import { useNavigate, useParams } from "react-router";
import useNotifications from "@/hooks/useNotifications";
import {
  getDocClassificationData,
  updateDocClassificationData,
  docClassificationvalidator,
} from "@/services/docClassificationService";
import DocClassificationForm from "./DocClassificationForm";
import PageContainer from "@/components/AgGridContainer/PageContainer.tsx";
import { createDocClassificationData } from "@/services/docClassificationService";
import type {
  DocClassification,
  DocClassificationFormState,
} from "@/types/docClassification";
import URL from "@/constants/url";
import { useFormStateHandlers } from "@/hooks/InputStateHandlers/useFormStateHandlers";
import PageStatus from "@/components/PageStatus";

const INITIAL_FORM_VALUES: Partial<DocClassificationFormState["values"]> = {
  useEn: "N",
};

export default function DocClassificationFormPage() {
  const navigate = useNavigate();
  const notifications = useNotifications();
  const { docClassificationId } = useParams();

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const { formState, setFormValues, setFormErrors, handleFormFieldChange } =
    useFormStateHandlers<DocClassificationFormState["values"]>(
      INITIAL_FORM_VALUES, // 초기값
      docClassificationvalidator // 이 폼에서 쓸 validator
    );
  const formValues = formState.values;

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const viewData = await getDocClassificationData(
        Number(docClassificationId)
      );

      setFormValues(viewData);
    } catch (viewDataError) {
      setError(viewDataError as Error);
    }
    setIsLoading(false);
  }, [docClassificationId, setFormValues]);

  React.useEffect(() => {
    if (!docClassificationId) {
      setIsLoading(false);
      return;
    }

    loadData();
  }, [docClassificationId, loadData]);

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
        setFormValues(updatedData);

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
    [notifications, setFormValues]
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

  if (isLoading || error) {
    return <PageStatus isLoading={isLoading} error={error} />;
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
