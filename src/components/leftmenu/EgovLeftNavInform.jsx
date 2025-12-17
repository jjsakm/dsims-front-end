import { NavLink } from "react-router"
import URL from "@/constants/url";

function EgovLeftNavInform() {
  console.groupCollapsed("EgovLeftNavInform");
  console.log("[Start] EgovLeftNavInform ------------------------------");
  console.log("------------------------------EgovLeftNavInform [End]");
  console.groupEnd("EgovLeftNavInform");
  return (
    <div className="nav">
      <div className="inner">
        <h2>알림마당</h2>
        <ul className="menu4">
          <li>
            <NavLink
              to={URL.DASHBOARD}
              className={({ isActive }) => (isActive ? "cur" : "")}
            >
              대시보드
            </NavLink>
          </li>
          <li>
            <NavLink
              to={URL.NOTICE_LIST}
              className={({ isActive }) => (isActive ? "cur" : "")}
            >
              공지사항
            </NavLink>
          </li>
          <li>
            <NavLink
              to={URL.DOC_CLASSIFICATION_LIST}
              className={({ isActive }) => (isActive ? "cur" : "")}
            >
              문서고 관리
            </NavLink>
          </li>
          <li>
            <NavLink
              to={URL.HOLDING_INSTITUTION_LIST}
              className={({ isActive }) => (isActive ? "cur" : "")}
            >
              보유기간 관리
            </NavLink>
          </li>
          <li>
            <NavLink
              to={URL.DIGITAL_DOC_LIST}
              className={({ isActive }) => (isActive ? "cur" : "")}
            >
              전자문서 관리
            </NavLink>
          </li>
          <li>
            <NavLink
              to={URL.DIGITAL_DOC_LIST}
              className={({ isActive }) => (isActive ? "cur" : "")}
            >
              전자문서 등록
            </NavLink>
          </li>
          <li>
            <NavLink
              to={URL.DOC_DESTRUCTION_REQ_LIST}
              className={({ isActive }) => (isActive ? "cur" : "")}
            >
              전자문사 파기요청
            </NavLink>
          </li>
          <li>
            <NavLink
              to={URL.DOC_DESTRUCTION_APPV_LIST}
              className={({ isActive }) => (isActive ? "cur" : "")}
            >
              전자문서 파기승인            </NavLink>
          </li>
          <li>
            <NavLink
              to={URL.DOC_DESTRUCTION_LIST}
              className={({ isActive }) => (isActive ? "cur" : "")}
            >
              전자문서 파기 목록
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default EgovLeftNavInform;
