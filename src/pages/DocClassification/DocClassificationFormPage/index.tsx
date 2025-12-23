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
  type SelectChangeEvent,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import useNotifications from "@/hooks/useNotifications";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import {
  getDocClassificationData,
  updateDocClassificationData,
  createDocClassificationData,
  docClassificationvalidator,
} from "@/services/docClassificationService";
import type {
  DocClassDetailFormState,
  DocClassDetail,
} from "@/types/docClassification";
import URL from "@/constants/url";
import PageContainer from "@/components/AgGridContainer/PageContainer";
import PageStatus from "@/components/PageStatus";
import MuiSelect from "@/components/Elements/MuiSelect";
import MuiCheckbox from "@/components/Elements/MuiCheckbox";
import {
  useDocClsfChildrenLive,
  useLclsfListLive,
} from "@/hooks/query/useDocClsfTree";

/* ------------------------------------------------------------------ */
/* 타입/초기값                                                         */
/* ------------------------------------------------------------------ */

const INITIAL_FORM_VALUES: DocClassDetailFormState["values"] = {
  docClsfNo: "",
  docClsfSeCd: "L",
  docClsfNm: "",
  upDocClsfNo: "",
  docLclsfNo: "",
  docMclsfNo: "",
  docSclsfNo: "",
  docLclsfNm: "",
  docMclsfNm: "",
  docSclsfNm: "",
  prvcInclYn: "N",
  useEn: "Y",
  prvcFileHldPrst: {},
};

type Values = DocClassDetailFormState["values"];
type SubDetailValues = NonNullable<Values["prvcFileHldPrst"]>;

/* ------------------------------------------------------------------ */
/* 개인정보 상세 테이블 (subDetail 전용) – 전부 비제어                  */
/* ------------------------------------------------------------------ */

interface PrvcDetailProps {
  defaults: SubDetailValues;
  isDirectInputYear: boolean;
  onChangeDirectInputYear: (value: boolean) => void;
  isInfoAgree: boolean;
  onChangeInfoAgree: (value: boolean) => void;
  formErrors: Record<string, string>; // ← 추가
}

const PrvcDetailTable = React.memo(
  ({
    defaults,
    isDirectInputYear,
    onChangeDirectInputYear,
    isInfoAgree,
    onChangeInfoAgree,
    formErrors,
  }: PrvcDetailProps) => {
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const isDirect = value === "0";

      // 상위 플래그 갱신 (disable 토글용)
      onChangeDirectInputYear(isDirect);

      // 직접입력이 아닌 경우 월 값 비우기
      if (!isDirect) {
        const mmInput = document.querySelector<HTMLInputElement>(
          'input[name="hldPrdMmCnt"]'
        );
        if (mmInput) {
          mmInput.value = ""; // 또는 "0"으로 고정하고 싶으면 "0"
        }
      }
    };

    const handleInfoAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked; // checked == 동의(Y)
      const notAgree = !checked; // 동의가 아니면 true
      onChangeInfoAgree(notAgree);

      const target = document.querySelector<HTMLInputElement>(
        'input[name="infoMnbdDsagClctSttBssExpln"]'
      );
      if (!target) return;

      if (!notAgree) {
        // 동의(Y)인 경우: 값 초기화 + 비활성
        target.value = "";
        target.disabled = true;
      } else {
        // 비동의인 경우: 활성
        target.disabled = false;
      }
    };
    return (
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
                defaultValue={defaults.deptNm ?? ""}
                error={!!formErrors.deptNm}
                helperText={formErrors.deptNm ?? ""}
              />
            </TableCell>
            <TableCell>파일명</TableCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="파일명"
                name="fileNm"
                defaultValue={defaults.fileNm ?? ""}
                error={!!formErrors.fileNm}
                helperText={formErrors.fileNm ?? ""}
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
                defaultValue={defaults.hldPrps ?? ""}
                error={!!formErrors.hldPrps}
                helperText={formErrors.hldPrps ?? ""}
              />
            </TableCell>
            <TableCell>사용부서</TableCell>
            <TableCell>
              <RadioGroup row name="useDeptNm">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="사용부서"
                  name="useDeptNm"
                  defaultValue={defaults.useDeptNm ?? ""}
                  error={!!formErrors.useDeptNm}
                  helperText={formErrors.useDeptNm ?? ""}
                />
              </RadioGroup>
            </TableCell>
          </TableRow>

          {/* 개인정보 처리방법 / 보유기간 */}
          <TableRow>
            <TableCell>개인정보 처리방법</TableCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="개인정보 처리방법"
                name="prvcPrcsMthdExpln"
                defaultValue={defaults.prvcPrcsMthdExpln ?? ""}
                error={!!formErrors.prvcPrcsMthdExpln}
                helperText={formErrors.prvcPrcsMthdExpln ?? ""}
              />
            </TableCell>
            <TableCell>보유기간</TableCell>
            <TableCell>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  select
                  size="small"
                  name="hldPrdDfyrs"
                  defaultValue={defaults.hldPrdDfyrs ?? 1}
                  sx={{ width: 100 }}
                  onChange={handleYearChange}
                >
                  <MenuItem value="1">1년</MenuItem>
                  <MenuItem value="3">3년</MenuItem>
                  <MenuItem value="5">5년</MenuItem>
                  <MenuItem value="10">10년</MenuItem>
                  <MenuItem value="30">30년</MenuItem>
                  <MenuItem value="90">준영구</MenuItem>
                  <MenuItem value="99">영구</MenuItem>
                  <MenuItem value="0">직접입력</MenuItem>
                </TextField>
                <TextField
                  size="small"
                  name="hldPrdMmCnt"
                  sx={{ width: 80 }}
                  placeholder="월"
                  type="text"
                  disabled={!isDirectInputYear}
                  defaultValue={defaults.hldPrdMmCnt ?? null}
                  error={!!formErrors.hldPrdMmCnt}
                  helperText={formErrors.hldPrdMmCnt ?? null}
                  onChange={(e) => {
                    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
                    // 비제어라면 DOM 값만 수정
                    if (onlyNumber !== e.target.value) {
                      e.target.value = onlyNumber;
                    }
                  }}
                />
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
                name="infoMnbdPrvcMttr"
                defaultValue={defaults.infoMnbdPrvcMttr ?? ""}
                error={!!formErrors.infoMnbdPrvcMttr}
                helperText={formErrors.infoMnbdPrvcMttr ?? ""}
              />
            </TableCell>
            <TableCell>법정대리인의 개인정보항목</TableCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="법정대리인의 개인정보항목"
                name="sttyAgtPrvcMttr"
                defaultValue={defaults.sttyAgtPrvcMttr ?? ""}
                error={!!formErrors.sttyAgtPrvcMttr}
                helperText={formErrors.sttyAgtPrvcMttr ?? ""}
              />
            </TableCell>
          </TableRow>

          {/* 주민등록번호 수집여부 / 주민등록번호 수집 법령근거 */}
          <TableRow>
            <TableCell>주민등록번호 수집여부</TableCell>
            <TableCell>
              <RadioGroup
                row
                name="rrnoClctYn"
                defaultValue={defaults.rrnoClctYn ?? "N"}
              >
                <FormControlLabel
                  value="Y"
                  control={<Radio size="small" />}
                  label="수집"
                />
                <FormControlLabel
                  value="N"
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
                name="rrnoClctSttBssExpln"
                defaultValue={defaults.rrnoClctSttBssExpln ?? ""}
                error={!!formErrors.rrnoClctSttBssExpln}
                helperText={formErrors.rrnoClctSttBssExpln ?? ""}
              />
            </TableCell>
          </TableRow>

          {/* 정보주체 동의여부 / 정보주체 동의 없이 수집 법령근거 */}
          <TableRow>
            <TableCell>정보주체 동의여부</TableCell>
            <TableCell>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    name="infoMnbdAgreYn"
                    defaultChecked={defaults.infoMnbdAgreYn === "Y"} // ← 플래그로 제어
                    onChange={handleInfoAgreeChange}
                  />
                }
                label="동의"
              />
            </TableCell>
            <TableCell>정보주체 동의 없이 수집 법령근거</TableCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="정보주체 동의 없이 수집 법령근거"
                name="infoMnbdDsagClctSttBssExpln"
                defaultValue={defaults.infoMnbdDsagClctSttBssExpln ?? ""}
                error={!!formErrors.infoMnbdDsagClctSttBssExpln}
                helperText={formErrors.infoMnbdDsagClctSttBssExpln ?? ""}
                disabled={!isInfoAgree} // 최초 렌더 기준
              />
            </TableCell>
          </TableRow>

          {/* 민감 정보 보유여부 / 민감 정보 별도동의여부 */}
          <TableRow>
            <TableCell>민감 정보 보유여부</TableCell>
            <TableCell>
              <RadioGroup
                row
                name="sensInfoHldYn"
                defaultValue={defaults.sensInfoHldYn ?? "N"}
              >
                <FormControlLabel
                  value="Y"
                  control={<Radio size="small" />}
                  label="보유"
                />
                <FormControlLabel
                  value="N"
                  control={<Radio size="small" />}
                  label="미보유"
                />
              </RadioGroup>
            </TableCell>
            <TableCell>민감 정보 별도동의여부</TableCell>
            <TableCell>
              <RadioGroup
                row
                name="sensInfoIndivAgreYn"
                defaultValue={defaults.sensInfoIndivAgreYn ?? "N"}
              >
                <FormControlLabel
                  value="Y"
                  control={<Radio size="small" />}
                  label="동의"
                />
                <FormControlLabel
                  value="N"
                  control={<Radio size="small" />}
                  label="미동의"
                />
              </RadioGroup>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>민감 정보 보유 법령근거</TableCell>
            <TableCell colSpan={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="민감 정보 보유 법령근거"
                name="sensInfoHldSttBssExpln"
                defaultValue={defaults.sensInfoHldSttBssExpln ?? ""}
                error={!!formErrors.sensInfoHldSttBssExpln}
                helperText={formErrors.sensInfoHldSttBssExpln ?? ""}
              />
            </TableCell>
          </TableRow>

          {/* 고유식별정보 보유여부 / 고유식별정보 별도동의여부 */}
          <TableRow>
            <TableCell>고유식별정보 보유여부</TableCell>
            <TableCell>
              <RadioGroup
                row
                name="uiiHldYn"
                defaultValue={defaults.uiiHldYn ?? "N"}
              >
                <FormControlLabel
                  value="Y"
                  control={<Radio size="small" />}
                  label="보유"
                />
                <FormControlLabel
                  value="N"
                  control={<Radio size="small" />}
                  label="미보유"
                />
              </RadioGroup>
            </TableCell>
            <TableCell>고유식별정보 별도동의여부</TableCell>
            <TableCell>
              <RadioGroup
                row
                name="uiiIndivAgreYn"
                defaultValue={defaults.uiiIndivAgreYn ?? "N"}
              >
                <FormControlLabel
                  value="Y"
                  control={<Radio size="small" />}
                  label="동의"
                />
                <FormControlLabel
                  value="N"
                  control={<Radio size="small" />}
                  label="미동의"
                />
              </RadioGroup>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>고유식별정보 보유 법령근거</TableCell>
            <TableCell colSpan={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="고유식별정보 보유 법령근거"
                name="uiiHldSttBssExpln"
                defaultValue={defaults.uiiHldSttBssExpln ?? ""}
                error={!!formErrors.uiiHldSttBssExpln}
                helperText={formErrors.uiiHldSttBssExpln ?? ""}
              />
            </TableCell>
          </TableRow>

          {/* 개인정보영향평가 대상여부 / 취급담당자 */}
          <TableRow>
            <TableCell>개인정보영향평가 대상여부</TableCell>
            <TableCell>
              <RadioGroup
                row
                name="prvcEvlTrgtYn"
                defaultValue={defaults.prvcEvlTrgtYn ?? "N"}
              >
                <FormControlLabel
                  value="Y"
                  control={<Radio size="small" />}
                  label="대상"
                />
                <FormControlLabel
                  value="N"
                  control={<Radio size="small" />}
                  label="미대상"
                />
              </RadioGroup>
            </TableCell>
            <TableCell>취급담당자</TableCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="민감 정보 보유 법령근거"
                name="hndlPicNm"
                defaultValue={defaults.hndlPicNm ?? ""}
                error={!!formErrors.hndlPicNm}
                helperText={formErrors.hndlPicNm ?? ""}
              />
            </TableCell>
          </TableRow>

          {/* 제3자 제공받는 자 / 제3자 제공 근거 */}
          <TableRow>
            <TableCell>제3자 제공받는 자</TableCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="제3자 제공받는 자"
                name="tdptySplrcpNm"
                defaultValue={defaults.tdptySplrcpNm ?? ""}
                error={!!formErrors.tdptySplrcpNm}
                helperText={formErrors.tdptySplrcpNm ?? ""}
              />
            </TableCell>
            <TableCell>제3자 제공 근거</TableCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="제3자 제공 근거"
                name="tdptyPvsnBssExpln"
                defaultValue={defaults.tdptyPvsnBssExpln ?? ""}
                error={!!formErrors.tdptyPvsnBssExpln}
                helperText={formErrors.tdptyPvsnBssExpln ?? ""}
              />
            </TableCell>
          </TableRow>

          {/* 제3자 제공사항 / 개인정보처리 위탁 업체명 */}
          <TableRow>
            <TableCell>제3자 제공사항</TableCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="제3자 제공사항"
                name="tdptyPvsnMttr"
                defaultValue={defaults.tdptyPvsnMttr ?? ""}
                error={!!formErrors.tdptyPvsnMttr}
                helperText={formErrors.tdptyPvsnMttr ?? ""}
              />
            </TableCell>
            <TableCell>개인정보처리 위탁 업체명</TableCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="개인정보처리 위탁 업체명"
                name="prvcPrcsCnsgnBzentyNm"
                defaultValue={defaults.prvcPrcsCnsgnBzentyNm ?? ""}
                error={!!formErrors.prvcPrcsCnsgnBzentyNm}
                helperText={formErrors.prvcPrcsCnsgnBzentyNm ?? ""}
              />
            </TableCell>
          </TableRow>

          {/* 개인정보위탁계약서 여부 / 개인정보 윈탁사실 게재여부 */}
          <TableRow>
            <TableCell>개인정보위탁계약서 여부</TableCell>
            <TableCell>
              <RadioGroup
                row
                name="prvcCnsgnCtrtYn"
                defaultValue={defaults.prvcCnsgnCtrtYn ?? "N"}
              >
                <FormControlLabel
                  value="Y"
                  control={<Radio size="small" />}
                  label="있음"
                />
                <FormControlLabel
                  value="N"
                  control={<Radio size="small" />}
                  label="없음"
                />
              </RadioGroup>
            </TableCell>
            <TableCell>개인정보 윈탁사실 게재여부</TableCell>
            <TableCell>
              <RadioGroup
                row
                name="prvcCnsgnFactIndctYn"
                defaultValue={defaults.prvcCnsgnFactIndctYn ?? "N"}
              >
                <FormControlLabel
                  value="Y"
                  control={<Radio size="small" />}
                  label="게재"
                />
                <FormControlLabel
                  value="N"
                  control={<Radio size="small" />}
                  label="미게재"
                />
              </RadioGroup>
            </TableCell>
          </TableRow>

          {/* 목적 외 이용 제공 여부 / 목적 외 이용 제공 근거 */}
          <TableRow>
            <TableCell>목적 외 이용 제공 여부</TableCell>
            <TableCell>
              <RadioGroup
                row
                name="prpsExclUtztnPvsnYn"
                defaultValue={defaults.prpsExclUtztnPvsnYn ?? "N"}
              >
                <FormControlLabel
                  value="Y"
                  control={<Radio size="small" />}
                  label="있음"
                />
                <FormControlLabel
                  value="N"
                  control={<Radio size="small" />}
                  label="없음"
                />
              </RadioGroup>
            </TableCell>
            <TableCell>목적 외 이용 제공 근거</TableCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="목적 외 이용 제공 근거"
                name="prpsExclUtztnPvsnBssExpln"
                defaultValue={defaults.prpsExclUtztnPvsnBssExpln ?? ""}
                error={!!formErrors.prpsExclUtztnPvsnBssExpln}
                helperText={formErrors.prpsExclUtztnPvsnBssExpln ?? ""}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
);

/* ------------------------------------------------------------------ */
/* 메인 페이지 컴포넌트 – 비제어 폼                                   */
/* ------------------------------------------------------------------ */

export default function DocClassificationFormPage() {
  const navigate = useNavigate();
  const notifications = useNotifications();
  const { docClsfNo } = useParams<{ docClsfNo?: string }>();

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const dialogs = useDialogs();

  // 초기값/조회값만 들고 있음 (입력 중에는 state 변경 없음)
  const [defaults, setDefaults] = React.useState<Values>(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );

  const [docClsfSeCd, setdocClsfSeCd] = React.useState<string>("L");

  const [hldPrdDfyrs, setHldPrdDfyrs] = React.useState<number | null>();
  const [hldPrdMmCnt, setHldPrdMmCnt] = React.useState<number | null>();

  const formRef = React.useRef<HTMLFormElement | null>(null);

  /* ---------------- 데이터 로딩 ---------------- */
  const { data: lclsfDocs } = useLclsfListLive();
  const { data: mclsfDocs } = useDocClsfChildrenLive(defaults.docLclsfNo);

  const lclsfList = lclsfDocs
    ? [
        ...lclsfDocs.map((vo) => ({
          label: vo.docClsfNm,
          value: vo.docClsfNo,
        })),
      ]
    : [];
  const mclsfList = mclsfDocs
    ? [
        ...mclsfDocs.map((vo) => ({
          label: vo.docClsfNm,
          value: vo.docClsfNo,
        })),
      ]
    : [];

  const [isDirectInputYear, setIsDirectInputYear] = React.useState(false);
  const [isInfoAgree, setIsInfoAgree] = React.useState(false);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      if (docClsfNo) {
        const viewData = await getDocClassificationData(docClsfNo);
        setDefaults(viewData as Values);
        setdocClsfSeCd(viewData.docClsfSeCd);
        if (viewData?.prvcFileHldPrst) {
          const y = viewData.prvcFileHldPrst.hldPrdDfyrs ?? 1;
          setIsDirectInputYear(String(y) === "0");

          setIsInfoAgree(viewData.prvcFileHldPrst.infoMnbdAgreYn !== "Y");

          setHldPrdDfyrs(viewData.prvcFileHldPrst.hldPrdDfyrs ?? null);
          setHldPrdMmCnt(viewData.prvcFileHldPrst.hldPrdMmCnt ?? null);
        }
      } else {
        setDefaults(INITIAL_FORM_VALUES);
      }
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
    setIsLoading(false);
  }, [docClsfNo]);

  React.useEffect(() => {
    loadData();
  }, []);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;

      setDefaults((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? (checked ? "Y" : "N") : value,
      }));
    },
    []
  );

  // 대분류,
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;

    setDefaults((prev) => {
      const next = { ...prev, [name]: value as string };

      switch (name) {
        case "docLclsfNo":
          next.docMclsfNo = "";
          next.docSclsfNo = "";
          break;
        default:
          break;
      }
      // 대분류 변경 시 중분류/소분류 초기화

      return next;
    });
  };

  /* ---------------- 제출 처리 ---------------- */

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!formRef.current) return;

      // 폼데이터로 안하고 수정될때마다 컬럼의 값을 바꿔주는 형태로 가면 입력이 너무 느려짐..
      // 추후 좋은 방안 나오면 수정가능
      const fd = new FormData(formRef.current);

      const subDetail: SubDetailValues = {
        ...(defaults.prvcFileHldPrst ?? {}),
        deptNm: (fd.get("deptNm") as string) ?? "",
        fileNm: (fd.get("fileNm") as string) ?? "",
        hldPrps: (fd.get("hldPrps") as string) ?? "",
        clctSttBssExpln: (fd.get("clctSttBssExpln") as string) ?? "",
        useDeptNm: (fd.get("useDeptNm") as string) ?? "",
        prvcPrcsMthdExpln: (fd.get("prvcPrcsMthdExpln") as string) ?? "",
        hldPrdDfyrs: (fd.get("hldPrdDfyrs") as unknown as number) ?? "",
        hldPrdMmCnt: (fd.get("hldPrdMmCnt") as unknown as number) ?? "",
        infoMnbdPrvcMttr: (fd.get("infoMnbdPrvcMttr") as string) ?? "",
        sttyAgtPrvcMttr: (fd.get("sttyAgtPrvcMttr") as string) ?? "",
        rrnoClctYn: (fd.get("rrnoClctYn") as string) ?? "",
        rrnoClctSttBssExpln: (fd.get("rrnoClctSttBssExpln") as string) ?? "",
        infoMnbdAgreYn: fd.get("infoMnbdAgreYn") ? "Y" : "N",
        infoMnbdDsagClctSttBssExpln:
          (fd.get("infoMnbdDsagClctSttBssExpln") as string) ?? "",
        sensInfoHldYn: (fd.get("sensInfoHldYn") as string) ?? "",
        sensInfoIndivAgreYn: (fd.get("sensInfoIndivAgreYn") as string) ?? "",
        sensInfoHldSttBssExpln:
          (fd.get("sensInfoHldSttBssExpln") as string) ?? "",
        uiiHldYn: (fd.get("uiiHldYn") as string) ?? "",
        uiiIndivAgreYn: (fd.get("uiiIndivAgreYn") as string) ?? "",
        uiiHldSttBssExpln: (fd.get("uiiHldSttBssExpln") as string) ?? "",
        prvcEvlTrgtYn: (fd.get("prvcEvlTrgtYn") as string) ?? "",
        hndlPicNm: (fd.get("hndlPicNm") as string) ?? "",
        tdptySplrcpNm: (fd.get("tdptySplrcpNm") as string) ?? "",
        tdptyPvsnBssExpln: (fd.get("tdptyPvsnBssExpln") as string) ?? "",
        tdptyPvsnMttr: (fd.get("tdptyPvsnMttr") as string) ?? "",
        prvcPrcsCnsgnBzentyNm:
          (fd.get("prvcPrcsCnsgnBzentyNm") as string) ?? "",
        prvcCnsgnCtrtYn: (fd.get("prvcCnsgnCtrtYn") as string) ?? "",
        prvcCnsgnFactIndctYn: (fd.get("prvcCnsgnFactIndctYn") as string) ?? "",
        prpsExclUtztnPvsnYn: (fd.get("prpsExclUtztnPvsnYn") as string) ?? "",
        prpsExclUtztnPvsnBssExpln:
          (fd.get("prpsExclUtztnPvsnBssExpln") as string) ?? "",

        // 필요하면 나머지도 여기서만 추가
      };

      let docClsfNm = "";
      let upDocClsfNo: string | null = null;

      switch (docClsfSeCd) {
        case "L":
          docClsfNm = fd.get("docLclsfNm") as string;
          break;
        case "M":
          docClsfNm = fd.get("docMclsfNm") as string;
          upDocClsfNo = fd.get("docLclsfNo") as string;
          break;
        default:
          docClsfNm = fd.get("docSclsfNm") as string;
          upDocClsfNo = fd.get("docMclsfNo") as string;
          break;
      }

      const payload: Values = {
        ...defaults,
        docClsfNm: docClsfNm,
        upDocClsfNo: upDocClsfNo,
        docClsfSeCd: (fd.get("docClsfSeCd") as string) ?? docClsfSeCd,
        docLclsfNo: (fd.get("docLclsfNo") as string) ?? "",
        docMclsfNo: (fd.get("docMclsfNo") as string) ?? "",
        docSclsfNo: (fd.get("docSclsfNo") as string) ?? "",
        docLclsfNm: (fd.get("docLclsfNm") as string) ?? "",
        docMclsfNm: (fd.get("docMclsfNm") as string) ?? "",
        docSclsfNm: (fd.get("docSclsfNm") as string) ?? "",
        prvcInclYn: fd.get("prvcInclYn") ? "Y" : "N",
        useEn: (fd.get("useEn") as string) ?? defaults.useEn,
        prvcFileHldPrst: subDetail,
      };

      // 검증
      const { issues } = docClassificationvalidator(payload);
      if (issues && issues.length > 0) {
        setFormErrors(
          Object.fromEntries(
            issues.map((issue) => [issue.path?.[0] ?? "", issue.message])
          )
        );
        return;
      }
      setFormErrors({});

      setIsSubmitting(true);

      return;
      try {
        const isEditMode = Boolean(docClsfNo);

        if (isEditMode) {
          if (
            payload.prvcInclYn === "Y" &&
            (payload.prvcFileHldPrst?.hldPrdDfyrs !== hldPrdDfyrs ||
              payload.prvcFileHldPrst?.hldPrdMmCnt !== hldPrdMmCnt)
          ) {
            const confirmed = await dialogs.confirm(
              "보유기간 변경 시, 기존 개인정보파일에 대한 보유기간 수정에 대한 검토가 필요합니다. 해당화면으로 이동 하시겠습니다?",
              {
                severity: "error",
                okText: "확인",
                cancelText: "취소",
              }
            );

            if (confirmed) {
              navigate(URL.HOLDING_INSTITUTION_LIST);
              return;
            }
          } else {
            await updateDocClassificationData(payload as DocClassDetail);
            notifications.show("수정 완료.", {
              severity: "success",
              autoHideDuration: 3000,
            });
          }
        } else {
          await createDocClassificationData(
            payload as Omit<DocClassDetail, "docClsfNo">
          );
          notifications.show("생성 완료.", {
            severity: "success",
            autoHideDuration: 3000,
          });
        }

        navigate(URL.DOC_CLASSIFICATION_LIST);
      } catch (err) {
        notifications.show(`처리 실패. 사유: ${(err as Error).message}`, {
          severity: "error",
          autoHideDuration: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      defaults,
      docClsfSeCd,
      docClsfNo,
      navigate,
      hldPrdDfyrs,
      hldPrdMmCnt,
      dialogs,
      notifications,
    ]
  );

  const handleBack = React.useCallback(() => {
    navigate(URL.DOC_CLASSIFICATION_LIST);
  }, [navigate]);

  /* ---------------- 렌더링 ---------------- */

  if (isLoading || error) {
    return <PageStatus isLoading={isLoading} error={error} />;
  }

  const pageTitle = docClsfNo ? "수정" : "등록";

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: "문서고 관리", path: "/docClassification/list" },
        { title: "문서분류 관리", path: "/docClassification/list" },
        { title: pageTitle },
      ]}
    >
      <Box
        component="form"
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
      >
        <FormGroup>
          {/* 기본 정보 테이블 – 전부 defaultValue / defaultChecked만 사용 */}
          <Table
            size="small"
            sx={{ mb: "12px" }}
            aria-label="문서분류 구분 및 기본 정보"
          >
            <TableBody>
              {/* 분류 깊이 선택 */}
              {!defaults.docClsfNo && (
                <TableRow>
                  <TableCell colSpan={2}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        name="docClsfSeCd"
                        value={docClsfSeCd}
                        onChange={(e) => setdocClsfSeCd(e.target.value)}
                      >
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
                    {docClsfSeCd === "L" ? (
                      <TextField
                        name="docLclsfNm"
                        defaultValue={defaults.docLclsfNm ?? ""}
                        placeholder="대분류 메타정보"
                        error={!!formErrors.docLclsfNm}
                        helperText={formErrors.docLclsfNm ?? ""}
                        fullWidth
                      />
                    ) : (
                      <MuiSelect
                        id="docLclsfNo"
                        items={lclsfList}
                        value={defaults.docLclsfNo}
                        error={formErrors.docLclsfNo}
                        onChange={handleSelectChange}
                      />
                    )}
                  </Stack>
                </TableCell>
              </TableRow>

              {/* 중분류 */}
              {(docClsfSeCd === "M" || docClsfSeCd === "S") && (
                <TableRow>
                  <TableCell>중분류</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2}>
                      {docClsfSeCd === "M" ? (
                        <TextField
                          name="docMclsfNm"
                          defaultValue={defaults.docMclsfNm ?? ""}
                          placeholder="중분류 메타정보"
                          error={!!formErrors.docMclsfNm}
                          helperText={formErrors.docMclsfNm ?? ""}
                          fullWidth
                        />
                      ) : (
                        <MuiSelect
                          id="docMclsfNo"
                          items={mclsfList}
                          value={defaults.docMclsfNo}
                          error={formErrors.docMclsfNo}
                          onChange={handleSelectChange}
                        />
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              )}

              {/* 소분류 */}
              {docClsfSeCd === "S" && (
                <TableRow>
                  <TableCell>소분류</TableCell>
                  <TableCell>
                    <TextField
                      name="docSclsfNm"
                      defaultValue={defaults.docSclsfNm ?? ""}
                      placeholder="소분류"
                      error={!!formErrors.docSclsfNm}
                      helperText={formErrors.docSclsfNm ?? " "}
                      fullWidth
                    />
                    <MuiCheckbox
                      id="prvcInclYn"
                      label="개인정보포함"
                      checked={defaults.prvcInclYn === "Y"}
                      error={formErrors.prvcInclYn}
                      onChange={handleChange}
                    />
                  </TableCell>
                </TableRow>
              )}

              {/* 사용여부 */}
              {defaults.docClsfNo && (
                <TableRow>
                  <TableCell>사용여부</TableCell>
                  <TableCell>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        name="useEn"
                        defaultValue={defaults.useEn}
                      >
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

          {/* 개인정보 상세 – defaults.subDetail을 defaultValue로만 사용 */}
          {defaults.prvcInclYn === "Y" && (
            <PrvcDetailTable
              defaults={defaults.prvcFileHldPrst ?? {}}
              isDirectInputYear={isDirectInputYear}
              onChangeDirectInputYear={setIsDirectInputYear}
              isInfoAgree={isInfoAgree}
              onChangeInfoAgree={setIsInfoAgree}
              formErrors={formErrors}
            />
          )}
        </FormGroup>

        <Stack direction="row" spacing={2} justifyContent="right">
          <Button variant="contained" onClick={handleBack}>
            취소
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {docClsfNo ? "수정" : "등록"}
          </Button>
        </Stack>
      </Box>
    </PageContainer>
  );
}
