import * as React from "react";
import {
  Alert,
  Stack,
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useDialogs } from "@/hooks/useDialogs/useDialogs/useDialogs";
import useNotifications from "@/hooks/useNotifications/useNotifications";
import PageContainer from "@/components/PageContainer";
import {
  deleteDocClassificationData,
  getDocClassificationData,
} from "@/services/docClassificationService";
import type { DocClassification } from "@/types/docClassification";
import DocClassificationHistoryButton from "@/components/Buttons/DocClassificationHistoryButton";

export default function DocClassificationDetailPage() {
  const { docClassificationId } = useParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [detailData, setDetailData] = React.useState<DocClassification | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const rst = await getDocClassificationData(Number(docClassificationId));

      setDetailData(rst);
    } catch (viewDataError) {
      setError(viewDataError as Error);
    }
    setIsLoading(false);
  }, [docClassificationId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleViewDataEdit = React.useCallback(() => {
    navigate(`/docClassification/${docClassificationId}/modify`);
  }, [navigate, docClassificationId]);

  const handleViewDataDelete = React.useCallback(async () => {
    if (!detailData) {
      return;
    }

    const confirmed = await dialogs.confirm(
      `${detailData.midCategory} 데이터를 삭제 할까요?`,
      {
        title: `삭제 확인`,
        severity: "error",
        okText: "삭제",
        cancelText: "취소",
      }
    );

    if (confirmed) {
      setIsLoading(true);
      try {
        await deleteDocClassificationData(Number(docClassificationId));

        navigate("/docClassification/list");

        notifications.show("삭제 되었습니다..", {
          severity: "success",
          autoHideDuration: 3000,
        });
      } catch (deleteError) {
        notifications.show(
          `삭제를 실패하였습니다. 사유:' ${(deleteError as Error).message}`,
          {
            severity: "error",
            autoHideDuration: 3000,
          }
        );
      }
      setIsLoading(false);
    }
  }, [detailData, dialogs, docClassificationId, navigate, notifications]);

  const handleBack = React.useCallback(() => {
    navigate("/docClassification/list");
  }, [navigate]);

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

  const pageTitle = `문서분류 관리`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: "문서고 관리", path: "/docClassification/list" },
        { title: pageTitle },
      ]}
    >
      <Box sx={{ width: "100%" }}>
        <Box sx={{ width: "100%" }}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Stack direction="row" gap={2}>
              <Button variant="outlined" onClick={handleBack}>
                목록
              </Button>
              <DocClassificationHistoryButton />
            </Stack>
            <Stack direction="row" gap={2}>
              <Button variant="contained" onClick={handleViewDataEdit}>
                수정
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleViewDataDelete}
              >
                삭제
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Table
              size="small"
              sx={{ mt: "12px" }}
              aria-label="문서분류 기본 정보"
            >
              <TableBody>
                {/* 상단 기본 정보 영역 */}
                <TableRow>
                  <TableHead>문서분류</TableHead>
                  <TableCell colSpan={3}>
                    {`${detailData?.largeCategory} > ${detailData?.midCategory} > ${detailData?.smallCategory}`}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>개인정보 포함</TableHead>
                  <TableCell>
                    {detailData?.fileName ? "포함" : "미포함"}
                  </TableCell>
                  <TableHead>사용여부</TableHead>
                  <TableCell>
                    {detailData?.useYn === "Y"
                      ? "사용"
                      : detailData?.useYn === "N"
                      ? "사용안함"
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>등록일자</TableHead>
                  <TableCell>{detailData?.regDate ?? "-"}</TableCell>
                  <TableHead>등록자</TableHead>
                  <TableCell>{detailData?.registrant ?? "-"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* 상세 정보 영역 */}
            <Table
              size="small"
              sx={{ mt: "12px" }}
              aria-label="문서분류 상세 정보"
            >
              <TableBody>
                <TableRow>
                  <TableHead>부서명</TableHead>
                  <TableCell>{detailData?.departmentName ?? ""}</TableCell>
                  <TableHead>파일명</TableHead>
                  <TableCell>{detailData?.fileName ?? ""}</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>보유목적</TableHead>
                  <TableCell>보유목적</TableCell>
                  <TableHead>사용부서(내부, 외부)</TableHead>
                  <TableCell>내부</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>개인정보 처리방법</TableHead>
                  <TableCell>개인정보 처리방법</TableCell>
                  <TableHead>보유기간</TableHead>
                  <TableCell>5년</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>정보주체의 개인정보항목</TableHead>
                  <TableCell>정보주체의 개인정보항목</TableCell>
                  <TableHead>법정대리인의 개인정보항목</TableHead>
                  <TableCell>법정대리인의 개인정보항목</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>주민등록번호 수집여부</TableHead>
                  <TableCell>수집</TableCell>
                  <TableHead>주민등록번호 수집 법령근거</TableHead>
                  <TableCell>주민등록번호 수집 법령근거</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>정보주체 동의여부</TableHead>
                  <TableCell>동의</TableCell>
                  <TableHead>정보주체 동의 없이 수집 법령근거</TableHead>
                  <TableCell>정보주체 동의 없이 수집 법령근거</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>민감 정보 보유여부</TableHead>
                  <TableCell>보유</TableCell>
                  <TableHead>민감 정보 별도동의 여부</TableHead>
                  <TableCell>동의</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>고유식별정보 보유여부</TableHead>
                  <TableCell>보유</TableCell>
                  <TableHead>고유식별정보 별도동의 여부</TableHead>
                  <TableCell>동의</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>개인정보영향평가 대상여부</TableHead>
                  <TableCell>대상</TableCell>
                  <TableHead>취급담당자</TableHead>
                  <TableCell>취급담당자</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>제3자 제공받는 자</TableHead>
                  <TableCell>제3자 제공받는 자</TableCell>
                  <TableHead>제3자 제공 근거</TableHead>
                  <TableCell>제3자 제공 근거</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>제3자 제공 항목</TableHead>
                  <TableCell>제3자 제공 항목</TableCell>
                  <TableHead>개인정보처리 위탁 업체명</TableHead>
                  <TableCell>개인정보처리 위탁 업체명</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>개인정보위탁 계약서 여부</TableHead>
                  <TableCell>있음</TableCell>
                  <TableHead>개인정보위탁사실 게재여부</TableHead>
                  <TableCell>게재</TableCell>
                </TableRow>

                <TableRow>
                  <TableHead>목적 외 이용·제공 여부</TableHead>
                  <TableCell>있음</TableCell>
                  <TableHead>목적 외 이용·제공 근거</TableHead>
                  <TableCell>목적 외 이용·제공 근거</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
}
