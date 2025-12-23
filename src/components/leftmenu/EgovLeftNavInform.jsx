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
import { ExpandLess, ExpandMore, Padding } from "@mui/icons-material";
import { yellow } from "@mui/material/colors";

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
  // 퍼블 메뉴
  { label: "대시보드", to: URL.DASHBOARD },
  { label: "공지사항", to: URL.NOTICE_LIST },
  {
    label: "문서고 관리",
    id: "docManagement",
    children: [
      {
        label: "문서분류 목록",
        to: "/pub/docClassification/list",
        isPublisher: true,
      },
      {
        label: "문서분류 상세",
        to: "/pub/docClassification/DocClassificationDetailPage",
        isPublisher: true,
      },
      {
        label: "문서분류 등록",
        to: "/pub/docClassification/create",
        isPublisher: true,
      },
      {
        label: "문서분류 수정",
        to: "/pub/docClassification/:docClassificationId/modify",
        isPublisher: true,
      },
      {
        label: "보유기간 변경",
        to: "/pub/holdingInstitution/list",
        isPublisher: true,
      },
    ],
  },
  {
    label: "문서고 조회",
    id: "docInquiry",
    children: [
      { label: "문서고 목록", to: "/pub/digitalDoc/list", isPublisher: true },
      {
        label: "문서고 상세",
        to: "/pub/digitalDoc/:digitalDocId",
        isPublisher: true,
      },
      { label: "문서고 등록", to: "/pub/digitalDoc/create", isPublisher: true },
      {
        label: "문서고 수정",
        to: "/pub/digitalDoc/:digitalDocId/edit",
        isPublisher: true,
      },
    ],
  },
  {
    label: "파기문서 관리",
    id: "docDestruction",
    children: [
      {
        label: "전자문서 파기신청",
        to: "/pub/docDestruction/reqList",
        isPublisher: true,
      },
      {
        label: "전자문서 파기승인",
        to: "/pub/docDestruction/appvList",
        isPublisher: true,
      },
      {
        label: "전자문서 파기목록",
        to: "/pub/docDestruction/list",
        isPublisher: true,
      },
      {
        label: "전자문서 파기상세",
        to: "/pub/docDestruction/:docDestructionId/detail",

        isPublisher: true,
      },
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
                    {item.children?.map((child, childIdx) => {
                      // ✨ 여기에 스타일 조건문 추가!
                      const childListItemTextStyle = child.isPublisher
                        ? {
                            color: "blue",
                            fontWeight: "bold",
                          }
                        : {
                            color: "gray",
                          };
                      return (
                        <ListItemButton
                          key={childIdx}
                          disableRipple
                          component={NavLink}
                          to={child.to}>
                          <ListItemText
                            primary={child.label}
                            sx={childListItemTextStyle}
                          />
                        </ListItemButton>
                      );
                    })}
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
