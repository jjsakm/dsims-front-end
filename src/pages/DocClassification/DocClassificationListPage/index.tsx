import * as React from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  FormGroup,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useNavigate } from "react-router";
import AgGridContainer from "@/components/AgGridContainer/AgGridContainer";
import MuiSelect from "@/components/Elements/MuiSelect";
import MuiCheckbox from "@/components/Elements/MuiCheckbox";
import type {
  DocClassification,
  DocClassificationSearchState,
  SearchValues,
} from "@/types/docClassification";
import type { ColDef } from "ag-grid-community";
import { listDefs } from "./col-def";
import { getDocClassificationList } from "@/services/docClassificationService";
import URL from "@/constants/url";
import { useSearchStateHandlers } from "@/hooks/InputStateHandlers/useInputStateHandlers";
import PageStatus from "@/components/PageStatus";
import SearchFilterContainer from "@/components/Layout/docClassification/SearchFilterContainer.tsx";
import type { SelectItem } from "@/types/common";
import { getDocClsfList } from "@/services/bizCommon";

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

  const [lclsfList, setLclsfList] = React.useState<SelectItem>();

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const initialValues: SearchValues = {
    lclsfNo: "",
    mclsfNo: "",
    sclsfNo: "",
    prvcInclYn: "N",
    useYn: "",
    keyword: "",
  };

  const {
    values,
    setValues,
    handleTextFieldChange,
    handleSelectFieldChange,
    handleCheckboxFieldYnChange,
  } =
    useSearchStateHandlers<DocClassificationSearchState["values"]>(
      initialValues
    );

  // 대분류, 중분류용
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;

    setValues((prev) => {
      const next = { ...prev, [name]: value as string };

      switch (name) {
        case "lclsfNo":
          next.mclsfNo = "";
          next.sclsfNo = "";
          break;
        case "mclsfNo":
          next.sclsfNo = "";
          break;
        default:
          break;
      }
      // 대분류 변경 시 중분류/소분류 초기화

      return next;
    });
  };

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

  const getDocClsfCodeList = React.useCallback(
    async (name: string, docClsfNo: string) => {
      setError(null);
      setIsLoading(true);

      try {
        const list = await getDocClsfList(docClsfNo);

        setLclsfList(list);
      } catch (e) {
        setError(e as Error);
      }

      setIsLoading(false);
    },
    []
  );

  React.useEffect(() => {
    loadData();
    getDocClsfCodeList("lclsfNo", "");
  }, [loadData]);

  const handleSearch = () => {
    // TODO: 검색 로직은 이후 AgGrid 연동 시 구현

    console.log(values);
  };

  const handleCreateClick = React.useCallback(() => {
    navigate(URL.DIGITAL_DOC_CREATE);
  }, [navigate]);

  const handleRowClick = (row: DocClassification) => {
    navigate(`/docClassification/${row.id}`);
  };

  if (isLoading || error) {
    return <PageStatus isLoading={isLoading} error={error} />;
  }

  const pageTitle = "문서분류 관리";

  return (
    <div className="container">
      {/* <!-- Location --> */}
      <Box mb={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href={URL.MAIN}>
            HOME
          </Link>
          <Typography sx={{ color: "text.primary" }}>문서고 관리</Typography>
        </Breadcrumbs>
      </Box>
      {/* <!--// Location --> */}

      {/* <!-- 본문 --> */}

      <Box mb={2}>
        <Typography variant="h3">{pageTitle}</Typography>
      </Box>

      {/* <!-- 검색조건 --> */}
      <SearchFilterContainer>
        <FormGroup>
          <Grid container mt={2} spacing={2} width="100%">
            {/* 1행: 대분류 / 중분류 / 소분류 / 개인정보 포함 */}
            <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
              <MuiSelect
                id="lclsfNo"
                label="대분류"
                items={[
                  { value: "", label: "전체" },
                  {
                    value: "01",
                    label:
                      "피해구제,....ㅁ아d럼 아ㅓ라 ㅓ마ㅓㄴ아 ㅓㅏ어d라...d zmzmzm ",
                  },
                ]}
                value={values.lclsfNo ?? ""}
                onChange={handleSelectChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
              <MuiSelect
                id="mclsfNo"
                label="중분류"
                items={[
                  { value: "", label: "전체" },
                  { value: "01", label: "접수서류" },
                  { value: "02", label: "신청자 제출서류" },
                  { value: "03", label: "직원보완자료" },
                ]}
                value={values.mclsfNo ?? ""}
                onChange={handleSelectChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
              <MuiSelect
                id="sclsfNo"
                label="소분류"
                items={[
                  { value: "", label: "전체" },
                  { value: "01", label: "사망 신청" },
                  { value: "02", label: "미성년자 신청" },
                  { value: "03", label: "이전문서" },
                  { value: "04", label: "의무기록" },
                ]}
                value={values.sclsfNo ?? ""}
                onChange={handleSelectFieldChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
              <MuiCheckbox
                id="prvcInclYn"
                label="개인정보 포함"
                checked={values.prvcInclYn === "Y"}
                onChange={handleCheckboxFieldYnChange}
              />
            </Grid>
            {/* 2행: 사용유무 / 검색어 / 검색 버튼 */}
            <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
              <MuiSelect
                id="useYn"
                label="사용유무"
                items={[
                  { value: "", label: "전체" },
                  { value: "Y", label: "사용" },
                  { value: "N", label: "사용안함" },
                ]}
                value={values.useYn ?? ""}
                onChange={handleSelectFieldChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 9 }}>
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
      <Box sx={{ flex: 1, width: "100%" }}>
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
