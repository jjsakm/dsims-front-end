import * as React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useNavigate, useParams } from "react-router";
import PageContainer from "@/components/PageContainer";
import type { DigitalDoc } from "@/types/digitalDoc";
import { getDigitalDocData } from "@/services/digitalDocService";
import { useDialogs } from "@/hooks/useDialogs/useDialogs/useDialogs";
import useNotifications from "@/hooks/useNotifications/useNotifications";
import DigitalDocHistoryButton from "@/components/Buttons/DigitalDocHistoryButton";
import DigitalDocDownButton from "@/components/Buttons/DigitalDocDownButton";
import DigitalDocViewerButton from "@/components/Buttons/DigitalDocViewerButton";
import URL from "@/constants/url";
import { TableHead } from "@mui/material";

export default function DigitalDocDetailPage() {
  const { docId } = useParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [viewData, setViewData] = React.useState<DigitalDoc | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [returnStatus, setReturnStatus] = React.useState("");

  const [approvalRows, setApprovalRows] = React.useState<
    { id: number; dept: string; name: string }[]
  >([
    { id: 1, dept: "정보화팀", name: "전체" },
    { id: 2, dept: "경영팀", name: "김길동" },
  ]);

  const [newDept, setNewDept] = React.useState("");
  const [newName, setNewName] = React.useState("");

  const handleAddApprovalRow = React.useCallback(async () => {
    if (!newDept || !newName) return;
    setApprovalRows((prev) => [
      ...prev,
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        dept: newDept,
        name: newName,
      },
    ]);
    setNewDept("");
    setNewName("");

    notifications.show("공람 이력이 등록되었습니다.", {
      severity: "success",
      autoHideDuration: 3000,
    });
  }, [newDept, newName, notifications]);

  const handleDeleteApprovalRow = React.useCallback(
    async (id: number) => {
      // 삭제 대상 행 찾기
      const targetRow = approvalRows.find((row) => row.id === id);
      if (!targetRow) {
        return;
      }

      const confirmed = await dialogs.confirm(
        `${targetRow.dept} / ${targetRow.name} 공람 이력을 삭제 할까요?`,
        {
          title: "삭제 확인",
          severity: "error",
          okText: "삭제",
          cancelText: "취소",
        }
      );

      if (!confirmed) {
        return;
      }

      setApprovalRows((prev) => prev.filter((row) => row.id !== id));

      notifications.show("공람 이력이 삭제되었습니다.", {
        severity: "success",
        autoHideDuration: 3000,
      });
    },
    [approvalRows, dialogs, notifications]
  );

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const viewData = await getDigitalDocData(Number(docId));

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
    navigate(URL.DIGITAL_DOC_LIST);
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
        { title: "문서고 관리", path: "/digitalDoc/list" },
        { title: pageTitle },
      ]}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: "100%",
          marginBottom: "8px",
          justifyContent: "flex-end",
          mt: 2,
        }}
      >
        <DigitalDocHistoryButton />
        <Button variant="contained" onClick={handleBack}>
          목록
        </Button>
      </Stack>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Table
          size="small"
          sx={{ width: "100%" }}
          aria-label="디지털 문서 상세 정보"
        >
          <TableBody>
            {/* 문서분류 */}
            <TableRow>
              <TableHead>문서분류</TableHead>
              <TableCell colSpan={3}>{viewData?.docCategory ?? ""}</TableCell>
            </TableRow>

            {/* 문서번호 / 기본권한 */}
            <TableRow>
              <TableHead>문서번호</TableHead>
              <TableCell>{viewData?.docNo ?? ""}</TableCell>
              <TableHead>기본권한</TableHead>
              <TableCell>피해구제팀 / 전체</TableCell>
            </TableRow>

            {/* 문서제목 */}
            <TableRow>
              <TableHead>문서제목</TableHead>
              <TableCell colSpan={3}>{viewData?.docTitle ?? ""}</TableCell>
            </TableRow>

            {/* 수집일자 / 종료일자 */}
            <TableRow>
              <TableHead>수집일자</TableHead>
              <TableCell>{viewData?.collectDateLabel ?? ""}</TableCell>
              <TableHead>종료일자</TableHead>
              <TableCell>{viewData?.endDate ?? ""}</TableCell>
            </TableRow>

            {/* 개인정보 / 반환여부 */}
            <TableRow>
              <TableHead>개인정보</TableHead>
              <TableCell>{viewData?.hasPersonalInfo ?? ""}</TableCell>
              <TableHead>반환여부</TableHead>
              <TableCell>미반환</TableCell>
            </TableRow>

            {/* 비고 */}
            <TableRow>
              <TableHead>비고</TableHead>
              <TableCell colSpan={3}>{viewData?.remark ?? ""}</TableCell>
            </TableRow>

            {/* 첨부파일 */}
            <TableRow>
              <TableHead>첨부파일</TableHead>
              <TableCell colSpan={3}>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  {viewData?.fileName ?? "피해구제 접수서류.pdf"}
                  <DigitalDocViewerButton />
                  <DigitalDocDownButton />
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: "100%",
          marginBottom: "8px",
          mt: 2,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 700 }}>
          <Table aria-label="공람 이력">
            <TableBody>
              <TableRow>
                <TableCell
                  rowSpan={approvalRows.length + 2}
                  align="center"
                  sx={{ whiteSpace: "nowrap", fontWeight: 600 }}
                >
                  공람
                </TableCell>
                <TableCell align="center">부서</TableCell>
                <TableCell align="center">이름</TableCell>
                <TableCell align="center">삭제</TableCell>
              </TableRow>
              {approvalRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.dept}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      color="secondary"
                      onClick={() => handleDeleteApprovalRow(row.id)}
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <Select
                    size="small"
                    fullWidth
                    displayEmpty
                    value={newDept}
                    onChange={(event) =>
                      setNewDept(event.target.value as string)
                    }
                  >
                    <MenuItem value="">
                      <em>부서</em>
                    </MenuItem>
                    <MenuItem value="정보화팀">정보화팀</MenuItem>
                    <MenuItem value="경영팀">경영팀</MenuItem>
                    <MenuItem value="기획팀">기획팀</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    size="small"
                    fullWidth
                    displayEmpty
                    value={newName}
                    onChange={(event) =>
                      setNewName(event.target.value as string)
                    }
                  >
                    <MenuItem value="">
                      <em>이름</em>
                    </MenuItem>
                    <MenuItem value="전체">전체</MenuItem>
                    <MenuItem value="김길동">김길동</MenuItem>
                    <MenuItem value="홍길동">홍길동</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={handleAddApprovalRow}
                  >
                    등록
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        <Box sx={{ width: "100%", maxWidth: 700 }}>
          <Table
            size="small"
            sx={{ width: "100%" }}
            aria-label="문서분류 및 반환여부"
          >
            <TableBody>
              <TableRow>
                <TableHead>문서분류</TableHead>
                <TableCell>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ width: "100%" }}
                  >
                    <Select size="small" fullWidth displayEmpty value="">
                      <MenuItem value="">
                        <em>대분류</em>
                      </MenuItem>
                    </Select>
                    <Select size="small" fullWidth displayEmpty value="">
                      <MenuItem value="">
                        <em>중분류</em>
                      </MenuItem>
                    </Select>
                    <Select size="small" fullWidth displayEmpty value="">
                      <MenuItem value="">
                        <em>소분류</em>
                      </MenuItem>
                    </Select>
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>반환여부</TableHead>
                <TableCell>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      value={returnStatus}
                      onChange={(event) => setReturnStatus(event.target.value)}
                    >
                      <FormControlLabel
                        value="Y"
                        control={<Radio size="small" />}
                        label="반환"
                      />
                      <FormControlLabel
                        value="N"
                        control={<Radio size="small" />}
                        label="미반환"
                      />
                    </RadioGroup>
                  </FormControl>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Stack>
    </PageContainer>
  );
}
