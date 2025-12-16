import { DUMMY_DOC_CLASSIFICATION_DATA } from "@/data/docClassificationDummyData";
import type { DocClassification } from "@/types/docClassification";

export async function getDocClassificationList(): Promise<{
  items: DocClassification[];
  itemCount: number;
}> {
  const rows = DUMMY_DOC_CLASSIFICATION_DATA;

  return {
    items: rows,
    itemCount: rows.length,
  };
}

export async function getDocClassificationData(
  docClassificationId: number
): Promise<DocClassification> {
  const rows = DUMMY_DOC_CLASSIFICATION_DATA;
  const data = rows.find((data) => data.id === docClassificationId);

  if (!data) {
    throw new Error("data not found");
  }
  return data;
}

export async function createDocClassificationData(
  data: Omit<DocClassification, "id">
) {
  const newEmployee = {
    ...data,
  };

  // TODO: create logic here
  console.log("Created docClassification data:", newEmployee);

  return newEmployee;
}

export async function updateDocClassificationData(
  docClassificationId: number,
  data: Partial<Omit<DocClassification, "id">>
) {
  console.log("Updating docClassification data:", docClassificationId, data);
  const updatedData = data;

  // TODO: update logic here
  if (data) {
    console.log("수정 완료:", docClassificationId, updatedData);
  } else {
    throw new Error("수정할 데이터가 없습니다.");
  }

  return updatedData;
}

export async function deleteDocClassificationData(docClassificationId: number) {
  const rows = DUMMY_DOC_CLASSIFICATION_DATA;
  const data = rows.find((data) => data.id === docClassificationId);
  // TODO: delete logic here
  console.log("Deleted docClassification data:", data?.id);
}

type ValidationResult = {
  issues: { message: string; path: (keyof DocClassification)[] }[];
};

export function docClassificationvalidator(data: Partial<DocClassification>): ValidationResult {
  let issues: ValidationResult["issues"] = [];

  if (!data.largeCategory) {
    issues = [...issues, { message: "필수 입니다.", path: ["largeCategory"] }];
  }

  if (!data.midCategory) {
    issues = [...issues, { message: "필수 입니다.", path: ["midCategory"] }];
  }

  if (data.hasPersonalInfo) {
    issues = [
      ...issues,
      { message: "필수 입니다.", path: ["departmentName"] },
      { message: "필수 입니다.", path: ["fileName"] },
    ];
  }
  // TODO: add more validation rules as needed
  return { issues };
}
