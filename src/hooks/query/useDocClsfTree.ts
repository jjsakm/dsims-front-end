// hooks/query/useDocClsfTree.ts
import { useAppQuery } from "@/hooks/query/useAppQuery";
import { getLclsfList, getDocClsfList } from "@/services/bizCommon";
import type { DocClsf } from "@/types/docClassification";

export function useLclsfListLive() {
  return useAppQuery<DocClsf[]>(["docClsf", "L"], () => getLclsfList(), {
    staleTime: 1000 * 5, // 5초 정도만 유효
    refetchOnWindowFocus: true,
  });
}

export function useDocClsfChildrenLive(docClsfNo: string | undefined) {
  return useAppQuery<DocClsf[]>(
    ["docClsfChildren", docClsfNo],
    () => getDocClsfList(docClsfNo!),
    {
      enabled: !!docClsfNo,
      staleTime: 1000 * 5, // 짧게
      refetchOnWindowFocus: true,
    }
  );
}
