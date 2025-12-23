import React from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";

export interface CellGroup {
  label: string;
  content?: string | React.ReactNode | string[];
  contentColSpan?: number;
  inputType?: "text" | "textarea" | "radio" | "checkbox" | "custom";
  renderInput?: () => React.ReactNode;
}

export interface InfoTableRow {
  groups: CellGroup[];
}

export interface InfoTableProps {
  rows: InfoTableRow[];
  tableAriaLabel: string;
}

export const InfoTableView: React.FC<InfoTableProps> = ({
  rows,
  tableAriaLabel,
}) => {
  return (
    <Table size="small" width="100%" aria-label={tableAriaLabel}>
      <TableBody>
        {rows.map((row, ridx) => (
          <TableRow key={ridx}>
            {row.groups.map((group, gidx) => (
              <React.Fragment key={`${ridx}-${gidx}`}>
                <TableCell>{group.label}</TableCell>
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
  );
};

export const InfoTableCreate: React.FC<InfoTableProps> = ({
  rows,
  tableAriaLabel,
}) => {
  return (
    <Table size="small" width="100%" aria-label={tableAriaLabel}>
      <TableBody>
        {rows.map((row, ridx) => (
          <TableRow key={ridx}>
            {row.groups.map((group, gidx) => (
              <React.Fragment key={`${ridx}-${gidx}`}>
                <TableCell>{group.label}</TableCell>
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
