import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { DocDestruction } from "@/types/docDestruction";
import useNotifications from "@/hooks/useNotifications/useNotifications";

type ButtonProps = {
  selectedRows: DocDestruction[];
};

export default function DocDestructionReqButton(prop: ButtonProps) {
  const { selectedRows } = prop;

  const notifications = useNotifications();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    if (selectedRows.length > 0) {
      setOpen(true);
    } else {
      notifications.show("파기 요청 할 문서를 선택하세요.", {
        severity: "info",
        autoHideDuration: 3000,
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(selectedRows);
    handleClose();
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        문서파기 신청
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>문서파기 신청</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="subscription-form">
            <TextField
              autoFocus
              required
              fullWidth
              variant="outlined"
              margin="dense"
              id="password"
              name="password"
              label="비밀번호"
              type="password"
            />
            <TextField
              autoFocus
              required
              fullWidth
              variant="outlined"
              margin="dense"
              id="reason"
              name="reason"
              label="사유"
              type="reason"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" form="subscription-form">
            문서파기 신청
          </Button>
          <Button onClick={handleClose}>취소</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
