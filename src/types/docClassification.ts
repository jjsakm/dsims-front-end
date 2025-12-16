export interface SearchValues {
  largeCategory: string;
  midCategory: string;
  smallCategory: string;
  hasPersonalInfo: boolean;
  useYn: "" | "Y" | "N";
  keyword: string;
}

export interface DocClassificationSearchState {
  values: Partial<Omit<SearchValues, "id">>;
}

export interface DocClassification {
  id: number; // 번호
  largeCategory: string; // 대분류
  largeCategoryMeta?: string; // 대분류 메타정보
  midCategory: string; // 중분류
  midCategoryMeta?: string; // 중분류 메타정보
  smallCategory: string; // 소분류
  smallCategoryMeta?: string; // 소분류 메타정보
  hasPersonalInfo: boolean; // 개인정보 포함유무
  useYn: "" | "Y" | "N"; // 사용유무
  registrant: string; // 등록자
  regDate: string; // 등록일자

  // 개인정보 포함에 체크시에만 입력되는 필드
  departmentName?: string; // 부서명
  fileName?: string; // 파일명
}

export interface DocClassificationFormState {
  values: Partial<Omit<DocClassification, "id">>;
  errors: Partial<Record<keyof DocClassificationFormState["values"], string>>;
}
