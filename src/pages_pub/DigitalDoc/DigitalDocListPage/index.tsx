import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormGroup, Grid, TextField } from "@mui/material";
import MuiSelect from "@/components/Elements/MuiSelect";
import type { DigitalDocSearchState } from "@/types/digitalDoc";
import { useSearchStateHandlers } from "@/hooks/InputStateHandlers/useInputStateHandlers";
import SearchFilterContainer from "@/components/Container/SearchFilterContainer";
import VerticalTable, {
  type HeaderItem,
  type HistoryRow,
} from "@/components/Table/VerticalTable";

export default function DigitalDocListPage() {
  const { values, handleTextFieldChange, handleSelectFieldChange } =
    useSearchStateHandlers<DigitalDocSearchState["values"]>();

  const handleSearch = () => {
    // TODO: 검색 로직은 이후 구현
    console.log(values);
  };

  const header: HeaderItem[] = [
    { label: "번호", key: "id", width: "8%" },
    { label: "문서분류", key: "docClassification" },
    { label: "문서번호", key: "docNumber" },
    { label: "문서제목", key: "docTitle" },
    { label: "개인정보", key: "personalInfo" },
    { label: "수집일자(보존연한)", key: "collectDate" },
    { label: "종료일자", key: "endDate" },
    { label: "종류", key: "category" },
    { label: "등록자(부서)", key: "registrarDept" },
    { label: "등록일자", key: "regDate" },
  ];

  const content: HistoryRow[] = [
    {
      id: 1,
      docClassification: "피해구제 > ",
      docNumber: "KIDS-001",
      docTitle: "진료기록",
      personalInfo: "포함",
      collectDate: "25.09.01(반영구)",
      endDate: "99.12.31",
      category: "문서",
      registrarDept: "홍길동(정보화팀)",
      regDate: "25.09.21",
    },
    {
      id: 2,
      docClassification: "개발 > 시스템 설계",
      docNumber: "SYS-005",
      docTitle: "신규 서비스 아키텍처 설계 문서",
      personalInfo: "미포함",
      collectDate: "25.10.15(영구)",
      endDate: "미정",
      category: "설계서",
      registrarDept: "이순신(개발1팀)",
      regDate: "25.10.20",
    },
    {
      id: 3,
      docClassification: "인사 > 급여",
      docNumber: "HR-012",
      docTitle: "2025년 3분기 급여 정산 보고서",
      personalInfo: "포함(민감)",
      collectDate: "25.09.30(5년)",
      endDate: "30.09.30",
      category: "보고서",
      registrarDept: "유관순(인사팀)",
      regDate: "25.10.05",
    },
    {
      id: 4,
      docClassification: "영업 > 계약",
      docNumber: "SALE-023",
      docTitle: "A사 신규 서비스 공급 계약서",
      personalInfo: "포함",
      collectDate: "25.11.01(10년)",
      endDate: "35.11.01",
      category: "계약서",
      registrarDept: "강감찬(영업3팀)",
      regDate: "25.11.05",
    },
    {
      id: 5,
      docClassification: "재무 > 세금",
      docNumber: "TAX-007",
      docTitle: "2024년 법인세 신고 자료",
      personalInfo: "미포함",
      collectDate: "25.02.10(7년)",
      endDate: "32.02.10",
      category: "신고서",
      registrarDept: "세종대왕(재무팀)",
      regDate: "25.02.15",
    },
    {
      id: 6,
      docClassification: "홍보 > 이벤트",
      docNumber: "PR-003",
      docTitle: "크리스마스 프로모션 기획안",
      personalInfo: "미포함",
      collectDate: "25.11.20(1년)",
      endDate: "26.11.20",
      category: "기획안",
      registrarDept: "신사임당(홍보팀)",
      regDate: "25.11.22",
    },
    {
      id: 7,
      docClassification: "법무 > 규정",
      docNumber: "LAW-001",
      docTitle: "개인정보보호정책 개정",
      personalInfo: "포함",
      collectDate: "25.01.01(영구)",
      endDate: "미정",
      category: "규정",
      registrarDept: "김유신(법무팀)",
      regDate: "25.01.05",
    },
  ];

  return (
    <Box>
      <SearchFilterContainer>
        <FormGroup>
          <Grid container mt={2} spacing={2} width="100%">
            {/* 1행 */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <MuiSelect
                id="largeCategory"
                label="대분류"
                items={[
                  { value: "00", label: "전체" },
                  { value: "01", label: "피해구제" },
                ]}
                value={values.largeCategory ?? "00"}
                onChange={handleSelectFieldChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <MuiSelect
                id="midCategory"
                label="중분류"
                items={[
                  { value: "00", label: "전체" },
                  { value: "01", label: "접수서류" },
                  { value: "02", label: "신청자 제출서류" },
                  { value: "03", label: "직원보완자료" },
                ]}
                value={values.midCategory ?? "00"}
                onChange={handleSelectFieldChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <MuiSelect
                id="smallCategory"
                label="소분류"
                items={[
                  { value: "00", label: "전체" },
                  { value: "01", label: "사망 신청" },
                  { value: "02", label: "미성년자 신청" },
                  { value: "03", label: "이전문서" },
                  { value: "04", label: "의무기록" },
                ]}
                value={values.smallCategory ?? "00"}
                onChange={handleSelectFieldChange}
              />
            </Grid>
            {/* 2행 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                name="docNum"
                placeholder="문서번호"
                label="문서번호"
                value={values.docNum ?? ""}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                name="docTitle"
                placeholder="문서제목"
                label="문서제목"
                value={values.docTitle ?? ""}
                onChange={handleTextFieldChange}
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Button variant="contained" onClick={handleSearch}>
              검색
            </Button>
          </Box>
        </FormGroup>
      </SearchFilterContainer>

      <Box>
        <VerticalTable headers={[header]} rows={content}></VerticalTable>
      </Box>
    </Box>
  );
}
