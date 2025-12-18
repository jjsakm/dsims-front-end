import React from "react";
import {NOTICE_BBS_ID} from "@/config";
import {useNavigate, useParams} from "react-router";
// import EgovAttachFile from "@/components/EgovAttachFile";
import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import URL from "@/constants/url";
import PageContainer from "@/components/AgGridContainer/PageContainer.tsx";
import {useDialogs} from "@/hooks/useDialogs/useDialogs";
import {useNoticeFormQueries} from "./useNoticeFormQueries";
import PageStatus from "@/components/PageStatus";

export default function EgovNoticeDetailPage() {
  const {nttId} = useParams();
  const dialogs = useDialogs();
  const navigate = useNavigate();

  const bbsId = NOTICE_BBS_ID;
  const hasId = nttId != null && !Number.isNaN(Number(nttId));

  const {detailData, isLoading, error, deleteNotice, isSubmitting} =
    useNoticeFormQueries({
      bbsId,
      nttId: nttId?.toString(),
      hasId,
    });

  const onClickDeleteBoardArticle = async () => {
    const confirmed = await dialogs.confirm(`공지사항을 삭제 할까요?`, {
      title: `삭제 확인`,
      severity: "error",
      okText: "삭제",
      cancelText: "취소",
    });

    if (!confirmed) {
      return;
    }
    await deleteNotice();
  };

  const handleMove = React.useCallback(
    (url: string) => {
      navigate(url);
    },
    [navigate]
  );

  if (isLoading || error) {
    return <PageStatus isLoading={isLoading} error={error}/>;
  }

  const pageTitle = `공지사항`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        {title: "알림마당", path: "/notice/list"},
        {title: pageTitle},
      ]}
    >
      {pageTitle}
      {/* <!-- 게시판 상세보기 --> */}
      <Table size="small" aria-label="공지사항 상세">
        <TableBody>
          {/* 제목 */}
          <TableRow>
            <TableCell>제목</TableCell>
            <TableCell colSpan={5}>{detailData?.nttSj}</TableCell>
          </TableRow>

          {/* 작성자 / 작성일 / 조회수 */}
          <TableRow>
            <TableCell>작성자</TableCell>
            <TableCell>{detailData?.frstRegisterNm}</TableCell>

            <TableCell>작성일</TableCell>
            <TableCell>{detailData?.frstRegisterPnttm}</TableCell>

            <TableCell>조회수</TableCell>
            <TableCell>{detailData?.inqireCo}</TableCell>
          </TableRow>

          {/* 내용 */}
          <TableRow>
            <TableCell>내용</TableCell>
            <TableCell colSpan={5}>
              <div
                style={{
                  minHeight: "200px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {detailData?.nttCn}
              </div>
            </TableCell>
          </TableRow>

          {/* 첨부파일 (필요 시 주석 해제하여 사용) */}
          {/*
            <TableRow>
              <TableCell>
                첨부파일
              </TableCell>
              <TableCell colSpan={5}>
                <EgovAttachFile boardFiles={boardAttachFiles} />
              </TableCell>
            </TableRow>
            */}
        </TableBody>
      </Table>
      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={() => handleMove(URL.NOTICE_LIST)}>
          목록
        </Button>
        <Stack direction="row">
          <Button onClick={() => handleMove(`/notice/${nttId}/modify`)}>
            수정
          </Button>
          <Button onClick={onClickDeleteBoardArticle} disabled={isSubmitting}>
            삭제
          </Button>
        </Stack>
      </Stack>
    </PageContainer>
  );
}
