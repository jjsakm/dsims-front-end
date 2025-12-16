import * as React from "react";
import PageContainer from "@/components/PageContainer";
import AgGridContainer from "@/components/AgGridContainer/AgGridContainer";
import {
  Alert,
  Box,
  Button,
  Stack,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import MuiSelect from "@/components/Elements/MuiSelect";
import MuiCheckbox from "@/components/Elements/MuiCheckbox";
import type { SelectChangeEvent } from "node_modules/@mui/material";
import type { ColDef } from "ag-grid-community";
import { listDefs } from "./col-def";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { getHoldingInstitutionList } from "@/services/holdingInstitutionService";
import { useDialogs } from "@/hooks/useDialogs/useDialogs/useDialogs";
import type {
  HoldingInstitution,
  HoldingInstitutionFormState,
} from "@/types/holdingInstitution";
import type { FormFieldValue } from "@/types/common";

export default function DocDestructionDetailPage() {
  const dialogs = useDialogs();

  const [searchValues, setSearchValues] = React.useState<
    Partial<HoldingInstitutionFormState["values"]>
  >({});

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

  const handleFormFieldChange = React.useCallback(
    (
      name: keyof HoldingInstitutionFormState["values"],
      value: FormFieldValue
    ) => {
      const newSearchValues = { ...searchValues, [name]: value };

      setSearchValues(newSearchValues);
    },
    [searchValues]
  );

  const handleDateFieldChange = React.useCallback(
    (fieldName: keyof HoldingInstitutionFormState["values"]) =>
      (value: Dayjs | null) => {
        if (value?.isValid()) {
          handleFormFieldChange(fieldName, value.toISOString() ?? null);
        } else if (rowData[fieldName]) {
          handleFormFieldChange(fieldName, null);
        }
      },
    [rowData, handleFormFieldChange]
  );

  const handleSelectFieldChange = React.useCallback(
    (event: SelectChangeEvent) => {
      handleFormFieldChange(
        event.target.name as keyof HoldingInstitutionFormState["values"],
        event.target.value
      );
    },
    [handleFormFieldChange]
  );

  const handleTextFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFormFieldChange(
        event.target.name as keyof HoldingInstitutionFormState["values"],
        event.target.value
      );
    },
    [handleFormFieldChange]
  );

  const handleCheckboxFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      handleFormFieldChange(
        event.target.name as keyof HoldingInstitutionFormState["values"],
        checked
      );
    },
    [handleFormFieldChange]
  );

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
    console.log(searchValues);
  };

  const breadcrumbs = "보유기관 관리";
  const pageTitle = "보유기관 관리";

  return (
    <PageContainer title={pageTitle} breadcrumbs={[{ title: breadcrumbs }]}>
      <FormGroup>
        <Stack
          direction="row"
          spacing={2}
          mb={2}
          justifyContent="space-between"
        >
          <Grid container spacing={2} sx={{ mb: 2, width: "100%" }}>
            {/* 1행 */}
            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" spacing={2}>
                  <DatePicker
                    value={
                      searchValues.collectionStartDate
                        ? dayjs(searchValues.collectionStartDate)
                        : null
                    }
                    onChange={handleDateFieldChange("collectionStartDate")}
                    name="collectionStartDate"
                    label="수집일자"
                  />
                  <Typography>-</Typography>
                  <DatePicker
                    value={
                      searchValues.collectionStartDate
                        ? dayjs(searchValues.collectionStartDate)
                        : null
                    }
                    onChange={handleDateFieldChange("collectionStartDate")}
                    name="collectionStartDate"
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" spacing={2}>
                  <DatePicker
                    value={
                      searchValues.closeStartDate
                        ? dayjs(searchValues.closeStartDate)
                        : null
                    }
                    onChange={handleDateFieldChange("closeStartDate")}
                    name="closeStartDate"
                    label="종료일자"
                  />
                  <Typography>-</Typography>
                  <DatePicker
                    value={
                      searchValues.closeStartDate
                        ? dayjs(searchValues.closeStartDate)
                        : null
                    }
                    onChange={handleDateFieldChange("closeStartDate")}
                    name="closeStartDate"
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
            {/* 2행 */}
            <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
              <MuiSelect
                id="largeCategory"
                label="대분류"
                items={[
                  { value: "00", label: "전체" },
                  { value: "01", label: "피해구제" },
                ]}
                value={searchValues.largeCategory ?? "00"}
                onChange={handleSelectFieldChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
              <MuiSelect
                id="midCategory"
                label="중분류"
                items={[
                  { value: "00", label: "전체" },
                  { value: "01", label: "접수서류" },
                  { value: "02", label: "신청자 제출서류" },
                  { value: "03", label: "직원보완자료" },
                ]}
                value={searchValues.midCategory ?? "00"}
                onChange={handleSelectFieldChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
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
                value={searchValues.smallCategory ?? "00"}
                onChange={handleSelectFieldChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
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
                value={searchValues.retentionPeriod ?? "00"}
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
                value={searchValues.docNumber ?? ""}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                name="docTitle"
                placeholder="문서제목"
                label="문서제목"
                value={searchValues.docTitle ?? ""}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex" }}>
              <MuiCheckbox
                id="agreeYn"
                label="정보주체 동의여부"
                checked={searchValues.agreeYn ?? false}
                onChange={handleCheckboxFieldChange}
              />
            </Grid>
          </Grid>
          <Button variant="contained" onClick={handleSearch}>
            검색
          </Button>
        </Stack>
      </FormGroup>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button variant="contained" onClick={handleApplySelectedRows}>
          선택 반영
        </Button>
        <Button variant="contained" onClick={handleApplyAllRows}>
          일괄 반영
        </Button>
      </Stack>
      <Box sx={{ flex: 1, width: "100%" }}>
        {error ? (
          <Box sx={{ flexGrow: 1 }}>
            <Alert severity="error">{error.message}</Alert>
          </Box>
        ) : (
          <AgGridContainer
            isLoading={isLoading}
            enableRowSelection={true}
            colDefs={columnDefs}
            rowData={rowData.rows}
            onSelectionChange={handleSelectionChange}
          />
        )}
      </Box>
    </PageContainer>
  );
}
