import * as React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import {useNavigate, useParams} from "react-router";
import PageContainer from "@/components/AgGridContainer/PageContainer.tsx";
import {getDocDestructionData} from "@/services/docDestructionService";
import type {DocDestruction} from "@/types/docDestruction";
import DocDestructionHistoryButton from "@/components/Buttons/DocDestructionHistoryButton";
import URL from "@/constants/url";
import PageStatus from "@/components/PageStatus";

export default function DocDestructionViewPage() {
  const {docId} = useParams();
  const navigate = useNavigate();

  const [viewData, setViewData] = React.useState<DocDestruction | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const viewData = await getDocDestructionData(Number(docId));

      setViewData(viewData);
    } catch (viewDataError) {
      setError(viewDataError as Error);
    }
    setIsLoading(false);
  }, [docId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBack = React.useCallback(() => {
    navigate(URL.DOC_DESTRUCTION_LIST);
  }, [navigate]);

  if (isLoading || error) {
    return <PageStatus isLoading={isLoading} error={error}/>;
  }

  const pageTitle = `문서분류 관리`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        {title: "문서고 관리", path: "/docDestruction/list"},
        {title: pageTitle},
      ]}
    >
      <Box sx={{flexGrow: 1, width: "100%"}}>
        <Table size="small" aria-label="문서파기 상세정보">
          <TableBody>
            {/* 문서분류 */}
            <TableRow>
              <TableCell>문서분류</TableCell>
              <TableCell colSpan={3}>{viewData?.docCategory ?? "-"}</TableCell>
            </TableRow>

            {/* 문서번호 / 파기일자 */}
            <TableRow>
              <TableCell>문서번호</TableCell>
              <TableCell>{viewData?.docNo ?? "-"}</TableCell>
              <TableCell>파기일자</TableCell>
              <TableCell>{viewData?.docCategory ?? "-"}</TableCell>
            </TableRow>

            {/* 문서제목 */}
            <TableRow>
              <TableCell>문서제목</TableCell>
              <TableCell colSpan={3}>{viewData?.docTitle ?? "-"}</TableCell>
            </TableRow>

            {/* 수집일자 / 종료일자 */}
            <TableRow>
              <TableCell>수집일자</TableCell>
              <TableCell>{viewData?.collectDateLabel ?? "-"}</TableCell>
              <TableCell>종료일자</TableCell>
              <TableCell>{viewData?.endDate ?? "-"}</TableCell>
            </TableRow>

            {/* 신청자 / 부서장 */}
            <TableRow>
              <TableCell>신청자</TableCell>
              <TableCell>{viewData?.docCategory ?? "-"}</TableCell>
              <TableCell>부서장</TableCell>
              <TableCell>{viewData?.docCategory ?? "-"}</TableCell>
            </TableRow>

            {/* 개인정보 / 개인정보처리 담당자 */}
            <TableRow>
              <TableCell>개인정보</TableCell>
              <TableCell>{viewData?.hasPersonalInfo ?? "-"}</TableCell>
              <TableCell>개인정보처리 담당자</TableCell>
              <TableCell>{viewData?.docCategory ?? "-"}</TableCell>
            </TableRow>

            {/* 자료의 종류 */}
            <TableRow>
              <TableCell>자료의 종류</TableCell>
              <TableCell colSpan={3}>{viewData?.docCategory ?? "-"}</TableCell>
            </TableRow>

            {/* 비고 */}
            <TableRow>
              <TableCell>비고</TableCell>
              <TableCell colSpan={3}>{viewData?.docCategory ?? "-"}</TableCell>
            </TableRow>

            {/* 파기사유 */}
            <TableRow>
              <TableCell>파기사유</TableCell>
              <TableCell colSpan={3}>{viewData?.docCategory ?? "-"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Stack direction="row" spacing={2} justifyContent="right">
          <Stack direction="row" spacing={2}>
            <DocDestructionHistoryButton/>
            <Button variant="contained" onClick={handleBack}>
              목록
            </Button>
          </Stack>
        </Stack>
      </Box>
    </PageContainer>
  );
}
