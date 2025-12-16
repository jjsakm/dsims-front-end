import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  PaginationChangedEvent,
  RowClickedEvent,
  RowSelectionOptions,
  SelectionChangedEvent,
} from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import GlobalStyles from "@mui/material/GlobalStyles";

ModuleRegistry.registerModules([AllCommunityModule]);

type AgGridProps<TData> = {
  isLoading?: boolean;
  printOn?: boolean;
  enableRowSelection?: boolean;
  colDefs: ColDef<TData>[];
  rowData: TData[];
  onRowClick?: (row: TData) => void;
  onSelectionChange?: (rows: TData[]) => void;
};

export default function AgGridContainer<TData>(props: AgGridProps<TData>) {
  const {
    isLoading,
    printOn,
    enableRowSelection,
    colDefs,
    rowData,
    onRowClick,
    onSelectionChange,
  } = props;

  const defaultColDef = useMemo<ColDef<TData>>(
    () => ({
      flex: 1,
      resizable: false,
      sortable: false,
      filter: false,
    }),
    []
  );

  const rowSelection = useMemo<RowSelectionOptions | "single" | "multiple">(
    () => ({
      mode: "multiRow",
    }),
    []
  );

  const pageSize = 10;
  const gridApiRef = useRef<GridApi<TData> | null>(null);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);

  const handleGridReady = (event: GridReadyEvent<TData>) => {
    gridApiRef.current = event.api;
    const api = event.api;
    setTotalRows(api.paginationGetRowCount());
    setTotalPages(api.paginationGetTotalPages());
    setCurrentPage(api.paginationGetCurrentPage());
  };

  const handleRowClicked = (event: RowClickedEvent<TData>) => {
    if (!onRowClick) return;
    if (!event.data) return;
    onRowClick(event.data); // 클릭한 row 전체를 상위로 올려줌
  };

  const handleSelectionChanged = (event: SelectionChangedEvent<TData>) => {
    if (!onSelectionChange) return;
    const selectedRows = event.api.getSelectedRows() as TData[];
    onSelectionChange(selectedRows);
  };

  // Paging Start
  const handlePaginationChanged = (event: PaginationChangedEvent) => {
    const api = event.api;
    setTotalRows(api.paginationGetRowCount());
    setTotalPages(api.paginationGetTotalPages());
    setCurrentPage(api.paginationGetCurrentPage());
  };

  const handleGoToPage = (page: number) => {
    const api = gridApiRef.current;
    if (!api) return;
    api.paginationGoToPage(page);
  };

  const handlePrev = () => {
    const api = gridApiRef.current;
    if (!api) return;
    api.paginationGoToPreviousPage();
  };

  const handleNext = () => {
    const api = gridApiRef.current;
    if (!api) return;
    api.paginationGoToNextPage();
  };

  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index),
    [totalPages]
  );
  // Paging End

  const handlePrintCurrentPage = () => {
    const api = gridApiRef.current;
    if (!api) return;

    const eGridDiv = document.querySelector<HTMLElement>("#myGrid");

    // 현재 스타일 백업
    if (!eGridDiv) return;
    const prevWidth = eGridDiv.style.width;
    const prevHeight = eGridDiv.style.height;
    const prevDomLayout = api.getGridOption("domLayout");

    // 인쇄용 스타일 적용
    eGridDiv.style.width = "";
    eGridDiv.style.height = "";
    api.setGridOption("domLayout", "print");

    setTimeout(() => {
      window.print();

      // 원래 상태로 복원
      api.setGridOption("domLayout", prevDomLayout);
      eGridDiv.style.width = prevWidth;
      eGridDiv.style.height = prevHeight;
    }, 0);
  };

  useEffect(() => {
    console.log("printOn changed:", printOn);
    if (printOn) {
      handlePrintCurrentPage();
    }
  }, [printOn]);

  return (
    <div>
      {/* Aggrid Container만 출력하도록 스타일 추가 */}
      <GlobalStyles
        styles={{
          "@media print": {
            "body *": {
              visibility: "hidden",
            },
            "#myGrid, #myGrid *": {
              visibility: "visible",
            },
            "#myGrid": {
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
            },
          },
        }}
      />
      <div
        id="myGrid"
        className="ag-theme-alpine"
        style={{ width: "100%", height: 355, marginTop: 16 }}
      >
        <AgGridReact<TData>
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          loading={isLoading}
          rowHeight={32}
          headerHeight={32}
          rowSelection={enableRowSelection ? rowSelection : undefined}
          pagination={true}
          paginationPageSize={pageSize}
          suppressPaginationPanel={true} // 기본 하단 페이징 숨김
          onGridReady={handleGridReady}
          onPaginationChanged={handlePaginationChanged}
          onRowClicked={handleRowClicked}
          onSelectionChanged={handleSelectionChanged}
        />
      </div>

      {/* 커스텀 페이징 영역 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <div style={{ fontWeight: 500 }}>
          총 건수 : {totalRows.toLocaleString()} 건
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage <= 0}
            style={{
              border: "none",
              background: "transparent",
              cursor: currentPage <= 0 ? "default" : "pointer",
            }}
          >
            {"<"}
          </button>

          {pages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => handleGoToPage(page)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: currentPage === page ? "700" : "400",
                textDecoration: currentPage === page ? "underline" : "none",
              }}
            >
              {page + 1}
            </button>
          ))}

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
            style={{
              border: "none",
              background: "transparent",
              cursor: currentPage >= totalPages - 1 ? "default" : "pointer",
            }}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
