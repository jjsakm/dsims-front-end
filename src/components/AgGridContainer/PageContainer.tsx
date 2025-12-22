"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Container,
  type ContainerProps,
  Breadcrumbs,
  Typography,
  Link,
  Stack,
  Box,
} from "@mui/material";
import { useMatches, NavLink } from "react-router";

export interface PageContainerProps extends ContainerProps {
  children?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: { title: string; path?: string }[];
}

const PageContentHeader = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: theme.spacing(2),
}));

const PageHeaderToolbar = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(1),
  marginLeft: "auto",
}));

export default function PageContainer(props: PageContainerProps) {
  const { children, actions = null } = props;

  const matches = useMatches();

  const autoCrumbs = matches
    .filter((match: any) => Boolean(match.handle?.breadcrumb))
    .map((match: any) => ({
      title: match.handle.breadcrumb,
      path: match.pathname,
    }));

  return (
    <Container>
      <Stack spacing={2}>
        <PageContentHeader>
          {autoCrumbs.length > 0 && (
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                component={NavLink}
                to="/"
                underline="hover"
                color="inherit">
                홈
              </Link>
              {autoCrumbs.map((crumb, index) => {
                const isLast = index === autoCrumbs.length - 1;

                return isLast ? (
                  <Typography
                    key={index}
                    color="text.primary"
                    fontWeight="bold">
                    {crumb.title}
                  </Typography>
                ) : (
                  <Link
                    key={index}
                    component={NavLink}
                    to={crumb.path}
                    underline="hover"
                    color="inherit">
                    {crumb.title}
                  </Link>
                );
              })}
            </Breadcrumbs>
          )}
          <PageHeaderToolbar>{actions}</PageHeaderToolbar>
        </PageContentHeader>
        <Box>{children}</Box>
      </Stack>
    </Container>
  );
}
