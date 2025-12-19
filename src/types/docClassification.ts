export interface SearchValues {
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  prvcInclYn: string;
  useEn: string;
  docClsfNm: string;
}

export interface DocClsf {
  docClsfNo: string;
  docClsfSeCd: string;
  docClsfNm: string;
  upDocClsfNo: string;
  prvcInclYn: string;
  useEn: string;
  regYmd: string;
  rgtrId: string;
  mdfcnYmd: string;
  mdfrId: string;
}

export interface DocClassificationSearchState {
  values: SearchValues;
}

export interface DocClassification {
  docClsfNo: string;
  docClsfSeCd: string;
  docClsfNm: string;
  upDocClsfNo: string;
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  docLclsfNm: string;
  docMclsfNm: string;
  docSclsfNm: string;
  prvcInclYn: string;
  useEn: string;
  regYmd: string;
  rgtrId: string;
  mdfcnYmd: string;
  mdfrId: string;
}

export interface DocClassificationFormState {
  values: Partial<Omit<DocClassification, "id">>;
  errors: Partial<Record<keyof DocClassificationFormState["values"], string>>;
}
