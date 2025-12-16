export interface SearchValues {
  largeCategory: string;
  midCategory: string;
  smallCategory: string;
  docNum: string;
  docTitle: string;
}

export interface DigitalDocSearchState {
  values: Partial<Omit<SearchValues, "id">>;
}

export interface DigitalDoc {
  id: number; // 번호 (목록용 PK)

  // 문서분류
  docCategory: string; // 문서분류 전체 라벨 (예: "피해구제 > 접수서류 > 사망 신청")
  largeCategory: string; // 대분류
  midCategory: string; // 중분류
  smallCategory: string; // 소분류

  // 기본 문서 정보
  docNo: string; // 문서번호
  docTitle: string; // 문서제목

  // 수집/보존 정보
  collectDate: string; // 수집일자 (YYYY-MM-DD)
  collectDateLabel: string; // 수집일자(보존연한) 라벨 (예: "2025-10-01 (5년)")
  retentionType: string; // 보존연한 타입 (직접입력 / 6개월 / 1년 / 5년 등 코드값)
  retentionPeriod: string; // 보존연한 기간 값 (개월 수 등)
  endDate: string; // 종료일자 (YYYY-MM-DD)

  // 기타 정보
  remark: string; // 비고
  hasPersonalInfo: string; // 개인정보 ("포함" / "미포함")

  // 업로드 정보
  uploadType: "document" | "file"; // 업로드 유형 (문서 / 파일)
  fileName: string; // 업로드 파일명 (예: "전자문서파일.pdf")
  docType: string; // 종류 (문서 / 파일 등, 목록에서 사용)

  // 등록자 정보
  registrantDept: string; // 등록자(부서)
  regDate: string; // 등록일자
}

export interface DigitalDocFormState {
  values: Partial<Omit<DigitalDoc, "id">>;
  errors: Partial<Record<keyof DigitalDocFormState["values"], string>>;
}
