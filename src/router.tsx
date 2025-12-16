import { createBrowserRouter, redirect } from "react-router";
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

export const router = createBrowserRouter([
  {
    Component: DashboardLayout,
    children: [
      {
        index: true,
        loader: () => redirect(URL.DASHBOARD),
      },
      // 대시보드
      {
        path: URL.DASHBOARD,
        Component: DashboardPage,
      },
      // 공지사항
      {
        path: URL.NOTICE_LIST,
        Component: EgovNoticeListPage,
      },
      {
        path: URL.NOTICE_DETAIL,
        Component: EgovNoticeDetailPage,
      },
      {
        path: URL.NOTICE_CREATE,
        Component: EgovNoticeFormPage,
      },
      {
        path: URL.NOTICE_MODIFY,
        Component: EgovNoticeFormPage,
      },
      // 문서고 관리
      {
        path: URL.DOC_CLASSIFICATION_LIST,
        Component: DocClassificationListPage,
      },
      {
        path: URL.DOC_CLASSIFICATION_DETAIL,
        Component: ManagementDetaiilPage,
      },
      {
        path: URL.DOC_CLASSIFICATION_CREATE,
        Component: DocClassificationFormPage,
      },
      {
        path: URL.DOC_CLASSIFICATION_MODIFY,
        Component: DocClassificationFormPage,
      },
      // 보유기관 관리
      {
        path: URL.HOLDING_INSTITUTION_LIST,
        Component: HoldingInstitutionListPage,
      },
      // 전자문서 관리
      {
        path: URL.DIGITAL_DOC_LIST,
        Component: DigitalDocListPage,
      },
      {
        path: URL.DIGITAL_DOC_DETAIL,
        Component: DigitalDocDetailPage,
      },
      {
        path: URL.DIGITAL_DOC_CREATE,
        Component: DigitalDocFormPage,
      },
      {
        path: URL.DIGITAL_DOC_EDIT,
        Component: DigitalDocFormPage,
      },
      // 전자문서 파기
      {
        path: URL.DOC_DESTRUCTION_REQ_LIST,
        Component: DocDestructionReqListPage,
      },
      {
        path: URL.DOC_DESTRUCTION_APPV_LIST,
        Component: DocDestructionAppvListPage,
      },
      {
        path: URL.DOC_DESTRUCTION_LIST,
        Component: DocDestructionListPage,
      },
      {
        path: URL.DOC_DESTRUCTION_DETAIL,
        Component: DocDestructionDetailPage,
      },
      // Fallback route for the example routes in dashboard sidebar items
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);
