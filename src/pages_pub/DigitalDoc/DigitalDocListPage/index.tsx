import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import {useNavigate} from "react-router";
import PageContainer from "@/components/AgGridContainer/PageContainer.tsx";
import AgGridContainer from "@/components/AgGridContainer/AgGridContainer";
import {FormGroup, Grid, TextField} from "@mui/material";
import MuiSelect from "@/components/Elements/MuiSelect";
import type {ColDef} from "ag-grid-community";
import {listDefs} from "./col-def";
import type {DigitalDoc, DigitalDocSearchState} from "@/types/digitalDoc";
import {getDigitalDocList} from "@/services/digitalDocService";
import {useSearchStateHandlers} from "@/hooks/InputStateHandlers/useInputStateHandlers";
import PageStatus from "@/components/PageStatus";

export default function DigitalDocListPage() {
  const navigate = useNavigate();

  const [columnDefs] = React.useState<ColDef<any>[]>(listDefs);

  const {values, handleTextFieldChange, handleSelectFieldChange} =
    useSearchStateHandlers<DigitalDocSearchState["values"]>();

  const [rowData, setRowsData] = React.useState<{
    rows: DigitalDoc[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const listData = await getDigitalDocList();

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
    // TODO: 검색 로직은 이후 구현
    console.log(values);
  };

  const handleRowClick = (row: DigitalDoc) => {
    navigate(`/digitalDoc/${row.id}`);
  };

  if (isLoading || error) {
    return <PageStatus isLoading={isLoading} error={error}/>;
  }

  const breadcrumbs = "문서고 관리 > 전자문서 관리";
  const pageTitle = "전자문서 관리";

  return (
    <PageContainer title={pageTitle} breadcrumbs={[{title: breadcrumbs}]}>
      <FormGroup>
        <Stack
          direction="row"
          spacing={2}
          mb={2}
          justifyContent="space-between"
        >
          <Grid container spacing={2} sx={{mb: 2, width: "100%"}}>
            {/* 1행 */}
            <Grid size={{xs: 12, sm: 3}} sx={{display: "flex"}}>
              <MuiSelect
                id="largeCategory"
                label="대분류"
                items={[
                  {value: "00", label: "전체"},
                  {value: "01", label: "피해구제"},
                ]}
                value={values.largeCategory ?? "00"}
                onChange={handleSelectFieldChange}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 3}} sx={{display: "flex"}}>
              <MuiSelect
                id="midCategory"
                label="중분류"
                items={[
                  {value: "00", label: "전체"},
                  {value: "01", label: "접수서류"},
                  {value: "02", label: "신청자 제출서류"},
                  {value: "03", label: "직원보완자료"},
                ]}
                value={values.midCategory ?? "00"}
                onChange={handleSelectFieldChange}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 3}} sx={{display: "flex"}}>
              <MuiSelect
                id="smallCategory"
                label="소분류"
                items={[
                  {value: "00", label: "전체"},
                  {value: "01", label: "사망 신청"},
                  {value: "02", label: "미성년자 신청"},
                  {value: "03", label: "이전문서"},
                  {value: "04", label: "의무기록"},
                ]}
                value={values.smallCategory ?? "00"}
                onChange={handleSelectFieldChange}
              />
            </Grid>
            {/* 2행 */}
            <Grid size={{xs: 12, sm: 6}}>
              <TextField
                fullWidth
                name="docNum"
                placeholder="문서번호"
                label="문서번호"
                value={values.docNum ?? ""}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
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
          <Button variant="contained" onClick={handleSearch}>
            검색
          </Button>
        </Stack>
      </FormGroup>

      <Box sx={{flex: 1, width: "100%"}}>
        <AgGridContainer
          isLoading={isLoading}
          colDefs={columnDefs}
          rowData={rowData.rows}
          onRowClick={handleRowClick}
        />
      </Box>
    </PageContainer>
  );
}
