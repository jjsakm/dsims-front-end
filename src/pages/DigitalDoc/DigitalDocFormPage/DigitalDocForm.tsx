import * as React from "react";
import {
  Box,
  Button,
  FormGroup,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Typography,
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Stack,
} from "@mui/material";
import { type SelectChangeEvent } from "@mui/material/Select";
import { useNavigate } from "react-router";
import MuiSelect from "@/components/Elements/MuiSelect";
import type { DigitalDocFormState } from "@/types/digitalDoc";
import type { FormFieldValue } from "@/types/common";
import URL from "@/constants/url";

export type DigitalDocProps = {
  formState: DigitalDocFormState;
  onFieldChange: (
    name: keyof DigitalDocFormState["values"],
    value: FormFieldValue
  ) => void;
  onSubmit: (
    formValues: Partial<DigitalDocFormState["values"]>
  ) => Promise<void>;
};

export default function DigitalDocForm(props: DigitalDocProps) {
  const { formState, onFieldChange, onSubmit } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileButtonClick = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onFieldChange(
          "fileName" as keyof DigitalDocFormState["values"],
          file.name
        );
        // 선택 후 같은 파일을 다시 선택할 수 있도록 value 초기화
        event.target.value = "";
      }
    },
    [onFieldChange]
  );

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
        event.target.name as keyof DigitalDocFormState["values"],
        event.target.value
      );
    },
    [onFieldChange]
  );

  const handleSelectFieldChange = React.useCallback(
    (event: SelectChangeEvent) => {
      onFieldChange(
        event.target.name as keyof DigitalDocFormState["values"],
        event.target.value
      );
    },
    [onFieldChange]
  );

  const handleRadioFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof DigitalDocFormState["values"],
        event.target.value
      );
    },
    [onFieldChange]
  );

  const handleBack = React.useCallback(() => {
    navigate(URL.DOC_CLASSIFICATION_LIST);
  }, [navigate]);

  React.useEffect(() => {
    if (formValues) {
      console.log(22, formValues);
    }
  }, [formValues]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      sx={{ width: "100%" }}
    >
      <FormGroup>
        <Table
          size="small"
          sx={{ width: "100%" }}
          aria-label="전자문서 등록 폼 테이블"
        >
          <TableBody>
            {/* 문서분류 */}
            <TableRow>
              <TableHead>문서분류</TableHead>
              <TableCell colSpan={3}>
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
              </TableCell>
            </TableRow>

            {/* 문서번호 */}
            <TableRow>
              <TableHead>문서번호</TableHead>
              <TableCell colSpan={3}>
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
              </TableCell>
            </TableRow>

            {/* 문서제목 */}
            <TableRow>
              <TableHead>문서제목</TableHead>
              <TableCell colSpan={3}>
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
              </TableCell>
            </TableRow>

            {/* 수집일자 / 보존연한 */}
            <TableRow>
              <TableHead>수집일자</TableHead>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    id="collectDate"
                    name="collectDate"
                    type="date"
                    value={formValues.collectDate ?? ""}
                    onChange={handleTextFieldChange}
                    error={!!formErrors.collectDate}
                    helperText={formErrors.collectDate ?? " "}
                    size="small"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Stack>
              </TableCell>
              <TableHead>보존연한</TableHead>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
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
              </TableCell>
            </TableRow>

            {/* 종료일자 */}
            <TableRow>
              <TableHead>종료일자</TableHead>
              <TableCell colSpan={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formValues.endDate ?? ""}
                    onChange={handleTextFieldChange}
                    error={!!formErrors.endDate}
                    helperText={formErrors.endDate ?? " "}
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                  />

                  <Typography variant="body2">
                    * 보존연한을 직접 입력하신 경우 종료일자를 달력에서 선택하여
                    입력해 주세요.
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>

            {/* 비고 */}
            <TableRow>
              <TableHead>비고</TableHead>
              <TableCell colSpan={3}>
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
              </TableCell>
            </TableRow>

            {/* 파일업로드 */}
            <TableRow>
              <TableHead>파일업로드</TableHead>
              <TableCell colSpan={3}>
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
                    onChange={handleTextFieldChange}
                    error={!!formErrors.fileName}
                    helperText={formErrors.fileName ?? " "}
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
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </FormGroup>
      <Stack direction="row" spacing={2} justifyContent="right">
        <Button variant="contained" onClick={handleBack}>
          취소
        </Button>
        <Button type="submit" variant="contained" loading={isSubmitting}>
          등록
        </Button>
      </Stack>
    </Box>
  );
}
