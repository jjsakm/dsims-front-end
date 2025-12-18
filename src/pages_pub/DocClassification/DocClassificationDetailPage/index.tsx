import * as React from "react";
import {Box, Button, Stack, Table, TableBody, TableCell, TableRow,} from "@mui/material";
import {useNavigate, useParams} from "react-router";
import {useDialogs} from "@/hooks/useDialogs/useDialogs";
import useNotifications from "@/hooks/useNotifications";
import PageContainer from "@/components/AgGridContainer/PageContainer.tsx";
import {deleteDocClassificationData, getDocClassificationData,} from "@/services/docClassificationService";
import type {DocClassification} from "@/types/docClassification";
import DocClassificationHistoryButton from "@/components/Buttons/DocClassificationHistoryButton";
import PageStatus from "@/components/PageStatus";

export default function DocClassificationDetailPage() {
  const {docClassificationId} = useParams();
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

  if (isLoading || error) {
    return <PageStatus isLoading={isLoading} error={error}/>;
  }

  const pageTitle = `문서분류 관리`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        {title: "문서고 관리", path: "/docClassification/list"},
        {title: pageTitle},
      ]}
    >
      <Box sx={{width: "100%"}}>
        <Box sx={{width: "100%"}}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Stack direction="row" gap={2}>
              <Button variant="outlined" onClick={handleBack}>
                목록
              </Button>
              <DocClassificationHistoryButton/>
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

          <Box sx={{width: "100%", overflowX: "auto"}}>
            <Table
              size="small"
              sx={{mt: "12px"}}
              aria-label="문서분류 기본 정보"
            >
              <TableBody>
                {/* 상단 기본 정보 영역 */}
                <TableRow>
                  <TableCell>문서분류</TableCell>
                  <TableCell colSpan={3}>
                    {`${detailData?.largeCategory} > ${detailData?.midCategory} > ${detailData?.smallCategory}`}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>개인정보 포함</TableCell>
                  <TableCell>
                    {detailData?.fileName ? "포함" : "미포함"}
                  </TableCell>
                  <TableCell>사용여부</TableCell>
                  <TableCell>
                    {detailData?.useYn === "Y"
                      ? "사용"
                      : detailData?.useYn === "N"
                        ? "사용안함"
                        : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>등록일자</TableCell>
                  <TableCell>{detailData?.regDate ?? "-"}</TableCell>
                  <TableCell>등록자</TableCell>
                  <TableCell>{detailData?.registrant ?? "-"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* 상세 정보 영역 */}
            <Table
              size="small"
              sx={{mt: "12px"}}
              aria-label="문서분류 상세 정보"
            >
              <TableBody>
                <TableRow>
                  <TableCell>부서명</TableCell>
                  <TableCell>{detailData?.departmentName ?? ""}</TableCell>
                  <TableCell>파일명</TableCell>
                  <TableCell>{detailData?.fileName ?? ""}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>보유목적</TableCell>
                  <TableCell>보유목적</TableCell>
                  <TableCell>사용부서(내부, 외부)</TableCell>
                  <TableCell>내부</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>개인정보 처리방법</TableCell>
                  <TableCell>개인정보 처리방법</TableCell>
                  <TableCell>보유기간</TableCell>
                  <TableCell>5년</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>정보주체의 개인정보항목</TableCell>
                  <TableCell>정보주체의 개인정보항목</TableCell>
                  <TableCell>법정대리인의 개인정보항목</TableCell>
                  <TableCell>법정대리인의 개인정보항목</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>주민등록번호 수집여부</TableCell>
                  <TableCell>수집</TableCell>
                  <TableCell>주민등록번호 수집 법령근거</TableCell>
                  <TableCell>주민등록번호 수집 법령근거</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>정보주체 동의여부</TableCell>
                  <TableCell>동의</TableCell>
                  <TableCell>정보주체 동의 없이 수집 법령근거</TableCell>
                  <TableCell>정보주체 동의 없이 수집 법령근거</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>민감 정보 보유여부</TableCell>
                  <TableCell>보유</TableCell>
                  <TableCell>민감 정보 별도동의 여부</TableCell>
                  <TableCell>동의</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>고유식별정보 보유여부</TableCell>
                  <TableCell>보유</TableCell>
                  <TableCell>고유식별정보 별도동의 여부</TableCell>
                  <TableCell>동의</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>개인정보영향평가 대상여부</TableCell>
                  <TableCell>대상</TableCell>
                  <TableCell>취급담당자</TableCell>
                  <TableCell>취급담당자</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>제3자 제공받는 자</TableCell>
                  <TableCell>제3자 제공받는 자</TableCell>
                  <TableCell>제3자 제공 근거</TableCell>
                  <TableCell>제3자 제공 근거</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>제3자 제공 항목</TableCell>
                  <TableCell>제3자 제공 항목</TableCell>
                  <TableCell>개인정보처리 위탁 업체명</TableCell>
                  <TableCell>개인정보처리 위탁 업체명</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>개인정보위탁 계약서 여부</TableCell>
                  <TableCell>있음</TableCell>
                  <TableCell>개인정보위탁사실 게재여부</TableCell>
                  <TableCell>게재</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>목적 외 이용·제공 여부</TableCell>
                  <TableCell>있음</TableCell>
                  <TableCell>목적 외 이용·제공 근거</TableCell>
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
