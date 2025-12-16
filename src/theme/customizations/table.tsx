import { type Components, type Theme } from "@mui/material/styles";
import { gray } from "../themePrimitives";

export const tableCustomizations: Components<Theme> = {
  MuiTable: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: "100%",
        borderCollapse: "collapse",
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
      }),
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .MuiTableCell-root`]: {
          padding: "8px 12px",
          border: `1px solid ${(theme.vars || theme).palette.divider}`,
          backgroundColor: gray[200] ?? "#ababab",
          fontWeight: theme.typography.fontWeightMedium,
          textAlign: "center",
          whiteSpace: "nowrap",
        },
      }),
    },
  },
  MuiTableBody: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .MuiTableCell-root`]: {
          padding: "8px 12px",
          border: `1px solid ${(theme.vars || theme).palette.divider}`,
          textAlign: "left",
        },
      }),
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&:nth-of-type(even)": {
          backgroundColor: (theme.vars || theme).palette.action.hover,
        },
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: theme.typography.body2.fontSize,
        lineHeight: theme.typography.body2.lineHeight,
        backgroundColor: (theme.vars || theme).palette.common.white,
      }),
    },
  },
};
