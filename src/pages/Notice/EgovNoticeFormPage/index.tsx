import React, {useEffect, useState} from "react";
import {NOTICE_BBS_ID} from "@/config";
import {useNavigate, useParams} from "react-router";
import {
  createNoticeItem,
  getNoticeItem,
  modifyNoticeItem,
  noticeFormVaildator,
} from "@/services/noticeService";
import useNotifications from "@/hooks/useNotifications/useNotifications";
import CODE from "@/constants/code";
import type {NoticeFormState, NoticeListItem} from "@/types/notice";
import PageContainer from "@/components/AgGridContainer/PageContainer.tsx";
import EgovNoticeForm from "./EgovNoticeForm";
import type {FormFieldValue} from "@/types/common";
import {Alert, Box, CircularProgress} from "@mui/material";
import URL from "@/constants/url";

export default function EgovNoticeFormPage() {
  const navigate = useNavigate();
  const notifications = useNotifications();
  const {nttId} = useParams();

  const bbsId = NOTICE_BBS_ID;
  const [mode, setMode] = useState(null);

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // const [boardAttachFiles, setBoardAttachFiles] = useState();
  const [formState, setFormState] = React.useState<NoticeFormState>(() => ({
    values: {},
    errors: {},
  }));
  const formValues = formState.values;
  const formErrors = formState.errors;

  const loadData = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const resp = await getNoticeItem({
        bbsId,
        nttId: nttId?.toString() || "",
      });
      setFormState({values: resp, errors: {}});
      // setBoardAttachFiles(resp.result.resultFiles);
    } catch (viewDataError) {
      setError(viewDataError as Error);
    }
    setIsLoading(false);
  };

  const initMode = () => {
    const hasId = nttId != null && !Number.isNaN(Number(nttId));

    if (hasId) {
      setMode(CODE.MODE_MODIFY);
      loadData();
    } else {
      setMode(CODE.MODE_CREATE);
      setIsLoading(false);
      return;
    }
  };

  useEffect(() => {
    initMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFormValues = React.useCallback(
    (newFormValues: Partial<NoticeFormState["values"]>) => {
      setFormState((previousState) => ({
        ...previousState,
        values: newFormValues,
      }));
    },
    []
  );

  const setFormErrors = React.useCallback(
    (newFormErrors: Partial<NoticeFormState["errors"]>) => {
      setFormState((previousState) => ({
        ...previousState,
        errors: newFormErrors,
      }));
    },
    []
  );

  const handleFormFieldChange = React.useCallback(
    (name: keyof NoticeFormState["values"], value: FormFieldValue) => {
      const validateField = async (
        values: Partial<NoticeFormState["values"]>
      ) => {
        const {issues} = noticeFormVaildator(values);
        setFormErrors({
          ...formErrors,
          [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
        });
      };

      const newFormValues = {...formValues, [name]: value};

      setFormValues(newFormValues);
      validateField(newFormValues);
    },
    [formValues, formErrors, setFormErrors, setFormValues]
  );

  const createData = React.useCallback(
    async (formData: FormData) => {
      try {
        await createNoticeItem(formData);

        notifications.show("생성 완료.", {
          severity: "success",
          autoHideDuration: 3000,
        });

        navigate(URL.NOTICE_LIST);
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
    async (formData: FormData) => {
      try {
        await modifyNoticeItem({
          nttId: nttId?.toString() ?? "",
          formData,
        });

        notifications.show("생성 완료.", {
          severity: "success",
          autoHideDuration: 3000,
        });

        navigate(URL.NOTICE_LIST);
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
    [nttId, notifications, navigate]
  );

  const handleSubmit = React.useCallback(async () => {
    const {issues} = noticeFormVaildator(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(
          issues.map((issue) => [issue.path?.[0], issue.message])
        )
      );
      return;
    }
    setFormErrors({});

    const formData = new FormData();

    // 필요한 필드만 FormData 로 변환
    const castValues = formValues as Partial<Omit<NoticeListItem, "id">>;
    Object.entries(castValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (mode === CODE.MODE_CREATE) {
      await createData(formData);
    } else {
      await updatedData(formData);
    }
  }, [formValues, setFormErrors, mode, createData, updatedData]);

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
        <CircularProgress/>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{flexGrow: 1}}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  const pageTitle = `공지사항 ${mode}`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        {title: "알림마당", path: "/notice/list"},
        {title: pageTitle},
      ]}
    >
      <EgovNoticeForm
        mode={mode}
        isEditMode={mode}
        formState={formState}
        // boardAttachFiles={boardAttachFiles}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
