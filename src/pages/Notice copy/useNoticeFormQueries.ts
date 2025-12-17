import * as React from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NET_CODE from "@/constants/netCode";
import URL from "@/constants/url";
import useNotifications from "@/hooks/useNotifications";
import {
  createNoticeItem,
  deleteNoticeItem,
  getNoticeItem,
  modifyNoticeItem,
  getNoticeList,
} from "@/services/noticeService";
import type { NoticeListItem, NoticeSearchState } from "@/types/notice";

type UseNoticeFormQueriesParams = {
  bbsId: string;
  nttId?: string;
  hasId: boolean;
  listCondition?: NoticeSearchCondition;
};

type NoticeSearchCondition = {
  bbsId: string;
  pageIndex: number;
} & NoticeSearchState["values"];

type NoticeListResponse = {
  items: NoticeListItem[];
  paginationInfo: unknown;
};

export function useNoticeFormQueries({
  bbsId,
  nttId,
  hasId,
  listCondition,
}: UseNoticeFormQueriesParams) {
  const navigate = useNavigate();
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  // 목록 조회
  const {
    data: listData,
    isLoading: isListLoading,
    error: listError,
  } = useQuery<NoticeListResponse, Error>({
    queryKey: ["noticeList", listCondition],
    queryFn: () => getNoticeList(listCondition as NoticeSearchCondition),
    enabled: !!listCondition,
    placeholderData: (previousData) => previousData,
  });

  // 상세 조회
  const {
    data: detailData,
    isLoading,
    error,
  } = useQuery<NoticeListItem, Error>({
    queryKey: ["noticeDetail", bbsId, nttId],
    queryFn: () =>
      getNoticeItem({
        bbsId,
        nttId: nttId ?? "",
      }),
    enabled: hasId,
    placeholderData: (previousData) => previousData,
  });

  // 생성
  const createNoticeMutation = useMutation<unknown, Error, FormData>({
    mutationFn: (formData: FormData) => createNoticeItem(formData),
    onSuccess: () => {
      notifications.show("생성 완료.", {
        severity: "success",
        autoHideDuration: 3000,
      });

      // 공지사항 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["noticeList"] });

      // 목록 페이지로 이동
      navigate(URL.NOTICE_LIST);
    },
    onError: (error: Error) => {
      notifications.show(`데이터 생성 실패. 사유: ${error.message}`, {
        severity: "error",
        autoHideDuration: 3000,
      });
    },
  });

  const createData = React.useCallback(
    async (formData: FormData) => {
      await createNoticeMutation.mutateAsync(formData);
    },
    [createNoticeMutation]
  );

  // 수정
  const updateNoticeMutation = useMutation<unknown, Error, FormData>({
    mutationFn: (formData: FormData) =>
      modifyNoticeItem({
        nttId: nttId ?? "",
        formData,
      }),
    onSuccess: () => {
      notifications.show("수정 완료.", {
        severity: "success",
        autoHideDuration: 3000,
      });

      // 공지사항 목록 및 상세 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["noticeList"] });
      queryClient.invalidateQueries({
        queryKey: ["noticeDetail", bbsId, nttId],
      });

      // 목록 페이지로 이동
      // navigate(URL.NOTICE_LIST);
    },
    onError: (error: Error) => {
      notifications.show(`데이터 수정 실패. 사유: ${error.message}`, {
        severity: "error",
        autoHideDuration: 3000,
      });
    },
  });

  const updatedData = React.useCallback(
    async (formData: FormData) => {
      await updateNoticeMutation.mutateAsync(formData);
    },
    [updateNoticeMutation]
  );

  // 삭제
  const deleteNoticeMutation = useMutation({
    mutationFn: () =>
      deleteNoticeItem({
        bbsId,
        nttId,
      }),
    onSuccess: (resp) => {
      if (resp === NET_CODE.RCV_SUCCESS) {
        notifications.show("삭제되었습니다.", {
          severity: "success",
          autoHideDuration: 3000,
        });
      } else {
        notifications.show("삭제가 실패하였습니다.", {
          severity: "error",
          autoHideDuration: 3000,
        });
      }

      // 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["noticeList"] });

      // 목록 페이지로 이동
      navigate(URL.NOTICE_LIST);
    },
    onError: () => {
      notifications.show("삭제 요청 중 오류가 발생했습니다.", {
        severity: "error",
        autoHideDuration: 3000,
      });
    },
  });

  const deleteNotice = React.useCallback(async () => {
    if (!nttId) {
      notifications.show("잘못된 요청입니다.", {
        severity: "error",
        autoHideDuration: 3000,
      });
      return;
    }
    await deleteNoticeMutation.mutateAsync();
  }, [nttId, deleteNoticeMutation, notifications]);

  const isSubmitting =
    createNoticeMutation.isPending ||
    updateNoticeMutation.isPending ||
    deleteNoticeMutation.isPending;

  return {
    // 목록
    listData,
    isListLoading,
    listError,
    // 상세
    detailData,
    isLoading,
    error,
    // 생성/수정/삭제
    createData,
    updatedData,
    deleteNotice,
    isSubmitting,
  };
}
