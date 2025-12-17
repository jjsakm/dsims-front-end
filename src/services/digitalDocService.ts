import { DUMMY_DISITAL_DOC_DATA } from "@/data/digitalDocDummyData";
import type { DigitalDoc } from "@/types/digitalDoc";

export async function getDigitalDocList(): Promise<{
  items: DigitalDoc[];
  itemCount: number;
}> {
  const rows = DUMMY_DISITAL_DOC_DATA;

  return {
    items: rows,
    itemCount: rows.length,
  };
}

export async function getDigitalDocData(
  digitalDocId: number
): Promise<DigitalDoc> {
  const rows = DUMMY_DISITAL_DOC_DATA;
  const data = rows.find((data) => data.id === digitalDocId);

  if (!data) {
    throw new Error("data not found");
  }
  return data;
}

export async function createDigitalDocData(data: Omit<DigitalDoc, "id">) {
  const newEmployee = {
    ...data,
  };

  // TODO: create logic here
  console.log("Created digitalDoc data:", newEmployee);

  return newEmployee;
}

export async function updateDigitalDocData(
  digitalDocId: number,
  data: Partial<Omit<DigitalDoc, "id">>
) {
  console.log("Updating digitalDoc data:", digitalDocId, data);
  const updatedData = data;

  // TODO: update logic here
  if (data) {
    console.log("수정 완료:", digitalDocId, updatedData);
  } else {
    throw new Error("수정할 데이터가 없습니다.");
  }

  return updatedData;
}

export async function deleteDigitalDocData(digitalDocId: number) {
  const rows = DUMMY_DISITAL_DOC_DATA;
  const data = rows.find((data) => data.id === digitalDocId);
  // TODO: delete logic here
  console.log("Deleted digitalDoc data:", data?.id);
}

type ValidationResult = {
  issues: { message: string; path: (keyof DigitalDoc)[] }[];
};

export function digitalDocFormValidator(data: Partial<DigitalDoc>): ValidationResult {
  let issues: ValidationResult["issues"] = [];

  if (!data.docNo) {
    issues = [...issues, { message: "필수 입니다.", path: ["docNo"] }];
  }

  if (!data.docTitle) {
    issues = [...issues, { message: "필수 입니다.", path: ["docTitle"] }];
  }

  // TODO: add more validation rules as needed
  return { issues };
}
