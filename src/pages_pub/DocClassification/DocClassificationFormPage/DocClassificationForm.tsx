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
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router";
import type { DocClassDetailFormState } from "@/types/docClassification";
import MuiSelect from "@/components/Elements/MuiSelect";
import MuiCheckbox from "@/components/Elements/MuiCheckbox";
import URL from "@/constants/url";

export interface DocClassificationProps {
  isEditMode?: boolean;
  initialValues: DocClassDetailFormState["values"]; // 부모에서 받은 초기값
  onSubmit: (values: DocClassDetailFormState["values"]) => Promise<void>;
}

/** 개인정보 상세 테이블 (subDetail 전용) */
interface PrvcDetailProps {
  values: NonNullable<DocClassDetailFormState["values"]["prvcFileHldPrst"]>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PrvcDetailTable = React.memo(({ values, onChange }: PrvcDetailProps) => (
  <Table size="small" aria-label="개인정보 상세 입력">
    <TableBody>
      {/* 부서명 / 파일명 */}
      <TableRow>
        <TableCell>부서명</TableCell>
        <TableCell>
          <TextField
            fullWidth
            size="small"
            placeholder="부서명"
            name="deptNm"
            value={values.deptNm ?? ""}
            onChange={onChange}
          />
        </TableCell>
        <TableCell>파일명</TableCell>
        <TableCell>
          <TextField
            fullWidth
            size="small"
            placeholder="파일명"
            name="fileNm"
            value={values.fileNm ?? ""}
            onChange={onChange}
          />
        </TableCell>
      </TableRow>
      {/* 보유목적 / 사용부서(내부, 외부) */}
      <TableRow>
        <TableCell>보유목적</TableCell>
        <TableCell>
          <TextField
            fullWidth
            size="small"
            placeholder="보유목적"
            name="hldPrps"
            value={values.hldPrps ?? ""}
            onChange={onChange}
          />
        </TableCell>
        <TableCell>사용부서(내부, 외부)</TableCell>
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
        <TableCell>개인정보 처리방법</TableCell>
        <TableCell>
          <TextField fullWidth size="small" placeholder="개인정보 처리방법" />
        </TableCell>
        <TableCell>보유기간</TableCell>
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField select size="small" defaultValue="" sx={{ width: 80 }}>
              <MenuItem value="">년</MenuItem>
              <MenuItem value="1">1년</MenuItem>
              <MenuItem value="3">3년</MenuItem>
              <MenuItem value="5">5년</MenuItem>
            </TextField>
            <TextField size="small" sx={{ width: 80 }} placeholder="6" />
            개월
          </Stack>
        </TableCell>
      </TableRow>

      {/* 정보주체의 개인정보항목 / 법정대리인의 개인정보항목 */}
      <TableRow>
        <TableCell>정보주체의 개인정보항목</TableCell>
        <TableCell>
          <TextField
            fullWidth
            size="small"
            placeholder="정보주체의 개인정보항목"
          />
        </TableCell>
        <TableCell>법정대리인의 개인정보항목</TableCell>
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
        <TableCell>주민등록번호 수집여부</TableCell>
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
        <TableCell>주민등록번호 수집 법령근거</TableCell>
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
        <TableCell>정보주체 동의여부</TableCell>
        <TableCell>
          <FormControlLabel control={<Checkbox size="small" />} label="동의" />
        </TableCell>
        <TableCell>정보주체 동의 없이 수집 법령근거</TableCell>
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
        <TableCell>민감 정보 보유여부</TableCell>
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
        <TableCell>민감 정보 별도동의 여부</TableCell>
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
        <TableCell>고유식별정보 보유여부</TableCell>
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
        <TableCell>고유식별정보 별도동의 여부</TableCell>
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
        <TableCell>개인정보영향평가 대상여부</TableCell>
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
        <TableCell>취급담당자</TableCell>
        <TableCell>
          <TextField fullWidth size="small" placeholder="취급담당자" />
        </TableCell>
      </TableRow>

      {/* 제3자 제공받는 자 / 제3자 제공 근거 */}
      <TableRow>
        <TableCell>제3자 제공받는 자</TableCell>
        <TableCell>
          <TextField fullWidth size="small" placeholder="제3자 제공받는 자" />
        </TableCell>
        <TableCell>제3자 제공 근거</TableCell>
        <TableCell>
          <TextField fullWidth size="small" placeholder="제3자 제공 근거" />
        </TableCell>
      </TableRow>

      {/* 제3자 제공 항목 / 개인정보처리 위탁 업체명 */}
      <TableRow>
        <TableCell>제3자 제공 항목</TableCell>
        <TableCell>
          <TextField fullWidth size="small" placeholder="제3자 제공 항목" />
        </TableCell>
        <TableCell>개인정보처리 위탁 업체명</TableCell>
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
        <TableCell>개인정보위탁계약서 여부</TableCell>
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
        <TableCell>개인정보위탁사실 게재여부</TableCell>
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
        <TableCell>목적 외 이용.제공 여부</TableCell>
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
        <TableCell>목적 외 이용.제공 근거</TableCell>
        <TableCell>
          <TextField
            fullWidth
            size="small"
            placeholder="목적 외 이용.제공 근거"
          />
        </TableCell>
      </TableRow>

      {/* 나머지 행들은 필요에 따라 이어서 추가 */}
      {/* 예: 보유목적, 사용부서, … → 그대로 복사해서 value/onChange만 맞추면 됨 */}
    </TableBody>
  </Table>
));

function DocClassificationFormComponent(props: DocClassificationProps) {
  const { initialValues, onSubmit, isEditMode = false } = props;
  const navigate = useNavigate();

  /** 1) 기본 정보와 개인정보 상세를 분리해서 로컬 state 관리 */
  const [basicValues, setBasicValues] = React.useState<
    Omit<DocClassDetailFormState["values"], "prvcFileHldPrst">
  >(() => {
    const { prvcFileHldPrst, ...rest } = initialValues;
    return rest;
  });

  const [subValues, setSubValues] = React.useState<
    NonNullable<DocClassDetailFormState["values"]["prvcFileHldPrst"]>
  >(() => initialValues.prvcFileHldPrst ?? {});

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  /** 2) 기본 정보 공통 핸들러 (루트 필드용) */
  const handleBasicChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;

      setBasicValues((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? (checked ? "Y" : "N") : value,
      }));
    },
    []
  );

  /** 3) 개인정보 subDetail 전용 핸들러 */
  const handleSubDetailChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;

      setSubValues((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? (checked ? "Y" : "N") : value,
      }));
    },
    []
  );

  /** 4) submit 시 두 state를 합쳐서 부모로 전달 */
  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        const payload: DocClassDetailFormState["values"] = {
          ...(basicValues as DocClassDetailFormState["values"]),
          prvcFileHldPrst: subValues,
        };
        await onSubmit(payload);
      } finally {
        setIsSubmitting(false);
      }
    },
    [basicValues, subValues, onSubmit]
  );

  const handleBack = React.useCallback(() => {
    navigate(URL.DOC_CLASSIFICATION_LIST);
  }, [navigate]);

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
      <FormGroup>
        {/* -------- 기본 정보 테이블 -------- */}
        <Table
          size="small"
          sx={{ mb: "12px" }}
          aria-label="문서분류 구분 및 기본 정보">
          <TableBody>
            {/* 분류 깊이 선택 (대분류 / 중분류 / 소분류) */}
            {!basicValues.docClsfNo && (
              <TableRow>
                <TableCell colSpan={2}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      name="docClsfSeCd"
                      value={basicValues.docClsfSeCd}
                      onChange={handleBasicChange}>
                      <FormControlLabel
                        value="L"
                        control={<Radio size="small" />}
                        label="대분류"
                      />
                      <FormControlLabel
                        value="M"
                        control={<Radio size="small" />}
                        label="중분류"
                      />
                      <FormControlLabel
                        value="S"
                        control={<Radio size="small" />}
                        label="소분류"
                      />
                    </RadioGroup>
                  </FormControl>
                </TableCell>
              </TableRow>
            )}

            {/* 대분류 */}
            <TableRow>
              <TableCell>대분류</TableCell>
              <TableCell>
                <Stack direction="row" spacing={2}>
                  {basicValues.docClsfSeCd === "L" ? (
                    <TextField
                      value={basicValues.docLclsfNo ?? ""}
                      onChange={handleBasicChange}
                      id="docLclsfNo"
                      name="docLclsfNo"
                      placeholder="대분류 메타정보"
                      fullWidth
                    />
                  ) : (
                    <MuiSelect
                      id="docLclsfNo"
                      items={[{ value: "01", label: "피해구제" }]}
                      value={basicValues.docLclsfNo}
                      onChange={handleBasicChange as any}
                    />
                  )}
                </Stack>
              </TableCell>
            </TableRow>

            {/* 중분류 */}
            {(basicValues.docClsfSeCd === "M" ||
              basicValues.docClsfSeCd === "S") && (
              <TableRow>
                <TableCell>중분류</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    {basicValues.docClsfSeCd === "M" ? (
                      <TextField
                        value={basicValues.docMclsfNo ?? ""}
                        onChange={handleBasicChange}
                        id="docMclsfNo"
                        name="docMclsfNo"
                        placeholder="중분류 메타정보"
                        fullWidth
                      />
                    ) : (
                      <MuiSelect
                        id="docMclsfNo"
                        items={[
                          { value: "01", label: "접수서류" },
                          { value: "02", label: "신청자 제출서류" },
                          { value: "03", label: "직원보완자료" },
                        ]}
                        value={basicValues.docMclsfNo}
                        onChange={handleBasicChange as any}
                      />
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            )}

            {/* 소분류 */}
            {basicValues.docClsfSeCd === "S" && (
              <TableRow>
                <TableCell>소분류</TableCell>
                <TableCell>
                  <TextField
                    value={basicValues.docSclsfNo ?? ""}
                    onChange={handleBasicChange}
                    id="docSclsfNo"
                    name="docSclsfNo"
                    placeholder="소분류"
                    fullWidth
                  />
                  <MuiCheckbox
                    id="prvcInclYn"
                    label="개인정보포함"
                    checked={basicValues.prvcInclYn === "Y"}
                    onChange={handleBasicChange as any}
                  />
                </TableCell>
              </TableRow>
            )}

            {/* 사용여부 */}
            {basicValues.docClsfNo && (
              <TableRow>
                <TableCell>사용여부</TableCell>
                <TableCell>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      name="useEn"
                      value={basicValues.useEn}
                      onChange={handleBasicChange}>
                      <FormControlLabel
                        value="Y"
                        control={<Radio size="small" />}
                        label="사용"
                      />
                      <FormControlLabel
                        value="N"
                        control={<Radio size="small" />}
                        label="사용안함"
                      />
                    </RadioGroup>
                  </FormControl>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* -------- 개인정보 상세 테이블 (별도 state + memo) -------- */}
        {basicValues.prvcInclYn === "Y" && (
          <PrvcDetailTable
            values={subValues}
            onChange={handleSubDetailChange}
          />
        )}
      </FormGroup>

      <Stack direction="row" spacing={2} justifyContent="right">
        <Button variant="contained" onClick={handleBack}>
          취소
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isEditMode ? "수정" : "등록"}
        </Button>
      </Stack>
    </Box>
  );
}

const DocClassificationForm = React.memo(DocClassificationFormComponent);
export default DocClassificationForm;
