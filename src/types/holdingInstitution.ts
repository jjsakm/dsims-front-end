export interface HoldingInstitutionSearchState {
  values: Partial<Omit<SearchValues, "id">>;
}

export interface SearchValues {
  collectionStartDate: string;
  collectionEndDate: string;
  closeStartDate: string;
  closeEndDate: string;
  largeCategory: string;
  midCategory: string;
  smallCategory: string;
  retentionPeriod: string;
  agreeYn: boolean;
  useYn: "" | "Y" | "N";
  docNumber: string;
  docTitle: string;
}

export interface HoldingInstitution {
  id: number; // 번호
  docCategory: string; // 문서분류
  docNo: string; // 문서번호
  docTitle: string; // 문서제목
  consentYn: string; // 정보주체 동의여부
  collectDate: string; // 수집시작일
  prevRetentionPeriod: string; // 변경 전 보유기간
  prevEndDate: string; // 변경 전 종료일자
  newRetentionPeriod: string; // 변경 후 보유기간
  newEndDate: string; // 변경 후 종료일자
  registrantDept: string; // 등록자(부서)
  regDate: string; // 등록일자
}
