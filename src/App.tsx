import CssBaseline from "@mui/material/CssBaseline";
import { RouterProvider } from "react-router";
import NotificationsProvider from "./hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "./hooks/useDialogs/DialogsProvider";
import AppTheme from "./theme/AppTheme";
import { router } from "./router";
import {
  dataGridCustomizations,
  datePickersCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from "./theme/customizations";

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function CrudDashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <RouterProvider router={router} />
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
