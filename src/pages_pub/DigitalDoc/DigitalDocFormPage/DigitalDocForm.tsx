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
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router";
import MuiSelect from "@/components/Elements/MuiSelect";
import type { DigitalDocFormState } from "@/types/digitalDoc";
import type { FormFieldValue } from "@/types/common";
import URL from "@/constants/url";
import { useInputStateHandlers } from "@/hooks/InputStateHandlers/useInputStateHandlers";
import {
  InfoTableCreate,
  InfoTableView,
  type InfoTableRow,
} from "@/components/Table/InfoTable";

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

  const {
    handleTextFieldChange,
    handleSelectFieldChange,
    handleRadioFieldChange,
  } = useInputStateHandlers<DigitalDocFormState["values"]>(onFieldChange);

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

  const handleBack = React.useCallback(() => {
    navigate(URL.DOC_CLASSIFICATION_LIST);
  }, [navigate]);

  const sampleData: InfoTableRow[] = [
    {
      groups: [
        {
          label: "문서분류",
          content: "피해구제 > 접수서류 > 사망신청",
          contentColSpan: 7,
        },
      ],
    },
    {
      groups: [
        {
          label: "개인정보 포함",
          content: "포함",
        },
        {
          label: "사용여부",
          content: "사용",
        },
      ],
    },
    {
      groups: [
        {
          label: "등록일자",
          content: "2025-01-15",
          contentColSpan: 3,
        },
        {
          label: "등록자",
          content: "관리자",
          contentColSpan: 3,
        },
      ],
    },
    {
      groups: [
        {
          label: "부서명",
          content: "의약품부작용피해구제팀",
          contentColSpan: 3,
        },
        {
          label: "파일명",
          content: "피해구제급여 지급신청서",
          contentColSpan: 3,
        },
      ],
    },
    {
      groups: [
        {
          label: "보유목적",
          content: "의약품 부작용 피해구제 신청 및 피해구제급여 지급",
          contentColSpan: 7,
        },
      ],
    },
    {
      groups: [
        {
          label: "수집근거(법령)",
          content: (
            <>
              약사법 제66조의2 제86조6 의약품 부작용 피해구제에 관한 규정 제19조
              개인정보보호법 제15조제1항제1호 개인정보보호법 제15조제1항제3호
              공공기록물 관리에 관한 법률 시행령 별표1 기록물의 보존기간별 4번
              영구보존의
            </>
          ),
          contentColSpan: 7,
        },
      ],
    },
    {
      groups: [
        {
          label: "사용부서",
          content: "의약품부작용피해구제팀",
          contentColSpan: 3,
        },
        {
          label: "보유기간",
          content: "준영구",
          contentColSpan: 3,
        },
      ],
    },
    {
      groups: [
        {
          label: "개인정보 처리방법",
          content:
            "ECM(문서중앙화솔루션), 업무용PC 중이문서, 이메일, 우편, 팩스",
          contentColSpan: 7,
        },
      ],
    },
    {
      groups: [
        {
          label: "정보주체 개인정보항목",
          content: (
            <>
              (필수항목) 신청인의 성명, 주민등록번호, 주소(집 또는 직장),
              핸드폰번호, 피해자 또는 사망자의 성명, 주민등록번호, 주소(집 또는
              직장), 핸드폰번호, 의약품 사용 현황, 피해구제급여의 신청 종류,
              부작용의 종류 및 양상, 진료비 상세 내역, 지급은행 및 계좌번호,
              피해의 발생 일자, 피해자의 신장, 체중, 성별, 기왕증, 요양기관에서
              받은 행위의 종류 및 내용, 진료기록, 요양기관에서 발행한 각종
              증명서, 개인의 특이체질, 흡연력, 음주여부, 가족력, 진료일수,
              피해자 및 신청인의 가족관계 및 동거관계(동거관계는
              미지급피해구제급여 신청의 경우에 한한다), 건강보험 및 의료급여의
              본인부담상한액, 건강보험심사평가원 근로복지공단 등의 심사청구자료,
              신청한 의약품과 관련한 예방접종피해구제급여 신청 및 지급 사실
              여부, 신청한 의약품과 관련한 특정수혈부작용 보상신청 및 지급 사실
              여부, 신청한 의약품과 관련한 요양기관 혹은 의약품의 제조업자,
              품목허가를 받은 자, 수입자와 분쟁 발생 및 분쟁 종결 여부
              (선택항목) 신청인의 연락처(집 또는 직장연락처), 전자우편주소,
              피해자의 연락처(집 또는 직장연락처), 전자우편주소
            </>
          ),
          contentColSpan: 7,
        },
      ],
    },
    {
      groups: [
        {
          label: "법정대리인 개인정보항목",
          content: (
            <>
              (필수항목) 이름:필수, E-Mail:필수, 주민등록번호:필수 기타 필수
              주소(집 또는 직장), 연락처(핸드폰번호 또는 집 또는 직장 연락처),
              계좌, 가족관계증명서 (선택항목) 해당사항 없음
            </>
          ),
          contentColSpan: 7,
        },
      ],
    },
    {
      groups: [
        {
          label: "주민등록 수집여부",
          content: "Y",
        },
        {
          label: "주민등록번호 수집 법령근거",
          content: "의약품 부작용 피해구제에 관한 규정 제 19조",
        },
      ],
    },
    {
      groups: [
        {
          label: "정보주체 동의여부",
          content: "Y",
        },
        {
          label: "정보주체 동의 없이 수집 법령근거",
          content: "-",
        },
      ],
    },
    {
      groups: [
        {
          label: "민감정보 보유여부",
          content: "Y",
        },
        {
          label: "민감정보 별도 동의여부",
          content: "Y",
        },
      ],
    },
    {
      groups: [
        {
          label: "민감정보 보유 법령근거",
          content: "의약품 부작용 피해구제에 관한 규정 제19조",
          contentColSpan: 7,
        },
      ],
    },
    {
      groups: [
        {
          label: "고유식별정보 보유여부",
          content: "Y",
        },
        {
          label: "고유식별정보 별도 동의여부",
          content: "Y",
        },
      ],
    },
    {
      groups: [
        {
          label: "고유식별정보 보유 법령근거",
          content: "의약품 부작용 피해구제에 관한 규정 제19조",
          contentColSpan: 7,
        },
      ],
    },
    {
      groups: [
        {
          label: "개인정보영향평가 대상여부",
          content: "N",
        },
        {
          label: "취급담당자",
          content: "김희은, 안세영",
        },
      ],
    },
    {
      groups: [
        {
          label: "제 3자 제공받는 자",
          content: (
            <>
              - 질병관리본부 (신청한 의약품이 예방접종과 관련된 경우에 한한다.)
              <br />
              - 대한적십자사 (신청한 의약품이 혈액과 관련된 경우에 한한다.)
              <br />
              - 신청한 의약품을 제조, 수입한 회사 <br />
              - 신청한 의약품을 처방, 조제한 요양기관 및 처방, 투약, 조제한
              보건의료인
              <br />- 식품의약품안전처, 근로복지공단, 건강보험심사평가원,
              국민건강보험공단 등
            </>
          ),
          contentColSpan: 7,
        },
      ],
    },
    {
      groups: [
        {
          label: "제3자 제공 근거",
          content: "정보주체의 동의",
        },
        {
          label: "개인정보처리 위탁 업체명",
          content: "N",
        },
      ],
    },
    {
      groups: [
        {
          label: "제3자 제공 항목",
          content: (
            <>
              - 식품의약품안전처 외: 신청인 또는 피해자의 성명, 주소, 사용한
              의약품 등 <br />- 식품의약품안전처: 한국의약품안전관리원이
              제공받은 개인정보 전체 <br />
              - 근로복지공단, 건강보험심사평가원, 국민건강보험공단: 피해자의
              성명, 주민등록번호 등 <br />- 건강보험심사평가원: 피해자의 성명,
              주민등록번호, 부작용명, 부작용발생 의약품명, 부작용발생일 등
            </>
          ),
          contentColSpan: 7,
        },
      ],
    },
    {
      groups: [
        {
          label: "개인정보위탁계약 여부",
          content: "N",
        },
        {
          label: "개인정보위탁사실 게제여부",
          content: "N",
        },
      ],
    },
    {
      groups: [
        {
          label: "목적 외 이용 제공 여부",
          content: "N",
        },
        {
          label: "목적 외 이용 제공 근거",
          content: "N",
        },
      ],
    },
    {
      groups: [
        { label: "이름", content: "홍길동", inputType: "text" },
        { label: "주소", content: "서울시 어딘가", inputType: "textarea" },
      ],
    },
    {
      groups: [
        {
          label: "성별",
          content: ["남자", "여자", "기타"],
          inputType: "radio",
        },
        {
          label: "취미",
          content: ["독서", "운동", "게임", "영화"],
          inputType: "checkbox",
        },
      ],
    },
    {
      groups: [
        {
          label: "기타",
          content: (
            <MuiSelect
              id="largeCategory"
              placeholder="대분류"
              items={[{ value: "01", label: "피해구제" }]}
              value={formValues.largeCategory ?? ""}
              error={formErrors.largeCategory}
              onChange={handleSelectFieldChange}
            />
          ),
          inputType: "custom",
        },
      ],
    },
  ];
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
      <FormGroup>
        <InfoTableView rows={sampleData} />
        <InfoTableCreate rows={sampleData} />
        <Table
          size="small"
          sx={{ width: "100%" }}
          aria-label="전자문서 등록 폼 테이블">
          <TableBody>
            {/* 문서분류 */}
            <TableRow>
              <TableCell>문서분류</TableCell>
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
            </TableRow>{" "}
            {/* 문서번호 */}
            <TableRow>
              <TableCell>문서번호</TableCell>
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
              <TableCell>문서제목</TableCell>
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
              <TableCell>수집일자</TableCell>
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
              <TableCell>보존연한</TableCell>
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
              <TableCell>종료일자</TableCell>
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
              <TableCell>비고</TableCell>
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
              <TableCell>파일업로드</TableCell>
              <TableCell colSpan={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <RadioGroup
                    row
                    name="uploadType"
                    value={formValues.uploadType ?? ""}
                    onChange={handleRadioFieldChange}>
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
                    onClick={handleFileButtonClick}>
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
