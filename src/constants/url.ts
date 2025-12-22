const URL = {
  // 메인
  MAIN: "/",
  // 대시보드
  DASHBOARD: "/dashboard",
  // 공지사항
  NOTICE_LIST: "/notice/list",
  NOTICE_DETAIL: "/notice/:nttId",
  NOTICE_CREATE: "/notice/create",
  NOTICE_MODIFY: "/notice/:nttId/modify",
  // 문서고 관리
  DOC_CLASSIFICATION_LIST: "/docClassification/list",
  DOC_CLASSIFICATION_DETAIL: "/docClassification/:docClsfNo",
  DOC_CLASSIFICATION_CREATE: "/docClassification/create",
  DOC_CLASSIFICATION_MODIFY: "/docClassification/:docClsfNo/modify",
  // 보유기관 관리
  HOLDING_INSTITUTION_LIST: "/holdingInstitution/list",
  // 전자문서 관리
  DIGITAL_DOC_LIST: "/digitalDoc/list",
  DIGITAL_DOC_DETAIL: "/digitalDoc/:docId",
  DIGITAL_DOC_CREATE: "/digitalDoc/create",
  DIGITAL_DOC_EDIT: "/digitalDoc/:docId/modify",
  // 전자문서 파기
  DOC_DESTRUCTION_REQ_LIST: "/docDestructionReq/list",
  DOC_DESTRUCTION_APPV_LIST: "/docDestructionAppv/list",
  DOC_DESTRUCTION_LIST: "/docDestruction/list",
  DOC_DESTRUCTION_DETAIL: "/docDestruction/:docId",
};

export default URL;
