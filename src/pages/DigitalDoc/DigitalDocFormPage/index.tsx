import * as React from "react";
import { useNavigate, useParams } from "react-router";
import useNotifications from "@/hooks/useNotifications";
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
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import MuiSelect from "@/components/Elements/MuiSelect";
import { useInputStateHandlers } from "@/hooks/InputStateHandlers/useInputStateHandlers";
import {
  HorizontalTableCreate,
  type HorizontalTableRow,
} from "@/components/Table/HorizontalTable";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

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
      INITIAL_FORM_VALUES,
      digitalDocFormValidator
    );

  const formValues = formState.values;
  const formErrors = formState.errors;

  const {
    handleTextFieldChange,
    handleSelectFieldChange,
    handleRadioFieldChange,
    handleDateFieldChange,
  } = useInputStateHandlers<DigitalDocFormState["values"]>(
    handleFormFieldChange
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileButtonClick = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFormFieldChange("fileName", file.name);
        event.target.value = "";
      }
    },
    [handleFormFieldChange]
  );

  const handleBack = React.useCallback(() => {
    navigate(URL.DIGITAL_DOC_LIST);
  }, [navigate]);

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
        navigate(URL.DIGITAL_DOC_LIST);
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

  const updateData = React.useCallback(
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

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

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

      setIsSubmitting(true);
      try {
        const isEditMode = Boolean(docId);
        if (isEditMode) {
          await updateData(Number(docId), formValues);
        } else {
          await createData(formValues);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, setFormErrors, docId, createData, updateData]
  );

  if (isLoading || error) {
    return <PageStatus isLoading={isLoading} error={error} />;
  }

  const pageTitle = docId ? "수정" : "등록";

  const sampleData: HorizontalTableRow[] = [
    {
      groups: [
        {
          label: "문서분류",
          contentColSpan: 7,
          renderInput: () => (
            <Stack direction="row" spacing={1}>
              <MuiSelect
                id="largeCategory"
                placeholder="대분류"
                items={[{ value: "01", label: "피해구제" }]}
                value={formValues.largeCategory ?? ""}
                error={formErrors.largeCategory}
                onChange={handleSelectFieldChange}
              />
              <MuiSelect
                id="midCategory"
                placeholder="중분류"
                items={[
                  { value: "01", label: "접수서류" },
                  { value: "02", label: "신청자 제출서류" },
                  { value: "03", label: "직원보완자료" },
                ]}
                value={formValues.midCategory ?? ""}
                error={formErrors.midCategory}
                onChange={handleSelectFieldChange}
              />
              <MuiSelect
                id="smallCategory"
                placeholder="소분류"
                items={[
                  { value: "01", label: "사망 신청" },
                  { value: "02", label: "이전문서" },
                ]}
                value={formValues.smallCategory ?? ""}
                error={formErrors.smallCategory}
                onChange={handleSelectFieldChange}
              />
            </Stack>
          ),
        },
      ],
    },
    {
      groups: [
        {
          label: "문서번호",
          contentColSpan: 7,
          renderInput: () => (
            <TextField
              fullWidth
              id="docNo"
              name="docNo"
              placeholder="문서번호"
              value={formValues.docNo ?? ""}
              onChange={handleTextFieldChange}
              error={!!formErrors.docNo}
              helperText={formErrors.docNo ?? " "}
              size="small"
            />
          ),
        },
      ],
    },
    {
      groups: [
        {
          label: "문서제목",
          contentColSpan: 7,
          renderInput: () => (
            <TextField
              fullWidth
              id="docTitle"
              name="docTitle"
              placeholder="문서제목"
              value={formValues.docTitle ?? ""}
              onChange={handleTextFieldChange}
              error={!!formErrors.docTitle}
              helperText={formErrors.docTitle ?? " "}
              size="small"
            />
          ),
        },
      ],
    },
    {
      groups: [
        {
          label: "수집일자",
          renderInput: () => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="수집일자"
                value={
                  formValues.collectDate
                    ? dayjs(formValues.collectDate as string | Dayjs)
                    : null
                }
                onChange={handleDateFieldChange("collectDate")}
              />
            </LocalizationProvider>
          ),
        },
        {
          label: "보존연한",
          renderInput: () => (
            <Stack direction="row" spacing={1}>
              <MuiSelect
                id="retentionType"
                placeholder="직접입력"
                items={[
                  { value: "6m", label: "6개월" },
                  { value: "1y", label: "1년" },
                  { value: "5y", label: "5년" },
                ]}
                value={formValues.retentionType ?? ""}
                error={formErrors.retentionType}
                onChange={handleSelectFieldChange}
              />
              <TextField
                id="retentionPeriod"
                name="retentionPeriod"
                placeholder="6개월"
                value={formValues.retentionPeriod ?? ""}
                onChange={handleTextFieldChange}
                error={!!formErrors.retentionPeriod}
                helperText={formErrors.retentionPeriod ?? " "}
                size="small"
                sx={{ width: 140 }}
              />
            </Stack>
          ),
        },
      ],
    },
    {
      groups: [
        {
          label: "종료일자",
          contentColSpan: 7,
          renderInput: () => (
            <Stack direction="row" spacing={1} alignItems="center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="종료일자"
                  value={
                    formValues.endDate
                      ? dayjs(formValues.endDate as string | Dayjs)
                      : null
                  }
                  onChange={handleDateFieldChange("endDate")}
                />
              </LocalizationProvider>
              <Typography variant="body2" color="text.secondary">
                * 보존연한을 직접 입력하신 경우 종료일자를 달력에서 선택하여
                입력해 주세요.
              </Typography>
            </Stack>
          ),
        },
      ],
    },
    {
      groups: [
        {
          label: "비고",
          contentColSpan: 7,
          renderInput: () => (
            <TextField
              fullWidth
              id="remark"
              name="remark"
              placeholder="비고"
              value={formValues.remark ?? ""}
              onChange={handleTextFieldChange}
              error={!!formErrors.remark}
              helperText={formErrors.remark ?? " "}
              multiline
              minRows={3}
              size="small"
            />
          ),
        },
      ],
    },
    {
      groups: [
        {
          label: "파일업로드",
          contentColSpan: 7,
          renderInput: () => (
            <Stack direction="row" spacing={2} alignItems="center">
              <RadioGroup
                row
                name="uploadType"
                value={formValues.uploadType ?? ""}
                onChange={handleRadioFieldChange}
              >
                <FormControlLabel
                  value="document"
                  control={<Radio size="small" />}
                  label="문서"
                />
                <FormControlLabel
                  value="file"
                  control={<Radio size="small" />}
                  label="파일"
                />
              </RadioGroup>

              <TextField
                id="fileName"
                name="fileName"
                placeholder="전자문서파일.pdf"
                value={formValues.fileName ?? ""}
                size="small"
                slotProps={{ input: { readOnly: true } }}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleFileButtonClick}
              >
                파일
              </Button>
            </Stack>
          ),
        },
      ],
    },
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
      <HorizontalTableCreate
        rows={sampleData}
        tableAriaLabel="전자문서 등록 폼 테이블"
      />
      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
        <Button variant="outlined" onClick={handleBack} disabled={isSubmitting}>
          취소
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? `${pageTitle} 중...` : pageTitle}
        </Button>
      </Stack>
    </Box>
  );
}
