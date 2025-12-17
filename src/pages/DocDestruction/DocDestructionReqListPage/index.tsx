import * as React from "react";
import PageContainer from "@/components/PageContainer";
import AgGridContainer from "@/components/AgGridContainer/AgGridContainer";
import {
  Alert,
  Box,
  Button,
  FormGroup,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import MuiSelect from "@/components/Elements/MuiSelect";
import type { ColDef } from "ag-grid-community";
import { listDefs } from "./col-def";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import type {
  DocDestruction,
  DocDestructionSearchState,
} from "@/types/docDestruction";
import { getDocDestructionList } from "@/services/docDestructionService";
import DocDestructionReqButton from "@/components/Buttons/DocDestructionReqButton";
import { useSearchStateHandlers } from "@/hooks/InputStateHandlers/useInputStateHandlers";
import PageStatus from "@/components/PageStatus";

export default function DocDestructionReqListPage() {
  const [columnDefs] = React.useState<ColDef<any>[]>(listDefs);

  const [rowData, setRowsData] = React.useState<{
    rows: DocDestruction[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const [selectedRows, setSelectedRows] = React.useState<DocDestruction[]>([]);

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const { values, handleSelectFieldChange, handleDateFieldChange } =
    useSearchStateHandlers<DocDestructionSearchState["values"]>();

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const listData = await getDocDestructionList();

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
    console.log({
      firstCategory: values.largeCategory,
      secondCategory: values.midCategory,
      thirdCategory: values.smallCategory,
    });
  };

  const handleSelectionChange = React.useCallback((rows: DocDestruction[]) => {
    setSelectedRows(rows);
  }, []);

  if (isLoading || error) {
    return <PageStatus isLoading={isLoading} error={error} />;
  }

  const breadcrumbs = "파기문서 관리 > 파기 신청";
  const pageTitle = "파기 신청";

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
            <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
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
                value={values.midCategory ?? "00"}
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
                value={values.smallCategory ?? "00"}
                onChange={handleSelectFieldChange}
              />
            </Grid>
            {/* 2행 */}
            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" spacing={2}>
                  <DatePicker
                    value={
                      values.destructionStartDate
                        ? dayjs(values.destructionStartDate)
                        : null
                    }
                    onChange={handleDateFieldChange("destructionStartDate")}
                    name="destructionStartDate"
                    label="파기일자"
                  />
                  <Typography>-</Typography>
                  <DatePicker
                    value={
                      values.destructionEndDate
                        ? dayjs(values.destructionEndDate)
                        : null
                    }
                    onChange={handleDateFieldChange("destructionEndDate")}
                    name="destructionEndDate"
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Button variant="contained" onClick={handleSearch}>
            검색
          </Button>
        </Stack>
      </FormGroup>
      <Stack direction="row" spacing={1}>
        <DocDestructionReqButton selectedRows={selectedRows} />
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
