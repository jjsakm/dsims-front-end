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
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import PageContainer from "@/components/PageContainer";
import { getDocDestructionData } from "@/services/docDestructionService";
import type { DocDestruction } from "@/types/docDestruction";
import DocDestructionHistoryButton from "@/components/Buttons/DocDestructionHistoryButton";
import URL from "@/constants/url";

export default function DocDestructionViewPage() {
  const { docId } = useParams();
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
        { title: "문서고 관리", path: "/docDestruction/list" },
        { title: pageTitle },
      ]}
    >
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <Table size="small" aria-label="문서파기 상세정보">
          <TableBody>
            {/* 문서분류 */}
            <TableRow>
              <TableHead>문서분류</TableHead>
              <TableCell colSpan={3}>{viewData?.docCategory ?? "-"}</TableCell>
            </TableRow>

            {/* 문서번호 / 파기일자 */}
            <TableRow>
              <TableHead>문서번호</TableHead>
              <TableCell>{viewData?.docNo ?? "-"}</TableCell>
              <TableHead>파기일자</TableHead>
              <TableCell>{viewData?.docCategory ?? "-"}</TableCell>
            </TableRow>

            {/* 문서제목 */}
            <TableRow>
              <TableHead>문서제목</TableHead>
              <TableCell colSpan={3}>{viewData?.docTitle ?? "-"}</TableCell>
            </TableRow>

            {/* 수집일자 / 종료일자 */}
            <TableRow>
              <TableHead>수집일자</TableHead>
              <TableCell>{viewData?.collectDateLabel ?? "-"}</TableCell>
              <TableHead>종료일자</TableHead>
              <TableCell>{viewData?.endDate ?? "-"}</TableCell>
            </TableRow>

            {/* 신청자 / 부서장 */}
            <TableRow>
              <TableHead>신청자</TableHead>
              <TableCell>{viewData?.docCategory ?? "-"}</TableCell>
              <TableHead>부서장</TableHead>
              <TableCell>{viewData?.docCategory ?? "-"}</TableCell>
            </TableRow>

            {/* 개인정보 / 개인정보처리 담당자 */}
            <TableRow>
              <TableHead>개인정보</TableHead>
              <TableCell>{viewData?.hasPersonalInfo ?? "-"}</TableCell>
              <TableHead>개인정보처리 담당자</TableHead>
              <TableCell>{viewData?.docCategory ?? "-"}</TableCell>
            </TableRow>

            {/* 자료의 종류 */}
            <TableRow>
              <TableHead>자료의 종류</TableHead>
              <TableCell colSpan={3}>{viewData?.docCategory ?? "-"}</TableCell>
            </TableRow>

            {/* 비고 */}
            <TableRow>
              <TableHead>비고</TableHead>
              <TableCell colSpan={3}>{viewData?.docCategory ?? "-"}</TableCell>
            </TableRow>

            {/* 파기사유 */}
            <TableRow>
              <TableHead>파기사유</TableHead>
              <TableCell colSpan={3}>{viewData?.docCategory ?? "-"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Stack direction="row" spacing={2} justifyContent="right">
          <Stack direction="row" spacing={2}>
            <DocDestructionHistoryButton />
            <Button variant="contained" onClick={handleBack}>
              목록
            </Button>
          </Stack>
        </Stack>
      </Box>
    </PageContainer>
  );
}
