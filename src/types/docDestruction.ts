export interface DocDestructionSearchState {
  values: Partial<Omit<SearchValues, "id">>;
}

export interface SearchValues {
  largeCategory: string;
  midCategory: string;
  smallCategory: string;
  hasPersonalInfo: boolean;
  destructionStartDate: string; 
  destructionEndDate: string;
}

export interface DocDestruction {
  id: number; // 번호
  docCategory: string; // 문서분류
  docNo: string; // 문서번호
  docTitle: string; // 문서제목
  hasPersonalInfo: string; // 개인정보 ("포함" / "미포함")
  collectDateLabel: string; // 수집일자(보존연한) 라벨
  endDate: string; // 종료일자
  docType: string; // 종류 (문서 / 파일 등)
  registrantDept: string; // 등록자(부서)
  regDate: string; // 등록일자
}
