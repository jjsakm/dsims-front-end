import React, { useEffect, useState } from "react";
import { NOTICE_BBS_ID } from "@/config";
import { useNavigate, useParams } from "react-router";
import { deleteNoticeItem, getNoticeItem } from "@/services/noticeService";
import useNotifications from "@/hooks/useNotifications/useNotifications";
// import EgovAttachFile from "@/components/EgovAttachFile";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@mui/material";
import NET_CODE from "@/constants/netCode";
import type { NoticeListItem } from "@/types/notice";
import URL from "@/constants/url";
import PageContainer from "@/components/PageContainer";
import { useDialogs } from "@/hooks/useDialogs/useDialogs/useDialogs";

export default function EgovNoticeDetailPage() {
  const { nttId } = useParams();
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const navigate = useNavigate();

  const bbsId = NOTICE_BBS_ID;

  const [detailData, setDetailData] = useState<NoticeListItem | null>(null);
  // const [boardAttachFiles, setBoardAttachFiles] = useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadData = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const resp = await getNoticeItem({
        bbsId,
        nttId: nttId?.toString() || "",
      });
      setDetailData(resp);
      // setBoardAttachFiles(resp.result.resultFiles);
    } catch (viewDataError) {
      setError(viewDataError as Error);
    }
    setIsLoading(false);
  };

  useEffect(function () {
    const hasId = nttId != null && !Number.isNaN(Number(nttId));
    if (hasId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickDeleteBoardArticle = async () => {
    const confirmed = await dialogs.confirm(`공지사항을 삭제 할까요?`, {
      title: `삭제 확인`,
      severity: "error",
      okText: "삭제",
      cancelText: "취소",
    });

    if (confirmed) {
      const resp = await deleteNoticeItem({
        bbsId: bbsId,
        nttId,
      });
      if (resp === NET_CODE.RCV_SUCCESS) {
        notifications.show("삭제되었습니다.", {
          severity: "success",
          autoHideDuration: 3000,
        });
      } else {
        notifications.show("삭제가 실패하였습니다.", {
          severity: "error",
          autoHideDuration: 3000,
        });
      }
    }
  };

  const handleMove = React.useCallback(
    (url: string) => {
      navigate(url);
    },
    [navigate]
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          m: 1,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  const pageTitle = `공지사항`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: "알림마당", path: "/notice/list" },
        { title: pageTitle },
      ]}
    >
      {pageTitle}
      {/* <!-- 게시판 상세보기 --> */}
      <Table size="small" aria-label="공지사항 상세">
        <TableBody>
          {/* 제목 */}
          <TableRow>
            <TableHead>제목</TableHead>
            <TableCell colSpan={5}>{detailData?.nttSj}</TableCell>
          </TableRow>

          {/* 작성자 / 작성일 / 조회수 */}
          <TableRow>
            <TableHead>작성자</TableHead>
            <TableCell>{detailData?.frstRegisterNm}</TableCell>

            <TableHead>작성일</TableHead>
            <TableCell>{detailData?.frstRegisterPnttm}</TableCell>

            <TableHead>조회수</TableHead>
            <TableCell>{detailData?.inqireCo}</TableCell>
          </TableRow>

          {/* 내용 */}
          <TableRow>
            <TableHead>내용</TableHead>
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
              <TableHead>
                첨부파일
              </TableHead>
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
          <Button onClick={onClickDeleteBoardArticle}>삭제</Button>
        </Stack>
      </Stack>
    </PageContainer>
  );
}
