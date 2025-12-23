import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { DocClassHistory } from "@/types/docClassification";
import PageStatus from "../PageStatus";

export default function DocClassificationHistoryButton() {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [rowData, setRowsData] = React.useState<DocClassHistory[]>([]);

  const loadData = async () => {
    setError(null);
    setIsLoading(true);

    try {
      console.log(111);
    } catch (listDataError) {
      setError(listDataError as Error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoading || error) {
    return <PageStatus isLoading={isLoading} error={error} />;
  }

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
                {rowData.map((row) => (
                  <tr key={row.docClsfNm}>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {row.docClsfNm}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {row.docClsfNm}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {row.docClsfNm}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {row.docClsfNm}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {row.docClsfNm}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {row.docClsfNm}
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
