// src/components/Table/ApprovalHistoryTable.tsx

import React from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Select,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";

export interface ApprovalRowData {
  id: string; // 고유 ID (삭제 시 사용)
  dept: string; // 부서
  name: string; // 이름
}

export interface ApprovalHistoryTableProps {
  approvalRows: ApprovalRowData[];
  onDeleteApprovalRow: (id: string) => void;
  onAddApprovalRow: () => void;
  newDept: string;
  onNewDeptChange: (dept: string) => void;
  newName: string;
  onNewNameChange: (name: string) => void;
  tableAriaLabel?: string;
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
  const theme = useTheme();

  const styleGroup = {
    container: { width: "100%", margin: "auto", borderRadius: "0" },
    label: {
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.grey[100],
      padding: theme.spacing(1),
    },
    text: {
      fontWeight: "700",
    },
  };

  return (
    <TableContainer component={Paper} sx={styleGroup.container}>
      <Table aria-label={tableAriaLabel} size="small">
        <TableBody>
          <TableRow>
            <TableCell
              rowSpan={approvalRows.length + 2}
              align="center"
              sx={styleGroup.label}
            >
              <Typography sx={styleGroup.text}>공람</Typography>
            </TableCell>

            {/* 나머지 헤더 셀 */}
            <TableCell align="center" sx={styleGroup.label}>
              <Typography sx={styleGroup.text}>부서</Typography>
            </TableCell>
            <TableCell align="center" sx={styleGroup.label}>
              <Typography sx={styleGroup.text}>이름</Typography>
            </TableCell>
            <TableCell align="center" sx={styleGroup.label}>
              <Typography sx={styleGroup.text}>삭제</Typography>
            </TableCell>
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
                  onClick={() => onDeleteApprovalRow(row.id)}
                >
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
                aria-label="추가할 부서 선택"
              >
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
                aria-label="추가할 이름 선택"
              >
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
                onClick={onAddApprovalRow}
              >
                등록
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
