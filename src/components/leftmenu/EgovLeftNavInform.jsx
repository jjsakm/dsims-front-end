import React, { useState } from "react";
import { NavLink } from "react-router";
import URL from "@/constants/url";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  styled,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const Nav = styled(Box)({
  display: "table-cell",
  width: "260px",
  verticalAlign: "top",
  marginLeft: "40px",
  border: "1px solid #dde2e5",
  borderRadius: "10px",
});
const Wrapper = styled(List)({});
const MenuButton = styled(ListItemButton)({
  "& .MuiListItemText-primary": {
    fontSize: "16px",
    color: "#555",
  },
  "&.active": {
    backgroundColor: "#f5f5f5",
    "& .MuiListItemText-primary": {
      fontWeight: "bold",
      color: "#000",
    },
  },
});

const ChildMenuButton = styled(MenuButton)({
  paddingLeft: "32px",
});

const MENU_ITEMS = [
  { label: "대시보드", to: URL.DASHBOARD },
  { label: "공지사항", to: URL.NOTICE_LIST },
  {
    label: "문서고 관리",
    id: "docManagement",
    children: [
      { label: "문서분류 관리", to: URL.DOC_CLASSIFICATION_LIST },
      { label: "보유기간 변경", to: URL.HOLDING_INSTITUTION_LIST },
    ],
  },
  {
    label: "문서고 조회",
    id: "docInquiry",
    children: [
      { label: "문서고 등록", to: URL.DIGITAL_DOC_LIST },
      { label: "문서고 조회", to: URL.DIGITAL_DOC_LIST },
    ],
  },
  {
    label: "파기문서 관리",
    id: "docDestruction",
    children: [
      { label: "전자문서 파기신청", to: URL.DOC_DESTRUCTION_REQ_LIST },
      { label: "전자문서 파기승인", to: URL.DOC_DESTRUCTION_APPV_LIST },
      { label: "전자문서 파기목록", to: URL.DOC_DESTRUCTION_LIST },
    ],
  },
];

function EgovLeftNavInform() {
  const [openStates, setOpenStates] = useState({
    docManagement: true,
    docInquiry: true,
    docDestruction: true,
  });

  const handleToggle = (id) => {
    setOpenStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Nav className="nav">
      <Typography variant="h2" fontWeight="bold">
        알림마당
      </Typography>
      <Wrapper component="nav">
        {MENU_ITEMS.map((item, index) => {
          const hasChildren = Boolean(item.children);
          return (
            <React.Fragment key={index}>
              <MenuButton
                disableRipple
                component={hasChildren ? "div" : NavLink}
                to={hasChildren ? undefined : item.to}
                onClick={hasChildren ? () => handleToggle(item.id) : undefined}>
                <ListItemText primary={item.label} />
                {hasChildren &&
                  (openStates[item.id] ? <ExpandLess /> : <ExpandMore />)}
              </MenuButton>

              {hasChildren && (
                <Collapse in={openStates[item.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child, childIdx) => (
                      /* 2. sx 대신 스타일 정의된 컴포넌트 사용 */
                      <ChildMenuButton
                        key={childIdx}
                        disableRipple
                        component={NavLink}
                        to={child.to}>
                        <ListItemText primary={child.label} />
                      </ChildMenuButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </Wrapper>
    </Nav>
  );
}

export default EgovLeftNavInform;
