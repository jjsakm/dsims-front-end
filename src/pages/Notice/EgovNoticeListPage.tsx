import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import { NOTICE_BBS_ID } from "@/config";

import EgovPaging from "@/components/EgovPaging";

import { itemIdxByPage } from "@/utils/calc";
import { getSessionItem } from "@/utils/storage";

import axios from "axios";

type SearchCondition = {
  bbsId: string;
  pageIndex: number;
  searchCnd: string;
  searchWrd: string;
};

type NoticeListItem = {
  nttId: string | number;
  bbsId: string;
  replyLc?: string | number;
  nttSj?: string;
  frstRegisterNm?: string;
  frstRegisterPnttm?: string;
  inqireCo?: string | number;
};

type PaginationInfo = {
  currentPageNo?: number;
  pageSize?: number;
  totalRecordCount?: number;
  [key: string]: any;
};

type BoardMaster = {
  bbsUseFlag?: string;
  [key: string]: any;
};

type UserInfo = {
  [key: string]: any;
};

function EgovNoticeList(props: any) {
  console.log(props);

  const location = useLocation();

  // 관리자 권한 체크(세션)
  const sessionUser = getSessionItem("loginUser");
  const sessionUserSe = sessionUser?.userSe;

  const bbsId: string = location.state?.bbsId || NOTICE_BBS_ID;

  const initialSearchCondition: SearchCondition =
    location.state?.searchCondition ||
    ({
      bbsId,
      pageIndex: 1,
      searchCnd: "0",
      searchWrd: "",
    } satisfies SearchCondition);

  const [searchCondition, setSearchCondition] = useState<SearchCondition>(
    initialSearchCondition
  );

  // 화면 입력값(검색 폼)
  const [searchCnd, setSearchCnd] = useState<string>(
    initialSearchCondition.searchCnd
  );
  const [searchWrd, setSearchWrd] = useState<string>(
    initialSearchCondition.searchWrd
  );

  const [masterBoard, setMasterBoard] = useState<BoardMaster>({});
  const [user, setUser] = useState<UserInfo>({});
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({});

  const [rows, setRows] = useState<NoticeListItem[]>([]);
  const [resultCnt, setResultCnt] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const canCreate = useMemo(() => {
    return !!user && sessionUserSe === "ADM" && masterBoard?.bbsUseFlag === "Y";
  }, [user, sessionUserSe, masterBoard]);

  const fetchList = useCallback(async (condition: SearchCondition) => {
    const res = await axios.get("/api/dbtest");

    console.log(res);
    const retrieveListURL = "/board" + EgovNet.getQueryString(condition);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    };

    setIsLoading(true);
    setError(null);

    try {
      const resp: any = await new Promise((resolve, reject) => {
        EgovNet.requestFetch(
          retrieveListURL,
          requestOptions,
          (r: any) => resolve(r),
          (e: any) => reject(e)
        );
      });

      const result = resp?.result;

      setMasterBoard(result?.brdMstrVO ?? {});
      setPaginationInfo(result?.paginationInfo ?? {});
      setUser(result?.user ?? {});

      const cnt = Number.parseInt(result?.resultCnt ?? "0", 10);
      setResultCnt(Number.isNaN(cnt) ? 0 : cnt);

      setRows(Array.isArray(result?.resultList) ? result.resultList : []);
    } catch (e) {
      // 기존 코드에서도 콘솔만 찍고 UI 처리는 없었으므로,
      // 에러 상태만 보관해 두고 목록은 비웁니다.
      setError(e);
      setRows([]);
      setResultCnt(0);
      // eslint-disable-next-line no-console
      console.log("err response : ", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList(searchCondition);
  }, [fetchList, searchCondition]);

  const handleSearch = () => {
    setSearchCondition((prev) => ({
      ...prev,
      bbsId,
      pageIndex: 1,
      searchCnd,
      searchWrd,
    }));
  };

  const handleMovePage = (passedPage: number) => {
    setSearchCondition((prev) => ({
      ...prev,
      bbsId,
      pageIndex: passedPage,
      searchCnd,
      searchWrd,
    }));
  };

  const renderedRows = useMemo(() => {
    if (isLoading && rows.length === 0) {
      return (
        <p className="no_data" key="loading">
          불러오는 중입니다...
        </p>
      );
    }

    if (!isLoading && rows.length === 0) {
      return (
        <p className="no_data" key="empty">
          검색된 결과가 없습니다.
        </p>
      );
    }

    const currentPageNo = Number(paginationInfo?.currentPageNo ?? 1);
    const pageSize = Number(paginationInfo?.pageSize ?? 10);

    return rows.map((item, index) => {
      const listIdx = itemIdxByPage(resultCnt, currentPageNo, pageSize, index);
      const isReply = Number(item.replyLc ?? 0) > 0;

      return (
        <Link
          to={{ pathname: URL.NOTICE_DETAIL }}
          state={{
            nttId: item.nttId,
            bbsId: item.bbsId,
            searchCondition,
          }}
          key={String(listIdx)}
          className="list_item"
        >
          <div>{listIdx}</div>
          <div className={isReply ? "al reply" : "al"}>{item.nttSj}</div>
          <div>{item.frstRegisterNm}</div>
          <div>{item.frstRegisterPnttm}</div>
          <div>{item.inqireCo}</div>
        </Link>
      );
    });
  }, [isLoading, rows, paginationInfo, resultCnt, searchCondition]);

  return (
    <div className="container">
      <div className="c_wrap">
        {/* <!-- Location --> */}
        <div className="location">
          <ul>
            <li>
              <Link to={URL.MAIN} className="home">
                Home
              </Link>
            </li>
            <li>공지사항</li>
          </ul>
        </div>
        {/* <!--// Location --> */}

        <div className="layout">
          <div className="contents NOTICE_LIST" id="contents">
            {/* <!-- 본문 --> */}

            <div className="top_tit">
              <h1 className="tit_1">알림마당</h1>
            </div>

            <h2 className="tit_2">공지사항</h2>

            {/* <!-- 검색조건 --> */}
            <div className="condition">
              <ul>
                <li className="third_1 L">
                  <label className="f_select" htmlFor="sel1">
                    <select
                      id="sel1"
                      title="조건"
                      value={searchCnd}
                      onChange={(e) => setSearchCnd(e.target.value)}
                    >
                      <option value="0">제목</option>
                      <option value="1">내용</option>
                      <option value="2">작성자</option>
                    </select>
                  </label>
                </li>
                <li className="third_2 R">
                  <span className="f_search w_500">
                    <input
                      type="text"
                      defaultValue={undefined}
                      value={searchWrd}
                      onChange={(e) => setSearchWrd(e.target.value)}
                    />
                    <button type="button" onClick={handleSearch}>
                      조회
                    </button>
                  </span>
                </li>

                {/* user.id 대신 권한그룹 세션값 사용 */}
                {canCreate && (
                  <li>
                    <Link
                      to={URL.NOTICE_CREATE}
                      state={{ bbsId }}
                      className="btn btn_blue_h46 pd35"
                    >
                      등록
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            {/* <!--// 검색조건 --> */}

            {/* 에러는 UX에 맞게 다듬을 수 있도록 최소 표시만 추가 */}
            {error && (
              <p className="no_data" role="alert">
                목록을 불러오지 못했습니다.
              </p>
            )}

            {/* <!-- 게시판목록 --> */}
            <div className="board_list BRD002">
              <div className="head">
                <span>번호</span>
                <span>제목</span>
                <span>작성자</span>
                <span>작성일</span>
                <span>조회수</span>
              </div>
              <div className="result">{renderedRows}</div>
            </div>
            {/* <!--// 게시판목록 --> */}

            <div className="board_bot">
              {/* <!-- Paging --> */}
              <EgovPaging
                pagination={paginationInfo}
                moveToPage={handleMovePage}
              />
              {/* <!--/ Paging --> */}
            </div>

            {/* <!--// 본문 --> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EgovNoticeList;
