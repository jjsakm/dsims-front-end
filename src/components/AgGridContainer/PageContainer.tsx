"use client";
import * as React from "react";
import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container, {type ContainerProps} from "@mui/material/Container";
import Stack from "@mui/material/Stack";

const PageContentHeader = styled("div")(({theme}) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: theme.spacing(2),
}));

const PageHeaderToolbar = styled("div")(({theme}) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(1),
  // Ensure the toolbar is always on the right side, even after wrapping
  marginLeft: "auto",
}));

export interface Breadcrumb {
  title: string;
  path?: string;
}

export interface PageContainerProps extends ContainerProps {
  children?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}

export default function PageContainer(props: PageContainerProps) {
  const {children, actions = null} = props;

  return (
    <Container sx={{my: 2}}>
      <Stack spacing={2}>
        <Stack>
          <PageContentHeader>
            <PageHeaderToolbar>{actions}</PageHeaderToolbar>
          </PageContentHeader>
        </Stack>
        <Box>{children}</Box>
      </Stack>
    </Container>
  );
}
