import React from "react";
import {NOTICE_BBS_ID} from "@/config";
import {useParams} from "react-router";
import {noticeFormVaildator} from "@/services/noticeService";
import CODE from "@/constants/code";
import type {NoticeFormState, NoticeListItem} from "@/types/notice";
import PageContainer from "@/components/AgGridContainer/PageContainer.tsx";
import {useFormStateHandlers} from "@/hooks/InputStateHandlers/useFormStateHandlers";

import PageStatus from "@/components/PageStatus";
import {useNoticeFormQueries} from "@/pages/Notice/useNoticeFormQueries";
import {
  Box,
  Button,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import {useInputStateHandlers} from "@/hooks/InputStateHandlers/useInputStateHandlers";

export default function EgovNoticeFormPage() {
  const {nttId} = useParams();

  const bbsId = NOTICE_BBS_ID;
  const hasId = nttId != null && !Number.isNaN(Number(nttId));
  const mode = hasId ? CODE.MODE_MODIFY : CODE.MODE_CREATE;

  // 폼 상태 훅
  const {formState, setFormValues, setFormErrors, handleFormFieldChange} =
    useFormStateHandlers<NoticeFormState["values"]>(
      {}, // 초기값
      noticeFormVaildator // 이 폼에서 쓸 validator
    );
  const formValues = formState.values;
  const formErrors = formState.errors;

  const {handleTextFieldChange} = useInputStateHandlers<
    NoticeFormState["values"]
  >(handleFormFieldChange);

  // 비즈니스 로직 훅
  const {
    detailData,
    isLoading,
    error,
    createData,
    updatedData,
    isSubmitting,
  } = useNoticeFormQueries({
    bbsId,
    nttId: nttId?.toString(),
    hasId,
  });

  // 조회 데이터 → 폼 값 반영
  React.useEffect(() => {
    if (detailData) {
      setFormValues(detailData);
    }
  }, [detailData, setFormValues]);

  // 검증 전용 함수
  const validateForm = React.useCallback(() => {
    const {issues} = noticeFormVaildator(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(
          issues.map((issue) => [issue.path?.[0], issue.message])
        )
      );
      return false;
    }
    setFormErrors({});
    return true;
  }, [formValues, setFormErrors]);

  // 실제 submit 함수
  const handleSubmit = React.useCallback(async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

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
  }, [validateForm, formValues, mode, createData, updatedData]);

  if (isLoading || error) {
    return <PageStatus isLoading={isLoading} error={error}/>;
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
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
      >
        <FormGroup>
          <Table size="small" aria-label="공지사항 등록/수정">
            <TableBody>
              {/* 제목 */}
              <TableRow>
                <TableCell>제목</TableCell>
                <TableCell colSpan={5}>
                  <TextField
                    id="nttSj"
                    name="nttSj"
                    value={formValues.nttSj ?? ""}
                    onChange={handleTextFieldChange}
                    error={!!formErrors.nttSj}
                    helperText={formErrors.nttSj ?? " "}
                    fullWidth
                  />
                </TableCell>
              </TableRow>

              {/* 내용 */}
              <TableRow>
                <TableCell>내용</TableCell>
                <TableCell colSpan={5}>
                  <TextField
                    id="nttCn"
                    name="nttCn"
                    value={formValues.nttCn ?? ""}
                    onChange={handleTextFieldChange}
                    error={!!formErrors.nttCn}
                    helperText={formErrors.nttCn ?? " "}
                    multiline
                    minRows={8}
                    fullWidth
                  />
                </TableCell>
              </TableRow>

              {/* 첨부파일 (필요 시 주석 해제하여 사용) */}
              {/*
              <TableRow>
                <TableCell>
                  첨부파일
                </TableCell>
                <TableCell colSpan={5}>
                  <Box sx={{ mt: 1 }}>
                    <EgovAttachFile mode={mode} boardAttachFiles={boardAttachFiles} />
                  </Box>
                </TableCell>
              </TableRow>
              */}
            </TableBody>
          </Table>
        </FormGroup>
        <Button type="submit" variant="contained" loading={isSubmitting}>
          {mode === CODE.MODE_CREATE ? "등록" : "수정"}
        </Button>
      </Box>
    </PageContainer>
  );
}
