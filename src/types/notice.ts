export interface Notice {
  /** 첨부파일 ID (공백 문자열일 수도 있음) */
  atchFileId: string;

  /** 게시판 ID */
  bbsId: string;

  /** 게시판 이름 (예: '공지사항') */
  bbsNm: string;

  /** 첨부파일 가능 여부 (예: 'Y' / 'N' 또는 null) */
  fileAtchPosblAt: string | null;

  /** 최초 등록자 ID */
  frstRegisterId: string;

  /** 최초 등록자 이름 */
  frstRegisterNm: string;

  /** 최초 등록 일시 (문자열, 예: '2025-12-11') */
  frstRegisterPnttm: string;

  /** 조회수 */
  inqireCo: number;

  /** 게시글 내용 */
  nttCn: string;

  /** 게시글 ID */
  nttId: number;

  /** 게시글 제목 */
  nttSj: string;

  /** 부모 글 ID (답글 구조, 문자열로 내려옴, 예: "0") */
  parnts: string;

  /** 허용 가능한 첨부파일 개수 */
  posblAtchFileNumber: number;

  /** 허용 가능한 첨부파일 전체 용량 (단위는 API 스펙에 따름, 없으면 null) */
  posblAtchFileSize: number | null;

  /** 답글 가능 여부 */
  replyPosblAt: "Y" | "N";

  /** 게시판 사용 여부 (일부 API에서만 내려올 수 있으므로 optional) */
  bbsUseFlag?: "Y" | "N";

  /** 답글 깊이/레벨 (일부 API에서만 내려올 수 있으므로 optional) */
  replyLc?: string;
}

/**
 * 공지사항 목록 API 응답의 단일 아이템 타입
 * (API가 배열을 반환한다면 `Notice[]` 와 매칭하면 됩니다.)
 */
export type NoticeListItem = Notice;


export interface NoticeFormState {
  values: Partial<Omit<Notice, "id">>;
  errors: Partial<Record<keyof NoticeFormState["values"], string>>;
}

interface NoticeSearchValues {
  searchCnd: string;
  searchWrd: string;
}

export interface NoticeSearchState {
  values: Partial<Omit<NoticeSearchValues, "id">>;
}
