import * as React from "react";
import {Box, Breadcrumbs, Button, FormGroup, Grid, Stack, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router";
import AgGridContainer from "@/components/AgGridContainer/AgGridContainer";
import MuiSelect from "@/components/Elements/MuiSelect";
import MuiCheckbox from "@/components/Elements/MuiCheckbox";
import type {DocClassification, DocClassificationSearchState,} from "@/types/docClassification";
import type {ColDef} from "ag-grid-community";
import {listDefs} from "./col-def";
import {getDocClassificationList} from "@/services/docClassificationService";
import URL from "@/constants/url";
import {useSearchStateHandlers} from "@/hooks/InputStateHandlers/useInputStateHandlers";
import PageStatus from "@/components/PageStatus";
import SearchFilterContainer from "@/components/DocClassification/SearchFilterContainer.tsx";

export default function DocClassificationListPage() {
  const navigate = useNavigate();

  const [columnDefs] = React.useState<ColDef<any>[]>(listDefs);

  const [rowData, setRowsData] = React.useState<{
    rows: DocClassification[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const {
    values,
    handleTextFieldChange,
    handleSelectFieldChange,
    handleCheckboxFieldChange,
  } = useSearchStateHandlers<DocClassificationSearchState["values"]>();

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const listData = await getDocClassificationList();

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
      persnalData: values.hasPersonalInfo,
      useYn: values.useYn,
      keyword: values.keyword,
    });
  };

  const handleCreateClick = React.useCallback(() => {
    navigate(URL.DIGITAL_DOC_CREATE);
  }, [navigate]);

  const handleRowClick = (row: DocClassification) => {
    navigate(`/docClassification/${row.id}`);
  };

  if (isLoading || error) {
    return <PageStatus isLoading={isLoading} error={error}/>;
  }

  const pageTitle = "문서분류 관리";

  return (
    <div className="container">
      {/* <!-- Location --> */}
      <Box mb={2}>
        <Breadcrumbs aria-label="breadcrumb">
          {/*<Link underline="hover" color="inherit" href={URL.MAIN}>*/}
          {/*  HOME*/}
          {/*</Link>*/}
          <Typography sx={{color: 'text.primary'}}>문서고 관리</Typography>
          <Typography sx={{color: 'text.primary'}}>문서분류 관리</Typography>
        </Breadcrumbs>
      </Box>
      {/* <!--// Location --> */}

      {/* <!-- 본문 --> */}

      <Box mb={2}>
        <Typography variant="h3">
          {pageTitle}
        </Typography>
      </Box>

      {/* <!-- 검색조건 --> */}
      <SearchFilterContainer>
        <FormGroup>
          <Grid container mt={2} spacing={1} width="100%">
            {/* 1행: 대분류 / 중분류 / 소분류 / 개인정보 포함 */}
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
            <Grid size={{xs: 12, sm: 3}} sx={{display: "flex"}}>
              <MuiCheckbox
                id="hasPersonalInfo"
                label="개인정보 포함"
                checked={values.hasPersonalInfo ?? false}
                onChange={handleCheckboxFieldChange}
              />
            </Grid>
            {/* 2행: 사용유무 / 검색어 / 검색 버튼 */}
            <Grid size={{xs: 12, sm: 3}} sx={{display: "flex"}}>
              <MuiSelect
                id="useYn"
                label="사용유무"
                items={[
                  {value: "00", label: "전체"},
                  {value: "Y", label: "사용"},
                  {value: "N", label: "사용안함"},
                ]}
                value={values.useYn ?? "00"}
                onChange={handleSelectFieldChange}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 9}}>
              <TextField
                fullWidth
                name="keyword"
                placeholder="검색어"
                label="검색어"
                value={values.keyword ?? ""}
                onChange={handleTextFieldChange}
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

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={handleCreateClick}>
          등록
        </Button>
      </Stack>
      <Box sx={{flex: 1, width: "100%"}}>
        <AgGridContainer
          isLoading={isLoading}
          colDefs={columnDefs}
          rowData={rowData.rows}
          onRowClick={handleRowClick}
        />
      </Box>
    </div>
  );
}
