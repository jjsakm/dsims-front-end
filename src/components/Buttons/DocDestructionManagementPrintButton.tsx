import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// 예: 컴포넌트 상단에 rows 정의
type DisposalRow = {
  no: string;
  fileName: string;
  dataType: string;
  createdDate: string;
  disposeDate: string;
  reason: string;
  handler: string;
  manager: string;
};

const rows: DisposalRow[] = [
  {
    no: "110",
    fileName: "2024년 심사자현장실습교육 수료자명단",
    dataType: "성명, 기관명, 부서명, 직급",
    createdDate: "2024.5.24",
    disposeDate: "2025.7.8",
    reason: "목적달성",
    handler: "김옥슬",
    manager: "송이나",
  },
  // 나머지 빈 행들 (인쇄용 템플릿)
  {
    no: "",
    fileName: "",
    dataType: "",
    createdDate: "",
    disposeDate: "",
    reason: "",
    handler: "",
    manager: "",
  },
  {
    no: "",
    fileName: "",
    dataType: "",
    createdDate: "",
    disposeDate: "",
    reason: "",
    handler: "",
    manager: "",
  },
  {
    no: "",
    fileName: "",
    dataType: "",
    createdDate: "",
    disposeDate: "",
    reason: "",
    handler: "",
    manager: "",
  },
  {
    no: "",
    fileName: "",
    dataType: "",
    createdDate: "",
    disposeDate: "",
    reason: "",
    handler: "",
    manager: "",
  },
  {
    no: "",
    fileName: "",
    dataType: "",
    createdDate: "",
    disposeDate: "",
    reason: "",
    handler: "",
    manager: "",
  },
];

export default function DocDestructionManagementPrintButton() {
  const [open, setOpen] = React.useState(false);
  const printAreaRef = React.useRef<HTMLDivElement | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePrint = () => {
    if (!printAreaRef.current) return;

    const printContents = printAreaRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=1024,height=768");

    if (!printWindow) {
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>파기관리대장 출력</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #000;
              padding: 4px 8px;
              font-size: 12px;
            }
            thead th {
              background: #f5f5f5;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        파기관리대장 출력
      </Button>
      <Dialog maxWidth="md" open={open} onClose={handleClose}>
        <DialogTitle
          component="div"
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="span">
            파기관리대장 출력
          </Typography>
          <IconButton aria-label="close" onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogActions>
          <Typography variant="subtitle2" sx={{ mr: "auto", ml: 2 }}>
            [별지 제 5호 서식]
          </Typography>
          <Typography variant="h6" sx={{ mr: "auto", ml: 2 }}>
            개인정보파일 파기 관리대장
          </Typography>
          <Button variant="outlined" onClick={handlePrint}>
            출력
          </Button>
        </DialogActions>
        <DialogContent>
          <Box ref={printAreaRef}>
            <Table
              sx={{
                minWidth: 650,
                width: "100%",
                borderCollapse: "collapse",
                "& .MuiTableCell-root": {
                  border: "1px solid #555", // 전체 테두리
                },
              }}
              size="small"
              aria-label="disposal table"
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "grey.300",
                      fontWeight: "bold",
                      width: 80,
                    }}
                  >
                    번호
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "grey.300",
                      fontWeight: "bold",
                      width: 280,
                    }}
                  >
                    개인정보 파일명
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "grey.300",
                      fontWeight: "bold",
                      width: 220,
                    }}
                  >
                    자료의 종류
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "grey.300",
                      fontWeight: "bold",
                      width: 120,
                    }}
                  >
                    생성일
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "grey.300",
                      fontWeight: "bold",
                      width: 120,
                    }}
                  >
                    폐기일
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "grey.300",
                      fontWeight: "bold",
                      width: 160,
                    }}
                  >
                    폐기사유
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "grey.300",
                      fontWeight: "bold",
                      width: 120,
                    }}
                  >
                    처리담당자
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "grey.300",
                      fontWeight: "bold",
                      width: 120,
                    }}
                  >
                    처리부서장
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell align="center">{row.no}</TableCell>
                    <TableCell align="left">{row.fileName}</TableCell>
                    <TableCell align="left">{row.dataType}</TableCell>
                    <TableCell align="center">{row.createdDate}</TableCell>
                    <TableCell align="center">{row.disposeDate}</TableCell>
                    <TableCell align="left">{row.reason}</TableCell>
                    <TableCell align="center">{row.handler}</TableCell>
                    <TableCell align="center">{row.manager}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
