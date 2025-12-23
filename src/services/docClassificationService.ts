import type {
  DocClassDetail,
  DocClassification,
  SearchValues,
} from "@/types/docClassification";
import axios from "axios";

export async function getDocClassificationList(
  values?: Partial<SearchValues>
): Promise<{
  items: DocClassification[];
  itemCount: number;
}> {
  const res = await axios.get("/api/documentclassification/search", {
    params: values,
  });

  return {
    items: res.data.result.list,
    itemCount: res.data.result.list.length,
  };
}

export async function getDocClassificationData(
  docClsfNo: string
): Promise<DocClassDetail> {
  const res = await axios.get(`/api/documentclassification/${docClsfNo}`);

  if (!res) {
    throw new Error("data not found");
  }
  return res.data.result.detail;
}

export async function createDocClassificationData(
  data: Omit<DocClassDetail, "docClsfNo">
) {
  const res = await axios.post("/api/documentclassification/add", data);

  if (!res) {
    throw new Error("data not found");
  }
}

export async function updateDocClassificationData(data: DocClassDetail) {
  const res = await axios.post("/api/documentclassification/update", data);

  if (!res) {
    throw new Error("data not found");
  }
}

export async function deleteDocClassificationData(docClsfNo: string) {
  const res = await axios.delete(
    `/api/documentclassification/${docClsfNo}/delete`
  );

  if (!res) {
    throw new Error("data not found");
  }
}

type ValidationResult = {
  issues: { message: string; path: string[] }[];
};

export function docClassificationvalidator(
  data: Partial<DocClassDetail>
): ValidationResult {
  let issues: ValidationResult["issues"] = [];

  if (data.docClsfSeCd === "L" && isEmpty(data.docLclsfNm)) {
    issues = [...issues, { message: "필수 입니다.", path: ["docLclsfNm"] }];
  }

  if (data.docClsfSeCd === "M" && isEmpty(data.docLclsfNo)) {
    issues = [...issues, { message: "필수 입니다.", path: ["docLclsfNo"] }];
  }

  if (data.docClsfSeCd === "M" && isEmpty(data.docMclsfNm)) {
    issues = [...issues, { message: "필수 입니다.", path: ["docMclsfNm"] }];
  }

  if (data.docClsfSeCd === "S" && isEmpty(data.docLclsfNo)) {
    issues = [...issues, { message: "필수 입니다.", path: ["docLclsfNo"] }];
  }

  if (data.docClsfSeCd === "S" && isEmpty(data.docMclsfNo)) {
    issues = [...issues, { message: "필수 입니다.", path: ["docMclsfNo"] }];
  }

  if (data.docClsfSeCd === "S" && isEmpty(data.docSclsfNm)) {
    issues = [...issues, { message: "필수 입니다.", path: ["docSclsfNm"] }];
  }

  // ▼ 여기부터 하위(개인정보 상세) 필수 체크
  if (data.prvcInclYn === "Y" && data.prvcFileHldPrst) {
    const sub = data.prvcFileHldPrst;
    // 공통 필수: 예외를 뺀 모든 서브필드
    Object.keys(sub).forEach((field) => {
      if (
        field === "docClsfNo" ||
        field === "prvcFileHldPrstNo" ||
        field === "hldPrdMmCnt" ||
        field === "infoMnbdDsagClctSttBssExpln" ||
        field === "rrnoClctYn" ||
        field === "sensInfoHldYn" ||
        field === "sensInfoIndivAgreYn" ||
        field === "uiiHldYn" ||
        field === "uiiIndivAgreYn" ||
        field === "prvcEvlTrgtYn" ||
        field === "prvcCnsgnCtrtYn" ||
        field === "prvcCnsgnFactIndctYn" ||
        field === "prpsExclUtztnPvsnYn"
      ) {
        return;
      }
      if (isEmpty(sub[field])) {
        issues = [
          ...issues,
          { message: "필수 입니다.", path: [field as string] },
        ];
      }
    });

    // 예: 동의가 아닌 경우에만 법령근거 필수
    if (
      sub.infoMnbdAgreYn !== "Y" &&
      isEmpty(sub.infoMnbdDsagClctSttBssExpln)
    ) {
      issues = [
        ...issues,
        {
          message: "필수 입니다.",
          path: ["infoMnbdDsagClctSttBssExpln"],
        },
      ];
    }

    // 예: 보유기간이 직접입력(0)일 때 월 필수
    if (String(sub.hldPrdDfyrs) === "0" && isEmpty(String(sub.hldPrdMmCnt))) {
      issues = [...issues, { message: "필수 입니다.", path: ["hldPrdMmCnt"] }];
    }
  }
  return { issues };
}
