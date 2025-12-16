import * as React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { matchPath, useLocation } from "react-router";
import DashboardSidebarContext from "../../context/DashboardSidebarContext";
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from "../../constants";
import DashboardSidebarPageItem from "./DashboardSidebarPageItem";
import DashboardSidebarHeaderItem from "./DashboardSidebarHeaderItem";
import URL from "@/constants/url";

export interface DashboardSidebarProps {
  expanded?: boolean;
  setExpanded: (expanded: boolean) => void;
  disableCollapsibleSidebar?: boolean;
  container?: Element;
}

export default function DashboardSidebar({
  expanded = true,
  setExpanded,
  disableCollapsibleSidebar = false,
  container,
}: DashboardSidebarProps) {
  const theme = useTheme();

  const { pathname } = useLocation();

  const isOverSmViewport = useMediaQuery(theme.breakpoints.up("sm"));
  const isOverMdViewport = useMediaQuery(theme.breakpoints.up("md"));

  const [isFullyExpanded, setIsFullyExpanded] = React.useState(expanded);
  const [isFullyCollapsed, setIsFullyCollapsed] = React.useState(!expanded);

  React.useEffect(() => {
    if (expanded) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsFullyExpanded(true);
      }, theme.transitions.duration.enteringScreen);

      return () => clearTimeout(drawerWidthTransitionTimeout);
    }

    setIsFullyExpanded(false);

    return () => {};
  }, [expanded, theme.transitions.duration.enteringScreen]);

  React.useEffect(() => {
    if (!expanded) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsFullyCollapsed(true);
      }, theme.transitions.duration.leavingScreen);

      return () => clearTimeout(drawerWidthTransitionTimeout);
    }

    setIsFullyCollapsed(false);

    return () => {};
  }, [expanded, theme.transitions.duration.leavingScreen]);

  const mini = !disableCollapsibleSidebar && !expanded;

  const handleSetSidebarExpanded = React.useCallback(
    (newExpanded: boolean) => () => {
      setExpanded(newExpanded);
    },
    [setExpanded]
  );

  const handlePageItemClick = React.useCallback(
    (itemId: string, hasNestedNavigation: boolean) => {
      if (!isOverSmViewport && !hasNestedNavigation) {
        setExpanded(false);
      }
    },
    [setExpanded, isOverSmViewport]
  );

  const hasDrawerTransitions =
    isOverSmViewport && (!disableCollapsibleSidebar || isOverMdViewport);

  const getDrawerContent = React.useCallback(
    (viewport: "phone" | "tablet" | "desktop") => (
      <React.Fragment>
        <Toolbar />
        <Box
          component="nav"
          aria-label={`${viewport.charAt(0).toUpperCase()}${viewport.slice(1)}`}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "auto",
            scrollbarGutter: mini ? "stable" : "auto",
            overflowX: "hidden",
            pt: !mini ? 0 : 2,
          }}
        >
          <List
            dense
            sx={{
              padding: mini ? 0 : 0.5,
              mb: 4,
              width: mini ? MINI_DRAWER_WIDTH : "auto",
            }}
          >
            <DashboardSidebarPageItem
              id="notice"
              title="대시보드"
              icon={<LayersIcon />}
              href={URL.DASHBOARD}
              selected={!!matchPath(URL.DASHBOARD, pathname)}
            />
            <DashboardSidebarPageItem
              id="notice"
              title="공지사항"
              icon={<LayersIcon />}
              href="/notice/list"
              selected={!!matchPath(URL.NOTICE_LIST, pathname)}
            />
            <DashboardSidebarHeaderItem>문서고</DashboardSidebarHeaderItem>
            <DashboardSidebarPageItem
              id="docClassificationList"
              title="문서분류 관리"
              icon={<LayersIcon />}
              href={URL.DOC_CLASSIFICATION_LIST}
              selected={!!matchPath(URL.DOC_CLASSIFICATION_LIST, pathname)}
            />
            <DashboardSidebarPageItem
              id="holdingInstitutionList"
              title="보유기간 관리"
              icon={<LayersIcon />}
              href={URL.HOLDING_INSTITUTION_LIST}
              selected={!!matchPath(URL.HOLDING_INSTITUTION_LIST, pathname)}
            />
            <DashboardSidebarHeaderItem>전자문서</DashboardSidebarHeaderItem>
            <DashboardSidebarPageItem
              id="digitalDocList"
              title="전자문서 관리"
              icon={<LayersIcon />}
              href={URL.DIGITAL_DOC_LIST}
              selected={!!matchPath(URL.DIGITAL_DOC_LIST, pathname)}
            />
            <DashboardSidebarPageItem
              id="digitalDocCreate"
              title="전자문서 등록"
              icon={<LayersIcon />}
              href={URL.DIGITAL_DOC_CREATE}
              selected={!!matchPath(URL.DIGITAL_DOC_CREATE, pathname)}
            />
            <DashboardSidebarHeaderItem>파기문서</DashboardSidebarHeaderItem>
            <DashboardSidebarPageItem
              id="docDestructionReqL"
              title="파기신청"
              icon={<DescriptionIcon />}
              href={URL.DOC_DESTRUCTION_REQ_LIST}
              selected={!!matchPath(URL.DOC_DESTRUCTION_REQ_LIST, pathname)}
            />
            <DashboardSidebarPageItem
              id="docDestructionAppv"
              title="파기승인"
              icon={<DescriptionIcon />}
              href={URL.DOC_DESTRUCTION_APPV_LIST}
              selected={!!matchPath(URL.DOC_DESTRUCTION_APPV_LIST, pathname)}
            />
            <DashboardSidebarPageItem
              id="docDestructionList"
              title="파기문서 목록"
              icon={<DescriptionIcon />}
              href={URL.DOC_DESTRUCTION_LIST}
              selected={!!matchPath(URL.DOC_DESTRUCTION_LIST, pathname)}
            />
          </List>
        </Box>
      </React.Fragment>
    ),
    [mini, pathname]
  );

  const getDrawerSharedSx = React.useCallback(
    (isTemporary: boolean) => {
      const drawerWidth = mini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH;

      return {
        displayPrint: "none",
        width: drawerWidth,
        height: "100vh",
        flexShrink: 0,
        ...(isTemporary ? { position: "absolute" } : {}),
        [`& .MuiDrawer-paper`]: {
          position: "absolute",
          width: drawerWidth,
          height: "100vh",
          boxSizing: "border-box",
          backgroundImage: "none",
        },
      };
    },
    [mini]
  );

  const sidebarContextValue = React.useMemo(() => {
    return {
      onPageItemClick: handlePageItemClick,
      mini,
      fullyExpanded: isFullyExpanded,
      fullyCollapsed: isFullyCollapsed,
      hasDrawerTransitions,
    };
  }, [
    handlePageItemClick,
    mini,
    isFullyExpanded,
    isFullyCollapsed,
    hasDrawerTransitions,
  ]);

  return (
    <DashboardSidebarContext.Provider value={sidebarContextValue}>
      <Drawer
        container={container}
        variant="temporary"
        open={expanded}
        onClose={handleSetSidebarExpanded(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: {
            xs: "block",
            sm: disableCollapsibleSidebar ? "block" : "none",
            md: "none",
          },
          ...getDrawerSharedSx(true),
        }}
      >
        {getDrawerContent("phone")}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            sm: disableCollapsibleSidebar ? "none" : "block",
            md: "none",
          },
          ...getDrawerSharedSx(false),
        }}
      >
        {getDrawerContent("tablet")}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          ...getDrawerSharedSx(false),
        }}
      >
        {getDrawerContent("desktop")}
      </Drawer>
    </DashboardSidebarContext.Provider>
  );
}
