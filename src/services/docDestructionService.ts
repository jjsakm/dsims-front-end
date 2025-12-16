import { DUMMY_DOC_DESTRUCTION_DATA } from "@/data/docDestructionDummyData";
import type { DocDestruction } from "@/types/docDestruction";

export async function getDocDestructionList(): Promise<{
  items: DocDestruction[];
  itemCount: number;
}> {
  const rows = DUMMY_DOC_DESTRUCTION_DATA;

  return {
    items: rows,
    itemCount: rows.length,
  };
}

export async function getDocDestructionData(
  docId: number
): Promise<DocDestruction> {
  const rows = DUMMY_DOC_DESTRUCTION_DATA;
  const data = rows.find((data) => data.id === docId);

  if (!data) {
    throw new Error("data not found");
  }
  return data;
}

export async function createDocDestructionData(data: Omit<DocDestruction, "id">) {
  const newEmployee = {
    ...data,
  };

  // TODO: create logic here
  console.log("Created DocDestruction data:", newEmployee);

  return newEmployee;
}

export async function updateDocDestructionData(
  docId: number,
  data: Partial<Omit<DocDestruction, "id">>
) {
  console.log("Updating DocDestruction data:", docId, data);
  const updatedData = data;

  // TODO: update logic here
  if (data) {
    console.log("수정 완료:", docId, updatedData);
  } else {
    throw new Error("수정할 데이터가 없습니다.");
  }

  return updatedData;
}
