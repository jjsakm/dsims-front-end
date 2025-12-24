import * as React from "react";
import {
  HorizontalTableCreate,
  HorizontalTableView,
  type HorizontalTableRow,
} from "@/components/Table/HorizontalTable";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import DigitalDocViewerButton from "@/components/Buttons/DigitalDocViewerButton";
import DigitalDocDownButton from "@/components/Buttons/DigitalDocDownButton";

import { useState, useCallback } from "react";
import { ApprovalHistoryTable } from "@/components/Table/ApprovalHistoryTable";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import useNotifications from "@/hooks/useNotifications";
import DigitalDocHistoryButton from "@/components/Buttons/DigitalDocHistoryButton";
import MuiSelect from "@/components/Elements/MuiSelect";

export default function DigitalDocDetailPage() {
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [approvalRows, setApprovalRows] = React.useState<
    { id: string; dept: string; name: string }[]
  >([
    { id: "1", dept: "기획팀", name: "김링링" },
    { id: "2", dept: "경영팀", name: "김길동" },
  ]);

  const [newDept, setNewDept] = useState<string>("");
  const [newName, setNewName] = useState<string>("");

  const handleDeleteApprovalRow = React.useCallback(
    async (id: string) => {
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

  const handleAddApprovalRow = useCallback(async () => {
    if (!newDept || !newName) {
      await dialogs.alert("부서와 이름을 모두 선택해 주세요.", {
        title: "알림",
        okText: "확인",
      });
      return;
    }

    const newId = String(approvalRows.length + 1);
    setApprovalRows((prevRows) => [
      ...prevRows,
      { id: newId, dept: newDept, name: newName },
    ]);
    setNewDept("");
    setNewName("");
  }, [newDept, newName, approvalRows.length, dialogs]);

  const sampleData1: HorizontalTableRow[] = [
    {
      groups: [
        {
          label: "문서분류",
          contentColSpan: 7,
          content: "피해구제 > 접수서류 > 사망 신청",
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
          contentColSpan: 3,
          content: "피해구제 접수서류 사망신청서",
        },
      ],
    },
    {
      groups: [
        {
          label: "수집일자",
          contentColSpan: 3,
          content: "2025-10-01 (5년) ",
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
          content: "피해구제 접수서류 비고입니다",
        },
      ],
    },
    {
      groups: [
        {
          label: "첨부파일",
          contentColSpan: 7,
          content: (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography>피해구제 접수서류.pdf</Typography>
              <DigitalDocViewerButton />
              <DigitalDocDownButton />
            </Stack>
          ),
        },
      ],
    },
  ];

  const sampleData2: HorizontalTableRow[] = [
    {
      groups: [
        {
          label: "문서분류",
          contentColSpan: 3,
          renderInput: () => (
            <Stack direction="row" spacing={1}>
              <MuiSelect
                id="largeCategory"
                placeholder="대분류"
                items={[{ value: "01", label: "피해구제" }]}
              />
              <MuiSelect
                id="midCategory"
                placeholder="중분류"
                items={[
                  { value: "01", label: "접수서류" },
                  { value: "02", label: "신청자 제출서류" },
                  { value: "03", label: "직원보완자료" },
                ]}
              />
              <MuiSelect
                id="smallCategory"
                placeholder="소분류"
                items={[
                  { value: "01", label: "사망 신청" },
                  { value: "02", label: "이전문서" },
                ]}
              />
            </Stack>
          ),
        },
      ],
    },
    {
      groups: [
        {
          label: "반환여부",
          contentColSpan: 3,
          content: ["반환", "미반환"],
          inputType: "radio",
        },
      ],
    },
  ];

  return (
    <Stack spacing={2}>
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <DigitalDocHistoryButton />
        <Button variant="contained" size="small" color="primary">
          목록
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12 }}>
          {/* 상세보기 테이블 */}
          <HorizontalTableView
            rows={sampleData1}
            tableAriaLabel="전자문서 조회 및 수정"
          ></HorizontalTableView>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          {/* 공람이력 테이블 */}
          <ApprovalHistoryTable
            approvalRows={approvalRows}
            onDeleteApprovalRow={handleDeleteApprovalRow}
            onAddApprovalRow={handleAddApprovalRow}
            newDept={newDept}
            onNewDeptChange={setNewDept}
            newName={newName}
            onNewNameChange={setNewName}
            tableAriaLabel="문서고 공람 이력"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          {/* 문서분류/반환여부 테이블 */}
          <HorizontalTableCreate
            rows={sampleData2}
            tableAriaLabel="문서분류/반환여부 수정"
          />
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button variant="contained" size="small" color="primary">
              수정
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
}
