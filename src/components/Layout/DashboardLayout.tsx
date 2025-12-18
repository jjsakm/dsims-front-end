 
import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {Outlet} from "react-router";
import EgovLeftNavInform from "../leftmenu/EgovLeftNavInform";
import {Stack} from "@mui/material";
import PageContainer from "../AgGridContainer/PageContainer.tsx";

export default function DashboardLayout() {
  const layoutRef = React.useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={layoutRef}
      sx={{
        position: "relative",
        display: "flex",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div className="container">
        <div className="c_wrap">
          <div className="layout">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minWidth: 0,
              }}
            >
              <Toolbar sx={{displayPrint: "none"}}/>
              <Stack direction="row">
                <EgovLeftNavInform/>
                <PageContainer
                >
                  <Outlet/>
                </PageContainer>
              </Stack>
            </Box>
          </div>
        </div>
      </div>
    </Box>
  );
}
