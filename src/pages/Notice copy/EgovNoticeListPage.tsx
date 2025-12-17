import { useState } from "react";
import { useNavigate } from "react-router";
import { NOTICE_BBS_ID } from "@/config";
import PageContainer from "@/components/PageContainer";
import EgovPaging from "@/components/EgovPaging";
import type { NoticeListItem, NoticeSearchState } from "@/types/notice";
import {
  Box,
  Button,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@mui/material";
import URL from "@/constants/url";
import { useSearchStateHandlers } from "@/hooks/InputStateHandlers/useInputStateHandlers";
import MuiSelect from "@/components/Elements/MuiSelect";
import { useNoticeFormQueries } from "./useNoticeFormQueries";
import PageStatus from "@/components/PageStatus";

type NoticeSearchCondition = {
  bbsId: string;
  pageIndex: number;
} & NoticeSearchState["values"];

export default function EgovNoticeListPage() {
  const navigate = useNavigate();

  const { values, handleTextFieldChange, handleSelectFieldChange } =
    useSearchStateHandlers<NoticeSearchState["values"]>();

  const bbsId = NOTICE_BBS_ID;

  const [searchCondition, setSearchCondition] = useState<NoticeSearchCondition>(
    {
      bbsId: bbsId,
      pageIndex: 1,
    }
  );

  const { listData, isListLoading, listError } = useNoticeFormQueries({
    bbsId,
    nttId: undefined,
    hasId: false,
    listCondition: searchCondition,
  });

  const rowData: NoticeListItem[] = listData?.items ?? [];
  const paginationInfo = listData?.paginationInfo;
  const showLoading = isListLoading && rowData.length === 0;

  // 검색 핸들러
  const handleSearch = () => {
    const newSearchCondition = {
      ...searchCondition,
      ...values,
    };

    setSearchCondition(newSearchCondition);
  };

  const handleMoveToCreate = () => {
    navigate(URL.NOTICE_CREATE);
  };

  const handleRowClick = (nttId: number) => {
    navigate(`/notice/${nttId}`);
  };

  // 페이지 이동 핸들러
  const handlePageMove = (pageIndex) => {
    const newSearchCondition = {
      ...searchCondition,
      ...values,
      pageIndex,
    };

    setSearchCondition(newSearchCondition);
  };

  if (isListLoading || listError) {
    return <PageStatus isLoading={isListLoading} error={listError} />;
  }

  const breadcrumbs = "공지사항";
  const pageTitle = "공지사항";

  return (
    <PageContainer title={pageTitle} breadcrumbs={[{ title: breadcrumbs }]}>
      {/* <!-- 검색조건 --> */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
          }}
        >
          <MuiSelect
            id="searchCnd"
            items={[
              { value: "01", label: "제목" },
              { value: "02", label: "내용" },
              { value: "03", label: "작성자" },
            ]}
            value={values.searchCnd ?? "01"}
            onChange={handleSelectFieldChange}
          />
          <TextField
            size="small"
            id="searchWrd"
            name="searchWrd"
            placeholder="검색어를 입력하세요"
            value={values.searchWrd ?? ""}
            onChange={handleTextFieldChange}
            sx={{ minWidth: 400 }}
          />

          <Button
            variant="contained"
            onClick={() => {
              handleSearch();
            }}
            sx={{ whiteSpace: "nowrap" }}
          >
            조회
          </Button>
        </Box>
        <Button variant="contained" onClick={handleMoveToCreate}>
          등록
        </Button>
      </Stack>
      {/* <!--// 검색조건 --> */}

      {/* <!-- 게시판목록 --> */}
      <div className="board_list BRD002">
        <Table size="small" sx={{ width: "100%" }} aria-label="공지사항 목록">
          <TableHead>
            <TableRow>
              <TableCell align="center">번호</TableCell>
              <TableCell align="center">제목</TableCell>
              <TableCell align="center">작성자</TableCell>
              <TableCell align="center">작성일</TableCell>
              <TableCell align="center">조회수</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  데이터를 불러오는 중입니다...
                </TableCell>
              </TableRow>
            ) : rowData.length > 0 ? (
              rowData.map((item) => (
                <TableRow
                  key={item.nttId}
                  hover
                  onClick={() => handleRowClick(item.nttId)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell align="center">{item.nttId}</TableCell>
                  {/* 제목은 왼쪽 정렬 */}
                  <TableCell align="left">{item.nttSj}</TableCell>
                  <TableCell align="center">{item.frstRegisterNm}</TableCell>
                  <TableCell align="center">{item.frstRegisterPnttm}</TableCell>
                  <TableCell align="center">{item.inqireCo}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="no_data" colSpan={5} align="center">
                  검색된 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <EgovPaging
          pagination={paginationInfo}
          moveToPage={(passedPage) => {
            handlePageMove(passedPage);
          }}
        />
      </div>
      {/* <!--// 게시판목록 --> */}
    </PageContainer>
  );
}
