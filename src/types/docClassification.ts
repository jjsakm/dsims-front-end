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

export interface DocClassDetail {
  docClsfNo: string;
  docClsfDvcd: string;
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
  prvcFileHldPrst: Partial<DocClassSubDetail>;
}

export interface DocClassSubDetail {
  docClsfNo: string;
  prvcFileHldPrstNo: string;
  deptNm: string;
  fileNm: string;
  hldPrps: string;
  clctSttBssExpln: string;
  useDeptNm: string;
  prvcPrcsMthdExpln: string;
  hldPrdDfyrs: string;
  hldPrdMmCnt: string;
  infoMnbdPrvcMttr: string;
  sttyAgtPrvcMttr: string;
  rrnoClctYn: string;
  rrnoClctSttBssExpln: string;
  infoMnbdAgreYn: string;
  infoMnbdDsagClctSttBssExpln: string;
  sensInfoHldYn: string;
  sensInfoIndivAgreYn: string;
  sensInfoHldSttBssExpln: string;
  uiiHldYn: string;
  uiiIndivAgreYn: string;
  uiiHldSttBssExpln: string;
  prvcEvlTrgtYn: string;
  hndlPicNm: string;
  tdptySplrcpNm: string;
  tdptyPvsnBssExpln: string;
  tdptyPvsnMttr: string;
  prvcPrcsCnsgnBzentyNm: string;
  prvcCnsgnCtrtYn: string;
  prvcCnsgnFactIndctYn: string;
  prpsExclUtztnPvsnYn: string;
  prpsExclUtztnPvsnBssExpln: string;
}

export interface DocClassDetailFormState {
  values: Partial<Omit<DocClassDetail, "id">>;
  errors: Partial<Record<keyof DocClassDetailFormState["values"], string>>;
}
