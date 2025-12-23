import type { DocClsf } from "@/types/docClassification";
import axios from "axios";

export async function getLclsfList(): Promise<DocClsf[]> {
  const res = await axios.get("/api/documentclassification/toplevel");

  return res.data.result.list;
}

export async function getDocClsfList(docClsfNo: string): Promise<DocClsf[]> {
  const res = await axios.get(
    `/api/documentclassification/${docClsfNo}/children`
  );

  return res.data.result.list;
}
