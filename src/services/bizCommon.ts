import type { SelectItem } from "@/types/common";
import axios from "axios";

export async function getDocClsfList(docClsfNo: string): Promise<SelectItem[]> {
  const res = await axios.get("/api/dbtest");

  return res.data;
}
