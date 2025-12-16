import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router";
import PageContainer from "@/components/PageContainer";
import AgGridContainer from "@/components/AgGridContainer/AgGridContainer";
import MuiSelect from "@/components/Elements/MuiSelect";
import MuiCheckbox from "@/components/Elements/MuiCheckbox";
import type { SelectChangeEvent } from "node_modules/@mui/material";
import type {
  DocClassification,
  DocClassificationSearchState,
} from "@/types/docClassification";
import type { ColDef } from "ag-grid-community";
import { listDefs } from "./col-def";
import { getDocClassificationList } from "@/services/docClassificationService";
import type { FormFieldValue } from "@/types/common";
import URL from "@/constants/url";

export default function DocClassificationListPage() {
  const navigate = useNavigate();

  const [searchValues, setSearchValues] = React.useState<
    Partial<DocClassificationSearchState["values"]>
  >({});

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

  const handleFormFieldChange = React.useCallback(
    (
      name: keyof DocClassificationSearchState["values"],
      value: FormFieldValue
    ) => {
      const newSearchValues = { ...searchValues, [name]: value };

      setSearchValues(newSearchValues);
    },
    [searchValues]
  );

  const handleSelectFieldChange = React.useCallback(
    (event: SelectChangeEvent) => {
      handleFormFieldChange(
        event.target.name as keyof DocClassificationSearchState["values"],
        event.target.value
      );
    },
    [handleFormFieldChange]
  );

  const handleTextFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFormFieldChange(
        event.target.name as keyof DocClassificationSearchState["values"],
        event.target.value
      );
    },
    [handleFormFieldChange]
  );

  const handleCheckboxFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      handleFormFieldChange(
        event.target.name as keyof DocClassificationSearchState["values"],
        checked
      );
    },
    [handleFormFieldChange]
  );

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
      firstCategory: searchValues.largeCategory,
      secondCategory: searchValues.midCategory,
      thirdCategory: searchValues.smallCategory,
      persnalData: searchValues.hasPersonalInfo,
      useYn: searchValues.useYn,
      keyword: searchValues.keyword,
    });
  };

  const handleCreateClick = React.useCallback(() => {
    navigate(URL.DIGITAL_DOC_CREATE);
  }, [navigate]);

  const handleRowClick = (row: DocClassification) => {
    navigate(`/docClassification/${row.id}`);
  };
  
  const breadcrumbs = "문서고 관리 > 문서분류 관리";
  const pageTitle = "문서분류 관리";

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
            {/* 1행: 대분류 / 중분류 / 소분류 / 개인정보 포함 */}
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
              <MuiCheckbox
                id="hasPersonalInfo"
                label="개인정보 포함"
                checked={searchValues.hasPersonalInfo ?? false}
                onChange={handleCheckboxFieldChange}
              />
            </Grid>
            {/* 2행: 사용유무 / 검색어 / 검색 버튼 */}
            <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
              <MuiSelect
                id="useYn"
                label="사용유무"
                items={[
                  { value: "00", label: "전체" },
                  { value: "Y", label: "사용" },
                  { value: "N", label: "사용안함" },
                ]}
                value={searchValues.useYn ?? "00"}
                onChange={handleSelectFieldChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 9 }}>
              <TextField
                fullWidth
                name="keyword"
                placeholder="검색어"
                label="검색어"
                value={searchValues.keyword ?? ""}
                onChange={handleTextFieldChange}
              />
            </Grid>
          </Grid>
          <Button variant="contained" onClick={handleSearch}>
            검색
          </Button>
        </Stack>
      </FormGroup>
      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={handleCreateClick}>
          등록
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
            colDefs={columnDefs}
            rowData={rowData.rows}
            onRowClick={handleRowClick}
          />
        )}
      </Box>
    </PageContainer>
  );
}
