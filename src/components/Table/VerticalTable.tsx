import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  useTheme,
} from "@mui/material";

export interface HistoryRow {
  id?: number | string;
  date: string;
  actor: string;
  action: string;
  ip?: string;
  device?: string;
  dept?: string;
  name?: string;
  // [key: string]: unknown;
}

export interface HeaderItem {
  label: string;
  key: string;
  width?: string;
  align?: "left" | "center" | "right";
  colSpan?: number;
  rowSpan?: number;
  render?: (value: unknown, row: HistoryRow) => React.ReactNode;

}

interface VerticalTableProps {
  rows: HistoryRow[];
  headers?: HeaderItem[][];
}

export default function VerticalTable({
  rows,
  headers,
}: VerticalTableProps) {
  const theme = useTheme();

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 900, margin: "auto" }}>
      <Table aria-label="custom data table" sx={{ borderCollapse: "collapse" }}>
        {headers && headers.length > 0 && (
          <TableHead>
            {headers.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((header) => (
                  <TableCell
                    key={header.key}
                    align={header.align || "center"}
                    colSpan={header.colSpan}
                    rowSpan={header.rowSpan}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: theme.palette.grey[200],
                      fontWeight: "bold",
                      width: header.width,
                      padding: theme.spacing(1),
                    }}
                  >
                    {header.label}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
        )}
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              {headers && headers.length > 0 ? (
                headers[headers.length - 1].map((header) => (
                  <TableCell
                    key={`${row.id}-${header.key}`}
                    align={header.align || "center"}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      padding: theme.spacing(1),
                    }}
                  >
                    {header.render
                      ? header.render(row[header.key], row)
                      : String(row[header.key])}
                  </TableCell>
                ))
              ) : (
                // ✨ headers가 없는 경우, 행 전체를 하나의 셀로 렌더링하는 등의 대체 로직을 넣을 수도 있습니다. ✨
                // 예시: 모든 값을 문자열로 합쳐 하나의 셀에 표시
                <TableCell
                  colSpan={100}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    padding: theme.spacing(1),
                  }}
                >
                  {Object.values(row)
                    .map((v) => String(v))
                    .join(" | ")}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
