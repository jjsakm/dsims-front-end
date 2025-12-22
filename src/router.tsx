import {createBrowserRouter, redirect} from "react-router";
import DashboardLayout from "./components/Layout/DashboardLayout";
import DashboardPage from "./pages/Dashboard";
import EgovNoticeListPage from "./pages/Notice/EgovNoticeListPage";
import DocClassificationListPage from "./pages/DocClassification/DocClassificationListPage";
import ManagementDetaiilPage from "./pages/DocClassification/DocClassificationDetailPage";
import DocClassificationFormPage from "./pages/DocClassification/DocClassificationFormPage";
import HoldingInstitutionListPage from "./pages/HoldingInstitution/HoldingInstitutionListPage";
import DigitalDocListPage from "./pages/DigitalDoc/DigitalDocListPage";
import DigitalDocDetailPage from "./pages/DigitalDoc/DigitalDocDetailPage";
import DigitalDocFormPage from "./pages/DigitalDoc/DigitalDocFormPage";
import DocDestructionListPage from "./pages/DocDestruction/DocDestructionListPage";
import DocDestructionReqListPage from "./pages/DocDestruction/DocDestructionReqListPage";
import DocDestructionAppvListPage from "./pages/DocDestruction/DocDestructionAppvListPage";
import DocDestructionDetailPage from "./pages/DocDestruction/DocDestructionDetailPage";
import NotFound from "./NotFound";
import URL from "./constants/url";
import EgovNoticeDetailPage from "./pages/Notice/EgovNoticeDetailPage";
import EgovNoticeFormPage from "./pages/Notice/EgovNoticeFormPage";
import {router_pub} from "@/router_pub.tsx";

export const router = createBrowserRouter([
  {
    Component: DashboardLayout,
    children: [
      {
        id: "main",
        index: true,
        loader: () => redirect(URL.DASHBOARD),
      },
      // 대시보드
      {
        id: "dashboard",
        path: URL.DASHBOARD,
        Component: DashboardPage,
      },
      // 공지사항
      {
        id: "notice",
        path: URL.NOTICE_LIST,
        Component: EgovNoticeListPage,
      },
      {
        id: "notice-detail",
        path: URL.NOTICE_DETAIL,
        Component: EgovNoticeDetailPage,
      },
      {
        id: "notice-create",
        path: URL.NOTICE_CREATE,
        Component: EgovNoticeFormPage,
      },
      {
        id: "notice-modify",
        path: URL.NOTICE_MODIFY,
        Component: EgovNoticeFormPage,
      },
      // 문서고 관리
      {
        id: "docManagementGroup",
        handle: { breadcrumb: "문서고 관리" },
        children: [
          {
            id: "docClassification",
            path: URL.DOC_CLASSIFICATION_LIST,
            Component: DocClassificationListPage,
            handle: { breadcrumb: "문서분류 관리" },
          },
          {
            id: "docClassification-detail",
            path: URL.DOC_CLASSIFICATION_DETAIL,
            Component: ManagementDetaiilPage,
            handle: { breadcrumb: "문서분류 상세" },
          },
          {
            id: "docClassification-create",
            path: URL.DOC_CLASSIFICATION_CREATE,
            Component: DocClassificationFormPage,
            handle: { breadcrumb: "문서분류 등록" },
          },
          {
            id: "docClassification-modify",
            path: URL.DOC_CLASSIFICATION_MODIFY,
            Component: DocClassificationFormPage,
            handle: { breadcrumb: "문서분류 수정" },
          },
          // 보유기관 관리
          {
            id: "holdingInstitution",
            path: URL.HOLDING_INSTITUTION_LIST,
            Component: HoldingInstitutionListPage,
            handle: { breadcrumb: "보유기간 관리" },
          },
        ],
      },
      // 전자문서 관리
      {
        id: "digitalDoc",
        path: URL.DIGITAL_DOC_LIST,
        Component: DigitalDocListPage,
      },
      {
        id: "digitalDoc-detail",
        path: URL.DIGITAL_DOC_DETAIL,
        Component: DigitalDocDetailPage,
      },
      {
        id: "digitalDoc-create",
        path: URL.DIGITAL_DOC_CREATE,
        Component: DigitalDocFormPage,
      },
      {
        id: "digitalDoc-edit",
        path: URL.DIGITAL_DOC_EDIT,
        Component: DigitalDocFormPage,
      },
      // 전자문서 파기
      {
        id: "docDestruction-req-list",
        path: URL.DOC_DESTRUCTION_REQ_LIST,
        Component: DocDestructionReqListPage,
      },
      {
        id: "docDestruction-appv-list",
        path: URL.DOC_DESTRUCTION_APPV_LIST,
        Component: DocDestructionAppvListPage,
      },
      {
        id: "docDestruction-list",
        path: URL.DOC_DESTRUCTION_LIST,
        Component: DocDestructionListPage,
      },
      {
        id: "docDestruction-detail",
        path: URL.DOC_DESTRUCTION_DETAIL,
        Component: DocDestructionDetailPage,
      },
      {
        id: "pub",
        path: "/pub",
        children: [...router_pub.routes],
      },
      // Fallback route for the example routes in dashboard sidebar items
      {
        id: "fallback",
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);
