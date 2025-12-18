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
  DocClsf,
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
import { getDocClsfList, getLclsfList } from "@/services/bizCommon";

const initSelectItem: SelectItem[] = [
  {
    label: "전체",
    value: "",
  },
];

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

  const [lclsfList, setLclsfList] =
    React.useState<SelectItem[]>(initSelectItem);
  const [mclsfList, setMclsfList] =
    React.useState<SelectItem[]>(initSelectItem);
  const [sclsfList, setSclsfList] =
    React.useState<SelectItem[]>(initSelectItem);

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
          getDocClsfCodeList(name, value);
          break;
        case "mclsfNo":
          next.sclsfNo = "";
          getDocClsfCodeList(name, value);
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

  const getLclsfCodeList = React.useCallback(async () => {
    setError(null);

    try {
      const list = await getLclsfList();

      const resultList: SelectItem[] = list.map((vo: DocClsf) => {
        return {
          label: vo.docClsfNm,
          value: vo.docClsfNo,
        };
      });
      setLclsfList([...initSelectItem, ...resultList]);
    } catch (e) {
      setError(e as Error);
    }
  }, []);

  const getDocClsfCodeList = React.useCallback(
    async (name: string, docClsfNo: string) => {
      setError(null);

      try {
        const list = await getDocClsfList(docClsfNo);

        const resultList: SelectItem[] = list.map((vo: DocClsf) => {
          return {
            label: vo.docClsfNm,
            value: vo.docClsfNo,
          };
        });

        if (name === "lclsfNo") {
          setMclsfList([...initSelectItem, ...resultList]);
        } else {
          setSclsfList([...initSelectItem, ...resultList]);
        }
      } catch (e) {
        setError(e as Error);
      }
    },
    []
  );

  React.useEffect(() => {
    loadData();
    getLclsfCodeList();
  }, [getLclsfCodeList, loadData]);

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
                items={lclsfList}
                value={values.lclsfNo ?? ""}
                onChange={handleSelectChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
              <MuiSelect
                id="mclsfNo"
                label="중분류"
                items={mclsfList}
                value={values.mclsfNo ?? ""}
                onChange={handleSelectChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex" }}>
              <MuiSelect
                id="sclsfNo"
                label="소분류"
                items={sclsfList}
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
