import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VerticalTable, {
  type HistoryRow,
  type HeaderItem,
} from "@/components/Table/VerticalTable";
import { HorizontalTableView } from "@/components/Table/HorizontalTable";

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  m: 0,
  p: 2,
  position: "relative",
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  top: theme.spacing(1),
}));

const historyInfoSampleHeader: HeaderItem[] = [
  { label: "번호", key: "id", width: "8%", align: "center" },
  { label: "행위일자", key: "date", width: "15%", align: "center" },
  { label: "행위자", key: "actor", width: "15%", align: "center" },
  { label: "행위내용", key: "action", width: "27%", align: "center" },
  { label: "IP", key: "ip", width: "20%", align: "center" },
  { label: "장비", key: "device", width: "15%", align: "center" },
];
const historyInfoSample: HistoryRow[] = [
  {
    id: 1,
    date: "2025. 10. 27.",
    actor: "홍길동",
    action: "문서분류 수정",
    ip: "111.111.\n111.111",
    device: "PC",
  },
  {
    id: 2,
    date: "2025. 10. 15.",
    actor: "홍길동",
    action: "개인정보파일 현황 수정",
    ip: "111.111.\n111.111",
    device: "PC",
  },
  {
    id: 3,
    date: "2025. 10. 02.",
    actor: "홍길동",
    action: "개인정보파일 현황 수정",
    ip: "111.111.\n111.111",
    device: "PC",
  },
];

const historyViewSampleHeader: HeaderItem[] = [
  { label: "부서", key: "dept" },
  { label: "이름", key: "name" },
  { label: "행위내용", key: "action" },
  { label: "행위자", key: "actor" },
  { label: "행위일자", key: "date" },
];
const historyViewSample: HistoryRow[] = [
  {
    id: 1,
    dept: "피해구제팀",
    name: "-",
    action: "추가",
    actor: "홍길동",
    date: "25.10.01",
  },
  {
    id: 2,
    dept: "정보화팀",
    name: "홍길동",
    action: "추가",
    actor: "홍길동",
    date: "25.08.10",
  },
];
const digitalDocSample = [
  {
    groups: [
      {
        label: "문서분류",
        contentColSpan: 7,
        content: "피해구제 > 접수서류 > 사망 신청 (전자문서)",
      },
    ],
  },
  {
    groups: [
      {
        label: "문서번호",
        contentColSpan: 3,
        content: "KIDS-0001",
      },
      {
        label: "기본권한",
        contentColSpan: 3,
        content: "피해구제팀 / 전체",
      },
    ],
  },
  {
    groups: [
      {
        label: "문서제목",
        contentColSpan: 7,
        content: "피해구제 접수서류 사망신청서",
      },
    ],
  },
  {
    groups: [
      {
        label: "수집일자",
        contentColSpan: 3,
        content: "2025-10-01 (5년)",
      },
      {
        label: "종료일자",
        contentColSpan: 3,
        content: "2030-09-30",
      },
    ],
  },
  {
    groups: [
      {
        label: "개인정보",
        contentColSpan: 3,
        content: "포함",
      },
      {
        label: "반환여부",
        contentColSpan: 3,
        content: "미반환",
      },
    ],
  },
  {
    groups: [
      {
        label: "비고",
        contentColSpan: 7,
        content: "피해구제 접수서류 비고입니다.",
      },
    ],
  },
  {
    groups: [
      {
        label: "첨부파일",
        contentColSpan: 7,
        content: "피해구제 접수서류.pdf",
      },
    ],
  },
];

export default function DocDestructionHistoryButton() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" size="small" onClick={handleClickOpen}>
        이력
      </Button>
      <Dialog
        maxWidth="xl"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: "#fff",
          },
        }}
      >
        <StyledDialogTitle>
          이력
          <CloseButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </CloseButton>
        </StyledDialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 600 }}>
            <Grid container spacing={3}>
              <Stack direction="row" spacing={3} alignItems="flex-start">
                <VerticalTable
                  headers={[historyInfoSampleHeader]}
                  rows={historyInfoSample}
                />
                <VerticalTable
                  headers={[
                    [
                      {
                        label: "공람 이력",
                        key: "title",
                        colSpan: 5,
                        align: "center",
                      },
                    ],
                    historyViewSampleHeader,
                  ]}
                  rows={historyViewSample}
                />
              </Stack>

              {/* 문서 정보 */}
              <HorizontalTableView
                tableAriaLabel="전자 문서"
                rows={digitalDocSample}
              />
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
