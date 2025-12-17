import type { Notice, NoticeListItem } from "@/types/notice";
import * as EgovNet from "@/api/egovFetch";
import NET_CODE from "@/constants/netCode";
import CODE from "@/constants/code";

export type PaginationInfo = {
  currentPageNo: number;
  pageSize: number;
  totalRecordCount: number;
  recordCountPerPage: number;
};

import axios from "axios";
// import axios from "axios";

// // GET
// const res = await axios.get("/api/users", { params: { page: 1 } });

// // POST
// const res2 = await axios.post("/api/users", { name: "kim", age: 20 });

// // PUT / DELETE
// await axios.put(`/api/users/${id}`, { name: "lee" });
// await axios.delete(`/api/users/${id}`);

export async function getNoticeList(searchCondition): Promise<{
  items: NoticeListItem[];
  itemCount: number;
  paginationInfo: PaginationInfo;
}> {
  const res = await axios.get("/api/dbtest");
  console.log(res);
  const retrieveURL = "/board" + EgovNet.getQueryString(searchCondition);
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  };

  return new Promise((resolve, reject) => {
    EgovNet.requestFetch(
      retrieveURL,
      requestOptions,
      (resp) => {
        const rst: {
          items: NoticeListItem[];
          itemCount: number;
          paginationInfo: PaginationInfo;
        } = {
          items: resp.result.resultList,
          itemCount: resp.result.resultCnt,
          paginationInfo: resp.result.paginationInfo,
        };
        resolve(rst);
      },
      (resp) => {
        console.log("err response : ", resp);
        reject(resp);
      }
    );
  });
}

export async function getNoticeItem(searchCondition: {
  bbsId: string;
  nttId: string;
}): Promise<NoticeListItem> {
  const retrieveURL = `/board/${searchCondition.bbsId}/${searchCondition.nttId}`;
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  };

  return new Promise((resolve, reject) => {
    EgovNet.requestFetch(
      retrieveURL,
      requestOptions,
      (resp) => {
        resolve(resp.result.boardVO);
      },
      (resp) => {
        console.log("err response : ", resp);
        reject(resp);
      }
    );
  });
}

export async function createNoticeItem(
  formData: FormData
): Promise<NoticeListItem> {
  const retrieveDetailURL = "/board";
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: formData,
  };

  return new Promise((resolve, reject) => {
    EgovNet.requestFetch(
      retrieveDetailURL,
      requestOptions,
      (resp) => {
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          resolve(resp.result.resultList);
        }
      },
      (resp) => {
        console.log("err response : ", resp);
        reject(resp);
      }
    );
  });
}

export async function modifyNoticeItem({
  nttId,
  formData,
}: {
  nttId: string;
  formData: FormData;
}): Promise<NoticeListItem> {
  const retrieveDetailURL = `/board/${nttId}`;
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: formData,
  };

  return new Promise((resolve, reject) => {
    EgovNet.requestFetch(
      retrieveDetailURL,
      requestOptions,
      (resp) => {
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          resolve(resp.result.resultList);
        }
      },
      (resp) => {
        console.log("err response : ", resp);
        reject(resp);
      }
    );
  });
}

export async function deleteNoticeItem(searchCondition): Promise<NET_CODE> {
  const deleteBoardURL = `/board/${searchCondition.bbsId}/${searchCondition.nttId}`;

  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ atchFileId: searchCondition.atchFileId }),
  };

  return new Promise((resolve, reject) => {
    EgovNet.requestFetch(
      deleteBoardURL,
      requestOptions,
      (resp) => {
        if (Number(resp.resultCode) === Number(NET_CODE.RCV_SUCCESS)) {
          resolve(NET_CODE.RCV_SUCCESS);
        }
      },
      (resp) => {
        console.log("err response : ", resp.resultMessage);
        reject(NET_CODE.RCV_ERROR_DELETE);
      }
    );
  });
}

type ValidationResult = {
  issues: { message: string; path: (keyof Notice)[] }[];
};

export function noticeFormVaildator(data: Partial<Notice>): ValidationResult {
  let issues: ValidationResult["issues"] = [];

  if (!data.nttSj) {
    issues = [...issues, { message: "필수 입니다.", path: ["nttSj"] }];
  }
  if (!data.nttCn) {
    issues = [...issues, { message: "필수 입니다.", path: ["nttCn"] }];
  }
  return { issues };
}
