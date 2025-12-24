import React from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Stack,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  FormGroup,
  useTheme,
  Typography,
  TableContainer,
} from "@mui/material";

export interface CellGroup {
  label: string;
  content?: string | React.ReactNode | string[];
  contentColSpan?: number;
  inputType?: "text" | "textarea" | "radio" | "checkbox" | "custom";
  renderInput?: () => React.ReactNode;
}

export interface HorizontalTableRow {
  groups: CellGroup[];
}

export interface HorizontalTableProps {
  rows: HorizontalTableRow[];
  tableAriaLabel: string;
}

export const HorizontalTableView = ({ rows, tableAriaLabel }) => {
  const theme = useTheme();

  const styleGroup = {
    container: { width: "100%" },
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
    <TableContainer
      component={Paper}
      sx={{ width: "100%", margin: "auto", borderRadius: "0" }}
    >
      <Table size="small" aria-label={tableAriaLabel} sx={styleGroup.container}>
        <TableBody>
          {rows.map((row, ridx) => (
            <TableRow key={ridx}>
              {row.groups.map((group, gidx) => (
                <React.Fragment key={`${ridx}-${gidx}`}>
                  <TableCell sx={styleGroup.label}>
                    <Typography sx={styleGroup.text}>{group.label}</Typography>
                  </TableCell>
                  <TableCell colSpan={group.contentColSpan ?? 3}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {typeof group.content === "string"
                        ? group.content
                        : Array.isArray(group.content)
                        ? group.content.join(", ")
                        : group.content}
                    </Stack>
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const HorizontalTableCreate = ({ rows, tableAriaLabel }) => {
  const theme = useTheme();

  const styleGroup = {
    container: { width: "100%" },
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
    <Table size="small" aria-label={tableAriaLabel} sx={styleGroup.container}>
      <TableBody>
        {rows.map((row, ridx) => (
          <TableRow key={ridx}>
            {row.groups.map((group, gidx) => (
              <React.Fragment key={`${ridx}-${gidx}`}>
                <TableCell sx={styleGroup.label}>
                  <Typography sx={styleGroup.text}>{group.label}</Typography>
                </TableCell>
                <TableCell colSpan={group.contentColSpan ?? 3}>
                  {group.renderInput ? (
                    group.renderInput()
                  ) : (
                    <Stack direction="row" spacing={1} alignItems="center">
                      {(() => {
                        if (typeof group.content === "string") {
                          if (group.inputType === "textarea") {
                            return (
                              <TextField
                                defaultValue={group.content}
                                size="small"
                                fullWidth
                                multiline
                                minRows={3}
                              />
                            );
                          }
                          return (
                            <TextField
                              defaultValue={group.content}
                              size="small"
                              fullWidth
                            />
                          );
                        }
                        if (
                          Array.isArray(group.content) &&
                          (group.inputType === "radio" ||
                            group.inputType === "checkbox")
                        ) {
                          if (group.inputType === "radio") {
                            return (
                              <RadioGroup row>
                                {group.content.map((option, i) => (
                                  <FormControlLabel
                                    key={i}
                                    value={option}
                                    control={<Radio />}
                                    label={option}
                                  />
                                ))}
                              </RadioGroup>
                            );
                          } else if (group.inputType === "checkbox") {
                            return (
                              <FormGroup row>
                                {group.content.map((option, i) => (
                                  <FormControlLabel
                                    key={i}
                                    control={<Checkbox />}
                                    label={option}
                                  />
                                ))}
                              </FormGroup>
                            );
                          }
                        }
                        return group.content;
                      })()}
                    </Stack>
                  )}
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
