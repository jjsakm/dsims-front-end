import { DUMMY_HOLDING_INSTITUTION_DATA } from "@/data/holdingInstitutionDummyData";
import type { HoldingInstitution } from "@/types/holdingInstitution";

export async function getHoldingInstitutionList(): Promise<{
  items: HoldingInstitution[];
  itemCount: number;
}> {
  const rows = DUMMY_HOLDING_INSTITUTION_DATA;

  return {
    items: rows,
    itemCount: rows.length,
  };
}
