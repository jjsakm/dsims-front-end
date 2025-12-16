import * as React from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface HistoryRow {
  id: number;
  date: string;
  actor: string;
  action: string;
  ip: string;
  device: string;
}

const historyRows: HistoryRow[] = [
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
  {
    id: 4,
    date: "2025. 10. 01.",
    actor: "홍길동",
    action: "문서분류 수정",
    ip: "111.111.\n111.111",
    device: "PC",
  },
  {
    id: 5,
    date: "2025. 09. 30.",
    actor: "홍길동",
    action: "문서분류 수정",
    ip: "111.111.\n111.111",
    device: "PC",
  },
  {
    id: 6,
    date: "2025. 09. 26.",
    actor: "홍길동",
    action: "문서분류 등록",
    ip: "111.111.\n111.111",
    device: "PC",
  },
];

export default function DocClassificationHistoryButton() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        이력
      </Button>
      <Dialog maxWidth="md" open={open} onClose={handleClose}>
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            position: "relative",
            fontWeight: 600,
          }}
        >
          이력
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 600 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    번호
                  </th>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    행위일자
                  </th>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    행위자
                  </th>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    행위내용
                  </th>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    IP
                  </th>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    장비
                  </th>
                </tr>
              </thead>
              <tbody>
                {historyRows.map((row) => (
                  <tr key={row.id}>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {row.id}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {row.date}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {row.actor}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {row.action}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {row.ip}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {row.device}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
