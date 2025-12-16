export const listDefs = [
    {
      headerName: "번호",
      field: "id",
      width: 90,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "대분류",
      field: "largeCategory",
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "중분류",
      field: "midCategory",
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "소분류",
      field: "smallCategory",
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "개인정보 포함유무",
      field: "hasPersonalInfo",
      cellStyle: (params: any) => {
        const isIncluded = params.value === "포함";
        return {
          textAlign: "center",
          color: isIncluded ? "red" : "",
          fontWeight: isIncluded ? "600" : "400",
        };
      },
    },
    {
      headerName: "사용유무",
      field: "useYn",
      cellStyle: (params: any) => {
        const isNotUsed = params.value === "사용안함";
        return {
          textAlign: "center",
          color: isNotUsed ? "#0066cc" : "",
          fontWeight: isNotUsed ? "600" : "400",
        };
      },
    },
    {
      headerName: "등록자",
      field: "registrant",
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "등록일자",
      field: "regDate",
      cellStyle: { textAlign: "center" },
    },
  ]