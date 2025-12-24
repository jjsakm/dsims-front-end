import * as React from "react";
import PageContainer from "@/components/AgGridContainer/PageContainer.tsx";
import AgGridContainer from "@/components/AgGridContainer/AgGridContainer";
import {
  Box,
  Button,
  FormGroup,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MuiSelect from "@/components/Elements/MuiSelect";
import MuiCheckbox from "@/components/Elements/MuiCheckbox";
import type { ColDef } from "ag-grid-community";
import { listDefs } from "./col-def";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { getHoldingInstitutionList } from "@/services/holdingInstitutionService";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import type {
  HoldingInstitution,
  SearchValues,
} from "@/types/holdingInstitution";
import PageStatus from "@/components/PageStatus";
import SearchFilterContainer from "@/components/Container/SearchFilterContainer";
import { useForm, Controller } from "react-hook-form";
import type { SelectItem } from "@/types/common";
import {
  useDocClsfChildrenLive,
  useLclsfListLive,
} from "@/hooks/query/useDocClsfTree";

const initSelectItem: SelectItem[] = [
  {
    label: "전체",
    value: "",
  },
];

export default function HoldingInstitutionListPage() {
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

  const { control, handleSubmit, watch, setValue } = useForm<SearchValues>({
    defaultValues: {
      collectionStartDate: dayjs().format("YYYYMMDD"),
      collectionEndDate: dayjs().format("YYYYMMDD"),
      closeStartDate: dayjs().format("YYYYMMDD"),
      closeEndDate: dayjs().format("YYYYMMDD"),
      docLclsfNo: "",
      docMclsfNo: "",
      docSclsfNo: "",
      retentionPeriod: "",
      docNumber: "",
      docTitle: "",
      agreeYn: false,
    },
  });

  const docLclsfNo = watch("docLclsfNo"); // 대분류
  const docMclsfNo = watch("docMclsfNo"); // 중분류

  // react-query 적용 소스
  const { data: lclsfDocs } = useLclsfListLive();
  const { data: mclsfDocs } = useDocClsfChildrenLive(docLclsfNo);
  const { data: sclsfDocs } = useDocClsfChildrenLive(docMclsfNo);

  const lclsfList = lclsfDocs
    ? [
        ...initSelectItem,
        ...lclsfDocs.map((vo) => ({
          label: vo.docClsfNm,
          value: vo.docClsfNo,
        })),
      ]
    : initSelectItem;
  const mclsfList = mclsfDocs
    ? [
        ...initSelectItem,
        ...mclsfDocs.map((vo) => ({
          label: vo.docClsfNm,
          value: vo.docClsfNo,
        })),
      ]
    : initSelectItem;
  const sclsfList = sclsfDocs
    ? [
        ...initSelectItem,
        ...sclsfDocs.map((vo) => ({
          label: vo.docClsfNm,
          value: vo.docClsfNo,
        })),
      ]
    : initSelectItem;

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

  const handleSearch = (data: SearchValues) => {
    // TODO: 검색 로직은 이후 AgGrid 연동 시 구현
    console.log(data);
  };

  if (isLoading || error) {
    return <PageStatus isLoading={isLoading} error={error} />;
  }

  return (
    <PageContainer>
      <SearchFilterContainer>
        <FormGroup>
          <form onSubmit={handleSubmit(handleSearch)}>
            <Grid container mt={2} spacing={2} width="100%">
              {/* 1행 */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="ko" // 한국어
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Controller
                      name="collectionStartDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="수집일자"
                          format="YYYY-MM-DD" // 화면에 보이는 형식
                          {...field}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date) =>
                            field.onChange(
                              date ? dayjs(date).format("YYYYMMDD") : ""
                            )
                          }
                        />
                      )}
                    />
                    <Typography>-</Typography>
                    <Controller
                      name="collectionEndDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label=""
                          format="YYYY-MM-DD" // 화면에 보이는 형식
                          {...field}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date) =>
                            field.onChange(
                              date ? dayjs(date).format("YYYYMMDD") : ""
                            )
                          }
                        />
                      )}
                    />
                  </Stack>
                </LocalizationProvider>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="ko" // 한국어
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Controller
                      name="closeStartDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="종료일자"
                          format="YYYY-MM-DD" // 화면에 보이는 형식
                          {...field}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date) =>
                            field.onChange(
                              date ? dayjs(date).format("YYYYMMDD") : ""
                            )
                          }
                        />
                      )}
                    />
                    <Typography>-</Typography>
                    <Controller
                      name="closeEndDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label=""
                          format="YYYY-MM-DD" // 화면에 보이는 형식
                          {...field}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date) =>
                            field.onChange(
                              date ? dayjs(date).format("YYYYMMDD") : ""
                            )
                          }
                        />
                      )}
                    />
                  </Stack>
                </LocalizationProvider>
              </Grid>
              {/* 2행 */}
              <Grid size={{ xs: 12, sm: 3 }}>
                <Controller
                  name="docLclsfNo"
                  control={control}
                  render={({ field }) => (
                    <MuiSelect
                      id="docLclsfNo"
                      label="대분류"
                      items={lclsfList}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setValue("docMclsfNo", "");
                        setValue("docSclsfNo", "");
                      }}
                    />
                  )}
                />
              </Grid>
              {/* ... 나머지 Select, TextField, Checkbox도 동일하게 Controller로 감싸기 */}
              <Grid size={{ xs: 12, sm: 3 }}>
                <Controller
                  name="docMclsfNo"
                  control={control}
                  render={({ field }) => (
                    <MuiSelect
                      id="docMclsfNo"
                      label="중분류"
                      items={mclsfList}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setValue("docSclsfNo", "");
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <Controller
                  name="docSclsfNo"
                  control={control}
                  render={({ field }) => (
                    <MuiSelect
                      id="docSclsfNo"
                      label="소분류"
                      items={sclsfList}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <Controller
                  name="retentionPeriod"
                  control={control}
                  render={({ field }) => (
                    <MuiSelect
                      id="retentionPeriod"
                      label="보유기간"
                      items={[
                        { value: "", label: "전체" },
                        { value: "1", label: "1년" },
                        { value: "3", label: "3년" },
                        { value: "5", label: "5년" },
                        { value: "10", label: "10년" },
                        { value: "30", label: "30년" },
                        { value: "90", label: "준영구" },
                        { value: "99", label: "영구" },
                        { value: "0", label: "직접입력" },
                      ]}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </Grid>
              {/* 3행 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                  name="docNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      placeholder="문서번호"
                      label="문서번호"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="docTitle"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      placeholder="문서제목"
                      label="문서제목"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 2 }}>
                <Controller
                  name="agreeYn"
                  control={control}
                  render={({ field }) => (
                    <MuiCheckbox
                      id="agreeYn"
                      label="정보주체 동의여부"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="flex-end">
              <Button variant="contained" type="submit">
                검색
              </Button>
            </Box>
          </form>
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
