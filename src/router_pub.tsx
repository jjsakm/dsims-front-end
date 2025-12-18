import {createBrowserRouter} from "react-router";
import DocClassificationListPage from "./pages_pub/DocClassification/DocClassificationListPage";
import ManagementDetaiilPage from "./pages_pub/DocClassification/DocClassificationDetailPage";
import DocClassificationFormPage from "./pages_pub/DocClassification/DocClassificationFormPage";

const URL = {
  // 문서고 관리
  DOC_CLASSIFICATION_LIST: "docClassification/list",
  DOC_CLASSIFICATION_DETAIL: "docClassification/:docClassificationId",
  DOC_CLASSIFICATION_CREATE: "docClassification/create",
  DOC_CLASSIFICATION_MODIFY: "docClassification/:docClassificationId/modify",
};

export const router_pub = createBrowserRouter([
  // 문서고관리
  {
    id: "docClassification_pub",
    path: URL.DOC_CLASSIFICATION_LIST,
    Component: DocClassificationListPage,
  },
  {
    id: "docClassification_detail_pub",
    path: URL.DOC_CLASSIFICATION_DETAIL,
    Component: ManagementDetaiilPage,
  },
  {
    id: "docClassification_create_pub",
    path: URL.DOC_CLASSIFICATION_CREATE,
    Component: DocClassificationFormPage,
  },
  {
    id: "docClassification_modify_pub",
    path: URL.DOC_CLASSIFICATION_MODIFY,
    Component: DocClassificationFormPage,
  },
]);
