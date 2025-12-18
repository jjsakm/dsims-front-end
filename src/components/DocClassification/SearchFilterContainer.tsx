import * as React from "react";
import {styled} from '@mui/material/styles';
import type {BoxProps} from "@mui/material";
import {Box} from "@mui/material";

const StyledSearchFilterContainer = styled(Box)<BoxProps>(({theme}) => ({
  position: "relative",
  overflow: "hidden",
  width: "100%",
  marginBottom: theme.spacing(4),
  border: `1px solid ${theme.palette.divider}`,
  padding: "16px",
  borderRadius: "8px",
}));

export default function SearchFilterContainer({children, ...props}: BoxProps) {
  const layoutRef = React.useRef<HTMLDivElement>(null);

  return (
    <StyledSearchFilterContainer
      ref={layoutRef} {...props}
    >
      {children}
    </StyledSearchFilterContainer>
  );
}
