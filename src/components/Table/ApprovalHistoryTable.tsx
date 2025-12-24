// src/components/Table/ApprovalHistoryTable.tsx

import React from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";

export interface ApprovalRowData {
  id: string; // 고유 ID (삭제 시 사용)
  dept: string; // 부서
  name: string; // 이름
}

export interface ApprovalHistoryTableProps {
  approvalRows: ApprovalRowData[]; // 현재 공람 이력 데이터
  onDeleteApprovalRow: (id: string) => void; // 공람자 삭제 핸들러
  onAddApprovalRow: () => void; // 공람자 추가 핸들러
  newDept: string; // 새로 추가할 공람자의 부서 상태
  onNewDeptChange: (dept: string) => void; // 새로 추가할 공람자 부서 변경 핸들러
  newName: string; // 새로 추가할 공람자의 이름 상태
  onNewNameChange: (name: string) => void; // 새로 추가할 공람자 이름 변경 핸들러
  tableAriaLabel?: string; // 접근성을 위한 aria-label (기본값 제공)
}

export const ApprovalHistoryTable: React.FC<ApprovalHistoryTableProps> = ({
  approvalRows,
  onDeleteApprovalRow,
  onAddApprovalRow,
  newDept,
  onNewDeptChange,
  newName,
  onNewNameChange,
  tableAriaLabel = "공람 이력 테이블", 
}) => {
  return (
    <Box sx={{ width: "100%", maxWidth: 700 }}>
      <Table aria-label={tableAriaLabel} size="small">
        <TableBody>
          <TableRow>
            <TableCell
              rowSpan={approvalRows.length + 2}
              align="center"
              sx={{
                whiteSpace: "nowrap",
                fontWeight: 600,
                verticalAlign: "middle",
                paddingTop: "16px", 
              }}>
              <Typography>공람</Typography>
            </TableCell>

            {/* 나머지 헤더 셀 */}
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
                  color="error"
                  onClick={() => onDeleteApprovalRow(row.id)}>
                  삭제
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {/* 새로운 공람자 추가/등록 행 */}
          <TableRow>
            <TableCell>
              <Select
                size="small"
                fullWidth
                displayEmpty
                value={newDept}
                onChange={(event) =>
                  onNewDeptChange(event.target.value as string)
                }
                aria-label="추가할 부서 선택">
                <MenuItem value="">
                  <Typography>부서</Typography>
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
                  onNewNameChange(event.target.value as string)
                }
                aria-label="추가할 이름 선택">
                <MenuItem value="">
                  <Typography>이름</Typography>
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
                onClick={onAddApprovalRow}>
                등록
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};
