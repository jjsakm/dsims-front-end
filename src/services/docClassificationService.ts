import type {
  DocClassDetail,
  DocClassification,
  SearchValues,
} from "@/types/docClassification";
import axios, { type AxiosRequestConfig } from "axios";

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

export async function deleteDocClassificationData(docClassificationId: string) {
  //const rows = DUMMY_DOC_CLASSIFICATION_DATA;
  //const data = rows.find((data) => data.docClsfNo === docClassificationId);
  // TODO: delete logic here
  //console.log("Deleted docClassification data:", data?.docClsfNo);
}

type ValidationResult = {
  issues: { message: string; path: (keyof DocClassification)[] }[];
};

export function docClassificationvalidator(
  data: Partial<DocClassDetail>
): ValidationResult {
  let issues: ValidationResult["issues"] = [];

  if (data.docClsfSeCd === "L" && !data.docLclsfNm) {
    issues = [...issues, { message: "필수 입니다.", path: ["docLclsfNm"] }];
  }

  if (data.docClsfSeCd === "M" && !data.docLclsfNo) {
    issues = [...issues, { message: "필수 입니다.", path: ["docLclsfNo"] }];
  }

  if (data.docClsfSeCd === "M" && !data.docMclsfNm) {
    issues = [...issues, { message: "필수 입니다.", path: ["docMclsfNm"] }];
  }

  if (data.docClsfSeCd === "S" && !data.docLclsfNo) {
    issues = [...issues, { message: "필수 입니다.", path: ["docLclsfNo"] }];
  }

  if (data.docClsfSeCd === "S" && !data.docMclsfNo) {
    issues = [...issues, { message: "필수 입니다.", path: ["docMclsfNo"] }];
  }

  if (data.docClsfSeCd === "S" && !data.docSclsfNm) {
    issues = [...issues, { message: "필수 입니다.", path: ["docMclsfNm"] }];
  }

  // if (data.prvcInclYn) {
  //   issues = [
  //     ...issues,
  //     { message: "필수 입니다.", path: ["departmentName"] },
  //     { message: "필수 입니다.", path: ["fileName"] },
  //   ];
  // }
  // TODO: add more validation rules as needed
  return { issues };
}
