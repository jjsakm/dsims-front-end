import * as React from "react";
import { useNavigate, useParams } from "react-router";
import useNotifications from "@/hooks/useNotifications";
import DocClassificationForm from "./DigitalDocForm";
import PageContainer from "@/components/PageContainer";
import type { DigitalDoc, DigitalDocFormState } from "@/types/digitalDoc";
import {
  createDigitalDocData,
  digitalDocFormValidator,
  getDigitalDocData,
  updateDigitalDocData,
} from "@/services/digitalDocService";
import URL from "@/constants/url";
import { useFormStateHandlers } from "@/hooks/InputStateHandlers/useFormStateHandlers";
import PageStatus from "@/components/PageStatus";

const INITIAL_FORM_VALUES: Partial<DigitalDocFormState["values"]> = {
  // useYn: "N",
};

export default function DigitalDocFormPage() {
  const navigate = useNavigate();
  const notifications = useNotifications();
  const { docId } = useParams();

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const { formState, setFormValues, setFormErrors, handleFormFieldChange } =
    useFormStateHandlers<DigitalDocFormState["values"]>(
      INITIAL_FORM_VALUES, // 초기값
      digitalDocFormValidator // 이 폼에서 쓸 validator
    );
  const formValues = formState.values;

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const viewData = await getDigitalDocData(Number(docId));

      setFormValues(viewData);
    } catch (viewDataError) {
      setError(viewDataError as Error);
    }
    setIsLoading(false);
  }, [docId, setFormValues]);

  React.useEffect(() => {
    if (!docId) {
      setIsLoading(false);
      return;
    }

    loadData();
  }, [docId, loadData]);

  const createData = React.useCallback(
    async (formValues: Partial<DigitalDocFormState["values"]>) => {
      try {
        await createDigitalDocData(formValues as Omit<DigitalDoc, "id">);
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
    [navigate, notifications]
  );

  const updatedData = React.useCallback(
    async (
      docId: number,
      formValues: Partial<DigitalDocFormState["values"]>
    ) => {
      try {
        const updatedData = await updateDigitalDocData(
          docId,
          formValues as Partial<Omit<DigitalDoc, "id">>
        );
        setFormValues(updatedData);
        notifications.show("생성 완료.", {
          severity: "success",
          autoHideDuration: 3000,
        });
      } catch (editError) {
        notifications.show(
          `데이터 생성 실패. 사유: ${(editError as Error).message}`,
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
    const { issues } = digitalDocFormValidator(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(
          issues.map((issue) => [issue.path?.[0], issue.message])
        )
      );
      return;
    }
    setFormErrors({});

    const isEditMode = Boolean(docId);
    if (isEditMode) {
      await updatedData(Number(docId), formValues);
    } else {
      await createData(formValues);
    }
  }, [formValues, setFormErrors, docId, createData, updatedData]);

  if (isLoading || error) {
    return <PageStatus isLoading={isLoading} error={error} />;
  }
  const pageTitle = docId ? "수정" : "등록";

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: "문서고 관리", path: "/docClassification/list" },
        { title: "문서전자 관리", path: "/docClassification/list" },
        { title: pageTitle },
      ]}
    >
      <DocClassificationForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
