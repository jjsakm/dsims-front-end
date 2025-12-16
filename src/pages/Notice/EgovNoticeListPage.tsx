import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { NOTICE_BBS_ID } from "@/config";
import PageContainer from "@/components/PageContainer";
import EgovPaging from "@/components/EgovPaging";
import type { NoticeListItem } from "@/types/notice";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { getNoticeList } from "@/services/noticeService";
import URL from "@/constants/url";

export default function EgovNoticeListPage() {
  const navigate = useNavigate();
  const cndRef = useRef<HTMLSelectElement>(null);
  const wrdRef = useRef<HTMLInputElement>(null);

  const bbsId = NOTICE_BBS_ID;

  const [searchCondition, setSearchCondition] = useState({
    bbsId: bbsId,
    pageIndex: 1,
    searchCnd: "",
    searchWrd: "",
  });
  const [paginationInfo, setPaginationInfo] = useState({});

  const [listTag, setListTag] = useState<NoticeListItem[]>([]);

  const handleRowClick = (nttId: number) => {
    navigate(`/notice/${nttId}`);
  };

  // 검색 핸들러
  const handleSearch = (cndRef, wrdRef, retrieveList) => {
    const newSearchCondition = {
      ...searchCondition,
      searchCnd: cndRef.current.value,
      searchWrd: wrdRef.current.value,
    };

    // updateURL(newSearchCondition);
    retrieveList(newSearchCondition);
    setSearchCondition(newSearchCondition);
  };

  const handleMoveToCreate = () => {
    navigate(URL.NOTICE_CREATE);
  };

  // 페이지 이동 핸들러
  const handlePageMove = (pageIndex, cndRef, wrdRef, retrieveList) => {
    const newSearchCondition = {
      ...searchCondition,
      pageIndex,
      searchCnd: cndRef.current.value,
      searchWrd: wrdRef.current.value,
    };

    // updateURL(newSearchCondition);
    retrieveList(newSearchCondition);
    setSearchCondition(newSearchCondition);
  };

  const retrieveList = useCallback(async (searchCondition) => {
    const res = await getNoticeList(searchCondition);
    setListTag(res.items);
    setPaginationInfo(res.paginationInfo);
  }, []);

  useEffect(() => {
    retrieveList(searchCondition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const breadcrumbs = "공지사항";
  const pageTitle = "공지사항";

  return (
    <PageContainer title={pageTitle} breadcrumbs={[{ title: breadcrumbs }]}>
      {/* <!-- 검색조건 --> */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="notice-search-condition-label">조건</InputLabel>
            <Select
              labelId="notice-search-condition-label"
              id="sel1"
              defaultValue={searchCondition.searchCnd ?? "0"}
              native
              inputRef={cndRef}
              onChange={(e) => {
                if (cndRef.current) {
                  cndRef.current.value = (e.target as HTMLSelectElement).value;
                }
              }}
            >
              <option value="0">제목</option>
              <option value="1">내용</option>
              <option value="2">작성자</option>
            </Select>
          </FormControl>

          <TextField
            size="small"
            placeholder="검색어를 입력하세요"
            defaultValue={searchCondition.searchWrd ?? ""}
            inputRef={wrdRef}
            onChange={(e) => {
              if (wrdRef.current) {
                wrdRef.current.value = e.target.value;
              }
            }}
            sx={{ flexGrow: 1, maxWidth: 400 }}
          />

          <Button
            variant="contained"
            onClick={() => {
              handleSearch(cndRef, wrdRef, retrieveList);
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
            {listTag.length > 0 ? (
              listTag.map((item) => (
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
            handlePageMove(passedPage, cndRef, wrdRef, retrieveList);
          }}
        />
      </div>
      {/* <!--// 게시판목록 --> */}
    </PageContainer>
  );
}
