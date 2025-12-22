import * as React from "react";
import PageContainer from "@/components/AgGridContainer/PageContainer.tsx";
import AgGridContainer from "@/components/AgGridContainer/AgGridContainer";
import {Box, Button, FormGroup, Grid, Stack, TextField, Typography,} from "@mui/material";
import MuiSelect from "@/components/Elements/MuiSelect";
import MuiCheckbox from "@/components/Elements/MuiCheckbox";
import type {ColDef} from "ag-grid-community";
import {listDefs} from "./col-def";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {getHoldingInstitutionList} from "@/services/holdingInstitutionService";
import {useDialogs} from "@/hooks/useDialogs/useDialogs";
import type {HoldingInstitution, HoldingInstitutionSearchState,} from "@/types/holdingInstitution";
import {useSearchStateHandlers} from "@/hooks/InputStateHandlers/useInputStateHandlers";
import PageStatus from "@/components/PageStatus";
import SearchFilterContainer from "@/components/Layout/docClassification/SearchFilterContainer.tsx";

export default function DocDestructionDetailPage() {
  const dialogs = useDialogs();

  const [columnDefs] = React.useState<ColDef<any>[]>(listDefs);

  const [rowData, setRowsData] = React.useState<{
    rows: HoldingInstitution[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const [selectedRows, setSelectedRows] = React.useState<HoldingInstitution[]>(
    []
  );

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const {
    values,
    handleTextFieldChange,
    handleSelectFieldChange,
    handleCheckboxFieldChange,
    handleDateFieldChange,
  } = useSearchStateHandlers<HoldingInstitutionSearchState["values"]>();

  const handleSelectionChange = React.useCallback(
    (rows: HoldingInstitution[]) => {
      setSelectedRows(rows);
    },
    []
  );

  const handleApplySelectedRows = React.useCallback(async () => {
    console.log("선택된 행:", selectedRows);

    const confirmed = await dialogs.confirm(
      "선택된 파일에 대한 문서분류의 현재 보유기간으로 변경됩니다. 변경하시겠습니까? (※ 정보주체 동의를 받아 수집한 경우, 반드시 변경된 보유기간으로 재동의를 받으셔야 합니다. )",
      {
        title: "보유기간 변경",
        severity: "info",
        okText: "확인",
        cancelText: "취소",
      }
    );
    if (confirmed) {
      // TODO: 추가 기능 구현 필요 (선택된 행에 대한 반영 로직을 여기에서 구현)
      // 사용자가 "확인"을 클릭한 경우 실행할 로직
      console.log("사용자가 변경을 확인했습니다.");
    }
  }, [dialogs, selectedRows]);

  const handleApplyAllRows = React.useCallback(async () => {
    // AG Grid에 전달된 전체 row 데이터
    const allRows = rowData.rows;
    console.log("전체 행:", allRows);

    const confirmed = await dialogs.confirm(
      "전체 파일에 대한 문서분류의 현재 보유기간으로 변경됩니다. 변경하시겠습니까? (※ 정보주체 동의를 받아 수집한 경우, 반드시 변경된 보유기간으로 재동의를 받으셔야 합니다. )",
      {
        title: "보유기간 변경",
        severity: "info",
        okText: "확인",
        cancelText: "취소",
      }
    );
    if (confirmed) {
      // TODO: 추가 기능 구현 필요 (전체 행(allRows)에 대한 반영 로직을 여기에서 구현)
      // 사용자가 "확인"을 클릭한 경우 실행할 로직
      console.log("사용자가 전체 파일 보유기간을 변경을 확인했습니다.");
    }
  }, [dialogs, rowData.rows]);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const listData = await getHoldingInstitutionList();

      setRowsData({
        rows: listData.items,
        rowCount: listData.itemCount,
      });
    } catch (listDataError) {
      setError(listDataError as Error);
    }

    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = () => {
    // TODO: 검색 로직은 이후 AgGrid 연동 시 구현
    console.log(values);
  };

  if (isLoading || error) {
    return <PageStatus isLoading={isLoading} error={error} />;
  }

  return (
    <PageContainer>
      {/* <!-- 검색조건 --> */}
      <SearchFilterContainer>
        <FormGroup>
          <Grid container mt={2} spacing={2} width="100%">
            {/* 1행 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <DatePicker
                    value={
                      values.collectionStartDate
                        ? dayjs(values.collectionStartDate)
                        : null
                    }
                    onChange={handleDateFieldChange("collectionStartDate")}
                    name="collectionStartDate"
                    label="수집일자"
                  />
                  <Typography>-</Typography>
                  <DatePicker
                    value={
                      values.collectionStartDate
                        ? dayjs(values.collectionStartDate)
                        : null
                    }
                    onChange={handleDateFieldChange("collectionStartDate")}
                    name="collectionStartDate"
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <DatePicker
                    value={
                      values.closeStartDate
                        ? dayjs(values.closeStartDate)
                        : null
                    }
                    onChange={handleDateFieldChange("closeStartDate")}
                    name="closeStartDate"
                    label="종료일자"
                  />
                  <Typography>-</Typography>
                  <DatePicker
                    value={
                      values.closeStartDate
                        ? dayjs(values.closeStartDate)
                        : null
                    }
                    onChange={handleDateFieldChange("closeStartDate")}
                    name="closeStartDate"
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
            {/* 2행 */}
            <Grid size={{ xs: 12, sm: 3 }}>
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
            <Grid size={{ xs: 12, sm: 3 }}>
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
            <Grid size={{ xs: 12, sm: 3 }}>
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
            <Grid size={{ xs: 12, sm: 3 }}>
              <MuiSelect
                id="retentionPeriod"
                label="보유기간"
                items={[
                  { value: "00", label: "전체" },
                  { value: "01", label: "사망 신청" },
                  { value: "02", label: "미성년자 신청" },
                  { value: "03", label: "이전문서" },
                  { value: "04", label: "의무기록" },
                ]}
                value={values.retentionPeriod ?? "00"}
                onChange={handleSelectFieldChange}
              />
            </Grid>
            {/* 3행 */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                name="docNumber"
                placeholder="문서번호"
                label="문서번호"
                value={values.docNumber ?? ""}
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
            <Grid size={{ xs: 12, sm: 2 }}>
              <MuiCheckbox
                id="agreeYn"
                label="정보주체 동의여부"
                checked={values.agreeYn ?? false}
                onChange={handleCheckboxFieldChange}
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSearch}>
              검색
            </Button>
          </Box>
        </FormGroup>
      </SearchFilterContainer>

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button variant="contained" onClick={handleApplySelectedRows}>
          선택 반영
        </Button>
        <Button variant="contained" onClick={handleApplyAllRows}>
          일괄 반영
        </Button>
      </Stack>
      <Box sx={{ flex: 1, width: "100%" }}>
        <AgGridContainer
          isLoading={isLoading}
          enableRowSelection={true}
          colDefs={columnDefs}
          rowData={rowData.rows}
          onSelectionChange={handleSelectionChange}
        />
      </Box>
    </PageContainer>
  );
}
