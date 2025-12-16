import React from "react";
import {
  Box,
  Button,
  FormGroup,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@mui/material";
import CODE from "@/constants/code";
import type { NoticeFormState } from "@/types/notice";
// import EgovAttachFile from "@/components/EgovAttachFile";

export default function EgovNoticeForm(props) {
  const {
    mode,
    formState,
    // boardAttachFiles,
    onFieldChange,
    onSubmit,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit]
  );

  const handleTextFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof NoticeFormState["values"],
        event.target.value
      );
    },
    [onFieldChange]
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      sx={{
        width: "100%",
        maxHeight: "calc(100vh - 150px)", // 상단 헤더/여백 만큼 빼고
        overflowY: "auto", // 세로 스크롤
      }}
    >
      <FormGroup>
        <Table
          size="small"
          sx={{ width: "100%" }}
          aria-label="공지사항 등록/수정"
        >
          <TableBody>
            {/* 제목 */}
            <TableRow>
              <TableHead>제목</TableHead>
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
              <TableHead>내용</TableHead>
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
                <TableHead>
                  첨부파일
                </TablTableHeadeCell>
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
  );
}
