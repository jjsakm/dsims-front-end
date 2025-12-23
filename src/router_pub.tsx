import {createBrowserRouter} from "react-router";
import DocClassificationListPage from "./pages_pub/DocClassification/DocClassificationListPage";
import ManagementDetaiilPage from "./pages_pub/DocClassification/DocClassificationDetailPage";
import DocClassificationFormPage from "./pages_pub/DocClassification/DocClassificationFormPage";
import HoldingInstitutionListPage from "./pages_pub/HoldingInstitution/HoldingInstitutionListPage";
import DigitalDocListPage from "./pages_pub/DigitalDoc/DigitalDocListPage";
import DigitalDocDetailPage from "./pages_pub/DigitalDoc/DigitalDocDetailPage";
import DigitalDocFormPage from "./pages_pub/DigitalDoc/DigitalDocFormPage";
import DocDestructionListPage from "./pages_pub/DocDestruction/DocDestructionListPage";
import DocDestructionReqListPage from "./pages_pub/DocDestruction/DocDestructionReqListPage";
import DocDestructionAppvListPage from "./pages_pub/DocDestruction/DocDestructionAppvListPage";
import DocDestructionDetailPage from "./pages_pub/DocDestruction/DocDestructionDetailPage";

const URL = {
  // 문서고 관리
  DOC_CLASSIFICATION_LIST: "docClassification/list",
  DOC_CLASSIFICATION_DETAIL: "docClassification/:docClassificationId",
  DOC_CLASSIFICATION_CREATE: "docClassification/create",
  DOC_CLASSIFICATION_MODIFY: "docClassification/:docClassificationId/modify",
  HOLDING_INSTITUTION_LIST: "holdingInstitution/list",
  DIGITAL_DOC_LIST: "digitalDoc/list",
  DIGITAL_DOC_DETAIL: "digitalDoc/:digitalDocId",
  DIGITAL_DOC_CREATE: "digitalDoc/create",
  DIGITAL_DOC_EDIT: "digitalDoc/:digitalDocId/edit",
  DOC_DESTRUCTION_REQ_LIST: "docDestruction/reqList",
  DOC_DESTRUCTION_APPV_LIST: "docDestruction/appvList",
  DOC_DESTRUCTION_LIST: "docDestruction/list",
  DOC_DESTRUCTION_DETAIL: "docDestruction/:docDestructionId/detail",
};

export const router_pub = createBrowserRouter([
  // 문서고관리
  {
    id: "docClassification_pub",
    path: URL.DOC_CLASSIFICATION_LIST,
    Component: DocClassificationListPage,
    handle: { breadcrumb: "문서분류 관리" },
  },
  {
    id: "docClassification_detail_pub",
    path: URL.DOC_CLASSIFICATION_DETAIL,
    Component: ManagementDetaiilPage,
    handle: { breadcrumb: "문서분류 상세" },
  },
  {
    id: "docClassification_create_pub",
    path: URL.DOC_CLASSIFICATION_CREATE,
    Component: DocClassificationFormPage,
    handle: { breadcrumb: "문서분류 등록" },
  },
  {
    id: "docClassification_modify_pub",
    path: URL.DOC_CLASSIFICATION_MODIFY,
    Component: DocClassificationFormPage,
    handle: { breadcrumb: "문서분류 수정" },
  },
  // 보유기간 관리
  {
    id: "holdingInstitution_pub",
    path: URL.HOLDING_INSTITUTION_LIST,
    Component: HoldingInstitutionListPage,
    handle: { breadcrumb: "보유기간 관리" },
  },
  // 전자문서 관리
  {
    id: "digitalDoc_pub",
    path: URL.DIGITAL_DOC_LIST,
    Component: DigitalDocListPage,
    handle: { breadcrumb: "문서고 목록" },
  },
  {
    id: "digitalDoc-detail_pub",
    path: URL.DIGITAL_DOC_DETAIL,
    Component: DigitalDocDetailPage,
    handle: { breadcrumb: "문서고 상세" },
  },
  {
    id: "digitalDoc-create_pub",
    path: URL.DIGITAL_DOC_CREATE,
    Component: DigitalDocFormPage,
    handle: { breadcrumb: "문서고 등록" },
  },
  {
    id: "digitalDoc-edit_pub",
    path: URL.DIGITAL_DOC_EDIT,
    Component: DigitalDocFormPage,
    handle: { breadcrumb: "문서고 수정" },
  },
  // 전자문서 파기
  {
    id: "docDestruction-req-list_pub",
    path: URL.DOC_DESTRUCTION_REQ_LIST,
    Component: DocDestructionReqListPage,
  },
  {
    id: "docDestruction-appv-list_pub",
    path: URL.DOC_DESTRUCTION_APPV_LIST,
    Component: DocDestructionAppvListPage,
  },
  {
    id: "docDestruction-list_pub",
    path: URL.DOC_DESTRUCTION_LIST,
    Component: DocDestructionListPage,
  },
  {
    id: "docDestruction-detail_pub",
    path: URL.DOC_DESTRUCTION_DETAIL,
    Component: DocDestructionDetailPage,
  },
]);
