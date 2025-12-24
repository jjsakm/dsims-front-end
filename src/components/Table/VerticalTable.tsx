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
  Typography,
} from "@mui/material";

// 문서고 전자문서 이력조회 테이블
export interface HistoryRow {
  id?: number | string;
  date?: string;
  actor?: string;
  action?: string;
  ip?: string;
  device?: string;
  dept?: string;
  name?: string;
  [key: string]: unknown;
}
// 문서고 전자문서 리스트 테이블
export interface IDocumentMetaInfo {
  docClassification?: string;
  docNumber?: string;
  docTitle?: string;
  personalInfo?: string;
  collectDate?: string;
  endDate?: string;
  category?: string;
  registrarDept?: string;
  regDate?: string;
  [key: string]: unknown;
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

export default function VerticalTable({ rows, headers }: VerticalTableProps) {
  const theme = useTheme();


  const styleGroup = {
    container: { width: "100%", margin: "auto", borderRadius: "0" },
    label: {
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.grey[100],
      padding: theme.spacing(1),
      width: "header.width",
    },
    text: {
      fontWeight: "700",
    },
    content: {
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1),
    },
  };

  return (
    <TableContainer component={Paper} sx={styleGroup.container}>
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
                    sx={styleGroup.label}
                  >
                    <Typography sx={styleGroup.text}>{header.label}</Typography>
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
                    sx={styleGroup.content}
                  >
                    {header.render
                      ? header.render(row[header.key], row)
                      : String(row[header.key])}
                  </TableCell>
                ))
              ) : (
                <TableCell colSpan={100} sx={styleGroup.content}>
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
