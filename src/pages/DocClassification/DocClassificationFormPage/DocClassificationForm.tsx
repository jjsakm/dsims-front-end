import * as React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { type SelectChangeEvent } from "@mui/material/Select";
import { useNavigate } from "react-router";
import type { DocClassificationFormState } from "@/types/docClassification";
import MuiSelect from "@/components/Elements/MuiSelect";
import MuiCheckbox from "@/components/Elements/MuiCheckbox";
import type { FormFieldValue } from "@/types/common";
import URL from "@/constants/url";

export interface DocClassificationProps {
  isEditMode?: boolean;
  formState: DocClassificationFormState;
  onFieldChange: (
    name: keyof DocClassificationFormState["values"],
    value: FormFieldValue
  ) => void;
  onSubmit: (
    formValues: Partial<DocClassificationFormState["values"]>
  ) => Promise<void>;
}

export default function DocClassificationForm(props: DocClassificationProps) {
  const { formState, onFieldChange, onSubmit, isEditMode = false } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedCategoryDepth, setSelectedCategoryDepth] = React.useState<
    "large" | "middle" | "small"
  >("large");

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
        event.target.name as keyof DocClassificationFormState["values"],
        event.target.value
      );
    },
    [onFieldChange]
  );

  const handleCheckboxFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onFieldChange(
        event.target.name as keyof DocClassificationFormState["values"],
        checked
      );
    },
    [onFieldChange]
  );

  const handleSelectFieldChange = React.useCallback(
    (event: SelectChangeEvent) => {
      onFieldChange(
        event.target.name as keyof DocClassificationFormState["values"],
        event.target.value
      );
    },
    [onFieldChange]
  );

  const handleBack = React.useCallback(() => {
    navigate(URL.DOC_CLASSIFICATION_LIST);
  }, [navigate]);

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
      <FormGroup>
        <Table
          size="small"
          sx={{ mb: "12px" }}
          aria-label="문서분류 구분 및 기본 정보"
        >
          <TableBody>
            {/* 분류 깊이 선택 (대분류 / 중분류 / 소분류) */}
            <TableRow>
              <TableCell colSpan={2}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    name="categoryDepth"
                    value={selectedCategoryDepth}
                    onChange={(event) =>
                      setSelectedCategoryDepth(
                        event.target.value as "large" | "middle" | "small"
                      )
                    }
                  >
                    <FormControlLabel
                      value="large"
                      control={<Radio size="small" />}
                      label="대분류"
                    />
                    <FormControlLabel
                      value="middle"
                      control={<Radio size="small" />}
                      label="중분류"
                    />
                    <FormControlLabel
                      value="small"
                      control={<Radio size="small" />}
                      label="소분류"
                    />
                  </RadioGroup>
                </FormControl>
              </TableCell>
            </TableRow>

            {/* 대분류 */}
            <TableRow>
              <TableHead>대분류</TableHead>
              <TableCell>
                <Stack direction="row" spacing={2}>
                  <MuiSelect
                    id="largeCategory"
                    items={[{ value: "01", label: "피해구제" }]}
                    value={formValues.largeCategory}
                    error={formErrors.largeCategory}
                    onChange={handleSelectFieldChange}
                  />
                  <TextField
                    value={formValues.largeCategoryMeta ?? ""}
                    onChange={handleTextFieldChange}
                    id="largeCategoryMeta"
                    name="largeCategoryMeta"
                    placeholder="대분류 메타정보"
                    error={!!formErrors.largeCategoryMeta}
                    helperText={formErrors.largeCategoryMeta ?? " "}
                    fullWidth
                  />
                </Stack>
              </TableCell>
            </TableRow>

            {/* 중분류 */}
            <TableRow>
              <TableHead>중분류</TableHead>
              <TableCell>
                <Stack direction="row" spacing={2}>
                  <MuiSelect
                    id="midCategory"
                    items={[
                      { value: "01", label: "접수서류" },
                      { value: "02", label: "신청자 제출서류" },
                      { value: "03", label: "직원보완자료" },
                    ]}
                    value={formValues.midCategory}
                    error={formErrors.midCategory}
                    onChange={handleSelectFieldChange}
                  />
                  <TextField
                    value={formValues.midCategoryMeta ?? ""}
                    onChange={handleTextFieldChange}
                    id="midCategoryMeta"
                    name="midCategoryMeta"
                    placeholder="중분류 메타정보"
                    error={!!formErrors.midCategoryMeta}
                    helperText={formErrors.midCategoryMeta ?? " "}
                    fullWidth
                  />
                </Stack>
              </TableCell>
            </TableRow>

            {/* 소분류 */}
            <TableRow>
              <TableHead>소분류</TableHead>
              <TableCell>
                <TextField
                  value={formValues.smallCategoryMeta ?? ""}
                  onChange={handleTextFieldChange}
                  id="smallCategoryMeta"
                  name="smallCategoryMeta"
                  placeholder="소분류"
                  error={!!formErrors.smallCategoryMeta}
                  helperText={formErrors.smallCategoryMeta ?? " "}
                  fullWidth
                />
                <MuiCheckbox
                  id="hasPersonalInfo"
                  label="개인정보포함"
                  checked={formValues.hasPersonalInfo ?? false}
                  error={formErrors.hasPersonalInfo}
                  onChange={handleCheckboxFieldChange}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {formValues.hasPersonalInfo && (
          <Table size="small" aria-label="개인정보 상세 입력">
            <TableBody>
              {/* 부서명 / 파일명 */}
              <TableRow>
                <TableHead>부서명</TableHead>
                <TableCell>
                  <TextField fullWidth size="small" placeholder="부서명" />
                </TableCell>
                <TableHead>파일명</TableHead>
                <TableCell>
                  <TextField fullWidth size="small" placeholder="파일명" />
                </TableCell>
              </TableRow>

              {/* 보유목적 / 사용부서(내부, 외부) */}
              <TableRow>
                <TableHead>보유목적</TableHead>
                <TableCell>
                  <TextField fullWidth size="small" placeholder="보유목적" />
                </TableCell>
                <TableHead>사용부서(내부, 외부)</TableHead>
                <TableCell>
                  <RadioGroup row>
                    <FormControlLabel
                      value="internal"
                      control={<Radio size="small" />}
                      label="내부"
                    />
                    <FormControlLabel
                      value="external"
                      control={<Radio size="small" />}
                      label="외부"
                    />
                  </RadioGroup>
                </TableCell>
              </TableRow>

              {/* 개인정보 처리방법 / 보유기간 */}
              <TableRow>
                <TableHead>개인정보 처리방법</TableHead>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="개인정보 처리방법"
                  />
                </TableCell>
                <TableHead>보유기간</TableHead>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                      select
                      size="small"
                      defaultValue=""
                      sx={{ width: 80 }}
                    >
                      <MenuItem value="">년</MenuItem>
                      <MenuItem value="1">1년</MenuItem>
                      <MenuItem value="3">3년</MenuItem>
                      <MenuItem value="5">5년</MenuItem>
                    </TextField>
                    <TextField
                      size="small"
                      sx={{ width: 80 }}
                      placeholder="6"
                    />
                    개월
                  </Stack>
                </TableCell>
              </TableRow>

              {/* 정보주체의 개인정보항목 / 법정대리인의 개인정보항목 */}
              <TableRow>
                <TableHead>정보주체의 개인정보항목</TableHead>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="정보주체의 개인정보항목"
                  />
                </TableCell>
                <TableHead>법정대리인의 개인정보항목</TableHead>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="법정대리인의 개인정보항목"
                  />
                </TableCell>
              </TableRow>

              {/* 주민등록번호 수집여부 / 주민등록번호 수집 법령근거 */}
              <TableRow>
                <TableHead>주민등록번호 수집여부</TableHead>
                <TableCell>
                  <RadioGroup row>
                    <FormControlLabel
                      value="collect"
                      control={<Radio size="small" />}
                      label="수집"
                    />
                    <FormControlLabel
                      value="notCollect"
                      control={<Radio size="small" />}
                      label="미수집"
                    />
                  </RadioGroup>
                </TableCell>
                <TableHead>주민등록번호 수집 법령근거</TableHead>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="주민등록번호 수집 법령근거"
                  />
                </TableCell>
              </TableRow>

              {/* 정보주체 동의여부 / 정보주체 동의 없이 수집 법령근거 */}
              <TableRow>
                <TableHead>정보주체 동의여부</TableHead>
                <TableCell>
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    label="동의"
                  />
                </TableCell>
                <TableHead>정보주체 동의 없이 수집 법령근거</TableHead>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="정보주체 동의 없이 수집 법령근거"
                  />
                </TableCell>
              </TableRow>

              {/* 민감 정보 보유여부 / 민감 정보 별도동의 여부 */}
              <TableRow>
                <TableHead>민감 정보 보유여부</TableHead>
                <TableCell>
                  <RadioGroup row>
                    <FormControlLabel
                      value="have"
                      control={<Radio size="small" />}
                      label="보유"
                    />
                    <FormControlLabel
                      value="notHave"
                      control={<Radio size="small" />}
                      label="미보유"
                    />
                  </RadioGroup>
                </TableCell>
                <TableHead>민감 정보 별도동의 여부</TableHead>
                <TableCell>
                  <RadioGroup row>
                    <FormControlLabel
                      value="agree"
                      control={<Radio size="small" />}
                      label="동의"
                    />
                    <FormControlLabel
                      value="disagree"
                      control={<Radio size="small" />}
                      label="미동의"
                    />
                  </RadioGroup>
                </TableCell>
              </TableRow>

              {/* 고유식별정보 보유여부 / 고유식별정보 별도동의 여부 */}
              <TableRow>
                <TableHead>고유식별정보 보유여부</TableHead>
                <TableCell>
                  <RadioGroup row>
                    <FormControlLabel
                      value="have"
                      control={<Radio size="small" />}
                      label="보유"
                    />
                    <FormControlLabel
                      value="notHave"
                      control={<Radio size="small" />}
                      label="미보유"
                    />
                  </RadioGroup>
                </TableCell>
                <TableHead>고유식별정보 별도동의 여부</TableHead>
                <TableCell>
                  <RadioGroup row>
                    <FormControlLabel
                      value="agree"
                      control={<Radio size="small" />}
                      label="동의"
                    />
                    <FormControlLabel
                      value="disagree"
                      control={<Radio size="small" />}
                      label="미동의"
                    />
                  </RadioGroup>
                </TableCell>
              </TableRow>

              {/* 개인정보영향평가 대상여부 / 취급담당자 */}
              <TableRow>
                <TableHead>개인정보영향평가 대상여부</TableHead>
                <TableCell>
                  <RadioGroup row>
                    <FormControlLabel
                      value="target"
                      control={<Radio size="small" />}
                      label="대상"
                    />
                    <FormControlLabel
                      value="notTarget"
                      control={<Radio size="small" />}
                      label="미대상"
                    />
                  </RadioGroup>
                </TableCell>
                <TableHead>취급담당자</TableHead>
                <TableCell>
                  <TextField fullWidth size="small" placeholder="취급담당자" />
                </TableCell>
              </TableRow>

              {/* 제3자 제공받는 자 / 제3자 제공 근거 */}
              <TableRow>
                <TableHead>제3자 제공받는 자</TableHead>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="제3자 제공받는 자"
                  />
                </TableCell>
                <TableHead>제3자 제공 근거</TableHead>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="제3자 제공 근거"
                  />
                </TableCell>
              </TableRow>

              {/* 제3자 제공 항목 / 개인정보처리 위탁 업체명 */}
              <TableRow>
                <TableHead>제3자 제공 항목</TableHead>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="제3자 제공 항목"
                  />
                </TableCell>
                <TableHead>개인정보처리 위탁 업체명</TableHead>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="개인정보처리 위탁 업체명"
                  />
                </TableCell>
              </TableRow>

              {/* 개인정보위탁계약서 여부 / 개인정보위탁사실 게재여부 */}
              <TableRow>
                <TableHead>개인정보위탁계약서 여부</TableHead>
                <TableCell>
                  <RadioGroup row>
                    <FormControlLabel
                      value="yes"
                      control={<Radio size="small" />}
                      label="있음"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio size="small" />}
                      label="없음"
                    />
                  </RadioGroup>
                </TableCell>
                <TableHead>개인정보위탁사실 게재여부</TableHead>
                <TableCell>
                  <RadioGroup row>
                    <FormControlLabel
                      value="post"
                      control={<Radio size="small" />}
                      label="게재"
                    />
                    <FormControlLabel
                      value="notPost"
                      control={<Radio size="small" />}
                      label="미게재"
                    />
                  </RadioGroup>
                </TableCell>
              </TableRow>

              {/* 목적 외 이용.제공 여부 / 목적 외 이용.제공 근거 */}
              <TableRow>
                <TableHead>목적 외 이용.제공 여부</TableHead>
                <TableCell>
                  <RadioGroup row>
                    <FormControlLabel
                      value="yes"
                      control={<Radio size="small" />}
                      label="있음"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio size="small" />}
                      label="없음"
                    />
                  </RadioGroup>
                </TableCell>
                <TableHead>목적 외 이용.제공 근거</TableHead>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="목적 외 이용.제공 근거"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </FormGroup>
      <Stack direction="row" spacing={2} justifyContent="right">
        <Button variant="contained" onClick={handleBack}>
          취소
        </Button>
        <Button type="submit" variant="contained" loading={isSubmitting}>
          {isEditMode ? "수정" : "등록"}
        </Button>
      </Stack>
    </Box>
  );
}
